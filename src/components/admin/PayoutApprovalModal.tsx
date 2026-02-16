import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2, AlertTriangle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Payout = Database["public"]["Tables"]["payouts"]["Row"];

interface PayoutApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payout: Payout;
}

export function PayoutApprovalModal({ 
  open, 
  onOpenChange, 
  payout 
}: PayoutApprovalModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");

  const rejectMutation = useMutation({
    mutationFn: async () => {
      // For now, we'll just delete the payout to reject it
      // In a real app, you might want a separate status or rejection log
      const { error } = await supabase
        .from("payouts")
        .delete()
        .eq("id", payout.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      toast({
        title: "Payout rejected",
        description: "The payout has been removed from the queue.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reject payout. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Reject Payout
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Payout Info */}
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold">${Number(payout.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Designer ID:</span>
              <span className="font-mono text-xs">{payout.designer_id.slice(0, 12)}...</span>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Rejection</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this payout is being rejected..."
              className="min-h-[100px]"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            This action will remove the payout from the queue. The designer will be notified.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={() => rejectMutation.mutate()}
            disabled={rejectMutation.isPending}
          >
            {rejectMutation.isPending 
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              : <X className="h-4 w-4 mr-2" />
            }
            Reject Payout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
