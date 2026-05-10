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
  if (!supabase) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `site-assets/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('assets') // Assuming a bucket named 'assets' exists or will be created
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
  return data.publicUrl;
};

