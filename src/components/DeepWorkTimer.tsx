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
      <span className="font-playfair italic text-white text-4xl" style={{ letterSpacing: '-0.04em' }}>
        {formatTime(secs)}
      </span>
    </div>
  );
}

export default function DeepWorkTimer({ userId }: { userId: string }) {
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
  const endTimeRef = useRef<number | null>(null);
  const pausedSecsRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { loadSessions(); }, []);

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
      // Create DB session
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
        finishSession(true, selectedMins);
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

  async function finishSession(completed: boolean, actualMins: number) {
    const endedAt = new Date().toISOString();
    if (currentSessionId) {
      const { data } = await supabase
        .from('focus_sessions')
        .update({ completed, actual_mins: actualMins, ended_at: endedAt })
        .eq('id', currentSessionId)
        .select()
        .single();
      if (data) setSessions(prev => prev.map(s => s.id === data.id ? data : s));
    }
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const pct = totalSecs > 0 ? 1 - secsLeft / totalSecs : 0;
  const color = '#60a5fa';

  const todaySessions = sessions.filter(s => s.date_key === todayKey());
  const todayMins = todaySessions.filter(s => s.completed).reduce((sum, s) => sum + (s.actual_mins ?? s.duration_mins), 0);

  return (
    <div className="space-y-4">
      {/* Timer card */}
      <div className="liquid-glass rounded-[28px] p-6 flex flex-col items-center">

        {/* Preset selector */}
        {timerState === 'idle' && (
          <div className="flex gap-2 mb-6 w-full">
            {PRESETS.map(p => (
              <button
                key={p.mins}
                onClick={() => pickPreset(p.mins)}
                className="flex-1 py-2 rounded-2xl text-xs font-medium transition-all"
                style={{
                  background: selectedMins === p.mins ? color + '33' : 'rgba(255,255,255,0.06)',
                  color: selectedMins === p.mins ? color : 'rgba(255,255,255,0.4)',
                  boxShadow: selectedMins === p.mins ? `0 0 0 1px ${color}55` : 'none',
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustom(v => !v)}
              className="flex-1 py-2 rounded-2xl text-xs font-medium transition-all"
              style={{
                background: showCustom ? color + '22' : 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Custom
            </button>
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

        {/* Circle timer */}
        <CircleTimer pct={pct} secs={secsLeft} color={color} />

        {/* Status label */}
        <p className="text-white/40 text-sm mt-3 mb-6">
          {timerState === 'idle'     && `${formatDuration(selectedMins)} deep work session`}
          {timerState === 'running'  && 'Stay focused — you got this'}
          {timerState === 'paused'   && 'Paused — resume when ready'}
          {timerState === 'done'     && `✓ ${formatDuration(selectedMins)} completed!`}
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
          <div className="w-full flex items-center justify-between">
            <p className="text-white/40 text-xs uppercase tracking-widest">Session history</p>
            <Toggle checked={showHistory} onChange={setShowHistory} color={color} />
          </div>
          {showHistory && (
            <div className="mt-3 space-y-2">
              {sessions.slice(0, 20).map(s => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div>
                    <p className="text-white/70 text-sm">
                      {s.completed ? '✓ ' : '○ '}
                      {formatDuration(s.actual_mins ?? s.duration_mins)}
                      {!s.completed && s.actual_mins ? ` / ${formatDuration(s.duration_mins)}` : ''}
                    </p>
                    <p className="text-white/25 text-xs mt-0.5">{formatDate(s.started_at)}</p>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: s.completed ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.06)',
                      color: s.completed ? color : 'rgba(255,255,255,0.25)',
                    }}
                  >
                    {s.completed ? 'done' : 'partial'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
