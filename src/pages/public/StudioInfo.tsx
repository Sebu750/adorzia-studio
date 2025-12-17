import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Palette,
  FileText,
  FolderOpen,
  Wand2,
  Grid3X3,
  Sparkles,
  Scissors,
  Image
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import ParallaxSection from "@/components/public/ParallaxSection";
import { studioToolImages, backgroundImages } from "@/lib/images";

const tools = [
  {
    icon: Grid3X3,
    title: "Pattern Tools",
    description: "Generate and refine production-ready patterns with precision grid systems and automatic measurements.",
    features: ["Grid-based design", "Auto measurements", "Export formats", "Size grading"],
    image: studioToolImages.patternDesign
  },
  {
    icon: Image,
    title: "Moodboard Builder",
    description: "Transform ideas into structured creative direction with drag-and-drop mood composition.",
    features: ["Image library", "Color extraction", "Layout templates", "Shareable boards"],
    image: studioToolImages.moodboard
  },
  {
    icon: Wand2,
    title: "Mockup Generator",
    description: "Instant visual representations of garments on realistic templates and models.",
    features: ["3D previews", "Multiple angles", "Fabric simulation", "Quick exports"],
    image: studioToolImages.mockup
  },
  {
    icon: FileText,
    title: "Tech Pack Automation",
    description: "Industry-standard documentation produced automatically from your designs.",
    features: ["Auto-generated specs", "BOM creation", "Construction details", "Factory-ready PDFs"],
    image: studioToolImages.techPack
  },
];

const assetLibrary = [
  { category: "Textures", count: "500+" },
  { category: "Fabrics", count: "300+" },
  { category: "Silhouettes", count: "200+" },
  { category: "Templates", count: "150+" },
  { category: "Buttons & Trims", count: "400+" },
  { category: "Pattern Blocks", count: "100+" },
];

export default function StudioInfo() {
  return (
    <PublicLayout>
      {/* Hero with floating elements */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">Designer Studio</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Professional Tools
              <br />
              <span className="text-muted-foreground">For Every Designer</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              A complete creative workspace with pattern tools, moodboard builders, 
              mockup generators, and automated tech packs—everything you need to go 
              from idea to production-ready design.
            </p>
            <Link to="/auth">
              <Button size="lg" className="group">
                Try Studio Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid with images */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Core Tools</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything You Need
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Professional-grade tools designed for fashion creators at every level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={6}>
                  <Card className="h-full overflow-hidden group">
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img 
                        src={tool.image}
                        alt={tool.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      <motion.div 
                        className="absolute bottom-4 left-4 h-14 w-14 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <tool.icon className="h-7 w-7" />
                      </motion.div>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="font-display text-2xl font-semibold mb-3">{tool.title}</h3>
                      <p className="text-muted-foreground mb-6">{tool.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {tool.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <Sparkles className="h-3 w-3 text-primary" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pattern Tools Deep Dive with parallax */}
      <ParallaxSection
        backgroundImage={backgroundImages.textile}
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="backdrop-blur-sm bg-background/80 p-8 rounded-2xl">
              <Badge variant="outline" className="mb-4">Pattern Design</Badge>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Pattern Tools
              </AnimatedHeading>
              <p className="text-muted-foreground mb-6">
                Generate and refine production-ready patterns with our intuitive grid-based 
                design system. Automatic measurements, size grading, and export to industry-standard formats.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Precise grid-based pattern creation",
                  "Automatic size grading from XS to 3XL",
                  "Export to DXF, PDF, and SVG formats",
                  "Seam allowance automation",
                  "Pattern piece labeling"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      <Scissors className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <TiltCard tiltAmount={10}>
              <Card className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Grid3X3 className="h-32 w-32 text-muted-foreground/30" />
                </motion.div>
              </Card>
            </TiltCard>
          </div>
        </div>
      </ParallaxSection>

      {/* Moodboard Builder */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <TiltCard tiltAmount={10} className="order-2 lg:order-1">
              <Card className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Palette className="h-32 w-32 text-muted-foreground/30" />
                </motion.div>
              </Card>
            </TiltCard>
            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-4">Creative Direction</Badge>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Moodboard Builder
              </AnimatedHeading>
              <p className="text-muted-foreground mb-6">
                Transform scattered inspiration into structured creative direction. 
                Drag and drop images, extract color palettes, and create presentation-ready boards.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Drag-and-drop composition",
                  "Automatic color palette extraction",
                  "Pre-designed layout templates",
                  "Integration with image library",
                  "Share and collaborate with team"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      <Image className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Pack with animated gradient */}
      <section className="relative py-20 md:py-28 bg-foreground text-background overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-background/20 text-background">
                Production Ready
              </Badge>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Tech Pack Automation
              </AnimatedHeading>
              <p className="text-background/70 mb-6">
                Industry-standard documentation produced automatically. Generate complete 
                tech packs with specs, BOMs, and construction details—factory-ready in minutes.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Auto-generated specifications",
                  "Bill of Materials creation",
                  "Construction sequence details",
                  "Factory-ready PDF exports",
                  "Version control and history"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center gap-3 text-background/80"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-6 w-6 rounded-full bg-background/10 flex items-center justify-center">
                      <FileText className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <Card className="aspect-video bg-background/5 border-background/10 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FileText className="h-32 w-32 text-background/20" />
              </motion.div>
            </Card>
          </div>
        </div>
      </section>

      {/* Asset Library */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Resources</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Asset Library
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Thousands of textures, fabrics, silhouettes, and templates at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {assetLibrary.map((asset, i) => (
              <motion.div
                key={asset.category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <TiltCard tiltAmount={15}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <motion.div 
                        className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <FolderOpen className="h-6 w-6" />
                      </motion.div>
                      <h3 className="font-medium mb-1">{asset.category}</h3>
                      <p className="text-sm text-muted-foreground">{asset.count}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedHeading as="h2" className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Start Creating Today
          </AnimatedHeading>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Access professional design tools with your free account.
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="h-12 px-8 group">
              Open Studio
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
