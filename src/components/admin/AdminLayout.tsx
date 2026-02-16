import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Command,
  Sun,
  Moon,
  Users,
  Box,
  FolderOpen,
  Store,
  Briefcase
} from "lucide-react";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user, signOut, adminRole: userRole, loading, isAdmin } = useAdminAuth();
  const { theme, toggleTheme } = useAdminTheme();
  const [commandOpen, setCommandOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  // MVP: Only superadmin role
  const adminRole = userRole === 'superadmin' ? 'superadmin' : null;
  
  // Show loading while checking auth
  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-foreground"></div>
      </div>
    );
  }
  const handleSignOut = async () => {
    if (user) {
      await supabaseAdmin.from("admin_logs").insert({
        admin_id: user.id,
        action: "admin_logout",
        target_type: "session",
      });
    }
    await signOut();
    navigate("/admin/login");
  };

  const getInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "AD";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-admin-background">
        <AdminSidebar userRole={adminRole} />
        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-admin-border bg-admin-card/95 backdrop-blur-xl px-6 shadow-sm">
            <SidebarTrigger className="-ml-1 h-10 w-10 hover:bg-admin-muted transition-all duration-200 rounded-xl flex items-center justify-center" />
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-muted-foreground/70" />
              <Input
                placeholder="Search designers, styleboxes, publications..."
                className="pl-11 pr-16 h-11 bg-admin-muted/50 border-admin-border/60 hover:bg-admin-muted/70 hover:border-admin-border focus:bg-admin-card focus:ring-2 focus:ring-admin-foreground/10 focus:border-admin-foreground/30 transition-all duration-200 text-admin-foreground placeholder:text-admin-muted-foreground/60 rounded-xl cursor-pointer shadow-sm"
                onClick={() => setCommandOpen(true)}
                readOnly
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-lg border border-admin-border/60 bg-admin-card/80 px-2 font-mono text-[10px] font-medium text-admin-muted-foreground/70 shadow-sm">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-admin-muted text-admin-muted-foreground hover:text-admin-foreground transition-all duration-200 rounded-xl"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )}
                <span className="sr-only">Toggle admin theme</span>
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10 hover:bg-admin-muted text-admin-muted-foreground hover:text-admin-foreground transition-all duration-200 rounded-xl"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-success ring-2 ring-admin-card animate-pulse" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-3 px-2.5 h-11 hover:bg-admin-muted text-admin-foreground transition-all duration-200 rounded-xl border border-transparent hover:border-admin-border/50"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-admin-border/50">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-admin-foreground text-admin-background text-xs font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold leading-tight text-admin-foreground">
                        {user?.user_metadata?.name || "Admin"}
                      </span>
                      <span className="text-xs text-admin-muted-foreground/80 leading-tight">
                        Super Admin
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-admin-muted-foreground/70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-admin-card border-admin-border shadow-xl rounded-xl p-2" sideOffset={8}>
                  <DropdownMenuLabel className="pb-3 px-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-semibold text-admin-foreground text-sm">{user?.user_metadata?.name || "Admin User"}</span>
                      <span className="text-xs font-normal text-admin-muted-foreground/80">
                        {user?.email}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className="w-fit text-[10px] mt-1.5 bg-admin-muted text-admin-foreground font-semibold px-2 py-0.5 rounded-full"
                      >
                        Super Admin
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-admin-border/60 my-2" />
                  <DropdownMenuItem asChild className="focus:bg-admin-muted rounded-lg cursor-pointer py-2.5 px-2 text-admin-foreground">
                    <Link to="/admin/settings" className="flex items-center gap-3 text-sm">
                      <Settings className="h-4 w-4 text-admin-muted-foreground" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-admin-border/60 my-2" />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer py-2.5 px-2 text-sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-admin-background">
            {children}
          </main>

          {/* Command Palette */}
          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="Search designers, styleboxes, publications..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Quick Actions">
                <CommandItem onSelect={() => { navigate("/admin/designers"); setCommandOpen(false); }}>
                  <Users className="mr-2 h-4 w-4" />
                  View All Designers
                </CommandItem>
                <CommandItem onSelect={() => { navigate("/admin/styleboxes"); setCommandOpen(false); }}>
                  <Box className="mr-2 h-4 w-4" />
                  Manage StyleBoxes
                </CommandItem>
                <CommandItem onSelect={() => { navigate("/admin/publications"); setCommandOpen(false); }}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Review Publications
                </CommandItem>
                <CommandItem onSelect={() => { navigate("/admin/marketplace"); setCommandOpen(false); }}>
                  <Store className="mr-2 h-4 w-4" />
                  Marketplace Products
                </CommandItem>
                <CommandItem onSelect={() => { navigate("/admin/jobs"); setCommandOpen(false); }}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Job Portal
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
