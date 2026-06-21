import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, CheckCircle } from 'lucide-react';
import type { WorkedExampleStep } from '../../data/types';
import { useAppStore } from '../../store/appStore';
import LessonImage from '../LessonImage';

const HIGHLIGHT_STYLE: Record<string, { bg: string; border: string; label: string }> = {
  green:  { bg: '#f0fff4', border: '#86efac', label: '#15803d' },
  blue:   { bg: '#eff6ff', border: '#93c5fd', label: '#1d4ed8' },
  orange: { bg: '#fff7ed', border: '#fed7aa', label: '#c2410c' },
  purple: { bg: '#faf5ff', border: '#d8b4fe', label: '#7e22ce' },
};

function renderText(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

interface Props { step: WorkedExampleStep; onNext: () => void; themeColor: string; themeDark: string; mascot: string; }

export default function WorkedExample({ step, onNext, themeColor, themeDark, mascot }: Props) {
  const [revealed, setRevealed] = useState<number[]>([0]);
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [showNote, setShowNote] = useState(false);
  const density = useAppStore(s => s.profile?.density ?? 'younger');

  const allRevealed = revealed.length === step.content.body.length;

  return (
    <div className="flex flex-col min-h-[85vh]">
      <div className="flex-1 px-4 pt-5 pb-4 space-y-5">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wide"
          style={{ background: themeColor + '18', color: themeColor }}>
          <Lightbulb size={11} /> Worked Example
        </span>

        <h2 className={`font-black text-gray-800 leading-snug ${density === 'younger' ? 'text-2xl' : 'text-xl'}`}>
          {step.title}
        </h2>

        {step.imagePrompt && <LessonImage prompt={step.imagePrompt} alt={step.title} />}

        <p className="font-black text-gray-600 text-base">{step.content.heading}</p>

        {/* Reveal sections */}
        <div className="space-y-4">
          {step.content.body.map((block, i) => {
            const style = HIGHLIGHT_STYLE[block.highlight] ?? HIGHLIGHT_STYLE.blue;
            return (
              <AnimatePresence key={i}>
                {revealed.includes(i) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-2xl p-4 border-2"
                    style={{ background: style.bg, borderColor: style.border }}
                  >
                    <div className="font-black text-sm mb-2 uppercase tracking-wide" style={{ color: style.label }}>
                      {block.label}
                    </div>
                    <p
                      className={`text-gray-700 leading-relaxed ${density === 'younger' ? 'text-base' : 'text-sm'}`}
                      dangerouslySetInnerHTML={{ __html: renderText(block.text) }}
                    />
                    {i < step.content.body.length - 1 && !revealed.includes(i + 1) && (
                      <button
                        onClick={() => setRevealed(r => [...r, i + 1])}
                        className="btn-duo mt-3 px-4 py-2 text-sm rounded-xl text-white flex items-center gap-1"
                        style={{ background: themeColor, borderBottomColor: themeDark }}
                      >
                        Show next part <ChevronDown size={14} />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Check questions */}
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card p-5 space-y-4"
          >
            <div className="flex items-center gap-2 font-black text-gray-700">
              <span className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center text-sm">🤔</span>
              Quick check
            </div>
            {step.content.questions.map((q, i) => (
              <div key={i} className="space-y-2">
                <p className={`text-gray-700 font-semibold ${density === 'younger' ? 'text-base' : 'text-sm'}`}>{q.q}</p>
                {!showAnswers[i] ? (
                  <button
                    onClick={() => setShowAnswers(s => ({ ...s, [i]: true }))}
                    className="text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-xl border-2 transition-all"
                    style={{ borderColor: themeColor, color: themeColor }}
                  >
                    Show answer
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-start gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-green-50 border-2 border-green-200"
                  >
                    <CheckCircle size={16} color="#22c55e" className="mt-0.5 flex-shrink-0" />
                    <span className="text-green-800">{q.a}</span>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Mascot */}
        <div className="flex items-start gap-3 rounded-2xl p-4" style={{ background: '#fffbeb', border: '2px solid #fde68a' }}>
          <span className="text-2xl">{mascot === 'owl' ? '🦉' : mascot === 'fox' ? '🦊' : '🐼'}</span>
          <p className="text-yellow-800 text-sm font-medium">
            {density === 'younger'
              ? "Read each part carefully and click 'Show next part' when you're ready!"
              : "Work through this example. Try to answer the check questions before revealing."}
          </p>
        </div>

        {/* Teacher note */}
        <button onClick={() => setShowNote(v => !v)} className="text-xs text-gray-400 underline">
          Teacher note {showNote ? '▲' : '▼'}
        </button>
        {showNote && (
          <div className="rounded-2xl p-4 text-sm text-yellow-800" style={{ background: '#fffbeb', border: '2px solid #fde68a' }}>
            {step.teacherNote}
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="px-4 pb-8 pt-2">
        <button
          onClick={() => allRevealed && onNext()}
          disabled={!allRevealed}
          className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all"
          style={allRevealed
            ? { background: themeColor, borderBottomColor: themeDark, color: 'white' }
            : { background: '#e5e7eb', borderBottomColor: '#d1d5db', color: '#9ca3af' }
          }
        >
          {allRevealed ? 'CONTINUE' : `Read all ${step.content.body.length} sections first`}
        </button>
      </div>
    </div>
  );
}
