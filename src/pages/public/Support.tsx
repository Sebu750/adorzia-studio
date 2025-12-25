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
  CreditCard,
  Box,
  Crown,
  Users,
  Wallet,
  Award,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import { DESIGNER_FAQS, FAQ_CATEGORIES, FAQCategory } from "@/lib/founder-tiers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const quickLinks = [
  { title: "Getting Started Guide", href: "#", icon: BookOpen },
  { title: "Publishing Guidelines", href: "#", icon: FileText },
  { title: "Community Discord", href: "#", icon: MessageCircle },
];

const categoryIcons: Record<FAQCategory, React.ComponentType<{ className?: string }>> = {
  general: HelpCircle,
  styleboxes: Box,
  'ip-ranks': Crown,
  teaming: Users,
  financials: Wallet,
  founders: Award,
};

// Group FAQs by category
const groupedFaqs = DESIGNER_FAQS.reduce((acc, faq) => {
  if (!acc[faq.category]) {
    acc[faq.category] = [];
  }
  acc[faq.category].push(faq);
  return acc;
}, {} as Record<FAQCategory, typeof DESIGNER_FAQS>);

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
              The Designer's FAQ
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to know about IP, profit sharing, teaming, and the Adorzia platform.
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

      {/* Comprehensive FAQ by Category */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Comprehensive FAQ</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Frequently Asked Questions
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Addressing the hard questions about IP, payouts, and our unique model.
            </p>
          </div>

          <div className="space-y-12">
            {(Object.keys(groupedFaqs) as FAQCategory[]).map((category, categoryIndex) => {
              const CategoryIcon = categoryIcons[category];
              const categoryInfo = FAQ_CATEGORIES[category];
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">{categoryInfo.label}</h3>
                  </div>

                  {/* Category FAQs */}
                  <Accordion type="single" collapsible className="space-y-3">
                    {groupedFaqs[category].map((faq, i) => (
                      <AccordionItem 
                        key={i} 
                        value={`${category}-${i}`} 
                        className="bg-background rounded-xl border px-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 whitespace-pre-line">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Contact Us</Badge>
            <AnimatedHeading className="font-display text-3xl font-bold mb-4 tracking-tight">
              Have More Questions?
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Send us a message and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* Direct Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Email us directly</p>
                    <a href="mailto:hello@adorzia.com" className="text-primary hover:underline text-lg">
                      hello@adorzia.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>24hr response</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

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