import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronUp, ChevronDown, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import ExercisePicker from './ExercisePicker';
import type { BuiltInExercise, CustomExercise } from '../lib/workoutTypes';

interface LocalExercise {
  localId: string;
  dbId?: string;
  exercise_slug: string | null;
  exercise_name: string;
  default_sets: number;
  target_weight: number | null;
  target_reps: number | null;
}

interface Props {
  templateId?: string; // undefined = new template
  initialName?: string;
  onClose: () => void;
  onSaved: () => void;
}

function uid() { return Math.random().toString(36).slice(2); }

export default function TemplateEditor({ templateId, initialName = '', onClose, onSaved }: Props) {
  const user = useAuthStore(s => s.user);
  const [name, setName] = useState(initialName);
  const [exercises, setExercises] = useState<LocalExercise[]>([]);
  const [loading, setLoading] = useState(!!templateId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!templateId) return;
    load();
  }, [templateId]);

  async function load() {
    setLoading(true);
    const { data: tmpl } = await supabase
      .from('workout_templates')
      .select('name')
      .eq('id', templateId)
      .single();
    if (tmpl) setName(tmpl.name);

    const { data: exs } = await supabase
      .from('template_exercises')
      .select('*')
      .eq('template_id', templateId)
      .order('exercise_order');

    if (exs) {
      setExercises(exs.map((e: any) => ({
        localId: uid(),
        dbId: e.id,
        exercise_slug: e.exercise_slug,
        exercise_name: e.exercise_name,
        default_sets: e.default_sets ?? 3,
        target_weight: e.target_weight ?? null,
        target_reps: e.target_reps ?? null,
      })));
    }
    setLoading(false);
  }

  function addExercise(ex: BuiltInExercise | CustomExercise) {
    const slug = 'slug' in ex ? ex.slug : null;
    setExercises(prev => [...prev, {
      localId: uid(),
      exercise_slug: slug,
      exercise_name: ex.name,
      default_sets: 3,
      target_weight: null,
      target_reps: null,
    }]);
    setShowPicker(false);
  }

  function updateEx(localId: string, updates: Partial<LocalExercise>) {
    setExercises(prev => prev.map(e => e.localId === localId ? { ...e, ...updates } : e));
  }

  function removeEx(localId: string) {
    setExercises(prev => prev.filter(e => e.localId !== localId));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setExercises(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  }

  function moveDown(index: number) {
    setExercises(prev => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  }

  async function save() {
    if (!user || !name.trim()) { setError('Template name is required'); return; }
    setSaving(true);
    setError(null);
    try {
      let tid = templateId;

      if (!tid) {
        const { data, error: e } = await supabase
          .from('workout_templates')
          .insert({ user_id: user.id, name: name.trim() })
          .select()
          .single();
        if (e) throw new Error(e.message);
        tid = data.id;
      } else {
        await supabase.from('workout_templates').update({ name: name.trim(), updated_at: new Date().toISOString() }).eq('id', tid);
      }

      // Delete existing exercises and re-insert in correct order
      await supabase.from('template_exercises').delete().eq('template_id', tid);
      if (exercises.length > 0) {
        const rows = exercises.map((e, i) => ({
          template_id: tid,
          exercise_slug: e.exercise_slug,
          exercise_name: e.exercise_name,
          exercise_order: i,
          default_sets: e.default_sets,
          target_weight: e.target_weight,
          target_reps: e.target_reps,
        }));
        const { error: ie } = await supabase.from('template_exercises').insert(rows);
        if (ie) throw new Error(ie.message);
      }

      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (showPicker) {
    return (
      <ExercisePicker
        onSelect={addExercise}
        onCreateCustom={() => setShowPicker(false)}
        onClose={() => setShowPicker(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
          <X size={20} />
        </button>
        <span className="text-white/60 text-sm">{templateId ? 'Edit Plan' : 'New Plan'}</span>
        <button
          onClick={save}
          disabled={saving || !name.trim()}
          className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
          style={{ background: '#FF4D4D' }}
        >
          {saving ? <Loader size={14} className="animate-spin" /> : 'Save'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Name */}
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Push Day, Leg Day, Upper Body…"
          className="w-full bg-transparent text-white text-xl font-semibold outline-none"
          style={{ letterSpacing: '-0.03em' }}
          autoFocus={!templateId}
        />

        {error && <p className="text-red-400 text-xs">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
          </div>
        ) : (
          <>
            {/* Exercise list */}
            {exercises.length === 0 && (
              <p className="text-white/20 text-sm text-center py-4">No exercises yet — add some below</p>
            )}

            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div
                  key={ex.localId}
                  className="rounded-[18px] px-4 py-3 space-y-3"
                  style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Exercise header */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button onClick={() => moveUp(i)} disabled={i === 0} className="text-white/20 hover:text-white/50 disabled:opacity-20 transition-colors">
                        <ChevronUp size={13} />
                      </button>
                      <button onClick={() => moveDown(i)} disabled={i === exercises.length - 1} className="text-white/20 hover:text-white/50 disabled:opacity-20 transition-colors">
                        <ChevronDown size={13} />
                      </button>
                    </div>
                    <p className="flex-1 text-white/80 text-sm font-semibold truncate">{ex.exercise_name}</p>
                    <button onClick={() => removeEx(ex.localId)} className="text-white/15 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Defaults row */}
                  <div className="flex items-center gap-3">
                    <DefaultField
                      label="Sets"
                      value={ex.default_sets}
                      onInc={() => updateEx(ex.localId, { default_sets: ex.default_sets + 1 })}
                      onDec={() => updateEx(ex.localId, { default_sets: Math.max(1, ex.default_sets - 1) })}
                      onChange={v => updateEx(ex.localId, { default_sets: Math.max(1, parseInt(v) || 1) })}
                    />
                    <DefaultField
                      label="Weight"
                      value={ex.target_weight ?? ''}
                      onInc={() => updateEx(ex.localId, { target_weight: (ex.target_weight ?? 0) + 2.5 })}
                      onDec={() => updateEx(ex.localId, { target_weight: Math.max(0, (ex.target_weight ?? 0) - 2.5) })}
                      onChange={v => updateEx(ex.localId, { target_weight: v === '' ? null : parseFloat(v) || null })}
                      suffix="kg"
                      placeholder="—"
                    />
                    <DefaultField
                      label="Reps"
                      value={ex.target_reps ?? ''}
                      onInc={() => updateEx(ex.localId, { target_reps: (ex.target_reps ?? 0) + 1 })}
                      onDec={() => updateEx(ex.localId, { target_reps: Math.max(1, (ex.target_reps ?? 1) - 1) })}
                      onChange={v => updateEx(ex.localId, { target_reps: v === '' ? null : parseInt(v) || null })}
                      placeholder="—"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add exercise */}
            <button
              onClick={() => setShowPicker(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[18px] text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              <Plus size={15} />
              Add Exercise
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function DefaultField({
  label, value, onInc, onDec, onChange, suffix, placeholder = '',
}: {
  label: string;
  value: number | string;
  onInc: () => void;
  onDec: () => void;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex-1">
      <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={onDec}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 transition-colors shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-xs font-bold leading-none">−</span>
        </button>
        <div className="flex-1 flex items-center justify-center gap-0.5 min-w-0">
          <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-white/80 text-xs font-semibold text-center outline-none"
            style={{ minWidth: 0 }}
          />
          {suffix && <span className="text-white/30 text-[10px] shrink-0">{suffix}</span>}
        </div>
        <button
          onClick={onInc}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 transition-colors shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-xs font-bold leading-none">+</span>
        </button>
      </div>
    </div>
  );
}
