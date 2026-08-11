import { useState, useEffect } from 'react';
import { X, Dumbbell, History, Bookmark, User } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import ActiveWorkout from './ActiveWorkout';
import WorkoutSummary from './WorkoutSummary';
import WorkoutHistory from './WorkoutHistory';
import WorkoutTemplates from './WorkoutTemplates';
import TemplateEditor from './TemplateEditor';
import type { Promise_ } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

type Tab = 'plans' | 'history';
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

  const [tab, setTab] = useState<Tab>('plans');
  const [phase, setPhase] = useState<WorkoutPhase>(active ? 'active' : 'menu');
  const [fitnessPromises, setFitnessPromises] = useState<Promise_[]>([]);
  const [showBodyWeightPrompt, setShowBodyWeightPrompt] = useState(false);
  const [bwInput, setBwInput] = useState('');
  const [savingBw, setSavingBw] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<{ id?: string; name?: string } | null>(null);
  const [templatesKey, setTemplatesKey] = useState(0);

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

  if (phase === 'active') {
    return (
      <ActiveWorkout
        onFinish={handleFinishWorkout}
        onDiscard={() => { discardWorkout(); setPhase('menu'); }}
      />
    );
  }

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

  if (editingTemplate !== null) {
    return (
      <TemplateEditor
        templateId={editingTemplate.id}
        initialName={editingTemplate.name ?? ''}
        onClose={() => setEditingTemplate(null)}
        onSaved={() => {
          setEditingTemplate(null);
          setTemplatesKey(k => k + 1);
        }}
      />
    );
  }

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
            { key: 'plans' as const, label: 'Plans', Icon: Bookmark },
            { key: 'history' as const, label: 'History', Icon: History },
          ]).map(({ key, label, Icon }) => (
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
          {tab === 'plans' && (
            <div className="space-y-4">
              <WorkoutTemplates
                key={templatesKey}
                onStartTemplate={() => setPhase('active')}
                onEdit={(id, name) => setEditingTemplate({ id, name })}
                onCreateNew={() => setEditingTemplate({})}
              />

              {/* Start empty as secondary option */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} className="pt-4">
                <button
                  onClick={handleStartEmpty}
                  className="w-full py-3 rounded-2xl text-sm text-white/40 hover:text-white/70 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  Start empty workout
                </button>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <WorkoutHistory onRepeat={() => setPhase('active')} />
          )}
        </div>
      </div>
    </>
  );
}
