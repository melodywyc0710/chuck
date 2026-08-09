import { useState, useEffect } from 'react';
import { X, Dumbbell, Play, History, Bookmark, User, ChevronRight } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import ActiveWorkout from './ActiveWorkout';
import WorkoutSummary from './WorkoutSummary';
import WorkoutHistory from './WorkoutHistory';
import WorkoutTemplates from './WorkoutTemplates';
import type { Promise_ } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { BUILT_IN_EXERCISES } from '../lib/exerciseData';

type Tab = 'start' | 'history' | 'templates';
type WorkoutPhase = 'menu' | 'active' | 'summary';

interface Props {
  onClose: () => void;
}

export default function WorkoutScreen({ onClose }: Props) {
  const active = useWorkoutStore(s => s.active);
  const startWorkout = useWorkoutStore(s => s.startWorkout);
  const discardWorkout = useWorkoutStore(s => s.discardWorkout);
  const getSnapshot = useWorkoutStore(s => s.getSnapshot);
  const user = useAuthStore(s => s.user);
  const profile = useAuthStore(s => s.profile);

  const [tab, setTab] = useState<Tab>('start');
  const [phase, setPhase] = useState<WorkoutPhase>(active ? 'active' : 'menu');
  const [fitnessPromises, setFitnessPromises] = useState<Promise_[]>([]);
  const [showBodyWeightPrompt, setShowBodyWeightPrompt] = useState(false);
  const [bwInput, setBwInput] = useState('');
  const [savingBw, setSavingBw] = useState(false);

  useEffect(() => {
    loadFitnessPromises();
    if (!profile?.body_weight_kg) setShowBodyWeightPrompt(true);
  }, []);

  async function loadFitnessPromises() {
    if (!user) return;
    const { data } = await supabase.from('promises').select('*').eq('user_id', user.id).eq('category', 'fitness').eq('active', true);
    if (data) setFitnessPromises(data as Promise_[]);
  }

  async function saveBodyWeight() {
    if (!user || !bwInput) return;
    setSavingBw(true);
    const kg = parseFloat(bwInput);
    if (!kg || kg <= 0 || kg > 500) { setSavingBw(false); return; }
    await supabase.from('profiles').update({ body_weight_kg: kg }).eq('id', user.id);
    setSavingBw(false);
    setShowBodyWeightPrompt(false);
  }

  function handleStartEmpty() {
    startWorkout('Workout');
    setPhase('active');
  }

  function handleFinishWorkout() {
    setPhase('summary');
  }

  function handleDiscard() {
    discardWorkout();
    setPhase('menu');
  }

  function handleSaved(_calories: number) {
    setPhase('menu');
  }

  // If we have an active workout and we're in active phase, show ActiveWorkout
  if (phase === 'active') {
    return (
      <ActiveWorkout
        onFinish={handleFinishWorkout}
        onDiscard={() => { discardWorkout(); setPhase('menu'); }}
      />
    );
  }

  // Summary
  if (phase === 'summary') {
    const snapshot = getSnapshot();
    if (!snapshot) { setPhase('menu'); return null; }
    return (
      <WorkoutSummary
        workout={snapshot}
        fitnessPromises={fitnessPromises}
        onSaved={handleSaved}
        onDiscard={handleDiscard}
      />
    );
  }

  // Menu
  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-safe pt-6 pb-4">
          <div className="flex items-center gap-2">
            <Dumbbell size={18} style={{ color: '#FF4D4D' }} strokeWidth={1.5} />
            <h1 className="text-white font-semibold text-lg" style={{ letterSpacing: '-0.03em' }}>Gym</h1>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body weight prompt */}
        {showBodyWeightPrompt && (
          <div className="mx-5 mb-4 px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)' }}>
            <p className="text-white/60 text-xs mb-2 flex items-center gap-1">
              <User size={11} />
              Add your body weight for calorie estimates
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="e.g. 75"
                value={bwInput}
                onChange={e => setBwInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              />
              <span className="text-white/30 text-xs self-center">kg</span>
              <button
                onClick={saveBodyWeight}
                disabled={savingBw || !bwInput}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-50"
                style={{ background: '#FF4D4D' }}
              >
                Save
              </button>
              <button onClick={() => setShowBodyWeightPrompt(false)} className="text-white/25 text-xs px-2">
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 mx-5 mb-5 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {([
            { key: 'start', label: 'Start', Icon: Play },
            { key: 'history', label: 'History', Icon: History },
            { key: 'templates', label: 'Templates', Icon: Bookmark },
          ] as const).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors"
              style={tab === key
                ? { background: '#FF4D4D', color: '#fff', borderRadius: 12 }
                : { color: 'rgba(255,255,255,0.35)' }}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          {tab === 'start' && (
            <div className="space-y-4">
              {/* Quick start */}
              <button
                onClick={handleStartEmpty}
                className="w-full flex items-center gap-4 px-5 py-5 rounded-[24px] transition-all active:scale-[0.97]"
                style={{ background: '#FF4D4D' }}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Play size={20} color="#fff" fill="#fff" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-base">Start empty workout</p>
                  <p className="text-white/60 text-xs mt-0.5">Add exercises as you go</p>
                </div>
              </button>

              {/* Resume hint */}
              <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-white/35 text-xs leading-relaxed">
                  Or <button className="text-white/60 underline" onClick={() => setTab('templates')}>start from a template</button> · <button className="text-white/60 underline" onClick={() => setTab('history')}>repeat a past workout</button>
                </p>
              </div>

              {/* Recent workouts preview */}
              <RecentWorkoutsPreview onRepeat={() => setPhase('active')} />
            </div>
          )}

          {tab === 'history' && (
            <WorkoutHistory onRepeat={() => setPhase('active')} />
          )}

          {tab === 'templates' && (
            <WorkoutTemplates onStartTemplate={() => setPhase('active')} />
          )}
        </div>
      </div>
    </>
  );
}

function RecentWorkoutsPreview({ onRepeat }: { onRepeat: () => void }) {
  const user = useAuthStore(s => s.user);
  const startWorkout = useWorkoutStore(s => s.startWorkout);
  const addExercise = useWorkoutStore(s => s.addExercise);
  const [recent, setRecent] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase
      .from('workouts')
      .select('id, name, started_at, workout_exercises(exercise_name, exercise_slug, exercise_order)')
      .eq('user_id', user.id)
      .eq('is_template', false)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setRecent(data); });
  }, []);

  if (recent.length === 0) return null;

  function repeat(w: any) {
    startWorkout(w.name);
    const sorted = [...w.workout_exercises].sort((a: any, b: any) => a.exercise_order - b.exercise_order);
    for (const we of sorted) {
      const ex = we.exercise_slug ? BUILT_IN_EXERCISES.find((e: any) => e.slug === we.exercise_slug) : null;
      if (ex) addExercise(ex);
    }
    onRepeat();
  }

  return (
    <div>
      <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3">Recent</p>
      <div className="space-y-2">
        {recent.map(w => (
          <button
            key={w.id}
            onClick={() => repeat(w)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white/75 text-sm font-medium truncate">{w.name}</p>
              <p className="text-white/25 text-[10px] mt-0.5">
                {new Date(w.started_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                {w.workout_exercises?.length > 0 && ` · ${w.workout_exercises.length} exercises`}
              </p>
            </div>
            <ChevronRight size={14} className="text-white/20 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
