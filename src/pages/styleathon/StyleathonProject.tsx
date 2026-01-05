import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Sparkles } from "lucide-react";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import StyleathonImageSlider from "@/components/styleathon/StyleathonImageSlider";
import StyleathonDesignerProfile from "@/components/styleathon/StyleathonDesignerProfile";
import { Badge } from "@/components/ui/badge";
import { mockSubmissions } from "@/lib/styleathon-images";

const StyleathonProject = () => {
  const { id } = useParams<{ id: string }>();

  // Find the project from mock data
  const project = mockSubmissions.find((s) => s.id === id) || mockSubmissions[0];

  return (
    <PublicLayout>
      <SEOHead
        title={`${project.title} - Styleathon 01 | Adorzia`}
        description={project.conceptStatement}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/styleathon/01/submissions"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Submissions
          </Link>
        </div>

        {/* Image Slider */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 mb-12"
        >
          <StyleathonImageSlider images={project.images} title={project.title} />
        </motion.section>

        {/* Content */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Title & Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="secondary" className="mb-4">
                    Styleathon Submission
                  </Badge>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {project.title}
                  </h1>
                </motion.div>

                {/* Concept Statement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Concept Statement
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.conceptStatement}
                  </p>
                </motion.div>

                {/* Collection Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Collection Details
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-muted/30 rounded-xl border border-border">
                      <p className="text-3xl font-display font-bold text-foreground mb-1">
                        {project.looks}
                      </p>
                      <p className="text-sm text-muted-foreground">Looks</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border sm:col-span-2">
                      <p className="text-sm text-muted-foreground mb-3">Materials</p>
                      <div className="flex flex-wrap gap-2">
                        {project.materials.map((material) => (
                          <Badge key={material} variant="outline">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-muted/30 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground mb-3">Techniques</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techniques.map((technique) => (
                        <Badge key={technique} variant="outline">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Designer Profile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <StyleathonDesignerProfile
                    name={project.designerName}
                    avatar={project.designerAvatar}
                    level={project.designerLevel}
                    xp={project.xp}
                  />
                </motion.div>

                {/* Earned Rewards Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-muted/30 rounded-2xl border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-4">
                    Participation Rewards
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">+500 XP</p>
                        <p className="text-sm text-muted-foreground">Submission Bonus</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Styleathon Participant</p>
                        <p className="text-sm text-muted-foreground">Exclusive Badge</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default StyleathonProject;
