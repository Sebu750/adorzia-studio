import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit2, 
  ExternalLink, 
  Share2, 
  Download,
  Globe,
  Mail,
  MapPin,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Portfolio, PortfolioProject, PortfolioAsset, PortfolioSection } from '@/lib/portfolio';

export default function PortfolioPreview() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch portfolio by ID or slug
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio-preview', id || slug],
    queryFn: async () => {
      let query = supabase.from('portfolios').select('*');
      
      if (id) {
        query = query.eq('id', id);
      } else if (slug) {
        query = query.eq('slug', slug);
      }
      
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data as Portfolio | null;
    },
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['portfolio-projects-preview', portfolio?.id],
    queryFn: async () => {
      if (!portfolio?.id) return [];
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as PortfolioProject[];
    },
    enabled: !!portfolio?.id,
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['portfolio-assets-preview', portfolio?.id],
    queryFn: async () => {
      if (!portfolio?.id) return [];
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as PortfolioAsset[];
    },
    enabled: !!portfolio?.id,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['portfolio-sections-preview', portfolio?.id],
    queryFn: async () => {
      if (!portfolio?.id) return [];
      const { data, error } = await supabase
        .from('portfolio_sections')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as PortfolioSection[];
    },
    enabled: !!portfolio?.id,
  });

  const { data: designer } = useQuery({
    queryKey: ['designer-profile', portfolio?.designer_id],
    queryFn: async () => {
      if (!portfolio?.designer_id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', portfolio.designer_id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!portfolio?.designer_id,
  });

  const featuredProjects = projects.filter(p => p.is_featured);

  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Portfolio Not Found</h1>
        <p className="text-muted-foreground mb-4">This portfolio doesn't exist or is private.</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const getProjectAssets = (projectId: string) => 
    assets.filter(a => a.project_id === projectId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/portfolio/${portfolio.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Preview Mode</Badge>
            <Button variant="ghost" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight"
          >
            {portfolio.title}
          </motion.h1>
          
          {portfolio.tagline && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto"
            >
              {portfolio.tagline}
            </motion.p>
          )}

          {designer && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 mt-6"
            >
              <span className="text-muted-foreground">by</span>
              <span className="font-medium">{designer.name}</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Featured Work</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => {
                const projectAssets = getProjectAssets(project.id);
                const thumbnail = project.thumbnail_url || projectAssets[0]?.file_url;
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      {project.description && (
                        <p className="text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">All Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const projectAssets = getProjectAssets(project.id);
              const thumbnail = project.thumbnail_url || projectAssets[0]?.file_url;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">View Project</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium truncate">{project.title}</h3>
                    {project.category && (
                      <p className="text-sm text-muted-foreground">{project.category}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No projects to display yet.
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      {/* Footer */}
      <footer className="py-16 px-4 border-t">
        <div className="container max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {designer?.name || 'Designer'}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Portfolio powered by Adorzia Studio
          </p>
        </div>
      </footer>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}

function SectionRenderer({ section }: { section: PortfolioSection }) {
  const content = section.content as Record<string, any>;

  switch (section.section_type) {
    case 'text':
      return (
        <section className="py-16 px-4">
          <div className="container max-w-3xl mx-auto">
            {content.heading && (
              <h2 className="text-3xl font-bold mb-4">{content.heading}</h2>
            )}
            {content.body && (
              <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                {content.body}
              </p>
            )}
          </div>
        </section>
      );

    case 'about':
      return (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
            {content.bio && (
              <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                {content.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-4 mt-6">
              {content.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {content.location}
                </div>
              )}
              {content.specialties && (
                <div className="flex flex-wrap gap-2">
                  {content.specialties.split(',').map((s: string) => (
                    <Badge key={s} variant="secondary">{s.trim()}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="py-16 px-4">
          <div className="container max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
            <div className="flex flex-col items-center gap-4">
              {content.email && (
                <a 
                  href={`mailto:${content.email}`}
                  className="flex items-center gap-2 text-lg hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {content.email}
                </a>
              )}
              {content.website && (
                <a 
                  href={content.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-lg hover:text-primary transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  {content.website}
                </a>
              )}
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
