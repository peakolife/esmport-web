import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  try {
    if (!supabaseInstance) {
      // Basic URL validation
      new URL(supabaseUrl);
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseInstance;
  } catch (err) {
    console.error("Supabase initialization failed:", err);
    return null;
  }
};

