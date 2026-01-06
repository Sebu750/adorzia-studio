import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  ],
};

export function MarketplaceFooter() {
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
          </div>
        </div>
      </div>

      {/* Main Footer */}
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
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
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
          </div>
        </div>
      </div>
    </footer>
  );
}
