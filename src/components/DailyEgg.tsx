import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

type Rarity = 'common' | 'rare' | 'epic';

interface Reward {
  type: 'xp' | 'streak_freeze' | 'happiness' | 'costume';
  rarity: Rarity;
  label: string;
  emoji: string;
  value?: number | string;
}

const REWARD_POOL: Reward[] = [
  { type: 'xp',           rarity: 'common', label: '+30 XP boost',       emoji: '⚡', value: 30 },
  { type: 'xp',           rarity: 'common', label: '+50 XP boost',       emoji: '⚡', value: 50 },
  { type: 'happiness',    rarity: 'common', label: '+15 happiness',       emoji: '💛', value: 15 },
  { type: 'happiness',    rarity: 'rare',   label: '+30 happiness',       emoji: '💛', value: 30 },
  { type: 'streak_freeze',rarity: 'rare',   label: 'Streak freeze',       emoji: '🧊', value: 1  },
  { type: 'streak_freeze',rarity: 'epic',   label: '3× streak freeze',    emoji: '🧊', value: 3  },
  { type: 'costume',      rarity: 'rare',   label: 'Sunny hat 🎩',        emoji: '🎩', value: 'hat_sunny' },
  { type: 'costume',      rarity: 'epic',   label: 'Rainbow cape 🌈',     emoji: '🌈', value: 'cape_rainbow' },
  { type: 'costume',      rarity: 'epic',   label: 'Star crown ⭐',       emoji: '⭐', value: 'crown_star' },
];

const RARITY_WEIGHTS = { common: 60, rare: 30, epic: 10 };

const RARITY_COLOR: Record<Rarity, string> = {
  common: 'rgba(180,180,200,0.25)',
  rare:   'rgba(80,140,255,0.30)',
  epic:   'rgba(200,80,255,0.35)',
};
const RARITY_GLOW: Record<Rarity, string> = {
  common: 'rgba(200,200,220,0.3)',
  rare:   'rgba(80,140,255,0.5)',
  epic:   'rgba(200,80,255,0.6)',
};
const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Common', rare: 'Rare', epic: 'Epic',
};

function pickReward(): Reward {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  let rarity: Rarity = 'common';
  for (const [key, weight] of Object.entries(RARITY_WEIGHTS)) {
    r -= weight;
    if (r <= 0) { rarity = key as Rarity; break; }
  }
  const pool = REWARD_POOL.filter(x => x.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

type Phase = 'idle' | 'shaking' | 'cracking' | 'reveal';

interface Props {
  onClose: () => void;
}

const EGG_IMAGES: Record<string, string> = {
  melmel: '/eggs/egg-melmel.png',
  lolo:   '/eggs/egg-lolo.png',
  didi:   '/eggs/egg-didi.png',
  chacha: '/eggs/egg-chacha.png',
  kiki:   '/eggs/egg-kiki.png',
};

export default function DailyEgg({ onClose }: Props) {
  const pet = useAuthStore(s => s.pet);
  const user = useAuthStore(s => s.user);
  const setPetLocal = useAuthStore(s => s.setPetLocal);

  const [phase, setPhase] = useState<Phase>('idle');
  const [reward, setReward] = useState<Reward | null>(null);
  const [alreadyOpened, setAlreadyOpened] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Check localStorage for today's egg
    const key = `nagi_egg_${user?.id}_${todayKey()}`;
    if (localStorage.getItem(key)) setAlreadyOpened(true);
  }, []);

  async function tapEgg() {
    if (phase !== 'idle' || alreadyOpened) return;
    setPhase('shaking');
    await delay(600);
    setPhase('cracking');
    await delay(700);
    const r = pickReward();
    setReward(r);
    setPhase('reveal');
    // Mark as opened
    const key = `nagi_egg_${user?.id}_${todayKey()}`;
    localStorage.setItem(key, '1');
    setAlreadyOpened(true);
    // Apply reward
    await applyReward(r);
  }

  async function applyReward(r: Reward) {
    if (!pet || !user) return;
    const updates: Record<string, unknown> = {};

    if (r.type === 'xp') {
      let newXp = pet.xp + (r.value as number);
      let newLevel = pet.level;
      let newXpToNext = pet.xp_to_next;
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.round(newXpToNext * 1.3);
      }
      updates.xp = newXp;
      updates.level = newLevel;
      updates.xp_to_next = newXpToNext;
    }
    if (r.type === 'happiness') {
      updates.happiness = Math.min(100, pet.happiness + (r.value as number));
    }
    if (r.type === 'streak_freeze') {
      updates.streak_freeze_count = pet.streak_freeze_count + (r.value as number);
    }
    if (r.type === 'costume') {
      const costume = r.value as string;
      const already = pet.unlocked_costumes.includes(costume);
      if (!already) {
        updates.unlocked_costumes = [...pet.unlocked_costumes, costume];
      }
    }

    if (Object.keys(updates).length > 0) {
      const { data } = await supabase
        .from('pets')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      if (data) setPetLocal(data);
    }
    setApplied(true);
  }

  const eggStyle = {
    idle:     { transform: 'scale(1) rotate(0deg)' },
    shaking:  { animation: 'eggShake 0.15s ease-in-out infinite' },
    cracking: { transform: 'scale(1.15)', filter: 'brightness(1.4)' },
    reveal:   { transform: 'scale(0) rotate(20deg)', opacity: 0 },
  }[phase];

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

        {/* Nav row */}
        <div className="flex items-center justify-between w-full mb-10 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="liquid-glass inline-flex items-center gap-2 px-3 py-2.5 rounded-full">
            <span className="text-xs">🥚</span>
            <span className="text-white/90 text-xs font-medium">Daily Egg</span>
          </div>
          <button
            onClick={onClose}
            className="liquid-glass w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white/80 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Header */}
        <div className="mb-10 fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-playfair italic text-white text-3xl leading-tight" style={{ letterSpacing: '-0.04em' }}>
            {alreadyOpened && phase !== 'reveal'
              ? "Come back\ntomorrow"
              : phase === 'reveal'
              ? "You got something!"
              : "Your daily\negg is here"}
          </h1>
          {!alreadyOpened && phase === 'idle' && (
            <p className="text-white/40 text-sm mt-2">Tap to crack it open</p>
          )}
          {alreadyOpened && phase !== 'reveal' && (
            <p className="text-white/40 text-sm mt-2">New egg resets at midnight</p>
          )}
        </div>

        {/* Egg / Reward */}
        <div className="flex flex-col items-center fade-up" style={{ animationDelay: '0.25s' }}>
          {phase !== 'reveal' ? (
            <button
              onClick={tapEgg}
              disabled={alreadyOpened}
              className="relative focus:outline-none"
              style={{ transition: 'transform 0.3s, opacity 0.3s', ...eggStyle }}
            >
              {/* Glow behind egg */}
              <div
                className="absolute inset-0 rounded-full blur-3xl scale-150"
                style={{ background: 'radial-gradient(ellipse at center, rgba(220,200,80,0.4) 0%, transparent 70%)' }}
              />
              {phase === 'cracking' ? (
                <span className="relative text-9xl select-none" style={{ display: 'block' }}>🪺</span>
              ) : EGG_IMAGES[pet?.species ?? ''] ? (
                <img
                  src={EGG_IMAGES[pet?.species ?? '']}
                  alt="Daily egg"
                  className="relative w-48 h-48 object-contain select-none"
                  style={{ mixBlendMode: 'multiply' }}
                />
              ) : (
                <span className="relative text-9xl select-none" style={{ display: 'block' }}>🥚</span>
              )}
            </button>
          ) : reward ? (
            <div className="flex flex-col items-center">
              {/* Reward glow */}
              <div
                className="relative flex items-center justify-center w-32 h-32 rounded-full mb-6"
                style={{
                  background: RARITY_COLOR[reward.rarity],
                  boxShadow: `0 0 60px ${RARITY_GLOW[reward.rarity]}`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-60 scale-150"
                  style={{ background: RARITY_GLOW[reward.rarity] }}
                />
                <span className="relative text-6xl">{reward.emoji}</span>
              </div>

              {/* Rarity badge */}
              <div
                className="liquid-glass px-4 py-1.5 rounded-full mb-3"
                style={{ background: RARITY_COLOR[reward.rarity] }}
              >
                <span className="text-white text-xs font-semibold tracking-widest uppercase">
                  {RARITY_LABEL[reward.rarity]}
                </span>
              </div>

              <h2 className="font-playfair italic text-white text-2xl mb-1" style={{ letterSpacing: '-0.03em' }}>
                {reward.label}
              </h2>
              <p className="text-white/40 text-sm">
                {reward.type === 'costume'
                  ? applied ? 'Added to your wardrobe!' : 'You already have this one.'
                  : applied ? 'Applied to your pet ✓' : ''}
              </p>
            </div>
          ) : null}
        </div>

        {/* Rarity odds */}
        {phase === 'idle' && !alreadyOpened && (
          <div className="mt-10 flex gap-4 fade-up" style={{ animationDelay: '0.5s' }}>
            {(Object.entries(RARITY_WEIGHTS) as [Rarity, number][]).map(([r, w]) => (
              <div key={r} className="liquid-glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: RARITY_GLOW[r] }} />
                <span className="text-white/50 text-xs">{RARITY_LABEL[r]} {w}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Done button after reveal */}
        {phase === 'reveal' && (
          <button
            onClick={onClose}
            className="mt-10 px-8 py-3.5 liquid-glass text-white rounded-full font-medium text-sm transition-all hover:bg-white/10 active:scale-95 fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            Sweet, thanks →
          </button>
        )}
      </div>
    </>
  );
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
