import { useState } from 'react';
import { X, Check, Timer, Hash, TrendingDown, BookOpen, List, Dumbbell, Activity, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { TrackingType, HabitFrequency } from '../lib/habitTypes';

interface Props {
  onSaved: () => void;
  onClose: () => void;
  existingCategories?: string[];
  defaultCategory?: string;
}

const TRACKING_TYPES: { type: TrackingType; label: string; desc: string; Icon: React.ElementType }[] = [
  { type: 'complete',  label: 'Complete',  desc: 'Simple yes / no',         Icon: Check },
  { type: 'timer',     label: 'Timer',     desc: 'Track time spent',         Icon: Timer },
  { type: 'counter',   label: 'Counter',   desc: 'Count repetitions',        Icon: Hash },
  { type: 'numeric',   label: 'Number',    desc: 'Record a measurement',     Icon: Activity },
  { type: 'avoid',     label: 'Avoid',     desc: 'Reduce or quit something', Icon: TrendingDown },
  { type: 'journal',   label: 'Journal',   desc: 'Written reflection',       Icon: BookOpen },
  { type: 'checklist', label: 'Checklist', desc: 'Repeatable list of steps', Icon: List },
  { type: 'workout',   label: 'Workout',   desc: 'Gym sessions & exercise',  Icon: Dumbbell },
];

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: 'daily',    label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'weekly',   label: 'Weekly' },
];

const DAYS: { value: HabitFrequency; label: string }[] = [
  { value: 'monday',    label: 'Mon' },
  { value: 'tuesday',   label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday',  label: 'Thu' },
  { value: 'friday',    label: 'Fri' },
  { value: 'saturday',  label: 'Sat' },
  { value: 'sunday',    label: 'Sun' },
];

export default function HabitCreator({ onSaved, onClose, existingCategories = [], defaultCategory = '' }: Props) {
  const user = useAuthStore(s => s.user);
  const [category, setCategory] = useState(defaultCategory);
  const [name, setName] = useState('');
  const [trackingType, setTrackingType] = useState<TrackingType>('complete');
  const [targetValue, setTargetValue] = useState<string>('');
  const [targetUnit, setTargetUnit] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [checklistItems, setChecklistItems] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);

  function addChecklistItem() { setChecklistItems(p => [...p, '']); }
  function updateChecklistItem(i: number, v: string) {
    setChecklistItems(p => p.map((x, idx) => idx === i ? v : x));
  }
  function removeChecklistItem(i: number) {
    setChecklistItems(p => p.filter((_, idx) => idx !== i));
  }

  const [saveError, setSaveError] = useState<string | null>(null);

  async function save() {
    if (!user || !name.trim()) return;
    setSaving(true);
    setSaveError(null);
    const items = trackingType === 'checklist'
      ? checklistItems.map(s => s.trim()).filter(Boolean)
      : [];
    const payload = {
      user_id: user.id,
      name: name.trim(),
      icon: trackingType,
      tracking_type: trackingType,
      target_value: targetValue ? parseFloat(targetValue) : null,
      target_unit: targetUnit.trim() || null,
      frequency,
      checklist_items: items,
      sort_order: Math.floor(Date.now() / 1000),
      archived: false,
      category: category.trim() || null,
    };

    let { data: inserted, error } = await supabase.from('habits').insert(payload).select('id').single();

    // Fallback: schema cache may not know about `category` yet — insert without it
    if (error?.message?.includes('category')) {
      const { category: _cat, ...payloadWithoutCat } = payload;
      const fallback = await supabase.from('habits').insert(payloadWithoutCat).select('id').single();
      inserted = fallback.data;
      error = fallback.error;
      // Store category locally until DB is ready
      if (!error && inserted && payload.category) {
        localStorage.setItem(`habit-cat-${inserted.id}`, payload.category);
      }
    }

    setSaving(false);
    if (error) {
      console.error('Failed to save habit:', error);
      setSaveError(error.message);
      return;
    }
    onSaved();
  }

  const cfg = TRACKING_TYPES.find(t => t.type === trackingType)!;
  const showTarget = ['timer', 'counter', 'numeric'].includes(trackingType);
  const otherCats = existingCategories.filter(c => c !== category.trim());

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[32px] pb-safe"
        style={{ background: '#111111', border: '1px solid #1e1e1e', maxHeight: '88vh', overflowY: 'auto' }}
      >
        <div className="px-5 pt-5 pb-8">
          <div className="w-8 h-1 rounded-full bg-white/15 mx-auto mb-5" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-base" style={{ letterSpacing: '-0.02em' }}>New Habit</h2>
            <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Category */}
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Category</p>
              {defaultCategory ? (
                <div className="px-3 py-2.5 rounded-xl" style={{ background: '#1e1e1e' }}>
                  <p className="text-white text-sm font-medium">{defaultCategory}</p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="e.g. Fitness, Focus, Health…"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    autoFocus
                    className="w-full text-white text-sm font-medium bg-transparent outline-none placeholder-white/20 px-3 py-2.5 rounded-xl"
                    style={{ background: '#1e1e1e' }}
                  />
                  {otherCats.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {otherCats.map(c => (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all"
                          style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.5)' }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Name */}
            <input
              type="text"
              placeholder="Name your habit…"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus={!!defaultCategory}
              className="w-full text-white text-base font-medium bg-transparent outline-none placeholder-white/20"
            />

            {/* Tracking type */}
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">How to track</p>
              <div className="grid grid-cols-2 gap-1.5">
                {TRACKING_TYPES.map(t => (
                  <button
                    key={t.type}
                    onClick={() => setTrackingType(t.type)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                    style={{
                      background: trackingType === t.type ? '#2d1515' : '#181818',
                      border: `1px solid ${trackingType === t.type ? '#5c2020' : 'transparent'}`,
                    }}
                  >
                    <t.Icon size={13} style={{ color: trackingType === t.type ? '#FF4D4D' : 'rgba(255,255,255,0.35)', flexShrink: 0 }} strokeWidth={1.5} />
                    <span className="text-xs font-medium truncate" style={{ color: trackingType === t.type ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)' }}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
              {cfg && <p className="text-white/25 text-[10px] mt-1.5">{cfg.desc}</p>}
            </div>

            {/* Target (timer/counter/numeric) */}
            {showTarget && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Target</p>
                  <input
                    type="number" inputMode="decimal" placeholder="e.g. 30"
                    value={targetValue} onChange={e => setTargetValue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: '#1e1e1e' }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Unit</p>
                  <input
                    type="text"
                    placeholder={trackingType === 'timer' ? 'min' : trackingType === 'counter' ? 'times' : 'kg'}
                    value={targetUnit} onChange={e => setTargetUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: '#1e1e1e' }}
                  />
                </div>
              </div>
            )}

            {/* Checklist items */}
            {trackingType === 'checklist' && (
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Steps</p>
                <div className="space-y-2">
                  {checklistItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text" placeholder={`Step ${i + 1}…`}
                        value={item} onChange={e => updateChecklistItem(i, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-white/80 text-sm outline-none"
                        style={{ background: '#1e1e1e' }}
                      />
                      {checklistItems.length > 1 && (
                        <button onClick={() => removeChecklistItem(i)} className="text-white/20 hover:text-red-400 transition-colors">
                          <Minus size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addChecklistItem} className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors">
                    <Plus size={12} /> Add step
                  </button>
                </div>
              </div>
            )}

            {/* Frequency */}
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Frequency</p>
              <div className="flex gap-1.5 flex-wrap mb-2">
                {FREQUENCIES.map(f => (
                  <button
                    key={f.value} onClick={() => setFrequency(f.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: frequency === f.value ? '#2e2e2e' : '#1a1a1a',
                      color: frequency === f.value ? 'white' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                {DAYS.map(d => (
                  <button
                    key={d.value} onClick={() => setFrequency(d.value)}
                    className="flex-1 py-1.5 rounded-xl text-[11px] font-medium transition-all"
                    style={{
                      background: frequency === d.value ? '#2e2e2e' : '#1a1a1a',
                      color: frequency === d.value ? 'white' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {saveError && (
              <p className="text-xs px-1" style={{ color: '#FF4D4D' }}>
                Failed to save: {saveError}
              </p>
            )}

            {/* Save */}
            <button
              onClick={save}
              disabled={saving || !name.trim()}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
              style={{ background: '#FF4D4D' }}
            >
              {saving ? 'Saving…' : 'Add Habit'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
