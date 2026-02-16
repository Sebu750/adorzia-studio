import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
=======
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { useToast } from "@/hooks/use-toast";
import { Save, X, Loader2, Crown, Sparkles } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Rank = Database["public"]["Tables"]["ranks"]["Row"];

interface DesignerWithRank extends Profile {
  ranks?: Rank | null;
}

interface DesignerRankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designer: DesignerWithRank;
  ranks: Rank[];
}

export function DesignerRankModal({ 
  open, 
  onOpenChange, 
  designer, 
  ranks 
}: DesignerRankModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    rank_id: designer.rank_id || "",
<<<<<<< HEAD
    style_credits: designer.style_credits || 0,
=======
    xp: designer.xp || 0,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    status: designer.status || "active",
    notes: "",
  });

  const selectedRank = ranks.find(r => r.id === formData.rank_id);

  useEffect(() => {
    setFormData({
      rank_id: designer.rank_id || "",
<<<<<<< HEAD
      style_credits: designer.style_credits || 0,
=======
      xp: designer.xp || 0,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      status: designer.status || "active",
      notes: "",
    });
  }, [designer]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          rank_id: formData.rank_id || null,
<<<<<<< HEAD
          style_credits: formData.style_credits,
=======
          xp: formData.xp,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          status: formData.status as "active" | "suspended" | "inactive",
        })
        .eq("id", designer.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-designers-rankings"] });
      toast({
        title: "Designer updated",
        description: "Rank and XP changes have been saved.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update designer. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Crown className="h-5 w-5 text-admin-camel" />
            Edit Designer Rank
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Designer Info (Read-only) */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-1">
            <p className="font-medium">{designer.name || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">{designer.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{designer.category} Designer</p>
          </div>

          {/* Rank Selection */}
          <div className="space-y-2">
            <Label>Rank</Label>
            <Select 
              value={formData.rank_id} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, rank_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent>
                {ranks.map(rank => (
                  <SelectItem key={rank.id} value={rank.id}>
                    <div className="flex items-center gap-2">
                      <span>{rank.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({rank.revenue_share_percent}%)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRank && (
              <p className="text-xs text-muted-foreground">
                Revenue Share: {selectedRank.revenue_share_percent}% | 
                Priority Queue: {selectedRank.priority_queue ? "Yes" : "No"}
              </p>
            )}
          </div>

<<<<<<< HEAD
          {/* SC */}
          <div className="space-y-2">
            <Label htmlFor="style_credits" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-admin-camel" />
              SC
            </Label>
            <Input
              id="style_credits"
              type="number"
              min={0}
              value={formData.style_credits}
              onChange={(e) => setFormData(prev => ({ ...prev, style_credits: parseInt(e.target.value) || 0 }))}
            />
            <p className="text-xs text-muted-foreground">
              Manually adjust SC for special circumstances
=======
          {/* XP Points */}
          <div className="space-y-2">
            <Label htmlFor="xp" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-admin-camel" />
              XP Points
            </Label>
            <Input
              id="xp"
              type="number"
              min={0}
              value={formData.xp}
              onChange={(e) => setFormData(prev => ({ ...prev, xp: parseInt(e.target.value) || 0 }))}
            />
            <p className="text-xs text-muted-foreground">
              Manually adjust XP for special circumstances
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
            </p>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as "active" | "suspended" | "inactive" }))}
            >
              <SelectTrigger>
                <SelectValue />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Reason for rank change, XP adjustment, etc."
              className="min-h-[80px]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="bg-admin-wine hover:bg-admin-wine/90"
          >
            {updateMutation.isPending 
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              : <Save className="h-4 w-4 mr-2" />
            }
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
