import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  ],
};

export function MarketplaceFooter() {
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
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-editorial-caption text-gray-400 mb-4">Newsletter</p>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
                Join the world of<br />refined craftsmanship
              </h3>
            </div>
            <div className="lg:justify-self-end lg:max-w-md w-full">
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Be the first to discover new collections, exclusive designer pieces, and stories from the atelier.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="h-12 px-6 bg-white text-gray-900 hover:bg-gray-100"
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
                  <p className="text-white font-display text-xl">Thank you for subscribing</p>
                  <p className="text-gray-300 text-sm mt-2">Welcome to the Adorzia community</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link to="/shop" className="inline-block mb-6">
              <span className="font-display text-3xl font-medium text-white">Adorzia</span>
            </Link>
            <p className="text-sm text-gray-300 mb-6 max-w-xs leading-relaxed">
              A curated marketplace celebrating exceptional designers and their craft. Every piece tells a story of dedication and artistry.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="mailto:hello@adorzia.com" 
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Discover Links */}
          <div>
            <h4 className="text-editorial-caption text-gray-400 mb-6">Discover</h4>
            <ul className="space-y-4">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-300 link-underline-luxury"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-editorial-caption text-gray-400 mb-6">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-300 link-underline-luxury"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-editorial-caption text-gray-400 mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-300 link-underline-luxury"
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
      <div className="border-t border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Adorzia. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs">
              <Link to="/shop/policies#privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/shop/policies#terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/shop/policies#cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
