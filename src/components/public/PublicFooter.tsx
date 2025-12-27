import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SOCIAL_LINKS } from "@/lib/social-links";

const footerLinks = {
  Platform: [
    { label: "StyleBoxes", href: "/styleboxes-info" },
    { label: "Marketplace", href: "/marketplace-preview" },
    { label: "Competitions", href: "/competitions" },
    { label: "Studio", href: "/studio-info" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "For Brands", href: "/brands" },
    { label: "Monetization", href: "/monetization" },
    { label: "Designers", href: "/designers" },
  ],
  Resources: [
    { label: "Help Center", href: "/support" },
    { label: "FAQs", href: "/support#faq" },
    { label: "Contact", href: "/support#contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/support#policies" },
    { label: "Terms of Service", href: "/support#policies" },
    { label: "Cookie Policy", href: "/support#policies" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
  { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
  { icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
];

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PublicFooter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    
    // Client-side validation
    if (!trimmedEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: trimmedEmail, source: "footer" },
      });

      console.log("Newsletter response:", response);

      // Check for function invocation error
      if (response.error) {
        throw new Error(response.error.message || "Subscription failed");
      }

      // Check for API error in response data
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Subscribed!",
        description: response.data?.message || "Thank you for subscribing to our newsletter.",
      });
      
      setEmail("");
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      toast({
        title: "Subscription failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-foreground text-background">
      {/* CTA Section - Always show on public pages */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-background/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Start Your Journey</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Build Your Fashion Brand?
            </h3>
            <p className="text-background/70 mb-8 text-lg">
              Join thousands of designers learning, creating, and earning through Adorzia's integrated ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-background/20 text-background hover:bg-background/10 w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

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
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/40"
              />
              <Button 
                type="submit" 
                variant="secondary" 
                className="shrink-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
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
                  target="_blank"
                  rel="noopener noreferrer"
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
