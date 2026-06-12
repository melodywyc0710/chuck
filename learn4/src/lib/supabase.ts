import { createClient } from '@supabase/supabase-js';

// These are baked in at build time by Vite from Vercel environment variables
const url = (import.meta.env.VITE_SUPABASE_URL ?? '') as string;
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '') as string;

export const supabaseConfigured = url.length > 10 && key.length > 10;

export const supabase = createClient(
  supabaseConfigured ? url : 'https://placeholder.supabase.co',
  supabaseConfigured ? key : 'placeholder-key-for-build',
);
