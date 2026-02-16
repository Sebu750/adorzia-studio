import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { FAQAccordion } from "@/components/shop/FAQAccordion";
import AnimatedHeading from "@/components/public/AnimatedHeading";

const FAQS = [
  {
    id: '1',
    question: 'How long does shipping take?',
    answer: 'Shipping times vary depending on the product and your location. Since our items are made-to-order by independent designers, production typically takes 7-14 business days. Once shipped, domestic orders within Pakistan arrive within 3-5 business days. International shipping may take 10-20 business days.',
    category: 'shipping',
  },
  {
    id: '2',
    question: 'What is your return policy?',
    answer: 'We offer a 14-day return policy for unworn items with original tags attached. Since each piece is made-to-order, we ask that you carefully review sizing charts before purchasing. Custom or personalized items cannot be returned unless defective. Return shipping costs are the responsibility of the customer unless the item arrived damaged or incorrect.',
    category: 'returns',
  },
  {
    id: '3',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive an email with a tracking number. You can also track your order by visiting the "Order Tracking" page and entering your order number. If you have an account, you can view all your orders and their current status in your account dashboard.',
    category: 'ordering',
  },
  {
    id: '4',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Pakistani customers. All payments are processed securely through Stripe with SSL encryption.',
    category: 'ordering',
  },
  {
    id: '5',
    question: 'How do I find my correct size?',
    answer: 'Each product page includes a detailed size chart specific to that item. We recommend measuring yourself and comparing to the provided measurements. If you are between sizes, we generally recommend sizing up. For custom sizing inquiries, please contact the designer directly through their profile page.',
    category: 'products',
  },
  {
    id: '6',
    question: 'Can I modify or cancel my order?',
    answer: 'Orders can be modified or cancelled within 24 hours of placement, as long as production has not begun. After 24 hours, orders enter production and cannot be changed. Please contact our support team immediately if you need to make changes.',
    category: 'ordering',
  },
  {
    id: '7',
    question: 'Are the products authentic?',
    answer: 'Yes, all products on Adorzia are 100% authentic and created by verified independent designers. Each item comes with a certificate of authenticity and full provenance information. Our designers are carefully vetted to ensure quality and authenticity.',
    category: 'products',
  },
  {
    id: '8',
    question: 'How do I contact a designer?',
    answer: 'You can contact designers directly through their profile pages. Each designer has a "Contact" button that allows you to send inquiries about custom pieces, sizing questions, or collaborations. You can also follow your favorite designers to stay updated on their latest collections.',
    category: 'account',
  },
  {
    id: '9',
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to most countries worldwide. International shipping rates are calculated at checkout based on destination and order weight. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.',
    category: 'shipping',
  },
  {
    id: '10',
    question: 'What if my item arrives damaged?',
    answer: 'If your item arrives damaged or defective, please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or full refund at no additional cost to you. Please keep all original packaging for return shipping.',
    category: 'returns',
  },
  {
    id: '11',
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking "Sign In" in the top navigation and selecting "Create Account." Having an account allows you to track orders, save addresses, create wishlists, and receive exclusive offers from your favorite designers.',
    category: 'account',
  },
  {
    id: '12',
    question: 'Can I request a custom piece?',
    answer: 'Many of our designers accept custom orders. Visit the designer\'s profile page and click "Get in Touch" to discuss custom pieces, alterations, or special requests. Custom orders typically require additional production time and may have different pricing.',
    category: 'products',
  },
];

export default function ShopFAQ() {
  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <AnimatedHeading className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                How Can We Help?
              </AnimatedHeading>
              <p className="text-lg text-muted-foreground">
                Find answers to frequently asked questions about orders, shipping, returns, and more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                  <p className="text-muted-foreground mb-6">
                    Chat with our support team for immediate assistance during business hours.
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                  <p className="text-muted-foreground mb-6">
                    Send us an email and we'll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="mailto:support@adorzia.com">
                      Email Us
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketplaceLayout>
  );
}
