import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { SubscriptionTier } from '../lib/species';

interface Props {
  onBack: () => void;
}

const PLANS = [
  {
    tier: 'free' as SubscriptionTier,
    name: 'Free',
    price: '$0',
    period: '',
    features: [
      'Up to 5 goals total',
      '30-day history',
      '1 species (Melmel)',
      'Friends & witness',
    ],
  },
  {
    tier: 'plus' as SubscriptionTier,
    name: 'Plus',
    price: '$4.99',
    period: '/mo',
    features: [
      'Unlimited goals',
      'Full history — forever',
      'Unlock Lolo & Didi species',
      'Exclusive seasonal costumes',
    ],
  },
  {
    tier: 'pro' as SubscriptionTier,
    name: 'Pro',
    price: '$9.99',
    period: '/mo',
    features: [
      'Everything in Plus',
      'AI daily check-in from your pet',
      'Priority witness notifications',
      'Trait radar & weekly analytics',
      'Unlock all species',
    ],
  },
];

export default function PaymentScreen({ onBack }: Props) {
  const profile = useAuthStore(s => s.profile);
  const user = useAuthStore(s => s.user);
  const setProfile = useAuthStore(s => s.setProfileLocal);

  const currentTier = profile?.subscription_tier ?? 'free';
  const [selected, setSelected] = useState<SubscriptionTier>(
    currentTier === 'free' ? 'plus' : currentTier
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function subscribe() {
    if (!user || selected === currentTier) return;
    setLoading(true);
    // TODO: replace with Stripe/RevenueCat payment flow
    const { data } = await supabase
      .from('profiles')
      .update({ subscription_tier: selected })
      .eq('id', user.id)
      .select()
      .single();
    if (data) {
      setProfile(data);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onBack(); }, 1500);
    }
    setLoading(false);
  }

  const plan = PLANS.find(p => p.tier === selected)!;
  const isCurrentPlan = selected === currentTier;
  const isDowngrade = PLANS.findIndex(p => p.tier === selected) < PLANS.findIndex(p => p.tier === currentTier);

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-6 pt-14 pb-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10 fade-up" style={{ animationDelay: '0.05s' }}>
          <button
            onClick={onBack}
            className="liquid-glass w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white/90 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <p className="text-white/40 text-xs">subscription</p>
            <h1 className="text-white text-xl font-semibold" style={{ letterSpacing: '-0.02em' }}>Plans</h1>
          </div>
          {currentTier !== 'free' && (
            <div className="ml-auto">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: currentTier === 'pro' ? '#FF4D4D22' : '#3D8EFF22',
                  color: currentTier === 'pro' ? '#FF4D4D' : '#3D8EFF',
                }}
              >
                {currentTier === 'pro' ? 'Pro' : 'Plus'} active
              </span>
            </div>
          )}
        </div>

        {/* Plan selector */}
        <div className="space-y-3 fade-up" style={{ animationDelay: '0.1s' }}>
          {PLANS.map(p => {
            const active = selected === p.tier;
            const isCurrent = p.tier === currentTier;
            return (
              <button
                key={p.tier}
                onClick={() => setSelected(p.tier)}
                className="w-full text-left rounded-[24px] p-5 transition-all"
                style={{
                  background: active ? '#141414' : '#0a0a0a',
                  border: active ? '1.5px solid #FF4D4D' : '1.5px solid #1e1e1e',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-base" style={{ letterSpacing: '-0.02em' }}>{p.name}</span>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">current</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-semibold text-lg" style={{ letterSpacing: '-0.03em' }}>{p.price}</span>
                    {p.period && <span className="text-white/30 text-xs">{p.period}</span>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check size={11} strokeWidth={2.5} className={active ? 'text-white/70' : 'text-white/20'} />
                      <span className={`text-xs ${active ? 'text-white/60' : 'text-white/25'}`}>{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 fade-up" style={{ animationDelay: '0.25s' }}>
          {selected === 'free' ? (
            <button
              onClick={isCurrentPlan ? undefined : subscribe}
              disabled={isCurrentPlan || loading}
              className="w-full py-4 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.4)' }}
            >
              {isCurrentPlan ? 'Your current plan' : 'Downgrade to Free'}
            </button>
          ) : (
            <button
              onClick={subscribe}
              disabled={isCurrentPlan || loading || success}
              className="w-full py-4 rounded-2xl text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: '#FF4D4D' }}
            >
              {success
                ? '✓ Plan updated'
                : loading
                ? 'Processing…'
                : isCurrentPlan
                ? `${plan.name} is your current plan`
                : isDowngrade
                ? `Switch to ${plan.name}`
                : `Upgrade to ${plan.name} — ${plan.price}/mo`}
            </button>
          )}
          <p className="text-white/20 text-[10px] text-center mt-3">Cancel anytime · No commitment</p>
        </div>
      </div>
    </>
  );
}
