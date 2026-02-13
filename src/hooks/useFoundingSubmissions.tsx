import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FoundingArticle {
  name: string;
  category: string;
  fabric_material: string;
  colors: string;
  size_range: string;
  estimated_price: number;
  timeline: string;
  description: string;
  images: string[];
}

export interface FoundingSubmission {
  id: string;
  designer_id: string;
  collection_name: string;
  design_philosophy: string;
  designer_vision_statement: string;
  primary_category: 'menswear' | 'womenswear' | 'unisex' | 'accessories';
  moodboard_files: string[];
  tech_pack_files: string[];
  articles: FoundingArticle[];
  estimated_articles: number;
  proposed_materials: string;
  target_seasonal_launch: 'spring_summer' | 'fall_winter' | 'festive_eid';
  originality_certified: boolean;
  program_terms_accepted: boolean;
  is_draft: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'revisions_required';
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  admin_feedback: string | null;
  internal_notes: string | null;
  rejection_reason: string | null;
  status_history: any[];
  created_at: string;
  updated_at: string;
}

export interface FoundingSubmissionInput {
  collection_name: string;
  design_philosophy: string;
  designer_vision_statement: string;
  primary_category: 'menswear' | 'womenswear' | 'unisex' | 'accessories';
  moodboard_files: string[];
  tech_pack_files: string[];
  articles: FoundingArticle[];
  estimated_articles: number;
  proposed_materials: string;
  target_seasonal_launch: 'spring_summer' | 'fall_winter' | 'festive_eid';
  originality_certified: boolean;
  program_terms_accepted: boolean;
  is_draft: boolean;
}

export function useFoundingSubmissions() {
  return useQuery<FoundingSubmission[]>({
    queryKey: ['founding-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('founding_designers_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as FoundingSubmission[];
    },
  });
}

export function useCreateFoundingSubmission() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: FoundingSubmissionInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('founding_designers_submissions')
        .insert({
          designer_id: user.id,
          ...input,
          submitted_at: input.is_draft ? null : new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['founding-submissions'] });
      if (!variables.is_draft) {
        toast({
          title: "Submission Received!",
          description: "Our creative directors are reviewing your vision. You will receive a status update within 7 working days.",
        });
      } else {
        toast({
          title: "Draft Saved",
          description: "You can return and complete your submission anytime.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFoundingSubmission() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<FoundingSubmissionInput> }) => {
      const updateData: any = { ...input };
      
      // If moving from draft to submitted
      if (input.is_draft === false) {
        updateData.submitted_at = new Date().toISOString();
        updateData.status = 'pending';
      }

      const { data, error } = await supabase
        .from('founding_designers_submissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['founding-submissions'] });
      if (variables.input.is_draft === false) {
        toast({
          title: "Submission Updated!",
          description: "Your revised vision has been received.",
        });
      } else {
        toast({
          title: "Changes Saved",
          description: "Draft updated successfully.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export async function uploadFoundingFile(
  file: File,
  type: 'moodboard' | 'techpack'
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('founding-submissions')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('founding-submissions')
    .getPublicUrl(fileName);

  return publicUrl;
}
