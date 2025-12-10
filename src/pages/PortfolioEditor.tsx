import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolio, usePortfolios } from '@/hooks/usePortfolio';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProjectCard, EmptyProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectEditorDialog } from '@/components/portfolio/ProjectEditorDialog';
import { AssetUploader, AssetThumbnail } from '@/components/portfolio/AssetUploader';
import { SectionEditor } from '@/components/portfolio/SectionEditor';
import { 
  PORTFOLIO_STATUS_CONFIG, 
  VISIBILITY_CONFIG,
  SECTION_TYPES,
  type PortfolioVisibility,
  type SectionType
} from '@/lib/portfolio';
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  Plus,
  Upload,
  LayoutGrid,
  FileText,
  Globe,
  Lock,
  Store,
  Send,
  Loader2,
  Image,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

export default function PortfolioEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updatePortfolio } = usePortfolios();
  
  const {
    portfolio,
    projects,
    assets,
    sections,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    uploadAsset,
    deleteAsset,
    createSection,
    updateSection,
    deleteSection,
    submitForReview,
    publishPortfolio,
    unpublishPortfolio,
  } = usePortfolio(id);

  const [activeTab, setActiveTab] = useState('projects');
  const [isSaving, setIsSaving] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showAssetDialog, setShowAssetDialog] = useState(false);
  const [selectedProjectForAssets, setSelectedProjectForAssets] = useState<string | null>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showSectionDialog, setShowSectionDialog] = useState(false);

  // Local state for editable fields
  const [title, setTitle] = useState(portfolio?.title || '');
  const [description, setDescription] = useState(portfolio?.description || '');
  const [tagline, setTagline] = useState(portfolio?.tagline || '');
  const [visibility, setVisibility] = useState<PortfolioVisibility>(portfolio?.visibility || 'private');

  // Update local state when portfolio loads
  useState(() => {
    if (portfolio) {
      setTitle(portfolio.title);
      setDescription(portfolio.description || '');
      setTagline(portfolio.tagline || '');
      setVisibility(portfolio.visibility);
    }
  });

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await updatePortfolio.mutateAsync({
        id,
        title,
        description,
        tagline,
        visibility,
      });
      toast.success('Portfolio saved');
    } catch (error) {
      toast.error('Failed to save portfolio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProject = async (data: any) => {
    await createProject.mutateAsync(data);
    setShowProjectDialog(false);
  };

  const handleUpdateProject = async (data: any) => {
    if (!editingProject) return;
    await updateProject.mutateAsync({ projectId: editingProject.id, ...data });
    setEditingProject(null);
  };

  const handleUploadAsset = async (file: File, category?: string) => {
    await uploadAsset.mutateAsync({ 
      file, 
      projectId: selectedProjectForAssets || undefined,
      category 
    });
  };

  const handleAddSection = async (type: SectionType) => {
    await createSection.mutateAsync({
      title: SECTION_TYPES.find(s => s.value === type)?.label || 'New Section',
      section_type: type,
    });
    setShowSectionDialog(false);
  };

  const statusConfig = portfolio ? PORTFOLIO_STATUS_CONFIG[portfolio.status] : null;
  const canEdit = statusConfig?.canEdit ?? true;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!portfolio) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Portfolio not found</p>
          <Button asChild className="mt-4">
            <Link to="/portfolio">Back to Portfolios</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/portfolio">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold border-none px-0 h-auto focus-visible:ring-0"
                  placeholder="Portfolio Title"
                  disabled={!canEdit}
                />
                {statusConfig && (
                  <Badge className={statusConfig.color}>
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {projects.length} projects · {assets.length} assets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/portfolio/${id}/preview`}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button onClick={handleSave} disabled={isSaving || !canEdit}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>

            {portfolio.status === 'draft' && (
              <Button 
                variant="default"
                onClick={() => submitForReview.mutate()}
                disabled={submitForReview.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit for Review
              </Button>
            )}

            {portfolio.status === 'approved' && (
              <Button 
                onClick={() => publishPortfolio.mutate()}
                disabled={publishPortfolio.isPending}
              >
                <Globe className="w-4 h-4 mr-2" />
                Publish
              </Button>
            )}

            {portfolio.status === 'published' && (
              <Button 
                variant="outline"
                onClick={() => unpublishPortfolio.mutate()}
                disabled={unpublishPortfolio.isPending}
              >
                Unpublish
              </Button>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <Card>
          <CardContent className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Tagline</label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="A short description of your portfolio"
                  className="mt-1"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Visibility</label>
                <Select 
                  value={visibility} 
                  onValueChange={(v) => setVisibility(v as PortfolioVisibility)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VISIBILITY_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {key === 'private' && <Lock className="w-4 h-4" />}
                          {key === 'public' && <Globe className="w-4 h-4" />}
                          {key === 'marketplace_only' && <Store className="w-4 h-4" />}
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="projects" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Projects
              <Badge variant="secondary" className="ml-1">{projects.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="assets" className="gap-2">
              <Image className="w-4 h-4" />
              All Assets
              <Badge variant="secondary" className="ml-1">{assets.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="sections" className="gap-2">
              <Layers className="w-4 h-4" />
              Layout
              <Badge variant="secondary" className="ml-1">{sections.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    assets={assets}
                    onEdit={() => {
                      setEditingProject(project);
                    }}
                    onDelete={() => setShowDeleteDialog(project.id)}
                    onToggleFeatured={() => {
                      updateProject.mutate({
                        projectId: project.id,
                        is_featured: !project.is_featured,
                      });
                    }}
                    onAddAssets={() => {
                      setSelectedProjectForAssets(project.id);
                      setShowAssetDialog(true);
                    }}
                  />
                ))}
              </AnimatePresence>
              
              {canEdit && (
                <EmptyProjectCard onClick={() => setShowProjectDialog(true)} />
              )}
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="mt-6 space-y-6">
            {canEdit && (
              <AssetUploader
                onUpload={handleUploadAsset}
                isUploading={uploadAsset.isPending}
              />
            )}

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {assets.map((asset) => (
                <AssetThumbnail
                  key={asset.id}
                  asset={asset}
                  size="lg"
                  onDelete={canEdit ? () => deleteAsset.mutate(asset.id) : undefined}
                />
              ))}
            </div>

            {assets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No assets yet. Upload your first file above.</p>
              </div>
            )}
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections" className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Customize how your portfolio is displayed
              </p>
              {canEdit && (
                <Button onClick={() => setShowSectionDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {sections.map((section) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onUpdate={(updates) => updateSection.mutate({ sectionId: section.id, ...updates })}
                    onDelete={() => deleteSection.mutate(section.id)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {sections.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="text-center py-12">
                  <Layers className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No sections yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowSectionDialog(true)}
                  >
                    Add Your First Section
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Editor Dialog */}
      <ProjectEditorDialog
        open={showProjectDialog || !!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setShowProjectDialog(false);
            setEditingProject(null);
          }
        }}
        project={editingProject}
        onSave={editingProject ? handleUpdateProject : handleCreateProject}
        isLoading={createProject.isPending || updateProject.isPending}
      />

      {/* Asset Upload Dialog */}
      <Dialog open={showAssetDialog} onOpenChange={setShowAssetDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Assets</DialogTitle>
          </DialogHeader>
          <AssetUploader
            onUpload={handleUploadAsset}
            isUploading={uploadAsset.isPending}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssetDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Section Type Selector Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {SECTION_TYPES.map((type) => (
              <Card
                key={type.value}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleAddSection(type.value)}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-medium">{type.label}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Portfolio Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A longer description for your portfolio"
                rows={4}
                className="mt-1"
                disabled={!canEdit}
              />
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium">SEO Settings</label>
              <p className="text-xs text-muted-foreground mb-2">
                Customize how your portfolio appears in search results
              </p>
              <Input
                placeholder="SEO Title"
                className="mb-2"
                disabled={!canEdit}
              />
              <Textarea
                placeholder="SEO Description"
                rows={2}
                disabled={!canEdit}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this project and all its assets. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (showDeleteDialog) {
                  deleteProject.mutate(showDeleteDialog);
                  setShowDeleteDialog(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
