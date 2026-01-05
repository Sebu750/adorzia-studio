import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Grid3X3, LayoutGrid } from "lucide-react";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import StyleathonSubmissionCard from "@/components/styleathon/StyleathonSubmissionCard";
import { mockSubmissions } from "@/lib/styleathon-images";
import { Button } from "@/components/ui/button";

const filters = ["Latest", "Top Ranked", "Trending"];

const StyleathonSubmissions = () => {
  const [activeFilter, setActiveFilter] = useState("Latest");
  const [gridSize, setGridSize] = useState<"normal" | "compact">("normal");

  return (
    <PublicLayout>
      <SEOHead
        title="Submissions - Styleathon 01 | Adorzia"
        description="Browse all submissions for Styleathon 01 - Graduation Thesis Edition"
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 md:py-20 border-b border-border">
          <div className="container mx-auto px-4">
            <Link
              to="/styleathon/01"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Styleathon
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Submissions
              </h1>
              <p className="text-muted-foreground text-lg">
                Styleathon 01 — Graduation Thesis Edition
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Filter Pills */}
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilter === filter
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Grid Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGridSize("normal")}
                  className={gridSize === "normal" ? "text-foreground" : "text-muted-foreground"}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGridSize("compact")}
                  className={gridSize === "compact" ? "text-foreground" : "text-muted-foreground"}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Submissions Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div
              className={`grid gap-6 ${
                gridSize === "normal"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {mockSubmissions.map((submission, index) => (
                <StyleathonSubmissionCard
                  key={submission.id}
                  id={submission.id}
                  title={submission.title}
                  designerName={submission.designerName}
                  designerAvatar={submission.designerAvatar}
                  designerLevel={submission.designerLevel}
                  xp={submission.xp}
                  heroImage={submission.heroImage}
                  index={index}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-16">
              <Button variant="outline" size="lg" className="px-12">
                Load More Submissions
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default StyleathonSubmissions;
