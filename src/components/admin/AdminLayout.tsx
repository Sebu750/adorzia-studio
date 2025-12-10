import { useNavigate, Link } from "react-router-dom";
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
  Command
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'superadmin';
}

export function AdminLayout({ children, userRole = 'admin' }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    if (user) {
      await supabase.from("admin_logs").insert({
        admin_id: user.id,
        action: "logout",
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
      <div className="min-h-screen flex w-full bg-secondary/30">
        <AdminSidebar userRole={userRole} />
        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-6 shadow-sm">
            <SidebarTrigger className="-ml-2 hover:bg-secondary transition-colors" />
            
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search designers, styleboxes, publications..."
                className="pl-10 pr-12 h-10 bg-secondary/50 border-0 focus:bg-background focus:ring-2 focus:ring-foreground/10 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10 hover:bg-secondary transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-foreground ring-2 ring-background" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-3 px-3 h-10 hover:bg-secondary transition-colors"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-border">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium leading-tight">
                        {user?.user_metadata?.name || "Admin"}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight">
                        {userRole === 'superadmin' ? 'Superadmin' : 'Admin'}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg">
                  <DropdownMenuLabel className="pb-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-semibold">{user?.user_metadata?.name || "Admin User"}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {user?.email}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className="w-fit text-xs mt-1 bg-foreground/5"
                      >
                        {userRole === 'superadmin' ? 'Superadmin' : 'Admin'}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings" className="flex items-center gap-2.5 cursor-pointer py-2.5">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive flex items-center gap-2.5 cursor-pointer py-2.5 focus:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
