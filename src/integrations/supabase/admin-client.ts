import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Custom storage adapter with admin-specific prefix to isolate admin sessions
const adminStorage = {
  getItem: (key: string) => localStorage.getItem(`admin:${key}`),
  setItem: (key: string, value: string) => localStorage.setItem(`admin:${key}`, value),
  removeItem: (key: string) => localStorage.removeItem(`admin:${key}`),
};

// Separate Supabase client for Admin app with isolated storage
// This ensures Admin and Studio sessions are completely independent
export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: adminStorage,
      storageKey: 'admin-auth-token',
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
