import { createClient } from '@supabase/supabase-js';

// Make sure to add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;