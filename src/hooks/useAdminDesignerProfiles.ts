import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/integrations/supabase/admin-client';

export interface DesignerProfile {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  brand_name: string;
  category: string;
  status: string;
  role: string;
  is_approved: boolean;
  is_featured: boolean;
  approved_at?: string;
  approved_by?: string;
  featured_at?: string;
  featured_by?: string;
  created_at: string;
  last_login_at?: string;
}

export const useAdminDesignerProfiles = () => {
  const [profiles, setProfiles] = useState<DesignerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select(`
          user_id,
          name,
          email,
          avatar_url,
          bio,
          brand_name,
          category,
          status,
          role,
          is_approved,
          is_featured,
          approved_at,
          approved_by,
          featured_at,
          featured_by,
          created_at,
          last_login_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProfiles(data || []);
    } catch (err: any) {
      console.error('Error loading designer profiles:', err);
      setError(err.message || 'Failed to load designer profiles');
    } finally {
      setLoading(false);
    }
  };

  const updateProfileApproval = async (userId: string, isApproved: boolean) => {
    try {
      // Get the current admin ID
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('Admin session not found');
      }
      
      const adminId = session.user.id;
      const action = isApproved ? 'approve' : 'unapprove';
      
      // Call the Supabase edge function using the Supabase client
      const { data, error } = await supabaseAdmin.functions.invoke('profile-management', {
        body: {
          userId,
          action,
          adminId
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to update profile approval');
      }

      // Reload profiles after successful update
      await loadProfiles();
      
      return { success: true };
    } catch (err: any) {
      console.error(`Error updating profile approval:`, err);
      throw new Error(err.message || 'Failed to update profile approval');
    }
  };

  const updateProfileFeatureStatus = async (userId: string, isFeatured: boolean) => {
    try {
      // Get the current admin ID
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('Admin session not found');
      }
      
      const adminId = session.user.id;
      const action = isFeatured ? 'feature' : 'unfeature';
      
      // Call the Supabase edge function using the Supabase client
      const { data, error } = await supabaseAdmin.functions.invoke('profile-management', {
        body: {
          userId,
          action,
          adminId
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to update profile feature status');
      }

      // Reload profiles after successful update
      await loadProfiles();
      
      return { success: true };
    } catch (err: any) {
      console.error(`Error updating profile feature status:`, err);
      throw new Error(err.message || 'Failed to update profile feature status');
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    loadProfiles,
    updateProfileApproval,
    updateProfileFeatureStatus
  };
};