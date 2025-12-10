-- Add is_walkthrough flag to styleboxes table
ALTER TABLE public.styleboxes 
ADD COLUMN is_walkthrough boolean NOT NULL DEFAULT false;

-- Add walkthrough-specific fields
ALTER TABLE public.styleboxes 
ADD COLUMN steps jsonb DEFAULT '[]'::jsonb;

-- Create walkthrough progress table to track step completion
CREATE TABLE public.walkthrough_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  designer_id uuid NOT NULL,
  stylebox_id uuid NOT NULL REFERENCES public.styleboxes(id) ON DELETE CASCADE,
  current_step integer NOT NULL DEFAULT 0,
  completed_steps jsonb DEFAULT '[]'::jsonb,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  added_to_portfolio boolean NOT NULL DEFAULT false,
  UNIQUE(designer_id, stylebox_id)
);

-- Enable RLS
ALTER TABLE public.walkthrough_progress ENABLE ROW LEVEL SECURITY;

-- Designers can view their own progress
CREATE POLICY "Designers can view own progress"
ON public.walkthrough_progress
FOR SELECT
USING (designer_id = auth.uid());

-- Designers can create their own progress
CREATE POLICY "Designers can create own progress"
ON public.walkthrough_progress
FOR INSERT
WITH CHECK (designer_id = auth.uid());

-- Designers can update their own progress
CREATE POLICY "Designers can update own progress"
ON public.walkthrough_progress
FOR UPDATE
USING (designer_id = auth.uid());

-- Designers can delete their own progress
CREATE POLICY "Designers can delete own progress"
ON public.walkthrough_progress
FOR DELETE
USING (designer_id = auth.uid());

-- Admins can manage all progress
CREATE POLICY "Admins can manage all progress"
ON public.walkthrough_progress
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));