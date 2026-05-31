import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CREATURES } from '../data/creatures';
import { usePetStore, type CustomGoal } from '../store/petStore';

const XP_TIERS = [
  { value: 20, label: 'Small', color: '#94a3b8', description: 'Quick & easy' },
  { value: 40, label: 'Medium', color: '#a78bfa', description: 'Takes some effort' },
  { value: 80, label: 'Big', color: '#f59e0b', description: 'A real achievement' },
];

const SUGGESTED_EMOJIS = ['🏃', '📚', '💧', '🧘', '🍎', '😴', '🎨', '📝', '🤝', '🌿', '💪', '🎵', '🧹', '🌅', '🐾'];

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function AddGoalForm({ onDone, glowColor, accentColor }: { onDone: () => void; glowColor: string; accentColor: string }) {
  const addGoal = usePetStore(s => s.addGoal);
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [xpReward, setXpReward] = useState<20 | 40 | 80>(40);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const submit = () => {
    if (!label.trim()) return;
    addGoal({ label: label.trim(), emoji, xpReward });
    onDone();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl border p-4 space-y-3 mb-3"
      style={{ borderColor: `${glowColor}44`, background: `${glowColor}0a` }}
    >
      <p className="text-slate-300 text-sm font-semibold">New Goal</p>

      {/* Emoji picker */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEmojiPicker(v => !v)}
          className="text-2xl p-2 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors bg-slate-900"
        >
          {emoji}
        </button>
        {showEmojiPicker && (
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-slate-700 bg-slate-900">
            {SUGGESTED_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => { setEmoji(e); setShowEmojiPicker(false); }}
                className="text-xl hover:scale-125 transition-transform"
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Label */}
      <input
        type="text"
        value={label}
        onChange={e => setLabel(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="What's your goal today?"
        maxLength={60}
        autoFocus
        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
      />

      {/* XP tier */}
      <div>
        <p className="text-slate-500 text-xs mb-2">How big is this goal?</p>
        <div className="grid grid-cols-3 gap-2">
          {XP_TIERS.map(tier => (
            <button
              key={tier.value}
              onClick={() => setXpReward(tier.value as 20 | 40 | 80)}
              className="py-2 px-3 rounded-xl border text-xs text-center transition-all"
              style={
                xpReward === tier.value
                  ? { borderColor: tier.color, background: tier.color + '22', color: tier.color }
                  : { borderColor: '#334155', color: '#64748b' }
              }
            >
              <div className="font-bold">{tier.label}</div>
              <div className="opacity-70">+{tier.value} XP</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          disabled={!label.trim()}
          className="flex-1 py-2 rounded-xl font-bold text-sm text-slate-900 disabled:opacity-40 transition-opacity"
          style={{ background: label.trim() ? accentColor : '#334155' }}
        >
          Add Goal ✓
        </motion.button>
        <button
          onClick={onDone}
          className="px-4 py-2 rounded-xl border border-slate-700 text-slate-500 text-sm hover:text-slate-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

function GoalItem({ goal, done, onComplete, onRemove, accentColor, glowColor }: {
  goal: CustomGoal;
  done: boolean;
  onComplete: () => void;
  onRemove: () => void;
  accentColor: string;
  glowColor: string;
}) {
  const tier = XP_TIERS.find(t => t.value === goal.xpReward) ?? XP_TIERS[1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group"
      style={
        done
          ? { borderColor: `${glowColor}44`, background: `${glowColor}12` }
          : { borderColor: '#1e293b', background: '#0f172a66' }
      }
    >
      {/* Complete button */}
      <motion.button
        whileHover={!done ? { scale: 1.15 } : {}}
        whileTap={!done ? { scale: 0.9 } : {}}
        onClick={() => !done && onComplete()}
        disabled={done}
        className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
        style={
          done
            ? { borderColor: accentColor, background: accentColor }
            : { borderColor: '#475569' }
        }
      >
        {done && <span className="text-slate-900 text-sm font-black">✓</span>}
      </motion.button>

      <span className="text-xl flex-shrink-0">{goal.emoji}</span>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{
            color: done ? accentColor : '#cbd5e1',
            textDecoration: done ? 'line-through' : 'none',
            opacity: done ? 0.7 : 1,
          }}
        >
          {goal.label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: done ? accentColor + '88' : tier.color + 'aa' }}>
          {done ? `+${goal.xpReward} XP earned!` : `${tier.label} · +${goal.xpReward} XP`}
        </p>
      </div>

      {/* Delete (only when not done, shown on hover) */}
      {!done && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all text-lg leading-none"
          title="Remove goal"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

export default function GoalsPanel() {
  const { mbtiType, goals, completedGoals, completeGoal, removeGoal } = usePetStore();
  const [showForm, setShowForm] = useState(false);
  if (!mbtiType) return null;

  const creature = CREATURES[mbtiType];
  const todayKey = getTodayKey();
  const todayDone = completedGoals[todayKey] ?? [];
  const doneCount = goals.filter(g => todayDone.includes(g.id)).length;
  const allDone = goals.length > 0 && doneCount === goals.length;

  return (
    <div
      className="rounded-2xl border p-5 backdrop-blur"
      style={{
        background: `linear-gradient(135deg, ${creature.glowColor}11, ${creature.glowColor}05)`,
        borderColor: `${creature.glowColor}33`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">My Goals</h3>
          <p className="text-slate-500 text-xs mt-0.5">Your personal daily achievements</p>
        </div>
        <div className="flex items-center gap-3">
          {goals.length > 0 && (
            <span className="text-slate-400 text-sm">
              {doneCount}/{goals.length} {allDone ? '🎉' : ''}
            </span>
          )}
          {!showForm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
              style={{ borderColor: `${creature.glowColor}55`, color: creature.accentColor, background: `${creature.glowColor}18` }}
            >
              + Add Goal
            </motion.button>
          )}
        </div>
      </div>

      {/* All done celebration */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4 mb-4 rounded-2xl"
            style={{ background: `${creature.glowColor}20`, border: `1px solid ${creature.glowColor}44` }}
          >
            <div className="text-3xl mb-1">🏆</div>
            <div className="font-bold text-sm" style={{ color: creature.accentColor }}>
              You crushed all your goals today!
            </div>
            <div className="text-slate-400 text-xs mt-1">
              {creature.name} is so proud of you ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add goal form */}
      <AnimatePresence>
        {showForm && (
          <AddGoalForm
            onDone={() => setShowForm(false)}
            glowColor={creature.glowColor}
            accentColor={creature.accentColor}
          />
        )}
      </AnimatePresence>

      {/* Goal list */}
      <div className="space-y-2">
        <AnimatePresence>
          {goals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              done={todayDone.includes(goal.id)}
              onComplete={() => completeGoal(todayKey, goal.id, goal.xpReward)}
              onRemove={() => removeGoal(goal.id)}
              accentColor={creature.accentColor}
              glowColor={creature.glowColor}
            />
          ))}
        </AnimatePresence>

        {goals.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-slate-600"
          >
            <div className="text-4xl mb-2">🌱</div>
            <p className="text-sm">No goals yet. Add one to get started!</p>
          </motion.div>
        )}
      </div>

      {/* Encouragement footer */}
      {goals.length > 0 && !allDone && (
        <p className="text-slate-600 text-xs text-center mt-4">
          Every goal you complete makes {creature.name} happier 💫
        </p>
      )}
    </div>
  );
}
