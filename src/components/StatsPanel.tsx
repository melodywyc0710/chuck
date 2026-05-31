import { motion } from 'framer-motion';
import { CREATURES } from '../data/creatures';
import { usePetStore } from '../store/petStore';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
}

function StatBar({ label, value, max, color, icon }: StatBarProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <span>{icon}</span> {label}
        </span>
        <span className="text-slate-400 tabular-nums">{Math.round(value)}/{max}</span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: color, width: `${pct}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="shimmer-bg absolute inset-0" />
        </motion.div>
      </div>
    </div>
  );
}

export default function StatsPanel() {
  const { mbtiType, level, xp, xpToNext, hp, maxHp, happiness } = usePetStore();
  if (!mbtiType) return null;
  const creature = CREATURES[mbtiType];

  return (
    <div
      className="rounded-2xl border p-5 space-y-4 backdrop-blur"
      style={{
        background: `linear-gradient(135deg, ${creature.glowColor}11, ${creature.glowColor}05)`,
        borderColor: `${creature.glowColor}33`,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Stats</h3>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: creature.glowColor + '33', color: creature.accentColor }}
        >
          Level {level}
        </div>
      </div>

      <StatBar label="HP" value={hp} max={maxHp} color="#f87171" icon="❤️" />
      <StatBar label="Happiness" value={happiness} max={100} color={creature.glowColor} icon="✨" />

      {/* XP bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span>⚡</span> Experience
          </span>
          <span className="text-slate-400 tabular-nums">{Math.round(xp)}/{xpToNext} XP</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ backgroundColor: creature.accentColor, width: `${(xp / xpToNext) * 100}%` }}
            animate={{ width: `${(xp / xpToNext) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="shimmer-bg absolute inset-0" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
