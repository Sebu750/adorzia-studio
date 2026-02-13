import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, Package, Image as ImageIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { CartDrawer } from "./CartDrawer";

const navLinks = [
  { href: "/shop/designers", label: "Designers" },
  { href: "/shop/collections", label: "Collections" },
  { href: "/shop/products", label: "All Products" },
];

export function MarketplaceHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();
  const { cart, itemCount } = useCart();
  const searchRef = useRef<HTMLDivElement>(null);
  
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
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white">
        {/* Announcement Bar */}
        <div className="bg-black text-white text-center py-2 text-[11px] uppercase tracking-widest">
          <span className="font-medium">Free shipping on orders over $200</span>
          <span className="mx-2">•</span>
          <span>Independent designers worldwide</span>
        </div>

        <div className="container flex h-16 items-center justify-between">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2">
            <span className="text-[20px] font-bold tracking-[0.3em] text-black">ADORZIA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[12px] font-medium uppercase tracking-widest text-slate-700 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link to="/shop/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Account */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/shop/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <CartDrawer onClose={() => setIsCartOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Prominent Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-slate-100 bg-white">
            <div className="container py-6" ref={searchRef}>
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
                <Input
                  type="search"
                  placeholder="SEARCH DESIGNERS, PRODUCTS, COLLECTIONS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 text-[13px] uppercase tracking-wider border-slate-200"
                  autoFocus
                />
                
                {/* Search Results Dropdown */}
                {searchQuery.length >= 2 && (
                  <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-lg">
                    {isSearching ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <div className="divide-y">
                        {searchResults.map((result) => (
                          <Link
                            key={`${result.result_type}-${result.id}`}
                            to={result.url}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                          >
                            {result.image_url ? (
                              <img
                                src={result.image_url}
                                alt={result.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center">
                                {result.result_type === 'designer' && <Users className="h-6 w-6 text-slate-400" />}
                                {result.result_type === 'product' && <Package className="h-6 w-6 text-slate-400" />}
                                {result.result_type === 'collection' && <ImageIcon className="h-6 w-6 text-slate-400" />}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{result.title}</p>
                                <Badge variant="secondary" className="text-xs uppercase">
                                  {result.result_type}
                                </Badge>
                              </div>
                              {result.subtitle && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {result.subtitle}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </Card>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <form onSubmit={handleSearch} className="flex gap-2 pt-4 border-t border-border">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
