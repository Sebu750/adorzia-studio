import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { profile } = useProfile();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "U";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          {/* Enhanced Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 hover:bg-secondary transition-all duration-200 rounded-lg" />
              
              {/* Search Input - Enhanced */}
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
                <Input
                  placeholder="Search styleboxes, projects..."
                  className="w-72 lg:w-80 pl-10 bg-secondary/50 border-transparent focus-visible:border-border focus-visible:bg-background transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mobile Search */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 md:hidden hover:bg-secondary transition-all duration-200 rounded-lg"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Theme Toggle - Enhanced */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 hover:bg-secondary transition-all duration-200 rounded-lg"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Notifications - Enhanced */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 hover:bg-secondary transition-all duration-200 rounded-lg"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Avatar Dropdown - Enhanced */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-9 gap-2 px-2 hover:bg-secondary transition-all duration-200 rounded-lg"
                  >
                    <Avatar className="h-7 w-7 ring-2 ring-border/50">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">
                        {getInitials(profile?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-sm font-medium truncate max-w-24">
                      {profile?.name || user?.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border-border shadow-lg z-50">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{profile?.name || "Designer"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/subscription")} className="cursor-pointer">
                    Subscription
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
