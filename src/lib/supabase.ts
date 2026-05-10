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

export const uploadImage = async (file: File) => {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase client not initialized. Check your environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).");
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  
  // Try uploading directly to the bucket root first for better compatibility
  const filePath = fileName;

  try {
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error details:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err: any) {
    console.error('Error in uploadImage:', err);
    throw err; // Re-throw to handle in UI
  }
};

