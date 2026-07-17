import { supabase } from './supabase';
import type { Pet } from './supabase';

const XP_PER_COMPLETION = 20;
const HAPPINESS_PER_COMPLETION = 8;
const HAPPINESS_DECAY_PER_MISSED_DAY = 12;
const MAX_HAPPINESS = 100;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  if (!a) return 0;
  const msPerDay = 86400000;
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

/**
 * Called after a promise is completed. Updates XP, happiness, streak, level.
 * Returns the updated pet row.
 */
export async function recordCompletion(pet: Pet, userId: string): Promise<Pet | null> {
  const todayStr = today();
  const missed = daysBetween(pet.last_active_date, todayStr);

  // Decay happiness for missed days (cap decay so it doesn't go below 5)
  const decayedHappiness = Math.max(5, pet.happiness - Math.max(0, missed - 1) * HAPPINESS_DECAY_PER_MISSED_DAY);

  // New happiness after completing
  const newHappiness = Math.min(MAX_HAPPINESS, decayedHappiness + HAPPINESS_PER_COMPLETION);

  // Streak logic
  let newStreak = pet.streak;
  if (pet.last_active_date === todayStr) {
    // Already logged today — don't increment streak again
    newStreak = pet.streak;
  } else if (missed <= 1) {
    newStreak = pet.streak + 1;
  } else {
    // Missed days — check for streak freeze
    if (pet.streak_freeze_count > 0) {
      newStreak = pet.streak; // freeze used, keep streak
      await supabase
        .from('pets')
        .update({ streak_freeze_count: pet.streak_freeze_count - 1 })
        .eq('user_id', userId);
    } else {
      newStreak = 1; // reset
    }
  }

  // XP + level up
  let newXp = pet.xp + XP_PER_COMPLETION;
  let newLevel = pet.level;
  let newXpToNext = pet.xp_to_next;

  while (newXp >= newXpToNext) {
    newXp -= newXpToNext;
    newLevel += 1;
    newXpToNext = Math.round(newXpToNext * 1.3); // each level costs 30% more
  }

  // Award 1 trait point per completion
  const newTraitPoints = pet.trait_points_available + 1;

  const updates = {
    happiness: newHappiness,
    xp: newXp,
    level: newLevel,
    xp_to_next: newXpToNext,
    streak: newStreak,
    last_active_date: todayStr,
    trait_points_available: newTraitPoints,
  };

  const { data } = await supabase
    .from('pets')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  return data ?? null;
}

/**
 * Applies passive happiness decay based on inactivity.
 * Call this on app load.
 */
export async function applyDecayIfNeeded(pet: Pet, userId: string): Promise<Pet | null> {
  const todayStr = today();
  const missed = daysBetween(pet.last_active_date, todayStr);
  if (missed < 2) return null; // no decay needed

  const decayed = Math.max(5, pet.happiness - (missed - 1) * HAPPINESS_DECAY_PER_MISSED_DAY);
  if (decayed === pet.happiness) return null;

  const { data } = await supabase
    .from('pets')
    .update({ happiness: decayed })
    .eq('user_id', userId)
    .select()
    .single();

  return data ?? null;
}
