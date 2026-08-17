import { useEffect, useRef, useState } from 'react';
import {
  LogOut, Flame, Users, CreditCard, Laugh, Smile, Meh, Frown,
  Sparkles, Star, BarChart2, Plus,
  Dumbbell, BookOpen, List, Timer, Hash, Activity, TrendingDown, Check, ChevronLeft, ChevronRight,
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

// ─── Category appearance sheet (color + icon only) ───────────────────────────

function CategoryAppearanceSheet({
  catName, habits, onClose,
}: {
  catName: string;
  habits: Habit[];
  onClose: () => void;
}) {
  const [color, setColor] = useState(() => getCatColor(catName, habits));
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [, forceUpdate] = useState(0);
  const CustomIcon = getCatIcon(catName);

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
        <p className="text-white font-semibold text-base mb-5">{catName}</p>

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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all active:scale-[0.98]"
          style={{ background: '#1e1e1e' }}
        >
          {CustomIcon
            ? <CustomIcon size={18} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            : <Star size={18} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />}
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Change Icon</span>
        </button>
      </div>
    </>
  );
}

// ─── Category rename sheet ────────────────────────────────────────────────────

function CatRenameSheet({ catName, onSave, onClose }: {
  catName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(catName);
  const changed = value.trim() && value.trim() !== catName;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[28px] px-5 pt-5 pb-10"
        style={{ background: '#111111', border: '1px solid #1e1e1e' }}
        onClick={e => e.stopPropagation()}>
        <div className="w-8 h-1 rounded-full bg-white/15 mx-auto mb-5" />
        <p className="text-white/40 text-xs mb-2">Rename category</p>
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && changed) onSave(value.trim()); if (e.key === 'Escape') onClose(); }}
          className="w-full text-white text-lg font-semibold bg-transparent outline-none border-b mb-5 pb-1"
          style={{ borderColor: 'rgba(255,255,255,0.15)' }}
        />
        <button
          onClick={() => changed ? onSave(value.trim()) : onClose()}
          disabled={!value.trim()}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-30"
          style={{ background: changed ? '#FF4D4D' : '#1e1e1e', color: changed ? 'white' : 'rgba(255,255,255,0.4)' }}
        >
          {changed ? 'Save Name' : 'Cancel'}
        </button>
      </div>
    </>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────

function CategoryCard({
  name, habits, logs, editMode, isDragging, refreshKey,
  onPointerDown, onClick, onSettingsClick, onDeleteClick, onRenameStart,
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
  onDeleteClick: (e: React.MouseEvent) => void;
  onRenameStart: (e: React.MouseEvent) => void;
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
      {/* Red minus delete button — top-right in edit mode */}
      {editMode && (
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={onDeleteClick}
          className="absolute -top-2 -right-2 z-30 w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: '#DC2626', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        >
          <span className="text-white font-bold text-base leading-none" style={{ marginTop: -1 }}>−</span>
        </button>
      )}
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
            <Star size={13} color="white" strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-3 gap-1" style={{ background: '#141414', marginTop: -6, borderRadius: '14px 14px 0 0' }}>
          <p
            className="text-white text-sm font-semibold leading-tight truncate"
            onClick={e => { if (editMode) { e.stopPropagation(); onRenameStart(e); } }}
            onPointerDown={e => { if (editMode) e.stopPropagation(); }}
            style={{ cursor: editMode ? 'text' : 'default' }}
          >
            {name}{editMode && <span className="ml-1 text-[9px] opacity-30">✎</span>}
          </p>
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

// ─── Page helpers ─────────────────────────────────────────────────────────────

function getCatPage(catName: string): number {
  return parseInt(localStorage.getItem(`cat-page-${catName}`) ?? '0');
}
function setCatPageLocal(catName: string, page: number) {
  localStorage.setItem(`cat-page-${catName}`, String(page));
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

  // ── Pages ─────────────────────────────────────────────────────────────────
  const [currentPage, _setCurrentPage] = useState(0);
  const currentPageRef = useRef(0);
  function setCurrentPage(n: number) { currentPageRef.current = n; _setCurrentPage(n); }

  const [totalPages, _setTotalPages] = useState(() =>
    pet ? parseInt(localStorage.getItem(`page-count-${pet.user_id}`) ?? '1') : 1
  );
  const totalPagesRef = useRef(totalPages);
  function setTotalPages(n: number) { totalPagesRef.current = n; _setTotalPages(n); }
  useEffect(() => { totalPagesRef.current = totalPages; }, [totalPages]);

  const [pageNames, setPageNames] = useState<Record<number, string>>(() => {
    if (!pet) return {};
    const result: Record<number, string> = {};
    const total = parseInt(localStorage.getItem(`page-count-${pet.user_id}`) ?? '1');
    for (let i = 0; i < total; i++) {
      const n = localStorage.getItem(`page-name-${pet.user_id}-${i}`);
      if (n) result[i] = n;
    }
    return result;
  });
  const [editingPageName, setEditingPageName] = useState(false);
  const [pageNameInput, setPageNameInput] = useState('');

  function getPageName(i: number) { return pageNames[i] ?? `Page ${i + 1}`; }
  function savePageName(val: string) {
    const trimmed = val.trim() || `Page ${currentPage + 1}`;
    localStorage.setItem(`page-name-${pet!.user_id}-${currentPage}`, trimmed);
    setPageNames(prev => ({ ...prev, [currentPage]: trimmed }));
    setEditingPageName(false);
  }

  // ── Page swipe ─────────────────────────────────────────────────────────────
  const [swipeDrag, setSwipeDrag] = useState(0);
  const swipeActiveRef = useRef(false);
  const swipeDataRef = useRef<{ startX: number; startY: number; pid: number; dir: 'h' | 'v' | null } | null>(null);

  function onCatSwipeDown(e: React.PointerEvent) {
    if (editMode || catDrag) return;
    swipeDataRef.current = { startX: e.clientX, startY: e.clientY, pid: e.pointerId, dir: null };
  }
  function onCatSwipeMove(e: React.PointerEvent) {
    const d = swipeDataRef.current;
    if (!d || e.pointerId !== d.pid) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (d.dir === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      d.dir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }
    if (d.dir === 'v') return;
    // Horizontal swipe: apply drag with rubber-band at edges
    let offset = dx;
    if (currentPageRef.current === 0 && dx > 0) offset = dx * 0.25;
    if (currentPageRef.current >= totalPagesRef.current - 1 && dx < 0) offset = dx * 0.25;
    swipeActiveRef.current = true;
    setSwipeDrag(offset);
  }
  function onCatSwipeUp(e: React.PointerEvent) {
    const d = swipeDataRef.current;
    if (!d || e.pointerId !== d.pid) return;
    swipeDataRef.current = null;
    const wasActive = swipeActiveRef.current;
    swipeActiveRef.current = false;
    setSwipeDrag(0);
    if (!wasActive) return;
    const dx = e.clientX - d.startX;
    const THRESHOLD = 60;
    if (dx < -THRESHOLD) {
      // Swipe left → next page (only create new page if current page has content)
      const cp = currentPageRef.current;
      const tp = totalPagesRef.current;
      if (cp >= tp - 1) {
        const currentHasContent = [...categoryMap.entries()].some(([n]) => getCatPage(n) === cp);
        if (!currentHasContent) return;
        const newTotal = tp + 1;
        localStorage.setItem(`page-count-${pet!.user_id}`, String(newTotal));
        setTotalPages(newTotal);
        setCurrentPage(tp);
      } else {
        setCurrentPage(cp + 1);
      }
    } else if (dx > THRESHOLD && currentPageRef.current > 0) {
      setCurrentPage(currentPageRef.current - 1);
    }
  }

  // ── Edit mode (iOS-style) ─────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [catEditName, setCatEditName] = useState<string | null>(null);
  // Incrementing this key forces CategoryCard to re-read localStorage after edits
  const [cardRefreshKey, setCardRefreshKey] = useState(0);

  function enterEditMode() {
    setEditMode(true);
    try { navigator.vibrate?.(50); } catch {}
  }
  function exitEditMode() {
    setEditMode(false);
    setCatRenamingName(null);
  }

  // ── Category drag-to-reorder ──────────────────────────────────────────────
  type CatDrag = { fromIdx: number; toIdx: number; offsetX: number; offsetY: number; slotW: number; slotH: number };
  const [catDrag, setCatDrag] = useState<CatDrag | null>(null);
  const catDragRef = useRef<CatDrag | null>(null);
  const catDidDragRef = useRef(false);
  const [catOrder, setCatOrder] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(`cat-order-${pet?.user_id}`) ?? '[]'); } catch { return []; }
  });
  const catCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(null);
  const [catRenamingName, setCatRenamingName] = useState<string | null>(null);

  function startCatDrag(idx: number, e: React.PointerEvent, numCols: number) {
    if (!editMode) return;
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
    // Update habits in DB
    await supabase.from('habits').update({ category: newName }).eq('user_id', pet!.user_id).eq('category', oldName);
    // Also update habits stored via localStorage fallback (category = null in DB)
    for (const h of habits) {
      const localCat = localStorage.getItem(`habit-cat-${h.id}`);
      if (localCat === oldName) {
        localStorage.setItem(`habit-cat-${h.id}`, newName);
        supabase.from('habits').update({ category: newName }).eq('id', h.id).then(() => {});
      }
    }
    // Migrate category metadata keys
    ['cat-color-', 'cat-icon-', 'cat-page-'].forEach(prefix => {
      const v = localStorage.getItem(prefix + oldName);
      if (v) { localStorage.setItem(prefix + newName, v); localStorage.removeItem(prefix + oldName); }
    });
    setCatOrder(prev => {
      const updated = prev.map(n => n === oldName ? newName : n);
      localStorage.setItem(`cat-order-${pet?.user_id}`, JSON.stringify(updated));
      return updated;
    });
    setCatRenamingName(null);
    loadData();
  }

  async function deleteCategoryAndHabits(catName: string) {
    // Archive all habits in this category
    await supabase.from('habits').update({ archived: true }).eq('user_id', pet!.user_id).eq('category', catName);
    // Also archive localStorage-fallback habits
    for (const h of habits) {
      const localCat = localStorage.getItem(`habit-cat-${h.id}`);
      if (localCat === catName) {
        supabase.from('habits').update({ archived: true }).eq('id', h.id).then(() => {});
      }
    }
    ['cat-color-', 'cat-icon-', 'cat-page-'].forEach(prefix => localStorage.removeItem(prefix + catName));
    setCatOrder(prev => prev.filter(n => n !== catName));
    loadData();
  }

  async function moveCategoryHabits(catName: string, targetCat: string) {
    await supabase.from('habits').update({ category: targetCat }).eq('user_id', pet!.user_id).eq('category', catName);
    for (const h of habits) {
      const localCat = localStorage.getItem(`habit-cat-${h.id}`);
      if (localCat === catName) {
        localStorage.setItem(`habit-cat-${h.id}`, targetCat);
        supabase.from('habits').update({ category: targetCat }).eq('id', h.id).then(() => {});
      }
    }
    ['cat-color-', 'cat-icon-', 'cat-page-'].forEach(prefix => localStorage.removeItem(prefix + catName));
    setCatOrder(prev => prev.filter(n => n !== catName));
    loadData();
  }

  function closeCatEdit() {
    setCatEditName(null);
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
        const processed = habitRes.data.map(x => ({ ...x, checklist_items: x.checklist_items ?? [] })) as Habit[];
        setHabits(processed);
        // Assign any new (unassigned) categories to the current page
        for (const h of processed) {
          const cat = h.category ?? localStorage.getItem(`habit-cat-${h.id}`) ?? 'General';
          if (!localStorage.getItem(`cat-page-${cat}`)) {
            setCatPageLocal(cat, currentPageRef.current);
          }
        }
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

        {/* Date + count */}
        <div className="flex items-center justify-between mb-5 fade-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-white/25 text-xs">{todayLabel}</p>
          {habits.length > 0 && (
            <span className={`text-xs transition-colors ${editMode ? 'text-white/40' : 'text-white/20'}`}>
              {editMode ? 'Tap name to rename · − to delete' : `${totalDone}/${habits.length} done`}
            </span>
          )}
        </div>

        {/* Page name + dots + nav arrows */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-1.5 mb-4">
            {/* Page name — tappable in edit mode */}
            {editingPageName ? (
              <input
                autoFocus
                value={pageNameInput}
                onChange={e => setPageNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') savePageName(pageNameInput); if (e.key === 'Escape') setEditingPageName(false); }}
                onBlur={() => savePageName(pageNameInput)}
                className="text-white text-xs font-semibold text-center outline-none bg-transparent border-b border-white/30 pb-0.5 w-32"
                placeholder={`Page ${currentPage + 1}`}
              />
            ) : (
              <button
                onClick={() => { if (editMode) { setPageNameInput(getPageName(currentPage)); setEditingPageName(true); } }}
                className="text-xs font-medium transition-colors"
                style={{ color: editMode ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)', cursor: editMode ? 'text' : 'default' }}
              >
                {getPageName(currentPage)}{editMode && ' ✎'}
              </button>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                className="w-6 h-6 flex items-center justify-center rounded-full transition-all"
                style={{ opacity: currentPage > 0 ? 0.4 : 0.1, pointerEvents: currentPage > 0 ? 'auto' : 'none' }}
              >
                <ChevronLeft size={12} color="white" />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === currentPage ? 20 : 6,
                      height: 6,
                      background: i === currentPage ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  if (currentPage < totalPages - 1) {
                    setCurrentPage(currentPage + 1);
                  } else {
                    // Only create a new page if current page has content
                    const currentHasContent = categories.some(([n]) => getCatPage(n) === currentPage);
                    if (!currentHasContent) return;
                    const newTotal = totalPages + 1;
                    localStorage.setItem(`page-count-${pet!.user_id}`, String(newTotal));
                    setTotalPages(newTotal);
                    setCurrentPage(totalPages);
                  }
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full transition-all"
                style={{ opacity: currentPage < totalPages - 1 || categories.some(([n]) => getCatPage(n) === currentPage) ? 0.4 : 0.1 }}
              >
                <ChevronRight size={12} color="white" />
              </button>
            </div>
          </div>
        )}

        {/* Category cards — swipeable */}
        <div
          className="fade-up overflow-hidden"
          style={{ animationDelay: '0.2s', touchAction: 'pan-y' }}
          onPointerDown={onCatSwipeDown}
          onPointerMove={onCatSwipeMove}
          onPointerUp={onCatSwipeUp}
          onPointerCancel={onCatSwipeUp}
        >
          <div
            style={{
              transform: `translateX(${swipeDrag}px)`,
              transition: swipeActiveRef.current ? 'none' : 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          >
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

          {!habitsLoading && habits.length > 0 && (() => {
            const pageCategories = categories.filter(([catName]) => getCatPage(catName) === currentPage);
            return (
              <div className="grid grid-cols-2 gap-3">
                {pageCategories.map(([catName, catHabits], pageIdx) => {
                  // Map page-local index to global index for drag-to-reorder
                  const idx = categories.findIndex(([n]) => n === catName);
                  let translateX = 0, translateY = 0, isLifted = false;
                  if (catDrag) {
                    const { fromIdx, toIdx, offsetX, offsetY, slotW, slotH } = catDrag;
                    if (idx === fromIdx) { translateX = offsetX; translateY = offsetY; isLifted = true; }
                    else {
                      const cols = 2;
                      const iCol = pageIdx % cols;
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
                        onDeleteClick={e => { e.stopPropagation(); setConfirmDeleteCat(catName); }}
                        onRenameStart={e => { e.stopPropagation(); setCatRenamingName(catName); }}
                        onPointerDown={e => {
                          if (editMode) {
                            const startX = e.clientX, startY = e.clientY;
                            const pid = e.pointerId;
                            let started = false;
                            function onMove(ev: PointerEvent) {
                              if (ev.pointerId !== pid) return;
                              if (!started && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 8) {
                                started = true;
                                document.removeEventListener('pointermove', onMove);
                                document.removeEventListener('pointerup', onUp);
                                startCatDrag(idx, e, 2);
                              }
                            }
                            function onUp(ev: PointerEvent) {
                              if (ev.pointerId !== pid) return;
                              document.removeEventListener('pointermove', onMove);
                              document.removeEventListener('pointerup', onUp);
                            }
                            document.addEventListener('pointermove', onMove);
                            document.addEventListener('pointerup', onUp);
                          } else {
                            // Long-press to enter edit mode
                            const startX = e.clientX, startY = e.clientY;
                            const pid = e.pointerId;
                            if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                            const timer = setTimeout(() => {
                              longPressTimerRef.current = null;
                              document.removeEventListener('pointermove', onLPMove);
                              document.removeEventListener('pointerup', onLPUp);
                              enterEditMode();
                            }, 500);
                            longPressTimerRef.current = timer;
                            function onLPMove(ev: PointerEvent) {
                              if (ev.pointerId !== pid) return;
                              if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 10) {
                                clearTimeout(timer);
                                longPressTimerRef.current = null;
                                document.removeEventListener('pointermove', onLPMove);
                                document.removeEventListener('pointerup', onLPUp);
                              }
                            }
                            function onLPUp() {
                              clearTimeout(timer);
                              longPressTimerRef.current = null;
                              document.removeEventListener('pointermove', onLPMove);
                              document.removeEventListener('pointerup', onLPUp);
                            }
                            document.addEventListener('pointermove', onLPMove);
                            document.addEventListener('pointerup', onLPUp, { once: true });
                          }
                        }}
                        onClick={() => {
                          if (catDidDragRef.current) { catDidDragRef.current = false; return; }
                          if (editMode) return;
                          onCategory(catName, catHabits, allCategoryNames, getCatColor(catName, catHabits), canCustomize, pro);
                        }}
                        onSettingsClick={e => {
                          e.stopPropagation();
                          if (editMode) setCatEditName(catName);
                        }}
                      />
                    </div>
                  );
                })}

                {/* Add habit / new page slot */}
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
            );
          })()}
          </div>
        </div>

        {/* Swipe hint — only on first session with multiple pages */}
        {!habitsLoading && habits.length > 0 && totalPages === 1 && (
          <p className="text-white/15 text-[10px] text-center mt-3">
            Swipe left to add a new page
          </p>
        )}

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

      {/* Floating Done button in edit mode */}
      {editMode && (
        <div className="fixed bottom-10 left-0 right-0 z-30 flex justify-center pointer-events-none">
          <button
            onClick={exitEditMode}
            className="pointer-events-auto px-10 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
            style={{ background: 'white', color: '#111', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}
          >
            Done
          </button>
        </div>
      )}

      {/* Confirm delete sheet (drag-down gesture) */}
      {confirmDeleteCat && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDeleteCat(null)} />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[28px] px-5 pt-5 pb-10"
            style={{ background: '#111111', border: '1px solid #1e1e1e' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-8 h-1 rounded-full bg-white/15 mx-auto mb-5" />
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#1e1e1e' }}>
                <span className="text-xl">🗑</span>
              </div>
              <p className="text-white font-semibold text-base mb-1">Delete "{confirmDeleteCat}"?</p>
              <p className="text-white/35 text-sm">What should happen to the habits inside?</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { deleteCategoryAndHabits(confirmDeleteCat!); setConfirmDeleteCat(null); }}
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{ background: '#DC2626', color: 'white' }}
              >
                Delete category &amp; all habits
              </button>
              {allCategoryNames.filter(n => n !== confirmDeleteCat).length > 0 && (
                <button
                  onClick={() => {
                    const target = allCategoryNames.filter(n => n !== confirmDeleteCat)[0];
                    moveCategoryHabits(confirmDeleteCat!, target);
                    setConfirmDeleteCat(null);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-medium"
                  style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.7)' }}
                >
                  Move habits to "{allCategoryNames.filter(n => n !== confirmDeleteCat)[0]}"
                </button>
              )}
              <button
                onClick={() => setConfirmDeleteCat(null)}
                className="w-full py-2 text-xs"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

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
          <CategoryAppearanceSheet
            catName={catEditName}
            habits={editHabits}
            onClose={closeCatEdit}
          />
        );
      })()}

      {catRenamingName && (
        <CatRenameSheet
          catName={catRenamingName}
          onSave={newName => renameCategory(catRenamingName, newName)}
          onClose={() => setCatRenamingName(null)}
        />
      )}
    </>
  );
}
