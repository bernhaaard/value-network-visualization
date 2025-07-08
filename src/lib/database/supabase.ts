import { createClient } from '@supabase/supabase-js';

// Optional Supabase setup - configure when ready for database features
// Add to .env.local when needed:
// NEXT_PUBLIC_SUPABASE_URL=your_project_url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if environment variables are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Basic type placeholder - extend when adding database schema
export type Database = Record<string, any>;
