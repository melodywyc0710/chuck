import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
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
}

export default function WorkoutTemplates({ onStartTemplate }: Props) {
  const user = useAuthStore(s => s.user);
  const startWorkout = useWorkoutStore(s => s.startWorkout);
  const addExercise = useWorkoutStore(s => s.addExercise);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

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
  }

  function handleStart(t: Template) {
    startWorkout(t.name);
    const sorted = [...t.template_exercises].sort((a, b) => a.exercise_order - b.exercise_order);
    for (const te of sorted) {
      const ex = te.exercise_slug ? BUILT_IN_EXERCISES.find(e => e.slug === te.exercise_slug) : null;
      if (ex) addExercise(ex);
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

  if (templates.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <p className="text-white/25 text-sm">No templates yet</p>
        <p className="text-white/15 text-xs mt-1">Save a workout as a template to reuse it quickly</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {templates.map(t => (
        <div
          key={t.id}
          className="rounded-[20px] overflow-hidden"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="px-4 py-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-white/85 text-sm font-semibold">{t.name}</p>
                <p className="text-white/25 text-[10px] mt-0.5">
                  {t.template_exercises.length} exercise{t.template_exercises.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button onClick={() => handleDelete(t.id)} className="text-white/15 hover:text-red-400 transition-colors p-1">
                <Trash2 size={13} />
              </button>
            </div>

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
                  </span>
                ))}
            </div>

            <button
              onClick={() => handleStart(t)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{ background: '#FF4D4D' }}
            >
              Start this template
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
