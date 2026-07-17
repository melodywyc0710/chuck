import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function topTrait(pet: { trait_strength: number; trait_intelligence: number; trait_agility: number; trait_speed: number }) {
  const traits = [
    { name: 'strength', val: pet.trait_strength },
    { name: 'intelligence', val: pet.trait_intelligence },
    { name: 'agility', val: pet.trait_agility },
    { name: 'speed', val: pet.trait_speed },
  ];
  return traits.sort((a, b) => b.val - a.val)[0].name;
}

function moodFromHappiness(h: number) {
  if (h >= 80) return 'excited';
  if (h >= 60) return 'happy';
  if (h >= 40) return 'neutral';
  return 'sad';
}

interface Props {
  petEmoji: string;
  color: string;
}

export default function AiCheckin({ petEmoji, color }: Props) {
  const pet = useAuthStore(s => s.pet);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cacheKey = `nagi_checkin_${pet?.user_id}_${todayKey()}`;

  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) { setMessage(cached); return; }
    fetchCheckin();
  }, []);

  async function fetchCheckin() {
    if (!pet) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-checkin`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          petName: pet.name,
          happiness: pet.happiness,
          streak: pet.streak,
          level: pet.level,
          mood: moodFromHappiness(pet.happiness),
          traitTop: topTrait(pet),
        }),
      });
      const json = await res.json();
      const msg = json.message ?? "I'm here for you today 💛";
      setMessage(msg);
      localStorage.setItem(cacheKey, msg);
    } catch {
      setMessage("I'm here for you today 💛");
    }
    setLoading(false);
  }

  return (
    <div className="liquid-glass rounded-2xl px-4 py-4 fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg" style={{ background: color + '22' }}>
          {petEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-[10px] mb-1">morning check-in</p>
          {loading
            ? <div className="flex gap-1 items-center mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            : <p className="text-white/80 text-sm leading-relaxed">{message}</p>
          }
        </div>
      </div>
    </div>
  );
}
