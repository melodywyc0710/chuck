import { useEffect, useState } from 'react';
import { LogOut, Flame, Users, Gift, ChevronRight } from 'lucide-react';
import HistoryChart from './HistoryChart';
import TraitAllocator from './TraitAllocator';
import UpgradeModal from './UpgradeModal';
import SpeciesSelector from './SpeciesSelector';
import AiCheckin from './AiCheckin';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_, Completion, GoalCategory } from '../lib/supabase';
import { applyDecayIfNeeded } from '../lib/petEngine';
import { isPlus, isPro, SPECIES_LIST } from '../lib/species';

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

const CATEGORY_CONFIG: Record<GoalCategory, { label: string; emoji: string; color: string; tagline: string }> = {
  fitness: { label: 'Fitness', emoji: '💪', color: '#f87171', tagline: 'Move your body' },
  focus:   { label: 'Focus',   emoji: '🧠', color: '#60a5fa', tagline: 'Build your mind' },
};

export default function HomeScreen({
  onFriends, onEgg, onCategory,
}: {
  onFriends: () => void;
  onEgg: () => void;
  onCategory: (c: GoalCategory) => void;
}) {
  const pet = useAuthStore(s => s.pet);
  const profile = useAuthStore(s => s.profile);
  const signOut = useAuthStore(s => s.signOut);
  const updatePetState = useAuthStore(s => s.setPetLocal);

  const [promises, setPromises] = useState<Promise_[]>([]);
  const [history, setHistory] = useState<Completion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const eggAvailable = !localStorage.getItem(`nagi_egg_${pet?.user_id}_${new Date().toISOString().slice(0,10)}`);
  const [showTraits, setShowTraits] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [showSpecies, setShowSpecies] = useState(false);

  const tier = profile?.subscription_tier ?? 'free';
  const plus = isPlus(tier);
  const pro = isPro(tier);

  useEffect(() => {
    loadPromises();
    loadHistory();
    if (pet) {
      applyDecayIfNeeded(pet, pet.user_id).then(updated => {
        if (updated) updatePetState(updated);
      });
    }
  }, []);

  async function loadPromises() {
    if (!pet) return;
    const { data } = await supabase.from('promises').select('*').eq('user_id', pet.user_id).eq('active', true).order('created_at', { ascending: true });
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

  if (!pet) return null;

  const mood = moodFromHappiness(pet.happiness);
  const xpPct = Math.round((pet.xp / pet.xp_to_next) * 100);
  const color = petColor(pet.color_seed);
  const speciesData = SPECIES_LIST.find(s => s.id === pet.species) ?? SPECIES_LIST[0];
  const petEmoji = speciesData.emoji;

  const today = new Date().toISOString().slice(0, 10);
  const todayDoneIds = new Set(history.filter(h => h.date_key === today).map(h => h.promise_id));

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
              {eggAvailable && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full" />}
            </button>
            <button onClick={onFriends} className="liquid-glass w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white/90 transition-colors">
              <Users size={13} />
            </button>
            <button onClick={signOut} className="liquid-glass w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 transition-colors">
              <LogOut size={13} />
            </button>
          </div>
        </div>

        {/* Pet */}
        <div className="flex flex-col items-center mb-10 fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative mb-4">
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

        {/* AI check-in */}
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

        {/* Category cards */}
        <div className="fade-up" style={{ animationDelay: '0.35s' }}>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Your goals</p>
          <div className="space-y-3">
            {(Object.entries(CATEGORY_CONFIG) as [GoalCategory, typeof CATEGORY_CONFIG[GoalCategory]][]).map(([cat, cfg], i) => {
              const catPromises = promises.filter(p => p.category === cat);
              const doneToday = catPromises.filter(p => todayDoneIds.has(p.id)).length;
              return (
                <button
                  key={cat}
                  onClick={() => onCategory(cat)}
                  className="w-full liquid-glass rounded-[28px] px-5 py-4 flex items-center gap-4 hover:bg-white/10 transition-all active:scale-[0.98] fade-up"
                  style={{ animationDelay: `${0.35 + i * 0.08}s` }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: cfg.color + '22' }}>
                    {cfg.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium text-base" style={{ letterSpacing: '-0.02em' }}>{cfg.label}</p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {catPromises.length === 0
                        ? cfg.tagline
                        : `${doneToday}/${catPromises.length} done today`}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-white/25" />
                </button>
              );
            })}
          </div>
        </div>

        {/* History chart */}
        <div className="mt-8 fade-up" style={{ animationDelay: '0.55s' }}>
          <button onClick={() => setShowHistory(v => !v)} className="flex items-center justify-between w-full mb-3">
            <div>
              <p className="text-white/40 text-xs mb-0.5">your progress</p>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-lg font-medium leading-tight" style={{ letterSpacing: '-0.03em' }}>History</h2>
                {!plus && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'rgba(124,106,247,0.2)', color: '#7c6af7' }}>30 days</span>}
              </div>
            </div>
          </button>
          {showHistory && <HistoryChart history={history as any} promises={promises} color={color} />}
        </div>
      </div>
    </>
  );
}
