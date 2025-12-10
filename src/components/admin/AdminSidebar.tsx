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
  Sparkles
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
      className="border-r-0 bg-foreground"
    >
      <SidebarHeader className="p-4 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-sm">
            <Sparkles className="h-5 w-5 text-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-background tracking-tight">
                Adorzia
              </span>
              <span className="text-xs text-background/50 font-medium uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-[11px] font-semibold text-background/40 uppercase tracking-widest px-3 mb-1",
            isCollapsed && "sr-only"
          )}>
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-background/60 transition-all duration-200",
                        "hover:bg-background/10 hover:text-background"
                      )}
                      activeClassName="bg-background text-foreground font-medium shadow-sm"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && <Separator className="my-4 bg-background/10" />}

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-[11px] font-semibold text-background/40 uppercase tracking-widest px-3 mb-1",
            isCollapsed && "sr-only"
          )}>
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-background/60 transition-all duration-200",
                        "hover:bg-background/10 hover:text-background"
                      )}
                      activeClassName="bg-background text-foreground font-medium shadow-sm"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && <Separator className="my-4 bg-background/10" />}

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-[11px] font-semibold text-background/40 uppercase tracking-widest px-3 mb-1",
            isCollapsed && "sr-only"
          )}>
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-background/60 transition-all duration-200",
                        "hover:bg-background/10 hover:text-background"
                      )}
                      activeClassName="bg-background text-foreground font-medium shadow-sm"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {/* Switch to Studio */}
        {!isCollapsed && (
          <Link to="/">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 border-background/20 text-background bg-transparent hover:bg-background hover:text-foreground transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              Switch to Studio
            </Button>
          </Link>
        )}
        
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg bg-background/5",
          isCollapsed && "justify-center p-1.5"
        )}>
          <Avatar className="h-9 w-9 ring-2 ring-background/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-background text-foreground text-xs font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-background truncate">
                Admin User
              </span>
              <Badge 
                variant="secondary"
                className={cn(
                  "text-[10px] px-1.5 py-0 w-fit font-medium",
                  userRole === 'superadmin' 
                    ? "bg-background text-foreground" 
                    : "bg-background/20 text-background border-0"
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