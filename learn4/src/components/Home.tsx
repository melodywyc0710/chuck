import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, type Subject } from '../store/appStore';
import { sounds } from '../utils/sounds';
import { sessionsByYear } from '../data/curriculum/index';
import type { Session } from '../data/types';
import { isSessionUnlocked, formatUnlockDate } from '../utils/weeklyUnlock';
import { supabase } from '../lib/supabase';

const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };
const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const THEME_DARK  = { purple: '#7C3AED', blue: '#0E8FC4', green: '#46A302', orange: '#EA580C' };
const SUBJECT_LABEL: Record<string, string> = {
  english: '📖 English',
  maths: '🔢 Maths',
  science: '🔬 Science',
  hass: '🌏 HASS',
  vcd: '🎨 VCD',
};
const SUBJECT_COLOR: Record<string, string> = {
  english: '#1CB0F6',
  maths: '#58CC02',
  science: '#FF9600',
  hass: '#CE82FF',
  vcd: '#FF4B4B',
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
  themeDark: string;
}

function PathNode({ index, session, completed, current, locked, weekLocked, pinLocked, onStart, onHomework, themeColor, themeDark }: NodeProps) {
  const isAnyLocked = locked || weekLocked;
  const isLeft = index % 2 === 0;

  return (
    <div className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      <motion.button
        whileHover={!isAnyLocked ? { scale: 1.08 } : {}}
        whileTap={!isAnyLocked ? { scale: 0.92 } : {}}
        onClick={() => !isAnyLocked && onStart()}
        disabled={isAnyLocked}
        className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl flex-shrink-0 transition-all"
        style={
          completed
            ? { background: themeColor, boxShadow: `0 5px 0 ${themeDark}`, color: 'white' }
            : current
            ? { background: '#FFC800', boxShadow: '0 5px 0 #E0A800', color: '#6b4f00' }
            : isAnyLocked
            ? { background: '#f3f4f6', boxShadow: '0 4px 0 #e5e7eb', color: '#9ca3af' }
            : { background: 'white', boxShadow: `0 5px 0 ${themeDark}`, color: themeColor, border: `3px solid ${themeColor}` }
        }
        animate={current ? { y: [0, -4, 0] } : {}}
        transition={current ? { duration: 1.5, repeat: Infinity } : {}}
      >
        {completed ? '⭐' : isAnyLocked ? '🔒' : pinLocked ? '🔐' : session.icon}
        {current && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: '#FFC800', color: '#6b4f00', boxShadow: '0 2px 0 #E0A800' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            START!
          </motion.div>
        )}
      </motion.button>

      <div className={`flex-1 card p-3 ${isAnyLocked ? 'opacity-50' : ''}`}
        style={current ? { borderColor: '#FFC800', borderBottomColor: '#E0A800', borderBottomWidth: '3px' } : {}}>
        <div className="font-black text-gray-800 text-sm leading-tight">{session.title.split(':').pop()?.trim()}</div>
        <div className="text-xs text-gray-400 font-medium mt-0.5">{session.victorianCode}</div>
        {completed && <div className="text-xs text-green-600 font-black mt-1">✓ Complete!</div>}
        {weekLocked && session.weekNumber && (
          <div className="text-xs text-blue-500 font-bold mt-1">🗓 {formatUnlockDate(session.weekNumber)}</div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onHomework(); }}
          className="mt-1.5 text-xs text-gray-400 hover:text-gray-600 font-semibold"
        >
          📄 Homework sheet
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { profile, activeSubject, setActiveSubject, activeYearLevel, setActiveYearLevel, startSession, setActiveSessionId, completedSessions, totalStars, setView, setUserId, currentStreak, userRole, classPin, teacherUnlockedSessions, unlockSessionForClass } = useAppStore();

  const [pinModal, setPinModal] = useState<{ sessionId: string } | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!profile) return null;

  const themeColor = THEME_COLOR[profile.colorTheme];
  const themeDark  = THEME_DARK[profile.colorTheme];
  const yearSessions = sessionsByYear[activeYearLevel] ?? [];
  const subjects = Array.from(new Set(yearSessions.map(s => s.subject))) as Subject[];
  const activeSubjectSessions = yearSessions.filter(s => s.subject === activeSubject);
  const currentIndex = activeSubjectSessions.findIndex(s => !completedSessions.includes(s.id));
  const featuredSession = currentIndex >= 0 ? activeSubjectSessions[currentIndex] : activeSubjectSessions[activeSubjectSessions.length - 1];
  const doneCount = activeSubjectSessions.filter(s => completedSessions.includes(s.id)).length;
  const progressPct = activeSubjectSessions.length ? Math.round((doneCount / activeSubjectSessions.length) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0fff4 0%, #fafff7 100%)' }}>
      {/* Top bar */}
      <div className="bg-white sticky top-0 z-10" style={{ boxShadow: '0 3px 0 #e5e7eb' }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: themeColor + '20', boxShadow: `0 3px 0 ${themeDark}20` }}>
                {MASCOT_EMOJI[profile.mascot]}
              </div>
              <div>
                <div className="font-black text-gray-800 text-sm">{profile.name}</div>
                <div className="text-xs text-gray-400 font-medium">Year {activeYearLevel}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button onClick={() => setView('rewards')} className="xp-badge cursor-pointer hover:scale-105 transition-transform">
                ⭐ {totalStars}
              </button>
              {currentStreak >= 1 && (
                <div className="streak-badge">🔥 {currentStreak}w</div>
              )}
              <button onClick={() => setView('revision')} className="btn-duo btn-ghost px-3 py-1.5 text-xs rounded-xl">Revision</button>
              <button onClick={() => setView('games')} className="btn-duo btn-ghost px-3 py-1.5 text-xs rounded-xl">Games</button>
              {userRole === 'teacher' && (
                <button
                  onClick={() => setView('teacher')}
                  className="btn-duo px-3 py-1.5 text-xs rounded-xl text-white"
                  style={{ background: themeColor, borderBottomColor: themeDark, borderBottomWidth: '3px' }}
                >
                  🍎 Teacher
                </button>
              )}
              <button
                onClick={async () => { await supabase.auth.signOut(); setUserId(null, null); }}
                className="btn-duo btn-ghost px-3 py-1.5 text-xs rounded-xl"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Year tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {([4, 5, 6, 8, 9, 10, 11] as const).map(yr => (
              <button
                key={yr}
                onClick={() => setActiveYearLevel(yr)}
                className={`flex-shrink-0 py-1.5 px-3 rounded-xl font-black text-xs transition-all ${
                  activeYearLevel === yr ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                style={activeYearLevel === yr ? {
                  background: themeColor,
                  boxShadow: `0 3px 0 ${themeDark}`,
                } : {}}
              >
                {yr === 11 ? 'VCE' : `Year ${yr}`}
              </button>
            ))}
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {subjects.map(sub => {
              const subColor = SUBJECT_COLOR[sub] ?? themeColor;
              return (
                <button
                  key={sub}
                  onClick={() => setActiveSubject(sub)}
                  className={`flex-shrink-0 py-2 px-4 rounded-xl font-black text-xs transition-all ${
                    activeSubject === sub ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  style={activeSubject === sub ? {
                    background: subColor,
                    boxShadow: `0 3px 0 ${subColor}99`,
                  } : {}}
                >
                  {SUBJECT_LABEL[sub] ?? sub}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {activeSubjectSessions.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <p className="text-gray-500 font-bold text-lg">Content loading — check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured session card */}
            {featuredSession && (
              <motion.div
                key={featuredSession.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${featuredSession.color}, ${featuredSession.color}cc)`,
                  boxShadow: `0 6px 0 ${featuredSession.color}88`,
                }}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20" style={{ background: 'white' }} />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10" style={{ background: 'white' }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-xs font-black opacity-80 mb-1 tracking-wide uppercase">{featuredSession.victorianCode}</div>
                      <h2 className="text-xl font-black leading-tight">{featuredSession.title}</h2>
                      <p className="text-sm opacity-80 mt-1 font-medium">{featuredSession.description}</p>
                    </div>
                    <span className="text-5xl ml-4">{featuredSession.icon}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-80 mb-5 font-bold">
                    <span>⏱ ~{featuredSession.estimatedMinutes}min</span>
                    <span>⭐ {featuredSession.starsAvailable} stars</span>
                    <span>📋 {featuredSession.steps.length} steps</span>
                  </div>
                  {completedSessions.includes(featuredSession.id) ? (
                    <div className="bg-white/20 rounded-2xl px-4 py-3 text-center font-black">
                      ✅ Complete! Great work, {profile.name}!
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { sounds.click(); startSession(featuredSession.id); }}
                      className="w-full font-black text-lg py-3.5 rounded-2xl"
                      style={{
                        background: 'white',
                        color: featuredSession.color,
                        boxShadow: '0 5px 0 rgba(0,0,0,0.15)',
                      }}
                    >
                      Start Learning →
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Progress bar */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-gray-700 text-sm">Your Progress</span>
                <span className="text-xs font-bold text-gray-400">{doneCount} / {activeSubjectSessions.length} lessons</span>
              </div>
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-around mt-3">
                {[
                  { label: 'Done', value: doneCount, emoji: '✅' },
                  { label: 'To go', value: activeSubjectSessions.length - doneCount, emoji: '🎯' },
                  { label: 'Stars', value: totalStars, emoji: '⭐' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="font-black text-gray-800 text-sm">{stat.emoji} {stat.value}</div>
                    <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Path */}
            <div>
              <h3 className="font-black text-gray-700 text-lg mb-4">📍 Learning Path</h3>
              <div className="card p-5 space-y-4">
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
                      themeDark={themeDark}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* PIN Modal */}
      {pinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card p-8 w-80 text-center"
          >
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Lesson Locked</h3>
            <p className="text-gray-500 text-sm mb-5 font-medium">Ask your teacher to enter the class PIN to unlock this lesson.</p>
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              placeholder="• • • •"
              className="input-duo text-center text-2xl tracking-widest font-black mb-3"
              autoFocus
            />
            {pinError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-500 text-sm mb-3 font-bold">
                ❌ Incorrect PIN. Try again.
              </motion.p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setPinModal(null); setPinInput(''); setPinError(false); }}
                className="btn-duo btn-ghost flex-1 py-3"
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
                className="btn-duo btn-green flex-1 py-3"
              >Unlock 🔓</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
