import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BADGES } from '../data/badges';
import { saveSessionResult, fetchProfile, fetchStudentResults } from '../lib/db';

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
  reset: () => void;
  setItemPosition: (itemId: string, pos: { x: number; y: number }) => void;
  placeFarmAnimal: (plotId: string, animalId: string) => void;
  removeFarmAnimal: (plotId: string) => void;
  collectFarmStars: () => void;
  sellFarmAnimal: (animalId: string, refund: number) => void;
  claimDailyBonus: () => void;
  claimWeeklyBonus: () => void;
  unlockBadge: (id: string) => void;
  addStars: (n: number) => void;
  previewFeedback: (sessionId: string, score: number, total: number) => void;
  setUserId: (id: string | null, role: 'teacher' | 'student' | null) => void;
  setActiveStudentId: (id: string | null) => void;
  loadStudentData: (studentId: string) => Promise<void>;
  setClassPin: (pin: string) => void;
  unlockSessionForClass: (sessionId: string) => void;
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
  farmPlots: [
    { id: 'plot-0', animalId: null, placedAt: '' },
    { id: 'plot-1', animalId: null, placedAt: '' },
    { id: 'plot-2', animalId: null, placedAt: '' },
    { id: 'plot-3', animalId: null, placedAt: '' },
    { id: 'plot-4', animalId: null, placedAt: '' },
    { id: 'plot-5', animalId: null, placedAt: '' },
  ],
  lastFarmCollect: '',
  farmStarsPending: 0,
  farmDailyStars: 0,
  farmLastDay: '',
  lifetimeStarsEarned: 0,
  lastLoginBonus: '',
  weeklyLessonsCount: 0,
  weeklyLessonsWeek: '',
  weeklyChallengeCollected: '',
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
        // Track weekly lessons for weekly challenge
        const todayWeek = isoWeek(new Date());
        set(s => ({
          totalStars: s.totalStars + starsEarned,
          lifetimeStarsEarned: s.lifetimeStarsEarned + starsEarned,
          completedSessions: [...new Set([...s.completedSessions, result.sessionId])],
          sessionResults: [...s.sessionResults, full],
          weeklyLessonsCount: s.weeklyLessonsWeek === todayWeek ? s.weeklyLessonsCount + 1 : 1,
          weeklyLessonsWeek: todayWeek,
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
      },

      togglePlaced: (itemId) =>
        set(s => ({
          placedItems: s.placedItems.includes(itemId)
            ? s.placedItems.filter(i => i !== itemId)
            : [...s.placedItems, itemId],
        })),

      reset: () => set(defaultState),

      setItemPosition: (itemId, pos) =>
        set(s => ({ itemPositions: { ...s.itemPositions, [itemId]: pos } })),

      placeFarmAnimal: (plotId, animalId) =>
        set(s => {
          const owned = s.itemQuantities[animalId] ?? 0;
          const placed = s.farmPlots.filter(p => p.animalId === animalId).length;
          if (placed >= owned) return s; // can't place more than owned
          return {
            farmPlots: s.farmPlots.map(p =>
              p.id === plotId ? { ...p, animalId, placedAt: new Date().toISOString() } : p
            ),
          };
        }),

      removeFarmAnimal: (plotId) =>
        set(s => ({
          farmPlots: s.farmPlots.map(p =>
            p.id === plotId ? { ...p, animalId: null, placedAt: '' } : p
          ),
        })),

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
      },

      unlockBadge: (id) => set(s => ({ unlockedBadges: [...new Set([...s.unlockedBadges, id])] })),

      addStars: (n) => set(s => ({ totalStars: s.totalStars + n, lifetimeStarsEarned: s.lifetimeStarsEarned + n })),

      collectFarmStars: () => {
        const state = get();
        // Reduced rates: chicken 1/hr, sheep 2/hr, cow 4/hr, horse 8/hr
        const RATES: Record<string, number> = { chicken: 1, sheep: 2, cow: 4, horse: 8 };
        const DAILY_CAP = 30;
        const today = new Date().toISOString().slice(0, 10);
        const todayFarmStars = state.farmLastDay === today ? state.farmDailyStars : 0;
        const remaining = Math.max(0, DAILY_CAP - todayFarmStars);
        if (remaining === 0) return;
        const now = Date.now();
        let raw = 0;
        state.farmPlots.forEach(plot => {
          if (!plot.animalId || !plot.placedAt) return;
          const hoursElapsed = (now - new Date(plot.placedAt).getTime()) / 3600000;
          raw += Math.floor(hoursElapsed * (RATES[plot.animalId] ?? 1));
        });
        const earned = Math.min(raw, remaining);
        if (earned > 0) {
          set(s => ({
            totalStars: s.totalStars + earned,
            lifetimeStarsEarned: s.lifetimeStarsEarned + earned,
            farmDailyStars: todayFarmStars + earned,
            farmLastDay: today,
            farmPlots: s.farmPlots.map(p => ({ ...p, placedAt: p.animalId ? new Date().toISOString() : '' })),
            lastFarmCollect: new Date().toISOString(),
          }));
        }
      },

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
          set({
            activeStudentId: studentId,
            profile: {
              name: dbProfile.name,
              mascot: dbProfile.mascot as StudentProfile['mascot'],
              density: dbProfile.density as StudentProfile['density'],
              colorTheme: dbProfile.color_theme as StudentProfile['colorTheme'],
            },
          });
        }
        const results = await fetchStudentResults(studentId);
        // Merge DB completed sessions into local store so teacher-awarded completions show up
        const completedFromDb = results.map(r => r.sessionId);
        const totalStarsFromDb = results.reduce((sum, r) => sum + r.starsEarned, 0);
        set(s => ({
          sessionResults: results,
          completedSessions: [...new Set([...s.completedSessions, ...completedFromDb])],
          totalStars: Math.max(s.totalStars, totalStarsFromDb + 5),
        }));
      },
    }),
    {
      name: 'learn4-app-v1',
      // Use sessionStorage so each browser tab has its own independent state
      storage: typeof window !== 'undefined' ? {
        getItem: (k: string) => { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; },
        setItem: (k: string, v: unknown) => sessionStorage.setItem(k, JSON.stringify(v)),
        removeItem: (k: string) => sessionStorage.removeItem(k),
      } : undefined,
    }
  )
);
