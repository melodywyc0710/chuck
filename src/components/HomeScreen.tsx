import { useEffect, useRef, useState } from 'react';
import {
  LogOut, Flame, Users, CreditCard, Laugh, Smile, Meh, Frown,
  Sparkles, Star, BarChart2, Plus,
  Dumbbell, BookOpen, List, Timer, Hash, Activity, TrendingDown, Check,
} from 'lucide-react';
import CategoryIconPicker, { getCatIcon } from './CategoryIconPicker';

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

// ─── Type config ──────────────────────────────────────────────────────────────

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

function getCatColor(catName: string, habits: Habit[]): string {
  const stored = localStorage.getItem(`cat-color-${catName}`);
  if (stored) return stored;
  const primaryType = habits[0]?.tracking_type ?? 'complete';
  return TYPE_CONFIG[primaryType]?.defaultColor ?? '#FF4D4D';
}

// ─── Color picker ─────────────────────────────────────────────────────────────

function ColorPicker({ catName, current, onClose }: { catName: string; current: string; onClose: () => void }) {
  function pick(color: string) {
    localStorage.setItem(`cat-color-${catName}`, color);
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
          <button key={c} onClick={() => pick(c)}
            className="w-8 h-8 rounded-xl transition-all active:scale-90"
            style={{ background: c, border: current === c ? '2px solid white' : '2px solid transparent' }} />
        ))}
      </div>
    </>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────

function CategoryCard({
  name, habits, logs, canCustomize, isDragging, onPointerDown, onClick,
}: {
  name: string;
  habits: Habit[];
  logs: Record<string, HabitLog>;
  canCustomize: boolean;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: () => void;
}) {
  const [colorPicker, setColorPicker] = useState(false);
  const [iconPicker, setIconPicker] = useState(false);
  const [color, setColor] = useState(() => getCatColor(name, habits));
  const [, forceUpdate] = useState(0);

  const doneCount = habits.filter(h => !!logs[h.id]).length;
  const total = habits.length;
  const pct = total > 0 ? doneCount / total : 0;

  const CustomIcon = getCatIcon(name);
  const uniqueTypes = [...new Set(habits.map(h => h.tracking_type))].slice(0, 4);

  function refreshColor() { setColor(getCatColor(name, habits)); setColorPicker(false); }

  return (
    <div className="relative select-none" style={{ userSelect: 'none' }}>
      <div
        className="relative rounded-[24px] overflow-hidden text-left w-full"
        style={{
          background: '#111111', border: '1px solid #1e1e1e', minHeight: 160,
          display: 'flex', flexDirection: 'column',
          boxShadow: isDragging ? '0 16px 48px rgba(0,0,0,0.7)' : 'none',
          transition: isDragging ? 'none' : 'box-shadow 0.2s',
        }}
        onPointerDown={onPointerDown}
        onClick={isDragging ? undefined : onClick}
      >
        {/* Colored top band */}
        <div className="relative flex items-center justify-center"
          style={{ background: color, height: 88, width: '100%', flexShrink: 0 }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.15) 100%)' }} />
          <div className="flex items-center gap-2 relative">
            {CustomIcon
              ? <CustomIcon size={40} strokeWidth={1.4} color="white" style={{ opacity: 0.9 }} />
              : uniqueTypes.map(type => {
                  const Ic = TYPE_CONFIG[type]?.Icon ?? Check;
                  return <Ic key={type} size={uniqueTypes.length === 1 ? 40 : 22} strokeWidth={1.4} color="white" style={{ opacity: 0.9 }} />;
                })
            }
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-3 gap-1" style={{ background: '#141414', marginTop: -6, borderRadius: '14px 14px 0 0' }}>
          <p className="text-white text-sm font-semibold leading-tight truncate">{name}</p>
          <p className="text-[11px] font-medium tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {doneCount}/{total} today
          </p>
          {pct > 0 && (
            <div className="h-1 rounded-full overflow-hidden mt-1" style={{ background: '#282828' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct * 100}%`, background: color }} />
            </div>
          )}
        </div>
      </div>

      {canCustomize && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          {/* Icon picker trigger */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setIconPicker(v => !v); }}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: '#1e1e1e', border: '1.5px solid #333' }}
            title="Change icon"
          >
            <Star size={10} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          </button>
          {/* Color picker trigger */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setColorPicker(v => !v); }}
            className="w-6 h-6 rounded-full border-2 border-white/30 transition-all active:scale-90"
            style={{ background: color }}
          />
          {colorPicker && <ColorPicker catName={name} current={color} onClose={refreshColor} />}
        </div>
      )}
      {iconPicker && (
        <CategoryIconPicker catName={name} color={color} onClose={() => { setIconPicker(false); forceUpdate(n => n + 1); }} />
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
  onFriends, onPayment, onStats, onCategory,
}: {
  onFriends: () => void;
  onPayment: () => void;
  onStats: () => void;
  onCategory: (name: string, habits: Habit[], allCategories: string[], color: string, canCustomize: boolean, isPro: boolean) => void;
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

  // ── Category drag-to-reorder ──────────────────────────────────────────────
  type CatDrag = { fromIdx: number; toIdx: number; offsetX: number; offsetY: number; slotW: number; slotH: number };
  const [catDrag, setCatDrag] = useState<CatDrag | null>(null);
  const catDragRef = useRef<CatDrag | null>(null);
  const [catOrder, setCatOrder] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(`cat-order-${pet?.user_id}`) ?? '[]'); } catch { return []; }
  });
  const catCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  function startCatDrag(idx: number, e: React.PointerEvent, numCols: number) {
    e.preventDefault();
    const el = catCardRefs.current[idx];
    const rect = el?.getBoundingClientRect();
    const slotW = rect ? rect.width + 12 : 160;
    const slotH = rect ? rect.height + 12 : 180;
    const state: CatDrag = { fromIdx: idx, toIdx: idx, offsetX: 0, offsetY: 0, slotW, slotH };
    catDragRef.current = state; setCatDrag(state);
    try { navigator.vibrate?.(20); } catch {}

    function onMove(ev: PointerEvent) {
      if (ev.pointerId !== e.pointerId) return;
      const dr = catDragRef.current; if (!dr) return;
      const dx = ev.clientX - e.clientX;
      const dy = ev.clientY - e.clientY;
      const colOff = Math.round(dx / dr.slotW);
      const rowOff = Math.round(dy / dr.slotH);
      const total = catCardRefs.current.filter(Boolean).length;
      const toIdx = Math.max(0, Math.min(total - 1, dr.fromIdx + colOff + rowOff * numCols));
      const next = { ...dr, toIdx, offsetX: dx, offsetY: dy };
      catDragRef.current = next; setCatDrag(next);
    }
    function onEnd(ev: PointerEvent) {
      if (ev.pointerId !== e.pointerId) return;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onEnd);
      document.removeEventListener('pointercancel', onEnd);
      const dr = catDragRef.current; catDragRef.current = null; setCatDrag(null);
      if (dr && dr.fromIdx !== dr.toIdx) saveCatOrder(dr.fromIdx, dr.toIdx);
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onEnd);
    document.addEventListener('pointercancel', onEnd);
  }

  function saveCatOrder(from: number, to: number) {
    setCatOrder(prev => {
      const names = prev.length ? prev : categoriesBase.map(([n]) => n);
      const arr = [...names];
      const [removed] = arr.splice(from, 1);
      arr.splice(to, 0, removed);
      localStorage.setItem(`cat-order-${pet?.user_id}`, JSON.stringify(arr));
      return arr;
    });
  }

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

  // Group habits by category
  const categoryMap = new Map<string, Habit[]>();
  for (const h of habits) {
    const cat = h.category ?? localStorage.getItem(`habit-cat-${h.id}`) ?? 'General';
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(h);
  }
  const categoriesBase = [...categoryMap.entries()];
  // Apply custom order
  const orderedNames = catOrder.length
    ? [...catOrder.filter(n => categoryMap.has(n)), ...categoriesBase.map(([n]) => n).filter(n => !catOrder.includes(n))]
    : categoriesBase.map(([n]) => n);
  const categories = orderedNames.map(n => [n, categoryMap.get(n)!] as [string, Habit[]]);
  const allCategoryNames = categories.map(([name]) => name);

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
  const totalDone = habits.filter(h => !!todayLogs[h.id]).length;

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

        {/* Date + count */}
        <div className="flex items-center justify-between mb-5 fade-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-white/25 text-xs">{todayLabel}</p>
          {habits.length > 0 && (
            <span className="text-white/20 text-xs">{totalDone}/{habits.length} done</span>
          )}
        </div>

        {/* Category cards */}
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
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Plus size={18} style={{ color: 'rgba(255,255,255,0.5)' }} strokeWidth={2} />
              </div>
              <p className="text-white/40 text-sm font-medium">Create your first category</p>
              <p className="text-white/20 text-xs mt-1">e.g. Fitness, Focus, Health</p>
            </button>
          )}

          {!habitsLoading && habits.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {categories.map(([catName, catHabits], idx) => {
                let translateX = 0, translateY = 0, isLifted = false;
                if (catDrag) {
                  const { fromIdx, toIdx, offsetX, offsetY, slotW, slotH } = catDrag;
                  if (idx === fromIdx) { translateX = offsetX; translateY = offsetY; isLifted = true; }
                  else {
                    // Simple slot-push: items shift one slot toward the gap
                    const cols = 2;
                    const fromRow = Math.floor(fromIdx / cols), fromCol = fromIdx % cols;
                    const toRow = Math.floor(toIdx / cols), toCol = toIdx % cols;
                    const iRow = Math.floor(idx / cols), iCol = idx % cols;
                    // Determine if this item is in the range [min(from,to), max(from,to)]
                    if (idx > Math.min(fromIdx, toIdx) && idx <= Math.max(fromIdx, toIdx)) {
                      if (fromIdx < toIdx) { translateX = -slotW; if (iCol === 0) { translateX = slotW; translateY = -slotH; } }
                      else { translateX = slotW; if (iCol === cols - 1) { translateX = -slotW; translateY = slotH; } }
                    } else if (idx < Math.min(fromIdx, toIdx) && idx >= Math.min(fromIdx, toIdx)) {
                      // covered above
                    }
                    void fromRow; void fromCol; void toRow; void toCol; void iRow; void iCol;
                  }
                }
                return (
                  <div key={catName} ref={el => { catCardRefs.current[idx] = el; }}
                    style={{
                      transform: `translate(${translateX}px, ${translateY}px)`,
                      transition: isLifted ? 'none' : 'transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94)',
                      zIndex: isLifted ? 20 : 1, position: 'relative',
                    }}>
                    <CategoryCard
                      name={catName}
                      habits={catHabits}
                      logs={todayLogs}
                      canCustomize={canCustomize}
                      isDragging={isLifted}
                      onPointerDown={e => {
                        // Long-press to start drag (400ms)
                        const lpTimer = setTimeout(() => {
                          startCatDrag(idx, e, 2);
                        }, 400);
                        function cancelLp() { clearTimeout(lpTimer); document.removeEventListener('pointerup', cancelLp); document.removeEventListener('pointermove', cancelLp); }
                        document.addEventListener('pointerup', cancelLp, { once: true });
                        document.addEventListener('pointermove', cancelLp, { once: true });
                      }}
                      onClick={() => onCategory(catName, catHabits, allCategoryNames, getCatColor(catName, catHabits), canCustomize, pro)}
                    />
                  </div>
                );
              })}
              <button
                onClick={() => setShowCreator(true)}
                className="rounded-[24px] flex flex-col items-center justify-center transition-all active:scale-[0.97]"
                style={{ background: '#111111', border: '1px dashed #1e1e1e', minHeight: 160 }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2" style={{ background: '#1a1a1a' }}>
                  <Plus size={16} style={{ color: 'rgba(255,255,255,0.4)' }} strokeWidth={2} />
                </div>
                <p className="text-white/25 text-xs font-medium">Add habit</p>
              </button>
            </div>
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
          existingCategories={allCategoryNames}
          onSaved={() => { setShowCreator(false); loadData(); }}
          onClose={() => setShowCreator(false)}
        />
      )}
    </>
  );
}
