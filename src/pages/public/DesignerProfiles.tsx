import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";

const designers = [
  { name: "Sarah Iqbal", specialty: "Streetwear", products: 12, rating: 4.9 },
  { name: "Ali Hassan", specialty: "Essentials", products: 8, rating: 4.8 },
  { name: "Fatima Malik", specialty: "Couture", products: 15, rating: 4.9 },
  { name: "Zain Ahmed", specialty: "Sustainable", products: 10, rating: 4.7 },
];

export default function DesignerProfiles() {
  return (
    <PublicLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge variant="secondary" className="mb-6">Designer Directory</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Meet Our Designers</h1>
            <p className="text-lg text-muted-foreground">Discover talented creators from across Pakistan.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {designers.map((d, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square bg-secondary" />
                <CardContent className="p-4">
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{d.specialty}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{d.products} products</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-foreground" />{d.rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
