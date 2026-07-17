import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, Pet } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  pet: Pet | null;
  loading: boolean;
}

interface AuthActions {
  init: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshPet: () => Promise<void>;
  updatePet: (updates: Partial<Pet> | Pet) => Promise<void>;
  setPetLocal: (pet: Pet) => void;
  setProfileLocal: (profile: Profile) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  pet: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await loadUserData(session.user.id, set);
    }
    set({ session, user: session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        await loadUserData(session.user.id, set);
      } else {
        set({ profile: null, pet: null });
      }
    });
  },

  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (!data.user) return 'Signup failed';

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, username });
    if (profileError) return profileError.message;

    return null;
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null, pet: null });
  },

  refreshPet: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) set({ pet: data });
  },

  setPetLocal: (pet) => set({ pet }),
  setProfileLocal: (profile) => set({ profile }),

  updatePet: async (updates) => {
    const { user, pet } = get();
    if (!user || !pet) return;
    const { data } = await supabase
      .from('pets')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) set({ pet: data });
  },
}));

async function loadUserData(userId: string, set: (state: Partial<AuthState>) => void) {
  const [{ data: profile }, { data: pet }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('pets').select('*').eq('user_id', userId).single(),
  ]);
  set({ profile: profile ?? null, pet: pet ?? null });
}
