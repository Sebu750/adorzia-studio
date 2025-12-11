import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Users, Factory, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";

const offerings = [
  { icon: Trophy, title: "Host Challenges", desc: "Engage designers through StyleBoxes and Styleathon events tailored to your brand." },
  { icon: Users, title: "Collaborations", desc: "Co-create collections with emerging talent and fresh perspectives." },
  { icon: Factory, title: "White-Label Production", desc: "Scalable, quality manufacturing handled end-to-end." },
];

export default function ForBrands() {
  return (
    <PublicLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge variant="secondary" className="mb-6">Brand Partnerships</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Partner With Adorzia</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Access Pakistan's top emerging design talent and manufacturing infrastructure.
            </p>
            <Button size="lg">Contact Sales <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {offerings.map((item, i) => (
              <Card key={i} className="h-full">
                <CardContent className="p-6">
                  <item.icon className="h-10 w-10 mb-4 text-muted-foreground" />
                  <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
