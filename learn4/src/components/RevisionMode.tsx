import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { allSessions } from '../data/curriculum/index';
import type { QuizQuestion } from '../data/types';

const THEME_COLOR = { purple: '#6366f1', blue: '#3b82f6', green: '#10b981', orange: '#f59e0b' };

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
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${themeColor}11, #f0f4ff)` }}>
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

            <motion.button
              whileHover={filteredQuestions.length > 0 ? { scale: 1.03 } : {}}
              whileTap={filteredQuestions.length > 0 ? { scale: 0.97 } : {}}
              onClick={handleStart}
              disabled={filteredQuestions.length === 0}
              className="w-full py-4 rounded-2xl text-white font-black text-lg disabled:opacity-30"
              style={{ background: themeColor }}
            >
              Start Practice →
            </motion.button>
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${themeColor}11, #f0f4ff)` }}>
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
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${themeColor}11, #f0f4ff)` }}>
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
                const isWrongSelected = confirmed && i === selected && !isCorrect;
                const isOther = confirmed && i !== q.correct && i !== selected;

                let containerStyle = 'border-gray-200 bg-white hover:border-gray-300';
                if (isCorrectOpt) containerStyle = 'border-green-500 bg-green-500';
                else if (isWrongSelected) containerStyle = 'border-red-500 bg-red-500';
                else if (isOther) containerStyle = 'border-gray-100 bg-gray-50 opacity-50';
                else if (!confirmed && selected === i) containerStyle = 'border-indigo-400 bg-indigo-50';

                const labelBg = isCorrectOpt || isWrongSelected
                  ? 'bg-white/25 text-white'
                  : selected === i && !confirmed
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600';

                const textColor = (isCorrectOpt || isWrongSelected) ? 'text-white' : 'text-gray-800';

                return (
                  <motion.button
                    key={i}
                    whileHover={!confirmed ? { scale: 1.01 } : {}}
                    whileTap={!confirmed ? { scale: 0.99 } : {}}
                    onClick={() => !confirmed && setSelected(i)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-medium flex items-center gap-3 ${containerStyle}`}
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black flex-shrink-0 ${labelBg}`}>
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    <span className={`flex-1 ${textColor} ${density === 'younger' ? 'text-base' : 'text-sm'}`} dangerouslySetInnerHTML={{ __html: renderMd(opt) }} />
                    {isCorrectOpt && <span className="text-white font-black ml-1">✓</span>}
                    {isWrongSelected && <span className="text-white font-black ml-1">✗</span>}
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
          <motion.button
            whileHover={selected !== null ? { scale: 1.03 } : {}}
            whileTap={selected !== null ? { scale: 0.97 } : {}}
            onClick={handleConfirm}
            disabled={selected === null}
            className="w-full py-4 rounded-2xl text-white font-black text-lg disabled:opacity-30"
            style={{ background: themeColor }}
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="w-full py-4 rounded-2xl text-white font-black text-lg"
            style={{ background: themeColor }}
          >
            Next Question →
          </motion.button>
        )}
      </div>
    </div>
  );
}
