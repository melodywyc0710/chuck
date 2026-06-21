import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import type { HomeworkStep as HomeworkStepType } from '../../data/types';
import { useAppStore } from '../../store/appStore';

interface Props { step: HomeworkStepType; onNext: () => void; themeColor: string; mascot: string; }

export default function HomeworkStep({ step, onNext, themeColor, mascot }: Props) {
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const density = useAppStore(s => s.profile?.density ?? 'younger');

  const themeDark = themeColor; // fallback — homework step doesn't need separate dark

  return (
    <div className="flex flex-col min-h-[85vh]">
      <div className="flex-1 px-4 pt-5 pb-4 space-y-5">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wide">
          <Home size={11} /> Homework
        </span>

        <h2 className={`font-black text-gray-800 leading-snug ${density === 'younger' ? 'text-2xl' : 'text-xl'}`}>
          {step.title}
        </h2>

        {/* Due card */}
        <div className="rounded-2xl p-4 border-2 border-yellow-200 bg-yellow-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-200 flex items-center justify-center flex-shrink-0">
            <Home size={20} color="#92400e" />
          </div>
          <div>
            <div className="font-black text-yellow-800">Due next class</div>
            <div className="text-sm text-yellow-700 font-medium">
              {density === 'younger'
                ? "Ask a grown-up to help if you need!"
                : "Allow about 20–25 minutes. No stress!"}
            </div>
          </div>
        </div>

        {/* Mascot */}
        <div className="flex items-start gap-3 rounded-2xl p-4" style={{ background: '#fffbeb', border: '2px solid #fde68a' }}>
          <span className="text-2xl">{mascot === 'owl' ? '🦉' : mascot === 'fox' ? '🦊' : '🐼'}</span>
          <p className="text-yellow-800 text-sm font-medium">
            {density === 'younger'
              ? "You're almost done for today! Take this list home and try your best."
              : "Completing homework helps your brain consolidate today's learning. Good luck!"}
          </p>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {step.tasks.map((task, i) => (
            <div key={task.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full text-white flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5"
                  style={{ background: themeColor, boxShadow: `0 3px 0 ${themeDark}` }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-gray-700 font-semibold ${density === 'younger' ? 'text-base' : 'text-sm'}`}>
                    {task.label}
                  </p>
                  <button
                    onClick={() => setShowHints(h => ({ ...h, [task.id]: !h[task.id] }))}
                    className="flex items-center gap-1 text-xs font-black mt-2 uppercase tracking-wide"
                    style={{ color: themeColor }}
                  >
                    {showHints[task.id]
                      ? <><ChevronUp size={12} /> Hide hint</>
                      : <><ChevronDown size={12} /> Show hint</>
                    }
                  </button>
                  {showHints[task.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 rounded-xl px-3 py-2 text-xs font-medium"
                      style={{ background: themeColor + '12', color: themeColor }}
                    >
                      {task.hint}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Print */}
        <button
          onClick={() => window.print()}
          className="btn-duo btn-ghost w-full py-3 rounded-2xl flex items-center justify-center gap-2 no-print"
        >
          <Printer size={16} /> Print Homework List
        </button>
      </div>

      {/* Bottom button */}
      <div className="px-4 pb-8 pt-2">
        <button
          onClick={onNext}
          className="btn-duo w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide text-white"
          style={{ background: themeColor, borderBottomColor: themeDark }}
        >
          FINISH SESSION 🎉
        </button>
      </div>
    </div>
  );
}
