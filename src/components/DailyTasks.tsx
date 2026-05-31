import { motion } from 'framer-motion';
import { DAILY_TASKS, getTodayKey } from '../data/tasks';
import { CREATURES } from '../data/creatures';
import { usePetStore } from '../store/petStore';

export default function DailyTasks() {
  const { mbtiType, completedTasks, completeTask } = usePetStore();
  if (!mbtiType) return null;

  const creature = CREATURES[mbtiType];
  const todayKey = getTodayKey();
  const todayDone = completedTasks[todayKey] ?? [];
  const allDone = todayDone.length === DAILY_TASKS.length;

  return (
    <div
      className="rounded-2xl border p-5 backdrop-blur"
      style={{
        background: `linear-gradient(135deg, ${creature.glowColor}11, ${creature.glowColor}05)`,
        borderColor: `${creature.glowColor}33`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">Daily Tasks</h3>
        <div className="text-slate-400 text-sm">
          {todayDone.length}/{DAILY_TASKS.length}
          {allDone && ' 🎉'}
        </div>
      </div>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-3 mb-4 rounded-xl"
          style={{ background: `${creature.glowColor}22`, color: creature.accentColor }}
        >
          <div className="text-2xl mb-1">🏆</div>
          <div className="font-bold text-sm">All tasks complete! Amazing!</div>
        </motion.div>
      )}

      <div className="space-y-2">
        {DAILY_TASKS.map(task => {
          const done = todayDone.includes(task.id);
          return (
            <motion.button
              key={task.id}
              onClick={() => !done && completeTask(todayKey, task.id, task.xpReward, task.happinessReward)}
              whileHover={!done ? { x: 4 } : {}}
              whileTap={!done ? { scale: 0.98 } : {}}
              disabled={done}
              className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200"
              style={
                done
                  ? {
                      borderColor: `${creature.glowColor}44`,
                      background: `${creature.glowColor}15`,
                    }
                  : {
                      borderColor: '#334155',
                      background: '#0f172a55',
                    }
              }
            >
              <span className="text-xl">{task.emoji}</span>
              <span
                className="flex-1 text-sm font-medium"
                style={{ color: done ? creature.accentColor : '#94a3b8', textDecoration: done ? 'line-through' : 'none' }}
              >
                {task.label}
              </span>
              {done ? (
                <span className="text-green-400 text-lg">✓</span>
              ) : (
                <span className="text-xs font-bold text-slate-500">+{task.xpReward}XP</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
