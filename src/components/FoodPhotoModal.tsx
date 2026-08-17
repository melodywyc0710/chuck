import { useState } from 'react';
import { X, Utensils, Plus, Trash2 } from 'lucide-react';

interface FoodEntry {
  name: string;
  calories: number;
}

const QUICK_PRESETS: { label: string; calories: number }[] = [
  { label: 'Snack ~150', calories: 150 },
  { label: 'Light meal ~400', calories: 400 },
  { label: 'Regular meal ~650', calories: 650 },
  { label: 'Large meal ~900', calories: 900 },
];

interface Props {
  color: string;
  onSave: (calories: number, note: string) => void;
  onClose: () => void;
}

export default function FoodPhotoModal({ color, onSave, onClose }: Props) {
  const [entries, setEntries] = useState<FoodEntry[]>([{ name: '', calories: 0 }]);

  const total = entries.reduce((s, e) => s + (e.calories || 0), 0);
  const noteText = entries.filter(e => e.name.trim()).map(e => `${e.name} (${e.calories} kcal)`).join(', ');

  function updateEntry(i: number, field: keyof FoodEntry, val: string) {
    setEntries(prev => prev.map((e, idx) =>
      idx === i ? { ...e, [field]: field === 'calories' ? (parseInt(val) || 0) : val } : e,
    ));
  }
  function addEntry() { setEntries(prev => [...prev, { name: '', calories: 0 }]); }
  function removeEntry(i: number) { setEntries(prev => prev.filter((_, idx) => idx !== i)); }

  function applyPreset(cal: number) {
    if (entries.length === 1 && !entries[0].name && entries[0].calories === 0) {
      setEntries([{ name: 'Meal', calories: cal }]);
    } else {
      setEntries(prev => [...prev, { name: 'Meal', calories: cal }]);
    }
  }

  const canSave = total > 0;

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
            <Utensils size={16} style={{ color }} />
            <span className="text-white font-medium text-sm">Log food</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-3 space-y-4">

          {/* Quick presets */}
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Quick estimate</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.calories)}
                  className="py-2 px-3 rounded-xl text-xs font-medium transition-all active:scale-[0.96]"
                  style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.55)' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Total display */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: `${color}18` }}>
            <div className="flex-1">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Total calories</p>
              <p className="text-3xl font-semibold" style={{ color, letterSpacing: '-0.04em' }}>
                {total.toLocaleString()}
              </p>
            </div>
            <span className="text-white/30 text-sm">kcal</span>
          </div>

          {/* Food entries */}
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Items</p>
            <div className="space-y-2">
              {entries.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={entry.name}
                      onChange={e => updateEntry(i, 'name', e.target.value)}
                      placeholder="Food name"
                      className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                    />
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={entry.calories || ''}
                      onChange={e => updateEntry(i, 'calories', e.target.value)}
                      placeholder="0"
                      className="w-14 text-right bg-transparent text-sm font-semibold outline-none placeholder:text-white/20"
                      style={{ color }}
                    />
                    <span className="text-white/25 text-[10px]">kcal</span>
                  </div>
                  {entries.length > 1 && (
                    <button onClick={() => removeEntry(i)} className="text-white/20 hover:text-red-400 transition-colors ml-1">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addEntry}
              className="mt-2 flex items-center gap-1.5 text-white/30 text-xs hover:text-white/60 transition-colors py-1"
            >
              <Plus size={13} />
              Add item
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="px-5 pb-6 pt-2 shrink-0">
          <button
            disabled={!canSave}
            onClick={() => onSave(total, noteText || `${total} kcal`)}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-30"
            style={{ background: color }}
          >
            Save {total > 0 ? `${total.toLocaleString()} kcal` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
