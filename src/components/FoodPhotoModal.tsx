import { useRef, useState } from 'react';
import { X, Camera, Loader, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { FoodPhotoResult, FoodItem } from '../lib/aiTypes';

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
      const base64 = data.split(',')[1];
      resolve({ base64, mediaType: 'image/jpeg' });
    };
    img.onerror = reject;
    img.src = url;
  });
}

const CONFIDENCE_LABEL: Record<string, { text: string; color: string }> = {
  high:   { text: 'High confidence',   color: '#10B981' },
  medium: { text: 'Medium confidence', color: '#F59E0B' },
  low:    { text: 'Low confidence',    color: '#EF4444' },
};

interface Props {
  color: string;
  onSave: (calories: number, note: string) => void;
  onClose: () => void;
}

export default function FoodPhotoModal({ color, onSave, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodPhotoResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<FoodItem[]>([]);
  const [showBreakdown, setShowBreakdown] = useState(true);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const { base64, mediaType } = await resizeAndEncode(file);
      const { data: json, error } = await supabase.functions.invoke('analyse-food-photo', {
        body: { imageBase64: base64, mediaType },
      });
      if (error) throw error;
      const typedJson = json as FoodPhotoResult;
      setResult(typedJson);
      setEditedItems(typedJson.items);
    } catch (e) {
      setError((e as Error).message || 'Analysis failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function updateItemCal(index: number, val: string) {
    setEditedItems(prev => prev.map((it, i) =>
      i === index ? { ...it, calories: parseInt(val) || 0 } : it,
    ));
  }

  const editedTotal = editedItems.reduce((s, it) => s + (it.calories || 0), 0);
  const noteText = editedItems.map(it => `${it.name} (${it.portion})`).join(', ');

  const conf = result ? CONFIDENCE_LABEL[result.confidence] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-t-[32px] pb-safe flex flex-col max-h-[92vh] overflow-hidden"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Camera size={16} style={{ color }} />
            <span className="text-white font-medium text-sm">Snap & Estimate</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-5 space-y-4">

          {/* Photo picker / preview */}
          {!result && !loading && (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-44 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: `2px dashed ${color}40` }}
            >
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover rounded-2xl" />
              ) : (
                <>
                  <Camera size={32} style={{ color, opacity: 0.6 }} />
                  <p className="text-white/40 text-sm">Take or choose a photo of your meal</p>
                </>
              )}
            </button>
          )}

          {preview && result && (
            <img src={preview} alt="" className="w-full h-32 object-cover rounded-2xl" />
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader size={24} style={{ color }} className="animate-spin" />
              <p className="text-white/40 text-sm">Analysing your meal…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl" style={{ background: 'rgba(248,113,113,0.1)' }}>
              <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm">{error}</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-red-400/60 text-xs mt-1 hover:text-red-400 transition-colors"
                >
                  Try another photo
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <>
              {/* Confidence + follow-up */}
              {conf && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${conf.color}22`, color: conf.color }}>
                    {conf.text}
                  </span>
                  {result.notes && <span className="text-white/30 text-xs">{result.notes}</span>}
                </div>
              )}
              {result.follow_up_question && (
                <p className="text-white/40 text-xs px-1">{result.follow_up_question}</p>
              )}

              {/* Total (editable) */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: `${color}18` }}>
                <div className="flex-1">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Total calories</p>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={editedTotal}
                    onChange={e => {
                      const delta = (parseInt(e.target.value) || 0) - editedTotal;
                      if (editedItems.length === 1) {
                        setEditedItems(prev => [{ ...prev[0], calories: parseInt(e.target.value) || 0 }]);
                      } else {
                        // distribute delta to last item
                        setEditedItems(prev => prev.map((it, i) =>
                          i === prev.length - 1 ? { ...it, calories: Math.max(0, it.calories + delta) } : it,
                        ));
                      }
                    }}
                    className="text-white text-3xl font-semibold bg-transparent outline-none w-full"
                    style={{ letterSpacing: '-0.04em', color }}
                  />
                </div>
                <span className="text-white/30 text-sm">kcal</span>
              </div>

              {/* Macro summary */}
              {(result.total_protein_g || result.total_carbs_g || result.total_fat_g) && (
                <div className="flex gap-2">
                  {result.total_protein_g != null && (
                    <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-white/25 text-[9px] uppercase tracking-widest">Protein</p>
                      <p className="text-white text-sm font-medium mt-0.5">{result.total_protein_g}g</p>
                    </div>
                  )}
                  {result.total_carbs_g != null && (
                    <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-white/25 text-[9px] uppercase tracking-widest">Carbs</p>
                      <p className="text-white text-sm font-medium mt-0.5">{result.total_carbs_g}g</p>
                    </div>
                  )}
                  {result.total_fat_g != null && (
                    <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-white/25 text-[9px] uppercase tracking-widest">Fat</p>
                      <p className="text-white text-sm font-medium mt-0.5">{result.total_fat_g}g</p>
                    </div>
                  )}
                </div>
              )}

              {/* Per-item breakdown (collapsible) */}
              {editedItems.length > 1 && (
                <div>
                  <button
                    onClick={() => setShowBreakdown(v => !v)}
                    className="flex items-center gap-1.5 text-white/40 text-xs w-full py-1"
                  >
                    {showBreakdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    Breakdown ({editedItems.length} items)
                  </button>
                  {showBreakdown && (
                    <div className="space-y-2 mt-2">
                      {editedItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{item.name}</p>
                            <p className="text-white/30 text-[10px]">{item.portion}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              inputMode="numeric"
                              value={item.calories}
                              onChange={e => updateItemCal(i, e.target.value)}
                              className="w-14 text-right bg-transparent text-sm font-semibold outline-none"
                              style={{ color }}
                            />
                            <span className="text-white/25 text-[10px]">kcal</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Retry */}
              <button
                onClick={() => { setResult(null); setPreview(null); setEditedItems([]); fileRef.current?.click(); }}
                className="text-white/25 text-xs text-center w-full py-1 hover:text-white/50 transition-colors"
              >
                Retake photo
              </button>
            </>
          )}
        </div>

        {/* Save button */}
        {result && (
          <div className="px-5 pb-6 shrink-0">
            <button
              onClick={() => onSave(editedTotal, noteText)}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{ background: color }}
            >
              Save {editedTotal.toLocaleString()} kcal
            </button>
          </div>
        )}

        {/* Hidden file input */}
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
