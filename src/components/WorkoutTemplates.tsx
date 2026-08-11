import { useEffect, useState } from 'react';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useWorkoutStore } from '../store/workoutStore';
import { BUILT_IN_EXERCISES } from '../lib/exerciseData';

interface TemplateExercise {
  id: string;
  template_id: string;
  exercise_slug: string | null;
  exercise_name: string;
  exercise_order: number;
  default_sets: number;
  target_reps: number | null;
  target_weight: number | null;
  rest_seconds: number | null;
}

interface Template {
  id: string;
  user_id: string;
  name: string;
  notes: string | null;
  created_at: string;
  template_exercises: TemplateExercise[];
}

interface Props {
  onStartTemplate: () => void;
  onEdit: (id: string, name: string) => void;
  onCreateNew: () => void;
}

export default function WorkoutTemplates({ onStartTemplate, onEdit, onCreateNew }: Props) {
  const user = useAuthStore(s => s.user);
  const startWorkout = useWorkoutStore(s => s.startWorkout);
  const addExerciseWithDefaults = useWorkoutStore(s => s.addExerciseWithDefaults);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('workout_templates')
      .select('*, template_exercises(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setTemplates(data as Template[]);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await supabase.from('workout_templates').delete().eq('id', id);
    setTemplates(prev => prev.filter(t => t.id !== id));
    setConfirmDelete(null);
  }

  function handleStart(t: Template) {
    startWorkout(t.name);
    const sorted = [...t.template_exercises].sort((a, b) => a.exercise_order - b.exercise_order);
    for (const te of sorted) {
      const ex = te.exercise_slug ? BUILT_IN_EXERCISES.find(e => e.slug === te.exercise_slug) : null;
      if (ex) {
        addExerciseWithDefaults(ex, {
          sets: te.default_sets ?? 3,
          weight: te.target_weight != null ? String(te.target_weight) : '',
          reps: te.target_reps != null ? String(te.target_reps) : '',
        });
      }
    }
    onStartTemplate();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Create new plan */}
      <button
        onClick={onCreateNew}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-medium text-white/60 hover:text-white/90 transition-colors"
        style={{ background: 'rgba(255,77,77,0.08)', border: '1px dashed rgba(255,77,77,0.3)' }}
      >
        <Plus size={15} style={{ color: '#FF4D4D' }} />
        <span>Create Workout Plan</span>
      </button>

      {templates.length === 0 && (
        <p className="text-white/20 text-sm text-center py-8">No plans yet — create one above</p>
      )}

      {templates.map(t => (
        <div
          key={t.id}
          className="rounded-[20px] overflow-hidden"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="px-4 py-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-white/85 text-sm font-semibold truncate">{t.name}</p>
                <p className="text-white/25 text-[10px] mt-0.5">
                  {t.template_exercises.length} exercise{t.template_exercises.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(t.id, t.name)}
                  className="text-white/20 hover:text-white/60 transition-colors p-1.5"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setConfirmDelete(t.id)}
                  className="text-white/15 hover:text-red-400 transition-colors p-1.5"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Delete confirmation */}
            {confirmDelete === t.id && (
              <div className="mb-3 px-3 py-2.5 rounded-xl flex items-center justify-between gap-3" style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)' }}>
                <p className="text-white/50 text-xs">Delete this plan?</p>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmDelete(null)} className="text-white/35 text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-white text-xs px-2 py-1 rounded-lg font-semibold" style={{ background: '#FF4D4D' }}>
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Exercise chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {t.template_exercises
                .sort((a, b) => a.exercise_order - b.exercise_order)
                .map(te => (
                  <span
                    key={te.id}
                    className="text-[10px] px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {te.exercise_name}
                    {(te.target_weight || te.target_reps) && (
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {te.target_weight ? ` ${te.target_weight}kg` : ''}
                        {te.target_reps ? ` ×${te.target_reps}` : ''}
                      </span>
                    )}
                  </span>
                ))}
            </div>

            <button
              onClick={() => handleStart(t)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{ background: '#FF4D4D' }}
            >
              Start this plan
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
