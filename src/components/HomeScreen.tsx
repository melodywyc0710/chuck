import { useEffect, useState } from 'react';
import {
  LogOut, Flame, Users, CreditCard, Laugh, Smile, Meh, Frown,
  Sparkles, Star, BarChart2, Check, Plus,
  Dumbbell, BookOpen, List, Timer, Hash, Activity, TrendingDown,
} from 'lucide-react';

import TraitAllocator from './TraitAllocator';
import SpeciesSelector from './SpeciesSelector';
import AiCheckin from './AiCheckin';
import HabitCreator from './HabitCreator';
import { SPECIES_LIST, getStageImage } from '../lib/species';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { applyDecayIfNeeded } from '../lib/petEngine';
import { isPlus, isPro } from '../lib/species';
import type { Habit, HabitLog } from '../lib/habitTypes';

// ─── Habit type config ────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; Icon: React.ElementType; defaultColor: string }> = {
  workout:   { label: 'Workout',   Icon: Dumbbell,     defaultColor: '#FF4D4D' },
  journal:   { label: 'Journal',   Icon: BookOpen,     defaultColor: '#F59E0B' },
  checklist: { label: 'Checklist', Icon: List,         defaultColor: '#10B981' },
  complete:  { label: 'Complete',  Icon: Check,        defaultColor: '#8B5CF6' },
  timer:     { label: 'Timer',     Icon: Timer,        defaultColor: '#6366F1' },
  counter:   { label: 'Counter',   Icon: Hash,         defaultColor: '#3B82F6' },
  numeric:   { label: 'Number',    Icon: Activity,     defaultColor: '#06B6D4' },
  avoid:     { label: 'Avoid',     Icon: TrendingDown, defaultColor: '#F97316' },
};

const COLOR_PALETTE = [
  '#FF4D4D', '#F97316', '#F59E0B', '#10B981',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
  '#EC4899', '#888888',
];

function getHabitColor(habitId: string, type: string): string {
  return localStorage.getItem(`habit-color-${habitId}`) ?? TYPE_CONFIG[type]?.defaultColor ?? '#FF4D4D';
}

// ─── Color picker popover ─────────────────────────────────────────────────────

function ColorPicker({ habitId, current, onClose }: { habitId: string; current: string; onClose: () => void }) {
  function pick(color: string) {
    localStorage.setItem(`habit-color-${habitId}`, color);
    onClose();
  }
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute top-2 right-2 z-50 p-2 rounded-2xl flex flex-wrap gap-1.5"
        style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', width: 136 }}
      >
        {COLOR_PALETTE.map(c => (
          <button
            key={c}
            onClick={() => pick(c)}
            className="w-8 h-8 rounded-xl transition-all active:scale-90"
            style={{ background: c, border: current === c ? '2px solid white' : '2px solid transparent' }}
          />
        ))}
      </div>
    </>
  );
}

// ─── Habit card ───────────────────────────────────────────────────────────────

function HabitCard({
  habit, log, canCustomize, onClick,
}: {
  habit: Habit;
  log: HabitLog | null;
  canCustomize: boolean;
  onClick: () => void;
}) {
  const [colorPicker, setColorPicker] = useState(false);
  const [color, setColor] = useState(() => getHabitColor(habit.id, habit.tracking_type));

  const cfg = TYPE_CONFIG[habit.tracking_type] ?? TYPE_CONFIG.complete;
  const Icon = cfg.Icon;
  const done = !!log;

  function refreshColor() {
    setColor(getHabitColor(habit.id, habit.tracking_type));
    setColorPicker(false);
  }

  // Progress text
  const progressText = (() => {
    if (!log) return null;
    const tt = habit.tracking_type;
    if (tt === 'timer' && log.value != null) return `${log.value} min`;
    if (tt === 'counter' && log.value != null)
      return habit.target_value ? `${log.value}/${habit.target_value}` : `${log.value}`;
    if (tt === 'numeric' && log.value != null)
      return `${log.value}${habit.target_unit ? ' ' + habit.target_unit : ''}`;
    if (tt === 'checklist' && log.value != null)
      return `${log.value}/${habit.checklist_items.length}`;
    return null;
  })();

  const pct = (() => {
    if (!log || !habit.target_value) return done ? 1 : 0;
    const tt = habit.tracking_type;
    if (tt === 'timer' || tt === 'counter' || tt === 'numeric')
      return Math.min(1, (log.value ?? 0) / habit.target_value);
    if (tt === 'checklist')
      return habit.checklist_items.length > 0
        ? Math.min(1, (log.value ?? 0) / habit.checklist_items.length)
        : done ? 1 : 0;
    return done ? 1 : 0;
  })();

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="relative rounded-[24px] overflow-hidden text-left transition-all duration-200 active:scale-[0.97] w-full"
        style={{ background: '#111111', border: '1px solid #1e1e1e', minHeight: 160, display: 'flex', flexDirection: 'column' }}
      >
        {/* Colored top band */}
        <div
          className="relative flex items-center justify-center"
          style={{ background: done ? '#10B981' : color, height: 88, width: '100%', flexShrink: 0 }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.15) 100%)' }} />
          {done
            ? <Check size={40} strokeWidth={1.4} color="white" style={{ opacity: 0.95, position: 'relative' }} />
            : <Icon size={40} strokeWidth={1.4} color="white" style={{ opacity: 0.95, position: 'relative' }} />
          }
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-3 gap-1" style={{ background: '#141414', marginTop: -6, borderRadius: '14px 14px 0 0' }}>
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {cfg.label}
          </span>
          <p className="text-white/80 text-sm font-semibold leading-tight truncate">{habit.name}</p>
          {progressText && (
            <p className="text-[11px] font-medium tabular-nums" style={{ color: done ? '#10B981' : 'rgba(255,255,255,0.4)' }}>
              {progressText}
            </p>
          )}
          {/* Progress bar */}
          {pct > 0 && (
            <div className="h-1 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct * 100}%`, background: done ? '#10B981' : color }}
              />
            </div>
          )}
        </div>
      </button>

      {/* Color picker button — Pro/Plus only */}
      {canCustomize && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={e => { e.stopPropagation(); setColorPicker(v => !v); }}
            className="w-5 h-5 rounded-full border-2 border-white/30 transition-all active:scale-90"
            style={{ background: color }}
          />
          {colorPicker && (
            <ColorPicker
              habitId={habit.id}
              current={color}
              onClose={refreshColor}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mood icon ────────────────────────────────────────────────────────────────

function MoodIcon({ h, size = 14 }: { h: number; size?: number }) {
  if (h >= 80) return <Laugh size={size} />;
  if (h >= 60) return <Smile size={size} />;
  if (h >= 40) return <Meh size={size} />;
  return <Frown size={size} />;
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen({
  onFriends, onPayment, onStats, onHabit,
}: {
  onFriends: () => void;
  onPayment: () => void;
  onStats: () => void;
  onHabit: (habit: Habit) => void;
}) {
  const pet = useAuthStore(s => s.pet);
  const profile = useAuthStore(s => s.profile);
  const signOut = useAuthStore(s => s.signOut);
  const updatePetState = useAuthStore(s => s.setPetLocal);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<Record<string, HabitLog>>({});
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [showTraits, setShowTraits] = useState(false);
  const [showSpecies, setShowSpecies] = useState(false);
  const [wiggling, setWiggling] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);

  const tier = profile?.subscription_tier ?? 'free';
  const plus = isPlus(tier);
  const pro = isPro(tier);
  const canCustomize = plus || pro;

  useEffect(() => {
    loadData();
    if (pet) applyDecayIfNeeded(pet, pet.user_id).then(u => { if (u) updatePetState(u); });
  }, []);

  async function loadData() {
    if (!pet) return;
    const dateKey = new Date().toISOString().slice(0, 10);
    try {
      const [{ data: h }, { data: l }] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', pet.user_id).eq('archived', false).order('sort_order'),
        supabase.from('habit_logs').select('*').eq('user_id', pet.user_id).eq('date_key', dateKey),
      ]);
      if (h) setHabits(h.map(x => ({ ...x, checklist_items: x.checklist_items ?? [] })) as Habit[]);
      if (l) {
        const map: Record<string, HabitLog> = {};
        for (const log of l) map[log.habit_id] = log as HabitLog;
        setTodayLogs(map);
      }
    } catch (e) {
      console.error('HomeScreen loadData error:', e);
    } finally {
      setHabitsLoading(false);
    }
  }

  if (!pet) return null;

  const MOOD_MESSAGES: Record<string, string[]> = {
    happy: ['Yay!', 'I love you!', "Let's go!", 'So happy~', "You're the best!"],
    good:  ['Hi there!', 'Keep it up!', 'Feeling good!', 'You got this~', '*happy wiggle*'],
    meh:   ['...hi.', "I'm okay.", 'Maybe a goal today?', 'Mmmph.', 'Could be better~'],
    sad:   ['I miss you...', 'Please come back', "I'm lonely...", "Don't forget me~", '*sad eyes*'],
  };

  function getMoodKey(h: number) {
    if (h >= 80) return 'happy';
    if (h >= 60) return 'good';
    if (h >= 40) return 'meh';
    return 'sad';
  }

  function tapPet() {
    if (wiggling) return;
    const msgs = MOOD_MESSAGES[getMoodKey(pet!.happiness)];
    setBubble(msgs[Math.floor(Math.random() * msgs.length)]);
    setWiggling(true);
    setTimeout(() => setWiggling(false), 600);
    setTimeout(() => setBubble(null), 2200);
  }

  const xpPct = pet.xp / pet.xp_to_next;
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const doneCount = habits.filter(h => !!todayLogs[h.id]).length;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      {showTraits && <TraitAllocator onClose={() => setShowTraits(false)} />}
      {showSpecies && <SpeciesSelector onClose={() => setShowSpecies(false)} />}

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-5 pt-12 pb-8">

        {/* Nav */}
        <div className="flex items-center justify-between mb-8 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <Flame size={12} className="text-white/50" strokeWidth={1.5} />
            <span className="text-white/70 font-medium">{pet.streak}</span>
            <span>day streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/30 text-xs mr-1">{profile?.username}</span>
            <button onClick={onStats} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <BarChart2 size={15} strokeWidth={1.5} />
            </button>
            <button onClick={onPayment} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <CreditCard size={15} strokeWidth={1.5} />
            </button>
            <button onClick={onFriends} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <Users size={15} strokeWidth={1.5} />
            </button>
            <button onClick={signOut} className="w-8 h-8 flex items-center justify-center rounded-full text-white/25 hover:text-white/60 transition-colors">
              <LogOut size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Pet */}
        <div className="flex items-center gap-4 mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative shrink-0">
            {bubble && (
              <div
                className="pet-bubble absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-2xl text-xs font-medium z-20"
                style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
              >
                {bubble}
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0" style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #1e1e1e' }} />
              </div>
            )}
            <button onClick={tapPet} className="relative block" aria-label="Pet">
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden${wiggling ? ' pet-wiggle' : ''}`} style={{ background: '#141414', border: '1px solid #1E1E1E' }}>
                {(() => {
                  const stageImg = getStageImage(pet.species, pet.level);
                  return stageImg
                    ? <img src={stageImg} alt={pet.name} className="w-full h-full object-contain" />
                    : <Star size={26} strokeWidth={1.5} color="white" opacity={0.7} />;
                })()}
                <span className="absolute -bottom-0.5 -right-0.5 text-white/30"><MoodIcon h={pet.happiness} size={12} /></span>
              </div>
            </button>
            <button onClick={() => setShowSpecies(true)} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10" style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' }} aria-label="Change species">
              <Star size={9} strokeWidth={2} color="rgba(255,255,255,0.4)" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <h1 className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.03em' }}>{pet.name}</h1>
              {pet.trait_points_available > 0 && (
                <button onClick={() => setShowTraits(true)} className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: '#C91818', color: '#F2EEE8' }}>
                  {pet.trait_points_available} pts
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pet.happiness}%`, backgroundColor: '#A8A8A8' }} />
                </div>
                <span className="text-white/25 text-[10px] tabular-nums w-10 text-right">{pet.happiness}/100</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${xpPct * 100}%`, backgroundColor: '#505050' }} />
                </div>
                <span className="text-white/25 text-[10px] tabular-nums w-10 text-right">Lv {pet.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date + Today count */}
        <div className="flex items-center justify-between mb-5 fade-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-white/25 text-xs">{todayLabel}</p>
          {habits.length > 0 && (
            <span className="text-white/20 text-xs">{doneCount}/{habits.length} done</span>
          )}
        </div>

        {/* Habit cards */}
        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
          {habitsLoading && (
            <div className="flex justify-center py-12">
              <div className="w-4 h-4 rounded-full border-2 border-white/15 border-t-white/50 animate-spin" />
            </div>
          )}

          {!habitsLoading && habits.length === 0 && (
            <button
              onClick={() => setShowCreator(true)}
              className="w-full flex flex-col items-center justify-center py-12 rounded-[24px] transition-all active:scale-[0.98]"
              style={{ background: '#111111', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,77,77,0.1)' }}>
                <Plus size={18} style={{ color: '#FF4D4D' }} strokeWidth={2} />
              </div>
              <p className="text-white/40 text-sm font-medium">Add your first habit</p>
              <p className="text-white/20 text-xs mt-1">Workout, journal, meditate and more</p>
            </button>
          )}

          {!habitsLoading && habits.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    log={todayLogs[habit.id] ?? null}
                    canCustomize={canCustomize}
                    onClick={() => onHabit(habit)}
                  />
                ))}

                {/* Add habit card */}
                <button
                  onClick={() => setShowCreator(true)}
                  className="rounded-[24px] flex flex-col items-center justify-center transition-all active:scale-[0.97]"
                  style={{ background: '#111111', border: '1px dashed rgba(255,255,255,0.08)', minHeight: 160 }}
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2" style={{ background: 'rgba(255,77,77,0.08)' }}>
                    <Plus size={16} style={{ color: '#FF4D4D' }} strokeWidth={2} />
                  </div>
                  <p className="text-white/25 text-xs font-medium">Add habit</p>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Pro AI check-in */}
        {pro && (
          <div className="mt-6 fade-up" style={{ animationDelay: '0.3s' }}>
            <AiCheckin petEmoji={SPECIES_LIST.find(s => s.id === pet.species)?.emoji ?? '⭐'} color="#ffffff" />
          </div>
        )}
        {!pro && (
          <button
            onClick={onPayment}
            className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors fade-up"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: '0.3s' }}
          >
            <Sparkles size={14} className="text-white/25 shrink-0" strokeWidth={1.5} />
            <p className="text-white/25 text-xs flex-1 text-left">Upgrade to Pro for daily AI check-ins</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 text-white/30" style={{ background: '#1e1e1e' }}>Pro</span>
          </button>
        )}
      </div>

      {showCreator && (
        <HabitCreator
          onSaved={() => { setShowCreator(false); loadData(); }}
          onClose={() => setShowCreator(false)}
        />
      )}
    </>
  );
}
