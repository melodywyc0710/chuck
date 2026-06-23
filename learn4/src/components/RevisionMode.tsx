import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { allSessions } from '../data/curriculum/index';
import type { QuizQuestion } from '../data/types';

const THEME_COLOR = { purple: '#A855F7', blue: '#1CB0F6', green: '#58CC02', orange: '#F97316' };
const THEME_DARK  = { purple: '#7C3AED', blue: '#0E8FC4', green: '#46A302', orange: '#EA580C' };

function renderMd(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type SubjectFilter = 'all' | 'english' | 'maths' | 'science' | 'hass' | 'vcd';
type YearFilter = 'all' | 4 | 5 | 6 | 8 | 9 | 10 | 11;

interface EnrichedQuestion extends QuizQuestion {
  subject: string;
  yearLevel: number;
}

export default function RevisionMode() {
  const { profile, setView, addStars } = useAppStore();
  const density = useAppStore(s => s.profile?.density ?? 'younger');
  if (!profile) return null;

  const themeColor = THEME_COLOR[profile.colorTheme];
  const themeDark = THEME_DARK[profile.colorTheme];

  // Filters
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [yearFilter, setYearFilter] = useState<YearFilter>('all');

  // Session state
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<EnrichedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [showMiniScore, setShowMiniScore] = useState(false);

  const allQuestions: EnrichedQuestion[] = useMemo(() => {
    const qs: EnrichedQuestion[] = [];
    for (const session of allSessions) {
      for (const step of session.steps) {
        if (step.type === 'quiz') {
          for (const q of step.questions) {
            qs.push({ ...q, subject: session.subject, yearLevel: session.yearLevel });
          }
        }
      }
    }
    return qs;
  }, []);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const subjectMatch = subjectFilter === 'all' || q.subject === subjectFilter;
      const yearMatch = yearFilter === 'all' || q.yearLevel === yearFilter;
      return subjectMatch && yearMatch;
    });
  }, [allQuestions, subjectFilter, yearFilter]);

  const handleStart = () => {
    const pool = shuffle(filteredQuestions);
    setQuestions(pool);
    setCurrentIndex(0);
    setSelected(null);
    setConfirmed(false);
    setResults([]);
    setShowMiniScore(false);
    setStarted(true);
  };

  const q = questions[currentIndex];
  const isCorrect = selected === q?.correct;
  const batchSize = 10;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
  };

  const handleNext = () => {
    if (isCorrect) addStars(1);
    const newResults = [...results, isCorrect];
    setResults(newResults);

    // Show mini score card every 10 questions
    if (newResults.length % batchSize === 0) {
      setShowMiniScore(true);
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      // Ran out of questions — show final mini score
      setShowMiniScore(true);
    }
  };

  const handleContinue = () => {
    setShowMiniScore(false);
    if (currentIndex >= questions.length - 1) {
      // Start fresh shuffle
      handleStart();
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const questionNumber = currentIndex + 1;
  const totalQuestions = questions.length;
  const overallCorrect = results.filter(Boolean).length;

  // Setup screen
  if (!started) {
    return (
      <div className="min-h-screen" style={{ background: '#F7FFF4' }}>
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('home')}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50"
            >
              ←
            </button>
            <div>
              <h1 className="font-black text-gray-800 text-2xl">Revision Mode</h1>
              <p className="text-sm text-gray-400">Practice questions from all lessons</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
            {/* Subject filter */}
            <div>
              <div className="text-sm font-bold text-gray-600 mb-3">Subject</div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'english', 'maths', 'science', 'hass', 'vcd'] as SubjectFilter[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSubjectFilter(s)}
                    className="py-2 px-3 rounded-xl font-bold text-sm transition-all capitalize"
                    style={subjectFilter === s
                      ? { background: s === 'vcd' ? '#7c3aed' : themeColor, color: 'white' }
                      : { background: '#f3f4f6', color: '#6b7280' }}
                  >
                    {s === 'all' ? 'All Subjects' : s === 'hass' ? 'HASS' : s === 'vcd' ? 'VCD' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Year filter */}
            <div>
              <div className="text-sm font-bold text-gray-600 mb-3">Year Level</div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 4, 5, 6, 8, 9, 10, 11] as YearFilter[]).map(y => (
                  <button
                    key={y}
                    onClick={() => setYearFilter(y)}
                    className="py-2 px-3 rounded-xl font-bold text-sm transition-all"
                    style={yearFilter === y
                      ? { background: themeColor, color: 'white' }
                      : { background: '#f3f4f6', color: '#6b7280' }}
                  >
                    {y === 'all' ? 'All Years' : y === 11 ? 'VCE' : `Year ${y}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black" style={{ color: themeColor }}>{filteredQuestions.length}</div>
              <div className="text-sm text-gray-500 font-semibold">questions available</div>
            </div>

            <button
              onClick={handleStart}
              disabled={filteredQuestions.length === 0}
              className="btn-duo w-full py-4 rounded-2xl text-white font-black text-lg uppercase tracking-wide disabled:opacity-30"
              style={{ background: themeColor, borderBottomColor: themeDark }}
            >
              START PRACTICE →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mini score card
  if (showMiniScore) {
    const batchEnd = results.length;
    const batchStart2 = batchEnd - Math.min(batchSize, batchEnd % batchSize || batchSize);
    const thisBatchResults = results.slice(batchStart2);
    const thisBatchCorrect = thisBatchResults.filter(Boolean).length;
    const pct = Math.round((thisBatchCorrect / thisBatchResults.length) * 100);
    const outOfQuestions = currentIndex >= questions.length - 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F7FFF4' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center space-y-4"
        >
          <div className="text-5xl">
            {pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}
          </div>
          <h2 className="font-black text-gray-800 text-2xl">
            {pct >= 80 ? 'Great work!' : pct >= 50 ? 'Good effort!' : 'Keep practising!'}
          </h2>
          <div className="text-5xl font-black" style={{ color: themeColor }}>{pct}%</div>
          <p className="text-gray-500 font-semibold">{thisBatchCorrect} of {thisBatchResults.length} correct this round</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-2 text-yellow-700 font-black text-lg">
            ⭐ +{thisBatchCorrect} stars earned!
          </div>
          <p className="text-xs text-gray-400">Overall: {overallCorrect} of {results.length} correct</p>

          <div className="space-y-2 pt-2">
            {!outOfQuestions && (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                className="w-full py-3 rounded-2xl text-white font-black"
                style={{ background: themeColor }}
              >
                Continue Practising →
              </motion.button>
            )}
            {outOfQuestions && (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="w-full py-3 rounded-2xl text-white font-black"
                style={{ background: themeColor }}
              >
                Shuffle Again →
              </motion.button>
            )}
            <button
              onClick={() => setView('home')}
              className="w-full py-3 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="min-h-screen" style={{ background: '#F7FFF4' }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView('home')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            ←
          </button>
          <div className="text-center">
            <div className="font-black text-gray-800">Revision Mode</div>
            <div className="text-xs text-gray-400">Question {questionNumber} of {totalQuestions}</div>
          </div>
          <div className="bg-white rounded-full px-3 py-1.5 shadow-sm text-sm font-bold" style={{ color: themeColor }}>
            {overallCorrect}/{results.length} ⭐
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%`, background: themeColor }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white capitalize" style={{ background: themeColor }}>
                  {q.subject}
                </span>
                <span className="text-xs text-gray-400">Year {q.yearLevel}</span>
              </div>
              <p
                className={`font-semibold text-gray-800 ${density === 'younger' ? 'text-lg' : 'text-base'}`}
                dangerouslySetInnerHTML={{ __html: renderMd(q.text) }}
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isCorrectOpt = confirmed && i === q.correct;
                const isWrongOpt   = confirmed && i === selected && !isCorrect;
                const isOther      = confirmed && i !== q.correct && i !== selected;
                const isChosen     = !confirmed && selected === i;

                let border = '#e5e7eb';
                let bg = '#ffffff';
                let textColor = '#374151';
                let bottomBorder = '#d1d5db';

                if (isChosen)     { border = themeColor; bg = themeColor + '10'; bottomBorder = themeDark; }
                if (isCorrectOpt) { border = '#58CC02'; bg = '#f0fff4'; bottomBorder = '#46A302'; textColor = '#166534'; }
                if (isWrongOpt)   { border = '#FF4B4B'; bg = '#fff5f5'; bottomBorder = '#D93D3D'; textColor = '#991b1b'; }
                if (isOther)      { border = '#f3f4f6'; bg = '#fafafa'; textColor = '#9ca3af'; }

                return (
                  <motion.button
                    key={i}
                    whileTap={!confirmed ? { scale: 0.98 } : {}}
                    onClick={() => !confirmed && setSelected(i)}
                    className="w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3 font-semibold"
                    style={{ borderColor: border, borderBottomColor: bottomBorder, borderBottomWidth: '3px', background: bg, color: textColor }}
                  >
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        background: isChosen ? themeColor : isCorrectOpt ? '#58CC02' : isWrongOpt ? '#FF4B4B' : '#f3f4f6',
                        color: (isChosen || isCorrectOpt || isWrongOpt) ? 'white' : '#6b7280',
                      }}
                    >
                      {['A','B','C','D'][i]}
                    </span>
                    <span className={`flex-1 ${density === 'younger' ? 'text-base' : 'text-sm'}`} dangerouslySetInnerHTML={{ __html: renderMd(opt) }} />
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {confirmed && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 border bg-white border-gray-200 shadow-sm"
                >
                  <div className={`font-bold mb-1 ${isCorrect ? 'text-green-600' : 'text-gray-600'}`}>
                    {isCorrect ? '✓ Correct!' : 'Good try!'}
                  </div>
                  <p
                    className={`text-gray-600 ${density === 'younger' ? 'text-sm' : 'text-xs'}`}
                    dangerouslySetInnerHTML={{ __html: renderMd(q.explanation) }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Action button */}
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all"
            style={selected !== null
              ? { background: themeColor, borderBottomColor: themeDark, color: 'white' }
              : { background: '#e5e7eb', borderBottomColor: '#d1d5db', color: '#9ca3af' }
            }
          >
            CHECK
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide text-white"
            style={{ background: isCorrect ? '#58CC02' : '#FF4B4B', borderBottomColor: isCorrect ? '#46A302' : '#D93D3D' }}
          >
            NEXT QUESTION →
          </button>
        )}
      </div>
    </div>
  );
}
