import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { SubscriptionTier } from '../lib/species';

interface Props {
  reason?: string; // e.g. "You've reached 5 goals"
  onClose: () => void;
}

const PLANS = [
  {
    tier: 'plus' as SubscriptionTier,
    name: 'Nagi Plus',
    price: '$4.99',
    period: '/mo',
    color: '#7c6af7',
    features: [
      '✦ Unlimited goals',
      '✦ Full history — forever',
      '✦ Unlock Foxling & Drakling species',
      '✦ Exclusive seasonal costumes',
    ],
  },
  {
    tier: 'pro' as SubscriptionTier,
    name: 'Nagi Pro',
    price: '$9.99',
    period: '/mo',
    color: '#e8702a',
    features: [
      '✦ Everything in Plus',
      '✦ AI daily check-in from your pet',
      '✦ Priority witness notifications',
      '✦ Trait radar & weekly analytics',
      '✦ Unlock all species including Shadowpup & Lumenwing',
    ],
  },
];

export default function UpgradeModal({ reason, onClose }: Props) {
  const [selected, setSelected] = useState<SubscriptionTier>('plus');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(s => s.user);
  const setProfile = useAuthStore(s => s.setProfileLocal);

  async function upgrade() {
    if (!user) return;
    setLoading(true);
    // TODO: replace with Stripe/RevenueCat payment flow
    const { data } = await supabase
      .from('profiles')
      .update({ subscription_tier: selected })
      .eq('id', user.id)
      .select()
      .single();
    if (data) setProfile(data);
    setLoading(false);
    onClose();
  }

  const plan = PLANS.find(p => p.tier === selected)!;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}>
      <div className="liquid-glass rounded-[32px] w-full max-w-md p-6 fade-up" style={{ animationDelay: '0s' }}>

        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="font-playfair italic text-white text-2xl" style={{ letterSpacing: '-0.04em' }}>Upgrade Nagi</h2>
            {reason && <p className="text-white/40 text-xs mt-1">{reason}</p>}
          </div>
          <button onClick={onClose} className="liquid-glass w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 transition-colors mt-1">
            <X size={14} />
          </button>
        </div>

        {/* Plan toggle */}
        <div className="flex gap-2 my-5">
          {PLANS.map(p => (
            <button
              key={p.tier}
              onClick={() => setSelected(p.tier)}
              className="flex-1 py-3 rounded-2xl text-center transition-all"
              style={{
                background: selected === p.tier ? p.color + '22' : 'rgba(255,255,255,0.06)',
                border: selected === p.tier ? `1px solid ${p.color}55` : '1px solid transparent',
              }}
            >
              <p className="text-white text-sm font-semibold">{p.name}</p>
              <p className="text-xs mt-0.5" style={{ color: selected === p.tier ? p.color : 'rgba(255,255,255,0.3)' }}>{p.price}<span className="text-[10px]">{p.period}</span></p>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {plan.features.map(f => (
            <p key={f} className="text-white/70 text-sm">{f}</p>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={upgrade}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: plan.color }}
        >
          {loading ? 'Upgrading…' : `Start ${plan.name} — ${plan.price}/mo`}
        </button>
        <p className="text-white/20 text-[10px] text-center mt-3">Cancel anytime · No commitment</p>
      </div>
    </div>
  );
}
