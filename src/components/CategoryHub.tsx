import { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import Toggle from './Toggle';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_, Completion, GoalCategory } from '../lib/supabase';
import { recordCompletion } from '../lib/petEngine';
import MetricPanels from './MetricPanels';
import DeepWorkTimer from './DeepWorkTimer';

interface Props {
  category: GoalCategory;
  onClose: () => void;
}

const CATEGORY_CONFIG: Record<GoalCategory, { label: string; emoji: string; color: string; tagline: string }> = {
  fitness: { label: 'Fitness',  emoji: '💪', color: '#f87171', tagline: 'Move your body, track your progress' },
  focus:   { label: 'Focus',    emoji: '🧠', color: '#60a5fa', tagline: 'Build your mind, own your time' },
};

function todayKey() { return new Date().toISOString().slice(0, 10); }

function PromiseRow({ promise, onComplete }: { promise: Promise_; onComplete: () => void }) {
  const today = todayKey();
  const [done, setDone] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);
  const setPet = useAuthStore(s => s.setPetLocal);

  useEffect(() => {
    if (!user) return;
    supabase.from('completions').select('id').eq('promise_id', promise.id).eq('date_key', today).single()
      .then(({ data }) => { if (data) setDone(true); });
  }, [promise.id]);

  async function complete() {
    if (done || !user || !pet) return;
    const prevLevel = pet.level;
    await supabase.from('completions').insert({ user_id: user.id, promise_id: promise.id, date_key: today, proof_type: 'self' });
    const updated = await recordCompletion(pet, user.id);
    if (updated) {
      setPet(updated);
      if (updated.level > prevLevel) { setLevelUp(true); setTimeout(() => setLevelUp(false), 2500); }
    }
    setDone(true);
    onComplete();
  }

  const cfg = CATEGORY_CONFIG[promise.category as GoalCategory] ?? CATEGORY_CONFIG.fitness;
  const id = `promise-${promise.id}`;

  return (
    <div className="relative">
      {levelUp && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce whitespace-nowrap">
          ⬆️ Level up!
        </div>
      )}
      <div className="liquid-glass rounded-2xl px-4 py-3.5" style={{ opacity: done ? 0.6 : 1 }}>
        <input
          type="checkbox"
          id={id}
          checked={done}
          onChange={complete}
          className="hidden"
        />
        <label htmlFor={id} className="flex items-center gap-3 cursor-pointer select-none" style={{ WebkitUserSelect: 'none' }}>
          {/* Checkbox box */}
          <div className="relative shrink-0" style={{ width: 22, height: 22 }}>
            {/* Border/background */}
            <div
              className="absolute inset-0 rounded-md border-2 transition-all duration-300"
              style={{
                borderColor: done ? cfg.color : 'rgba(255,255,255,0.25)',
                background: done ? cfg.color : 'transparent',
                boxShadow: done ? `0 4px 12px ${cfg.color}55, 0 0 0 2px ${cfg.color}33` : undefined,
              }}
            />
            {/* Checkmark */}
            <svg
              viewBox="0 0 14 14"
              className="absolute inset-0 m-auto w-3.5 h-3.5 transition-all duration-500"
              style={{
                opacity: done ? 1 : 0,
                transform: done ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(20deg)',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
              }}
            >
              <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            {/* Ripple */}
            {done && (
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: cfg.color + '66',
                  animation: 'promise-ripple 0.6s ease-out forwards',
                }}
              />
            )}
          </div>
          {/* Text */}
          <div className="flex-1">
            <p
              className="text-white text-sm font-medium transition-all duration-300"
              style={{ color: done ? 'rgba(255,255,255,0.4)' : 'white', textDecoration: done ? 'line-through' : 'none' }}
            >
              {promise.title}
            </p>
            <p className="text-white/30 text-xs mt-0.5">{done ? 'completed today' : 'tap to complete'}</p>
          </div>
        </label>
      </div>
      <style>{`
        @keyframes promise-ripple {
          0%   { width: 0; height: 0; opacity: 0.6; }
          70%  { width: 50px; height: 50px; opacity: 0.3; }
          100% { width: 60px; height: 60px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function CategoryHub({ category, onClose }: Props) {
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);
  const profile = useAuthStore(s => s.profile);
  const cfg = CATEGORY_CONFIG[category];

  const [promises, setPromises] = useState<Promise_[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Completion[]>([]);
  const [, setCompletionTick] = useState(0);

  const plus = profile?.subscription_tier === 'plus' || profile?.subscription_tier === 'pro';
  const FREE_LIMIT = 5;

  useEffect(() => { loadPromises(); loadHistory(); }, []);

  async function loadPromises() {
    if (!pet) return;
    const { data } = await supabase
      .from('promises')
      .select('*')
      .eq('user_id', pet.user_id)
      .eq('category', category)
      .eq('active', true)
      .order('created_at', { ascending: true });
    if (data) setPromises(data);
  }

  async function loadHistory() {
    if (!pet) return;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (plus ? 365 : 30));
    const { data } = await supabase
      .from('completions')
      .select('*')
      .eq('user_id', pet.user_id)
      .gte('date_key', cutoff.toISOString().slice(0, 10))
      .order('completed_at', { ascending: false });
    if (data) setHistory(data);
  }

  async function addPromise() {
    if (!newTitle.trim() || !pet) return;
    // Count all active promises across all categories for free limit
    const { count } = await supabase.from('promises').select('*', { count: 'exact', head: true }).eq('user_id', pet.user_id).eq('active', true);
    if (!plus && (count ?? 0) >= FREE_LIMIT) {
      alert(`Free plan allows up to ${FREE_LIMIT} goals total. Upgrade to Plus for unlimited.`);
      return;
    }
    const { data } = await supabase.from('promises').insert({
      user_id: pet.user_id, title: newTitle.trim(), category, frequency: 'daily', verify_method: 'timer',
    }).select().single();
    if (data) { setPromises(p => [...p, data]); setNewTitle(''); setShowAdd(false); }
  }

  async function deletePromise(id: string) {
    await supabase.from('promises').update({ active: false }).eq('id', id);
    setPromises(p => p.filter(x => x.id !== id));
  }

  if (!user || !pet) return null;

  const today = todayKey();
  const todayCompletedIds = new Set(history.filter(h => h.date_key === today).map(h => h.promise_id));
  const doneCount = promises.filter(p => todayCompletedIds.has(p.id)).length;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-6 pt-14 pb-10" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

        {/* Nav */}
        <div className="flex items-center justify-between w-full mb-10 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
            <span className="text-xs">{cfg.emoji}</span>
            <span className="text-white/90 text-xs font-medium">{cfg.label}</span>
          </div>
          <button onClick={onClose} className="liquid-glass w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white/80 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Header */}
        <div className="mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-playfair italic text-white text-3xl leading-tight" style={{ letterSpacing: '-0.04em' }}>
            {cfg.label}
          </h1>
          <p className="text-white/40 text-sm mt-1">{cfg.tagline}</p>
          {promises.length > 0 && (
            <p className="text-white/30 text-xs mt-2">{doneCount}/{promises.length} done today</p>
          )}
        </div>

        {/* Promises */}
        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/40 text-xs uppercase tracking-widest">Goals</p>
            <button
              onClick={() => setShowAdd(v => !v)}
              className="liquid-glass w-7 h-7 flex items-center justify-center rounded-full text-white/60 hover:text-white/90 transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          {showAdd && (
            <div className="flex gap-2 mb-3 fade-up" style={{ animationDelay: '0s' }}>
              <input
                type="text"
                placeholder={`e.g. ${category === 'fitness' ? 'run 30 min' : 'read 20 pages'}`}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPromise()}
                autoFocus
                className="app-input flex-1"
              />
              <button onClick={addPromise} className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white" style={{ background: cfg.color + 'cc' }}>
                Add
              </button>
            </div>
          )}

          {promises.length === 0 && !showAdd && (
            <div className="text-center py-8">
              <p className="text-white/20 text-sm">No {cfg.label.toLowerCase()} goals yet.</p>
              <p className="text-white/20 text-sm mt-0.5">Tap + to add one.</p>
            </div>
          )}

          <div className="space-y-2 mb-6">
            {promises.map(p => (
              <div key={p.id} className="group relative">
                <PromiseRow promise={p} onComplete={() => { setCompletionTick(t => t + 1); loadHistory(); }} />
                <button
                  onClick={() => deletePromise(p.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400/60 transition-all text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fitness tracking panels */}
        {category === 'fitness' && (
          <div className="fade-up" style={{ animationDelay: '0.35s' }}>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Tracking</p>
            <MetricPanels userId={user.id} />
          </div>
        )}

        {/* Focus: deep work timer */}
        {category === 'focus' && (
          <div className="fade-up" style={{ animationDelay: '0.35s' }}>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Deep Work</p>
            <DeepWorkTimer userId={user.id} />
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-6 fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between w-full mb-3">
              <p className="text-white/40 text-xs uppercase tracking-widest">History</p>
              <Toggle checked={showHistory} onChange={setShowHistory} color={cfg.color} />
            </div>
            {showHistory && (
              <div className="space-y-1.5">
                {history.slice(0, 20).map(h => {
                  const p = promises.find(x => x.id === h.promise_id);
                  return (
                    <div key={h.id} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <span className="text-white/50">{p?.title ?? 'Goal'}</span>
                      <span className="text-white/25">{h.date_key}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
