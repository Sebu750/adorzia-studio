import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Palette,
  Layers,
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

const tools = [
  {
    icon: Grid3X3,
    title: "Pattern Tools",
    description: "Generate and refine production-ready patterns with precision grid systems and automatic measurements.",
    features: ["Grid-based design", "Auto measurements", "Export formats", "Size grading"]
  },
  {
    icon: Image,
    title: "Moodboard Builder",
    description: "Transform ideas into structured creative direction with drag-and-drop mood composition.",
    features: ["Image library", "Color extraction", "Layout templates", "Shareable boards"]
  },
  {
    icon: Wand2,
    title: "Mockup Generator",
    description: "Instant visual representations of garments on realistic templates and models.",
    features: ["3D previews", "Multiple angles", "Fabric simulation", "Quick exports"]
  },
  {
    icon: FileText,
    title: "Tech Pack Automation",
    description: "Industry-standard documentation produced automatically from your designs.",
    features: ["Auto-generated specs", "BOM creation", "Construction details", "Factory-ready PDFs"]
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
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
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
              <Button size="lg">
                Try Studio Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Core Tools</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything You Need
            </h2>
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
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center mb-6">
                      <tool.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold mb-3">{tool.title}</h3>
                    <p className="text-muted-foreground mb-6">{tool.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {tool.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <Sparkles className="h-3 w-3 text-muted-foreground" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pattern Tools Deep Dive */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Pattern Design</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Pattern Tools
              </h2>
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
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      <Scissors className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="aspect-video bg-muted flex items-center justify-center">
              <Grid3X3 className="h-24 w-24 text-muted-foreground/30" />
            </Card>
          </div>
        </div>
      </section>

      {/* Moodboard Builder */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="aspect-video bg-muted flex items-center justify-center order-2 lg:order-1">
              <Palette className="h-24 w-24 text-muted-foreground/30" />
            </Card>
            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-4">Creative Direction</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Moodboard Builder
              </h2>
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
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      <Image className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Pack */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-background/20 text-background">
                Production Ready
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Tech Pack Automation
              </h2>
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
                  <li key={i} className="flex items-center gap-3 text-background/80">
                    <div className="h-6 w-6 rounded-full bg-background/10 flex items-center justify-center">
                      <FileText className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="aspect-video bg-background/5 border-background/10 flex items-center justify-center">
              <FileText className="h-24 w-24 text-background/20" />
            </Card>
          </div>
        </div>
      </section>

      {/* Asset Library */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Resources</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Asset Library
            </h2>
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
                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
                      <FolderOpen className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-1">{asset.category}</h3>
                    <p className="text-sm text-muted-foreground">{asset.count}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Start Creating Today
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Access professional design tools with your free account.
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="h-12 px-8">
              Open Studio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
