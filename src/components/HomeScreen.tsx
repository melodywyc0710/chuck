import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_ } from '../lib/supabase';

// Deterministic color from hue seed
function petColor(hue: number) {
  return `hsl(${hue}, 55%, 72%)`;
}

const MOOD_EMOJI: Record<string, string> = {
  happy:   '😊',
  excited: '🤩',
  neutral: '😐',
  sad:     '😢',
};

function moodFromHappiness(h: number): string {
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

  useEffect(() => {
    loadPromises();
  }, []);

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
    <div className="min-h-screen bg-[#fdf6ee] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <div>
          <p className="text-xs text-[#9a8070]">hello, {profile?.username}</p>
          <h1 className="text-lg font-bold text-[#4a3728]">{pet.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#ffe0b2] text-[#c07850] px-2 py-1 rounded-full font-medium">
            🔥 {pet.streak}
          </span>
          <button onClick={signOut} className="text-xs text-[#bca99a]">out</button>
        </div>
      </div>

      {/* Pet display */}
      <div className="flex flex-col items-center py-6 px-5">
        <div
          className="w-36 h-36 rounded-full flex items-center justify-center text-6xl shadow-lg mb-3"
          style={{ backgroundColor: petColor(pet.color_seed) }}
        >
          {MOOD_EMOJI[mood]}
        </div>
        <p className="text-sm text-[#9a8070] mb-1">
          {mood === 'excited' ? 'feeling amazing!' : mood === 'happy' ? 'doing well~' : mood === 'neutral' ? 'needs attention' : 'please help me 😢'}
        </p>

        {/* Happiness bar */}
        <div className="w-full max-w-xs mt-2">
          <div className="flex justify-between text-xs text-[#bca99a] mb-1">
            <span>happiness</span>
            <span>{pet.happiness}/100</span>
          </div>
          <div className="h-2 bg-[#ede3d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff9f7a] rounded-full transition-all"
              style={{ width: `${pet.happiness}%` }}
            />
          </div>
        </div>

        {/* XP bar */}
        <div className="w-full max-w-xs mt-2">
          <div className="flex justify-between text-xs text-[#bca99a] mb-1">
            <span>level {pet.level}</span>
            <span>{pet.xp}/{pet.xp_to_next} xp</span>
          </div>
          <div className="h-2 bg-[#ede3d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#a0c4a0] rounded-full transition-all"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Promises list */}
      <div className="flex-1 px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#4a3728]">Today's promises</h2>
          <button
            onClick={() => setShowAdd(v => !v)}
            className="text-xs text-[#c07850] font-medium"
          >
            + add
          </button>
        </div>

        {showAdd && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. meditate 10 min"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPromise()}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#e8ddd3] text-sm text-[#4a3728] placeholder-[#bca99a] outline-none focus:border-[#c07850]"
            />
            <button
              onClick={addPromise}
              className="px-3 py-2 bg-[#c07850] text-white rounded-xl text-sm font-medium"
            >
              Add
            </button>
          </div>
        )}

        {promises.length === 0 && (
          <div className="text-center py-8 text-[#bca99a] text-sm">
            No promises yet. Add one to keep {pet.name} happy!
          </div>
        )}

        <div className="space-y-2">
          {promises.map(p => (
            <PromiseCard key={p.id} promise={p} petName={pet.name} />
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}

function PromiseCard({ promise, petName }: { promise: Promise_; petName: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [completed, setCompleted] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const user = useAuthStore(s => s.user);
  const updatePet = useAuthStore(s => s.updatePet);
  const refreshPet = useAuthStore(s => s.refreshPet);

  useEffect(() => {
    // Check if already completed today
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
      // Update pet happiness + xp
      await updatePet({ happiness: undefined }); // trigger refresh via refreshPet
      await refreshPet();
    }
  }

  const durationSecs = (promise.timer_duration_mins ?? 1) * 60;
  const pct = Math.round((seconds / durationSecs) * 100);

  if (completed) {
    return (
      <div className="flex items-center gap-3 p-3 bg-[#f0f7f0] rounded-2xl border border-[#c8e6c8]">
        <span className="text-lg">✅</span>
        <span className="text-sm text-[#4a7a4a] font-medium line-through opacity-70">{promise.title}</span>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="p-4 bg-white rounded-2xl border border-[#e8ddd3] shadow-sm">
        <p className="text-sm font-medium text-[#4a3728] mb-3">{promise.title}</p>
        <p className="text-xs text-[#9a8070] mb-3">
          Show {petName} you're doing it — keep the timer running!
        </p>
        <div className="h-2 bg-[#ede3d8] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[#c07850] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#9a8070]">
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} / {promise.timer_duration_mins ?? 1}:00
          </span>
          {!timerRunning ? (
            <button
              onClick={() => setTimerRunning(true)}
              className="px-4 py-1.5 bg-[#c07850] text-white rounded-full text-xs font-medium"
            >
              Start timer
            </button>
          ) : (
            <button
              onClick={() => { setTimerRunning(false); setVerifying(false); setSeconds(0); }}
              className="px-4 py-1.5 bg-[#e8ddd3] text-[#9a8070] rounded-full text-xs"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-[#e8ddd3] shadow-sm">
      <span className="text-sm text-[#4a3728] font-medium">{promise.title}</span>
      <button
        onClick={() => setVerifying(true)}
        className="px-3 py-1.5 bg-[#fdf0e8] text-[#c07850] rounded-full text-xs font-semibold border border-[#f0d8c0]"
      >
        Do it
      </button>
    </div>
  );
}
