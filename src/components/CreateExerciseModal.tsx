import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { CustomExercise, ExerciseCategory, Equipment, MuscleGroup, TrackingType } from '../lib/workoutTypes';
import { CATEGORY_LABELS, MUSCLE_LABELS, EQUIPMENT_LABELS } from '../lib/exerciseData';

const TRACKING_LABELS: Record<TrackingType, string> = {
  weight_reps: 'Weight + Reps',
  bodyweight_reps: 'Bodyweight Reps',
  timed: 'Timed',
  cardio_distance: 'Cardio (distance + time)',
  cardio_duration: 'Cardio (duration)',
  distance_weight_time: 'Distance + Weight + Time',
  rounds: 'Rounds',
};

interface Props {
  onCreated: (exercise: CustomExercise) => void;
  onClose: () => void;
}

export default function CreateExerciseModal({ onCreated, onClose }: Props) {
  const user = useAuthStore(s => s.user);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('free_weights');
  const [equipment, setEquipment] = useState<Equipment>('barbell');
  const [primaryMuscle, setPrimaryMuscle] = useState<MuscleGroup>('chest');
  const [trackingType, setTrackingType] = useState<TrackingType>('weight_reps');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim()) { setError('Exercise name is required'); return; }
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const row = {
        user_id: user.id,
        name: name.trim(),
        category,
        equipment,
        primary_muscle: primaryMuscle,
        secondary_muscles: [],
        tracking_type: trackingType,
        default_met: 4.5,
        instructions: instructions.trim() || null,
        active: true,
      };
      const { data, error: err } = await supabase.from('custom_exercises').insert(row).select().single();
      if (err) throw new Error(err.message);
      onCreated(data as CustomExercise);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-t-[32px] pb-safe" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <span className="text-white font-semibold text-sm">Custom Exercise</span>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-white/40 text-[10px] uppercase tracking-widest">Exercise Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Romanian Deadlift"
              className="mt-1.5 w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Category */}
          <Field label="Category">
            <select value={category} onChange={e => setCategory(e.target.value as ExerciseCategory)} className="styled-select">
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>

          {/* Equipment */}
          <Field label="Equipment">
            <select value={equipment} onChange={e => setEquipment(e.target.value as Equipment)} className="styled-select">
              {Object.entries(EQUIPMENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>

          {/* Primary muscle */}
          <Field label="Primary Muscle">
            <select value={primaryMuscle} onChange={e => setPrimaryMuscle(e.target.value as MuscleGroup)} className="styled-select">
              {Object.entries(MUSCLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>

          {/* Tracking type */}
          <Field label="Tracking Type">
            <select value={trackingType} onChange={e => setTrackingType(e.target.value as TrackingType)} className="styled-select">
              {Object.entries(TRACKING_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>

          {/* Instructions */}
          <div>
            <label className="text-white/40 text-[10px] uppercase tracking-widest">Instructions (optional)</label>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Notes on how to perform this exercise…"
              rows={3}
              className="mt-1.5 w-full px-4 py-3 rounded-2xl text-white/80 text-sm outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-50"
            style={{ background: '#FF4D4D' }}
          >
            {loading ? <Loader size={16} className="animate-spin mx-auto" /> : 'Save Exercise'}
          </button>
        </div>
      </div>

      <style>{`
        .styled-select {
          width: 100%;
          margin-top: 6px;
          padding: 12px 16px;
          border-radius: 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          font-size: 14px;
          outline: none;
          appearance: none;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-white/40 text-[10px] uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}
