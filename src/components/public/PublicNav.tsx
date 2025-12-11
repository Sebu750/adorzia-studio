import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  X,
  Box,
  Users,
  Store,
  Trophy,
  Palette,
  DollarSign,
  Building2,
  HelpCircle,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const primaryNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "StyleBoxes", href: "/styleboxes-info", icon: Box },
  { label: "Marketplace", href: "/marketplace-preview", icon: Store },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
];

const moreNavItems = [
  { 
    label: "Competitions", 
    href: "/competitions", 
    icon: Trophy,
    description: "Join design challenges and win prizes"
  },
  { 
    label: "Studio", 
    href: "/studio-info", 
    icon: Palette,
    description: "Professional design tools and resources"
  },
  { 
    label: "Designer Profiles", 
    href: "/designers", 
    icon: Users,
    description: "Discover talented designers"
  },
  { 
    label: "Monetization", 
    href: "/monetization", 
    icon: DollarSign,
    description: "Learn how to earn from your designs"
  },
  { 
    label: "For Brands", 
    href: "/brands", 
    icon: Building2,
    description: "Partner with emerging designers"
  },
  { 
    label: "Support", 
    href: "/support", 
    icon: HelpCircle,
    description: "Help center and FAQs"
  },
];

const allNavItems = [...primaryNavItems, ...moreNavItems];

export default function PublicNav() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight">Adorzia</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "relative px-3 py-2 text-sm transition-colors rounded-md",
                isActive(item.href) 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "text-sm bg-transparent",
                    moreNavItems.some(item => isActive(item.href))
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-1 p-3 md:grid-cols-2">
                    {moreNavItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group",
                              isActive(item.href) && "bg-secondary"
                            )}
                          >
                            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                              <item.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.label}</div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm" className="gap-2">
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth" className="hidden sm:block">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 hidden sm:block" />
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b">
                  <Link 
                    to="/" 
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-xl font-bold"
                  >
                    Adorzia
                  </Link>
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="px-3 mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Platform
                    </span>
                  </div>
                  {primaryNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 transition-colors",
                        isActive(item.href)
                          ? "bg-secondary text-foreground font-medium border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                      {isActive(item.href) && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </Link>
                  ))}

                  <div className="px-3 mb-2 mt-6">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Resources
                    </span>
                  </div>
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 transition-colors",
                        isActive(item.href)
                          ? "bg-secondary text-foreground font-medium border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Footer CTA */}
                <div className="p-4 border-t bg-secondary/30">
                  {user ? (
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gap-2">
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/auth" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full gap-2">
                          Get Started Free
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/auth" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
