import { useState } from 'react';
import { X, Check, Timer, Hash, TrendingDown, BookOpen, List, Dumbbell, Activity, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { TrackingType, HabitFrequency } from '../lib/habitTypes';

interface Props {
  onSaved: () => void;
  onClose: () => void;
}

const TRACKING_TYPES: { type: TrackingType; label: string; desc: string; Icon: React.ElementType }[] = [
  { type: 'complete',  label: 'Complete',     desc: 'Simple yes / no',          Icon: Check },
  { type: 'timer',     label: 'Timer',        desc: 'Track time spent',          Icon: Timer },
  { type: 'counter',   label: 'Counter',      desc: 'Count repetitions',         Icon: Hash },
  { type: 'numeric',   label: 'Number',       desc: 'Record a measurement',      Icon: Activity },
  { type: 'avoid',     label: 'Avoid',        desc: 'Reduce or quit something',  Icon: TrendingDown },
  { type: 'journal',   label: 'Journal',      desc: 'Written reflection',        Icon: BookOpen },
  { type: 'checklist', label: 'Checklist',    desc: 'Repeatable list of steps',  Icon: List },
  { type: 'workout',   label: 'Workout',      desc: 'Log gym session',           Icon: Dumbbell },
];

interface Preset {
  name: string;
  type: TrackingType;
  icon: string;
  target: number | null;
  unit: string | null;
}

const PRESETS: Preset[] = [
  { name: 'Workout',      type: 'workout',  icon: 'dumbbell',  target: null, unit: null },
  { name: 'Study',        type: 'timer',    icon: 'brain',     target: 60,   unit: 'min' },
  { name: 'Read',         type: 'timer',    icon: 'book-open', target: 20,   unit: 'min' },
  { name: 'Journal',      type: 'journal',  icon: 'notebook',  target: null, unit: null },
  { name: 'Drink Water',  type: 'counter',  icon: 'droplets',  target: 8,    unit: 'glasses' },
  { name: 'No Smoking',   type: 'avoid',    icon: 'ban',       target: null, unit: null },
  { name: 'Meditate',     type: 'timer',    icon: 'heart',     target: 10,   unit: 'min' },
  { name: 'Custom',       type: 'complete', icon: 'check',     target: null, unit: null },
];

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: 'daily',    label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'weekly',   label: 'Weekly' },
];

export default function HabitCreator({ onSaved, onClose }: Props) {
  const user = useAuthStore(s => s.user);
  const [name, setName] = useState('');
  const [trackingType, setTrackingType] = useState<TrackingType>('complete');
  const [targetValue, setTargetValue] = useState<string>('');
  const [targetUnit, setTargetUnit] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [checklistItems, setChecklistItems] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<'preset' | 'configure'>('preset');

  function applyPreset(p: Preset) {
    setName(p.name === 'Custom' ? '' : p.name);
    setTrackingType(p.type);
    setTargetValue(p.target != null ? String(p.target) : '');
    setTargetUnit(p.unit ?? '');
    setStep('configure');
  }

  function addChecklistItem() {
    setChecklistItems(prev => [...prev, '']);
  }
  function updateChecklistItem(i: number, v: string) {
    setChecklistItems(prev => prev.map((x, idx) => idx === i ? v : x));
  }
  function removeChecklistItem(i: number) {
    setChecklistItems(prev => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    if (!user || !name.trim()) return;
    setSaving(true);
    const items = trackingType === 'checklist'
      ? checklistItems.map(s => s.trim()).filter(Boolean)
      : [];
    await supabase.from('habits').insert({
      user_id: user.id,
      name: name.trim(),
      icon: trackingType,
      tracking_type: trackingType,
      target_value: targetValue ? parseFloat(targetValue) : null,
      target_unit: targetUnit.trim() || null,
      frequency,
      checklist_items: items,
      sort_order: Date.now(),
      archived: false,
    });
    setSaving(false);
    onSaved();
  }

  const cfg = TRACKING_TYPES.find(t => t.type === trackingType)!;
  const showTarget = ['timer', 'counter', 'numeric'].includes(trackingType);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[32px] pb-safe"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '88vh', overflowY: 'auto' }}
      >
        <div className="px-5 pt-5 pb-8">
          <div className="w-8 h-1 rounded-full bg-white/15 mx-auto mb-5" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-base" style={{ letterSpacing: '-0.02em' }}>
              {step === 'preset' ? 'Add Habit' : 'Configure'}
            </h2>
            <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Step 1: Presets */}
          {step === 'preset' && (
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => {
                const T = TRACKING_TYPES.find(t => t.type === p.type);
                const Icon = T?.Icon ?? Check;
                return (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-[18px] text-left transition-all active:scale-[0.97]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,77,77,0.12)' }}>
                      <Icon size={15} style={{ color: '#FF4D4D' }} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">{p.name}</p>
                      {p.target && <p className="text-white/30 text-[10px]">{p.target} {p.unit}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Configure */}
          {step === 'configure' && (
            <div className="space-y-5">
              {/* Name */}
              <input
                type="text"
                placeholder="Habit name…"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
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
                        background: trackingType === t.type ? 'rgba(255,77,77,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${trackingType === t.type ? 'rgba(255,77,77,0.3)' : 'transparent'}`,
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
                      type="number"
                      inputMode="decimal"
                      placeholder="e.g. 30"
                      value={targetValue}
                      onChange={e => setTargetValue(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Unit</p>
                    <input
                      type="text"
                      placeholder={trackingType === 'timer' ? 'min' : trackingType === 'counter' ? 'times' : 'kg'}
                      value={targetUnit}
                      onChange={e => setTargetUnit(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    />
                  </div>
                </div>
              )}

              {/* Checklist items */}
              {trackingType === 'checklist' && (
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Checklist items</p>
                  <div className="space-y-2">
                    {checklistItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Step ${i + 1}…`}
                          value={item}
                          onChange={e => updateChecklistItem(i, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl text-white/80 text-sm outline-none"
                          style={{ background: 'rgba(255,255,255,0.06)' }}
                        />
                        {checklistItems.length > 1 && (
                          <button onClick={() => removeChecklistItem(i)} className="text-white/20 hover:text-red-400 transition-colors">
                            <Minus size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addChecklistItem}
                      className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors"
                    >
                      <Plus size={12} /> Add item
                    </button>
                  </div>
                </div>
              )}

              {/* Frequency */}
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Frequency</p>
                <div className="flex gap-1.5 flex-wrap">
                  {FREQUENCIES.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setFrequency(f.value)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: frequency === f.value ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                        color: frequency === f.value ? 'white' : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setStep('preset')}
                  className="px-4 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  Back
                </button>
                <button
                  onClick={save}
                  disabled={saving || !name.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
                  style={{ background: '#FF4D4D' }}
                >
                  {saving ? 'Saving…' : 'Add Habit'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
