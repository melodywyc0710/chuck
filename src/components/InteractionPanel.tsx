import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CREATURES } from '../data/creatures';
import { usePetStore } from '../store/petStore';

interface ActionButtonProps {
  emoji: string;
  label: string;
  description: string;
  xpGain: number;
  happinessGain: number;
  cooldownEnd: number;
  onClick: () => void;
  glowColor: string;
  accentColor: string;
}

function ActionButton({ emoji, label, description, xpGain, happinessGain, cooldownEnd, onClick, glowColor, accentColor }: ActionButtonProps) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, cooldownEnd - now);
  const onCooldown = remaining > 0;
  const secs = Math.ceil(remaining / 1000);

  return (
    <motion.button
      whileHover={!onCooldown ? { scale: 1.05, y: -2 } : {}}
      whileTap={!onCooldown ? { scale: 0.95 } : {}}
      onClick={() => { if (!onCooldown) onClick(); }}
      disabled={onCooldown}
      className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border transition-all duration-200 text-center"
      style={
        onCooldown
          ? { borderColor: '#1e293b', background: '#0f172a88', opacity: 0.45 }
          : {
              borderColor: `${glowColor}55`,
              background: `linear-gradient(135deg, ${glowColor}20, ${glowColor}08)`,
              boxShadow: `0 4px 20px ${glowColor}20`,
            }
      }
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-semibold text-white">{label}</span>
      <span className="text-xs text-slate-500 leading-tight">{description}</span>
      {onCooldown ? (
        <span className="text-xs text-slate-600 mt-0.5">back in {secs}s</span>
      ) : (
        <div className="flex gap-2 mt-0.5">
          <span className="text-xs font-bold" style={{ color: accentColor }}>+{xpGain} XP</span>
          <span className="text-xs text-pink-400">+{happinessGain} 😊</span>
        </div>
      )}
    </motion.button>
  );
}

export default function InteractionPanel() {
  const { mbtiType, feed, play, rest, feedCooldown, playCooldown, restCooldown } = usePetStore();
  if (!mbtiType) return null;
  const creature = CREATURES[mbtiType];

  return (
    <div
      className="rounded-2xl border p-5 backdrop-blur"
      style={{
        background: `linear-gradient(135deg, ${creature.glowColor}11, ${creature.glowColor}05)`,
        borderColor: `${creature.glowColor}33`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">Care</h3>
        <span className="text-slate-500 text-xs">All actions give happiness</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <ActionButton
          emoji="🍓" label="Feed" description="Nourish your pet"
          xpGain={15} happinessGain={8}
          cooldownEnd={feedCooldown} onClick={feed}
          glowColor="#f87171" accentColor={creature.accentColor}
        />
        <ActionButton
          emoji="🎮" label="Play" description="Have fun together"
          xpGain={30} happinessGain={20}
          cooldownEnd={playCooldown} onClick={play}
          glowColor={creature.glowColor} accentColor={creature.accentColor}
        />
        <ActionButton
          emoji="🌙" label="Rest" description="Recharge gently"
          xpGain={10} happinessGain={12}
          cooldownEnd={restCooldown} onClick={rest}
          glowColor="#818cf8" accentColor={creature.accentColor}
        />
      </div>
    </div>
  );
}
