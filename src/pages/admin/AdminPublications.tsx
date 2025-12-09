import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Check,
  X,
  AlertCircle,
  Eye,
  Clock,
  FileSearch,
  Crown,
  Percent,
  Package,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier } from "@/lib/ranks";
import { PublicationStatus, PUBLICATION_STATUSES } from "@/lib/publication";
import { toast } from "sonner";

interface Publication {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  designer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    rank: RankTier;
  };
  status: PublicationStatus;
  submittedAt: string;
  lastUpdated: string;
  notes?: string;
  completeness: number;
}

// Mock publications data
const mockPublications: Publication[] = [
  {
    id: "1",
    title: "Minimalist Ring Collection",
    category: "Jewelry",
    thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    designer: {
      id: "d1",
      name: "Aria Kim",
      email: "aria.kim@email.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      rank: "senior",
    },
    status: "pending_review",
    submittedAt: "Dec 4, 2024",
    lastUpdated: "Dec 4, 2024",
    completeness: 100,
  },
  {
    id: "2",
    title: "Urban Street Style Series",
    category: "Fashion",
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
    designer: {
      id: "d2",
      name: "Marcus Chen",
      email: "marcus.chen@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rank: "designer",
    },
    status: "pending_review",
    submittedAt: "Dec 3, 2024",
    lastUpdated: "Dec 3, 2024",
    completeness: 100,
  },
  {
    id: "3",
    title: "Heritage Weave Patterns",
    category: "Textile",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    designer: {
      id: "d3",
      name: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rank: "lead",
    },
    status: "revision_requested",
    submittedAt: "Dec 1, 2024",
    lastUpdated: "Dec 2, 2024",
    notes: "Please add more detailed material specifications",
    completeness: 83,
  },
  {
    id: "4",
    title: "Avant-Garde Evening Wear",
    category: "Fashion",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
    designer: {
      id: "d4",
      name: "James Park",
      email: "james.park@email.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      rank: "senior",
    },
    status: "sampling",
    submittedAt: "Nov 28, 2024",
    lastUpdated: "Dec 5, 2024",
    completeness: 100,
  },
  {
    id: "5",
    title: "Coastal Jewelry Concept",
    category: "Jewelry",
    thumbnail: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    designer: {
      id: "d5",
      name: "Elena Rodriguez",
      email: "elena.rod@email.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      rank: "designer",
    },
    status: "marketplace_pending",
    submittedAt: "Nov 20, 2024",
    lastUpdated: "Dec 6, 2024",
    completeness: 100,
  },
];

const statusTabs = [
  { value: "all", label: "All", count: 5 },
  { value: "pending_review", label: "Pending Review", count: 2 },
  { value: "revision_requested", label: "Revision Requested", count: 1 },
  { value: "approved", label: "Approved", count: 0 },
  { value: "sampling", label: "In Sampling", count: 1 },
  { value: "marketplace_pending", label: "Marketplace Prep", count: 1 },
];

const AdminPublications = () => {
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'revision' | 'reject' | null>(null);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const handleAction = (pub: Publication, action: 'approve' | 'revision' | 'reject') => {
    setSelectedPub(pub);
    setActionType(action);
    setRevisionNotes("");
    setRejectReason("");
  };

  const confirmAction = () => {
    if (!selectedPub || !actionType) return;

    if (actionType === 'approve') {
      toast.success(`"${selectedPub.title}" approved for sampling`, {
        description: `Designer ${selectedPub.designer.name} will be notified.`
      });
    } else if (actionType === 'revision') {
      toast.info(`Revision requested for "${selectedPub.title}"`, {
        description: "Designer will receive the feedback."
      });
    } else if (actionType === 'reject') {
      toast.error(`"${selectedPub.title}" rejected`, {
        description: "Designer will be notified with the reason."
      });
    }

    setSelectedPub(null);
    setActionType(null);
  };

  const getStatusColor = (status: PublicationStatus) => {
    switch (status) {
      case 'pending_review': return 'bg-warning/10 text-warning border-warning/30';
      case 'revision_requested': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'approved': return 'bg-success/10 text-success border-success/30';
      case 'sampling': return 'bg-accent/10 text-accent border-accent/30';
      case 'marketplace_pending': return 'bg-admin-wine/10 text-admin-wine border-admin-wine/30';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <AdminLayout userRole="superadmin">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Publication Queue
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage designer publication requests
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search submissions..." className="pl-10" />
          </div>
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="textile">Textile</SelectItem>
              <SelectItem value="jewelry">Jewelry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            {statusTabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground gap-2"
              >
                {tab.label}
                <Badge variant="outline" className="text-xs px-1.5">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {mockPublications.map((pub) => (
              <Card key={pub.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 h-48 md:h-auto shrink-0">
                      <img 
                        src={pub.thumbnail} 
                        alt={pub.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-3">
                          {/* Title & Category */}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display text-xl font-semibold">
                                {pub.title}
                              </h3>
                              <Badge variant="outline">{pub.category}</Badge>
                              <Badge 
                                variant="outline"
                                className={cn(getStatusColor(pub.status))}
                              >
                                {PUBLICATION_STATUSES[pub.status].label}
                              </Badge>
                            </div>
                          </div>

                          {/* Designer Info */}
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={pub.designer.avatar} />
                              <AvatarFallback>{pub.designer.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{pub.designer.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Crown className="h-3 w-3" />
                                <span>{RANKS[pub.designer.rank].name}</span>
                                <span>•</span>
                                <Percent className="h-3 w-3" />
                                <span>{RANKS[pub.designer.rank].revenueShare}% share</span>
                              </div>
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              Submitted {pub.submittedAt}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FileSearch className="h-4 w-4" />
                              {pub.completeness}% complete
                            </div>
                          </div>

                          {/* Existing Notes */}
                          {pub.notes && (
                            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                              <p className="text-sm text-orange-600">
                                <strong>Previous feedback:</strong> {pub.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1.5"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          
                          {(pub.status === 'pending_review' || pub.status === 'revision_requested') && (
                            <>
                              <Button 
                                size="sm" 
                                className="gap-1.5 bg-success hover:bg-success/90"
                                onClick={() => handleAction(pub, 'approve')}
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1.5 text-warning border-warning/30 hover:bg-warning/10"
                                onClick={() => handleAction(pub, 'revision')}
                              >
                                <AlertCircle className="h-4 w-4" />
                                Request Revision
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={() => handleAction(pub, 'reject')}
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}

                          {pub.status === 'sampling' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-1.5"
                            >
                              <Package className="h-4 w-4" />
                              Update Sampling
                            </Button>
                          )}

                          {pub.status === 'marketplace_pending' && (
                            <Button 
                              size="sm" 
                              className="gap-1.5 bg-admin-wine hover:bg-admin-wine/90"
                            >
                              <Store className="h-4 w-4" />
                              Prepare Listing
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Other tab contents would filter by status */}
          {statusTabs.slice(1).map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="text-center py-12 text-muted-foreground">
                <FileSearch className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Filtered view for {tab.label}</p>
                <p className="text-sm">{tab.count} items</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve for Sampling'}
              {actionType === 'revision' && 'Request Revision'}
              {actionType === 'reject' && 'Reject Submission'}
            </DialogTitle>
            <DialogDescription>
              {selectedPub && (
                <span>
                  {actionType === 'approve' && `Approve "${selectedPub.title}" by ${selectedPub.designer.name} for sampling.`}
                  {actionType === 'revision' && `Request changes for "${selectedPub.title}" by ${selectedPub.designer.name}.`}
                  {actionType === 'reject' && `Reject "${selectedPub.title}" by ${selectedPub.designer.name}. This cannot be undone.`}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {actionType === 'revision' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Revision Notes (Required)</label>
              <Textarea
                placeholder="Explain what changes are needed..."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {actionType === 'reject' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason (Required)</label>
              <Textarea
                placeholder="Explain why this submission is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAction}
              disabled={
                (actionType === 'revision' && !revisionNotes.trim()) ||
                (actionType === 'reject' && !rejectReason.trim())
              }
              className={cn(
                actionType === 'approve' && "bg-success hover:bg-success/90",
                actionType === 'revision' && "bg-warning hover:bg-warning/90 text-warning-foreground",
                actionType === 'reject' && "bg-destructive hover:bg-destructive/90"
              )}
            >
              {actionType === 'approve' && 'Approve'}
              {actionType === 'revision' && 'Send Revision Request'}
              {actionType === 'reject' && 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPublications;
