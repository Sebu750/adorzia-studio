import { 
  LayoutDashboard, 
  Box, 
  Briefcase, 
  FolderOpen, 
  Users, 
  BarChart3, 
  Bell, 
  User,
  Settings,
  LogOut,
  BookOpen,
  CreditCard,
  Palette,
  Loader2,
  ChevronRight
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Walkthroughs", url: "/walkthroughs", icon: BookOpen },
  { title: "Stylebox Library", url: "/styleboxes", icon: Box },
  { title: "My Collections", url: "/collections", icon: Palette },
  { title: "Portfolio", url: "/portfolio", icon: FolderOpen },
  { title: "Teams", url: "/teams", icon: Users },
  { title: "Job Portal", url: "/jobs", icon: Briefcase },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const secondaryNavItems = [
  { title: "Subscription", url: "/subscription", icon: CreditCard },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user, signOut, isSigningOut } = useAuth();
  const { tier } = useSubscription();
  const { profile } = useProfile();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out. See you soon!",
    });
    navigate("/");
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "U";
  };

  const displayName = profile?.name || user?.email?.split("@")[0] || "Designer";
  const isActive = (url: string) => location.pathname === url || location.pathname.startsWith(url + "/");

  const NavItem = ({ item, showBadge = false }: { item: typeof mainNavItems[0]; showBadge?: boolean }) => {
    const active = item.url === "/dashboard" 
      ? location.pathname === "/dashboard" 
      : isActive(item.url);
    
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all duration-200",
                "hover:bg-secondary hover:text-foreground group",
                active && "bg-secondary text-foreground font-medium sidebar-active-indicator"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-all duration-200",
                active && "text-primary",
                "group-hover:scale-105"
              )} />
              {!isCollapsed && (
                <>
                  <span className="text-sm flex-1">{item.title}</span>
                  {showBadge && unreadCount > 0 && (
                    <Badge variant="accent" size="sm" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                  {active && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </>
              )}
            </NavLink>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="bg-popover border-border shadow-lg">
              <span>{item.title}</span>
              {showBadge && unreadCount > 0 && (
                <Badge variant="accent" size="sm" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm">
            A
          </div>
          {!isCollapsed && (
            <span className="font-display text-xl font-bold tracking-tight animate-fade-in">
              Adorzia
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-3 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest px-3 mb-2">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item, index) => (
                <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 30}ms` }} className="animate-slide-in-from-left">
                  <SidebarMenuButton asChild>
                    <NavItem item={item} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="my-4 mx-3 border-t border-sidebar-border" />

        {/* Account Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest px-3 mb-2">
              Account
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryNavItems.map((item, index) => (
                <SidebarMenuItem key={item.title} style={{ animationDelay: `${(mainNavItems.length + index) * 30}ms` }} className="animate-slide-in-from-left">
                  <SidebarMenuButton asChild>
                    <NavItem item={item} showBadge={item.title === "Notifications"} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-3">
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-secondary/50 cursor-pointer",
          isCollapsed && "justify-center p-1"
        )}
        onClick={() => navigate("/profile")}
        role="button"
        tabIndex={0}
        >
          <Avatar className="h-9 w-9 ring-2 ring-border/30">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">
              {getInitials(profile?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">
                {displayName}
              </span>
              <SubscriptionBadge size="sm" />
            </div>
          )}
        </div>
        
        {/* Sign Out Button */}
        {!isCollapsed && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
            onClick={handleLogout}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </Button>
        )}
        
        {/* Collapsed Sign Out */}
        {isCollapsed && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-full h-9 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  onClick={handleLogout}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover border-border shadow-lg">
                Sign Out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
