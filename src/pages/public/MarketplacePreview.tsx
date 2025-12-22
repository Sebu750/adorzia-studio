import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Star,
  ShoppingBag,
  Filter,
  Sparkles,
  TrendingUp,
  Users,
  Package
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import ProductCard from "@/components/public/ProductCard";
import TiltCard from "@/components/public/TiltCard";
import StatsSection from "@/components/public/StatsSection";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import { 
  productImages, 
  designerImages, 
  collectionImages, 
  backgroundImages 
} from "@/lib/images";

const featuredProducts = [
  { 
    id: 1, 
    title: "Karachi Street Hoodie", 
    designer: "Zain Ahmed", 
    price: "PKR 4,500", 
    category: "Streetwear",
    isNew: true,
    image: productImages.streetwearHoodie,
  },
  { 
    id: 2, 
    title: "Heritage Kurta Set", 
    designer: "Ayesha Khan", 
    price: "PKR 8,900", 
    category: "Traditional",
    isFeatured: true,
    image: productImages.heritageKurta,
  },
  { 
    id: 3, 
    title: "Urban Joggers", 
    designer: "Ali Hassan", 
    price: "PKR 3,200", 
    category: "Essentials",
    image: productImages.urbanJoggers,
  },
  { 
    id: 4, 
    title: "Statement Blazer", 
    designer: "Fatima Malik", 
    price: "PKR 12,500", 
    category: "Formal",
    isFeatured: true,
    image: productImages.statementBlazer,
  },
  { 
    id: 5, 
    title: "Denim Jacket", 
    designer: "Kamran Malik", 
    price: "PKR 6,800", 
    category: "Streetwear",
    isNew: true,
    image: productImages.denimJacket,
  },
  { 
    id: 6, 
    title: "Casual Tee Collection", 
    designer: "Zara Hussain", 
    price: "PKR 2,200", 
    category: "Essentials",
    image: productImages.casualTee,
  },
  { 
    id: 7, 
    title: "Floral Summer Dress", 
    designer: "Sarah Ahmed", 
    price: "PKR 7,500", 
    category: "Traditional",
    isFeatured: true,
    image: productImages.floralDress,
  },
  { 
    id: 8, 
    title: "Leather Tote Bag", 
    designer: "Hira Noor", 
    price: "PKR 9,200", 
    category: "Accessories",
    isNew: true,
    image: productImages.leatherBag,
  },
];

const newDesigners = [
  { 
    name: "Sarah Iqbal", 
    specialty: "Sustainable Fashion", 
    products: 8, 
    rating: 4.8,
    image: designerImages.sarahIqbal,
  },
  { 
    name: "Usman Tariq", 
    specialty: "Streetwear", 
    products: 12, 
    rating: 4.7,
    image: designerImages.usmanTariq,
  },
  { 
    name: "Hira Noor", 
    specialty: "Couture", 
    products: 5, 
    rating: 4.9,
    image: designerImages.hiraNoor,
  },
  { 
    name: "Zain Ahmed", 
    specialty: "Urban Design", 
    products: 15, 
    rating: 4.6,
    image: designerImages.zainAhmed,
  },
  { 
    name: "Ayesha Khan", 
    specialty: "Traditional Wear", 
    products: 10, 
    rating: 4.8,
    image: designerImages.ayeshaKhan,
  },
  { 
    name: "Fatima Malik", 
    specialty: "Formal Collection", 
    products: 7, 
    rating: 4.9,
    image: designerImages.fatimaMalik,
  },
];

const collections = [
  { 
    name: "Summer Essentials 2024", 
    designer: "Multiple Artists", 
    items: 24,
    image: collectionImages.summerEssentials,
  },
  { 
    name: "Lahore Street Style", 
    designer: "Urban Collective", 
    items: 18,
    image: collectionImages.lahoreStreet,
  },
  { 
    name: "Sustainable Basics", 
    designer: "Eco Designers", 
    items: 15,
    image: collectionImages.sustainableBasics,
  },
];

const categories = [
  { name: "Apparel", count: 450 },
  { name: "Accessories", count: 120 },
  { name: "Streetwear", count: 180 },
  { name: "Premium Couture", count: 45 },
  { name: "Traditional", count: 200 },
  { name: "Sustainable", count: 85 },
];

const marketplaceStats = [
  { value: 450, suffix: '+', label: 'Products Live', icon: <Package className="h-6 w-6 text-muted-foreground" /> },
  { value: 120, suffix: '+', label: 'Designers', icon: <Users className="h-6 w-6 text-muted-foreground" /> },
  { value: 15, prefix: '', suffix: 'K+', label: 'Happy Customers', icon: <Star className="h-6 w-6 text-muted-foreground" /> },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: <TrendingUp className="h-6 w-6 text-muted-foreground" /> },
];

export default function MarketplacePreview() {
  return (
    <PublicLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${backgroundImages.fashion})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
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
                <Button size="lg" className="group">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </motion.div>

            {/* Hero Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src={productImages.floralDress} 
                    alt="Floral Dress" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src={productImages.leatherBag} 
                    alt="Leather Bag" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src={productImages.streetwearHoodie} 
                    alt="Street Hoodie" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src={productImages.statementBlazer} 
                    alt="Statement Blazer" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Stats */}
      <section className="py-12 border-t border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <StatsSection stats={marketplaceStats} variant="default" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4">Top Rated</Badge>
              </motion.div>
              <AnimatedHeading className="font-display text-3xl font-bold tracking-tight">
                Featured Products
              </AnimatedHeading>
            </div>
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  designer={product.designer}
                  category={product.category}
                  isNew={product.isNew}
                  isFeatured={product.isFeatured}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Designers */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Rising Stars</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              New Designers
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Discover emerging talent from across Pakistan.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newDesigners.map((designer, i) => (
              <motion.div
                key={designer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <TiltCard tiltAmount={8}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img 
                        src={designer.image} 
                        alt={designer.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display font-semibold text-lg">{designer.name}</h3>
                        <p className="text-sm text-muted-foreground">{designer.specialty}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{designer.products} products</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium">{designer.rating}</span>
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

      {/* Collections */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Curated</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Collections
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Curated capsules created directly through StyleBoxes.
            </motion.p>
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
                <TiltCard tiltAmount={6}>
                  <Card className="h-full overflow-hidden group cursor-pointer">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/60 transition-colors flex items-center justify-center">
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
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-background/20 text-background">
                Browse
              </Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight text-background">
              Shop by Category
            </AnimatedHeading>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-background/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-background/20 transition-colors cursor-pointer border border-background/10"
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Quality Assurance</Badge>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Production-Ready Products
              </AnimatedHeading>
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
                  <motion.li 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TiltCard tiltAmount={8}>
                <Card className="overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted-foreground/10 p-8 flex items-center justify-center relative">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
                    </motion.div>
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
                    <Button className="w-full group">
                      Add to Cart
                      <ShoppingBag className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    </Button>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Start Shopping
          </AnimatedHeading>
          <motion.p 
            className="text-muted-foreground max-w-xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Support independent designers. Discover unique fashion.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button size="lg" className="group">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Become a Designer
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
