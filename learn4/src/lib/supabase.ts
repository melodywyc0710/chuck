import { createClient } from '@supabase/supabase-js';

// These are baked in at build time by Vite from Vercel environment variables
const url = (import.meta.env.VITE_SUPABASE_URL ?? '') as string;
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '') as string;

export const supabaseConfigured = url.length > 10 && key.length > 10;

// Give each tab a unique ID so Supabase sessions are fully isolated per tab
const tabId = (() => {
  const existing = sessionStorage.getItem('chucky-tab-id');
  if (existing) return existing;
  const id = Math.random().toString(36).slice(2);
  sessionStorage.setItem('chucky-tab-id', id);
  return id;
})();

export const supabase = createClient(
  supabaseConfigured ? url : 'https://placeholder.supabase.co',
  supabaseConfigured ? key : 'placeholder-key-for-build',
  {
    auth: {
      storage: sessionStorage,
      storageKey: `chucky-auth-${tabId}`,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
