
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Try to get environment variables, with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Create a warning for missing variables in development
if (isDevelopment && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn(
    'Supabase environment variables are missing. Using fallback values for development. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
}

// Create the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

export const getServerTimestamp = () => new Date().toISOString();
