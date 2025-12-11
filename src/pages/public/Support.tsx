import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail, FileText, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";

const faqs = [
  { q: "How do I get started?", a: "Create a free account and complete your first StyleBox challenge." },
  { q: "When do I get paid?", a: "Payouts are processed monthly for all sales from the previous month." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no penalties." },
];

export default function Support() {
  return (
    <PublicLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge variant="secondary" className="mb-6">Support Center</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">How Can We Help?</h1>
            <p className="text-lg text-muted-foreground">Find answers, get support, and connect with our team.</p>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="py-20 border-t">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i}><CardContent className="p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </CardContent></Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-secondary/50">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Contact Us</h2>
          <Card><CardContent className="p-6 space-y-4">
            <Input placeholder="Your email" type="email" />
            <Input placeholder="Subject" />
            <Textarea placeholder="Your message" rows={4} />
            <Button className="w-full">Send Message</Button>
          </CardContent></Card>
        </div>
      </section>

      <section id="policies" className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl font-bold mb-4">Policies</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="outline" size="sm">Privacy Policy</Button>
            <Button variant="outline" size="sm">Terms of Service</Button>
            <Button variant="outline" size="sm">Refund Policy</Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
