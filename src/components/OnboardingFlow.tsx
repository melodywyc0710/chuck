import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

const TRAITS = [
  { id: 'gentle',    emoji: '🌸', label: 'Gentle',    desc: 'Calm and nurturing' },
  { id: 'playful',   emoji: '⚡', label: 'Playful',   desc: 'Energetic and fun' },
  { id: 'focused',   emoji: '🎯', label: 'Focused',   desc: 'Disciplined and sharp' },
  { id: 'creative',  emoji: '🌈', label: 'Creative',  desc: 'Curious and imaginative' },
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
    }, 2000);
  }

  if (step === 'hatching') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee]">
        <div className="text-8xl animate-bounce">🥚</div>
        <p className="mt-6 text-[#9a8070] text-sm animate-pulse">hatching…</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee] px-6 text-center">
        <div className="text-8xl mb-4">🐣</div>
        <h2 className="text-2xl font-bold text-[#4a3728]">{petName || 'Mochi'} hatched!</h2>
        <p className="text-[#9a8070] text-sm mt-2 max-w-xs">
          Your companion is here. Keep your promises and watch them grow.
        </p>
        <button
          onClick={() => refreshPet()}
          className="mt-8 px-8 py-3 bg-[#c07850] text-white rounded-full font-semibold shadow-md"
        >
          Let's go →
        </button>
      </div>
    );
  }

  if (step === 'trait') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee] px-6">
        <h2 className="text-xl font-bold text-[#4a3728] mb-2 text-center">What's their vibe?</h2>
        <p className="text-[#9a8070] text-sm mb-8 text-center">This shapes their personality.</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {TRAITS.map(t => (
            <button
              key={t.id}
              onClick={() => setTrait(t.id)}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                trait === t.id
                  ? 'border-[#c07850] bg-[#fff5ee]'
                  : 'border-[#e8ddd3] bg-white'
              }`}
            >
              <span className="text-3xl mb-1">{t.emoji}</span>
              <span className="text-sm font-semibold text-[#4a3728]">{t.label}</span>
              <span className="text-xs text-[#9a8070] mt-0.5">{t.desc}</span>
            </button>
          ))}
        </div>
        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
        <button
          disabled={!trait}
          onClick={createPet}
          className="mt-8 w-full max-w-xs py-3 bg-[#c07850] text-white rounded-full font-semibold shadow-md disabled:opacity-40"
        >
          Hatch my egg 🥚
        </button>
      </div>
    );
  }

  // step === 'name'
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee] px-6">
      <div className="text-8xl mb-6">🥚</div>
      <h2 className="text-xl font-bold text-[#4a3728] mb-2">You found an egg!</h2>
      <p className="text-[#9a8070] text-sm mb-8 text-center max-w-xs">
        Give your companion a name, then discover their personality.
      </p>
      <input
        type="text"
        placeholder="Name your companion…"
        value={petName}
        onChange={e => setPetName(e.target.value)}
        maxLength={20}
        className="w-full max-w-xs px-4 py-3 rounded-2xl bg-white border border-[#e8ddd3] text-[#4a3728] placeholder-[#bca99a] text-sm outline-none focus:border-[#c07850] text-center"
      />
      <button
        onClick={() => setStep('trait')}
        className="mt-6 w-full max-w-xs py-3 bg-[#c07850] text-white rounded-full font-semibold shadow-md"
      >
        Next →
      </button>
    </div>
  );
}
