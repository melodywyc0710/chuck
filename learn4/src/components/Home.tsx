import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, type Subject } from '../store/appStore';
import { sounds } from '../utils/sounds';
import { sessionsByYear } from '../data/curriculum/index';
import type { Session } from '../data/types';
import { isSessionUnlocked, formatUnlockDate } from '../utils/weeklyUnlock';

const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };
const THEME_COLOR = { purple: '#6366f1', blue: '#3b82f6', green: '#10b981', orange: '#f59e0b' };
const SUBJECT_LABEL: Record<string, string> = {
  english: 'English',
  maths: 'Maths',
  science: 'Science',
  hass: 'HASS',
  vcd: 'VCD',
};

interface NodeProps {
  index: number;
  session: Session;
  completed: boolean;
  current: boolean;
  locked: boolean;
  weekLocked: boolean;
  pinLocked?: boolean;
  onStart: () => void;
  onHomework: () => void;
  themeColor: string;
}

function PathNode({ index, session, completed, current, locked, weekLocked, pinLocked, onStart, onHomework, themeColor }: NodeProps) {
  const isAnyLocked = locked || weekLocked;
  const offset = index % 2 === 0 ? 'ml-8' : 'mr-8 self-end';
  return (
    <div className={`flex flex-col items-center ${offset}`}>
      <motion.button
        whileHover={!isAnyLocked ? { scale: 1.08 } : {}}
        whileTap={!isAnyLocked ? { scale: 0.95 } : {}}
        onClick={() => !isAnyLocked && onStart()}
        disabled={isAnyLocked}
        className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 transition-all"
        style={
          completed
            ? { background: themeColor, borderColor: themeColor, color: 'white' }
            : current
            ? { background: '#f59e0b', borderColor: '#d97706', color: 'white' }
            : isAnyLocked
            ? { background: '#f3f4f6', borderColor: '#e5e7eb', color: '#9ca3af' }
            : { background: '#fff', borderColor: themeColor, color: themeColor }
        }
        animate={current ? { boxShadow: ['0 0 0 0 rgba(245,158,11,0.5)', '0 0 0 16px rgba(245,158,11,0)'] } : {}}
        transition={current ? { duration: 1.5, repeat: Infinity } : {}}
      >
        {completed ? '⭐' : isAnyLocked ? '🔒' : pinLocked ? '🔐' : session.icon}
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
      <div className={`mt-2 text-center max-w-24 ${isAnyLocked ? 'opacity-40' : ''}`}>
        <div className="text-xs font-bold text-gray-700 leading-tight">{session.title.split(':').pop()?.trim()}</div>
        <div className="text-xs text-gray-400">{session.victorianCode}</div>
        {completed && <div className="text-xs text-green-600 font-semibold">✓ Done</div>}
        {weekLocked && session.weekNumber && (
          <div className="text-xs text-blue-400 font-semibold">🗓 {formatUnlockDate(session.weekNumber)}</div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onHomework(); }}
          className="mt-1 text-xs text-gray-400 hover:text-gray-600 underline"
        >
          📄 Homework
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { profile, activeSubject, setActiveSubject, activeYearLevel, setActiveYearLevel, startSession, setActiveSessionId, completedSessions, totalStars, setView, currentStreak, userRole, classPin, teacherUnlockedSessions, unlockSessionForClass } = useAppStore();

  const [pinModal, setPinModal] = useState<{ sessionId: string } | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!profile) return null;

  const themeColor = THEME_COLOR[profile.colorTheme];
  const yearSessions = sessionsByYear[activeYearLevel] ?? [];

  // Get unique subjects present in this year's sessions
  const subjects = Array.from(new Set(yearSessions.map(s => s.subject))) as Subject[];
  const activeSubjectSessions = yearSessions.filter(s => s.subject === activeSubject);

  // Find first incomplete session as "current"
  const currentIndex = activeSubjectSessions.findIndex(s => !completedSessions.includes(s.id));
  const featuredSession = currentIndex >= 0 ? activeSubjectSessions[currentIndex] : activeSubjectSessions[activeSubjectSessions.length - 1];

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${themeColor}11, #f0f4ff)` }}>
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{MASCOT_EMOJI[profile.mascot]}</span>
            <div>
              <div className="font-black text-gray-800 text-sm leading-none">Hi, {profile.name}! 👋</div>
              <div className="text-xs text-gray-400">Year {activeYearLevel} · Chucky</div>
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
            {currentStreak >= 1 && (
              <div className="flex items-center gap-1 bg-orange-100 px-3 py-1.5 rounded-full" title="Sessions this week count!">
                <span>🔥</span>
                <span className="font-black text-orange-700 text-sm">{currentStreak} week streak</span>
              </div>
            )}
            <button
              onClick={() => setView('revision')}
              className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1.5"
            >
              Revision
            </button>
            <button
              onClick={() => setView('games')}
              className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1.5"
            >
              Games
            </button>
            {userRole === 'teacher' && (
              <button
                onClick={() => setView('teacher')}
                className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1.5"
              >
                Teacher
              </button>
            )}
          </div>
        </div>

        {/* Year level tabs */}
        <div className="max-w-2xl mx-auto px-4 pt-1 pb-2 flex gap-2 overflow-x-auto">
          {([4, 5, 6, 8, 9, 10, 11] as const).map(yr => (
            <button
              key={yr}
              onClick={() => setActiveYearLevel(yr)}
              className={`flex-shrink-0 py-1.5 px-3 rounded-xl font-bold text-sm transition-all ${
                activeYearLevel === yr ? 'text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              style={activeYearLevel === yr ? { background: themeColor } : {}}
            >
              {yr === 11 ? 'VCE' : `Year ${yr}`}
            </button>
          ))}
        </div>

        {/* Subject tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`flex-shrink-0 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
                activeSubject === sub ? 'text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              style={activeSubject === sub ? { background: featuredSession?.color ?? themeColor } : {}}
            >
              {SUBJECT_LABEL[sub] ?? sub}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {activeSubjectSessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-3">🚀</div>
            <p className="text-gray-500 font-semibold">Content loading — check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured session card */}
            {featuredSession && (
              <motion.div
                key={featuredSession.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 text-white shadow-xl"
                style={{ background: `linear-gradient(135deg, ${featuredSession.color}, ${featuredSession.color}cc)` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-semibold opacity-80 mb-1">{featuredSession.victorianCode}</div>
                    <h2 className="text-xl font-black leading-tight">{featuredSession.title}</h2>
                    <p className="text-sm opacity-80 mt-1">{featuredSession.description}</p>
                  </div>
                  <span className="text-5xl ml-4">{featuredSession.icon}</span>
                </div>
                <div className="flex items-center gap-4 text-sm opacity-80 mb-5">
                  <span>⏱ ~{featuredSession.estimatedMinutes} min</span>
                  <span>⭐ Up to {featuredSession.starsAvailable} stars</span>
                  <span>📋 {featuredSession.steps.length} steps</span>
                </div>
                {completedSessions.includes(featuredSession.id) ? (
                  <div className="bg-white/20 rounded-2xl px-4 py-3 text-center font-bold">
                    ✅ Complete! Great work, {profile.name}!
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { sounds.click(); startSession(featuredSession.id); }}
                    className="w-full bg-white font-black text-lg py-3 rounded-2xl transition-all hover:shadow-lg"
                    style={{ color: featuredSession.color }}
                  >
                    Start Learning →
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Progress summary */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Done', value: activeSubjectSessions.filter(s => completedSessions.includes(s.id)).length },
                { label: 'Remaining', value: activeSubjectSessions.filter(s => !completedSessions.includes(s.id)).length },
                { label: 'Stars', value: totalStars },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
                  <div className="font-black text-gray-800 text-lg">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Learning Path */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-700 text-lg">📍 Learning Path</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {activeSubjectSessions.filter(s => completedSessions.includes(s.id)).length} / {activeSubjectSessions.length} lessons
                </span>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6 relative">
                <div className="absolute left-1/2 top-8 bottom-8 w-1 bg-gray-100 rounded-full -translate-x-1/2 z-0" />
                {activeSubjectSessions.map((s, i) => {
                  const isDone = completedSessions.includes(s.id);
                  const isCurrent = i === currentIndex;
                  const isProgressLocked = !isDone && currentIndex >= 0 && i > currentIndex + 2;
                  const isWeekLocked = !isSessionUnlocked(s.weekNumber);
                  const isPinUnlocked = teacherUnlockedSessions.includes(s.id);
                  const needsPinToUnlock = isProgressLocked && !isPinUnlocked && userRole !== 'teacher';
                  return (
                    <PathNode
                      key={s.id}
                      index={i}
                      session={s}
                      completed={isDone}
                      current={isCurrent}
                      locked={!needsPinToUnlock && isProgressLocked}
                      weekLocked={isWeekLocked}
                      pinLocked={needsPinToUnlock}
                      onStart={() => {
                        if (needsPinToUnlock) {
                          setPinModal({ sessionId: s.id });
                        } else {
                          startSession(s.id);
                        }
                      }}
                      onHomework={() => { setActiveSessionId(s.id); setView('homework'); }}
                      themeColor={themeColor}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      {pinModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-80 text-center shadow-2xl">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Lesson Locked</h3>
            <p className="text-gray-500 text-sm mb-4">Ask your teacher to enter the class PIN to unlock this lesson.</p>
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              placeholder="Enter 4-digit PIN"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-widest font-bold mb-3 focus:outline-none focus:border-indigo-400"
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm mb-2">Incorrect PIN. Try again.</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setPinModal(null); setPinInput(''); setPinError(false); }}
                className="flex-1 py-2 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold"
              >Cancel</button>
              <button
                onClick={() => {
                  if (pinInput === classPin && classPin.length === 4) {
                    unlockSessionForClass(pinModal.sessionId);
                    setPinModal(null);
                    setPinInput('');
                    setPinError(false);
                    startSession(pinModal.sessionId);
                  } else {
                    setPinError(true);
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-indigo-500 text-white font-bold"
              >Unlock</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
