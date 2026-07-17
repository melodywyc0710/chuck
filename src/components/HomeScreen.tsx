import { useEffect, useState } from 'react';
import { Plus, LogOut, Flame, Users, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import HistoryChart from './HistoryChart';
import TraitAllocator from './TraitAllocator';
import UpgradeModal from './UpgradeModal';
import SpeciesSelector from './SpeciesSelector';
import AiCheckin from './AiCheckin';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_, Completion, GoalCategory } from '../lib/supabase';
import { applyDecayIfNeeded, recordCompletion } from '../lib/petEngine';
import { isPlus, isPro, SPECIES_LIST } from '../lib/species';

interface CompletionWithTitle extends Completion {
  promise_title: string;
}

function petColor(hue: number) {
  return `hsl(${hue}, 50%, 65%)`;
}

const MOOD_EMOJI: Record<string, string> = {
  excited: '🤩', happy: '😊', neutral: '😐', sad: '😢',
};
const MOOD_LABEL: Record<string, string> = {
  excited: 'Feeling amazing!', happy: 'Doing well~', neutral: 'Needs attention', sad: 'Please help me',
};

function moodFromHappiness(h: number) {
  if (h >= 80) return 'excited';
  if (h >= 60) return 'happy';
  if (h >= 40) return 'neutral';
  return 'sad';
}

export default function HomeScreen({ onFriends, onEgg }: { onFriends: () => void; onEgg: () => void }) {
  const pet = useAuthStore(s => s.pet);
  const profile = useAuthStore(s => s.profile);
  const signOut = useAuthStore(s => s.signOut);
  const updatePetState = useAuthStore(s => s.setPetLocal);
  const [promises, setPromises] = useState<Promise_[]>([]);
  const [history, setHistory] = useState<CompletionWithTitle[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const eggAvailable = !localStorage.getItem(`nagi_egg_${pet?.user_id}_${new Date().toISOString().slice(0,10)}`);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('general');
  const [showTraits, setShowTraits] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [showSpecies, setShowSpecies] = useState(false);

  const tier = profile?.subscription_tier ?? 'free';
  const plus = isPlus(tier);
  const pro = isPro(tier);
  const FREE_GOAL_LIMIT = 5;

  useEffect(() => {
    loadPromises();
    loadHistory();
    // Apply passive happiness decay on load
    if (pet) {
      const userId = pet.user_id;
      applyDecayIfNeeded(pet, userId).then(updated => {
        if (updated) updatePetState(updated);
      });
    }
  }, []);

  async function loadPromises() {
    const { data } = await supabase.from('promises').select('*').eq('active', true).order('created_at', { ascending: true });
    if (data) setPromises(data);
  }

  async function loadHistory() {
    if (!pet) return;
    const query = supabase
      .from('completions')
      .select('*')
      .eq('user_id', pet.user_id)
      .order('completed_at', { ascending: false });
    // Free users: last 30 days only
    if (!plus) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      query.gte('date_key', cutoff.toISOString().slice(0, 10));
    }
    const { data } = await query;
    if (!data) return;
    // Enrich with promise titles
    const enriched = await Promise.all(data.map(async c => {
      const { data: p } = await supabase.from('promises').select('title').eq('id', c.promise_id).single();
      return { ...c, promise_title: p?.title ?? 'Unknown promise' };
    }));
    setHistory(enriched);
  }

  async function addPromise() {
    if (!newTitle.trim() || !pet) return;
    if (!plus && promises.length >= FREE_GOAL_LIMIT) {
      setUpgradeReason(`You've reached ${FREE_GOAL_LIMIT} goals — upgrade for unlimited`);
      setShowUpgrade(true);
      return;
    }
    const { data } = await supabase.from('promises').insert({ user_id: pet.user_id, title: newTitle.trim(), category: newCategory, frequency: 'daily', verify_method: 'timer' }).select().single();
    if (data) { setPromises(p => [...p, data]); setNewTitle(''); setNewCategory('general'); setShowAdd(false); }
  }

  if (!pet) return null;

  const mood = moodFromHappiness(pet.happiness);
  const xpPct = Math.round((pet.xp / pet.xp_to_next) * 100);
  const color = petColor(pet.color_seed);
  const speciesData = SPECIES_LIST.find(s => s.id === pet.species) ?? SPECIES_LIST[0];
  const petEmoji = speciesData.emoji;

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      {showTraits && <TraitAllocator onClose={() => setShowTraits(false)} />}
      {showUpgrade && <UpgradeModal reason={upgradeReason} onClose={() => setShowUpgrade(false)} />}
      {showSpecies && <SpeciesSelector onClose={() => setShowSpecies(false)} />}
      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-6 pt-14 pb-6" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

        {/* Nav */}
        <div className="flex items-center justify-between mb-10 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
            <Flame size={12} className="text-orange-400" />
            <span className="text-white/90 text-xs font-medium">Day {pet.streak} streak</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm">{profile?.username}</span>
            <button
              onClick={onEgg}
              className="relative liquid-glass w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white/90 transition-colors"
            >
              <Gift size={13} />
              {eggAvailable && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
              )}
            </button>
            <button
              onClick={onFriends}
              className="liquid-glass w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white/90 transition-colors"
            >
              <Users size={13} />
            </button>
            <button
              onClick={signOut}
              className="liquid-glass w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 transition-colors"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>

        {/* Pet */}
        <div className="flex flex-col items-center mb-10 fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative mb-4">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-40 scale-150" style={{ backgroundColor: color }} />
            <button
              onClick={() => setShowSpecies(true)}
              className="relative w-32 h-32 rounded-full flex items-center justify-center text-5xl liquid-glass hover:bg-white/10 transition-colors"
              style={{ background: color + '22' }}
            >
              {petEmoji}
              <span className="absolute bottom-1 right-1 text-base">{MOOD_EMOJI[mood]}</span>
            </button>
          </div>
          <h1 className="font-playfair italic text-white text-3xl mb-1" style={{ letterSpacing: '-0.04em' }}>{pet.name}</h1>
          <p className="text-white/40 text-xs">{MOOD_LABEL[mood]}</p>

          {/* Bars */}
          <div className="w-full mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-white/30 mb-1.5">
                <span>happiness</span><span>{pet.happiness}/100</span>
              </div>
              <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pet.happiness}%`, backgroundColor: color }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/30 mb-1.5">
                <span>level {pet.level}</span><span>{pet.xp}/{pet.xp_to_next} xp</span>
              </div>
              <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-orange-400/70 transition-all duration-700" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>

          {/* Traits */}
          <button
            onClick={() => setShowTraits(true)}
            className="w-full mt-4 liquid-glass rounded-2xl px-4 py-3 text-left hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-xs">traits</span>
              {pet.trait_points_available > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#e8702a33', color: '#e8702a' }}>
                  {pet.trait_points_available} pts to spend
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {([
                { key: 'trait_strength' as const,     emoji: '💪', color: '#f87171' },
                { key: 'trait_intelligence' as const, emoji: '🧠', color: '#60a5fa' },
                { key: 'trait_agility' as const,      emoji: '⚡', color: '#facc15' },
                { key: 'trait_speed' as const,        emoji: '🌪️', color: '#34d399' },
              ]).map(({ key, emoji, color: c }) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <span className="text-sm">{emoji}</span>
                  <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(pet[key] / 50) * 100}%`, backgroundColor: c }} />
                  </div>
                  <span className="text-white/30 text-[10px] tabular-nums">{pet[key]}</span>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* AI check-in (Pro) or upgrade prompt */}
        <div className="my-2 mb-8 fade-up" style={{ animationDelay: '0.25s' }}>
          {pro
            ? <AiCheckin petEmoji={petEmoji} color={color} />
            : (
              <button
                onClick={() => { setUpgradeReason('AI daily check-ins are a Pro feature'); setShowUpgrade(true); }}
                className="w-full liquid-glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-white/10 transition-colors"
              >
                <span className="text-xl">{petEmoji}</span>
                <div className="flex-1 text-left">
                  <p className="text-white/50 text-xs">morning check-in</p>
                  <p className="text-white/25 text-xs mt-0.5">Upgrade to Pro — your pet talks to you daily</p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: '#e8702a22', color: '#e8702a' }}>Pro</span>
              </button>
            )
          }
        </div>

        {/* Promises */}
        <div className="flex-1 fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/40 text-xs mb-0.5">Track your day</p>
              <h2 className="text-white text-lg font-medium leading-tight" style={{ letterSpacing: '-0.03em' }}>
                Today's promises
              </h2>
            </div>
            <button
              onClick={() => setShowAdd(v => !v)}
              className="liquid-glass w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white/90 transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>

          {showAdd && (
            <div className="mb-3 fade-up space-y-2" style={{ animationDelay: '0s' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. meditate 10 min"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPromise()}
                  autoFocus
                  className="flex-1 px-4 py-2.5 rounded-2xl text-white placeholder-white/30 text-sm outline-none transition-all liquid-glass"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                />
                <button onClick={addPromise} className="px-4 py-2.5 bg-orange-500/80 text-white rounded-2xl text-sm font-medium hover:bg-orange-500 transition-colors">
                  Add
                </button>
              </div>
              <div className="flex gap-1.5">
                {([
                  { v: 'general', emoji: '✦', label: 'General' },
                  { v: 'strength', emoji: '💪', label: 'Strength' },
                  { v: 'intelligence', emoji: '🧠', label: 'Intelligence' },
                  { v: 'agility', emoji: '⚡', label: 'Agility' },
                  { v: 'speed', emoji: '🌪️', label: 'Speed' },
                ] as { v: GoalCategory; emoji: string; label: string }[]).map(({ v, emoji }) => (
                  <button
                    key={v}
                    onClick={() => setNewCategory(v)}
                    className="flex-1 py-1.5 rounded-xl text-[10px] font-medium transition-all"
                    style={{
                      background: newCategory === v ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                      color: newCategory === v ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-white/25 text-[10px] text-center">
                Category: {newCategory} — completions earn trait points for this category
              </p>
            </div>
          )}

          {promises.length === 0 && (
            <div className="text-center py-10">
              <p className="text-white/20 text-sm">No promises yet.</p>
              <p className="text-white/20 text-sm mt-1">Add one to keep {pet.name} happy.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {promises.map((p, i) => (
              <PromiseCard key={p.id} promise={p} index={i} petName={pet.name} color={color} onComplete={loadHistory} onTraitEarned={() => setShowTraits(true)} />
            ))}
          </div>
        </div>

        {/* Completion history chart */}
        <div className="mt-6 fade-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => setShowHistory(v => !v)}
            className="flex items-center justify-between w-full mb-3"
          >
            <div>
              <p className="text-white/40 text-xs mb-0.5">your progress</p>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-lg font-medium leading-tight" style={{ letterSpacing: '-0.03em' }}>History</h2>
                {!plus && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'rgba(124,106,247,0.2)', color: '#7c6af7' }}>30 days · Plus for full</span>}
              </div>
            </div>
            {showHistory ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
          </button>

          {showHistory && (
            <HistoryChart history={history} promises={promises} color={color} />
          )}
        </div>
      </div>
    </>
  );
}

// ─── Trait constants shared with PromiseCard ───
const TRAIT_COLORS: Record<string, string> = {
  strength: '#f87171', intelligence: '#60a5fa', agility: '#facc15', speed: '#34d399', general: '#a78bfa',
};
const TRAIT_EMOJI: Record<string, string> = {
  strength: '💪', intelligence: '🧠', agility: '⚡', speed: '🌪️', general: '✦',
};

function PromiseCard({ promise, index, onComplete, onTraitEarned }: { promise: Promise_; index: number; petName?: string; color?: string; onComplete?: () => void; onTraitEarned?: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [completed, setCompleted] = useState(false);
  const [completionId, setCompletionId] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState(false);
  const [showWitness, setShowWitness] = useState(false);
  const [friends, setFriends] = useState<{ id: string; username: string }[]>([]);
  const [witnessSent, setWitnessSent] = useState(false);
  const user = useAuthStore(s => s.user);
  const pet = useAuthStore(s => s.pet);
  const setPet = useAuthStore(s => s.setPetLocal);

  useEffect(() => {
    async function check() {
      if (!user) return;
      const { data } = await supabase.from('completions').select('id').eq('promise_id', promise.id).eq('date_key', today).single();
      if (data) setCompleted(true);
    }
    check();
  }, [promise.id, today, user]);

  async function completePromise() {
    if (!user || !pet) return;
    const prevLevel = pet.level;
    // Record completion row
    const { data: comp, error } = await supabase.from('completions').insert({
      user_id: user.id, promise_id: promise.id, date_key: today, proof_type: 'self',
    }).select().single();
    if (error) return;
    if (comp) setCompletionId(comp.id);
    // Update pet stats (XP, happiness, streak, level)
    const updated = await recordCompletion(pet, user.id);
    if (updated) {
      setPet(updated);
      if (updated.level > prevLevel) {
        setLevelUp(true);
        setTimeout(() => setLevelUp(false), 2500);
      }
    }
    setCompleted(true);
    onComplete?.();
    onTraitEarned?.();
    loadFriends();
  }

  async function loadFriends() {
    if (!user) return;
    const { data } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq('status', 'accepted');
    if (!data) return;
    const list = await Promise.all(data.map(async f => {
      const otherId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
      const { data: p } = await supabase.from('profiles').select('id,username').eq('id', otherId).single();
      return p ? { id: p.id, username: p.username } : null;
    }));
    setFriends(list.filter(Boolean) as { id: string; username: string }[]);
  }

  async function sendWitnessRequest(witnessId: string) {
    if (!user || !completionId) return;
    await supabase.from('witness_requests').insert({
      completion_id: completionId,
      requester_id: user.id,
      witness_id: witnessId,
    });
    setWitnessSent(true);
    setShowWitness(false);
  }

  const num = String(index + 1).padStart(2, '0');

  return (
    <div className="relative">
      {levelUp && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce whitespace-nowrap">
          ⬆️ Level up!
        </div>
      )}
      <button
        onClick={() => !completed && completePromise()}
        className="liquid-glass rounded-[28px] p-4 flex flex-col text-left transition-all active:scale-[0.97] fade-up w-full"
        style={{ minHeight: 120, animationDelay: `${0.4 + index * 0.08}s`, opacity: completed && !showWitness ? 0.6 : 1 }}
      >
        <div className="flex items-center justify-between mb-auto">
          <span className="text-white/40 text-xs font-medium">{num}</span>
          {promise.category && promise.category !== 'general' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: TRAIT_COLORS[promise.category] + '33', color: TRAIT_COLORS[promise.category] }}>
              {TRAIT_EMOJI[promise.category]}
            </span>
          )}
        </div>
        <div>
          <p className={`text-white text-base font-medium ${completed ? 'line-through' : ''}`}>{promise.title}</p>
          {completed
            ? <p className="text-white/30 text-xs mt-0.5">done ✓</p>
            : <p className="text-white/30 text-xs mt-0.5">tap to complete</p>
          }
        </div>
      </button>

      {/* Witness row — shows after completion if user has friends */}
      {completed && !witnessSent && friends.length > 0 && (
        <div className="mt-2 fade-up" style={{ animationDelay: '0s' }}>
          {!showWitness ? (
            <button
              onClick={() => setShowWitness(true)}
              className="w-full text-center text-white/30 text-xs py-1 hover:text-white/60 transition-colors"
            >
              👁 Ask a friend to witness
            </button>
          ) : (
            <div className="liquid-glass rounded-2xl p-3 space-y-2">
              <p className="text-white/50 text-xs">Send witness request to:</p>
              {friends.map(f => (
                <button
                  key={f.id}
                  onClick={() => sendWitnessRequest(f.id)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/6 hover:bg-white/10 text-white/80 text-sm transition-colors"
                >
                  {f.username}
                </button>
              ))}
              <button onClick={() => setShowWitness(false)} className="w-full text-white/30 text-xs pt-1 hover:text-white/50">cancel</button>
            </div>
          )}
        </div>
      )}
      {witnessSent && (
        <p className="text-center text-white/30 text-xs mt-1">👁 Witness request sent</p>
      )}
    </div>
  );
}
