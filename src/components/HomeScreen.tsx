import { useEffect, useState } from 'react';
import { Plus, LogOut, Flame } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_ } from '../lib/supabase';

const MOOD_EMOJI: Record<string, string> = {
  excited: '🤩',
  happy:   '😊',
  neutral: '😐',
  sad:     '😢',
};

const MOOD_LABEL: Record<string, string> = {
  excited: 'Feeling amazing!',
  happy:   'Doing well~',
  neutral: 'Needs attention',
  sad:     'Please help me',
};

function moodFromHappiness(h: number) {
  if (h >= 80) return 'excited';
  if (h >= 60) return 'happy';
  if (h >= 40) return 'neutral';
  return 'sad';
}

export default function HomeScreen() {
  const pet = useAuthStore(s => s.pet);
  const profile = useAuthStore(s => s.profile);
  const signOut = useAuthStore(s => s.signOut);
  const [promises, setPromises] = useState<Promise_[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => { loadPromises(); }, []);

  async function loadPromises() {
    const { data } = await supabase
      .from('promises')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });
    if (data) setPromises(data);
  }

  async function addPromise() {
    if (!newTitle.trim()) return;
    const { data } = await supabase
      .from('promises')
      .insert({ title: newTitle.trim(), frequency: 'daily', verify_method: 'timer' })
      .select()
      .single();
    if (data) {
      setPromises(p => [...p, data]);
      setNewTitle('');
      setShowAdd(false);
    }
  }

  if (!pet) return null;

  const mood = moodFromHappiness(pet.happiness);
  const xpPct = Math.round((pet.xp / pet.xp_to_next) * 100);

  return (
    <div
      className="min-h-screen bg-[#0e0c0a] flex flex-col max-w-md mx-auto tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,130,80,0.10)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4">
        <div>
          <p className="text-white/30 text-xs tracking-widest uppercase">hello</p>
          <h1 className="font-playfair italic text-white text-2xl leading-tight" style={{ letterSpacing: '-0.03em' }}>
            {profile?.username}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-full px-3 py-1.5">
            <Flame size={13} className="text-[#e8702a]" />
            <span className="text-white text-xs font-semibold">{pet.streak}</span>
          </div>
          <button
            onClick={signOut}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/40 hover:text-white/80 transition-colors"
          >
            <LogOut size={13} />
          </button>
        </div>
      </nav>

      {/* Pet section */}
      <div className="relative z-10 flex flex-col items-center py-8 px-5 hero-anim hero-reveal" style={{ animationDelay: '0.1s', opacity: 0 }}>
        {/* Glow ring */}
        <div
          className="relative w-40 h-40 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-30"
            style={{ backgroundColor: petColor(pet.color_seed) }}
          />
          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center text-6xl shadow-2xl border border-white/10"
            style={{ backgroundColor: petColor(pet.color_seed) + '33', backdropFilter: 'blur(8px)' }}
          >
            {MOOD_EMOJI[mood]}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="font-playfair italic text-white text-2xl" style={{ letterSpacing: '-0.03em' }}>{pet.name}</p>
          <p className="text-white/40 text-xs mt-1">{MOOD_LABEL[mood]}</p>
        </div>

        {/* Bars */}
        <div className="w-full max-w-xs mt-6 space-y-3">
          <div>
            <div className="flex justify-between text-xs text-white/30 mb-1.5">
              <span>happiness</span>
              <span>{pet.happiness}/100</span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pet.happiness}%`, backgroundColor: petColor(pet.color_seed) }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-white/30 mb-1.5">
              <span>level {pet.level}</span>
              <span>{pet.xp} / {pet.xp_to_next} xp</span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e8702a] rounded-full transition-all duration-700"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mx-5 border-t border-white/6" />

      {/* Promises */}
      <div className="relative z-10 flex-1 px-5 pt-6 hero-anim hero-fade" style={{ animationDelay: '0.3s', opacity: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white/80 text-sm font-semibold tracking-wide">Today's promises</h2>
          <button
            onClick={() => setShowAdd(v => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#e8702a]/20 border border-[#e8702a]/30 text-[#e8702a] hover:bg-[#e8702a]/30 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {showAdd && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g. meditate 10 min"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPromise()}
              autoFocus
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/6 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-[#e8a87c]/50 transition-all"
            />
            <button
              onClick={addPromise}
              className="px-4 py-2.5 bg-[#e8702a] text-white rounded-xl text-sm font-medium hover:bg-[#d2611f] transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {promises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/20 text-sm">No promises yet.</p>
            <p className="text-white/20 text-sm mt-1">Add one to keep {pet.name} happy.</p>
          </div>
        )}

        <div className="space-y-2.5 pb-10">
          {promises.map(p => (
            <PromiseCard key={p.id} promise={p} petName={pet.name} petHue={pet.color_seed} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PromiseCard({ promise, petName, petHue }: { promise: Promise_; petName: string; petHue: number }) {
  const today = new Date().toISOString().slice(0, 10);
  const [completed, setCompleted] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const user = useAuthStore(s => s.user);
  const refreshPet = useAuthStore(s => s.refreshPet);

  useEffect(() => {
    async function check() {
      if (!user) return;
      const { data } = await supabase
        .from('completions')
        .select('id')
        .eq('promise_id', promise.id)
        .eq('date_key', today)
        .single();
      if (data) setCompleted(true);
    }
    check();
  }, [promise.id, today, user]);

  useEffect(() => {
    if (!timerRunning) return;
    const target = (promise.timer_duration_mins ?? 1) * 60;
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s + 1 >= target) {
          clearInterval(interval);
          setTimerRunning(false);
          completePromise();
          return target;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  async function completePromise() {
    if (!user) return;
    const { error } = await supabase.from('completions').insert({
      user_id: user.id,
      promise_id: promise.id,
      date_key: today,
      proof_type: 'timer',
    });
    if (!error) {
      setCompleted(true);
      setVerifying(false);
      await refreshPet();
    }
  }

  const durationSecs = (promise.timer_duration_mins ?? 1) * 60;
  const pct = Math.round((seconds / durationSecs) * 100);
  const color = petColor(petHue);

  if (completed) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/4 border border-white/8">
        <span className="text-base">✅</span>
        <span className="text-sm text-white/30 line-through">{promise.title}</span>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="px-4 py-4 rounded-2xl bg-white/6 border border-white/10">
        <p className="text-sm font-medium text-white mb-1">{promise.title}</p>
        <p className="text-xs text-white/35 mb-4">
          Show {petName} you're doing it — keep the timer running!
        </p>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/30 font-mono">
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} / {promise.timer_duration_mins ?? 1}:00
          </span>
          {!timerRunning ? (
            <button
              onClick={() => setTimerRunning(true)}
              className="px-4 py-1.5 bg-[#e8702a] hover:bg-[#d2611f] text-white rounded-full text-xs font-medium transition-colors"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => { setTimerRunning(false); setVerifying(false); setSeconds(0); }}
              className="px-4 py-1.5 bg-white/10 text-white/50 rounded-full text-xs transition-colors hover:bg-white/15"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/6 border border-white/10 hover:bg-white/8 transition-colors">
      <span className="text-sm text-white/80">{promise.title}</span>
      <button
        onClick={() => setVerifying(true)}
        className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-[1.04] active:scale-95"
        style={{ color, borderColor: color + '50', backgroundColor: color + '15' }}
      >
        Do it
      </button>
    </div>
  );
}

function petColor(hue: number) {
  return `hsl(${hue}, 50%, 65%)`;
}
