import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWizardContext } from "../WizardContext";
import { format, addDays, addWeeks } from "date-fns";
import { CalendarIcon, Clock, Send, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

interface TimelineTabProps {
  onSave: (publishNow: boolean) => void;
  isLoading: boolean;
}

export function TimelineTab({ onSave, isLoading }: TimelineTabProps) {
  const { formData, updateFormData, isEditing } = useWizardContext();

  const setQuickDeadline = (days: number) => {
    const deadline = addDays(new Date(), days);
    updateFormData("submission_deadline", deadline.toISOString());
  };

  const parseDate = (value: string | Date | undefined): Date | undefined => {
    if (!value) return undefined;
    return typeof value === "string" ? new Date(value) : value;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Timeline & Publish</h3>
        <p className="text-sm text-muted-foreground">
          Set deadlines, access restrictions, and publish the StyleBox
        </p>
      </div>

      {/* Submission Deadline */}
      <div className="space-y-3">
        <Label>Submission Deadline</Label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setQuickDeadline(7)}>
            1 Week
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setQuickDeadline(14)}>
            2 Weeks
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setQuickDeadline(30)}>
            1 Month
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setQuickDeadline(60)}>
            2 Months
          </Button>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.submission_deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.submission_deadline ? (
                format(parseDate(formData.submission_deadline)!, "PPP")
              ) : (
                "Pick a deadline date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
            <Calendar
              mode="single"
              selected={parseDate(formData.submission_deadline)}
              onSelect={(date) => updateFormData("submission_deadline", date?.toISOString())}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Release Date */}
      <div className="space-y-2">
        <Label>Release Date (Optional)</Label>
        <p className="text-xs text-muted-foreground">
          Schedule when this StyleBox becomes visible to designers
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.release_date && "text-muted-foreground"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              {formData.release_date ? (
                format(parseDate(formData.release_date)!, "PPP")
              ) : (
                "Publish immediately when activated"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
            <Calendar
              mode="single"
              selected={parseDate(formData.release_date)}
              onSelect={(date) => updateFormData("release_date", date?.toISOString())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Access Restrictions */}
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <Label className="text-sm font-medium">Access Restrictions</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Required Subscription Tier</Label>
            <Select
              value={formData.required_subscription_tier || ""}
              onValueChange={(v) => updateFormData("required_subscription_tier", v as SubscriptionTier || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="No restriction" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Required Rank Order</Label>
            <Input
              type="number"
              min={0}
              max={7}
              value={formData.required_rank_order ?? ""}
              onChange={(e) => updateFormData("required_rank_order", parseInt(e.target.value) || undefined)}
              placeholder="No restriction"
            />
            <p className="text-xs text-muted-foreground">
              0 = F1, 1 = F2, 2 = Novice, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 border rounded-lg space-y-3">
        <Label className="text-sm font-medium">Summary</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Category</p>
            <p className="font-medium capitalize">{formData.category}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Difficulty</p>
            <Badge variant="secondary" className="capitalize">{formData.difficulty}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground">SC Reward</p>
            <p className="font-medium">{formData.xp_reward || 100} SC</p>
          </div>
          <div>
            <p className="text-muted-foreground">Deliverables</p>
            <p className="font-medium">{formData.deliverables.length} items</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {isEditing ? "Update this StyleBox" : "Create a new StyleBox"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSave(false)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => onSave(true)}
            disabled={isLoading}
            className="bg-admin-wine hover:bg-admin-wine/90"
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Publish Now
          </Button>
        </div>
      </div>
    </div>
  );
}
