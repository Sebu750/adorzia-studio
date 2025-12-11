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
  Palette
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
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
  const { user, signOut } = useAuth();
  const { tier } = useSubscription();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <span className="font-display text-xl font-bold tracking-tight">
              Adorzia
            </span>
          )}
          {isCollapsed && (
            <span className="font-display text-xl font-bold">A</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
            {!isCollapsed && "Main"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors",
                        "hover:bg-secondary hover:text-foreground",
                        isActive && "bg-secondary text-foreground font-medium"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
            {!isCollapsed && "Account"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors",
                        "hover:bg-secondary hover:text-foreground",
                        isActive && "bg-secondary text-foreground font-medium"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      {item.title === "Notifications" && !isCollapsed && (
                        <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                          3
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 space-y-3">
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" />
            <AvatarFallback className="bg-secondary text-foreground text-xs">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">
                {user?.email?.split("@")[0] || "Designer"}
              </span>
              <SubscriptionBadge size="sm" />
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
