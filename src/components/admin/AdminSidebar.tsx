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
  ExternalLink,
  BookOpen,
  GitBranch,
  ChevronRight,
  FileText
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
  { title: "Collections", url: "/admin/collections", icon: FolderOpen, badge: "New" },
  { title: "StyleBoxes", url: "/admin/styleboxes", icon: Box },
  { title: "Submissions", url: "/admin/stylebox-submissions", icon: FileText },
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
  
  // Filter system items based on role - superadmin-only items
  const filteredSystemItems = systemItems.filter(item => {
    // Security settings only visible to superadmin
    if (item.url === '/admin/security' && userRole !== 'superadmin') {
      return false;
    }
    return true;
  });

  const NavItem = ({ item }: { item: { title: string; url: string; icon: React.ElementType; badge?: string } }) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title}>
        <NavLink
          to={item.url}
          end={item.url === "/admin"}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
            "text-[hsl(var(--admin-sidebar-foreground)/0.85)]",
            "hover:bg-[hsl(var(--admin-sidebar-muted))] hover:text-[hsl(var(--admin-sidebar-foreground))]",
            "group"
          )}
          activeClassName="bg-[hsl(var(--admin-sidebar-accent))] text-[hsl(var(--admin-sidebar-accent-foreground))] font-medium border-l-2 border-[hsl(var(--admin-sidebar-foreground))]"
        >
          <item.icon className="h-5 w-5 shrink-0 text-[hsl(var(--admin-sidebar-foreground)/0.7)] group-hover:text-[hsl(var(--admin-sidebar-foreground))]" />
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
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold text-[hsl(var(--admin-sidebar-foreground)/0.5)] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
            {!isCollapsed && (
              <>
                <div className="h-px w-2 bg-[hsl(var(--admin-sidebar-foreground)/0.3)]" />
                Overview
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainNavItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="mx-3 my-5 border-t border-[hsl(var(--admin-sidebar-border))]" />

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold text-[hsl(var(--admin-sidebar-foreground)/0.5)] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
            {!isCollapsed && (
              <>
                <div className="h-px w-2 bg-[hsl(var(--admin-sidebar-foreground)/0.3)]" />
                Management
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {managementItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="mx-3 my-5 border-t border-[hsl(var(--admin-sidebar-border))]" />

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold text-[hsl(var(--admin-sidebar-foreground)/0.5)] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
            {!isCollapsed && (
              <>
                <div className="h-px w-2 bg-[hsl(var(--admin-sidebar-foreground)/0.3)]" />
                System
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {filteredSystemItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[hsl(var(--admin-sidebar-border))] p-4 space-y-4">
        {/* Switch to Studio */}
        {!isCollapsed && (
          <Link to="/">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 border-[hsl(var(--admin-sidebar-foreground)/0.25)] text-[hsl(var(--admin-sidebar-foreground))] bg-transparent hover:bg-[hsl(var(--admin-sidebar-foreground))] hover:text-[hsl(var(--admin-sidebar))] transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              Switch to Studio
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
        )}
        
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 p-2.5 rounded-lg bg-[hsl(var(--admin-sidebar-muted)/0.5)]",
          isCollapsed && "justify-center p-2"
        )}>
          <Avatar className="h-9 w-9 ring-2 ring-[hsl(var(--admin-sidebar-foreground)/0.25)]">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
            <AvatarFallback className="bg-[hsl(var(--admin-sidebar-foreground))] text-[hsl(var(--admin-sidebar))] text-xs font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-[hsl(var(--admin-sidebar-foreground))] truncate">
                Admin User
              </span>
              <Badge 
                variant="secondary"
                className={cn(
                  "text-[10px] px-1.5 py-0 w-fit font-semibold mt-0.5",
                  userRole === 'superadmin' 
                    ? "bg-[hsl(var(--admin-sidebar-foreground))] text-[hsl(var(--admin-sidebar))]" 
                    : "bg-[hsl(var(--admin-sidebar-muted))] text-[hsl(var(--admin-sidebar-foreground)/0.9)]"
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