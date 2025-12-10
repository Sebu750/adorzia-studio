import { 
  LayoutDashboard, 
  Users, 
  Box, 
  FolderOpen,
  Store,
  Crown,
  DollarSign,
  UsersRound,
  Briefcase,
  Bell,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  BookOpen,
  GitBranch
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
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

const mainNavItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Designers", url: "/admin/designers", icon: Users },
  { title: "StyleBoxes", url: "/admin/styleboxes", icon: Box },
  { title: "Walkthroughs", url: "/admin/walkthroughs", icon: BookOpen },
  { title: "Publications", url: "/admin/publications", icon: FolderOpen },
  { title: "Production Queues", url: "/admin/queues", icon: GitBranch },
  { title: "Marketplace", url: "/admin/marketplace", icon: Store },
];

const managementItems = [
  { title: "Rankings & Revenue", url: "/admin/rankings", icon: Crown },
  { title: "Payouts", url: "/admin/payouts", icon: DollarSign },
  { title: "Teams", url: "/admin/teams", icon: UsersRound },
  { title: "Job Portal", url: "/admin/jobs", icon: Briefcase },
];

const systemItems = [
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Security", url: "/admin/security", icon: Shield },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  userRole?: 'admin' | 'superadmin';
}

export function AdminSidebar({ userRole = 'admin' }: AdminSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r-0 bg-admin-coffee"
      style={{ 
        '--sidebar-background': 'var(--admin-coffee)',
        '--sidebar-foreground': 'var(--admin-wine-foreground)',
        '--sidebar-accent': 'var(--admin-chocolate)',
        '--sidebar-accent-foreground': 'var(--admin-wine-foreground)',
        '--sidebar-border': 'var(--admin-chocolate)',
        '--sidebar-primary': 'var(--admin-camel)',
      } as React.CSSProperties}
    >
      <SidebarHeader className="border-b border-admin-chocolate p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-wine">
            <Shield className="h-5 w-5 text-admin-wine-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold text-admin-wine-foreground">
                Adorzia
              </span>
              <span className="text-xs text-admin-apricot/70">Admin Portal</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-admin-apricot/50 uppercase tracking-wider px-3 mb-2">
            {!isCollapsed && "Overview"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-admin-apricot/70 transition-all duration-200",
                        "hover:bg-admin-chocolate hover:text-admin-wine-foreground"
                      )}
                      activeClassName="bg-admin-wine text-admin-wine-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-admin-apricot/50 uppercase tracking-wider px-3 mb-2">
            {!isCollapsed && "Management"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-admin-apricot/70 transition-all duration-200",
                        "hover:bg-admin-chocolate hover:text-admin-wine-foreground"
                      )}
                      activeClassName="bg-admin-wine text-admin-wine-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-admin-apricot/50 uppercase tracking-wider px-3 mb-2">
            {!isCollapsed && "System"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-admin-apricot/70 transition-all duration-200",
                        "hover:bg-admin-chocolate hover:text-admin-wine-foreground"
                      )}
                      activeClassName="bg-admin-wine text-admin-wine-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-admin-chocolate p-4 space-y-3">
        {/* Switch to Studio */}
        {!isCollapsed && (
          <Link to="/">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 border-admin-chocolate text-admin-apricot hover:bg-admin-chocolate hover:text-admin-wine-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              Switch to Studio
            </Button>
          </Link>
        )}
        
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="h-9 w-9 border-2 border-admin-camel/30">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
            <AvatarFallback className="bg-admin-wine text-admin-wine-foreground text-xs">
              AD
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-admin-wine-foreground truncate">
                Admin User
              </span>
              <Badge 
                className={cn(
                  "text-[10px] px-1.5 py-0 w-fit",
                  userRole === 'superadmin' 
                    ? "bg-admin-wine text-admin-wine-foreground" 
                    : "bg-admin-chocolate text-admin-apricot"
                )}
              >
                {userRole === 'superadmin' ? 'Superadmin' : 'Admin'}
              </Badge>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
