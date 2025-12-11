import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  ArrowRight
} from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "StyleBoxes", href: "/styleboxes-info" },
    { label: "Marketplace", href: "/marketplace-preview" },
    { label: "Competitions", href: "/competitions" },
    { label: "Studio", href: "/studio-info" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "For Brands", href: "/brands" },
    { label: "Careers", href: "/support" },
    { label: "Press", href: "/about#press" },
  ],
  Resources: [
    { label: "Help Center", href: "/support" },
    { label: "FAQs", href: "/support#faq" },
    { label: "Contact", href: "/support#contact" },
    { label: "Blog", href: "/support" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/support#policies" },
    { label: "Terms of Service", href: "/support#policies" },
    { label: "Cookie Policy", href: "/support#policies" },
    { label: "Refund Policy", href: "/support#policies" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">
                Join the Fashion Revolution
              </h3>
              <p className="text-background/60">
                Get updates on new StyleBoxes, competitions, and designer success stories.
              </p>
            </div>
            <div className="flex gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/40"
              />
              <Button variant="secondary" className="shrink-0">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold">Adorzia</span>
            </Link>
            <p className="text-sm text-background/60 mb-6 max-w-xs">
              The world's first fashion creation ecosystem. Built in Pakistan, engineered for global scale.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-sm">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-background/60 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} Adorzia. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-background/60">
                Made with ♥ in Pakistan
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
