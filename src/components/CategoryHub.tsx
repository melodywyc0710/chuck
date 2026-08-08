import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { X, Plus, Dumbbell, Brain, Pin, RotateCcw, Flag, Calendar, ChevronDown, ChevronUp, Eye, Trash2, Pencil, Palette } from 'lucide-react';
import PhotoVerifyModal from './PhotoVerifyModal';
import InsightsPanel from './InsightsPanel';
import type { TaskVerifyResult } from '../lib/aiTypes';
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, rectSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_, Completion, GoalCategory, Recurrence } from '../lib/supabase';
import { recordCompletion, reverseCompletion } from '../lib/petEngine';
import MetricPanels from './MetricPanels';
import DeepWorkTimer from './DeepWorkTimer';

// ─── Config ──────────────────────────────────────────────────────────────────

interface Props { category: GoalCategory; onClose: () => void; }

const CAT: Record<GoalCategory, { label: string; Icon: React.ElementType; color: string }> = {
  fitness: { label: 'Fitness', Icon: Dumbbell, color: '#FF4D4D' },
  focus:   { label: 'Focus',   Icon: Brain,    color: '#3D8EFF' },
};

const PRIORITY_COLOR = ['', '#C91818', '#E8690A', '#3D8EFF', 'rgba(255,255,255,0.2)'];

const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
  { value: 'none',     label: 'Once' },
  { value: 'daily',    label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'weekly',   label: 'Weekly' },
  { value: 'monthly',  label: 'Monthly' },
];

type CardSize = 'full' | 'half';

function getSizes(): Record<string, CardSize> {
  try { return JSON.parse(localStorage.getItem('task-sizes') ?? '{}'); } catch { return {}; }
}
function saveSizes(s: Record<string, CardSize>) {
  localStorage.setItem('task-sizes', JSON.stringify(s));
}

// ─── Category color customisation ────────────────────────────────────────────

const COLOR_PALETTE = [
  '#FF4D4D', '#FF7043', '#F59E0B', '#84CC16',
  '#10B981', '#06B6D4', '#3D8EFF', '#6366F1',
  '#8B5CF6', '#EC4899', '#F43F5E', '#A8A8A8',
];

function getCategoryColor(cat: GoalCategory): string {
  return localStorage.getItem(`cat-color-${cat}`) ?? CAT[cat].color;
}
function saveCategoryColor(cat: GoalCategory, color: string) {
  localStorage.setItem(`cat-color-${cat}`, color);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayKey() { return new Date().toISOString().slice(0, 10); }

function formatDate(d: string) {
  const date = new Date(d + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < -1) return `${Math.abs(diff)}d overdue`;
  if (diff < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function appliesToday(task: Promise_, today: string, lastCompletedDate: string | null): boolean {
  if (task.recurrence === 'none') return task.due_date === today;
  const d = new Date(today + 'T00:00:00');
  const dow = d.getDay();
  const dom = d.getDate();
  switch (task.recurrence) {
    case 'daily':    return true;
    case 'weekdays': return dow >= 1 && dow <= 5;
    case 'weekends': return dow === 0 || dow === 6;
    case 'weekly': {
      const created = new Date(task.created_at);
      return created.getDay() === dow;
    }
    case 'monthly': {
      const created = new Date(task.created_at);
      return created.getDate() === dom;
    }
    default: {
      const match = task.recurrence.match(/^interval:(\d+)$/);
      if (!match) return false;
      const n = parseInt(match[1]);
      if (!lastCompletedDate) return true;
      const last = new Date(lastCompletedDate + 'T00:00:00');
      const now  = new Date(today + 'T00:00:00');
      return Math.round((now.getTime() - last.getTime()) / 86400000) >= n;
    }
  }
}

function isOverdue(task: Promise_, today: string): boolean {
  return task.recurrence === 'none' && !!task.due_date && task.due_date < today;
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task, completedToday, last7Days, size,
  onComplete, onDelete, onResize, onEdit,
}: {
  task: Promise_;
  completedToday: boolean;
  last7Days: boolean[];
  size: CardSize;
  onComplete: () => void;
  onDelete: () => void;
  onResize: (s: CardSize) => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; mode: 'idle' | 'h' | 'v' } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [dragDx, setDragDx] = useState(0);

  const pColor = PRIORITY_COLOR[task.priority] ?? PRIORITY_COLOR[4];
  const today = todayKey();
  const overdue = isOverdue(task, today);
  const activeToday = appliesToday(task, today, null);

  // dnd-kit drag started → cancel hold timer, reset horizontal offset
  useEffect(() => {
    if (isDragging) {
      if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
      setDragDx(0);
      // Don't close menu here — hold (500ms) fires before dnd-kit (600ms),
      // so if menu is open the user already lifted their finger.
    }
  }, [isDragging]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function onDown() { setMenuOpen(false); }
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [menuOpen]);

  const dndListeners = listeners ?? {};

  function handlePointerDown(e: React.PointerEvent) {
    (dndListeners.onPointerDown as React.PointerEventHandler | undefined)?.(e);
    pointerStartRef.current = { x: e.clientX, y: e.clientY, mode: 'idle' };
    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null;
      setMenuOpen(true);
    }, 500);
  }

  function handlePointerMove(e: React.PointerEvent) {
    const s = pointerStartRef.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    const dist = Math.hypot(dx, dy);

    // Lock direction once past 8px
    if (s.mode === 'idle' && dist > 8) {
      s.mode = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
    }

    if (s.mode === 'h') {
      e.stopPropagation();
      setDragDx(dx * 0.7);
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    const s = pointerStartRef.current;
    pointerStartRef.current = null;

    if (s?.mode === 'h') {
      const dx = e.clientX - s.x;
      setDragDx(0);
      const THRESHOLD = 48;
      if (Math.abs(dx) > THRESHOLD) {
        onResize(size === 'half' ? 'full' : 'half');
      }
      return;
    }

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
      // tap — no drag, no hold menu
      if (s && !isDragging && !menuOpen && !completedToday) {
        setRipple(true);
        setTimeout(() => { setRipple(false); onComplete(); }, 120);
      }
    }
  }

  const wrapperStyle: React.CSSProperties = {
    transform: `${CSS.Transform.toString(transform) ?? ''} translateX(${dragDx}px)`,
    transition: isDragging ? transition : dragDx !== 0 ? undefined : 'transform 0.25s ease, scale 0.15s ease',
    gridColumn: size === 'half' ? 'span 1' : 'span 2',
    opacity: isDragging ? 0.35 : 1,
    touchAction: 'none',
    position: 'relative',
    scale: ripple ? '0.93' : '1',
  };

  const RESIZE_THRESHOLD = 48;
  const hintResize = Math.abs(dragDx) > RESIZE_THRESHOLD;

  return (
    // All pointer handlers on the same element as setNodeRef so dnd-kit
    // receives events on the element it's tracking.
    <div
      ref={setNodeRef}
      style={wrapperStyle}
      className="select-none"
      {...attributes}
      {...listeners}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
        pointerStartRef.current = null;
        setDragDx(0);
      }}
    >

      {/* Hold menu */}
      {menuOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 flex flex-col gap-1 rounded-2xl p-2 shadow-2xl"
          style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', minWidth: 160 }}
          onPointerDown={e => e.stopPropagation()}
        >
          <button
            onClick={() => { setMenuOpen(false); onEdit(); }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/80 hover:bg-white/8 transition-colors text-left"
          >
            <Pencil size={14} className="text-white/40" />
            Edit
          </button>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '2px 0' }} />
          <button
            onClick={() => { setMenuOpen(false); onDelete(); }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition-colors text-left"
            style={{ color: '#ff6b6b' }}
          >
            <Trash2 size={14} style={{ color: '#ff6b6b' }} />
            Delete
          </button>
        </div>
      )}

      {/* Card */}
      <div
        className="relative flex flex-col rounded-[20px] overflow-hidden"
        style={{
          background: hintResize ? 'rgba(61,142,255,0.12)' : completedToday ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.06)',
          borderLeft: `3px solid ${completedToday ? 'rgba(255,255,255,0.08)' : pColor}`,
          opacity: completedToday ? 0.55 : 1,
          minHeight: size === 'half' ? 80 : undefined,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: 'background 0.15s',
        }}
      >

        <div className="px-4 py-3.5 flex flex-col gap-2">
          {/* Header row */}
          <div className="flex items-start gap-2">
            {/* Completion ring */}
            <div
              className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                border: `1.5px solid ${completedToday ? pColor : pColor + '70'}`,
                background: completedToday ? pColor : 'transparent',
                boxShadow: completedToday ? `0 0 8px ${pColor}55` : 'none',
              }}
            >
              {completedToday && (
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}
            </div>

            {/* Title + meta */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium leading-snug truncate transition-all duration-300"
                style={{
                  color: completedToday ? 'rgba(255,255,255,0.3)' : overdue ? '#ff6b6b' : 'rgba(255,255,255,0.92)',
                  textDecoration: completedToday ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </p>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                {task.pinned && (
                  <span className="text-[10px] text-white/25 flex items-center gap-0.5">
                    <Pin size={8} style={{ transform: 'rotate(45deg)' }} /> pinned
                  </span>
                )}
                {overdue && (
                  <span className="text-[10px] font-medium" style={{ color: '#ff6b6b' }}>overdue</span>
                )}
                {!overdue && !activeToday && task.due_date && task.recurrence === 'none' && (
                  <span className="flex items-center gap-0.5 text-[10px] text-white/25">
                    <Calendar size={8} /> {formatDate(task.due_date)}
                  </span>
                )}
                {task.recurrence !== 'none' && (
                  <span className="flex items-center gap-0.5 text-[10px] text-white/25">
                    <RotateCcw size={8} /> {RECURRENCE_OPTIONS.find(r => r.value === task.recurrence)?.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 7-day streak track — only for recurring tasks */}
          {task.recurrence !== 'none' && (
            <div className="flex gap-1 pl-7">
              {last7Days.map((done, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all"
                  style={{ background: done ? pColor + 'cc' : 'rgba(255,255,255,0.08)' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Task Sheet (Add or Edit) ─────────────────────────────────────────────────

function AddTaskSheet({ category, color, onAdd, onClose, editTask, onEdit }: {
  category: GoalCategory;
  color: string;
  onAdd: (task: Partial<Promise_>) => void;
  onClose: () => void;
  editTask?: Promise_;
  onEdit?: (id: string, updates: Partial<Promise_>) => void;
}) {
  const isEdit = !!editTask;

  const initRec = editTask?.recurrence ?? 'daily';
  const isCustomInterval = initRec.startsWith('interval:');

  const [title, setTitle]           = useState(editTask?.title ?? '');
  const [priority, setPriority]     = useState(editTask?.priority ?? 4);
  const [recurrence, setRecurrence] = useState<Recurrence>(isCustomInterval ? 'none' : initRec);
  const [dueDate, setDueDate]       = useState(editTask?.due_date ?? '');
  const [pinned, setPinned]         = useState(editTask?.pinned ?? false);
  const [notes, setNotes]           = useState(editTask?.notes ?? '');
  const [showNotes, setShowNotes]   = useState(!!(editTask?.notes));
  const [customInterval, setCustomInterval] = useState(
    isCustomInterval ? initRec.replace('interval:', '') : '2'
  );
  const [showCustom, setShowCustom] = useState(isCustomInterval);
  const inputRef = useRef<HTMLInputElement>(null);
  const today = todayKey();
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  function submit() {
    if (!title.trim()) return;
    const rec: Recurrence = showCustom ? `interval:${parseInt(customInterval) || 2}` : recurrence;
    if (isEdit && editTask && onEdit) {
      onEdit(editTask.id, {
        title: title.trim(),
        notes: notes.trim() || null,
        priority,
        recurrence: rec,
        due_date: rec === 'none' && dueDate ? dueDate : null,
        pinned,
      });
    } else {
      onAdd({
        title: title.trim(),
        notes: notes.trim() || null,
        category,
        priority,
        recurrence: rec,
        due_date: rec === 'none' && dueDate ? dueDate : null,
        pinned,
        frequency: 'daily',
        verify_method: 'timer',
        active: true,
      });
    }
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[32px] px-5 pt-5 pb-8 fade-up" style={{ background: '#111111', border: '1px solid #1e1e1e', animationDelay: '0s' }}>
        <div className="w-8 h-1 rounded-full bg-white/15 mx-auto mb-5" />

        <input
          ref={inputRef}
          type="text"
          placeholder="Goal name…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          className="w-full text-white text-base font-medium bg-transparent outline-none placeholder-white/20 mb-4"
        />

        {/* Priority */}
        <div className="flex items-center gap-2 mb-4">
          <Flag size={12} className="text-white/30 shrink-0" />
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: priority === p ? PRIORITY_COLOR[p] + '33' : 'rgba(255,255,255,0.06)',
                  color: priority === p ? PRIORITY_COLOR[p] : 'rgba(255,255,255,0.35)',
                  border: priority === p ? `1px solid ${PRIORITY_COLOR[p]}55` : '1px solid transparent',
                }}
              >
                P{p}
              </button>
            ))}
          </div>
        </div>

        {/* Recurrence */}
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw size={12} className="text-white/30 shrink-0" />
          <div className="flex gap-1.5 flex-wrap">
            {RECURRENCE_OPTIONS.map(r => (
              <button
                key={r.value}
                onClick={() => { setRecurrence(r.value); setShowCustom(false); }}
                className="px-2.5 py-1 rounded-lg text-[11px] transition-all"
                style={{
                  background: recurrence === r.value && !showCustom ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                  color: recurrence === r.value && !showCustom ? 'white' : 'rgba(255,255,255,0.35)',
                }}
              >
                {r.label}
              </button>
            ))}
            <button
              onClick={() => { setShowCustom(true); setRecurrence('none'); }}
              className="px-2.5 py-1 rounded-lg text-[11px] transition-all"
              style={{
                background: showCustom ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                color: showCustom ? 'white' : 'rgba(255,255,255,0.35)',
              }}
            >
              Custom
            </button>
          </div>
        </div>

        {showCustom && (
          <div className="flex items-center gap-2 mb-4 pl-5">
            <span className="text-white/40 text-xs">Every</span>
            <input
              type="number" min="1"
              value={customInterval}
              onChange={e => setCustomInterval(e.target.value)}
              className="w-14 text-center text-white text-sm font-medium rounded-xl px-2 py-1.5 outline-none"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />
            <span className="text-white/40 text-xs">days</span>
          </div>
        )}

        {(recurrence === 'none' && !showCustom) && (
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={12} className="text-white/30 shrink-0" />
            <div className="flex gap-1.5">
              {[{ label: 'Today', val: today }, { label: 'Tomorrow', val: tomorrowKey }].map(d => (
                <button
                  key={d.val}
                  onClick={() => setDueDate(dueDate === d.val ? '' : d.val)}
                  className="px-2.5 py-1 rounded-lg text-[11px] transition-all"
                  style={{
                    background: dueDate === d.val ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                    color: dueDate === d.val ? 'white' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {d.label}
                </button>
              ))}
              <input
                type="date" value={dueDate} min={today}
                onChange={e => setDueDate(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-[11px] outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', colorScheme: 'dark' }}
              />
            </div>
          </div>
        )}

        {showNotes ? (
          <textarea
            placeholder="Notes…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            className="w-full text-white/60 text-xs bg-transparent outline-none placeholder-white/20 resize-none mb-4 pl-5"
          />
        ) : (
          <button onClick={() => setShowNotes(true)} className="text-white/20 text-xs mb-4 pl-5 hover:text-white/40 transition-colors">+ Add note</button>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => setPinned(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all"
            style={{
              background: pinned ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
              color: pinned ? 'white' : 'rgba(255,255,255,0.3)',
            }}
          >
            <Pin size={11} style={{ transform: 'rotate(45deg)' }} />
            {pinned ? 'Pinned' : 'Pin to top'}
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-white/30 hover:text-white/60 transition-colors">Cancel</button>
            <button
              onClick={submit}
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30"
              style={{ background: color }}
            >
              {isEdit ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Witness Sheet ────────────────────────────────────────────────────────────

interface Friend { id: string; username: string; }

function WitnessSheet({ completionId, onClose }: { completionId: string; onClose: () => void }) {
  const user = useAuthStore(s => s.user);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sent, setSent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: rows } = await supabase
        .from('friendships')
        .select('requester_id, addressee_id')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted');
      if (!rows) { setLoading(false); return; }
      const ids = rows.map(r => r.requester_id === user.id ? r.addressee_id : r.requester_id);
      if (ids.length === 0) { setLoading(false); return; }
      const { data: profiles } = await supabase.from('profiles').select('id, username').in('id', ids);
      setFriends(profiles ?? []);
      setLoading(false);
    })();
  }, [user]);

  async function sendRequest(witnessId: string) {
    if (!user) return;
    await supabase.from('witness_requests').insert({ completion_id: completionId, requester_id: user.id, witness_id: witnessId, status: 'pending' });
    setSent(witnessId);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-t-[32px] p-6 pb-10" style={{ background: '#141414' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-white/50" />
            <h2 className="text-white font-semibold" style={{ letterSpacing: '-0.02em' }}>Ask a witness</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={16} /></button>
        </div>
        {loading && <p className="text-white/30 text-sm text-center py-6">Loading friends…</p>}
        {!loading && friends.length === 0 && (
          <div className="text-center py-6">
            <p className="text-white/30 text-sm">No friends yet.</p>
            <p className="text-white/20 text-xs mt-1">Add friends first to use witness verification.</p>
          </div>
        )}
        <div className="space-y-2">
          {friends.map(f => (
            <div key={f.id} className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <span className="text-white text-sm">{f.username}</span>
              {sent === f.id ? (
                <span className="text-xs text-white/40">Sent ✓</span>
              ) : (
                <button
                  onClick={() => sendRequest(f.id)}
                  disabled={!!sent}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all disabled:opacity-40"
                  style={{ background: '#3D8EFF22', color: '#3D8EFF' }}
                >
                  Ask
                </button>
              )}
            </div>
          ))}
        </div>
        {sent && <p className="text-white/30 text-xs text-center mt-4">Witness request sent.</p>}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ label, count, collapsed, onToggle }: { label: string; count: number; collapsed: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex items-center gap-2 w-full mb-2 mt-5 first:mt-0 group">
      <span className="text-white/30 text-[10px] font-semibold uppercase tracking-widest">{label}</span>
      <span className="text-white/20 text-[10px]">{count}</span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
      {collapsed
        ? <ChevronDown size={11} className="text-white/20 group-hover:text-white/40 transition-colors" />
        : <ChevronUp size={11} className="text-white/20 group-hover:text-white/40 transition-colors" />}
    </button>
  );
}

// ─── Category Stats ───────────────────────────────────────────────────────────

type RangeKey = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
const RANGES: { key: RangeKey; label: string; days: number | null; plus: boolean }[] = [
  { key: '1W',  label: '1W',  days: 7,   plus: false },
  { key: '1M',  label: '1M',  days: 30,  plus: false },
  { key: '3M',  label: '3M',  days: 90,  plus: true  },
  { key: '6M',  label: '6M',  days: 180, plus: true  },
  { key: '1Y',  label: '1Y',  days: 365, plus: true  },
  { key: 'ALL', label: 'ALL', days: null, plus: true  },
];

function buildDays(numDays: number | null, earliest: string): string[] {
  if (numDays === null) {
    // from earliest completion date to today
    const start = new Date(earliest + 'T00:00:00');
    const end = new Date();
    const out: string[] = [];
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1))
      out.push(d.toISOString().slice(0, 10));
    return out;
  }
  return Array.from({ length: numDays }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (numDays - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function LineChart({ days, counts, color }: { days: string[]; counts: number[]; color: string }) {
  const W = 320, H = 72, PAD = 4;
  // For large ranges, group by week to avoid overdense lines
  const bucket = days.length > 90 ? Math.ceil(days.length / 52) : 1;
  const bucketed: number[] = [];
  for (let i = 0; i < counts.length; i += bucket)
    bucketed.push(counts.slice(i, i + bucket).reduce((a, b) => a + b, 0));
  const bMax = Math.max(1, ...bucketed);
  const pts = bucketed.map((c, i) => {
    const x = PAD + (bucketed.length === 1 ? W / 2 : (i / (bucketed.length - 1)) * (W - PAD * 2));
    const y = H - PAD - (c / bMax) * (H - PAD * 2);
    return [x, y] as [number, number];
  });
  const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaD = pts.length > 1
    ? `${pathD} L${pts[pts.length-1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`
    : '';
  const gradId = `lg-${color.replace('#', '')}`;
  const showDots = bucketed.length <= 60;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 72, display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaD && <path d={areaD} fill={`url(#${gradId})`} />}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {showDots && pts.map(([x, y], i) => bucketed[i] > 0 && (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 3 : 2} fill={color} />
      ))}
    </svg>
  );
}

function CalendarStrip({ days, doneDays, color }: { days: string[]; doneDays: Set<string>; color: string }) {
  // For ≤60 days show individual squares; for longer ranges group into weeks
  const today = todayKey();
  if (days.length <= 60) {
    return (
      <div className="flex gap-[2px]">
        {days.map((dk) => {
          const done = doneDays.has(dk);
          const isToday = dk === today;
          return (
            <div key={dk} className="flex-1 rounded-[2px]"
              style={{
                height: 16,
                background: done ? color : 'rgba(255,255,255,0.06)',
                opacity: done ? (isToday ? 1 : 0.65) : 1,
                outline: isToday ? `1.5px solid ${done ? color : 'rgba(255,255,255,0.25)'}` : 'none',
                outlineOffset: 1,
              }} />
          );
        })}
      </div>
    );
  }
  // Weekly buckets — each cell = one week
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return (
    <div className="flex gap-[2px]">
      {weeks.map((wk, wi) => {
        const doneCount = wk.filter(dk => doneDays.has(dk)).length;
        const opacity = doneCount === 0 ? 0 : 0.2 + 0.8 * (doneCount / wk.length);
        return (
          <div key={wi} className="flex-1 rounded-[2px]"
            style={{ height: 16, background: doneCount > 0 ? color : 'rgba(255,255,255,0.06)', opacity: doneCount > 0 ? opacity : 1 }} />
        );
      })}
    </div>
  );
}

function CategoryStats({ history, tasks, color, plus }: { history: Completion[]; tasks: Promise_[]; color: string; plus: boolean }) {
  const [range, setRange] = useState<RangeKey>('1M');
  const [rangeOpen, setRangeOpen] = useState(false);
  const taskIds = new Set(tasks.map(t => t.id));
  const catHistory = history.filter(h => taskIds.has(h.promise_id));
  const today = todayKey();

  const earliest = catHistory.length
    ? catHistory.reduce((a, b) => a.date_key < b.date_key ? a : b).date_key
    : today;

  const rangeCfg = RANGES.find(r => r.key === range)!;
  const days = buildDays(rangeCfg.days, earliest);
  const counts = days.map(dk => catHistory.filter(h => h.date_key === dk).length);

  // Summary stats for selected range
  const rangeStart = days[0];
  const rangeTotal = catHistory.filter(h => h.date_key >= rangeStart).length;
  let best = 0, run = 0;
  for (const c of counts) { if (c > 0) { run++; best = Math.max(best, run); } else run = 0; }

  // Current streak (all-time)
  const allDoneDays = new Set(catHistory.map(h => h.date_key));
  let streak = 0;
  const sd = new Date();
  if (!allDoneDays.has(sd.toISOString().slice(0, 10))) sd.setDate(sd.getDate() - 1);
  while (allDoneDays.has(sd.toISOString().slice(0, 10))) { streak++; sd.setDate(sd.getDate() - 1); }


  return (
    <div className="space-y-4">
      {/* Range selector + dim secondary stats inline */}
      <div className="flex items-center gap-3">
        <div className="relative">
        <button
          onClick={() => setRangeOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
        >
          <span style={{ color }}>{range}</span>
          <ChevronDown size={10} strokeWidth={2.5} style={{ opacity: 0.4, transform: rangeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {rangeOpen && (
          <div className="absolute top-full left-0 mt-1.5 z-20 flex gap-1.5 p-2 rounded-2xl shadow-2xl"
            style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)' }}>
            {RANGES.map(r => {
              const locked = r.plus && !plus;
              const active = r.key === range;
              return (
                <button
                  key={r.key}
                  onClick={() => { if (!locked) { setRange(r.key); setRangeOpen(false); } }}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
                  style={{
                    background: active ? color : 'rgba(255,255,255,0.06)',
                    color: active ? '#fff' : locked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                    cursor: locked ? 'default' : 'pointer',
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        )}
        </div>
        <span className="text-white/20 text-[10px]">{rangeTotal} completions · best {best}d</span>
      </div>

      {/* Streak — the one stat worth showing prominently */}
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-white" style={{ fontSize: 32, letterSpacing: '-0.04em' }}>{streak}d</span>
        <span className="text-white/30 text-xs">streak</span>
      </div>

      {/* Line chart */}
      <div>
        <LineChart days={days} counts={counts} color={color} />
        <div className="flex justify-between mt-0.5">
          <span className="text-white/20" style={{ fontSize: 9 }}>{days[0]}</span>
          <span className="text-white/20" style={{ fontSize: 9 }}>Today</span>
        </div>
      </div>

      {/* Per-task calendar strips */}
      {tasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-white/25 text-[10px]">By task</p>
          {tasks.map(task => {
            const taskComps = catHistory.filter(h => h.promise_id === task.id);
            const doneToday = taskComps.some(h => h.date_key === today);
            const taskDoneDays = new Set(taskComps.map(h => h.date_key));
            let ts = 0; const td = new Date();
            if (!taskDoneDays.has(td.toISOString().slice(0,10))) td.setDate(td.getDate()-1);
            while (taskDoneDays.has(td.toISOString().slice(0,10))) { ts++; td.setDate(td.getDate()-1); }
            const taskRangeCount = taskComps.filter(h => h.date_key >= rangeStart).length;
            return (
              <div key={task.id} className="px-3 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: doneToday ? color : 'rgba(255,255,255,0.15)' }} />
                  <span className="flex-1 text-white/70 text-xs truncate">{task.title}</span>
                  <span className="text-white/30 text-[10px] tabular-nums">{taskRangeCount}×</span>
                  {ts > 0 && <span className="text-[10px] font-medium tabular-nums" style={{ color }}>{ts}d</span>}
                </div>
                <CalendarStrip days={days} doneDays={taskDoneDays} color={color} />
                <div className="flex justify-between mt-1">
                  <span className="text-white/15" style={{ fontSize: 8 }}>{days[0]}</span>
                  <span className="text-white/15" style={{ fontSize: 8 }}>Today</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CategoryHub({ category, onClose }: Props) {
  const user = useAuthStore(s => s.user);
  const pet  = useAuthStore(s => s.pet);
  const setPet = useAuthStore(s => s.setPetLocal);
  const profile = useAuthStore(s => s.profile);
  const cfg = CAT[category];

  const [tasks, setTasks]         = useState<Promise_[]>([]);
  const [history, setHistory]     = useState<Completion[]>([]);
  const [showAdd, setShowAdd]     = useState(false);
  const [editingTask, setEditingTask] = useState<Promise_ | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ completed: true });
  const [witnessCompletionId, setWitnessCompletionId] = useState<string | null>(null);
  const [taskSizes, setTaskSizes] = useState<Record<string, CardSize>>(getSizes);
  const [catColor, setCatColor]   = useState(() => getCategoryColor(category));
  const [showPalette, setShowPalette] = useState(false);
  const [photoVerifyTask, setPhotoVerifyTask] = useState<Promise_ | null>(null);

  const plus = profile?.subscription_tier === 'plus' || profile?.subscription_tier === 'pro';
  const FREE_LIMIT = 5;
  const today = todayKey();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 600, tolerance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 600, tolerance: 5 } }),
  );

  useEffect(() => { load(); }, []);

  async function load() {
    if (!pet) return;
    const [{ data: t }, { data: h }] = await Promise.all([
      supabase.from('promises').select('*').eq('user_id', pet.user_id).eq('category', category).eq('active', true).order('sort_order').order('created_at'),
      (() => {
        const q = supabase.from('completions').select('*').eq('user_id', pet.user_id).order('completed_at', { ascending: false });
        // Free: last 90 days; Plus/Pro: unlimited
        if (!plus) {
          const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90);
          return q.gte('date_key', cutoff.toISOString().slice(0, 10));
        }
        return q;
      })(),
    ]);
    if (t) setTasks(t.map(x => ({
      ...x,
      priority:   x.priority   ?? 4,
      recurrence: x.recurrence ?? 'daily',
      pinned:     x.pinned     ?? false,
      sort_order: x.sort_order ?? 0,
      due_date:   x.due_date   ?? null,
      notes:      x.notes      ?? null,
    })));
    if (h) setHistory(h);
  }

  const completedTodayIds = new Set(history.filter(h => h.date_key === today).map(h => h.promise_id));


  // Only 'friend' or 'photo' verified tasks grant XP
  function isCertified(verifyMethod: string) {
    return verifyMethod === 'friend' || verifyMethod === 'photo';
  }

  async function complete(task: Promise_) {
    if (!user || !pet || completedTodayIds.has(task.id)) return;
    // Plus/Pro: offer photo verification for any task
    if (plus) {
      setPhotoVerifyTask(task);
      return;
    }
    await _doComplete(task, 'self', null);
  }

  async function completeWithPhotoVerify(task: Promise_, verifyResult: TaskVerifyResult) {
    if (!user || !pet) return;
    const proofType = `ai:${verifyResult.status}:${verifyResult.confidence}`;
    await _doComplete(task, proofType, null);
    setPhotoVerifyTask(null);
  }

  async function _doComplete(task: Promise_, proofType: string, proofUrl: string | null) {
    if (!user || !pet) return;
    const certified = isCertified(task.verify_method ?? '') || proofType.startsWith('ai:');
    const { data: comp } = await supabase.from('completions').insert({ user_id: user.id, promise_id: task.id, date_key: today, proof_type: proofType }).select().single();
    if (certified) {
      const prevLevel = pet.level;
      const updated = await recordCompletion(pet, user.id);
      if (updated) {
        setPet(updated);
        if (updated.level > prevLevel) { /* level-up flash */ }
      }
    }
    const compId = comp?.id ?? crypto.randomUUID();
    const newComp = { id: compId, user_id: user.id, promise_id: task.id, date_key: today, proof_type: proofType, proof_url: proofUrl, verified_by: null, completed_at: new Date().toISOString() };
    setHistory(prev => [newComp, ...prev]);
    if (task.verify_method === 'friend' && comp?.id) setWitnessCompletionId(comp.id);
  }

  async function undoComplete(completionId: string) {
    // Check if this completion granted XP (only certified ones do)
    const comp = history.find(h => h.id === completionId);
    await supabase.from('completions').delete().eq('id', completionId);
    setHistory(prev => prev.filter(h => h.id !== completionId));
    // Reverse XP only if the original task was certified
    if (pet && comp && comp.proof_type === 'friend') {
      const updated = await reverseCompletion(pet, pet.user_id);
      if (updated) setPet(updated);
    }
  }

  async function addTask(partial: Partial<Promise_>) {
    if (!pet) return;
    const { count } = await supabase.from('promises').select('*', { count: 'exact', head: true }).eq('user_id', pet.user_id).eq('active', true);
    if (!plus && (count ?? 0) >= FREE_LIMIT) { alert(`Free plan: up to ${FREE_LIMIT} tasks. Upgrade for unlimited.`); return; }
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.sort_order ?? 0)) : 0;
    const { data } = await supabase.from('promises').insert({ user_id: pet.user_id, ...partial, sort_order: maxOrder + 1, timer_duration_mins: null }).select().single();
    if (data) setTasks(prev => [...prev, { ...data, priority: data.priority ?? 4, recurrence: data.recurrence ?? 'daily', pinned: data.pinned ?? false, sort_order: data.sort_order ?? 0, due_date: data.due_date ?? null, notes: data.notes ?? null }]);
  }

  async function saveEditTask(id: string, updates: Partial<Promise_>) {
    const { data } = await supabase.from('promises').update(updates).eq('id', id).select().single();
    if (data) setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }

  async function deleteTask(id: string) {
    await supabase.from('promises').update({ active: false }).eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function resizeTask(id: string, size: CardSize) {
    const next = { ...taskSizes, [id]: size };
    setTaskSizes(next);
    saveSizes(next);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTasks(prev => {
      const oldIdx = prev.findIndex(t => t.id === active.id);
      const newIdx = prev.findIndex(t => t.id === over.id);
      const next = arrayMove(prev, oldIdx, newIdx).map((t, i) => ({ ...t, sort_order: i }));
      // Persist new order to DB
      next.forEach(t => supabase.from('promises').update({ sort_order: t.sort_order }).eq('id', t.id));
      return next;
    });
  }

  function taskLast7Days(taskId: string): boolean[] {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      return history.some(h => h.promise_id === taskId && h.date_key === key);
    });
  }

  // Active tasks (not completed today) ordered by pinned first
  const activeTasks = [
    ...tasks.filter(t => t.pinned && !completedTodayIds.has(t.id)),
    ...tasks.filter(t => !t.pinned && !completedTodayIds.has(t.id)),
  ];
  const completedTasks = tasks.filter(t => completedTodayIds.has(t.id));

  if (!user || !pet) return null;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />

      {witnessCompletionId && (
        <WitnessSheet completionId={witnessCompletionId} onClose={() => setWitnessCompletionId(null)} />
      )}
      {photoVerifyTask && (
        <PhotoVerifyModal
          taskTitle={photoVerifyTask.title}
          taskNotes={photoVerifyTask.notes}
          color={catColor}
          onConfirm={result => completeWithPhotoVerify(photoVerifyTask, result)}
          onSkip={() => { _doComplete(photoVerifyTask, 'self', null); setPhotoVerifyTask(null); }}
          onClose={() => setPhotoVerifyTask(null)}
        />
      )}
      {showAdd && (
        <AddTaskSheet category={category} color={catColor} onAdd={addTask} onClose={() => setShowAdd(false)} />
      )}
      {editingTask && (
        <AddTaskSheet
          category={category} color={catColor}
          onAdd={addTask} onClose={() => setEditingTask(null)}
          editTask={editingTask} onEdit={saveEditTask}
        />
      )}

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-5 pt-12 pb-28">

        {/* Nav */}
        <div className="flex items-center justify-between mb-8 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-2">
            <cfg.Icon size={16} strokeWidth={1.5} style={{ color: catColor }} />
            <h1 className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.03em' }}>{cfg.label}</h1>
            <span className="text-white/25 text-sm">{completedTasks.length}/{tasks.length}</span>
          </div>
          <div className="flex items-center gap-2">
            {plus && (
              <div className="relative">
                <button
                  onClick={() => setShowPalette(p => !p)}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: catColor }}
                >
                  <Palette size={14} strokeWidth={1.5} />
                </button>
                {showPalette && (
                  <div
                    className="absolute right-0 top-full mt-2 z-30 p-3 rounded-2xl shadow-2xl"
                    style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', width: 180 }}
                    onPointerDown={e => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-6 gap-2">
                      {COLOR_PALETTE.map(c => (
                        <button
                          key={c}
                          onClick={() => { saveCategoryColor(category, c); setCatColor(c); setShowPalette(false); }}
                          className="w-6 h-6 rounded-full transition-transform active:scale-90"
                          style={{
                            background: c,
                            outline: c === catColor ? `2px solid white` : 'none',
                            outlineOffset: 2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {tasks.length === 0 && (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-14 flex flex-col items-center gap-3 rounded-3xl transition-colors mb-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <Plus size={22} className="text-white/15" />
            <p className="text-white/20 text-sm">Add your first goal</p>
          </button>
        )}

        {/* Tip when tasks exist */}
        {tasks.length > 0 && activeTasks.length > 0 && (
          <p className="text-white/15 text-[10px] text-center mb-3">Tap · Drag ↕ reorder · Drag ↔ resize · Hold to delete</p>
        )}

        {/* Active task grid — drag and drop */}
        {activeTasks.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={activeTasks.map(t => t.id)} strategy={rectSortingStrategy}>
              <div
                className="grid gap-2 fade-up"
                style={{ gridTemplateColumns: '1fr 1fr', animationDelay: '0.1s' }}
              >
                {activeTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    completedToday={false}
                    last7Days={taskLast7Days(task.id)}
                    size={taskSizes[task.id] ?? 'full'}
                    onComplete={() => complete(task)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => setEditingTask(task)}
                    onResize={s => resizeTask(task.id, s)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Completed today */}
        {completedTasks.length > 0 && (
          <div className="mt-4 fade-up" style={{ animationDelay: '0.15s' }}>
            <SectionHeader
              label="Completed"
              count={completedTasks.length}
              collapsed={!!collapsed.completed}
              onToggle={() => setCollapsed(p => ({ ...p, completed: !p.completed }))}
            />
            {!collapsed.completed && (
              <div className="flex flex-col gap-2">
                {completedTasks.map(task => {
                  const comp = history.find(h => h.promise_id === task.id && h.date_key === today);
                  return (
                    <div key={task.id} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <TaskCard
                          task={task}
                          completedToday={true}
                          last7Days={taskLast7Days(task.id)}
                          size="full"
                          onComplete={() => {}}
                          onDelete={() => deleteTask(task.id)}
                          onEdit={() => setEditingTask(task)}
                          onResize={s => resizeTask(task.id, s)}
                        />
                      </div>
                      {comp && (
                        <button
                          onClick={() => undoComplete(comp.id)}
                          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Category-specific panels */}
        <div className="my-6 border-t border-white/5" />
        {category === 'fitness' && (
          <div className="fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Tracking</p>
            <MetricPanels userId={user.id} color={catColor} />
          </div>
        )}
        {category === 'focus' && (
          <div className="fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Deep Work</p>
            <DeepWorkTimer userId={user.id} color={catColor} />
          </div>
        )}

        {/* Stats + chart */}
        <div className="my-6 border-t border-white/5" />
        <div className="fade-up" style={{ animationDelay: '0.25s' }}>
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Stats</p>
          <CategoryStats
            history={history}
            tasks={tasks}
            color={catColor}
            plus={plus}
          />
        </div>

        {/* AI Insights (Plus/Pro) */}
        {(() => {
          const catCompletions = history.filter(h => tasks.some(t => t.id === h.promise_id));
          return plus && (
            <>
              <div className="my-6 border-t border-white/5" />
              <div className="fade-up" style={{ animationDelay: '0.3s' }}>
                <InsightsPanel
                  category={category}
                  tasks={tasks}
                  completions={catCompletions}
                  color={catColor}
                />
              </div>
            </>
          );
        })()}
      </div>

      {/* Floating add button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 max-w-md w-full px-5 pointer-events-none">
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-semibold shadow-2xl transition-all active:scale-95"
            style={{ background: catColor }}
          >
            <Plus size={16} strokeWidth={2.5} /> Add goal
          </button>
        </div>
      </div>
    </>
  );
}
