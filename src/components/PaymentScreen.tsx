import { useState, useEffect } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { initRevenueCat, getOfferings, purchasePackage, getCustomerInfo, getActiveTier } from '../lib/revenuecat';
import type { Package } from '@revenuecat/purchases-js';
import type { SubscriptionTier } from '../lib/species';

interface Props {
  onBack: () => void;
}

const PLAN_META: Record<string, {
  tier: SubscriptionTier;
  name: string;
  price: string;
  features: string[];
}> = {
  iam_plus: {
    tier: 'plus',
    name: 'Plus',
    price: '$1.99/mo',
    features: [
      'Unlimited goals',
      'Full history — forever',
      'Unlock Lolo & Didi species',
      'Exclusive seasonal costumes',
    ],
  },
  iam_pro: {
    tier: 'pro',
    name: 'Pro',
    price: '$4.99/mo',
    features: [
      'Everything in Plus',
      'AI daily check-in from your pet',
      'Priority witness notifications',
      'Trait radar & weekly analytics',
      'Unlock all species',
    ],
  },
};

const FREE_FEATURES = [
  'Up to 5 goals total',
  '30-day history',
  '1 species (Melmel)',
  'Friends & witness',
];

export default function PaymentScreen({ onBack }: Props) {
  const profile = useAuthStore(s => s.profile);
  const user = useAuthStore(s => s.user);
  const setProfile = useAuthStore(s => s.setProfileLocal);

  const currentTier = (profile?.subscription_tier ?? 'free') as SubscriptionTier;
  const [selected, setSelected] = useState<'free' | 'iam_plus' | 'iam_pro'>(
    currentTier === 'pro' ? 'iam_pro' : currentTier === 'plus' ? 'iam_plus' : 'iam_plus'
  );
  const [packages, setPackages] = useState<{ plus: Package | null; pro: Package | null }>({ plus: null, pro: null });
  const [loading, setLoading] = useState(false);
  const [rcReady, setRcReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    initRevenueCat(user.id).then(async () => {
      setRcReady(true);
      const offering = await getOfferings();
      const pkgs = offering?.availablePackages ?? [];
      const plus = pkgs.find((p: Package) =>
        p.identifier === '$rc_monthly' ||
        p.webBillingProduct?.identifier?.toLowerCase().includes('plus') ||
        p.identifier?.toLowerCase().includes('plus')
      ) ?? pkgs[0] ?? null;
      const pro = pkgs.find((p: Package) =>
        p.identifier === 'iam_pro' ||
        p.webBillingProduct?.identifier?.toLowerCase().includes('pro') ||
        p.identifier?.toLowerCase().includes('pro')
      ) ?? null;
      setPackages({ plus, pro });
    }).catch(() => setRcReady(false));
  }, [user]);

  async function subscribe() {
    if (!user || selected === 'free') return;
    const pkg = selected === 'iam_plus' ? packages.plus : packages.pro;
    if (!pkg) { setError('Package not available — please try again.'); return; }
    setLoading(true);
    setError(null);
    try {
      const ok = await purchasePackage(pkg);
      if (ok) {
        // sync entitlement back to our profile
        const info = await getCustomerInfo();
        const newTier = getActiveTier(info);
        setProfile({ ...profile!, subscription_tier: newTier });
        setSuccess(true);
        setTimeout(() => { setSuccess(false); onBack(); }, 1500);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Purchase failed';
      if (!msg.includes('cancel')) setError(msg);
    }
    setLoading(false);
  }

  const tierOrder: SubscriptionTier[] = ['free', 'plus', 'pro'];
  const selectedTier = selected === 'free' ? 'free' : PLAN_META[selected].tier;
  const isCurrentPlan = selectedTier === currentTier;
  const isDowngrade = tierOrder.indexOf(selectedTier) < tierOrder.indexOf(currentTier);

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
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#C9181822', color: '#C91818' }}>
                {currentTier === 'pro' ? 'Pro' : 'Plus'} active
              </span>
            </div>
          )}
        </div>

        {/* Free plan */}
        <div className="space-y-3 fade-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setSelected('free')}
            className="w-full text-left rounded-[24px] p-5 transition-all"
            style={{
              background: selected === 'free' ? '#141414' : '#0a0a0a',
              border: selected === 'free' ? '1.5px solid #C91818' : '1.5px solid #1e1e1e',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-base" style={{ letterSpacing: '-0.02em' }}>Free</span>
                {currentTier === 'free' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">current</span>}
              </div>
              <span className="text-white font-semibold text-lg" style={{ letterSpacing: '-0.03em' }}>$0</span>
            </div>
            <div className="space-y-1.5">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={11} strokeWidth={2.5} className={selected === 'free' ? 'text-white/70' : 'text-white/20'} />
                  <span className={`text-xs ${selected === 'free' ? 'text-white/60' : 'text-white/25'}`}>{f}</span>
                </div>
              ))}
            </div>
          </button>

          {/* Paid plans */}
          {(['iam_plus', 'iam_pro'] as const).map(key => {
            const meta = PLAN_META[key];
            const active = selected === key;
            const isCurrent = meta.tier === currentTier;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className="w-full text-left rounded-[24px] p-5 transition-all"
                style={{
                  background: active ? '#141414' : '#0a0a0a',
                  border: active ? '1.5px solid #C91818' : '1.5px solid #1e1e1e',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-base" style={{ letterSpacing: '-0.02em' }}>{meta.name}</span>
                    {isCurrent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">current</span>}
                  </div>
                  <span className="text-white font-semibold" style={{ letterSpacing: '-0.03em', fontSize: 15 }}>{meta.price}</span>
                </div>
                <div className="space-y-1.5">
                  {meta.features.map(f => (
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

        {/* Error */}
        {error && <p className="mt-4 text-red-400/80 text-xs text-center">{error}</p>}

        {/* CTA */}
        <div className="mt-8 fade-up" style={{ animationDelay: '0.25s' }}>
          {selected === 'free' ? (
            <button
              disabled={isCurrentPlan || loading}
              className="w-full py-4 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: '#1e1e1e', color: 'rgba(255,255,255,0.4)' }}
            >
              {isCurrentPlan ? 'Your current plan' : 'Downgrade to Free'}
            </button>
          ) : (
            <button
              onClick={subscribe}
              disabled={isCurrentPlan || loading || success || !rcReady}
              className="w-full py-4 rounded-2xl text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: '#C91818' }}
            >
              {success
                ? '✓ Plan updated'
                : loading
                ? 'Processing…'
                : !rcReady
                ? 'Loading…'
                : isCurrentPlan
                ? `${PLAN_META[selected].name} is your current plan`
                : isDowngrade
                ? `Switch to ${PLAN_META[selected].name}`
                : `Upgrade to ${PLAN_META[selected].name} — ${PLAN_META[selected].price}`}
            </button>
          )}
          <p className="text-white/20 text-[10px] text-center mt-3">Cancel anytime · No commitment</p>
        </div>
      </div>
    </>
  );
}
