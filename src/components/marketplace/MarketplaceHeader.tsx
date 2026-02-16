import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, Package, Image as ImageIcon, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useAuth } from "@/hooks/useAuth";
import { CartDrawer } from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/shop", label: "Home" },
  { href: "/shop/designers", label: "Designers" },
  { href: "/shop/collections", label: "Collections" },
  { href: "/shop/products", label: "Categories" },
  { href: "/shop/products?featured=true", label: "Limited Editions" },
];

export function MarketplaceHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isCustomer, isDesigner, isAdmin } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);

  // Determine account link based on user role
  const getAccountLink = () => {
    if (!user) return "/shop/auth";
    if (isCustomer) return "/shop/account";
    if (isDesigner || isAdmin) return "/dashboard";
    return "/shop/auth";
  };

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use global search hook
  const { data: searchResults, isLoading: isSearching } = useGlobalSearch(
    debouncedQuery,
    isSearchOpen && debouncedQuery.length >= 2
  );

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || isSearchOpen
            ? "bg-background/95 backdrop-blur-md shadow-soft"
            : "bg-transparent"
        }`}
      >
        {/* Main Header */}
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-transparent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Desktop Navigation - Left */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition-colors duration-300 link-underline-luxury"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo - Center */}
            <Link to="/shop" className="absolute left-1/2 -translate-x-1/2">
              <span className="font-display text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                Adorzia
              </span>
            </Link>

            {/* Actions - Right */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:bg-transparent"
              >
                <Search className="h-[18px] w-[18px] stroke-[1.5]" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" asChild className="hidden sm:flex hover:bg-transparent">
                <Link to="/shop/wishlist">
                  <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
                </Link>
              </Button>

              {/* Account */}
              <Button variant="ghost" size="icon" asChild className="hover:bg-transparent">
                <Link to={getAccountLink()}>
                  <User className="h-[18px] w-[18px] stroke-[1.5]" />
                </Link>
              </Button>

              {/* Cart */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-transparent">
                    <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
                    {itemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center text-[10px] font-medium bg-foreground text-background rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md p-0">
                  <CartDrawer onClose={() => setIsCartOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border/50"
              ref={searchRef}
            >
              <div className="max-w-3xl mx-auto px-6 py-12">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search designers, products, collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-16 text-lg border-0 border-b-2 border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </form>

                {/* Search Results */}
                {searchQuery.length >= 2 && (
                  <div className="mt-8">
                    {isSearching ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <div className="animate-pulse">Searching...</div>
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-editorial-caption text-muted-foreground mb-4">
                          Results
                        </p>
                        {searchResults.slice(0, 6).map((result) => (
                          <Link
                            key={`${result.result_type}-${result.id}`}
                            to={result.url}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            {result.image_url ? (
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                                <img
                                  src={result.image_url}
                                  alt={result.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                                {result.result_type === 'designer' && <Users className="h-5 w-5 text-muted-foreground" />}
                                {result.result_type === 'product' && <Package className="h-5 w-5 text-muted-foreground" />}
                                {result.result_type === 'collection' && <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate group-hover:text-foreground transition-colors">
                                {result.title}
                              </p>
                              {result.subtitle && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {result.subtitle}
                                </p>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                              {result.result_type}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Links */}
                {!searchQuery && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-editorial-caption text-muted-foreground mb-3">Popular</p>
                      <div className="space-y-2">
                        {['Evening Wear', 'Bridal', 'Couture', 'Pret'].map((item) => (
                          <Link
                            key={item}
                            to={`/shop/products?category=${item.toLowerCase().replace(' ', '-')}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="block text-sm text-foreground/70 hover:text-foreground transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-editorial-caption text-muted-foreground mb-3">Designers</p>
                      <div className="space-y-2">
                        {['New Arrivals', 'Trending', 'Featured', 'All'].map((item) => (
                          <Link
                            key={item}
                            to={item === 'All' ? '/shop/designers' : `/shop/designers?filter=${item.toLowerCase()}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="block text-sm text-foreground/70 hover:text-foreground transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t border-border"
            >
              <nav className="max-w-[1800px] mx-auto px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className="text-2xl font-display font-light text-foreground hover:text-foreground/70 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <form onSubmit={handleSearch} className="flex gap-2 pt-6 border-t border-border mt-4">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}
