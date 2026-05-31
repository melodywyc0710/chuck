import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CREATURES } from '../data/creatures';
import { usePetStore } from '../store/petStore';

interface ActionButtonProps {
  emoji: string;
  label: string;
  xpGain: string;
  cooldownEnd: number;
  onClick: () => void;
  accentColor: string;
  glowColor: string;
  disabled?: boolean;
}

function CooldownButton({ emoji, label, xpGain, cooldownEnd, onClick, accentColor, glowColor, disabled }: ActionButtonProps) {
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
      whileHover={!onCooldown && !disabled ? { scale: 1.06, y: -2 } : {}}
      whileTap={!onCooldown && !disabled ? { scale: 0.94 } : {}}
      onClick={() => { if (!onCooldown && !disabled) onClick(); }}
      disabled={onCooldown || disabled}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden"
      style={
        onCooldown || disabled
          ? { borderColor: '#334155', background: '#0f172a', opacity: 0.5 }
          : {
              borderColor: `${glowColor}55`,
              background: `linear-gradient(135deg, ${glowColor}22, ${glowColor}08)`,
              boxShadow: `0 4px 20px ${glowColor}22`,
            }
      }
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-semibold text-white">{label}</span>
      {onCooldown ? (
        <span className="text-xs text-slate-500">{secs}s</span>
      ) : (
        <span className="text-xs font-bold" style={{ color: accentColor }}>+{xpGain} XP</span>
      )}
    </motion.button>
  );
}

export default function InteractionPanel() {
  const {
    mbtiType, feed, play, rest,
    feedCooldown, playCooldown, restCooldown,
  } = usePetStore();

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
      <h3 className="text-white font-bold text-lg mb-4">Interactions</h3>
      <div className="grid grid-cols-3 gap-3">
        <CooldownButton
          emoji="🍖"
          label="Feed"
          xpGain="15"
          cooldownEnd={feedCooldown}
          onClick={feed}
          accentColor={creature.accentColor}
          glowColor="#f87171"
        />
        <CooldownButton
          emoji="⚔️"
          label="Play"
          xpGain="30"
          cooldownEnd={playCooldown}
          onClick={play}
          accentColor={creature.accentColor}
          glowColor={creature.glowColor}
        />
        <CooldownButton
          emoji="🌙"
          label="Rest"
          xpGain="10"
          cooldownEnd={restCooldown}
          onClick={rest}
          accentColor={creature.accentColor}
          glowColor="#818cf8"
        />
      </div>
      <p className="text-slate-500 text-xs text-center mt-3">
        {creature.name} loves {creature.favoriteActivity === 'feed' ? '🍖 feeding' : creature.favoriteActivity === 'play' ? '⚔️ playing' : '🌙 resting'}!
      </p>
    </div>
  );
}
