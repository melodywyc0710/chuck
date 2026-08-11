import { useEffect, useRef, useState } from 'react';
import {
  X, Plus, Check, Timer, Hash, TrendingDown, BookOpen, List, Dumbbell,
  Activity, Pause, Play, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { recordCompletion } from '../lib/petEngine';
import type { Habit, HabitLog } from '../lib/habitTypes';
import HabitCreator from './HabitCreator';

interface Props {
  onClose: () => void;
  onWorkout: () => void;
  onJournal: () => void;
}

// ─── Icon mapping ─────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ElementType> = {
  complete:  Check,
  timer:     Timer,
  counter:   Hash,
  numeric:   Activity,
  avoid:     TrendingDown,
  journal:   BookOpen,
  checklist: List,
  workout:   Dumbbell,
};

const TYPE_LABEL: Record<string, string> = {
  complete:  'Complete',
  timer:     'Timer',
  counter:   'Counter',
  numeric:   'Numeric',
  avoid:     'Avoid',
  journal:   'Journal',
  checklist: 'Checklist',
  workout:   'Workout',
};

// ─── Timer modal ──────────────────────────────────────────────────────────────

function HabitTimerModal({
  habit,
  onDone,
  onClose,
}: {
  habit: Habit;
  onDone: (minutesCompleted: number) => void;
  onClose: () => void;
}) {
  const targetSecs = (habit.target_value ?? 25) * 60;
  const [secsLeft, setSecsLeft] = useState(targetSecs);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  function startStop() {
    if (finished) return;
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSecsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
  }

  function handleDone() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsed = targetSecs - secsLeft;
    const mins = Math.max(1, Math.round(elapsed / 60));
    onDone(mins);
  }

  const pct = secsLeft / targetSecs;
  const r = 88;
  const circ = 2 * Math.PI * r;
  const offset = circ * pct;
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: '#0a0a0a' }}>
      <button onClick={onClose} className="absolute top-14 left-5 text-white/30 hover:text-white/60 transition-colors">
        <X size={20} />
      </button>

      <p className="text-white/40 text-sm mb-12">{habit.name}</p>

      {/* Circle */}
      <div className="relative flex items-center justify-center w-56 h-56 mb-12">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 196 196" width="224" height="224">
          <circle cx="98" cy="98" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="98" cy="98" r={r} fill="none"
            stroke={finished ? '#10B981' : '#FF4D4D'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="text-center">
          <p className="text-white font-semibold tabular-nums" style={{ fontSize: 44, letterSpacing: '-0.04em' }}>
            {mm}:{ss}
          </p>
          {habit.target_value && (
            <p className="text-white/25 text-xs mt-1">{habit.target_value} {habit.target_unit ?? 'min'}</p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!finished && (
          <button
            onClick={startStop}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-all active:scale-95"
            style={{ background: '#FF4D4D' }}
          >
            {running ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" style={{ marginLeft: 2 }} />}
          </button>
        )}
        {(running || secsLeft < targetSecs || finished) && (
          <button
            onClick={handleDone}
            className="px-5 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
            style={{ background: finished ? '#10B981' : 'rgba(255,255,255,0.08)', color: 'white' }}
          >
            {finished ? 'Done!' : 'Mark complete'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Habit card ───────────────────────────────────────────────────────────────

function HabitCard({
  habit,
  log,
  workoutDoneToday,
  journalDoneToday,
  onLog,
  onDelete,
  onOpenTimer,
  onOpenWorkout,
  onOpenJournal,
}: {
  habit: Habit;
  log: HabitLog | null;
  workoutDoneToday: boolean;
  journalDoneToday: boolean;
  onLog: (habitId: string, value: number | null, notes?: string) => void;
  onDelete: (id: string) => void;
  onOpenTimer: (habit: Habit) => void;
  onOpenWorkout: () => void;
  onOpenJournal: () => void;
}) {
  const [counter, setCounter] = useState<number>(log?.value ?? 0);
  const [numInput, setNumInput] = useState(log?.value != null ? String(log.value) : '');
  const [checkedItems, setCheckedItems] = useState<Set<number>>(() => {
    if (!log?.notes) return new Set();
    try { return new Set(JSON.parse(log.notes) as number[]); } catch { return new Set(); }
  });
  const [showDelete, setShowDelete] = useState(false);

  const tt = habit.tracking_type;
  const Icon = TYPE_ICON[tt] ?? Check;
  const isDone = (() => {
    if (tt === 'workout') return workoutDoneToday;
    if (tt === 'journal') return journalDoneToday;
    if (!log) return false;
    if (tt === 'complete' || tt === 'avoid') return true;
    if (tt === 'timer' || tt === 'counter') {
      if (habit.target_value == null) return true;
      return (log.value ?? 0) >= habit.target_value;
    }
    if (tt === 'numeric') return true;
    if (tt === 'checklist') {
      const total = habit.checklist_items.length;
      return total > 0 && checkedItems.size >= total;
    }
    return true;
  })();

  function handleCounter(delta: number) {
    const next = Math.max(0, counter + delta);
    setCounter(next);
    onLog(habit.id, next);
  }

  function handleNumSave() {
    const v = parseFloat(numInput);
    if (!isNaN(v)) onLog(habit.id, v);
  }

  function toggleChecklistItem(idx: number) {
    const next = new Set(checkedItems);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setCheckedItems(next);
    onLog(habit.id, next.size, JSON.stringify([...next]));
  }

  return (
    <div
      className="rounded-[20px] px-4 py-3.5"
      style={{
        background: isDone ? 'rgba(16,185,129,0.06)' : '#111111',
        border: `1px solid ${isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,77,77,0.1)' }}
        >
          {isDone
            ? <Check size={15} style={{ color: '#10B981' }} strokeWidth={2} />
            : <Icon size={15} style={{ color: '#FF4D4D' }} strokeWidth={1.5} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/85 text-sm font-semibold truncate" style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'rgba(255,255,255,0.4)' : undefined }}>
            {habit.name}
          </p>
          <p className="text-white/25 text-[10px]">
            {TYPE_LABEL[tt]}
            {habit.target_value != null && ` · ${habit.target_value} ${habit.target_unit ?? ''}`}
            {tt === 'timer' && log?.value != null && ` · ${log.value}m done`}
            {tt === 'counter' && ` · ${counter}${habit.target_value != null ? `/${habit.target_value}` : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowDelete(v => !v)}
          className="text-white/15 hover:text-white/40 transition-colors"
        >
          {showDelete ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Controls per tracking type */}
      {!isDone && (
        <>
          {tt === 'complete' && (
            <button
              onClick={() => onLog(habit.id, 1)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              Mark done
            </button>
          )}

          {tt === 'timer' && (
            <button
              onClick={() => onOpenTimer(habit)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{ background: '#FF4D4D' }}
            >
              <Play size={13} fill="white" />
              Start timer
            </button>
          )}

          {tt === 'counter' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCounter(-1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 transition-colors"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <span className="text-base font-bold leading-none">−</span>
              </button>
              <p className="flex-1 text-center text-white font-semibold text-lg tabular-nums" style={{ letterSpacing: '-0.02em' }}>
                {counter}
                {habit.target_value != null && <span className="text-white/30 text-sm font-normal">/{habit.target_value}</span>}
              </p>
              <button
                onClick={() => handleCounter(1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 transition-colors"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <span className="text-base font-bold leading-none">+</span>
              </button>
            </div>
          )}

          {tt === 'numeric' && (
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder={`Value${habit.target_unit ? ` (${habit.target_unit})` : ''}…`}
                value={numInput}
                onChange={e => setNumInput(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
              <button
                onClick={handleNumSave}
                disabled={!numInput}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
                style={{ background: '#FF4D4D' }}
              >
                Log
              </button>
            </div>
          )}

          {tt === 'avoid' && (
            <button
              onClick={() => onLog(habit.id, 1)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              Stayed clean today
            </button>
          )}

          {tt === 'journal' && (
            <button
              onClick={onOpenJournal}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <BookOpen size={13} />
              Write today's entry
            </button>
          )}

          {tt === 'workout' && (
            <button
              onClick={onOpenWorkout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{ background: '#FF4D4D' }}
            >
              <Dumbbell size={13} />
              Log workout
            </button>
          )}

          {tt === 'checklist' && (
            <div className="space-y-1.5">
              {habit.checklist_items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleChecklistItem(idx)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all"
                    style={{
                      border: `1.5px solid ${checkedItems.has(idx) ? '#10B981' : 'rgba(255,255,255,0.2)'}`,
                      background: checkedItems.has(idx) ? '#10B981' : 'transparent',
                    }}
                  >
                    {checkedItems.has(idx) && <Check size={9} color="white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm" style={{ color: checkedItems.has(idx) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)', textDecoration: checkedItems.has(idx) ? 'line-through' : 'none' }}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Done state for workout/journal */}
      {isDone && (tt === 'workout' || tt === 'journal') && (
        <p className="text-xs" style={{ color: '#10B981' }}>
          {tt === 'workout' ? 'Workout logged today' : 'Entry written today'}
        </p>
      )}

      {/* Delete confirm */}
      {showDelete && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-white/30 text-xs">Remove this habit?</p>
          <div className="flex gap-2">
            <button onClick={() => setShowDelete(false)} className="text-white/30 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
              Cancel
            </button>
            <button onClick={() => onDelete(habit.id)} className="text-white text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: '#FF4D4D' }}>
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HabitsScreen({ onClose, onWorkout, onJournal }: Props) {
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);
  const setPet = useAuthStore(s => s.setPetLocal);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, HabitLog>>({});
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [activeTimer, setActiveTimer] = useState<Habit | null>(null);
  const [workoutDoneToday, setWorkoutDoneToday] = useState(false);
  const [journalDoneToday, setJournalDoneToday] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => { load(); }, []);

  async function load() {
    if (!user) return;
    setLoading(true);

    const [{ data: h }, { data: l }, { data: w }, { data: d }] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id).eq('archived', false).order('sort_order'),
      supabase.from('habit_logs').select('*').eq('user_id', user.id).eq('date_key', today),
      supabase.from('workouts').select('id').eq('user_id', user.id).eq('is_template', false).gte('started_at', today + 'T00:00:00').limit(1),
      supabase.from('diary_entries').select('id').eq('user_id', user.id).eq('date_key', today).limit(1),
    ]);

    if (h) setHabits(h.map(x => ({ ...x, checklist_items: x.checklist_items ?? [] })) as Habit[]);
    if (l) {
      const map: Record<string, HabitLog> = {};
      for (const log of l) map[log.habit_id] = log as HabitLog;
      setLogs(map);
    }
    setWorkoutDoneToday((w?.length ?? 0) > 0);
    setJournalDoneToday((d?.length ?? 0) > 0);
    setLoading(false);
  }

  async function logHabit(habitId: string, value: number | null, notes?: string) {
    if (!user) return;
    const existing = logs[habitId];
    let updated: HabitLog;

    if (existing) {
      const { data } = await supabase
        .from('habit_logs')
        .update({ value, notes: notes ?? null, logged_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (!data) return;
      updated = data as HabitLog;
    } else {
      const { data } = await supabase
        .from('habit_logs')
        .insert({ user_id: user.id, habit_id: habitId, date_key: today, value, notes: notes ?? null })
        .select()
        .single();
      if (!data) return;
      updated = data as HabitLog;

      // Feed into existing pet/XP system on first completion of the day
      if (pet) {
        const updatedPet = await recordCompletion(pet, user.id);
        if (updatedPet) setPet(updatedPet);
      }
    }

    setLogs(prev => ({ ...prev, [habitId]: updated }));
  }

  async function handleTimerDone(mins: number) {
    if (!activeTimer) return;
    await logHabit(activeTimer.id, mins);
    setActiveTimer(null);
  }

  async function deleteHabit(id: string) {
    await supabase.from('habits').update({ archived: true }).eq('id', id);
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  const doneCount = habits.filter(h => {
    if (h.tracking_type === 'workout') return workoutDoneToday;
    if (h.tracking_type === 'journal') return journalDoneToday;
    return !!logs[h.id];
  }).length;

  if (activeTimer) {
    return (
      <HabitTimerModal
        habit={activeTimer}
        onDone={handleTimerDone}
        onClose={() => setActiveTimer(null)}
      />
    );
  }

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-safe pt-6 pb-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div>
            <h1 className="text-white font-semibold text-lg" style={{ letterSpacing: '-0.03em' }}>Habits</h1>
            <p className="text-white/30 text-[11px] mt-0.5">{todayLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            {habits.length > 0 && (
              <span className="text-white/25 text-xs">{doneCount}/{habits.length}</span>
            )}
            <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 space-y-3">
          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            </div>
          )}

          {!loading && habits.length === 0 && (
            <div className="text-center py-16 px-4">
              <p className="text-white/25 text-sm">No habits yet</p>
              <p className="text-white/15 text-xs mt-1">Tap + to add your first habit</p>
            </div>
          )}

          {!loading && habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              log={logs[habit.id] ?? null}
              workoutDoneToday={workoutDoneToday}
              journalDoneToday={journalDoneToday}
              onLog={logHabit}
              onDelete={deleteHabit}
              onOpenTimer={setActiveTimer}
              onOpenWorkout={onWorkout}
              onOpenJournal={onJournal}
            />
          ))}
        </div>

        {/* Add button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 max-w-md w-full px-5 pointer-events-none">
          <div className="flex justify-end pointer-events-auto">
            <button
              onClick={() => setShowCreator(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-semibold shadow-2xl transition-all active:scale-95"
              style={{ background: '#FF4D4D' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Habit
            </button>
          </div>
        </div>
      </div>

      {showCreator && (
        <HabitCreator
          onSaved={() => { setShowCreator(false); load(); }}
          onClose={() => setShowCreator(false)}
        />
      )}
    </>
  );
}
