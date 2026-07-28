import { useEffect, useState } from 'react';
import type React from 'react';
import { LogOut, Flame, Users, Gift, Dumbbell, Brain, Laugh, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import TraitAllocator from './TraitAllocator';
import UpgradeModal from './UpgradeModal';
import SpeciesSelector from './SpeciesSelector';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Promise_, Completion, GoalCategory } from '../lib/supabase';
import { applyDecayIfNeeded } from '../lib/petEngine';
import { isPlus, isPro, SPECIES_LIST } from '../lib/species';

function petColor(hue: number) {
  return `hsl(${hue}, 50%, 65%)`;
}

function MoodIcon({ h, size = 14 }: { h: number; size?: number }) {
  if (h >= 80) return <Laugh size={size} />;
  if (h >= 60) return <Smile size={size} />;
  if (h >= 40) return <Meh size={size} />;
  return <Frown size={size} />;
}

const CATEGORY_CONFIG: Record<GoalCategory, { label: string; Icon: React.ElementType; color: string; tagline: string }> = {
  fitness: { label: 'Fitness', Icon: Dumbbell, color: '#f87171', tagline: 'No goals yet' },
  focus:   { label: 'Focus',   Icon: Brain,    color: '#60a5fa', tagline: 'No goals yet' },
};

function ProgressRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={3} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

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
  const [showTraits, setShowTraits] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [showSpecies, setShowSpecies] = useState(false);

  const eggAvailable = !localStorage.getItem(`nagi_egg_${pet?.user_id}_${new Date().toISOString().slice(0,10)}`);
  const tier = profile?.subscription_tier ?? 'free';
  const plus = isPlus(tier);
  const pro = isPro(tier);

  useEffect(() => {
    loadData();
    if (pet) applyDecayIfNeeded(pet, pet.user_id).then(u => { if (u) updatePetState(u); });
  }, []);

  async function loadData() {
    if (!pet) return;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (plus ? 365 : 30));
    const [{ data: p }, { data: h }] = await Promise.all([
      supabase.from('promises').select('*').eq('user_id', pet.user_id).eq('active', true).order('created_at', { ascending: true }),
      supabase.from('completions').select('*').eq('user_id', pet.user_id).gte('date_key', cutoff.toISOString().slice(0, 10)),
    ]);
    if (p) setPromises(p);
    if (h) setHistory(h);
  }

  if (!pet) return null;

  const color = petColor(pet.color_seed);
  const speciesData = SPECIES_LIST.find(s => s.id === pet.species) ?? SPECIES_LIST[0];
  const petEmoji = speciesData.emoji;
  const xpPct = pet.xp / pet.xp_to_next;
  const today = new Date().toISOString().slice(0, 10);
  const todayDoneIds = new Set(history.filter(h => h.date_key === today).map(h => h.promise_id));

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      {showTraits && <TraitAllocator onClose={() => setShowTraits(false)} />}
      {showUpgrade && <UpgradeModal reason={upgradeReason} onClose={() => setShowUpgrade(false)} />}
      {showSpecies && <SpeciesSelector onClose={() => setShowSpecies(false)} />}

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-5 pt-12 pb-8">

        {/* Nav */}
        <div className="flex items-center justify-between mb-8 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <Flame size={12} className="text-orange-400" strokeWidth={1.5} />
            <span className="text-white/70 font-medium">{pet.streak}</span>
            <span>day streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/30 text-xs mr-1">{profile?.username}</span>
            <button onClick={onEgg} className="relative w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <Gift size={15} strokeWidth={1.5} />
              {eggAvailable && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full" />}
            </button>
            <button onClick={onFriends} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <Users size={15} strokeWidth={1.5} />
            </button>
            <button onClick={signOut} className="w-8 h-8 flex items-center justify-center rounded-full text-white/25 hover:text-white/60 transition-colors">
              <LogOut size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Pet — compact */}
        <div className="flex items-center gap-4 mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
          <button onClick={() => setShowSpecies(true)} className="relative shrink-0">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-30 scale-150" style={{ backgroundColor: color }} />
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: color + '18', border: `1px solid ${color}33` }}>
              {petEmoji}
              <span className="absolute -bottom-0.5 -right-0.5 text-white/60"><MoodIcon h={pet.happiness} size={12} /></span>
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <h1 className="font-playfair italic text-white text-xl" style={{ letterSpacing: '-0.03em' }}>{pet.name}</h1>
              {pet.trait_points_available > 0 && (
                <button onClick={() => setShowTraits(true)} className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: '#e8702a33', color: '#e8702a' }}>
                  {pet.trait_points_available} pts
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pet.happiness}%`, backgroundColor: color }} />
                </div>
                <span className="text-white/25 text-[10px] tabular-nums w-10 text-right">{pet.happiness}/100</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-orange-400/60 transition-all duration-700" style={{ width: `${xpPct * 100}%` }} />
                </div>
                <span className="text-white/25 text-[10px] tabular-nums w-10 text-right">Lv {pet.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date */}
        <p className="text-white/25 text-xs mb-5 fade-up" style={{ animationDelay: '0.15s' }}>{todayLabel}</p>

        {/* Category cards */}
        <div className="space-y-3 fade-up" style={{ animationDelay: '0.2s' }}>
          {(Object.entries(CATEGORY_CONFIG) as [GoalCategory, typeof CATEGORY_CONFIG[GoalCategory]][]).map(([cat, cfg]) => {
            const catPromises = promises.filter(p => p.category === cat);
            const doneToday = catPromises.filter(p => todayDoneIds.has(p.id)).length;
            const pct = catPromises.length > 0 ? doneToday / catPromises.length : 0;
            const allDone = catPromises.length > 0 && doneToday === catPromises.length;
            return (
              <button
                key={cat}
                onClick={() => onCategory(cat)}
                className="w-full rounded-2xl px-5 py-4 flex items-center gap-4 transition-all active:scale-[0.98] text-left"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${allDone ? cfg.color + '55' : 'rgba(255,255,255,0.08)'}` }}
              >
                <ProgressRing pct={pct} color={cfg.color} />
                <div className="flex-1">
                  <p className="text-white font-medium text-base">{cfg.label}</p>
                  <p className="text-white/35 text-sm mt-0.5">
                    {catPromises.length === 0 ? cfg.tagline : `${doneToday} of ${catPromises.length} done`}
                  </p>
                </div>
                {allDone
                  ? <cfg.Icon size={16} style={{ color: cfg.color }} strokeWidth={1.5} />
                  : <cfg.Icon size={16} className="text-white/20" strokeWidth={1.5} />
                }
              </button>
            );
          })}
        </div>

        {/* Pro AI check-in — subtle, at the bottom */}
        {pro && (
          <div className="mt-6 fade-up" style={{ animationDelay: '0.3s' }}>
            {/* AiCheckin rendered inline if needed */}
          </div>
        )}
        {!pro && (
          <button
            onClick={() => { setUpgradeReason('AI daily check-ins are a Pro feature'); setShowUpgrade(true); }}
            className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors fade-up"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: '0.3s' }}
          >
            <Sparkles size={14} className="text-white/25 shrink-0" strokeWidth={1.5} />
            <p className="text-white/25 text-xs flex-1 text-left">Upgrade to Pro for daily AI check-ins</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ background: '#e8702a18', color: '#e8702a88' }}>Pro</span>
          </button>
        )}
      </div>
    </>
  );
}
