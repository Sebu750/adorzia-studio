import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Instagram, Twitter, Facebook, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const footerLinks = {
  discover: [
    { href: "/shop/designers", label: "Designers" },
    { href: "/shop/collections", label: "Collections" },
    { href: "/shop/products?featured=true", label: "Limited Editions" },
    { href: "/shop/products", label: "All Products" },
  ],
  support: [
    { href: "/shop/policies#shipping", label: "Shipping & Delivery" },
    { href: "/shop/policies#returns", label: "Returns & Exchanges" },
    { href: "/shop/faq", label: "FAQ" },
    { href: "/support", label: "Contact" },
  ],
  company: [
    { href: "/about", label: "Our Story" },
    { href: "/studio-info", label: "For Designers" },
    { href: "/about#sustainability", label: "Sustainability" },
    { href: "/articles", label: "Journal" },
=======
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/shop", label: "All Products" },
    { href: "/shop/new-arrivals", label: "New Arrivals" },
    { href: "/shop/designers", label: "Designers" },
    { href: "/shop/collections", label: "Collections" },
  ],
  support: [
    { href: "/shop/shipping", label: "Shipping Info" },
    { href: "/shop/returns", label: "Returns & Exchanges" },
    { href: "/shop/faq", label: "FAQ" },
    { href: "/shop/contact", label: "Contact Us" },
  ],
  company: [
    { href: "/about", label: "About Adorzia" },
    { href: "/for-designers", label: "Become a Designer" },
    { href: "/shop/sustainability", label: "Sustainability" },
    { href: "/careers", label: "Careers" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  ],
};

export function MarketplaceFooter() {
<<<<<<< HEAD
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-luxury-charcoal text-gray-900">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-editorial-caption text-gray-600 mb-4">Newsletter</p>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                Join the world of<br />refined craftsmanship
              </h3>
            </div>
            <div className="lg:justify-self-end lg:max-w-md w-full">
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Be the first to discover new collections, exclusive designer pieces, and stories from the atelier.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-gray-400"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="h-12 px-6 bg-gray-900 text-white hover:bg-gray-800"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <p className="text-gray-900 font-display text-xl">Thank you for subscribing</p>
                  <p className="text-gray-600 text-sm mt-2">Welcome to the Adorzia community</p>
                </motion.div>
              )}
            </div>
=======
  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-2">Join Our Community</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe for exclusive access to new collections, designer spotlights, and special offers.
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </div>
        </div>
      </div>

      {/* Main Footer */}
<<<<<<< HEAD
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link to="/shop" className="inline-block mb-6">
              <span className="font-display text-3xl font-medium text-gray-900">Adorzia</span>
            </Link>
            <p className="text-sm text-gray-700 mb-6 max-w-xs leading-relaxed">
              A curated marketplace celebrating exceptional designers and their craft. Every piece tells a story of dedication and artistry.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="mailto:hello@adorzia.com" 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
=======
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/shop" className="inline-block mb-4">
              <span className="text-xl font-bold">ADORZIA</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Curated designer fashion, crafted with care. Every piece tells a story.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="mailto:hello@adorzia.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              </a>
            </div>
          </div>

<<<<<<< HEAD
          {/* Discover Links */}
          <div>
            <h4 className="text-editorial-caption text-gray-500 mb-6">Discover</h4>
            <ul className="space-y-4">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-300 link-underline-luxury"
=======
          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
<<<<<<< HEAD
            <h4 className="text-editorial-caption text-gray-500 mb-6">Support</h4>
            <ul className="space-y-4">
=======
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
<<<<<<< HEAD
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-300 link-underline-luxury"
=======
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
<<<<<<< HEAD
            <h4 className="text-editorial-caption text-gray-500 mb-6">Company</h4>
            <ul className="space-y-4">
=======
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
<<<<<<< HEAD
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-300 link-underline-luxury"
=======
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
<<<<<<< HEAD
      <div className="border-t border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Adorzia. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs">
              <Link to="/shop/policies#privacy" className="text-gray-500 hover:text-gray-700 transition-colors">
                Privacy
              </Link>
              <Link to="/shop/policies#terms" className="text-gray-500 hover:text-gray-700 transition-colors">
                Terms
              </Link>
              <Link to="/shop/policies#cookies" className="text-gray-500 hover:text-gray-700 transition-colors">
                Cookies
              </Link>
            </div>
=======
      <div className="border-t border-border">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Adorzia. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="/placeholder.svg" alt="Visa" className="h-6 opacity-50" />
            <img src="/placeholder.svg" alt="Mastercard" className="h-6 opacity-50" />
            <img src="/placeholder.svg" alt="Amex" className="h-6 opacity-50" />
            <img src="/placeholder.svg" alt="PayPal" className="h-6 opacity-50" />
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </div>
        </div>
      </div>
    </footer>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
