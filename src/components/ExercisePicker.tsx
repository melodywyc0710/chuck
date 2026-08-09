import { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, ChevronRight, Star } from 'lucide-react';
import { BUILT_IN_EXERCISES, CATEGORY_LABELS, MUSCLE_LABELS, searchExercises } from '../lib/exerciseData';
import type { BuiltInExercise, CustomExercise, ExerciseCategory, MuscleGroup } from '../lib/workoutTypes';

const RECENT_KEY = 'workout_recent_exercises';
const FAVES_KEY = 'workout_fav_exercises';

function getRecentSlugs(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'); } catch { return []; }
}
export function addRecentSlug(slug: string) {
  const recent = getRecentSlugs().filter(s => s !== slug);
  localStorage.setItem(RECENT_KEY, JSON.stringify([slug, ...recent].slice(0, 20)));
}
function getFavSlugs(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVES_KEY) ?? '[]'); } catch { return []; }
}
function toggleFav(slug: string) {
  const favs = getFavSlugs();
  const next = favs.includes(slug) ? favs.filter(s => s !== slug) : [slug, ...favs];
  localStorage.setItem(FAVES_KEY, JSON.stringify(next));
}

const CATEGORIES: { key: ExerciseCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'free_weights', label: 'Free Weights' },
  { key: 'machines', label: 'Machines' },
  { key: 'bodyweight', label: 'Bodyweight' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'functional', label: 'Functional' },
  { key: 'mobility', label: 'Mobility' },
  { key: 'class', label: 'Classes' },
];

interface Props {
  customExercises?: CustomExercise[];
  onSelect: (exercise: BuiltInExercise | CustomExercise) => void;
  onCreateCustom: () => void;
  onClose: () => void;
}

export default function ExercisePicker({ customExercises = [], onSelect, onCreateCustom, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState<ExerciseCategory | 'all'>('all');
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | 'all'>('all');
  const [favSlugs, setFavSlugs] = useState<string[]>(getFavSlugs);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const recentSlugs = getRecentSlugs();
  const recentExercises = recentSlugs
    .map(slug => BUILT_IN_EXERCISES.find(e => e.slug === slug))
    .filter(Boolean) as BuiltInExercise[];

  const results = searchExercises(query, customExercises).filter(ex => {
    if (catFilter !== 'all' && ex.category !== catFilter) return false;
    if (muscleFilter !== 'all' && ex.primary_muscle !== muscleFilter) return false;
    return true;
  });

  const isSearching = query.length > 0 || catFilter !== 'all' || muscleFilter !== 'all';

  function handleToggleFav(slug: string) {
    toggleFav(slug);
    setFavSlugs(getFavSlugs());
  }

  function handleSelect(ex: BuiltInExercise | CustomExercise) {
    const slug = 'slug' in ex ? ex.slug : null;
    if (slug) addRecentSlug(slug);
    onSelect(ex);
    onClose();
  }

  const muscles: (MuscleGroup | 'all')[] = ['all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'abs', 'calves', 'full_body', 'cardio'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <Search size={14} className="text-white/30 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search exercises…"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/30">
              <X size={13} />
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setCatFilter(c.key)}
            className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors"
            style={catFilter === c.key
              ? { background: '#FF4D4D', color: '#fff' }
              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Muscle filter (scrollable) */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none">
        {muscles.map(m => (
          <button
            key={m}
            onClick={() => setMuscleFilter(m)}
            className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors"
            style={muscleFilter === m
              ? { background: 'rgba(255,77,77,0.2)', color: '#FF4D4D', border: '1px solid rgba(255,77,77,0.4)' }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid transparent' }}
          >
            {m === 'all' ? 'All muscles' : MUSCLE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {!isSearching && recentExercises.length > 0 && (
          <Section title="Recent">
            {recentExercises.slice(0, 5).map(ex => (
              <ExerciseRow key={ex.slug} ex={ex} isFav={favSlugs.includes(ex.slug)} onSelect={handleSelect} onToggleFav={() => handleToggleFav(ex.slug)} />
            ))}
          </Section>
        )}

        {!isSearching && favSlugs.length > 0 && (
          <Section title="Favourites">
            {favSlugs
              .map(s => BUILT_IN_EXERCISES.find(e => e.slug === s))
              .filter(Boolean)
              .map(ex => (
                <ExerciseRow key={ex!.slug} ex={ex!} isFav={true} onSelect={handleSelect} onToggleFav={() => handleToggleFav(ex!.slug)} />
              ))}
          </Section>
        )}

        {isSearching ? (
          <Section title={`${results.length} result${results.length !== 1 ? 's' : ''}`}>
            {results.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-white/25 text-sm">No exercises found</p>
                <button onClick={onCreateCustom} className="mt-3 text-white/40 text-xs hover:text-white/60 transition-colors">
                  + Create custom exercise
                </button>
              </div>
            )}
            {results.map((ex) => {
              const isBuiltIn = 'slug' in ex && ex.slug;
              const slug = isBuiltIn ? (ex as BuiltInExercise).slug : '';
              return (
                <ExerciseRow
                  key={isBuiltIn ? slug : (ex as CustomExercise).id}
                  ex={ex}
                  isFav={slug ? favSlugs.includes(slug) : false}
                  onSelect={handleSelect}
                  onToggleFav={slug ? () => handleToggleFav(slug) : undefined}
                />
              );
            })}
          </Section>
        ) : (
          Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
            const items = BUILT_IN_EXERCISES.filter(e => e.category === cat);
            const customItems = customExercises.filter(e => e.category === cat);
            const all = [...items, ...customItems];
            if (all.length === 0) return null;
            return (
              <Section key={cat} title={label}>
                {all.map(ex => {
                  const isBuiltIn = 'slug' in ex && (ex as BuiltInExercise).slug;
                  const slug = isBuiltIn ? (ex as BuiltInExercise).slug : '';
                  return (
                    <ExerciseRow
                      key={isBuiltIn ? slug : (ex as CustomExercise).id}
                      ex={ex}
                      isFav={slug ? favSlugs.includes(slug) : false}
                      onSelect={handleSelect}
                      onToggleFav={slug ? () => handleToggleFav(slug) : undefined}
                    />
                  );
                })}
              </Section>
            );
          })
        )}

        {/* Custom exercises */}
        {!isSearching && customExercises.length > 0 && (
          <Section title="My Exercises">
            {customExercises.map(ex => (
              <ExerciseRow key={ex.id} ex={ex} isFav={false} onSelect={handleSelect} onToggleFav={undefined} />
            ))}
          </Section>
        )}

        <button
          onClick={onCreateCustom}
          className="w-full mt-2 flex items-center gap-2.5 px-4 py-3.5 rounded-2xl transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Plus size={16} className="text-white/40" />
          <span className="text-white/50 text-sm">Create custom exercise</span>
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 mt-3">
      <p className="text-white/25 text-[10px] uppercase tracking-widest font-semibold mb-2 px-1">{title}</p>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function ExerciseRow({
  ex,
  isFav,
  onSelect,
  onToggleFav,
}: {
  ex: BuiltInExercise | CustomExercise;
  isFav: boolean;
  onSelect: (ex: BuiltInExercise | CustomExercise) => void;
  onToggleFav?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl active:opacity-80 transition-opacity"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <button className="flex-1 min-w-0 text-left" onClick={() => onSelect(ex)}>
        <p className="text-white/85 text-sm font-medium truncate">{ex.name}</p>
        <p className="text-white/30 text-[10px] mt-0.5">
          {MUSCLE_LABELS[ex.primary_muscle]} · {CATEGORY_LABELS[ex.category]}
        </p>
      </button>
      {onToggleFav && (
        <button onClick={onToggleFav} className="shrink-0 p-1">
          <Star size={13} style={{ color: isFav ? '#F59E0B' : 'rgba(255,255,255,0.2)', fill: isFav ? '#F59E0B' : 'none' }} />
        </button>
      )}
      <button onClick={() => onSelect(ex)} className="shrink-0 text-white/20 hover:text-white/50 transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
