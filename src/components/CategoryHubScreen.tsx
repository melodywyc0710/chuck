import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, Check, Play, Pause, Plus, Minus, Trash2,
  BookOpen, List, Timer as TimerIcon, Hash, Activity, TrendingDown, Dumbbell,
  Edit2, Camera, GripVertical, RotateCcw, Pin, PinOff,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { recordCompletion } from '../lib/petEngine';
import { MetricPanels } from './FitnessTracker';
import HabitCreator from './HabitCreator';
import InsightsPanel from './InsightsPanel';
import PhotoVerifyModal from './PhotoVerifyModal';
import type { Habit, HabitLog } from '../lib/habitTypes';
import type { TaskVerifyResult } from '../lib/aiTypes';

interface Props {
  isPro: boolean;
  categoryName: string;
  initialHabits: Habit[];
  allCategoryNames: string[];
  color: string;
  canCustomize: boolean;
  onBack: () => void;
  onWorkout: () => void;
  onJournal: () => void;
}

// ─── Color picker ─────────────────────────────────────────────────────────────

const COLOR_PALETTE = [
  '#FF4D4D', '#F97316', '#F59E0B', '#10B981',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
  '#EC4899', '#888888',
];

function ColorPicker({ catName, current, onPick }: { catName: string; current: string; onPick: (c: string) => void }) {
  function pick(c: string) {
    localStorage.setItem(`cat-color-${catName}`, c);
    onPick(c);
  }
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => onPick(current)} />
      <div className="absolute top-8 right-0 z-50 p-2 rounded-2xl flex flex-wrap gap-1.5"
        style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', width: 136 }}>
        {COLOR_PALETTE.map(c => (
          <button key={c} onClick={() => pick(c)}
            className="w-8 h-8 rounded-xl transition-all active:scale-90"
            style={{ background: c, border: current === c ? '2px solid white' : '2px solid transparent' }} />
        ))}
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────


// ─── Inline timer ─────────────────────────────────────────────────────────────

function InlineTimer({ habit, color, onLog }: { habit: Habit; color: string; onLog: (mins: number) => void }) {
  const targetSecs = (habit.target_value ?? 25) * 60;
  const [secsLeft, setSecsLeft] = useState(targetSecs);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  function startStop() {
    if (finished) return;
    if (running) {
      clearInterval(intervalRef.current!); intervalRef.current = null; setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSecsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!); intervalRef.current = null;
            setRunning(false); setFinished(true); return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
  }

  function handleDone() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onLog(Math.max(1, Math.round((targetSecs - secsLeft) / 60)));
  }

  const pct = secsLeft / targetSecs;
  const r = 56;
  const circ = 2 * Math.PI * r;
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const strokeColor = color;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 128 128" width="80" height="80">
          <circle cx="64" cy="64" r={r} fill="none" stroke="#2a2a2a" strokeWidth="4" />
          <circle cx="64" cy="64" r={r} fill="none" stroke={strokeColor} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * pct}
            style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <p className="text-white font-semibold tabular-nums text-sm">{mm}:{ss}</p>
      </div>
      <div className="flex gap-2">
        {!finished && (
          <button onClick={startStop}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: color }}>
            {running ? <Pause size={15} fill="white" /> : <Play size={15} fill="white" style={{ marginLeft: 1 }} />}
          </button>
        )}
        {(running || secsLeft < targetSecs || finished) && (
          <button onClick={handleDone}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: finished ? color : '#252525' }}>
            {finished ? 'Done!' : 'Mark done'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Per-habit tracker panel ──────────────────────────────────────────────────

const TYPE_ICONS: Record<string, React.ElementType> = {
  workout: Dumbbell, journal: BookOpen, checklist: List,
  complete: Check, timer: TimerIcon, counter: Hash,
  numeric: Activity, avoid: TrendingDown,
};

function HabitPanel({
  habit, todayLog, pet, user, color, isPro,
  isPinned, onTogglePin, onDelete, onRename,
  onLogUpdated, onLogCleared, onWorkout, onJournal, onPhotoVerify, onGripPointerDown,
}: {
  habit: Habit;
  todayLog: HabitLog | null;
  pet: ReturnType<typeof useAuthStore.getState>['pet'];
  user: ReturnType<typeof useAuthStore.getState>['user'];
  color: string;
  isPro: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onLogUpdated: (log: HabitLog) => void;
  onLogCleared: () => void;
  onWorkout: () => void;
  onJournal: () => void;
  onPhotoVerify: () => void;
  onGripPointerDown: (e: React.PointerEvent) => void;
}) {
  const setPet = useAuthStore(s => s.setPetLocal);
  const today = new Date().toISOString().slice(0, 10);
  const [counter, setCounter] = useState(todayLog?.value ?? 0);
  const [numInput, setNumInput] = useState(todayLog?.value != null ? String(todayLog.value) : '');
  const [checkedItems, setCheckedItems] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(todayLog?.notes ?? '[]') as number[]); } catch { return new Set(); }
  });
  const [journalDone, setJournalDone] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [nameEditing, setNameEditing] = useState(false);
  const [nameInput, setNameInput] = useState(habit.name);
  // Swipe gesture
  const [swipeX, setSwipeX] = useState(0);
  const swipeRef = useRef({ active: false, startX: 0, startY: 0, pid: -1, cancelled: false });
  // Tap-to-confirm delete
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Long-press to open edit mode
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (habit.tracking_type === 'journal' && user) {
      supabase.from('diary_entries').select('id').eq('user_id', user.id).eq('date_key', today).limit(1)
        .then(({ data }) => { if (data && data.length > 0) setJournalDone(true); });
    }
  }, []);

  async function logHabit(value: number | null, notes?: string) {
    if (!user) return;
    const isFirst = !todayLog;
    let updated: HabitLog;
    if (todayLog) {
      const { data } = await supabase.from('habit_logs')
        .update({ value, notes: notes ?? null, logged_at: new Date().toISOString() })
        .eq('id', todayLog.id).select().single();
      if (!data) return;
      updated = data as HabitLog;
    } else {
      const { data } = await supabase.from('habit_logs')
        .insert({ user_id: user.id, habit_id: habit.id, date_key: today, value, notes: notes ?? null })
        .select().single();
      if (!data) return;
      updated = data as HabitLog;
    }
    onLogUpdated(updated);
    if (isFirst && pet) {
      const updatedPet = await recordCompletion(pet, user.id);
      if (updatedPet) setPet(updatedPet);
    }
  }

  async function undoHabit() {
    if (!todayLog) return;
    await supabase.from('habit_logs').delete().eq('id', todayLog.id);
    setCounter(0); setNumInput(''); setCheckedItems(new Set());
    onLogCleared();
  }

  async function saveRename() {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === habit.name) { setNameEditing(false); return; }
    await supabase.from('habits').update({ name: trimmed }).eq('id', habit.id);
    onRename(trimmed); setNameEditing(false);
  }

  // ── Long-press to toggle edit mode ───────────────────────────────────────────
  function onCardPointerDown(e: React.PointerEvent) {
    if (nameEditing) return;
    lpStartRef.current = { x: e.clientX, y: e.clientY };
    longPressRef.current = setTimeout(() => {
      try { navigator.vibrate?.(18); } catch {}
      setEditMode(v => !v);
    }, 500);
  }
  function onCardPointerMove(e: React.PointerEvent) {
    if (!longPressRef.current) return;
    const dx = Math.abs(e.clientX - lpStartRef.current.x);
    const dy = Math.abs(e.clientY - lpStartRef.current.y);
    if (dx > 8 || dy > 8) { clearTimeout(longPressRef.current); longPressRef.current = null; }
  }
  function onCardPointerUp() {
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
  }

  const tt = habit.tracking_type;
  const TypeIcon = TYPE_ICONS[tt] ?? Check;

  const isDone = (() => {
    if (tt === 'journal') return journalDone;
    if (!todayLog) return false;
    if (tt === 'complete' || tt === 'avoid') return true;
    if ((tt === 'timer' || tt === 'counter') && habit.target_value != null)
      return (todayLog.value ?? 0) >= habit.target_value;
    if (tt === 'checklist')
      return habit.checklist_items.length > 0 && checkedItems.size >= habit.checklist_items.length;
    return !!todayLog;
  })();

  // ── Swipe to complete / undo ──────────────────────────────────────────────────
  const canSwipeComplete = (tt === 'complete' || tt === 'avoid') && !isDone;
  const canSwipeUndo = isDone && (tt === 'complete' || tt === 'avoid');

  function onSwipeDown(e: React.PointerEvent) {
    if (!canSwipeComplete && !canSwipeUndo) return;
    swipeRef.current = { active: true, startX: e.clientX, startY: e.clientY, pid: e.pointerId, cancelled: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onSwipeMove(e: React.PointerEvent) {
    const r = swipeRef.current;
    if (!r.active || r.cancelled || e.pointerId !== r.pid) return;
    const dx = e.clientX - r.startX;
    const dy = e.clientY - r.startY;
    if (Math.abs(dy) > Math.abs(dx) + 8) { r.cancelled = true; setSwipeX(0); return; }
    if (canSwipeComplete) setSwipeX(Math.max(0, Math.min(110, dx)));
    else if (canSwipeUndo) setSwipeX(Math.min(0, Math.max(-110, dx)));
  }
  function onSwipeUp(e: React.PointerEvent) {
    const r = swipeRef.current;
    if (!r.active || e.pointerId !== r.pid) return;
    r.active = false;
    if (!r.cancelled) {
      if (swipeX > 72 && canSwipeComplete) { logHabit(1); }
      else if (swipeX < -72 && canSwipeUndo) { undoHabit(); }
    }
    setSwipeX(0);
  }

  function handleCounter(delta: number) {
    const next = Math.max(0, counter + delta);
    setCounter(next); logHabit(next);
  }

  function toggleChecklistItem(idx: number) {
    const next = new Set(checkedItems);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setCheckedItems(next); logHabit(next.size, JSON.stringify([...next]));
  }

  const swipePct = Math.abs(swipeX) / 110;

  return (
    <div
      className="rounded-[20px] overflow-hidden relative"
      style={{ border: '1px solid #242424' }}
      onPointerDown={onCardPointerDown}
      onPointerMove={onCardPointerMove}
      onPointerUp={onCardPointerUp}
      onPointerCancel={onCardPointerUp}
    >
      {/* Swipe-right reveal (complete) */}
      {canSwipeComplete && swipeX > 0 && (
        <div className="absolute inset-0 rounded-[20px] flex items-center px-5" style={{ background: color, opacity: swipePct }}>
          <Check size={20} color="white" strokeWidth={2.5} />
        </div>
      )}
      {/* Swipe-left reveal (undo) */}
      {canSwipeUndo && swipeX < 0 && (
        <div className="absolute inset-0 rounded-[20px] flex items-center justify-end px-5" style={{ background: '#2d2d2d', opacity: swipePct }}>
          <RotateCcw size={18} color="rgba(255,255,255,0.6)" />
        </div>
      )}

      {/* Edit mode bar */}
      {editMode && (
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: '#1e1e1e', borderBottom: '1px solid #282828' }}>
          <div className="flex items-center gap-2">
            <button onClick={onTogglePin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{ background: isPinned ? '#2a2020' : '#282828', color: isPinned ? color : 'rgba(255,255,255,0.4)' }}>
              {isPinned ? <PinOff size={11} /> : <Pin size={11} />}
              {isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button onClick={() => setNameEditing(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{ background: '#282828', color: 'rgba(255,255,255,0.4)' }}>
              <Edit2 size={10} /> Rename
            </button>
          </div>
          {/* Tap-to-confirm delete */}
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/50">Delete?</span>
              <button onClick={e => { e.stopPropagation(); setConfirmDelete(false); }}
                className="px-2 py-1 rounded-lg text-xs font-medium"
                style={{ background: '#282828', color: 'rgba(255,255,255,0.5)' }}>Cancel</button>
              <button onClick={e => { e.stopPropagation(); onDelete(); }}
                className="px-2 py-1 rounded-lg text-xs font-medium text-white"
                style={{ background: '#7f1d1d' }}>Delete</button>
            </div>
          ) : (
            <button onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#2d1515' }}>
              <Trash2 size={13} color="#f87171" />
            </button>
          )}
        </div>
      )}

      {/* Card content — translates with swipe */}
      <div
        style={{ transform: `translateX(${swipeX}px)`, transition: swipeRef.current.active ? 'none' : 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)', background: '#1a1a1a' }}
        onPointerDown={onSwipeDown}
        onPointerMove={onSwipeMove}
        onPointerUp={onSwipeUp}
        onPointerCancel={onSwipeUp}
      >
      <div className="px-4 py-4">
        <div className="flex items-center gap-2.5 mb-4">
          {(tt === 'complete' || tt === 'avoid') ? (
            <button
              onClick={() => isDone ? undoHabit() : logHabit(1)}
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isDone ? color : '#2a2a2a' }}>
              {isDone
                ? <Check size={13} color="white" strokeWidth={2.5} />
                : <TypeIcon size={13} style={{ color }} strokeWidth={1.5} />
              }
            </button>
          ) : (
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isDone ? color : '#2a2a2a' }}>
              {isDone
                ? <Check size={13} color="white" strokeWidth={2.5} />
                : <TypeIcon size={13} style={{ color }} strokeWidth={1.5} />
              }
            </div>
          )}
          <div className="flex-1 min-w-0">
            {nameEditing ? (
              <input
                autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onBlur={saveRename}
                onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') { setNameInput(habit.name); setNameEditing(false); } }}
                className="w-full text-white text-sm font-semibold bg-transparent outline-none"
                style={{ borderBottom: `1px solid ${color}` }}
              />
            ) : (
              <div className="flex items-center gap-1.5 truncate">
                <p className="text-white text-sm font-semibold truncate">{habit.name}</p>
                {isPinned && <Pin size={9} style={{ color, flexShrink: 0 }} />}
              </div>
            )}
            <p className="text-white/25 text-[10px] capitalize">{tt} · {habit.frequency === 'monday' ? 'Every Mon' : habit.frequency === 'tuesday' ? 'Every Tue' : habit.frequency === 'wednesday' ? 'Every Wed' : habit.frequency === 'thursday' ? 'Every Thu' : habit.frequency === 'friday' ? 'Every Fri' : habit.frequency === 'saturday' ? 'Every Sat' : habit.frequency === 'sunday' ? 'Every Sun' : habit.frequency}</p>
          </div>
          {isDone && (tt === 'complete' || tt === 'avoid') ? (
            <button onClick={undoHabit} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ background: color }}>
              <Check size={9} color="white" /> Done
            </button>
          ) : isDone ? (
            <button onClick={undoHabit} className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: color }}>
              <RotateCcw size={9} color="white" />
              <span className="text-[10px] font-medium text-white">Done</span>
            </button>
          ) : null}
          <div
            onPointerDown={e => { e.stopPropagation(); onGripPointerDown(e); }}
            style={{ touchAction: 'none', cursor: 'grab', padding: '4px 2px', margin: '-4px -2px' }}
            className="flex items-center"
          >
            <GripVertical size={14} style={{ color: 'rgba(255,255,255,0.18)' }} />
          </div>
        </div>

        {(tt === 'complete' || tt === 'avoid') && !isDone && isPro && (
          <div className="flex justify-end">
            <button onClick={onPhotoVerify}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: '#252525' }} title="Verify with photo">
              <Camera size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>
          </div>
        )}

        {tt === 'timer' && (
          isDone
            ? <p className="text-sm" style={{ color }}>{todayLog?.value} min logged</p>
            : <InlineTimer habit={habit} color={color} onLog={mins => logHabit(mins)} />
        )}

        {tt === 'counter' && (
          <div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleCounter(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60" style={{ background: '#252525' }}>
                <Minus size={14} />
              </button>
              <p className="flex-1 text-center text-white font-semibold tabular-nums text-2xl" style={{ letterSpacing: '-0.02em' }}>
                {counter}
                {habit.target_value != null && <span className="text-white/30 text-base font-normal">/{habit.target_value}</span>}
              </p>
              <button onClick={() => handleCounter(1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60" style={{ background: '#252525' }}>
                <Plus size={14} />
              </button>
            </div>
            {habit.target_value != null && (
              <div className="h-1 rounded-full overflow-hidden mt-3" style={{ background: '#2a2a2a' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (counter / habit.target_value) * 100)}%`, background: color }} />
              </div>
            )}
          </div>
        )}

        {tt === 'numeric' && (
          isDone
            ? <p className="text-sm" style={{ color }}>{todayLog?.value} {habit.target_unit ?? ''} logged</p>
            : (
              <div className="flex gap-2">
                <input type="number" inputMode="decimal"
                  placeholder={`Value${habit.target_unit ? ` (${habit.target_unit})` : ''}…`}
                  value={numInput} onChange={e => setNumInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#222222' }} />
                <button onClick={() => { const v = parseFloat(numInput); if (!isNaN(v)) logHabit(v); }}
                  disabled={!numInput}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
                  style={{ background: color }}>
                  Log
                </button>
              </div>
            )
        )}

        {tt === 'journal' && (
          journalDone
            ? <p className="text-sm" style={{ color }}>Entry written today</p>
            : (
              <button onClick={() => { logHabit(1); onJournal(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: color }}>
                <BookOpen size={13} /> Write today's entry
              </button>
            )
        )}

        {tt === 'checklist' && (
          <div className="space-y-1.5">
            {habit.checklist_items.map((item, idx) => (
              <button key={idx} onClick={() => toggleChecklistItem(idx)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-left transition-all"
                style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{ border: `1.5px solid ${checkedItems.has(idx) ? color : 'rgba(255,255,255,0.2)'}`, background: checkedItems.has(idx) ? color : 'transparent' }}>
                  {checkedItems.has(idx) && <Check size={8} color="white" strokeWidth={3} />}
                </div>
                <span className="text-sm" style={{ color: checkedItems.has(idx) ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)', textDecoration: checkedItems.has(idx) ? 'line-through' : 'none' }}>
                  {item}
                </span>
              </button>
            ))}
            {habit.checklist_items.length > 0 && (
              <div className="h-0.5 rounded-full overflow-hidden mt-2" style={{ background: '#2a2a2a' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(checkedItems.size / habit.checklist_items.length) * 100}%`, background: color }} />
              </div>
            )}
          </div>
        )}

        {tt === 'workout' && (
          isDone
            ? <p className="text-sm" style={{ color }}>Workout logged today</p>
            : (
              <button onClick={() => { logHabit(1); onWorkout(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: color }}>
                <Dumbbell size={13} strokeWidth={1.5} /> Log workout
              </button>
            )
        )}
      </div>
      </div>{/* end swipe wrapper */}
    </div>
  );
}

// ─── History chart (comprehensive) ───────────────────────────────────────────

type Timeframe = '7d' | '30d' | '90d' | 'all';

function shortDate(dateKey: string) {
  return new Date(dateKey + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

function formatDate(dateKey: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateKey === today) return 'Today';
  if (dateKey === yesterday) return 'Yesterday';
  return new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatLogValue(habit: Habit, log: HabitLog): string {
  const tt = habit.tracking_type;
  if (tt === 'timer' && log.value != null) return `${log.value} min`;
  if (tt === 'counter' && log.value != null)
    return habit.target_value ? `${log.value}/${habit.target_value}` : `${log.value}`;
  if (tt === 'numeric' && log.value != null)
    return `${log.value}${habit.target_unit ? ' ' + habit.target_unit : ''}`;
  if (tt === 'checklist' && log.value != null) return `${log.value}/${habit.checklist_items.length} steps`;
  if (tt === 'complete' || tt === 'avoid') return 'Done';
  if (tt === 'journal') return 'Written';
  if (tt === 'workout') return 'Logged';
  return 'Done';
}

function getDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function HabitHistoryChart({ habit, logs, color, canExpand }: {
  habit: Habit; logs: HabitLog[]; color: string; canExpand: boolean;
}) {
  const TIMEFRAMES: { value: Timeframe; label: string; days: number; pro: boolean }[] = [
    { value: '7d',  label: '7d',   days: 7,   pro: false },
    { value: '30d', label: '30d',  days: 30,  pro: false },
    { value: '90d', label: '90d',  days: 90,  pro: true  },
    { value: 'all', label: 'All',  days: 999, pro: true  },
  ];

  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [showAll, setShowAll] = useState(false);

  const logMap = new Map(logs.map(l => [l.date_key, l]));

  const tf = TIMEFRAMES.find(t => t.value === timeframe)!;
  const days = timeframe === 'all'
    ? (logs.length > 0 ? (() => {
        const earliest = logs[logs.length - 1].date_key;
        const start = new Date(earliest + 'T00:00:00');
        const today = new Date();
        const n = Math.ceil((today.getTime() - start.getTime()) / 86400000) + 1;
        return getDays(Math.min(n, 365));
      })() : getDays(30))
    : getDays(tf.days);

  const isBinary = ['complete', 'avoid', 'journal', 'workout'].includes(habit.tracking_type);
  const values = days.map(day => {
    const log = logMap.get(day);
    if (!log) return 0;
    return isBinary ? 1 : (log.value ?? 0);
  });

  const maxVal = Math.max(...values, 1);
  const W = 320;
  const H = 80;
  const PAD = { left: 4, right: 4, top: 8, bottom: 4 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const points = values.map((v, i) => ({
    x: PAD.left + (days.length === 1 ? innerW / 2 : (i / (days.length - 1)) * innerW),
    y: PAD.top + innerH - (v / maxVal) * innerH,
    v, date: days[i],
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left},${(PAD.top + innerH).toFixed(1)} Z`;

  // Stats
  const thisWeekDone = getDays(7).filter(d => logMap.has(d)).length;
  const allTimeDone = logs.length;
  const activeDays = values.filter(v => v > 0).length;

  // Last 14 days dot grid
  const last14 = getDays(14);

  // Log list
  const shownLogs = showAll ? logs : logs.slice(0, 5);

  return (
    <div className="rounded-[20px] overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid #242424' }}>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/70 text-sm font-semibold">{habit.name}</p>
          {/* Timeframe picker */}
          <div className="flex gap-1">
            {TIMEFRAMES.filter(t => canExpand || !t.pro).map(t => (
              <button key={t.value}
                onClick={() => setTimeframe(t.value)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all"
                style={{
                  background: timeframe === t.value ? color : '#222222',
                  color: timeframe === t.value ? 'white' : 'rgba(255,255,255,0.4)',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2 mb-3">
          {[
            { label: 'This week', val: thisWeekDone },
            { label: 'All time',  val: allTimeDone },
            { label: 'Active days', val: activeDays },
          ].map(s => (
            <div key={s.label} className="flex-1 rounded-xl px-2 py-2 text-center" style={{ background: '#222222' }}>
              <p className="text-white font-semibold tabular-nums text-base" style={{ letterSpacing: '-0.03em' }}>{s.val}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Area chart */}
        <div className="rounded-xl px-3 pt-3 pb-2 mb-3" style={{ background: '#141414' }}>
          <p className="text-white/30 text-[10px] mb-2">{isBinary ? 'completions' : habit.target_unit ?? 'value'} · last {timeframe === 'all' ? 'year' : timeframe}</p>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 72, display: 'block' }}>
            <defs>
              <linearGradient id={`grad-${habit.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map(v => (
              <line key={v} x1={PAD.left} y1={PAD.top + innerH - v * innerH}
                x2={W - PAD.right} y2={PAD.top + innerH - v * innerH}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            <path d={areaPath} fill={`url(#grad-${habit.id})`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            {points.filter(p => p.v > 0).map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} />
            ))}
          </svg>
          <div className="flex justify-between mt-1">
            <span className="text-white/20 text-[10px]">{shortDate(days[0])}</span>
            {days.length > 10 && <span className="text-white/20 text-[10px]">{shortDate(days[Math.floor(days.length / 2)])}</span>}
            <span className="text-white/20 text-[10px]">Today</span>
          </div>
        </div>

        {/* 14-day dot grid */}
        <div className="rounded-xl px-3 py-3 mb-3" style={{ background: '#141414' }}>
          <p className="text-white/30 text-[10px] mb-2">last 14 days</p>
          <div className="flex gap-1.5">
            {last14.map(day => {
              const log = logMap.get(day);
              const hasLog = !!log;
              const val = log?.value ?? 0;
              const opacity = !hasLog ? 0 : isBinary ? 1 : Math.min(1, val / maxVal);
              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full rounded-md transition-all"
                    style={{ height: 20, background: hasLog ? `${color}${Math.round(opacity * 0.8 * 255 + 50).toString(16).padStart(2, '0')}` : 'rgba(255,255,255,0.06)' }} />
                  <span className="text-white/15 text-[8px]">
                    {new Date(day + 'T00:00:00').getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Log list */}
        {logs.length > 0 && (
          <div>
            <p className="text-white/30 text-[10px] mb-2">log</p>
            <div className="space-y-1">
              {shownLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{ background: '#141414' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: color }}>
                      <Check size={9} color="white" strokeWidth={2.5} />
                    </div>
                    <p className="text-white/50 text-xs">{formatDate(log.date_key)}</p>
                  </div>
                  <p className="text-white/30 text-xs">{formatLogValue(habit, log)}</p>
                </div>
              ))}
            </div>
            {logs.length > 5 && canExpand && (
              <button onClick={() => setShowAll(v => !v)}
                className="w-full mt-2 py-2 text-xs transition-colors"
                style={{ color: color }}>
                {showAll ? 'Show less' : `Show all ${logs.length} entries`}
              </button>
            )}
            {logs.length > 5 && !canExpand && (
              <p className="w-full mt-2 py-2 text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Upgrade to Pro for unlimited history
              </p>
            )}
          </div>
        )}
        {logs.length === 0 && (
          <p className="text-white/20 text-xs text-center py-2">No history yet</p>
        )}
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CategoryHubScreen({
  categoryName, initialHabits, allCategoryNames, color: initialColor, canCustomize, isPro,
  onBack, onWorkout, onJournal,
}: Props) {
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);

  const today = new Date().toISOString().slice(0, 10);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [todayLogs, setTodayLogs] = useState<Record<string, HabitLog>>({});
  const [allLogs, setAllLogs] = useState<Record<string, HabitLog[]>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'today' | 'history'>('today');
  const [showCreator, setShowCreator] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [photoVerifyHabit, setPhotoVerifyHabit] = useState<{ habit: Habit; onConfirm: (r: TaskVerifyResult) => void } | null>(null);

  // ── Pinned habits (localStorage, no DB migration needed) ───────────────────
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`pinned-${user?.id}`) ?? '[]') as string[]); }
    catch { return new Set(); }
  });

  function togglePin(habitId: string) {
    const updated = new Set(pinnedIds);
    if (updated.has(habitId)) updated.delete(habitId); else updated.add(habitId);
    setPinnedIds(updated);
    localStorage.setItem(`pinned-${user?.id}`, JSON.stringify([...updated]));
  }

  function handleRename(habitId: string, newName: string) {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, name: newName } : h));
  }

  // ── Drag-to-reorder state ───────────────────────────────────────────────────
  type DragState = { fromIndex: number; toIndex: number; offsetY: number; slotHeight: number };
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const habitsRef = useRef(habits);

  useEffect(() => { habitsRef.current = habits; }, [habits]);

  useEffect(() => { load(); }, []);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch all non-archived habits then filter by category using the same
      // localStorage fallback as HomeScreen (habits created before the `category`
      // DB column existed may have category=null with a localStorage entry instead).
      const { data: allHabitData } = await supabase
        .from('habits').select('*')
        .eq('user_id', user.id)
        .eq('archived', false)
        .order('sort_order', { ascending: true });
      const freshHabits = ((allHabitData as Habit[]) ?? []).filter(h => {
        const cat = h.category ?? localStorage.getItem(`habit-cat-${h.id}`) ?? 'General';
        return cat === categoryName;
      });
      setHabits(freshHabits);

      const habitIds = freshHabits.map(h => h.id);
      if (habitIds.length === 0) { setLoading(false); return; }

      const [{ data: todayData }, { data: histData }] = await Promise.all([
        supabase.from('habit_logs').select('*').in('habit_id', habitIds).eq('date_key', today),
        supabase.from('habit_logs').select('*').in('habit_id', habitIds).order('date_key', { ascending: false }),
      ]);

      if (todayData) {
        const map: Record<string, HabitLog> = {};
        for (const l of todayData) map[l.habit_id] = l as HabitLog;
        setTodayLogs(map);
      }
      if (histData) {
        const byHabit: Record<string, HabitLog[]> = {};
        for (const l of histData) {
          if (!byHabit[l.habit_id]) byHabit[l.habit_id] = [];
          byHabit[l.habit_id].push(l as HabitLog);
        }
        setAllLogs(byHabit);
      }
    } catch (e) {
      console.error('CategoryHubScreen load error:', e);
    } finally {
      setLoading(false);
    }
  }

  function handleLogUpdated(habitId: string, log: HabitLog) {
    setTodayLogs(prev => ({ ...prev, [habitId]: log }));
    setAllLogs(prev => {
      const existing = (prev[habitId] ?? []).filter(l => l.date_key !== today);
      return { ...prev, [habitId]: [log, ...existing] };
    });
  }

  function handleLogCleared(habitId: string) {
    setTodayLogs(prev => { const next = { ...prev }; delete next[habitId]; return next; });
    setAllLogs(prev => ({ ...prev, [habitId]: (prev[habitId] ?? []).filter(l => l.date_key !== today) }));
  }

  // Prevent page scroll while dragging
  useEffect(() => {
    if (!dragState) return;
    const prevent = (e: TouchEvent) => { e.preventDefault(); };
    document.addEventListener('touchmove', prevent, { passive: false });
    return () => document.removeEventListener('touchmove', prevent);
  }, [!!dragState]);

  // Called by the grip handle inside each HabitPanel
  function startDrag(index: number, startY: number, pointerId: number) {
    const cardEl = cardRefs.current[index];
    const slotHeight = cardEl ? cardEl.getBoundingClientRect().height + 12 : 90;
    const state: DragState = { fromIndex: index, toIndex: index, offsetY: 0, slotHeight };
    dragStateRef.current = state;
    setDragState(state);
    try { navigator.vibrate?.(20); } catch {}

    function onMove(ev: PointerEvent) {
      if (ev.pointerId !== pointerId) return;
      const dr = dragStateRef.current;
      if (!dr) return;
      const offsetY = ev.clientY - startY;
      const h = habitsRef.current;
      const toIndex = Math.max(0, Math.min(h.length - 1, dr.fromIndex + Math.round(offsetY / dr.slotHeight)));
      const next: DragState = { ...dr, toIndex, offsetY };
      dragStateRef.current = next;
      setDragState(next);
    }

    function onEnd(ev: PointerEvent) {
      if (ev.pointerId !== pointerId) return;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onEnd);
      document.removeEventListener('pointercancel', onEnd);
      const dr = dragStateRef.current;
      dragStateRef.current = null;
      setDragState(null);
      if (dr && dr.fromIndex !== dr.toIndex) reorderHabits(dr.fromIndex, dr.toIndex);
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onEnd);
    document.addEventListener('pointercancel', onEnd);
  }

  async function reorderHabits(fromIndex: number, toIndex: number) {
    const updated = [...habitsRef.current];
    const [removed] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, removed);
    const reordered = updated.map((h, i) => ({ ...h, sort_order: i }));
    setHabits(reordered);
    await Promise.all(reordered.map(h =>
      supabase.from('habits').update({ sort_order: h.sort_order }).eq('id', h.id)
    ));
  }

  async function deleteHabit(habitId: string) {
    if (!user) return;
    await supabase.from('habit_logs').delete().eq('habit_id', habitId).eq('user_id', user.id);
    await supabase.from('habits').delete().eq('id', habitId).eq('user_id', user.id);
    setHabits(prev => prev.filter(h => h.id !== habitId));
  }

  const hasWorkout = habits.some(h => h.tracking_type === 'workout');
  const doneCount = habits.filter(h => !!todayLogs[h.id]).length;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />

      {/* Color bar */}
      <div className="fixed top-0 left-0 right-0 z-20" style={{ height: 4, background: color }} />

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto">
        {/* Header */}
        <div className="px-5 pt-8 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm">Back</span>
            </button>
            <div className="flex items-center gap-2">
              {canCustomize && (
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(v => !v)}
                    className="w-5 h-5 rounded-full border-2 border-white/30 transition-all active:scale-90"
                    style={{ background: color }}
                  />
                  {showColorPicker && (
                    <ColorPicker catName={categoryName} current={color} onPick={c => { setColor(c); setShowColorPicker(false); }} />
                  )}
                </div>
              )}
              <button
                onClick={() => setShowCreator(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
                style={{ background: '#1e1e1e' }}>
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-white font-semibold text-xl" style={{ letterSpacing: '-0.03em' }}>{categoryName}</h1>
            <p className="text-white/25 text-xs mt-0.5">{doneCount}/{habits.length} done today</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between px-5 pt-4 mb-4">
          <div className="flex gap-4">
            {(['today', 'history'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="text-sm font-semibold capitalize pb-2 transition-colors"
                style={{ color: tab === t ? 'white' : 'rgba(255,255,255,0.25)', borderBottom: `2px solid ${tab === t ? color : 'transparent'}` }}>
                {t}
              </button>
            ))}
          </div>
          {tab === 'today' && habits.length > 1 && (
            <p className="text-white/20 text-[10px] pb-2">Hold grip to reorder · long-press to edit</p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-12">
          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            </div>
          )}

          {!loading && tab === 'today' && (
            <div className="space-y-3">
              {[...habits]
                .sort((a, b) => (pinnedIds.has(b.id) ? 1 : 0) - (pinnedIds.has(a.id) ? 1 : 0))
                .map((habit, index) => {
                // Compute visual transform for drag
                let translateY = 0;
                let isLifted = false;
                if (dragState) {
                  const { fromIndex, toIndex, offsetY, slotHeight } = dragState;
                  if (index === fromIndex) {
                    translateY = offsetY;
                    isLifted = true;
                  } else if (fromIndex < toIndex && index > fromIndex && index <= toIndex) {
                    translateY = -slotHeight;
                  } else if (fromIndex > toIndex && index < fromIndex && index >= toIndex) {
                    translateY = slotHeight;
                  }
                }

                return (
                <div
                  key={habit.id}
                  ref={el => { cardRefs.current[index] = el; }}
                  style={{
                    transform: `translateY(${translateY}px)`,
                    transition: isLifted ? 'box-shadow 0.15s, transform 0s' : 'transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94)',
                    zIndex: isLifted ? 20 : 1,
                    position: 'relative',
                    boxShadow: isLifted ? '0 12px 40px rgba(0,0,0,0.6)' : 'none',
                    borderRadius: 20,
                  }}
                >
                  <HabitPanel
                    habit={habit}
                    todayLog={todayLogs[habit.id] ?? null}
                    pet={pet}
                    user={user}
                    color={color}
                    isPinned={pinnedIds.has(habit.id)}
                    onTogglePin={() => togglePin(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                    onRename={newName => handleRename(habit.id, newName)}
                    onLogUpdated={log => handleLogUpdated(habit.id, log)}
                    onLogCleared={() => handleLogCleared(habit.id)}
                    onWorkout={onWorkout}
                    onJournal={onJournal}
                    isPro={isPro}
                    onPhotoVerify={() => setPhotoVerifyHabit({
                      habit,
                      onConfirm: () => {
                        const todayKey = new Date().toISOString().slice(0, 10);
                        handleLogUpdated(habit.id, { habit_id: habit.id, date_key: todayKey, value: 1, notes: null } as any);
                      },
                    })}
                    onGripPointerDown={(e) => { e.preventDefault(); startDrag(index, e.clientY, e.pointerId); }}
                  />
                </div>
                );
              })}

              {hasWorkout && user && (
                <div className="pt-2">
                  <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3">Body Metrics</p>
                  <MetricPanels userId={user.id} color={color} />
                </div>
              )}

              {habits.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/20 text-sm">No habits in this category yet</p>
                </div>
              )}
            </div>
          )}

          {!loading && tab === 'history' && (
            <div className="space-y-3">
              {habits.map(habit => (
                <HabitHistoryChart
                  key={habit.id}
                  habit={habit}
                  logs={allLogs[habit.id] ?? []}
                  color={color}
                  canExpand={isPro}
                />
              ))}
              {habits.length === 0 && (
                <p className="text-center text-white/20 text-sm py-12">No habits yet</p>
              )}
              {isPro && habits.length > 0 && (
                <div className="rounded-[20px] px-4 py-4" style={{ background: '#1a1a1a', border: '1px solid #242424' }}>
                  <InsightsPanel
                    categoryName={categoryName}
                    habits={habits}
                    logs={Object.values(allLogs).flat()}
                    color={color}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {photoVerifyHabit && (
        <PhotoVerifyModal
          taskTitle={photoVerifyHabit.habit.name}
          taskNotes={null}
          color={color}
          onConfirm={result => { photoVerifyHabit.onConfirm(result); setPhotoVerifyHabit(null); }}
          onSkip={() => { photoVerifyHabit.onConfirm({} as any); setPhotoVerifyHabit(null); }}
          onClose={() => setPhotoVerifyHabit(null)}
        />
      )}

      {showCreator && (
        <HabitCreator
          defaultCategory={categoryName === 'General' ? '' : categoryName}
          existingCategories={allCategoryNames}
          onSaved={() => { setShowCreator(false); load(); }}
          onClose={() => setShowCreator(false)}
        />
      )}
    </>
  );
}
