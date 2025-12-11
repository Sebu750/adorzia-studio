import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Store, 
  Star,
  Heart,
  ShoppingBag,
  Filter,
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";

const featuredProducts = [
  { 
    id: 1, 
    name: "Karachi Street Hoodie", 
    designer: "Zain Ahmed", 
    price: "PKR 4,500", 
    category: "Streetwear",
    rating: 4.8,
    sold: 127
  },
  { 
    id: 2, 
    name: "Heritage Kurta Set", 
    designer: "Ayesha Khan", 
    price: "PKR 8,900", 
    category: "Traditional",
    rating: 4.9,
    sold: 89
  },
  { 
    id: 3, 
    name: "Urban Joggers", 
    designer: "Ali Hassan", 
    price: "PKR 3,200", 
    category: "Essentials",
    rating: 4.7,
    sold: 256
  },
  { 
    id: 4, 
    name: "Statement Blazer", 
    designer: "Fatima Malik", 
    price: "PKR 12,500", 
    category: "Formal",
    rating: 4.9,
    sold: 64
  },
];

const newDesigners = [
  { name: "Sarah Iqbal", specialty: "Sustainable Fashion", products: 8, rating: 4.8 },
  { name: "Usman Tariq", specialty: "Streetwear", products: 12, rating: 4.7 },
  { name: "Hira Noor", specialty: "Couture", products: 5, rating: 4.9 },
];

const collections = [
  { name: "Summer Essentials 2024", designer: "Multiple Artists", items: 24 },
  { name: "Lahore Street Style", designer: "Urban Collective", items: 18 },
  { name: "Sustainable Basics", designer: "Eco Designers", items: 15 },
];

const categories = [
  { name: "Apparel", count: 450 },
  { name: "Accessories", count: 120 },
  { name: "Streetwear", count: 180 },
  { name: "Premium Couture", count: 45 },
  { name: "Traditional", count: 200 },
  { name: "Sustainable", count: 85 },
];

export default function MarketplacePreview() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">Designer Marketplace</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Shop Designer
              <br />
              <span className="text-muted-foreground">Made in Pakistan</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Discover unique fashion pieces created by emerging Pakistani designers. 
              Every purchase supports independent creators and sustainable fashion.
            </p>
            <div className="flex gap-4">
              <Button size="lg">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-4">Top Rated</Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight">
                Featured Products
              </h2>
            </div>
            <Button variant="ghost">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full group cursor-pointer">
                  <div className="aspect-[3/4] bg-secondary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 fill-foreground" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.sold} sold)</span>
                    </div>
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {product.designer}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{product.price}</span>
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Designers */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Rising Stars</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              New Designers
            </h2>
            <p className="text-muted-foreground">
              Discover emerging talent from across Pakistan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {newDesigners.map((designer, i) => (
              <motion.div
                key={designer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                        <span className="font-bold">{designer.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold">{designer.name}</h3>
                        <p className="text-sm text-muted-foreground">{designer.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{designer.products} products</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-foreground" />
                        {designer.rating}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Curated</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Collections
            </h2>
            <p className="text-muted-foreground">
              Curated capsules created directly through StyleBoxes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {collections.map((collection, i) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full overflow-hidden group cursor-pointer">
                  <div className="aspect-video bg-secondary relative">
                    <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                      <div className="text-center text-background">
                        <h3 className="font-display text-xl font-bold mb-2">{collection.name}</h3>
                        <p className="text-sm text-background/80">{collection.items} items</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">by {collection.designer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-background/20 text-background">
              Browse
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-background/10 rounded-xl p-6 text-center hover:bg-background/20 transition-colors cursor-pointer"
              >
                <h3 className="font-medium mb-1">{cat.name}</h3>
                <p className="text-sm text-background/60">{cat.count} items</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Cards Info */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Quality Assurance</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Production-Ready Products
              </h2>
              <p className="text-muted-foreground mb-6">
                Every item on our marketplace is backed by Adorzia's manufacturing pipeline. 
                From design to delivery, we ensure quality at every step.
              </p>
              <ul className="space-y-4">
                {[
                  "Designer-created, production-verified",
                  "Quality checked before listing",
                  "Local manufacturing excellence",
                  "Secure checkout and delivery"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="overflow-hidden">
              <div className="aspect-square bg-secondary p-8 flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>New</Badge>
                  <Badge variant="secondary">Verified</Badge>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Sample Product</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Each product comes with full provenance—you know exactly who designed it 
                  and how it was made.
                </p>
                <Button className="w-full">Add to Cart</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Start Shopping
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Support independent designers. Discover unique fashion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse All Products
            </Button>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Become a Designer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
