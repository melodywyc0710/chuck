import { motion } from 'framer-motion';
import { useAppStore, type Subject } from '../store/appStore';
import { englishSession } from '../data/english-session';
import { mathsSession } from '../data/maths-session';

const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };
const THEME_COLOR = { purple: '#6366f1', blue: '#3b82f6', green: '#10b981', orange: '#f59e0b' };

const sessions = { english: englishSession, maths: mathsSession };

interface NodeProps {
  index: number;
  session: typeof englishSession;
  completed: boolean;
  current: boolean;
  locked: boolean;
  onStart: () => void;
  themeColor: string;
}

function PathNode({ index, session, completed, current, locked, onStart, themeColor }: NodeProps) {
  const offset = index % 2 === 0 ? 'ml-8' : 'mr-8 self-end';
  return (
    <div className={`flex flex-col items-center ${offset}`}>
      <motion.button
        whileHover={!locked ? { scale: 1.08 } : {}}
        whileTap={!locked ? { scale: 0.95 } : {}}
        onClick={() => !locked && onStart()}
        disabled={locked}
        className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 transition-all"
        style={
          completed
            ? { background: themeColor, borderColor: themeColor, color: 'white' }
            : current
            ? { background: '#f59e0b', borderColor: '#d97706', color: 'white', boxShadow: `0 0 0 0 ${themeColor}66` }
            : { background: '#e5e7eb', borderColor: '#d1d5db', color: '#9ca3af' }
        }
        animate={current ? { boxShadow: ['0 0 0 0 rgba(245,158,11,0.5)', '0 0 0 16px rgba(245,158,11,0)'] } : {}}
        transition={current ? { duration: 1.5, repeat: Infinity } : {}}
      >
        {completed ? '⭐' : locked ? '🔒' : session.icon}
        {current && (
          <motion.div
            className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-0.5 rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            GO!
          </motion.div>
        )}
      </motion.button>
      <div className={`mt-2 text-center max-w-24 ${locked ? 'opacity-40' : ''}`}>
        <div className="text-xs font-bold text-gray-700 leading-tight">{session.title.split(':')[0]}</div>
        {completed && <div className="text-xs text-green-600 font-semibold">✓ Done</div>}
      </div>
    </div>
  );
}

export default function Home() {
  const { profile, activeSubject, setActiveSubject, startSession, completedSessions, totalStars, setView } = useAppStore();
  if (!profile) return null;

  const themeColor = THEME_COLOR[profile.colorTheme];
  const subjects: Subject[] = ['english', 'maths'];
  const session = sessions[activeSubject];
  const isCompleted = completedSessions.includes(session.id);

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${themeColor}11, #f0f4ff)` }}>
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{MASCOT_EMOJI[profile.mascot]}</span>
            <div>
              <div className="font-black text-gray-800 text-sm leading-none">Hi, {profile.name}! 👋</div>
              <div className="text-xs text-gray-400">Year 4 · Learn4</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('rewards')}
              className="flex items-center gap-1.5 bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded-full transition-colors"
            >
              <span>⭐</span>
              <span className="font-black text-yellow-700 text-sm">{totalStars}</span>
            </button>
            <button
              onClick={() => setView('teacher')}
              className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1.5"
            >
              👩‍🏫 Teacher
            </button>
          </div>
        </div>

        {/* Subject tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
                activeSubject === sub ? 'text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              style={activeSubject === sub ? { background: sessions[sub].color } : {}}
            >
              {sessions[sub].icon} {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Session card + path */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Active session card */}
        <motion.div
          key={activeSubject}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 text-white shadow-xl"
          style={{ background: `linear-gradient(135deg, ${session.color}, ${session.color}cc)` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-semibold opacity-80 mb-1">{session.victorianCode}</div>
              <h2 className="text-xl font-black leading-tight">{session.title}</h2>
              <p className="text-sm opacity-80 mt-1">{session.description}</p>
            </div>
            <span className="text-5xl ml-4">{session.icon}</span>
          </div>
          <div className="flex items-center gap-4 text-sm opacity-80 mb-5">
            <span>⏱ ~{session.estimatedMinutes} min</span>
            <span>⭐ Up to {session.starsAvailable} stars</span>
            <span>📋 {session.steps.length} steps</span>
          </div>
          {isCompleted ? (
            <div className="bg-white/20 rounded-2xl px-4 py-3 text-center font-bold">
              ✅ Session complete! Great work, {profile.name}!
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => startSession(session.id)}
              className="w-full bg-white font-black text-lg py-3 rounded-2xl transition-all hover:shadow-lg"
              style={{ color: session.color }}
            >
              Start Learning →
            </motion.button>
          )}
        </motion.div>

        {/* Learning Path */}
        <div>
          <h3 className="font-black text-gray-700 mb-4 text-lg">📍 Your Learning Path</h3>
          <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6 relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-8 bottom-8 w-1 bg-gray-100 rounded-full -translate-x-1/2 z-0" />
            {[session].map((s, i) => (
              <PathNode
                key={s.id}
                index={i}
                session={s}
                completed={completedSessions.includes(s.id)}
                current={!completedSessions.includes(s.id)}
                locked={false}
                onStart={() => startSession(s.id)}
                themeColor={themeColor}
              />
            ))}
            <div className={`flex flex-col items-center ${1 % 2 === 0 ? 'ml-8' : 'mr-8 self-end'}`}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl bg-gray-100 border-4 border-dashed border-gray-300 opacity-50">
                🔒
              </div>
              <div className="mt-2 text-xs text-gray-400 font-semibold">More coming soon!</div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions done', value: completedSessions.length, icon: '✅' },
            { label: 'Stars earned', value: totalStars, icon: '⭐' },
            { label: 'Streak', value: '1 day', icon: '🔥' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-black text-gray-800 text-xl">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
