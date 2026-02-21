import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HelpCircle, Mail, FileText, MessageCircle, ChevronRight, Send, BookOpen, Shield, CreditCard, Box, Crown, Users, Wallet, Award, Clock, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import SEOHead from "@/components/public/SEOHead";
import { FAQSchema, COMMON_FAQS } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { DESIGNER_FAQS, FAQ_CATEGORIES, FAQCategory } from "@/lib/founder-tiers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const quickLinks = [
  { title: "Getting Started Guide", href: "#", icon: BookOpen },
  { title: "Publishing Guidelines", href: "#", icon: FileText },
  { title: "Community Discord", href: "#", icon: MessageCircle },
];

const categoryIcons: Record<FAQCategory, React.ComponentType<{ className?: string }>> = {
  general: HelpCircle, styleboxes: Box, 'ip-ranks': Crown, teaming: Users, financials: Wallet, founders: Award,
};

const groupedFaqs = DESIGNER_FAQS.reduce((acc, faq) => {
  if (!acc[faq.category]) acc[faq.category] = [];
  acc[faq.category].push(faq);
  return acc;
}, {} as Record<FAQCategory, typeof DESIGNER_FAQS>);

export default function Support() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", category: "general" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact", { body: formData });
      if (error) throw error;
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "", category: "general" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <SEOHead 
        title="Support & Help Center | Adorzia Pakistan"
        description="Get help with Adorzia platform. FAQs, tutorials, and customer support for fashion designers in Pakistan. Questions about StyleBoxes, IP ownership, profit sharing, and more."
        url="https://www.adorzia.com/support"
        keywords="Adorzia support, Help center, Fashion platform help, Customer support Pakistan, Designer assistance, FAQs Pakistan"
      />
      <FAQSchema items={[...COMMON_FAQS.portfolio, ...COMMON_FAQS.brands, ...COMMON_FAQS.marketplace]} mainEntityName="Adorzia Support" />
            <BreadcrumbSchema items={[
              { name: "Home", url: "https://www.adorzia.com" },
              { name: "Support", url: "https://www.adorzia.com/support" }
            ]} />
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <Badge variant="secondary" className="mb-6">Support Center</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">The Designer's FAQ</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">Everything you need to know about IP, profit sharing, teaming, and the Adorzia platform.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {quickLinks.map((link, i) => (
              <motion.a key={link.title} href={link.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group">
                <Card className="hover:shadow-md transition-all hover:border-primary/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3"><link.icon className="h-5 w-5 text-primary" /><span className="font-medium">{link.title}</span></div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Comprehensive FAQ</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">Frequently Asked Questions</AnimatedHeading>
            <p className="text-muted-foreground">Addressing the hard questions about IP, payouts, and our unique model.</p>
          </div>
          <div className="space-y-12">
            {(Object.keys(groupedFaqs) as FAQCategory[]).map((category, categoryIndex) => {
              const CategoryIcon = categoryIcons[category];
              const categoryInfo = FAQ_CATEGORIES[category];
              return (
                <motion.div key={category} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: categoryIndex * 0.1 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><CategoryIcon className="h-5 w-5 text-primary" /></div>
                    <h3 className="font-display text-xl font-bold">{categoryInfo.label}</h3>
                  </div>
                  <Accordion type="single" collapsible className="space-y-3">
                    {groupedFaqs[category].map((faq, i) => (
                      <AccordionItem key={i} value={`${category}-${i}`} className="bg-background rounded-xl border px-6 shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 whitespace-pre-line">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Contact Us</Badge>
            <AnimatedHeading className="font-display text-3xl font-bold mb-4 tracking-tight">Have More Questions?</AnimatedHeading>
            <p className="text-muted-foreground">Send us a message and we'll get back to you within 24 hours.</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"><Mail className="h-6 w-6 text-primary" /></div>
                  <div><p className="font-semibold">Email us directly</p><a href="mailto:hello@adorzia.com" className="text-primary hover:underline text-lg">hello@adorzia.com</a></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>24hr response</span></div>
              </CardContent>
            </Card>
          </motion.div>
          <TiltCard tiltAmount={3}>
            <Card>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><Send className="h-8 w-8 text-green-600" /></div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-4">We'll get back to you within 24 hours.</p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12" />
                    <Input placeholder="Your email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12" />
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="brand_inquiry">Brand Inquiry</SelectItem>
                        <SelectItem value="prebooking">Prebooking Request</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="h-12" />
                    <Textarea placeholder="Your message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="resize-none" />
                    <Button type="submit" className="w-full h-12 group" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : <>Send Message<Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TiltCard>
        </div>
      </section>

      <section id="policies" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedHeading className="font-display text-2xl font-bold mb-8 tracking-tight">Policies & Legal</AnimatedHeading>
          <div className="flex justify-center gap-4 flex-wrap">
            {[{ label: "Privacy Policy", icon: Shield }, { label: "Terms of Service", icon: FileText }, { label: "Refund Policy", icon: CreditCard }].map((policy, i) => (
              <motion.div key={policy.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Button variant="outline" size="lg" className="group"><policy.icon className="mr-2 h-4 w-4" />{policy.label}<ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
