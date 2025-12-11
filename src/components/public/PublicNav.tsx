import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  ChevronDown,
  Box,
  Users,
  Store,
  Trophy,
  Palette,
  DollarSign,
  Building2,
  HelpCircle
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

const navItems = [
  { 
    label: "Home", 
    href: "/" 
  },
  { 
    label: "About", 
    href: "/about" 
  },
  { 
    label: "StyleBoxes", 
    href: "/styleboxes-info",
    icon: Box
  },
  { 
    label: "Marketplace", 
    href: "/marketplace-preview",
    icon: Store
  },
  { 
    label: "Competitions", 
    href: "/competitions",
    icon: Trophy
  },
  { 
    label: "Studio", 
    href: "/studio-info",
    icon: Palette
  },
  { 
    label: "Pricing", 
    href: "/pricing",
    icon: DollarSign
  },
];

const moreItems = [
  { label: "Designer Profiles", href: "/designers", icon: Users },
  { label: "Monetization", href: "/monetization", icon: DollarSign },
  { label: "For Brands", href: "/brands", icon: Building2 },
  { label: "Support", href: "/support", icon: HelpCircle },
];

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

  const isActive = (href: string) => location.pathname === href;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight">Adorzia</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-3 py-2 text-sm transition-colors rounded-md",
                isActive(item.href) 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-foreground bg-transparent">
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-1 p-2">
                    {[...navItems.slice(5), ...moreItems].map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
                          >
                            {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
                            <span className="text-sm">{item.label}</span>
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

        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth" className="hidden sm:block">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-1 mt-8">
                {[...navItems, ...moreItems].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
