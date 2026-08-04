import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { X, Plus, Dumbbell, Brain, Pin, RotateCcw, Flag, Calendar, ChevronDown, ChevronUp, Eye, Maximize2, Minimize2, Trash2 } from 'lucide-react';
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
import { recordCompletion } from '../lib/petEngine';
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
  onComplete, onDelete, onPin, onResize,
}: {
  task: Promise_;
  completedToday: boolean;
  last7Days: boolean[];
  size: CardSize;
  onComplete: () => void;
  onDelete: () => void;
  onPin: () => void;
  onResize: (s: CardSize) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [ripple, setRipple] = useState(false);

  const pColor = PRIORITY_COLOR[task.priority] ?? PRIORITY_COLOR[4];
  const today = todayKey();
  const overdue = isOverdue(task, today);
  const activeToday = appliesToday(task, today, null);

  // Cancel menu if drag starts
  useEffect(() => {
    if (isDragging) {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      setShowMenu(false);
    }
  }, [isDragging]);

  const cardStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: size === 'half' ? 'span 1' : 'span 2',
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'none',
  };

  function onPointerDown(e: React.PointerEvent) {
    if (showMenu) return;
    pressStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    pressTimerRef.current = setTimeout(() => {
      setShowMenu(true);
      pressStartRef.current = null;
    }, 500);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!pressStartRef.current) return;
    const { x, y, time } = pressStartRef.current;
    pressStartRef.current = null;
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    const dt = Date.now() - time;
    const dx = Math.abs(e.clientX - x);
    const dy = Math.abs(e.clientY - y);
    if (dt < 350 && dx < 10 && dy < 10 && !showMenu && !isDragging) {
      if (!completedToday) {
        setRipple(true);
        setTimeout(() => setRipple(false), 600);
        onComplete();
      }
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pressStartRef.current) return;
    const dx = Math.abs(e.clientX - pressStartRef.current.x);
    const dy = Math.abs(e.clientY - pressStartRef.current.y);
    if (dx > 8 || dy > 8) {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className="relative select-none"
    >
      {/* Context menu overlay */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
          <div className="absolute left-0 right-0 top-0 z-40 rounded-[20px] p-2 fade-up" style={{ background: '#1c1c1c', border: '1px solid #2e2e2e', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => { onPin(); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: task.pinned ? 'white' : 'rgba(255,255,255,0.5)' }}
              >
                <Pin size={12} style={{ transform: 'rotate(45deg)' }} />
                {task.pinned ? 'Unpin' : 'Pin to top'}
              </button>
              <button
                onClick={() => { onResize(size === 'half' ? 'full' : 'half'); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
              >
                {size === 'half' ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                {size === 'half' ? 'Full width' : 'Make compact'}
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all"
                style={{ background: 'rgba(201,24,24,0.12)', color: '#C91818' }}
              >
                <Trash2 size={12} /> Delete goal
              </button>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="w-full mt-1.5 py-2 text-xs rounded-xl transition-all"
              style={{ color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.03)' }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Card */}
      <div
        className="relative flex flex-col rounded-[20px] overflow-hidden transition-all duration-200 cursor-pointer"
        style={{
          background: completedToday ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.06)',
          borderLeft: `3px solid ${completedToday ? 'rgba(255,255,255,0.08)' : pColor}`,
          opacity: completedToday ? 0.55 : 1,
          minHeight: size === 'half' ? 80 : undefined,
        }}
        {...attributes}
        {...listeners}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      >
        {/* Ripple */}
        {ripple && (
          <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{ background: pColor + '22', animation: 'card-ripple 0.5s ease-out forwards' }} />
        )}

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

      <style>{`
        @keyframes card-ripple {
          0%   { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Add Task Sheet ────────────────────────────────────────────────────────────

function AddTaskSheet({ category, color, onAdd, onClose }: {
  category: GoalCategory;
  color: string;
  onAdd: (task: Partial<Promise_>) => void;
  onClose: () => void;
}) {
  const [title, setTitle]           = useState('');
  const [priority, setPriority]     = useState(4);
  const [recurrence, setRecurrence] = useState<Recurrence>('daily');
  const [dueDate, setDueDate]       = useState('');
  const [pinned, setPinned]         = useState(false);
  const [notes, setNotes]           = useState('');
  const [showNotes, setShowNotes]   = useState(false);
  const [customInterval, setCustomInterval] = useState('2');
  const [showCustom, setShowCustom] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const today = todayKey();
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  function submit() {
    if (!title.trim()) return;
    const rec: Recurrence = showCustom ? `interval:${parseInt(customInterval) || 2}` : recurrence;
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
              Add
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
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ completed: true });
  const [witnessCompletionId, setWitnessCompletionId] = useState<string | null>(null);
  const [taskSizes, setTaskSizes] = useState<Record<string, CardSize>>(getSizes);

  const plus = profile?.subscription_tier === 'plus' || profile?.subscription_tier === 'pro';
  const FREE_LIMIT = 5;
  const today = todayKey();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 300, tolerance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 300, tolerance: 5 } }),
  );

  useEffect(() => { load(); }, []);

  async function load() {
    if (!pet) return;
    const [{ data: t }, { data: h }] = await Promise.all([
      supabase.from('promises').select('*').eq('user_id', pet.user_id).eq('category', category).eq('active', true).order('sort_order').order('created_at'),
      supabase.from('completions').select('*').eq('user_id', pet.user_id).order('completed_at', { ascending: false }).limit(200),
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


  async function complete(task: Promise_) {
    if (!user || !pet || completedTodayIds.has(task.id)) return;
    const prevLevel = pet.level;
    const proofType = task.verify_method === 'friend' ? 'friend' : 'self';
    const { data: comp } = await supabase.from('completions').insert({ user_id: user.id, promise_id: task.id, date_key: today, proof_type: proofType }).select().single();
    const updated = await recordCompletion(pet, user.id);
    if (updated) {
      setPet(updated);
      if (updated.level > prevLevel) { /* level-up flash */ }
    }
    const newComp = { id: comp?.id ?? crypto.randomUUID(), user_id: user.id, promise_id: task.id, date_key: today, proof_type: proofType, proof_url: null, verified_by: null, completed_at: new Date().toISOString() };
    setHistory(prev => [newComp, ...prev]);
    if (task.verify_method === 'friend' && comp?.id) setWitnessCompletionId(comp.id);
  }

  async function addTask(partial: Partial<Promise_>) {
    if (!pet) return;
    const { count } = await supabase.from('promises').select('*', { count: 'exact', head: true }).eq('user_id', pet.user_id).eq('active', true);
    if (!plus && (count ?? 0) >= FREE_LIMIT) { alert(`Free plan: up to ${FREE_LIMIT} tasks. Upgrade for unlimited.`); return; }
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.sort_order ?? 0)) : 0;
    const { data } = await supabase.from('promises').insert({ user_id: pet.user_id, ...partial, sort_order: maxOrder + 1, timer_duration_mins: null }).select().single();
    if (data) setTasks(prev => [...prev, { ...data, priority: data.priority ?? 4, recurrence: data.recurrence ?? 'daily', pinned: data.pinned ?? false, sort_order: data.sort_order ?? 0, due_date: data.due_date ?? null, notes: data.notes ?? null }]);
  }

  async function deleteTask(id: string) {
    await supabase.from('promises').update({ active: false }).eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function togglePin(task: Promise_) {
    const pinned = !task.pinned;
    await supabase.from('promises').update({ pinned }).eq('id', task.id);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, pinned } : t));
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
      {showAdd && (
        <AddTaskSheet category={category} color={cfg.color} onAdd={addTask} onClose={() => setShowAdd(false)} />
      )}

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-5 pt-12 pb-28">

        {/* Nav */}
        <div className="flex items-center justify-between mb-8 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-2">
            <cfg.Icon size={16} strokeWidth={1.5} style={{ color: cfg.color }} />
            <h1 className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.03em' }}>{cfg.label}</h1>
            <span className="text-white/25 text-sm">{completedTasks.length}/{tasks.length}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={15} />
          </button>
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
          <p className="text-white/15 text-[10px] text-center mb-3">Tap to complete · Hold to edit · Drag to reorder</p>
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
                    onPin={() => togglePin(task)}
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
              <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {completedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    completedToday={true}
                    last7Days={taskLast7Days(task.id)}
                    size={taskSizes[task.id] ?? 'full'}
                    onComplete={() => {}}
                    onDelete={() => deleteTask(task.id)}
                    onPin={() => togglePin(task)}
                    onResize={s => resizeTask(task.id, s)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category-specific panels */}
        <div className="my-6 border-t border-white/5" />
        {category === 'fitness' && (
          <div className="fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Tracking</p>
            <MetricPanels userId={user.id} />
          </div>
        )}
        {category === 'focus' && (
          <div className="fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Deep Work</p>
            <DeepWorkTimer userId={user.id} />
          </div>
        )}
      </div>

      {/* Floating add button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 max-w-md w-full px-5 pointer-events-none">
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-semibold shadow-2xl transition-all active:scale-95"
            style={{ background: cfg.color }}
          >
            <Plus size={16} strokeWidth={2.5} /> Add goal
          </button>
        </div>
      </div>
    </>
  );
}
