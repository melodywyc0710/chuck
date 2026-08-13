import { useEffect, useRef, useState } from 'react';
import {
  LogOut, Flame, Users, CreditCard, Laugh, Smile, Meh, Frown,
  Sparkles, Star, BarChart2, Plus, Settings2, Pencil,
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
  '#FF4D4D', '#FF2D55', '#EC4899', '#F43F5E', '#F97316',
  '#FB923C', '#F59E0B', '#EAB308', '#84CC16', '#10B981',
  '#22C55E', '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#64748B', '#888888',
];

function getCatColor(catName: string, habits: Habit[]): string {
  const stored = localStorage.getItem(`cat-color-${catName}`);
  if (stored) return stored;
  const primaryType = habits[0]?.tracking_type ?? 'complete';
  return TYPE_CONFIG[primaryType]?.defaultColor ?? '#FF4D4D';
}

// ─── Category edit sheet ──────────────────────────────────────────────────────

function CategoryEditSheet({
  catName, habits, onClose, onRenamed, onDeleted,
}: {
  catName: string;
  habits: Habit[];
  onClose: () => void;
  onRenamed: (newName: string) => void;
  onDeleted: () => void;
}) {
  const [name, setName] = useState(catName);
  const [color, setColor] = useState(() => getCatColor(catName, habits));
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [, forceUpdate] = useState(0);
  const CustomIcon = getCatIcon(catName);

  function saveRename() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== catName) onRenamed(trimmed);
    else onClose();
  }

  function pickColor(c: string) {
    localStorage.setItem(`cat-color-${catName}`, c);
    setColor(c);
  }

  if (showIconPicker) {
    return (
      <CategoryIconPicker
        catName={catName}
        color={color}
        onClose={() => { setShowIconPicker(false); forceUpdate(n => n + 1); }}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[28px] px-5 pt-5 pb-10"
        style={{ background: '#111111', border: '1px solid #1e1e1e' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-8 h-1 rounded-full bg-white/15 mx-auto mb-5" />

        {/* Color swatch header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center" style={{ background: color }}>
            {CustomIcon
              ? <CustomIcon size={20} color="white" strokeWidth={1.5} />
              : <Star size={16} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />}
          </div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveRename(); }}
            onBlur={saveRename}
            className="flex-1 text-white text-base font-semibold outline-none bg-transparent"
            placeholder="Category name"
            autoFocus
          />
        </div>

        {/* Color */}
        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Color</p>
        <div className="flex gap-2 flex-wrap mb-5">
          {COLOR_PALETTE.map(c => (
            <button key={c} onClick={() => pickColor(c)}
              className="w-9 h-9 rounded-xl active:scale-90 transition-all"
              style={{ background: c, border: color === c ? '2.5px solid white' : '2.5px solid transparent' }} />
          ))}
        </div>

        {/* Icon */}
        <button
          onClick={() => setShowIconPicker(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-5 transition-all active:scale-[0.98]"
          style={{ background: '#1e1e1e' }}
        >
          {CustomIcon
            ? <CustomIcon size={18} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            : <Star size={18} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />}
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Icon</span>
        </button>

        {/* Delete — two-step confirm */}
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
            style={{ color: '#FF4D4D', background: '#1a1a1a' }}
          >
            Delete Category
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.4)' }}
            >
              Cancel
            </button>
            <button
              onClick={onDeleted}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
              style={{ background: '#FF4D4D', color: 'white' }}
            >
              Yes, Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────

function CategoryCard({
  name, habits, logs, editMode, isDragging, refreshKey,
  onPointerDown, onClick, onSettingsClick,
}: {
  name: string;
  habits: Habit[];
  logs: Record<string, HabitLog>;
  editMode: boolean;
  isDragging: boolean;
  refreshKey: number;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: () => void;
  onSettingsClick: (e: React.MouseEvent) => void;
}) {
  // Re-read color/icon from localStorage on every render (refreshKey forces this)
  const currentColor = getCatColor(name, habits);
  const CustomIcon = getCatIcon(name);
  void refreshKey;

  const doneCount = habits.filter(h => !!logs[h.id]).length;
  const total = habits.length;
  const pct = total > 0 ? doneCount / total : 0;
  const uniqueTypes = [...new Set(habits.map(h => h.tracking_type))].slice(0, 4);

  return (
    <div
      className={`relative select-none${editMode && !isDragging ? ' cat-jiggle' : ''}`}
      style={{ userSelect: 'none' }}
    >
      <div
        className="relative rounded-[24px] overflow-hidden text-left w-full"
        style={{
          background: '#111111',
          border: editMode ? `1px solid ${currentColor}44` : '1px solid #1e1e1e',
          minHeight: 160,
          display: 'flex', flexDirection: 'column',
          boxShadow: isDragging
            ? '0 28px 64px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.6)'
            : 'none',
          transition: isDragging ? 'none' : 'box-shadow 0.2s, border-color 0.2s',
        }}
        onPointerDown={onPointerDown}
        onClick={onClick}
      >
        {/* Colored top band */}
        <div className="relative flex items-center justify-center"
          style={{ background: currentColor, height: 88, width: '100%', flexShrink: 0 }}>
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

          {/* Settings icon — only visible in edit mode */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={onSettingsClick}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: 'rgba(0,0,0,0.45)',
              opacity: editMode ? 1 : 0,
              pointerEvents: editMode ? 'auto' : 'none',
              transition: 'opacity 0.2s',
            }}
            aria-label="Edit category"
          >
            <Settings2 size={13} color="white" strokeWidth={1.5} />
          </button>
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
                style={{ width: `${pct * 100}%`, background: currentColor }} />
            </div>
          )}
        </div>
      </div>
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

  // ── Edit mode (iOS-style) ─────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [catEditName, setCatEditName] = useState<string | null>(null);
  // Incrementing this key forces CategoryCard to re-read localStorage after edits
  const [cardRefreshKey, setCardRefreshKey] = useState(0);

  // Exit edit mode when tapping outside cards
  function exitEditMode() { setEditMode(false); }

  // ── Category drag-to-reorder ──────────────────────────────────────────────
  type CatDrag = { fromIdx: number; toIdx: number; offsetX: number; offsetY: number; slotW: number; slotH: number };
  const [catDrag, setCatDrag] = useState<CatDrag | null>(null);
  const catDragRef = useRef<CatDrag | null>(null);
  const catDidDragRef = useRef(false);
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
    try { navigator.vibrate?.(30); } catch {}

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
      if (dr && dr.fromIdx !== dr.toIdx) {
        catDidDragRef.current = true;
        saveCatOrder(dr.fromIdx, dr.toIdx);
      }
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

  async function renameCategory(oldName: string, newName: string) {
    await supabase.from('habits').update({ category: newName }).eq('user_id', pet!.user_id).eq('category', oldName);
    ['cat-color-', 'cat-icon-'].forEach(prefix => {
      const v = localStorage.getItem(prefix + oldName);
      if (v) { localStorage.setItem(prefix + newName, v); localStorage.removeItem(prefix + oldName); }
    });
    setCatOrder(prev => prev.map(n => n === oldName ? newName : n));
    closeCatEdit();
    loadData();
  }

  async function deleteCategory(catName: string) {
    // Move all habits in this category to null (they'll appear under 'General')
    await supabase.from('habits').update({ category: null }).eq('user_id', pet!.user_id).eq('category', catName);
    ['cat-color-', 'cat-icon-'].forEach(prefix => localStorage.removeItem(prefix + catName));
    setCatOrder(prev => prev.filter(n => n !== catName));
    closeCatEdit();
    loadData();
  }

  function closeCatEdit() {
    setCatEditName(null);
    setEditMode(false);
    // Force cards to re-read color/icon from localStorage
    setCardRefreshKey(k => k + 1);
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
    const userId = pet.user_id;
    const dateKey = new Date().toISOString().slice(0, 10);
    try {
      const [habitRes, logRes] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', userId).eq('archived', false).order('sort_order'),
        supabase.from('habit_logs').select('*').eq('user_id', userId).eq('date_key', dateKey),
      ]);
      if (habitRes.error) console.error('[habits] fetch error:', habitRes.error.message, habitRes.error);
      if (habitRes.data) {
        setHabits(habitRes.data.map(x => ({ ...x, checklist_items: x.checklist_items ?? [] })) as Habit[]);
      }
      if (logRes.error) console.error('[logs] fetch error:', logRes.error.message);
      if (logRes.data) {
        const map: Record<string, HabitLog> = {};
        for (const log of logRes.data) map[log.habit_id] = log as HabitLog;
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

  // Merge saved order with any new categories not yet in the saved order
  const savedNames = catOrder.filter(n => categoryMap.has(n));
  const newNames = categoriesBase.map(([n]) => n).filter(n => !catOrder.includes(n));
  const orderedNames = [...savedNames, ...newNames];
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

      {/* Edit mode backdrop — tap to exit */}
      {editMode && (
        <div className="fixed inset-0 z-10" onClick={exitEditMode} />
      )}

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

        {/* Date + count + edit/done button */}
        <div className="flex items-center justify-between mb-5 fade-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-white/25 text-xs">{todayLabel}</p>
          <div className="flex items-center gap-3">
            {habits.length > 0 && (
              <span className="text-white/20 text-xs">{totalDone}/{habits.length} done</span>
            )}
            {habits.length > 0 && !editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="w-7 h-7 flex items-center justify-center rounded-full transition-all active:scale-90"
                style={{ background: '#1e1e1e' }}
                aria-label="Edit categories"
              >
                <Pencil size={11} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
              </button>
            )}
            {editMode && (
              <button
                onClick={exitEditMode}
                className="px-3 py-1 rounded-xl text-xs font-semibold transition-all"
                style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.7)' }}
              >
                Done
              </button>
            )}
          </div>
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
                    const cols = 2;
                    const iCol = idx % cols;
                    if (idx > Math.min(fromIdx, toIdx) && idx <= Math.max(fromIdx, toIdx)) {
                      if (fromIdx < toIdx) { translateX = -slotW; if (iCol === 0) { translateX = slotW; translateY = -slotH; } }
                      else { translateX = slotW; if (iCol === cols - 1) { translateX = -slotW; translateY = slotH; } }
                    }
                  }
                }
                return (
                  <div key={catName} ref={el => { catCardRefs.current[idx] = el; }}
                    style={{
                      transform: isLifted
                        ? `translate(${translateX}px, ${translateY}px) scale(1.08) rotate(2deg)`
                        : `translate(${translateX}px, ${translateY}px)`,
                      transition: isLifted ? 'none' : 'transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94)',
                      zIndex: isLifted ? 20 : 1, position: 'relative',
                    }}>
                    <CategoryCard
                      name={catName}
                      habits={catHabits}
                      logs={todayLogs}
                      editMode={editMode}
                      isDragging={isLifted}
                      refreshKey={cardRefreshKey}
                      onPointerDown={e => {
                        if (!editMode) return;
                        // In edit mode: track movement to detect drag
                        const startX = e.clientX, startY = e.clientY;
                        let dragging = false;
                        function onMove(ev: PointerEvent) {
                          if (ev.pointerId !== e.pointerId) return;
                          const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
                          if (!dragging && dist > 8) {
                            dragging = true;
                            document.removeEventListener('pointermove', onMove);
                            document.removeEventListener('pointerup', onUp);
                            startCatDrag(idx, e, 2);
                          }
                        }
                        function onUp() {
                          document.removeEventListener('pointermove', onMove);
                          document.removeEventListener('pointerup', onUp);
                        }
                        document.addEventListener('pointermove', onMove);
                        document.addEventListener('pointerup', onUp, { once: true });
                      }}
                      onClick={() => {
                        if (catDidDragRef.current) { catDidDragRef.current = false; return; }
                        if (editMode) return; // In edit mode, tap opens settings (handled by settings button)
                        onCategory(catName, catHabits, allCategoryNames, getCatColor(catName, catHabits), canCustomize, pro);
                      }}
                      onSettingsClick={e => {
                        e.stopPropagation();
                        setCatEditName(catName);
                      }}
                    />
                  </div>
                );
              })}
              <button
                onClick={() => { exitEditMode(); setShowCreator(true); }}
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

      {catEditName && (() => {
        const editHabits = categoryMap.get(catEditName) ?? [];
        return (
          <CategoryEditSheet
            catName={catEditName}
            habits={editHabits}
            onClose={closeCatEdit}
            onRenamed={newName => renameCategory(catEditName, newName)}
            onDeleted={() => deleteCategory(catEditName)}
          />
        );
      })()}
    </>
  );
}
