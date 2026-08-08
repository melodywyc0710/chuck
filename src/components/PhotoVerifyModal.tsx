import { useRef, useState } from 'react';
import { X, Camera, Loader, ShieldCheck, ShieldQuestion, ShieldAlert, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { TaskVerifyResult, VerificationStatus } from '../lib/aiTypes';

function resizeAndEncode(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 800;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('canvas')); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/jpeg', 0.82);
      resolve({ base64: data.split(',')[1], mediaType: 'image/jpeg' });
    };
    img.onerror = reject;
    img.src = url;
  });
}

const STATUS_CONFIG: Record<VerificationStatus, { label: string; color: string; Icon: React.ElementType }> = {
  verified:              { label: 'Verified',            color: '#10B981', Icon: ShieldCheck },
  likely_verified:       { label: 'Likely completed',    color: '#84CC16', Icon: ShieldCheck },
  uncertain:             { label: 'Uncertain',           color: '#F59E0B', Icon: ShieldQuestion },
  insufficient_evidence: { label: 'Needs clearer photo', color: '#EF4444', Icon: ShieldAlert },
};

interface Props {
  taskTitle: string;
  taskNotes: string | null;
  color: string;
  onConfirm: (verifyResult: TaskVerifyResult) => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function PhotoVerifyModal({ taskTitle, taskNotes, color, onConfirm, onSkip, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TaskVerifyResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const { base64, mediaType } = await resizeAndEncode(file);
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-task-photo`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${session?.access_token ?? ''}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            imageBase64: base64,
            mediaType,
            taskTitle,
            taskNotes,
          }),
        },
      );
      const json: TaskVerifyResult & { error?: string } = await res.json();
      if (json.error) throw new Error(json.error);
      setResult(json);
    } catch (e) {
      setError((e as Error).message || 'Verification failed. Try again or skip.');
    } finally {
      setLoading(false);
    }
  }

  const statusCfg = result ? STATUS_CONFIG[result.status] : null;

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
            <Camera size={16} style={{ color }} />
            <span className="text-white font-medium text-sm">Photo Proof</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Task name */}
          <p className="text-white/50 text-xs">{taskTitle}</p>

          {/* Photo area */}
          {!result && !loading && (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: `2px dashed ${color}40` }}
            >
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover rounded-2xl" />
              ) : (
                <>
                  <Camera size={28} style={{ color, opacity: 0.6 }} />
                  <p className="text-white/40 text-sm">Take a photo showing you completed this</p>
                </>
              )}
            </button>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader size={22} style={{ color }} className="animate-spin" />
              <p className="text-white/40 text-sm">Reviewing your photo…</p>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(248,113,113,0.1)' }}>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {result && statusCfg && (
            <>
              {preview && (
                <img src={preview} alt="" className="w-full h-28 object-cover rounded-2xl" />
              )}
              {/* Status */}
              <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl" style={{ background: `${statusCfg.color}14` }}>
                <statusCfg.Icon size={18} style={{ color: statusCfg.color }} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm" style={{ color: statusCfg.color }}>{statusCfg.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{result.reasoning}</p>
                </div>
              </div>
              {/* Disclaimer */}
              <p className="text-white/20 text-[10px] text-center px-2">
                AI assessment is approximate and cannot definitively prove completion.
              </p>
            </>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-1">
            {result ? (
              <button
                onClick={() => onConfirm(result)}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
                style={{ background: statusCfg?.color ?? color }}
              >
                Mark complete
              </button>
            ) : !loading && (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
                style={{ background: color }}
              >
                Choose photo
              </button>
            )}
            {result && (
              <button
                onClick={() => { setResult(null); setPreview(null); fileRef.current?.click(); }}
                className="text-white/25 text-xs text-center py-1 hover:text-white/50 transition-colors"
              >
                Retake photo
              </button>
            )}
            <button
              onClick={onSkip}
              className="w-full py-3 rounded-2xl text-sm text-white/30 hover:text-white/60 transition-colors flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <Shield size={13} />
              Complete without photo
            </button>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>
    </div>
  );
}
