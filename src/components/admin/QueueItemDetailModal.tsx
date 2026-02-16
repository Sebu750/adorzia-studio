import { useQuery } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  FileImage, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Crown,
  Star,
  ExternalLink,
  Download,
  History,
  MessageSquare
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface QueueItemDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  onAction?: (id: string, action: string) => void;
}

const actionIcons: Record<string, typeof CheckCircle> = {
  approve: CheckCircle,
  approved: CheckCircle,
  reject: XCircle,
  rejected: XCircle,
  revision: AlertCircle,
  revision_requested: AlertCircle,
  start_sampling: Clock,
  generate_tech_pack: FileText,
  approve_production: CheckCircle,
  create_listing: Star,
};

const actionColors: Record<string, string> = {
  approve: "text-green-400",
  approved: "text-green-400",
  reject: "text-red-400",
  rejected: "text-red-400",
  revision: "text-amber-400",
  revision_requested: "text-amber-400",
  start_sampling: "text-blue-400",
  generate_tech_pack: "text-cyan-400",
  approve_production: "text-purple-400",
  create_listing: "text-green-400",
};

export function QueueItemDetailModal({ 
  open, 
  onOpenChange, 
  itemId,
  onAction 
}: QueueItemDetailModalProps) {
  // Fetch publication details
  const { data: publication, isLoading } = useQuery({
    queryKey: ['publication-detail', itemId],
    queryFn: async () => {
      if (!itemId) return null;

      const { data, error } = await supabase
        .from('portfolio_publications')
        .select(`
          *,
          portfolio:portfolios(
            id,
            title,
            description,
            items,
            designer_id
          )
        `)
        .eq('id', itemId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!itemId && open,
  });

  // Fetch designer profile
  const { data: designer } = useQuery({
    queryKey: ['designer-profile', publication?.portfolio?.designer_id],
    queryFn: async () => {
      if (!publication?.portfolio?.designer_id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          rank:ranks(name, revenue_share_percent)
        `)
        .eq('user_id', publication.portfolio.designer_id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!publication?.portfolio?.designer_id,
  });

  // Fetch review history
  const { data: reviewHistory } = useQuery({
    queryKey: ['publication-reviews', itemId],
    queryFn: async () => {
      if (!itemId) return [];

      const { data, error } = await supabase
        .from('publication_reviews')
        .select(`
          *,
          reviewer:profiles!publication_reviews_reviewer_id_fkey(name, avatar_url)
        `)
        .eq('publication_id', itemId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!itemId && open,
  });

  if (!itemId) return null;

  const portfolioItems = (publication?.portfolio?.items as any[]) || [];
  const submissionFiles = (publication?.submission_files as any[]) || [];
  const designMetadata = (publication?.design_metadata as any) || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-admin-coffee border-admin-chocolate max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-admin-wine-foreground flex items-center gap-3">
            <span className="truncate">{publication?.portfolio?.title || 'Loading...'}</span>
            {publication?.status && (
              <Badge 
                variant="outline" 
                className={cn(
                  "shrink-0",
                  publication.status === 'approved' && "border-green-500/30 text-green-400",
                  publication.status === 'pending' && "border-amber-500/30 text-amber-400",
                  publication.status === 'rejected' && "border-red-500/30 text-red-400"
                )}
              >
                {publication.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1">
          <div className="px-6">
            <TabsList className="bg-admin-chocolate/50 w-full justify-start">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="files"
                className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground"
              >
                Files ({portfolioItems.length + submissionFiles.length})
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground"
              >
                History ({reviewHistory?.length || 0})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(90vh-180px)]">
            {/* Details Tab */}
            <TabsContent value="details" className="p-6 pt-4 space-y-6 m-0">
              {isLoading ? (
                <div className="text-center py-8 text-admin-apricot/70">Loading details...</div>
              ) : (
                <>
                  {/* Designer Info */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-admin-chocolate/30">
                    <Avatar className="w-14 h-14 border-2 border-admin-camel/30">
                      <AvatarImage src={designer?.avatar_url || ''} />
                      <AvatarFallback className="bg-admin-wine text-admin-wine-foreground">
                        {designer?.name?.slice(0, 2).toUpperCase() || 'UN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-admin-wine-foreground">
                          {designer?.name || 'Unknown Designer'}
                        </h3>
                        {designer?.rank && (
                          <Badge className="bg-admin-camel/20 text-admin-camel border-0">
                            <Crown className="w-3 h-3 mr-1" />
                            {(designer.rank as any)?.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-admin-apricot/70 mt-1">
                        {designer?.email}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-admin-apricot/50">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {designer?.style_credits || 0} SC
                        </span>
                        <span className="capitalize">{designer?.subscription_tier || 'basic'} Plan</span>
                        {designer?.rank && (
                          <span>{(designer.rank as any)?.revenue_share_percent}% Revenue Share</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <h4 className="text-sm font-medium text-admin-apricot/70 mb-2">Description</h4>
                    <p className="text-admin-wine-foreground">
                      {publication?.portfolio?.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Design Metadata */}
                  {Object.keys(designMetadata).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-admin-apricot/70 mb-3">Design Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {designMetadata.category && (
                          <div className="p-3 rounded-lg bg-admin-chocolate/30">
                            <span className="text-xs text-admin-apricot/50 block">Category</span>
                            <span className="text-admin-wine-foreground capitalize">{designMetadata.category}</span>
                          </div>
                        )}
                        {designMetadata.style && (
                          <div className="p-3 rounded-lg bg-admin-chocolate/30">
                            <span className="text-xs text-admin-apricot/50 block">Style</span>
                            <span className="text-admin-wine-foreground">{designMetadata.style}</span>
                          </div>
                        )}
                        {designMetadata.materials && (
                          <div className="p-3 rounded-lg bg-admin-chocolate/30 col-span-2">
                            <span className="text-xs text-admin-apricot/50 block">Materials</span>
                            <span className="text-admin-wine-foreground">{designMetadata.materials}</span>
                          </div>
                        )}
                        {designMetadata.colorPalette && (
                          <div className="p-3 rounded-lg bg-admin-chocolate/30 col-span-2">
                            <span className="text-xs text-admin-apricot/50 block">Color Palette</span>
                            <span className="text-admin-wine-foreground">{designMetadata.colorPalette}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submission Info */}
                  <div>
                    <h4 className="text-sm font-medium text-admin-apricot/70 mb-3">Submission Info</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-admin-chocolate/30">
                        <span className="text-xs text-admin-apricot/50 block">Submitted</span>
                        <span className="text-admin-wine-foreground">
                          {publication?.submitted_at 
                            ? format(new Date(publication.submitted_at), 'PPP p')
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-admin-chocolate/30">
                        <span className="text-xs text-admin-apricot/50 block">Wait Time</span>
                        <span className="text-admin-wine-foreground">
                          {publication?.submitted_at 
                            ? formatDistanceToNow(new Date(publication.submitted_at))
                            : 'N/A'}
                        </span>
                      </div>
                      {publication?.source_type && (
                        <div className="p-3 rounded-lg bg-admin-chocolate/30">
                          <span className="text-xs text-admin-apricot/50 block">Source</span>
                          <span className="text-admin-wine-foreground capitalize">{publication.source_type}</span>
                        </div>
                      )}
                      {publication?.marketplace_status && (
                        <div className="p-3 rounded-lg bg-admin-chocolate/30">
                          <span className="text-xs text-admin-apricot/50 block">Production Stage</span>
                          <span className="text-admin-wine-foreground capitalize">
                            {publication.marketplace_status.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Designer Notes */}
                  {publication?.decision_notes && (
                    <div>
                      <h4 className="text-sm font-medium text-admin-apricot/70 mb-2">Designer Notes</h4>
                      <div className="p-3 rounded-lg bg-admin-chocolate/30">
                        <p className="text-admin-wine-foreground whitespace-pre-wrap">
                          {publication.decision_notes}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="p-6 pt-4 m-0">
              <div className="space-y-6">
                {/* Portfolio Items */}
                {portfolioItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-admin-apricot/70 mb-3 flex items-center gap-2">
                      <FileImage className="w-4 h-4" />
                      Portfolio Items ({portfolioItems.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {portfolioItems.map((item: any, index: number) => (
                        <div 
                          key={index}
                          className="relative group rounded-lg overflow-hidden bg-admin-chocolate/30 aspect-square"
                        >
                          {item.url || item.thumbnail ? (
                            <img 
                              src={item.url || item.thumbnail} 
                              alt={item.name || `Item ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileImage className="w-8 h-8 text-admin-apricot/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                          {item.type && (
                            <Badge 
                              className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white border-0"
                            >
                              {item.type}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submission Files */}
                {submissionFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-admin-apricot/70 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Submission Files ({submissionFiles.length})
                    </h4>
                    <div className="space-y-2">
                      {submissionFiles.map((file: any, index: number) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-admin-chocolate/30 hover:bg-admin-chocolate/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded bg-admin-wine/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-admin-camel" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-admin-wine-foreground truncate">
                              {file.name || `File ${index + 1}`}
                            </p>
                            {file.size && (
                              <p className="text-xs text-admin-apricot/50">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            )}
                          </div>
                          <Button size="sm" variant="ghost" className="text-admin-apricot hover:text-admin-wine-foreground">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {portfolioItems.length === 0 && submissionFiles.length === 0 && (
                  <div className="text-center py-12">
                    <FileImage className="w-12 h-12 mx-auto text-admin-apricot/30 mb-3" />
                    <p className="text-admin-apricot/70">No files attached to this submission</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="p-6 pt-4 m-0">
              {reviewHistory && reviewHistory.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-admin-chocolate" />
                  
                  <div className="space-y-4">
                    {reviewHistory.map((review: any, index: number) => {
                      const ActionIcon = actionIcons[review.action] || Clock;
                      const actionColor = actionColors[review.action] || "text-admin-apricot";
                      
                      return (
                        <div key={review.id} className="relative flex gap-4 pl-2">
                          {/* Timeline dot */}
                          <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10",
                            "bg-admin-coffee border-2 border-admin-chocolate"
                          )}>
                            <ActionIcon className={cn("w-3.5 h-3.5", actionColor)} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <div className="p-3 rounded-lg bg-admin-chocolate/30">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={(review.reviewer as any)?.avatar_url} />
                                    <AvatarFallback className="bg-admin-wine text-[10px] text-admin-wine-foreground">
                                      {(review.reviewer as any)?.name?.slice(0, 2).toUpperCase() || 'UN'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium text-admin-wine-foreground">
                                    {(review.reviewer as any)?.name || 'System'}
                                  </span>
                                </div>
                                <span className="text-xs text-admin-apricot/50">
                                  {format(new Date(review.created_at), 'MMM d, yyyy h:mm a')}
                                </span>
                              </div>
                              
                              <p className="text-sm text-admin-wine-foreground capitalize">
                                {review.action.replace(/_/g, ' ')}
                              </p>
                              
                              {review.notes && (
                                <div className="mt-2 p-2 rounded bg-admin-coffee/50 text-sm text-admin-apricot/70">
                                  <MessageSquare className="w-3 h-3 inline mr-1" />
                                  {review.notes}
                                </div>
                              )}
                              
                              {review.quality_rating && (
                                <div className="mt-2 flex items-center gap-1">
                                  <span className="text-xs text-admin-apricot/50">Quality:</span>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={cn(
                                        "w-3 h-3",
                                        i < review.quality_rating 
                                          ? "text-admin-camel fill-admin-camel" 
                                          : "text-admin-chocolate"
                                      )} 
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 mx-auto text-admin-apricot/30 mb-3" />
                  <p className="text-admin-apricot/70">No review history yet</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer Actions */}
        <div className="p-4 border-t border-admin-chocolate flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {onAction && itemId && (
            <Button
              onClick={() => onAction(itemId, 'Review')}
            >
              Take Action
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
