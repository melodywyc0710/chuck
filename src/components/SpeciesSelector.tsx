import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { SPECIES_LIST, canAccessSpecies } from '../lib/species';
import UpgradeModal from './UpgradeModal';

interface Props {
  onClose: () => void;
}

export default function SpeciesSelector({ onClose }: Props) {
  const pet = useAuthStore(s => s.pet);
  const profile = useAuthStore(s => s.profile);
  const setPet = useAuthStore(s => s.setPetLocal);
  const user = useAuthStore(s => s.user);
  const [saving, setSaving] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const tier = profile?.subscription_tier ?? 'free';

  async function selectSpecies(speciesId: string) {
    const species = SPECIES_LIST.find(s => s.id === speciesId)!;
    if (!canAccessSpecies(tier, species.requiredTier)) {
      setShowUpgrade(true);
      return;
    }
    if (!pet || !user || pet.species === speciesId) { onClose(); return; }
    setSaving(true);
    const { data } = await supabase
      .from('pets')
      .update({ species: speciesId })
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setPet(data);
    setSaving(false);
    onClose();
  }

  if (showUpgrade) return <UpgradeModal reason="Unlock more species with Nagi Plus" onClose={() => setShowUpgrade(false)} />;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}>
      <div className="liquid-glass rounded-[32px] w-full max-w-md p-6 fade-up" style={{ animationDelay: '0s' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-playfair italic text-white text-2xl" style={{ letterSpacing: '-0.04em' }}>Choose species</h2>
            <p className="text-white/40 text-xs mt-0.5">Your pet's form and soul</p>
          </div>
          <button onClick={onClose} className="liquid-glass w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-2">
          {SPECIES_LIST.map(species => {
            const unlocked = canAccessSpecies(tier, species.requiredTier);
            const active = pet?.species === species.id;
            return (
              <button
                key={species.id}
                onClick={() => selectSpecies(species.id)}
                disabled={saving}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all"
                style={{
                  background: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <span className="text-3xl">{species.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{species.name}</span>
                    {active && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/15 text-white/60">current</span>}
                    {!unlocked && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{
                        background: species.requiredTier === 'pro' ? 'rgba(232,112,42,0.2)' : 'rgba(124,106,247,0.2)',
                        color: species.requiredTier === 'pro' ? '#e8702a' : '#7c6af7',
                      }}>
                        {species.requiredTier === 'pro' ? 'Pro' : 'Plus'}
                      </span>
                    )}
                  </div>
                  <p className="text-white/35 text-xs mt-0.5">{species.description}</p>
                </div>
                {!unlocked
                  ? <Lock size={14} className="text-white/25 flex-shrink-0" />
                  : active
                  ? <div className="w-2 h-2 rounded-full bg-white/60 flex-shrink-0" />
                  : null
                }
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
