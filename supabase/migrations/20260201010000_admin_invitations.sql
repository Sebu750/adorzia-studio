-- Create admin invitations table for superadmin invite functionality
-- This table tracks admin invitations and their status

CREATE TABLE IF NOT EXISTS public.admin_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'superadmin')),
    invited_by UUID REFERENCES auth.users(id) NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    accepted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Superadmins can manage all invitations
CREATE POLICY "Superadmins can manage admin invitations" 
ON public.admin_invitations 
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'superadmin'
    )
);

-- Admins can view invitations (for transparency)
CREATE POLICY "Admins can view admin invitations" 
ON public.admin_invitations 
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'superadmin')
    )
);

-- Create index for performance
CREATE INDEX idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX idx_admin_invitations_status ON public.admin_invitations(status);
CREATE INDEX idx_admin_invitations_expires ON public.admin_invitations(expires_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_admin_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_invitations_updated_at_trigger
    BEFORE UPDATE ON public.admin_invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_invitations_updated_at();

-- Create function to clean up expired invitations
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_invitations()
RETURNS void AS $$
BEGIN
    UPDATE public.admin_invitations 
    SET status = 'expired'
    WHERE expires_at < NOW() 
    AND status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON TABLE public.admin_invitations IS 'Tracks admin invitations sent by superadmins';
COMMENT ON COLUMN public.admin_invitations.role IS 'The role to assign when invitation is accepted';
COMMENT ON COLUMN public.admin_invitations.status IS 'Current status of the invitation';
COMMENT ON COLUMN public.admin_invitations.expires_at IS 'When the invitation expires (default 7 days)';

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_invitations TO authenticated;
GRANT USAGE ON SEQUENCE admin_invitations_id_seq TO authenticated;

RAISE NOTICE 'Admin invitations table created successfully';
RAISE NOTICE 'Superadmins can now invite new administrators with role assignment';