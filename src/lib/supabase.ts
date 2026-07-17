import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      pets: {
        Row: Pet;
        Insert: Omit<Pet, 'id' | 'created_at'>;
        Update: Partial<Omit<Pet, 'id' | 'user_id' | 'created_at'>>;
      };
      promises: {
        Row: Promise_;
        Insert: Omit<Promise_, 'id' | 'created_at'>;
        Update: Partial<Omit<Promise_, 'id' | 'user_id' | 'created_at'>>;
      };
      completions: {
        Row: Completion;
        Insert: Omit<Completion, 'id' | 'completed_at'>;
        Update: never;
      };
      friendships: {
        Row: Friendship;
        Insert: Omit<Friendship, 'id' | 'created_at'>;
        Update: Partial<Pick<Friendship, 'status'>>;
      };
      witness_requests: {
        Row: WitnessRequest;
        Insert: Omit<WitnessRequest, 'id' | 'created_at'>;
        Update: Partial<Pick<WitnessRequest, 'status'>>;
      };
    };
  };
};

export interface Profile {
  id: string;
  username: string;
  subscription_tier: 'free' | 'plus' | 'pro';
  created_at: string;
}

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: string;
  color_seed: number;        // 0-360 hue, generates unique color
  personality_trait: string; // from onboarding quiz
  level: number;
  xp: number;
  xp_to_next: number;
  happiness: number;         // 0-100
  streak: number;
  streak_freeze_count: number;
  last_active_date: string;  // YYYY-MM-DD
  costume_slot: string | null;
  unlocked_costumes: string[];
  hatched: boolean;
  trait_points_available: number;
  trait_strength: number;
  trait_intelligence: number;
  trait_agility: number;
  trait_speed: number;
  created_at: string;
}

export type TraitKey = 'trait_strength' | 'trait_intelligence' | 'trait_agility' | 'trait_speed';
export type GoalCategory = 'strength' | 'intelligence' | 'agility' | 'speed' | 'general';

export interface Promise_ {
  id: string;
  user_id: string;
  title: string;
  category: GoalCategory;
  frequency: 'daily' | 'weekly';
  verify_method: 'timer' | 'photo' | 'location' | 'friend';
  timer_duration_mins: number | null;
  active: boolean;
  created_at: string;
}

export interface Completion {
  id: string;
  user_id: string;
  promise_id: string;
  date_key: string;          // YYYY-MM-DD
  proof_type: string;
  proof_url: string | null;
  verified_by: string | null; // friend user_id if witnessed
  completed_at: string;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
}

export interface WitnessRequest {
  id: string;
  completion_id: string;
  requester_id: string;
  witness_id: string;
  status: 'pending' | 'confirmed' | 'denied';
  created_at: string;
}
