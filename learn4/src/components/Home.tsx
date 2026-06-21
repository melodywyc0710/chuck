import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Flame, Lock, Home as HomeIcon, RotateCcw, Trophy, User,
  BookOpen, Calculator, Palette, ChevronDown, GraduationCap, LogOut, Gamepad2, X,
} from 'lucide-react';
import { useAppStore, type Subject } from '../store/appStore';
import { sounds } from '../utils/sounds';
import { sessionsByYear } from '../data/curriculum/index';
import type { Session } from '../data/types';
import { isSessionUnlocked, formatUnlockDate } from '../utils/weeklyUnlock';
import { supabase } from '../lib/supabase';

const MASCOT_EMOJI = { owl: '🦉', fox: '🦊', panda: '🐼' };

const SUBJECT_META: Record<string, { label: string; Icon: React.ElementType; color: string; dark: string }> = {
  english: { label: 'English',  Icon: BookOpen,    color: '#1CB0F6', dark: '#0E8FC4' },
  maths:   { label: 'Maths',    Icon: Calculator,  color: '#58CC02', dark: '#46A302' },
  science: { label: 'Science',  Icon: Star,        color: '#FF9600', dark: '#E07800' },
  hass:    { label: 'HASS',     Icon: HomeIcon,    color: '#CE82FF', dark: '#A855F7' },
  vcd:     { label: 'VCD',      Icon: Palette,     color: '#FF4B4B', dark: '#D93D3D' },
};

// Node horizontal positions: left / centre-left / centre-right / right zigzag
const NODE_X = ['10%', '35%', '60%', '75%', '55%', '30%', '10%', '35%', '60%', '75%'];

interface PathNodeProps {
  session: Session;
  index: number;
  completed: boolean;
  current: boolean;
  locked: boolean;
  pinLocked: boolean;
  accentColor: string;
  accentDark: string;
  onTap: () => void;
}

function PathNode({ session, index, completed, current, locked, pinLocked, accentColor, accentDark, onTap }: PathNodeProps) {
  const isLocked = locked || pinLocked;

  const bg = completed
    ? accentColor
    : current
    ? '#FFC800'
    : isLocked
    ? '#E5E7EB'
    : '#fff';

  const shadow = completed
    ? accentDark
    : current
    ? '#E0A800'
    : isLocked
    ? '#D1D5DB'
    : accentDark;

  const iconColor = completed || current
    ? '#fff'
    : isLocked
    ? '#9CA3AF'
    : accentColor;

  return (
    <div
      className="absolute"
      style={{ left: NODE_X[index % NODE_X.length], transform: 'translateX(-50%)' }}
    >
      <motion.button
        onClick={onTap}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.1 } : {}}
        whileTap={!isLocked ? { scale: 0.92 } : {}}
        animate={current ? { y: [0, -6, 0] } : {}}
        transition={current ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : {}}
        className="relative w-[68px] h-[68px] rounded-full flex items-center justify-center"
        style={{
          background: bg,
          boxShadow: `0 6px 0 ${shadow}`,
          border: !completed && !current && !isLocked ? `3px solid ${accentColor}` : 'none',
        }}
      >
        {completed
          ? <Star size={28} fill="white" strokeWidth={0} />
          : isLocked
          ? <Lock size={22} color={iconColor} />
          : current
          ? <span className="text-2xl">{session.icon}</span>
          : <span className="text-2xl">{session.icon}</span>
        }

        {current && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-black px-3 py-1 rounded-full whitespace-nowrap"
            style={{ background: '#FFC800', color: '#6b4f00', boxShadow: '0 3px 0 #E0A800' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          >
            START
          </motion.div>
        )}
      </motion.button>

      {/* Lesson label below node */}
      <div className="text-center mt-2 w-20 -ml-[10px]">
        <p className="text-[10px] font-bold text-gray-500 leading-tight line-clamp-2">
          {session.title.split(':').pop()?.trim()}
        </p>
        {completed && <p className="text-[10px] font-black text-green-500 mt-0.5">Done ✓</p>}
      </div>
    </div>
  );
}

type NavTab = 'learn' | 'revision' | 'rewards' | 'profile';

export default function Home() {
  const {
    profile, activeSubject, setActiveSubject, activeYearLevel, setActiveYearLevel,
    startSession, setActiveSessionId, completedSessions, totalStars, setView, setUserId,
    currentStreak, userRole, classPin, teacherUnlockedSessions, unlockSessionForClass,
  } = useAppStore();

  const [navTab, setNavTab] = useState<NavTab>('learn');
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [pinModal, setPinModal] = useState<{ sessionId: string } | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!profile) return null;

  const yearSessions = sessionsByYear[activeYearLevel] ?? [];
  const subjects = Array.from(new Set(yearSessions.map(s => s.subject))) as Subject[];
  const activeSub = SUBJECT_META[activeSubject] ?? SUBJECT_META['english'];
  const activeSubjectSessions = yearSessions.filter(s => s.subject === activeSubject);
  const currentIndex = activeSubjectSessions.findIndex(s => !completedSessions.includes(s.id));
  const doneCount = activeSubjectSessions.filter(s => completedSessions.includes(s.id)).length;

  // path height: 160px per node
  const pathHeight = Math.max(activeSubjectSessions.length * 160, 400);

  function handleNodeTap(s: Session, needsPin: boolean) {
    if (needsPin) { setPinModal({ sessionId: s.id }); }
    else { sounds.click(); startSession(s.id); }
  }

  if (navTab === 'revision') { setView('revision'); setNavTab('learn'); return null; }
  if (navTab === 'rewards')  { setView('rewards');  setNavTab('learn'); return null; }

  return (
    <div className="min-h-screen flex flex-col bg-white max-w-lg mx-auto relative overflow-hidden">

      {/* ── TOP BAR (purple, Duolingo-style) ── */}
      <div className="px-4 pt-10 pb-3 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
        {/* Left: mascot + year */}
        <button
          onClick={() => setShowSubjectPicker(true)}
          className="flex items-center gap-2 bg-white/20 rounded-2xl px-3 py-1.5"
        >
          <span className="text-xl">{MASCOT_EMOJI[profile.mascot]}</span>
          <div className="text-left">
            <div className="text-white font-black text-xs">Year {activeYearLevel}</div>
            <div className="text-white/70 text-[10px] font-semibold flex items-center gap-0.5">
              {activeSub.label} <ChevronDown size={10} />
            </div>
          </div>
        </button>

        {/* Right: streak + stars */}
        <div className="flex items-center gap-3">
          {currentStreak >= 1 && (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5">
              <Flame size={16} color="#FF9600" fill="#FF9600" />
              <span className="text-white font-black text-sm">{currentStreak}</span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5">
            <Star size={16} color="#FFC800" fill="#FFC800" />
            <span className="text-white font-black text-sm">{totalStars}</span>
          </div>
          {userRole === 'teacher' && (
            <button onClick={() => setView('teacher')} className="bg-white/20 rounded-full p-1.5">
              <GraduationCap size={16} color="white" />
            </button>
          )}
          <button
            onClick={async () => { await supabase.auth.signOut(); setUserId(null, null); }}
            className="bg-white/20 rounded-full p-1.5"
          >
            <LogOut size={16} color="white" />
          </button>
        </div>
      </div>

      {/* ── SECTION LABEL ── */}
      <div className="px-4 py-1.5 flex items-center gap-2"
        style={{ background: '#6D28D9' }}>
        <div className="w-5 h-5 rounded border-2 border-white/40 flex items-center justify-center">
          <activeSub.Icon size={11} color="white" />
        </div>
        <span className="text-white/90 text-xs font-black uppercase tracking-widest">
          {activeSub.label} · Year {activeYearLevel}
        </span>
      </div>

      {/* ── UNIT CARD (teal banner) ── */}
      <div className="mx-4 mt-4 rounded-2xl p-4 flex items-center justify-between"
        style={{ background: activeSub.color, boxShadow: `0 5px 0 ${activeSub.dark}` }}>
        <div className="flex-1">
          <p className="text-white/80 text-xs font-bold uppercase tracking-wide mb-0.5">
            Unit {doneCount + 1} of {activeSubjectSessions.length}
          </p>
          <h2 className="text-white font-black text-base leading-tight">
            {activeSubjectSessions[currentIndex >= 0 ? currentIndex : 0]?.title.split(':').pop()?.trim() ?? activeSub.label}
          </h2>
        </div>
        <div className="ml-3 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <activeSub.Icon size={20} color="white" />
        </div>
      </div>

      {/* ── WINDING PATH ── */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="relative mx-auto" style={{ width: '100%', height: pathHeight }}>
          {/* Vertical connector line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, #e5e7eb, #e5e7eb)', zIndex: 0 }} />

          {activeSubjectSessions.map((s, i) => {
            const isDone = completedSessions.includes(s.id);
            const isCurrent = i === currentIndex;
            const isProgressLocked = !isDone && currentIndex >= 0 && i > currentIndex + 2;
            const isWeekLocked = !isSessionUnlocked(s.weekNumber);
            const isPinUnlocked = teacherUnlockedSessions.includes(s.id);
            const needsPin = isProgressLocked && !isPinUnlocked && userRole !== 'teacher';
            const isLocked = (isProgressLocked && !needsPin) || isWeekLocked;

            return (
              <div key={s.id} className="absolute w-full" style={{ top: i * 160 + 40 }}>
                <PathNode
                  session={s}
                  index={i}
                  completed={isDone}
                  current={isCurrent}
                  locked={isLocked}
                  pinLocked={needsPin}
                  accentColor={activeSub.color}
                  accentDark={activeSub.dark}
                  onTap={() => {
                    if (isLocked) return;
                    if (isDone || isCurrent || userRole === 'teacher') {
                      handleNodeTap(s, false);
                    } else if (needsPin) {
                      handleNodeTap(s, true);
                    } else {
                      handleNodeTap(s, false);
                    }
                  }}
                />
                {/* Week-locked tooltip */}
                {isWeekLocked && s.weekNumber && (
                  <div
                    className="absolute text-[10px] text-blue-400 font-bold whitespace-nowrap"
                    style={{ left: NODE_X[i % NODE_X.length], transform: 'translateX(-50%)', top: 88 }}
                  >
                    Unlocks {formatUnlockDate(s.weekNumber)}
                  </div>
                )}
                {/* Homework link */}
                <button
                  onClick={() => { setActiveSessionId(s.id); setView('homework'); }}
                  className="absolute text-[10px] text-gray-400 hover:text-gray-600 font-semibold"
                  style={{ left: NODE_X[i % NODE_X.length], transform: 'translateX(-50%)', top: 100 }}
                >
                  📄 hw
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t-2 border-gray-100 px-2 pb-safe z-20">
        <div className="flex items-center justify-around py-2">
          {([
            { id: 'learn',    Icon: HomeIcon,   label: 'Learn'   },
            { id: 'revision', Icon: RotateCcw,  label: 'Practice'},
            { id: 'rewards',  Icon: Trophy,     label: 'Rewards' },
            { id: 'profile',  Icon: User,       label: 'Profile' },
          ] as { id: NavTab; Icon: React.ElementType; label: string }[]).map(tab => {
            const active = navTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setNavTab(tab.id as NavTab)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
                style={active ? { color: activeSub.color } : { color: '#9CA3AF' }}
              >
                <tab.Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] font-black ${active ? '' : 'text-gray-400'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SUBJECT / YEAR PICKER MODAL ── */}
      <AnimatePresence>
        {showSubjectPicker && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowSubjectPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg mx-auto bg-white rounded-t-3xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-800 text-lg">Switch Course</h3>
                <button onClick={() => setShowSubjectPicker(false)} className="p-2 rounded-full bg-gray-100">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Year pills */}
              <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-2">Year Level</p>
              <div className="flex gap-2 flex-wrap mb-5">
                {([4, 5, 6, 8, 9, 10, 11] as const).map(yr => (
                  <button
                    key={yr}
                    onClick={() => setActiveYearLevel(yr)}
                    className="px-4 py-2 rounded-xl font-black text-sm transition-all"
                    style={activeYearLevel === yr
                      ? { background: activeSub.color, color: 'white', boxShadow: `0 3px 0 ${activeSub.dark}` }
                      : { background: '#f3f4f6', color: '#6b7280' }
                    }
                  >
                    {yr === 11 ? 'VCE' : `Year ${yr}`}
                  </button>
                ))}
              </div>

              {/* Subject list */}
              <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-2">Subject</p>
              <div className="space-y-2">
                {subjects.map(sub => {
                  const meta = SUBJECT_META[sub];
                  const isActive = activeSubject === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => { setActiveSubject(sub); setShowSubjectPicker(false); }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all"
                      style={isActive
                        ? { borderColor: meta.color, borderBottomWidth: '4px', borderBottomColor: meta.dark, background: meta.color + '10' }
                        : { borderColor: '#e5e7eb' }
                      }
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: meta.color + '20' }}>
                        <meta.Icon size={20} color={meta.color} />
                      </div>
                      <span className="font-black text-gray-800">{meta.label}</span>
                      {isActive && (
                        <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: meta.color }}>
                          <Star size={10} fill="white" strokeWidth={0} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Games link */}
              <button
                onClick={() => { setShowSubjectPicker(false); setView('games'); }}
                className="w-full mt-3 flex items-center gap-3 p-3 rounded-2xl border-2 border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Gamepad2 size={20} color="#A855F7" />
                </div>
                <span className="font-black text-gray-800">Games</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PROFILE PANEL ── */}
      <AnimatePresence>
        {navTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed inset-0 bg-white z-40 flex flex-col max-w-lg mx-auto"
          >
            <div className="px-4 pt-12 pb-6 text-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
              <div className="text-6xl mb-2">{MASCOT_EMOJI[profile.mascot]}</div>
              <h2 className="text-white font-black text-2xl">{profile.name}</h2>
              <p className="text-white/70 text-sm font-semibold">Year {activeYearLevel} · {activeSub.label}</p>
            </div>
            <div className="p-6 space-y-3 flex-1">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Stars', value: totalStars, color: '#FFC800', Icon: Star },
                  { label: 'Streak', value: `${currentStreak}w`, color: '#FF9600', Icon: Flame },
                  { label: 'Done', value: doneCount, color: '#58CC02', Icon: Trophy },
                ].map(s => (
                  <div key={s.label} className="card p-4 text-center">
                    <s.Icon size={20} color={s.color} fill={s.color} strokeWidth={0} className="mx-auto mb-1" />
                    <div className="font-black text-lg text-gray-800">{s.value}</div>
                    <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
              {userRole === 'teacher' && (
                <button onClick={() => { setNavTab('learn'); setView('teacher'); }}
                  className="btn-duo w-full py-3 rounded-2xl text-white font-black flex items-center justify-center gap-2"
                  style={{ background: '#7C3AED', borderBottomColor: '#5B21B6' }}>
                  <GraduationCap size={18} /> Teacher Dashboard
                </button>
              )}
              <button
                onClick={async () => { await supabase.auth.signOut(); setUserId(null, null); }}
                className="btn-duo btn-ghost w-full py-3 rounded-2xl font-black flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Sign out
              </button>
            </div>
            <div className="pb-24 px-6">
              <button onClick={() => setNavTab('learn')} className="btn-duo btn-green w-full py-3 rounded-2xl font-black">
                Back to Learning
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PIN MODAL ── */}
      {pinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="card p-8 w-80 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-yellow-600" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Lesson Locked</h3>
            <p className="text-gray-500 text-sm mb-5 font-medium">Ask your teacher to enter the class PIN.</p>
            <input
              type="password" maxLength={4} value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              placeholder="• • • •"
              className="input-duo text-center text-2xl tracking-widest font-black mb-3"
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm mb-3 font-bold">Incorrect PIN.</p>}
            <div className="flex gap-3">
              <button onClick={() => { setPinModal(null); setPinInput(''); setPinError(false); }}
                className="btn-duo btn-ghost flex-1 py-3">Cancel</button>
              <button
                onClick={() => {
                  if (pinInput === classPin && classPin.length === 4) {
                    unlockSessionForClass(pinModal.sessionId);
                    setPinModal(null); setPinInput(''); setPinError(false);
                    startSession(pinModal.sessionId);
                  } else { setPinError(true); }
                }}
                className="btn-duo btn-green flex-1 py-3">Unlock</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
