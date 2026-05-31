import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkedExampleStep } from '../../data/types';
import { useAppStore } from '../../store/appStore';

const HIGHLIGHT = {
  green: 'bg-green-50 border-l-4 border-green-400',
  blue: 'bg-blue-50 border-l-4 border-blue-400',
  orange: 'bg-orange-50 border-l-4 border-orange-400',
  purple: 'bg-purple-50 border-l-4 border-purple-400',
};
const LABEL_COLOR = {
  green: 'text-green-700',
  blue: 'text-blue-700',
  orange: 'text-orange-700',
  purple: 'text-purple-700',
};

function renderText(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

interface Props { step: WorkedExampleStep; onNext: () => void; themeColor: string; mascot: string; }

export default function WorkedExample({ step, onNext, themeColor, mascot }: Props) {
  const [revealed, setRevealed] = useState<number[]>([0]);
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [showNote, setShowNote] = useState(false);
  const density = useAppStore(s => s.profile?.density ?? 'younger');

  const allRevealed = revealed.length === step.content.body.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ background: themeColor }}>
          💡
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Worked Example</div>
          <h2 className="font-black text-gray-800 text-xl">{step.title}</h2>
        </div>
      </div>

      <h3 className="text-lg font-black text-gray-700">{step.content.heading}</h3>

      {/* Reveal sections one at a time */}
      <div className="space-y-4">
        {step.content.body.map((block, i) => (
          <AnimatePresence key={i}>
            {revealed.includes(i) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={`rounded-xl p-4 ${HIGHLIGHT[block.highlight]}`}
              >
                <div className={`font-bold text-sm mb-2 ${LABEL_COLOR[block.highlight]}`}>{block.label}</div>
                <p
                  className={`text-gray-700 leading-relaxed ${density === 'younger' ? 'text-base' : 'text-sm'}`}
                  dangerouslySetInnerHTML={{ __html: renderText(block.text) }}
                />
                {i < step.content.body.length - 1 && !revealed.includes(i + 1) && (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setRevealed(r => [...r, i + 1])}
                    className="mt-3 px-4 py-2 text-sm font-bold text-white rounded-xl"
                    style={{ background: themeColor }}
                  >
                    Show next part →
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Check questions */}
      {allRevealed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-200">
          <div className="font-bold text-gray-700">🤔 Quick check — can you answer these?</div>
          {step.content.questions.map((q, i) => (
            <div key={i} className="space-y-2">
              <p className={`text-gray-700 font-medium ${density === 'younger' ? 'text-base' : 'text-sm'}`}>{q.q}</p>
              {!showAnswers[i] ? (
                <button
                  onClick={() => setShowAnswers(s => ({ ...s, [i]: true }))}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
                >
                  Show answer
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-green-800 font-medium"
                >
                  ✅ {q.a}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* Mascot */}
      <div className="flex items-start gap-3 bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
        <span className="text-3xl">{mascot}</span>
        <p className="text-yellow-800 text-sm font-medium">
          {density === 'younger'
            ? "Read through each part carefully. Click 'Show next part' when you're ready!"
            : "Work through this example. Try to answer the check questions before revealing the answers."}
        </p>
      </div>

      <button onClick={() => setShowNote(v => !v)} className="text-xs text-gray-400 hover:text-gray-600 underline">
        👩‍🏫 Teacher note {showNote ? '▲' : '▼'}
      </button>
      {showNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">{step.teacherNote}</div>
      )}

      <motion.button
        whileHover={allRevealed ? { scale: 1.03 } : {}}
        whileTap={allRevealed ? { scale: 0.97 } : {}}
        onClick={() => allRevealed && onNext()}
        disabled={!allRevealed}
        className="w-full py-4 rounded-2xl text-white font-black text-lg transition-all disabled:opacity-30"
        style={{ background: themeColor }}
      >
        {allRevealed ? 'Continue →' : `Read all ${step.content.body.length} sections to continue`}
      </motion.button>
    </motion.div>
  );
}
