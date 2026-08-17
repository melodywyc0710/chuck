import { useState } from 'react';
import { X, Shield, CheckCircle2 } from 'lucide-react';
import type { TaskVerifyResult } from '../lib/aiTypes';

interface Props {
  taskTitle: string;
  taskNotes: string | null;
  color: string;
  onConfirm: (verifyResult: TaskVerifyResult) => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function PhotoVerifyModal({ taskTitle, taskNotes, color, onConfirm, onSkip, onClose }: Props) {
  const [reflection, setReflection] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  function handleConfirm() {
    setConfirmed(true);
    // Produce a TaskVerifyResult-shaped object so callers stay compatible
    const result: TaskVerifyResult = {
      status: 'verified',
      confidence: 100,
      reasoning: reflection.trim() || 'Marked complete by user.',
    };
    setTimeout(() => onConfirm(result), 380);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-t-[32px] pb-safe"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color }} />
            <span className="text-white font-medium text-sm">Complete habit</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          <p className="text-white/60 text-sm font-medium">{taskTitle}</p>
          {taskNotes && <p className="text-white/30 text-xs">{taskNotes}</p>}

          {/* Confirmation tap */}
          <button
            onClick={handleConfirm}
            disabled={confirmed}
            className="w-full h-28 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.97]"
            style={{
              background: confirmed ? `${color}22` : `${color}14`,
              border: `2px solid ${confirmed ? color : `${color}40`}`,
            }}
          >
            <CheckCircle2
              size={36}
              style={{ color: confirmed ? color : `${color}80` }}
              className={`transition-all duration-300${confirmed ? ' scale-110' : ''}`}
            />
            <p className="text-sm font-semibold" style={{ color: confirmed ? color : 'rgba(255,255,255,0.5)' }}>
              {confirmed ? 'Marked complete!' : 'Tap to confirm you did this'}
            </p>
          </button>

          {/* Optional reflection note */}
          {!confirmed && (
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Note (optional)</p>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="How did it go?"
                rows={2}
                className="w-full bg-transparent text-white/70 text-sm outline-none resize-none placeholder:text-white/20 border-b pb-1"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              />
            </div>
          )}

          {!confirmed && (
            <button
              onClick={onSkip}
              className="w-full py-3 rounded-2xl text-sm text-white/30 hover:text-white/60 transition-colors flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <Shield size={13} />
              Complete without confirming
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
