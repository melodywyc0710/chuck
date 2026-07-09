import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

const TRAITS = [
  { id: 'gentle',   emoji: '🌸', label: 'Gentle',   desc: 'Calm and nurturing' },
  { id: 'playful',  emoji: '⚡', label: 'Playful',  desc: 'Energetic and fun' },
  { id: 'focused',  emoji: '🎯', label: 'Focused',  desc: 'Disciplined and sharp' },
  { id: 'creative', emoji: '🌈', label: 'Creative', desc: 'Curious and imaginative' },
];

export default function OnboardingFlow() {
  const [step, setStep] = useState<'name' | 'trait' | 'hatching' | 'done'>('name');
  const [petName, setPetName] = useState('');
  const [trait, setTrait] = useState('');
  const [error, setError] = useState('');

  const user = useAuthStore(s => s.user);
  const refreshPet = useAuthStore(s => s.refreshPet);

  async function createPet() {
    if (!user) return;
    const colorSeed = Math.floor(Math.random() * 360);
    const { error: err } = await supabase.from('pets').insert({
      user_id: user.id,
      name: petName.trim() || 'Mochi',
      species: 'fluffkin',
      color_seed: colorSeed,
      personality_trait: trait,
      hatched: false,
    });
    if (err) { setError(err.message); return; }
    setStep('hatching');
    setTimeout(async () => {
      await supabase.from('pets').update({ hatched: true }).eq('user_id', user.id);
      await refreshPet();
      setStep('done');
    }, 2400);
  }

  if (step === 'hatching') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e0c0a]">
        <div className="relative">
          <div className="text-8xl" style={{ animation: 'eggShake 0.4s ease-in-out infinite' }}>🥚</div>
          <div className="absolute inset-0 rounded-full bg-[#e8702a]/20 blur-2xl scale-150 animate-pulse" />
        </div>
        <p className="mt-8 text-white/40 text-sm tracking-widest uppercase" style={{ animation: 'fadeIn 0.5s ease forwards' }}>
          hatching…
        </p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e0c0a] px-6 text-center tracking-[-0.02em]">
        <div className="text-8xl mb-6 hero-anim hero-reveal" style={{ animationDelay: '0s', opacity: 0 }}>🐣</div>
        <h2
          className="font-playfair italic text-white text-4xl mb-3 hero-anim hero-reveal"
          style={{ letterSpacing: '-0.04em', animationDelay: '0.15s', opacity: 0 }}
        >
          {petName || 'Mochi'} hatched!
        </h2>
        <p className="text-white/40 text-sm max-w-xs leading-relaxed hero-anim hero-fade" style={{ animationDelay: '0.3s', opacity: 0 }}>
          Your companion is here. Keep your promises and watch them grow.
        </p>
        <button
          onClick={() => refreshPet()}
          className="mt-10 px-8 py-3.5 bg-[#e8702a] hover:bg-[#d2611f] text-white rounded-full font-semibold text-sm shadow-lg shadow-[#e8702a]/25 transition-all hover:scale-[1.03] active:scale-95 hero-anim hero-fade"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          Let's go →
        </button>
      </div>
    );
  }

  if (step === 'trait') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e0c0a] px-6 tracking-[-0.02em]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,130,80,0.10)_0%,transparent_60%)] pointer-events-none" />

        <div className="text-center mb-10 hero-anim hero-reveal" style={{ animationDelay: '0s', opacity: 0 }}>
          <h2 className="font-playfair italic text-white text-4xl mb-2" style={{ letterSpacing: '-0.04em' }}>
            What's their vibe?
          </h2>
          <p className="text-white/40 text-sm">This shapes {petName || 'your companion'}'s personality.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs hero-anim hero-fade" style={{ animationDelay: '0.2s', opacity: 0 }}>
          {TRAITS.map(t => (
            <button
              key={t.id}
              onClick={() => setTrait(t.id)}
              className={`flex flex-col items-center p-5 rounded-2xl border transition-all duration-200 ${
                trait === t.id
                  ? 'border-[#e8702a]/60 bg-[#e8702a]/10'
                  : 'border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20'
              }`}
            >
              <span className="text-3xl mb-2">{t.emoji}</span>
              <span className="text-sm font-semibold text-white">{t.label}</span>
              <span className="text-xs text-white/40 mt-0.5">{t.desc}</span>
            </button>
          ))}
        </div>

        {error && <p className="text-red-400/80 text-xs mt-4">{error}</p>}

        <button
          disabled={!trait}
          onClick={createPet}
          className="mt-8 w-full max-w-xs py-3.5 bg-[#e8702a] hover:bg-[#d2611f] text-white rounded-full font-semibold text-sm shadow-lg shadow-[#e8702a]/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 hero-anim hero-fade"
          style={{ animationDelay: '0.35s', opacity: 0 }}
        >
          Hatch my egg 🥚
        </button>
      </div>
    );
  }

  // step === 'name'
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e0c0a] px-6 tracking-[-0.02em]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(200,130,80,0.10)_0%,transparent_60%)] pointer-events-none" />

      <div className="text-7xl mb-8 hero-anim hero-reveal" style={{ animationDelay: '0s', opacity: 0 }}>🥚</div>

      <div className="text-center mb-10 hero-anim hero-reveal" style={{ animationDelay: '0.15s', opacity: 0 }}>
        <h2 className="font-playfair italic text-white text-4xl mb-2" style={{ letterSpacing: '-0.04em' }}>
          You found an egg!
        </h2>
        <p className="text-white/40 text-sm max-w-xs leading-relaxed">
          Give your companion a name, then discover their personality.
        </p>
      </div>

      <input
        type="text"
        placeholder="Name your companion…"
        value={petName}
        onChange={e => setPetName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && setStep('trait')}
        maxLength={20}
        className="w-full max-w-xs px-4 py-3.5 rounded-2xl bg-white/6 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-[#e8a87c]/60 focus:bg-white/8 transition-all text-center hero-anim hero-fade"
        style={{ animationDelay: '0.3s', opacity: 0 }}
      />

      <button
        onClick={() => setStep('trait')}
        className="mt-4 w-full max-w-xs py-3.5 bg-[#e8702a] hover:bg-[#d2611f] text-white rounded-full font-semibold text-sm shadow-lg shadow-[#e8702a]/25 transition-all hover:scale-[1.02] active:scale-95 hero-anim hero-fade"
        style={{ animationDelay: '0.42s', opacity: 0 }}
      >
        Next →
      </button>
    </div>
  );
}
