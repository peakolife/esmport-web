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
      let normalizedUrl = supabaseUrl.trim();
      
      // 1. Remove any protocol if present for clean processing
      const hasProtocol = normalizedUrl.startsWith('http');
      let pureUrl = hasProtocol ? normalizedUrl.replace(/^https?:\/\//, '') : normalizedUrl;
      
      // 2. Remove any accidental trailing paths like /rest/v1, /storage/v1, etc.
      // These are added automatically by the SDK, including them in the base URL breaks paths.
      pureUrl = pureUrl.split('/')[0]; 
      
      // 3. Handle project reference only (e.g. "abc-xyz")
      if (!pureUrl.includes('.')) {
        pureUrl = `${pureUrl}.supabase.co`;
      }
      
      // 4. Final reconstruction
      normalizedUrl = `https://${pureUrl}`;
      
      console.log("Initializing Supabase with URL:", normalizedUrl);
        
      new URL(normalizedUrl);
      supabaseInstance = createClient(normalizedUrl, supabaseAnonKey);
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

  // Clean file name and generate a safe path
  const fileExt = file.name.split('.').pop() || 'png';
  const safeName = file.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `${Date.now()}_${safeName}.${fileExt}`;
  
  // Use a direct path - some Supabase configs prefer no folders or specific ones
  const filePath = fileName;

  try {
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting same-named files if needed
      });

    if (uploadError) {
      console.error('Supabase upload error details:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err: any) {
    console.error('Error in uploadImage:', err);
    throw err;
  }
};

