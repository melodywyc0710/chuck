import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BADGES } from '../data/badges';
import { saveSessionResult, fetchProfile, fetchStudentResults, saveGameState } from '../lib/db';
import type { GameState } from '../lib/db';

// ── Player Level System ────────────────────────────────────────────────────
// Level is derived from lifetimeStarsEarned (never decreases).
export const PLAYER_LEVELS = [
  { level: 1,  minStars: 0,     label: 'Seedling',     emoji: '🌱' },
  { level: 2,  minStars: 50,    label: 'Explorer',     emoji: '🔍' },
  { level: 3,  minStars: 130,   label: 'Scholar',      emoji: '📖' },
  { level: 4,  minStars: 260,   label: 'Achiever',     emoji: '🎯' },
  { level: 5,  minStars: 450,   label: 'Champion',     emoji: '🏅' },
  { level: 6,  minStars: 700,   label: 'Expert',       emoji: '💡' },
  { level: 7,  minStars: 1050,  label: 'Master',       emoji: '🏆' },
  { level: 8,  minStars: 1500,  label: 'Elite',        emoji: '💫' },
  { level: 9,  minStars: 2100,  label: 'Legend',       emoji: '⚡' },
  { level: 10, minStars: 2900,  label: 'Myth',         emoji: '🌟' },
  { level: 11, minStars: 3900,  label: 'Titan',        emoji: '🔥' },
  { level: 12, minStars: 5100,  label: 'Cosmic',       emoji: '🌙' },
  { level: 13, minStars: 6600,  label: 'Divine',       emoji: '✨' },
  { level: 14, minStars: 8500,  label: 'Immortal',     emoji: '💎' },
  { level: 15, minStars: 11000, label: 'Transcendent', emoji: '🌈' },
  { level: 16, minStars: 14000, label: 'Celestial',    emoji: '🌠' },
  { level: 17, minStars: 18000, label: 'Galactic',     emoji: '🪐' },
  { level: 18, minStars: 23000, label: 'Universal',    emoji: '🚀' },
  { level: 19, minStars: 29000, label: 'Infinite',     emoji: '∞' },
  { level: 20, minStars: 36000, label: 'Legendary',    emoji: '👑' },
] as const;

export function getPlayerLevel(lifetimeStars: number): number {
  let level = 1;
  for (const tier of PLAYER_LEVELS) {
    if (lifetimeStars >= tier.minStars) level = tier.level;
    else break;
  }
  return level;
}

// ── Farm Animal Config ──────────────────────────────────────────────────────
export const FARM_ANIMAL_CONFIG: Record<string, {
  rate: number; babyChance: number; babyBonus: number; levelRequired: number;
}> = {
  chicken:  { rate: 1,  babyChance: 0.12, babyBonus: 5,   levelRequired: 1  },
  sheep:    { rate: 2,  babyChance: 0.10, babyBonus: 8,   levelRequired: 1  },
  cow:      { rate: 4,  babyChance: 0.08, babyBonus: 15,  levelRequired: 1  },
  horse:    { rate: 6,  babyChance: 0.06, babyBonus: 25,  levelRequired: 1  },
  peacock:  { rate: 8,  babyChance: 0.05, babyBonus: 40,  levelRequired: 5  },
  llama:    { rate: 12, babyChance: 0.04, babyBonus: 70,  levelRequired: 6  },
  elephant: { rate: 18, babyChance: 0.03, babyBonus: 120, levelRequired: 7  },
  tiger:    { rate: 25, babyChance: 0.02, babyBonus: 200, levelRequired: 8  },
  dragon:   { rate: 35, babyChance: 0.015,babyBonus: 400, levelRequired: 9  },
  unicorn:  { rate: 50, babyChance: 0.01, babyBonus: 800, levelRequired: 10 },
};

export const FARM_DAILY_CAP = 150; // base max farm stars per day (grows with level)
export function getFarmDailyCap(playerLevel: number): number {
  return FARM_DAILY_CAP + (playerLevel - 1) * 15; // +15 per level above 1
}

// ── Chest / Mystery Gift ────────────────────────────────────────────────────
export interface ChestReward {
  type: 'stars' | 'mega_stars' | 'baby';
  label: string;
  emoji: string;
  stars: number;
  animalId?: string;
}

// ── Baby Bonus ──────────────────────────────────────────────────────────────
export interface BabyBonus {
  animalId: string;
  emoji: string;
  bonusStars: number;
}

export type Subject = 'english' | 'maths' | 'science' | 'hass' | 'vcd';
export type Mascot = 'owl' | 'fox' | 'panda';
export type Density = 'younger' | 'older';
export type View = 'home' | 'lesson' | 'rewards' | 'teacher' | 'summary' | 'setup' | 'feedback' | 'revision' | 'games' | 'homework';

export interface StudentProfile {
  name: string;
  mascot: Mascot;
  density: Density;
  colorTheme: 'purple' | 'blue' | 'green' | 'orange';
}

export interface SessionResult {
  sessionId: string;
  subject: Subject;
  completedAt: string;
  score: number;           // correct answers
  total: number;           // total questions
  starsEarned: number;
  freeResponses: Record<string, string>;   // stepId -> answer
  homeworkSet: boolean;
  timeSpentMinutes: number;
}

export interface RoomItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'furniture' | 'pet' | 'decoration' | 'window';
  unlocked: boolean;
  placed: boolean;
}

export interface FarmPlot {
  id: string;          // 'plot-0' .. 'plot-5'
  animalId: string | null;
  placedAt: string;    // ISO datetime when animal was placed
}

export interface AppState {
  view: View;
  profile: StudentProfile | null;
  userId: string | null;
  userRole: 'teacher' | 'student' | null;
  activeStudentId: string | null;
  activeSubject: Subject;
  activeYearLevel: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  activeSessionId: string | null;
  currentStepIndex: number;
  sessionStartTime: number;
  totalStars: number;
  completedSessions: string[];
  sessionResults: SessionResult[];
  ownedItems: string[];
  placedItems: string[];
  currentAnswers: Record<string, string | string[]>;
  currentScore: { correct: number; total: number };
  currentStreak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  itemPositions: Record<string, { x: number; y: number }>;
  itemQuantities: Record<string, number>;
  petNames: Record<string, string>; // itemId -> custom name given by student
  farmPlots: FarmPlot[];
  lastFarmCollect: string; // ISO datetime
  farmStarsPending: number;
  farmDailyStars: number;   // stars collected from farm today
  farmLastDay: string;      // YYYY-MM-DD of last farm collect
  lifetimeStarsEarned: number; // total stars ever earned (never decreases)
  lastLoginBonus: string;   // YYYY-MM-DD of last daily bonus claim
  weeklyLessonsCount: number; // lessons completed this ISO week
  weeklyLessonsWeek: string;  // ISO week string e.g. "2025-W14"
  weeklyChallengeCollected: string; // ISO week when weekly bonus was collected
  pendingChest: ChestReward | null; // set after lesson if lucky chest drops
  pendingBabyBonus: BabyBonus | null; // set after farm collect if baby produced
  unlockedBadges: string[];
  firstLoginDate: string; // ISO date, set once on first login, never overwritten
  classPin: string;
  teacherUnlockedSessions: string[];
}

export interface AppActions {
  setView: (v: View) => void;
  setupProfile: (p: StudentProfile) => void;
  setActiveSubject: (s: Subject) => void;
  setActiveYearLevel: (y: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11) => void;
  setActiveSessionId: (id: string) => void;
  startSession: (sessionId: string) => void;
  goToStep: (index: number) => void;
  recordAnswer: (stepId: string, answer: string | string[]) => void;
  recordScore: (correct: boolean) => void;
  finishSession: (result: Omit<SessionResult, 'completedAt'>) => void;
  updateStreak: () => void;
  buyItem: (itemId: string, cost: number) => void;
  togglePlaced: (itemId: string) => void;
  addToRoom: (itemId: string) => void;
  removeFromRoom: (itemId: string) => void;
  reset: () => void;
  setItemPosition: (itemId: string, pos: { x: number; y: number }) => void;
  placeFarmAnimal: (plotId: string, animalId: string) => void;
  removeFarmAnimal: (plotId: string) => void;
  collectFarmStars: () => void;
  sellFarmAnimal: (animalId: string, refund: number) => void;
  claimDailyBonus: () => void;
  claimWeeklyBonus: () => void;
  namePet: (itemId: string, name: string) => void;
  dismissChest: () => void;
  dismissBabyBonus: () => void;
  unlockBadge: (id: string) => void;
  addStars: (n: number) => void;
  previewFeedback: (sessionId: string, score: number, total: number) => void;
  setUserId: (id: string | null, role: 'teacher' | 'student' | null) => void;
  setActiveStudentId: (id: string | null) => void;
  loadStudentData: (studentId: string) => Promise<void>;
  setClassPin: (pin: string) => void;
  unlockSessionForClass: (sessionId: string) => void;
}

function extractGameState(s: AppState): GameState {
  return {
    totalStars: s.totalStars,
    lifetimeStarsEarned: s.lifetimeStarsEarned,
    ownedItems: s.ownedItems,
    itemQuantities: s.itemQuantities,
    placedItems: s.placedItems,
    itemPositions: s.itemPositions,
    farmPlots: s.farmPlots,
    lastFarmCollect: s.lastFarmCollect,
    farmDailyStars: s.farmDailyStars,
    farmLastDay: s.farmLastDay,
    petNames: s.petNames,
    currentStreak: s.currentStreak,
    lastActiveDate: s.lastActiveDate,
    completedSessions: s.completedSessions,
    unlockedBadges: s.unlockedBadges,
    weeklyLessonsCount: s.weeklyLessonsCount,
    weeklyLessonsWeek: s.weeklyLessonsWeek,
    weeklyChallengeCollected: s.weeklyChallengeCollected,
    lastLoginBonus: s.lastLoginBonus,
    firstLoginDate: s.firstLoginDate,
  };
}

function isoWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return `${d.getFullYear()}-W${String(1 + Math.round(((d.getTime()-week1.getTime())/86400000 - 3 + ((week1.getDay()+6)%7)) / 7)).padStart(2,'0')}`;
}

const defaultState: AppState = {
  view: 'setup',
  profile: null,
  userId: null,
  userRole: null,
  activeStudentId: null,
  activeSubject: 'english',
  activeYearLevel: 4,
  activeSessionId: null,
  currentStepIndex: 0,
  sessionStartTime: 0,
  totalStars: 5, // start with a few so room isn't empty
  completedSessions: [],
  sessionResults: [],
  ownedItems: ['bed', 'rug'],
  placedItems: ['bed', 'rug'],
  currentAnswers: {},
  currentScore: { correct: 0, total: 0 },
  currentStreak: 0,
  lastActiveDate: '',
  itemPositions: {},
  itemQuantities: {},
  petNames: {},
  farmPlots: Array.from({ length: 10 }, (_, i) => ({ id: `plot-${i}`, animalId: null as string | null, placedAt: '' })),
  lastFarmCollect: '',
  farmStarsPending: 0,
  farmDailyStars: 0,
  farmLastDay: '',
  lifetimeStarsEarned: 0,
  lastLoginBonus: '',
  weeklyLessonsCount: 0,
  weeklyLessonsWeek: '',
  weeklyChallengeCollected: '',
  pendingChest: null,
  pendingBabyBonus: null,
  unlockedBadges: [],
  firstLoginDate: '',
  classPin: '',
  teacherUnlockedSessions: [],
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setView: (v) => set({ view: v }),

      setupProfile: (p) => set({ profile: p, view: 'home' }),

      setActiveSubject: (s) => set({ activeSubject: s }),

      setActiveYearLevel: (y) => set({ activeYearLevel: y, activeSubject: 'english' }),

      setActiveSessionId: (id) => set({ activeSessionId: id }),

      startSession: (sessionId) => set({
        activeSessionId: sessionId,
        currentStepIndex: 0,
        currentAnswers: {},
        currentScore: { correct: 0, total: 0 },
        sessionStartTime: Date.now(),
        view: 'lesson',
      }),

      goToStep: (index) => set({ currentStepIndex: index }),

      recordAnswer: (stepId, answer) =>
        set(s => ({ currentAnswers: { ...s.currentAnswers, [stepId]: answer } })),

      recordScore: (correct) =>
        set(s => ({
          currentScore: {
            correct: s.currentScore.correct + (correct ? 1 : 0),
            total: s.currentScore.total + 1,
          },
        })),

      updateStreak: () => {
        const state = get();
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        if (state.lastActiveDate === todayStr) return;
        const todayWeek = isoWeek(today);
        const lastWeek = state.lastActiveDate ? isoWeek(new Date(state.lastActiveDate)) : '';
        const prevWeek = isoWeek(new Date(Date.now() - 7 * 86400000));
        if (lastWeek === todayWeek) {
          // same week, just update date
          set({ lastActiveDate: todayStr });
        } else if (lastWeek === prevWeek) {
          set({ currentStreak: state.currentStreak + 1, lastActiveDate: todayStr });
        } else {
          set({ currentStreak: 1, lastActiveDate: todayStr });
        }
      },

      finishSession: (result) => {
        get().updateStreak();
        const state = get();
        const minutes = Math.round((Date.now() - state.sessionStartTime) / 60000);
        const full: SessionResult = {
          ...result,
          completedAt: new Date().toISOString(),
          timeSpentMinutes: minutes,
        };
        const starsEarned = result.starsEarned;
        // Chest probability: 20% chance of a mystery chest after lesson
        let chest: ChestReward | null = null;
        const roll = Math.random();
        if (roll < 0.05) {
          // 5% — Mega Stars
          const bonus = 50 + Math.floor(Math.random() * 100);
          chest = { type: 'mega_stars', label: `Mega Star Blast! +${bonus} bonus stars!`, emoji: '🌟', stars: bonus };
        } else if (roll < 0.20) {
          // 15% — Star Burst
          const bonus = 15 + Math.floor(Math.random() * 35);
          chest = { type: 'stars', label: `Star Burst! +${bonus} bonus stars!`, emoji: '⭐', stars: bonus };
        }
        // Track weekly lessons for weekly challenge
        const todayWeek = isoWeek(new Date());
        set(s => ({
          totalStars: s.totalStars + starsEarned + (chest?.stars ?? 0),
          lifetimeStarsEarned: s.lifetimeStarsEarned + starsEarned + (chest?.stars ?? 0),
          completedSessions: [...new Set([...s.completedSessions, result.sessionId])],
          sessionResults: [...s.sessionResults, full],
          weeklyLessonsCount: s.weeklyLessonsWeek === todayWeek ? s.weeklyLessonsCount + 1 : 1,
          weeklyLessonsWeek: todayWeek,
          pendingChest: chest,
          view: 'feedback',
        }));
        const newState = get();
        BADGES.forEach(badge => {
          if (!newState.unlockedBadges.includes(badge.id) && badge.check(newState)) {
            get().unlockBadge(badge.id);
          }
        });
        // Sync to Supabase — save under activeStudentId (teacher playing for student) or own userId
        const targetId = state.activeStudentId ?? state.userId;
        if (targetId) {
          saveSessionResult(targetId, full).catch(console.error);
          saveGameState(targetId, extractGameState(get())).catch(console.error);
        }
      },

      buyItem: (itemId, cost) => {
        const state = get();
        if (state.totalStars < cost) return;
        set(s => ({
          totalStars: s.totalStars - cost,
          ownedItems: s.ownedItems.includes(itemId) ? s.ownedItems : [...s.ownedItems, itemId],
          itemQuantities: { ...s.itemQuantities, [itemId]: (s.itemQuantities[itemId] ?? 0) + 1 },
        }));
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },

      togglePlaced: (itemId) => {
        // Legacy: adds first instance or removes all instances
        set(s => ({
          placedItems: s.placedItems.includes(itemId)
            ? s.placedItems.filter(i => i !== itemId)
            : [...s.placedItems, itemId],
        }));
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },

      addToRoom: (itemId) => {
        set(s => {
          const owned = s.itemQuantities[itemId] ?? (s.ownedItems.includes(itemId) ? 1 : 0);
          const placed = s.placedItems.filter(i => i === itemId).length;
          if (placed >= owned) return s;
          return { placedItems: [...s.placedItems, itemId] };
        });
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },

      removeFromRoom: (itemId) => {
        set(s => {
          const idx = s.placedItems.lastIndexOf(itemId);
          if (idx === -1) return s;
          const next = [...s.placedItems];
          next.splice(idx, 1);
          return { placedItems: next };
        });
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },

      reset: () => set(defaultState),

      setItemPosition: (itemId, pos) =>
        set(s => ({ itemPositions: { ...s.itemPositions, [itemId]: pos } })),

      placeFarmAnimal: (plotId, animalId) => {
        set(s => {
          const owned = s.itemQuantities[animalId] ?? 0;
          const placed = s.farmPlots.filter(p => p.animalId === animalId).length;
          if (placed >= owned) return s;
          return {
            farmPlots: s.farmPlots.map(p =>
              p.id === plotId ? { ...p, animalId, placedAt: new Date().toISOString() } : p
            ),
          };
        });
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },

      removeFarmAnimal: (plotId) => {
        set(s => ({
          farmPlots: s.farmPlots.map(p =>
            p.id === plotId ? { ...p, animalId: null, placedAt: '' } : p
          ),
        }));
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },

      sellFarmAnimal: (animalId, refund) =>
        set(s => {
          const owned = s.itemQuantities[animalId] ?? 0;
          const placed = s.farmPlots.filter(p => p.animalId === animalId).length;
          const unplaced = owned - placed;
          if (unplaced <= 0) return s; // nothing to sell
          const newQty = owned - 1;
          return {
            totalStars: s.totalStars + refund,
            lifetimeStarsEarned: s.lifetimeStarsEarned, // selling doesn't count as earning
            itemQuantities: { ...s.itemQuantities, [animalId]: newQty },
            ownedItems: newQty <= 0 ? s.ownedItems.filter(i => i !== animalId) : s.ownedItems,
          };
        }),

      claimDailyBonus: () => {
        const today = new Date().toISOString().slice(0, 10);
        const state = get();
        if (state.lastLoginBonus === today) return;
        const streak = state.currentStreak;
        const bonus = streak >= 7 ? 20 : streak >= 3 ? 10 : 5;
        set(s => ({
          totalStars: s.totalStars + bonus,
          lifetimeStarsEarned: s.lifetimeStarsEarned + bonus,
          lastLoginBonus: today,
        }));
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },

      claimWeeklyBonus: () => {
        const state = get();
        const thisWeek = isoWeek(new Date());
        if (state.weeklyChallengeCollected === thisWeek) return;
        if (state.weeklyLessonsWeek !== thisWeek || state.weeklyLessonsCount < 5) return;
        const bonus = 25;
        set(s => ({
          totalStars: s.totalStars + bonus,
          lifetimeStarsEarned: s.lifetimeStarsEarned + bonus,
          weeklyChallengeCollected: thisWeek,
        }));
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },

      unlockBadge: (id) => set(s => ({ unlockedBadges: [...new Set([...s.unlockedBadges, id])] })),

      addStars: (n) => set(s => ({ totalStars: s.totalStars + n, lifetimeStarsEarned: s.lifetimeStarsEarned + n })),

      collectFarmStars: () => {
        const state = get();
        const today = new Date().toISOString().slice(0, 10);
        const todayFarmStars = state.farmLastDay === today ? state.farmDailyStars : 0;
        const cap = getFarmDailyCap(getPlayerLevel(state.lifetimeStarsEarned));
        const remaining = Math.max(0, cap - todayFarmStars);
        if (remaining === 0) return;
        const now = Date.now();
        let raw = 0;
        let baby: BabyBonus | null = null;
        state.farmPlots.forEach(plot => {
          if (!plot.animalId || !plot.placedAt) return;
          const cfg = FARM_ANIMAL_CONFIG[plot.animalId];
          if (!cfg) return;
          const hoursElapsed = (now - new Date(plot.placedAt).getTime()) / 3600000;
          raw += Math.floor(hoursElapsed * cfg.rate);
          // Baby probability (independent roll per animal per collect)
          if (!baby && Math.random() < cfg.babyChance) {
            const emojiMap: Record<string, string> = {
              chicken: '🐔', sheep: '🐑', cow: '🐄', horse: '🐴',
              peacock: '🦚', llama: '🦙', elephant: '🐘', tiger: '🐯',
              dragon: '🐉', unicorn: '🦄',
            };
            baby = { animalId: plot.animalId, emoji: emojiMap[plot.animalId] ?? '🐣', bonusStars: cfg.babyBonus };
            raw += cfg.babyBonus;
          }
        });
        const earned = Math.min(raw, remaining);
        if (earned > 0) {
          set(s => ({
            totalStars: s.totalStars + earned,
            lifetimeStarsEarned: s.lifetimeStarsEarned + earned,
            farmDailyStars: todayFarmStars + earned,
            farmLastDay: today,
            pendingBabyBonus: baby,
            farmPlots: s.farmPlots.map(p => ({ ...p, placedAt: p.animalId ? new Date().toISOString() : '' })),
            lastFarmCollect: new Date().toISOString(),
          }));
          const userId = get().userId;
          if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
        }
      },

      namePet: (itemId, name) => {
        set(s => ({ petNames: { ...s.petNames, [itemId]: name.trim() || (s.petNames[itemId] ?? '') } }));
        const userId = get().userId;
        if (userId) saveGameState(userId, extractGameState(get())).catch(console.error);
      },
      dismissChest: () => set({ pendingChest: null }),
      dismissBabyBonus: () => set({ pendingBabyBonus: null }),

      previewFeedback: (sessionId, score, total) =>
        set({ activeSessionId: sessionId, currentScore: { correct: score, total }, view: 'feedback' }),

      setUserId: (id, role) => set(s => ({
        userId: id,
        userRole: role,
        // Record first login date once — never overwrite
        firstLoginDate: s.firstLoginDate || (id ? new Date().toISOString().slice(0, 10) : s.firstLoginDate),
      })),

      setActiveStudentId: (id) => set({ activeStudentId: id }),

      setClassPin: (pin) => set({ classPin: pin }),
      unlockSessionForClass: (id) => set(s => ({ teacherUnlockedSessions: [...new Set([...s.teacherUnlockedSessions, id])] })),

      loadStudentData: async (studentId) => {
        const dbProfile = await fetchProfile(studentId);
        if (dbProfile) {
          const gs = dbProfile.game_state;
          set({
            activeStudentId: studentId,
            profile: {
              name: dbProfile.name,
              mascot: dbProfile.mascot as StudentProfile['mascot'],
              density: dbProfile.density as StudentProfile['density'],
              colorTheme: dbProfile.color_theme as StudentProfile['colorTheme'],
            },
            // Restore full game state from DB if present — this is the cross-device source of truth
            ...(gs ? {
              totalStars: gs.totalStars,
              lifetimeStarsEarned: gs.lifetimeStarsEarned,
              ownedItems: gs.ownedItems ?? [],
              itemQuantities: gs.itemQuantities ?? {},
              placedItems: gs.placedItems ?? [],
              itemPositions: gs.itemPositions ?? {},
              farmPlots: gs.farmPlots?.length
                ? gs.farmPlots
                : Array.from({ length: 10 }, (_, i) => ({ id: `plot-${i}`, animalId: null, placedAt: '' })),
              lastFarmCollect: gs.lastFarmCollect ?? '',
              farmDailyStars: gs.farmDailyStars ?? 0,
              farmLastDay: gs.farmLastDay ?? '',
              petNames: gs.petNames ?? {},
              currentStreak: gs.currentStreak ?? 0,
              lastActiveDate: gs.lastActiveDate ?? '',
              completedSessions: gs.completedSessions ?? [],
              unlockedBadges: gs.unlockedBadges ?? [],
              weeklyLessonsCount: gs.weeklyLessonsCount ?? 0,
              weeklyLessonsWeek: gs.weeklyLessonsWeek ?? '',
              weeklyChallengeCollected: gs.weeklyChallengeCollected ?? '',
              lastLoginBonus: gs.lastLoginBonus ?? '',
              firstLoginDate: gs.firstLoginDate ?? '',
            } : {}),
          });
        }
        const results = await fetchStudentResults(studentId);
        const completedFromDb = results.map(r => r.sessionId);
        // session_results is the authoritative earned-star ledger.
        // totalStars = starsFromResults - spent; we never let it go below (starsFromResults - spent).
        const starsFromResults = results.reduce((sum, r) => sum + r.starsEarned, 0);
        set(s => {
          // How much has the student spent? Derive from prior game_state: lifetime - current balance.
          // This is 0 if they haven't bought anything yet.
          const priorSpent = Math.max(0, s.lifetimeStarsEarned - s.totalStars);
          const correctLifetime = Math.max(s.lifetimeStarsEarned, starsFromResults);
          const correctBalance = Math.max(s.totalStars, correctLifetime - priorSpent);
          return {
            sessionResults: results,
            completedSessions: [...new Set([...s.completedSessions, ...completedFromDb])],
            lifetimeStarsEarned: correctLifetime,
            totalStars: correctBalance,
          };
        });
        // Persist the reconciled balance back so future loads start correct
        const reconciled = get();
        if (reconciled.userId) {
          saveGameState(reconciled.userId, extractGameState(reconciled)).catch(console.error);
        }
      },
    }),
    {
      name: 'learn4-app-v1',
    }
  )
);
