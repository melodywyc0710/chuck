import { useState } from 'react';
import { motion } from 'framer-motion';
import type { HomeworkStep as HomeworkStepType } from '../../data/types';
import { useAppStore } from '../../store/appStore';

interface Props { step: HomeworkStepType; onNext: () => void; themeColor: string; mascot: string; }

export default function HomeworkStep({ step, onNext, themeColor, mascot }: Props) {
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const density = useAppStore(s => s.profile?.density ?? 'younger');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ background: themeColor }}>
          🏠
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Homework</div>
          <h2 className="font-black text-gray-800 text-xl">{step.title}</h2>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-2xl">📋</span>
        <div>
          <div className="font-bold text-amber-800">Due next class</div>
          <div className="text-sm text-amber-700">
            {density === 'younger'
              ? "These are tasks to do at home. Ask a grown-up to help if you need!"
              : "Complete these tasks before the next lesson. Allow about 20–25 minutes."}
          </div>
        </div>
      </div>

      {/* Mascot */}
      <div className="flex items-center gap-3 bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
        <span className="text-3xl">{mascot}</span>
        <p className="text-yellow-800 text-sm font-medium">
          {density === 'younger'
            ? "You're almost done for today! Take this list home and try your best."
            : "Completing homework helps your brain remember what you've learned today. Good luck!"}
        </p>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {step.tasks.map((task, i) => (
          <div key={task.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full text-white flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5"
                style={{ background: themeColor }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p className={`text-gray-700 font-medium ${density === 'younger' ? 'text-base' : 'text-sm'}`}>
                  {task.label}
                </p>
                <button
                  onClick={() => setShowHints(h => ({ ...h, [task.id]: !h[task.id] }))}
                  className="text-xs text-indigo-500 hover:text-indigo-700 mt-1 underline"
                >
                  {showHints[task.id] ? 'Hide hint ▲' : '💡 Show hint ▼'}
                </button>
                {showHints[task.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-xs text-indigo-700"
                  >
                    {task.hint}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Print button */}
      <button
        onClick={() => window.print()}
        className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors no-print"
      >
        🖨️ Print Homework List
      </button>

      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full py-4 rounded-2xl text-white font-black text-lg"
        style={{ background: themeColor }}
      >
        Finish Session 🎉
      </motion.button>
    </motion.div>
  );
}
