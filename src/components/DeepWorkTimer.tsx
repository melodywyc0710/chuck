import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import Toggle from './Toggle';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

interface Session {
  id: string;
  user_id: string;
  duration_mins: number;
  actual_mins: number | null;
  completed: boolean;
  date_key: string;
  started_at: string;
  ended_at: string | null;
}

type TimerState = 'idle' | 'running' | 'paused' | 'done' | 'abandoned';

const PRESETS = [
  { label: '25 min', mins: 25 },
  { label: '45 min', mins: 45 },
  { label: '60 min', mins: 60 },
  { label: '90 min', mins: 90 },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDuration(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CircleTimer({ pct, secs, color }: { pct: number; secs: number; color: string }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct);
  return (
    <div className="relative flex items-center justify-center w-52 h-52">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 196 196" width="208" height="208">
        <circle cx="98" cy="98" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="98" cy="98" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className="text-white text-4xl font-semibold" style={{ letterSpacing: '-0.04em' }}>
        {formatTime(secs)}
      </span>
    </div>
  );
}

function SessionHistoryChart({ sessions, color }: { sessions: Session[]; color: string }) {
  // Build 30-day buckets
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const buckets = days.map(key => {
    const daySessions = sessions.filter(s => s.date_key === key);
    const completedMins = daySessions.filter(s => s.completed).reduce((sum, s) => sum + (s.actual_mins ?? s.duration_mins), 0);
    const partialMins = daySessions.filter(s => !s.completed).reduce((sum, s) => sum + (s.actual_mins ?? 0), 0);
    return { key, completedMins, partialMins, total: completedMins + partialMins };
  });

  const maxMins = Math.max(...buckets.map(b => b.total), 30);
  const chartH = 72;

  // last 7 days for detailed log
  const recent = sessions.slice(0, 8);

  return (
    <div>
      {/* Bar chart */}
      <div className="flex items-end gap-[2px] mb-1" style={{ height: chartH }}>
        {buckets.map(b => {
          const totalH = Math.round((b.total / maxMins) * chartH);
          const compH = b.total > 0 ? Math.round((b.completedMins / b.total) * totalH) : 0;
          const partH = totalH - compH;
          return (
            <div key={b.key} className="flex-1 flex flex-col justify-end" style={{ height: chartH }}>
              {b.total > 0 ? (
                <div className="w-full flex flex-col justify-end rounded-t-[2px] overflow-hidden" style={{ height: totalH }}>
                  {partH > 0 && <div style={{ height: partH, background: 'rgba(61,142,255,0.2)' }} />}
                  {compH > 0 && <div style={{ height: compH, background: color }} />}
                </div>
              ) : (
                <div className="w-full rounded-t-[2px]" style={{ height: 2, background: 'rgba(255,255,255,0.06)' }} />
              )}
            </div>
          );
        })}
      </div>
      {/* X-axis labels: show only first and last date */}
      <div className="flex justify-between mb-4">
        <span className="text-[9px] text-white/20">{formatDate(days[0])}</span>
        <span className="text-[9px] text-white/20">Today</span>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
          <span className="text-[10px] text-white/30">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm" style={{ background: 'rgba(61,142,255,0.25)' }} />
          <span className="text-[10px] text-white/30">Partial</span>
        </div>
      </div>

      {/* Recent sessions list */}
      <div className="space-y-1.5">
        {recent.map(s => {
          const actualMins = s.actual_mins ?? s.duration_mins;
          const pct = s.duration_mins > 0 ? Math.min(actualMins / s.duration_mins, 1) : 0;
          return (
            <div key={s.id} className="flex items-center gap-3 py-2 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs font-medium">
                    {s.completed ? formatDuration(actualMins) : `${formatDuration(actualMins)} / ${formatDuration(s.duration_mins)}`}
                  </span>
                  <span className="text-white/25 text-[10px]">{formatDate(s.started_at)}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct * 100}%`, background: s.completed ? color : 'rgba(61,142,255,0.3)' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DeepWorkTimer({ userId, color: propColor }: { userId: string; color?: string }) {
  useAuthStore(s => s.pet);
  const [selectedMins, setSelectedMins] = useState(25);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [secsLeft, setSecsLeft] = useState(25 * 60);
  const [totalSecs, setTotalSecs] = useState(25 * 60);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const pausedSecsRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStateRef = useRef<TimerState>('idle');

  // keep ref in sync so visibilitychange handler sees current state
  useEffect(() => { timerStateRef.current = timerState; }, [timerState]);

  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden && timerStateRef.current === 'running') {
        // auto-pause when tab hidden
        if (intervalRef.current) clearInterval(intervalRef.current);
        pausedSecsRef.current = Math.round((endTimeRef.current! - Date.now()) / 1000);
        setTimerState('paused');
        setTabSwitches(n => n + 1);
        setShowTabWarning(true);
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  async function loadSessions() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const { data } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('date_key', cutoff.toISOString().slice(0, 10))
      .order('started_at', { ascending: false });
    if (data) setSessions(data);
  }

  function pickPreset(mins: number) {
    if (timerState !== 'idle') return;
    setSelectedMins(mins);
    setSecsLeft(mins * 60);
    setTotalSecs(mins * 60);
  }

  function applyCustom() {
    const n = parseInt(customInput);
    if (!n || n < 1 || n > 240) return;
    pickPreset(n);
    setShowCustom(false);
    setCustomInput('');
  }

  function startTimer() {
    const secs = timerState === 'paused' ? pausedSecsRef.current : selectedMins * 60;
    endTimeRef.current = Date.now() + secs * 1000;
    setSecsLeft(secs);

    if (timerState === 'idle') {
      setTabSwitches(0);
      setShowTabWarning(false);
      const now = new Date();
      setSessionStartedAt(now);
      supabase.from('focus_sessions').insert({
        user_id: userId,
        duration_mins: selectedMins,
        actual_mins: null,
        completed: false,
        date_key: todayKey(),
        started_at: now.toISOString(),
        ended_at: null,
      }).select().single().then(({ data }) => {
        if (data) { setSessions(prev => [data, ...prev]); setCurrentSessionId(data.id); }
      });
    }

    setTimerState('running');
    intervalRef.current = setInterval(() => {
      const remaining = Math.round((endTimeRef.current! - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        setSecsLeft(0);
        setTimerState('done');
        finishSession(true, selectedMins, tabSwitches);
      } else {
        setSecsLeft(remaining);
      }
    }, 500);
  }

  function pauseTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    pausedSecsRef.current = secsLeft;
    setTimerState('paused');
  }

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsedMins = sessionStartedAt
      ? Math.round((Date.now() - sessionStartedAt.getTime()) / 60000)
      : 0;
    setTimerState('abandoned');
    finishSession(false, elapsedMins);
  }

  function resetTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerState('idle');
    setSecsLeft(selectedMins * 60);
    setTotalSecs(selectedMins * 60);
    setCurrentSessionId(null);
    setSessionStartedAt(null);
    pausedSecsRef.current = 0;
  }

  async function finishSession(completed: boolean, actualMins: number, switches?: number) {
    const endedAt = new Date().toISOString();
    const cheated = (switches ?? tabSwitches) > 2;
    if (currentSessionId) {
      const { data } = await supabase
        .from('focus_sessions')
        .update({ completed: completed && !cheated, actual_mins: actualMins, ended_at: endedAt })
        .eq('id', currentSessionId)
        .select()
        .single();
      if (data) setSessions(prev => prev.map(s => s.id === data.id ? data : s));
    }
    return cheated;
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const pct = totalSecs > 0 ? 1 - secsLeft / totalSecs : 0;
  const color = propColor ?? '#3D8EFF';

  const todaySessions = sessions.filter(s => s.date_key === todayKey());
  const todayMins = todaySessions.filter(s => s.completed).reduce((sum, s) => sum + (s.actual_mins ?? s.duration_mins), 0);

  return (
    <div className="space-y-4">
      {/* Timer card */}
      <div className="liquid-glass rounded-[28px] p-6 flex flex-col items-center">

        {/* Preset selector */}
        {timerState === 'idle' && (
          <div className="radio-tile-group mb-6 w-full justify-center" style={{ '--tile-color': color } as React.CSSProperties}>
            {PRESETS.map(p => (
              <label key={p.mins}>
                <input
                  type="radio"
                  name="preset"
                  className="radio-tile-input"
                  checked={selectedMins === p.mins && !showCustom}
                  onChange={() => { pickPreset(p.mins); setShowCustom(false); }}
                />
                <div className="radio-tile">
                  <span className="radio-tile-label">{p.label}</span>
                </div>
              </label>
            ))}
            <label>
              <input
                type="radio"
                name="preset"
                className="radio-tile-input"
                checked={showCustom}
                onChange={() => setShowCustom(true)}
              />
              <div className="radio-tile">
                <span className="radio-tile-label">Custom</span>
              </div>
            </label>
          </div>
        )}

        {/* Custom input */}
        {showCustom && timerState === 'idle' && (
          <div className="flex gap-2 mb-4 w-full fade-up" style={{ animationDelay: '0s' }}>
            <input
              type="number"
              placeholder="Minutes (1–240)"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyCustom()}
              autoFocus
              className="app-input flex-1"
            />
            <button onClick={applyCustom} className="px-4 py-2 rounded-2xl text-sm font-medium text-white" style={{ background: color + 'cc' }}>Set</button>
          </div>
        )}

        {/* Tab switch warning */}
        {showTabWarning && timerState !== 'idle' && (
          <div className="w-full mb-4 px-4 py-3 rounded-2xl flex items-center justify-between fade-up" style={{ background: 'rgba(201,24,24,0.15)', border: '1px solid rgba(201,24,24,0.3)' }}>
            <div>
              <p className="text-red-400 text-xs font-medium">Timer paused — tab was hidden</p>
              <p className="text-white/30 text-[10px] mt-0.5">
                {tabSwitches} switch{tabSwitches !== 1 ? 'es' : ''} · {tabSwitches > 2 ? 'Session won\'t count ✗' : `${3 - tabSwitches} left before session is void`}
              </p>
            </div>
            <button onClick={() => setShowTabWarning(false)} className="text-white/30 text-xs ml-3">✕</button>
          </div>
        )}

        {/* Circle timer */}
        <CircleTimer pct={pct} secs={secsLeft} color={color} />

        {/* Status label */}
        <p className="text-white/40 text-sm mt-3 mb-6">
          {timerState === 'idle'     && `${formatDuration(selectedMins)} deep work session`}
          {timerState === 'running'  && 'Stay focused — you got this'}
          {timerState === 'paused'   && 'Paused — resume when ready'}
          {timerState === 'done'     && (tabSwitches > 2 ? `✗ Session void — too many tab switches` : `✓ ${formatDuration(selectedMins)} completed!`)}
          {timerState === 'abandoned'&& 'Session ended early'}
        </p>

        {/* Controls */}
        <div className="flex gap-3">
          {(timerState === 'idle' || timerState === 'done' || timerState === 'abandoned') && (
            <button
              onClick={timerState === 'idle' ? startTimer : resetTimer}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium text-white transition-all active:scale-95"
              style={{ background: timerState === 'idle' ? color + 'cc' : 'rgba(255,255,255,0.12)' }}
            >
              {timerState === 'idle' ? <><Play size={14} /> Start</> : <><RotateCcw size={14} /> New session</>}
            </button>
          )}
          {timerState === 'running' && (
            <>
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium text-white liquid-glass transition-all active:scale-95"
              >
                <Pause size={14} /> Pause
              </button>
              <button
                onClick={stopTimer}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium text-white/50 liquid-glass transition-all active:scale-95"
              >
                <Square size={14} /> Stop
              </button>
            </>
          )}
          {timerState === 'paused' && (
            <>
              <button
                onClick={startTimer}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium text-white transition-all active:scale-95"
                style={{ background: color + 'cc' }}
              >
                <Play size={14} /> Resume
              </button>
              <button
                onClick={stopTimer}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium text-white/50 liquid-glass transition-all active:scale-95"
              >
                <Square size={14} /> Stop
              </button>
            </>
          )}
        </div>

        {/* Today's summary */}
        {todayMins > 0 && (
          <div className="mt-5 pt-5 border-t border-white/8 w-full flex items-center justify-between">
            <span className="text-white/30 text-xs">Today's focus time</span>
            <span className="font-semibold text-sm" style={{ color }}>{formatDuration(todayMins)}</span>
          </div>
        )}
      </div>

      {/* Session history */}
      {sessions.length > 0 && (
        <div className="liquid-glass rounded-[28px] p-5">
          <div className="w-full flex items-center justify-between mb-4">
            <p className="text-white/40 text-xs uppercase tracking-widest">Session history</p>
            <Toggle checked={showHistory} onChange={setShowHistory} color={color} />
          </div>
          {showHistory && <SessionHistoryChart sessions={sessions} color={color} />}
        </div>
      )}
    </div>
  );
}
