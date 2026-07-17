import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

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

function generateMessage(name: string, happiness: number, streak: number, level: number): string {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (happiness >= 80 && streak >= 7) {
    return `${greeting}! I've been thinking about how far we've come together — ${streak} days in a row 🌟 I'm so full of energy right now. Let's keep this going today, okay?`;
  }
  if (happiness >= 80 && streak >= 3) {
    return `${greeting}! I woke up feeling amazing today. ${streak} days strong and I can feel it! Level ${level} suits us well. One more great day?`;
  }
  if (happiness >= 80) {
    return `${greeting}! I'm in such a good mood today 💛 Even small wins count — let's make today one of them.`;
  }
  if (happiness >= 60 && streak >= 3) {
    return `${greeting}. ${streak} days going — that's real commitment. I noticed and I appreciate it. Ready when you are today.`;
  }
  if (happiness >= 60) {
    return `${greeting}. I'm doing okay, but I know we can both do better. No pressure — just one promise today is enough.`;
  }
  if (happiness >= 40) {
    return `${greeting}… I've been a little quiet lately. I miss seeing you check things off. Even just one today would mean a lot to me.`;
  }
  return `${greeting}. I won't lie — I've been feeling down. But I know you're still here, and that matters. Come back to me today? 🥺`;
}

interface Props {
  petEmoji: string;
  color: string;
}

export default function AiCheckin({ petEmoji, color }: Props) {
  const pet = useAuthStore(s => s.pet);
  const [message, setMessage] = useState<string | null>(null);
  const cacheKey = `nagi_checkin_${pet?.user_id}_${todayKey()}`;

  useEffect(() => {
    if (!pet) return;
    const cached = localStorage.getItem(cacheKey);
    if (cached) { setMessage(cached); return; }
    const msg = generateMessage(pet.name, pet.happiness, pet.streak, pet.level);
    setMessage(msg);
    localStorage.setItem(cacheKey, msg);
  }, []);

  return (
    <div className="liquid-glass rounded-2xl px-4 py-4 fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg" style={{ background: color + '22' }}>
          {petEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-[10px] mb-1">morning check-in</p>
          <p className="text-white/80 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
