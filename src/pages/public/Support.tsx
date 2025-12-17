import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  HelpCircle, 
  Mail, 
  FileText, 
  MessageCircle,
  ChevronRight,
  Send,
  BookOpen,
  Shield,
  CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";

const faqs = [
  { 
    q: "How do I get started?", 
    a: "Create a free account and complete your first StyleBox challenge. Our onboarding guide will walk you through the process.",
    icon: BookOpen
  },
  { 
    q: "When do I get paid?", 
    a: "Payouts are processed monthly for all sales from the previous month. You can track earnings in your dashboard.",
    icon: CreditCard
  },
  { 
    q: "Can I cancel anytime?", 
    a: "Yes, you can cancel your subscription at any time with no penalties. Your portfolio and published designs remain active.",
    icon: Shield
  },
  { 
    q: "How does publishing work?", 
    a: "Submit your designs through Studio, our team reviews for marketplace fit, and approved designs go into production.",
    icon: FileText
  },
  { 
    q: "What subscription do I need?", 
    a: "Pro and Elite subscriptions unlock publishing rights. Basic is great for learning and building skills.",
    icon: HelpCircle
  },
  { 
    q: "How do I contact support?", 
    a: "Use the form below, email us directly, or join our community Discord for faster responses.",
    icon: MessageCircle
  },
];

const quickLinks = [
  { title: "Getting Started Guide", href: "#", icon: BookOpen },
  { title: "Publishing Guidelines", href: "#", icon: FileText },
  { title: "Community Discord", href: "#", icon: MessageCircle },
];

export default function Support() {
  return (
    <PublicLayout>
      {/* Hero with gradient */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div 
          className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">Support Center</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              How Can We Help?
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Find answers, get support, and connect with our team. We're here to help you succeed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {quickLinks.map((link, i) => (
              <motion.a
                key={link.title}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Card className="hover:shadow-md transition-all hover:border-primary/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <link.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{link.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQs</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Frequently Asked Questions
            </AnimatedHeading>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <TiltCard tiltAmount={5}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <faq.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{faq.q}</h3>
                          <p className="text-muted-foreground text-sm">{faq.a}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Contact Us</Badge>
            <AnimatedHeading className="font-display text-3xl font-bold mb-4 tracking-tight">
              Still Need Help?
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Send us a message and we'll get back to you within 24 hours.
            </p>
          </div>

          <TiltCard tiltAmount={3}>
            <Card>
              <CardContent className="p-8">
                <form className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <Input 
                      placeholder="Your email" 
                      type="email" 
                      className="h-12"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <Input 
                      placeholder="Subject" 
                      className="h-12"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Textarea 
                      placeholder="Your message" 
                      rows={5}
                      className="resize-none"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button className="w-full h-12 group">
                      Send Message
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </TiltCard>

          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-muted-foreground">
              Or email us directly at{' '}
              <a href="mailto:support@adorzia.com" className="text-primary hover:underline">
                support@adorzia.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policies */}
      <section id="policies" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedHeading className="font-display text-2xl font-bold mb-8 tracking-tight">
            Policies & Legal
          </AnimatedHeading>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { label: "Privacy Policy", icon: Shield },
              { label: "Terms of Service", icon: FileText },
              { label: "Refund Policy", icon: CreditCard },
            ].map((policy, i) => (
              <motion.div
                key={policy.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Button variant="outline" size="lg" className="group">
                  <policy.icon className="mr-2 h-4 w-4" />
                  {policy.label}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
