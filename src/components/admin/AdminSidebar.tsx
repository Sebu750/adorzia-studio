<<<<<<< HEAD
import React from "react";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
  BookOpen,
  GitBranch,
  FileText,
<<<<<<< HEAD
  LogOut,
  Star
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
=======
  LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { useAdminAuth } from "@/hooks/useAdminAuth";
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

<<<<<<< HEAD
// Professional high-contrast color themes
const themes = {
  light: {
    sidebar: "bg-white border-gray-200",
    header: "border-gray-200 bg-white/80 backdrop-blur-sm",
    text: {
      primary: "text-gray-900",
      secondary: "text-gray-600",
      tertiary: "text-gray-500",
      muted: "text-gray-400",
    },
    nav: {
      item: "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
      active: "bg-blue-50 text-blue-700 font-semibold border-r-4 border-blue-600",
      icon: {
        default: "text-gray-500",
        active: "text-blue-600",
        hover: "group-hover:text-gray-900",
      },
    },
    badge: {
      default: "bg-amber-100 text-amber-800 border-amber-200",
      super: "bg-purple-100 text-purple-800 border-purple-200",
    },
    footer: {
      userInfo: "bg-gray-50 border-gray-200",
      button: "border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200",
    },
    separator: "border-gray-200",
    groupLabel: "text-gray-500",
  },
  dark: {
    sidebar: "bg-gray-900 border-gray-800",
    header: "border-gray-800 bg-gray-900/80 backdrop-blur-sm",
    text: {
      primary: "text-white",
      secondary: "text-gray-300",
      tertiary: "text-gray-400",
      muted: "text-gray-600",
    },
    nav: {
      item: "text-gray-400 hover:text-white hover:bg-gray-800",
      active: "bg-gray-800 text-white font-semibold border-r-4 border-blue-500",
      icon: {
        default: "text-gray-500",
        active: "text-blue-400",
        hover: "group-hover:text-white",
      },
    },
    badge: {
      default: "bg-amber-900/50 text-amber-200 border-amber-800",
      super: "bg-purple-900/50 text-purple-200 border-purple-800",
    },
    footer: {
      userInfo: "bg-gray-800/50 border-gray-700",
      button: "border-gray-700 text-gray-300 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800",
    },
    separator: "border-gray-800",
    groupLabel: "text-gray-500",
  },
};

const mainNavItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Designers", url: "/admin/designers", icon: Users },
  { title: "Founding Program", url: "/admin/founding-submissions", icon: Star, badge: "Founders", badgeType: "default" },
=======
const mainNavItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Designers", url: "/admin/designers", icon: Users },
  { title: "Collections", url: "/admin/collections", icon: FolderOpen, badge: "New" },
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  { title: "StyleBoxes", url: "/admin/styleboxes", icon: Box },
  { title: "Submissions", url: "/admin/stylebox-submissions", icon: FileText },
  { title: "Walkthroughs", url: "/admin/walkthroughs", icon: BookOpen },
  { title: "Publications", url: "/admin/publications", icon: FolderOpen },
  { title: "Production Queues", url: "/admin/queues", icon: GitBranch },
  { title: "Marketplace", url: "/admin/marketplace", icon: Store },
  { title: "Articles", url: "/admin/articles", icon: FileText },
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
<<<<<<< HEAD
  userRole?: 'admin' | 'superadmin' | 'lead_curator';
  theme?: 'light' | 'dark'; // This should come from your theme context/provider
}

export function AdminSidebar({ userRole = 'admin', theme = 'dark' }: AdminSidebarProps) {
  const { state } = useSidebar();
  const { signOut, isSigningOut } = useAdminAuth();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  
  const currentTheme = themes[theme];

  const filteredSystemItems = systemItems.filter(item => {
=======
  userRole?: 'admin' | 'superadmin';
}

export function AdminSidebar({ userRole = 'admin' }: AdminSidebarProps) {
  const { state } = useSidebar();
  const { signOut, isSigningOut } = useAdminAuth();
  const isCollapsed = state === "collapsed";
  
  // Filter system items based on role - superadmin-only items
  const filteredSystemItems = systemItems.filter(item => {
    // Security settings only visible to superadmin
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    if (item.url === '/admin/security' && userRole !== 'superadmin') {
      return false;
    }
    return true;
  });

  const handleLogout = async () => {
    await signOut();
  };

<<<<<<< HEAD
  const isActive = (url: string) => {
    if (url === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(url);
  };

  const NavItem = ({ item }: { item: { title: string; url: string; icon: React.ElementType; badge?: string; badgeType?: string } }) => {
    const active = isActive(item.url);
    
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.title}>
          <NavLink
            to={item.url}
            end={item.url === "/admin"}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
              currentTheme.nav.item,
              active && currentTheme.nav.active,
              "group relative overflow-hidden"
            )}
          >
            <div className="relative flex items-center gap-3 w-full">
              <item.icon className={cn(
                "h-[18px] w-[18px] shrink-0 transition-all duration-200",
                active 
                  ? currentTheme.nav.icon.active 
                  : cn(currentTheme.nav.icon.default, currentTheme.nav.icon.hover)
              )} />
              {!isCollapsed && (
                <>
                  <span className="text-sm flex-1 font-medium">{item.title}</span>
                  {item.badge && (
                    <Badge className={cn(
                      "h-5 px-2 text-[10px] font-semibold shadow-sm border",
                      item.badgeType === 'super' ? currentTheme.badge.super : currentTheme.badge.default
                    )}>
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const Separator = () => (
    <div className={cn("mx-3 my-4 border-t", currentTheme.separator)} />
  );

  const GroupLabel = ({ children }: { children: React.ReactNode }) => (
    <SidebarGroupLabel className={cn(
      "text-[10px] font-bold uppercase tracking-widest px-3 mb-2 flex items-center gap-2",
      currentTheme.groupLabel
    )}>
      {!isCollapsed && (
        <>
          <div className={cn("h-px w-3", currentTheme.separator.replace('border', 'bg'))} />
          {children}
        </>
      )}
    </SidebarGroupLabel>
  );

  return (
    <Sidebar 
      collapsible="icon" 
      className={cn(
        "border-r transition-colors duration-300",
        currentTheme.sidebar
      )}
    >
      <SidebarHeader className={cn("border-b p-4", currentTheme.header)}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-black/10 dark:shadow-black/30">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className={cn(
                "font-display text-lg font-bold tracking-tight",
                currentTheme.text.primary
              )}>
                Adorzia
              </span>
              <span className={cn(
                "text-[11px] font-medium uppercase tracking-wider",
                currentTheme.text.muted
              )}>
                Admin Portal
              </span>
=======
  const NavItem = ({ item }: { item: { title: string; url: string; icon: React.ElementType; badge?: string } }) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title}>
        <NavLink
          to={item.url}
          end={item.url === "/admin"}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
            "text-[hsl(var(--admin-sidebar-foreground))]",
            "hover:bg-[hsl(var(--admin-sidebar-muted))] hover:text-[hsl(var(--admin-sidebar-foreground))]",
            "group"
          )}
          activeClassName="bg-[hsl(var(--admin-sidebar-accent))] text-[hsl(var(--admin-sidebar-accent-foreground))] font-medium border-l-2 border-[hsl(var(--admin-sidebar-foreground))]"
        >
          <item.icon className="h-5 w-5 shrink-0 text-[hsl(var(--admin-sidebar-foreground))] group-hover:text-[hsl(var(--admin-sidebar-foreground))]" />
          {!isCollapsed && (
            <>
              <span className="text-sm flex-1">{item.title}</span>
              {item.badge && (
                <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500 text-white border-0 font-semibold">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-[hsl(var(--admin-sidebar-border))] bg-[hsl(var(--admin-sidebar))] text-[hsl(var(--admin-sidebar-foreground))]">
      <SidebarHeader className="border-b border-[hsl(var(--admin-sidebar-border))] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--admin-sidebar-foreground))] shadow-md">
            <Shield className="h-5 w-5 text-[hsl(var(--admin-sidebar))]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-[hsl(var(--admin-sidebar-foreground))] tracking-tight">
                Adorzia
              </span>
              <span className="text-xs text-[hsl(var(--admin-sidebar-foreground)/0.6)] font-medium">Admin Portal</span>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
<<<<<<< HEAD
        <SidebarGroup>
          <GroupLabel>Overview</GroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
=======
        {/* Main Navigation */}
        <SidebarGroup>
        <SidebarGroupLabel className="text-[11px] font-bold text-[hsl(var(--admin-sidebar-foreground)/0.7)] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
            {!isCollapsed && (
              <>
                <div className="h-px w-2 bg-[hsl(var(--admin-sidebar-foreground)/0.5)]" />
                Overview
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              {mainNavItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

<<<<<<< HEAD
        <Separator />

        <SidebarGroup>
          <GroupLabel>Management</GroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
=======
        {/* Divider */}
        <div className="mx-3 my-5 border-t border-[hsl(var(--admin-sidebar-border))]" />

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold text-[hsl(var(--admin-sidebar-foreground)/0.7)] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
            {!isCollapsed && (
              <>
                <div className="h-px w-2 bg-[hsl(var(--admin-sidebar-foreground)/0.5)]" />
                Management
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              {managementItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

<<<<<<< HEAD
        <Separator />

        <SidebarGroup>
          <GroupLabel>System</GroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
=======
        {/* Divider */}
        <div className="mx-3 my-5 border-t border-[hsl(var(--admin-sidebar-border))]" />

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold text-[hsl(var(--admin-sidebar-foreground)/0.7)] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
            {!isCollapsed && (
              <>
                <div className="h-px w-2 bg-[hsl(var(--admin-sidebar-foreground)/0.5)]" />
                System
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              {filteredSystemItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

<<<<<<< HEAD
      <SidebarFooter className={cn("border-t p-4 space-y-3", currentTheme.header)}>
        <div className={cn(
          "flex items-center gap-3 p-2.5 rounded-xl border transition-colors duration-200",
          currentTheme.footer.userInfo
        )}>
          <Avatar className="h-9 w-9 ring-2 ring-white/20 dark:ring-gray-700">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-semibold">
=======
      <SidebarFooter className="border-t border-[hsl(var(--admin-sidebar-border))] p-4 space-y-4">
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 p-2.5 rounded-lg bg-[hsl(var(--admin-sidebar-muted)/0.5)]",
          isCollapsed && "justify-center p-2"
        )}>
          <Avatar className="h-9 w-9 ring-2 ring-[hsl(var(--admin-sidebar-foreground)/0.25)]">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
            <AvatarFallback className="bg-[hsl(var(--admin-sidebar-foreground))] text-[hsl(var(--admin-sidebar))] text-xs font-semibold">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              AD
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
<<<<<<< HEAD
              <span className={cn(
                "text-sm font-semibold truncate",
                currentTheme.text.primary
              )}>
                Admin User
              </span>
              <Badge 
                variant="outline"
                className={cn(
                  "text-[10px] px-2 py-0.5 w-fit font-semibold mt-0.5 rounded-full",
                  userRole === 'superadmin' ? currentTheme.badge.super : currentTheme.badge.default
                )}
              >
                {userRole === 'superadmin' ? 'Super Admin' : 'Admin'}
=======
              <span className="text-sm font-medium text-[hsl(var(--admin-sidebar-foreground))] truncate">
                Admin User
              </span>
              <Badge 
                variant="secondary"
                className={cn(
                  "text-[10px] px-1.5 py-0 w-fit font-semibold mt-0.5",
                  userRole === 'superadmin' 
                    ? "bg-[hsl(var(--admin-sidebar-foreground))] text-[hsl(var(--admin-sidebar))]" 
                    : "bg-[hsl(var(--admin-sidebar-muted))] text-[hsl(var(--admin-sidebar-foreground))]"
                )}
              >
                {userRole === 'superadmin' ? 'Superadmin' : 'Admin'}
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              </Badge>
            </div>
          )}
        </div>

<<<<<<< HEAD
=======
        {/* Sign Out Button */}
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          disabled={isSigningOut}
          className={cn(
<<<<<<< HEAD
            "w-full gap-2 h-10 rounded-xl transition-all duration-200",
            currentTheme.footer.button,
=======
            "w-full gap-2 border-[hsl(var(--admin-sidebar-foreground)/0.3)] text-[hsl(var(--admin-sidebar-foreground))] bg-transparent hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
            isCollapsed && "px-2"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && (isSigningOut ? "Signing out..." : "Sign Out")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}