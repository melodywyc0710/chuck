import { Purchases, type Offering } from '@revenuecat/purchases-js';

const RC_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY ?? 'test_QobIQdvwgRHLYcIfwVtLsGzctsj';

let _purchases: Purchases | null = null;

export async function initRevenueCat(userId: string): Promise<void> {
  _purchases = Purchases.configure(RC_API_KEY, userId);
}

export async function getOfferings(): Promise<Offering | null> {
  if (!_purchases) return null;
  const offerings = await _purchases.getOfferings();
  console.log('[RC] offerings:', JSON.stringify(offerings, null, 2));
  return offerings.current ?? offerings.all?.['default'] ?? Object.values(offerings.all ?? {})[0] ?? null;
}

export async function purchasePackage(rcPackage: import('@revenuecat/purchases-js').Package): Promise<boolean> {
  if (!_purchases) return false;
  const result = await _purchases.purchase({ rcPackage });
  return !!result.customerInfo;
}

export async function getCustomerInfo() {
  if (!_purchases) return null;
  return _purchases.getCustomerInfo();
}

export function getActiveTier(customerInfo: Awaited<ReturnType<typeof getCustomerInfo>>): 'free' | 'plus' | 'pro' {
  if (!customerInfo) return 'free';
  const entitlements = customerInfo.entitlements.active;
  if ('pro' in entitlements) return 'pro';
  if ('plus' in entitlements) return 'plus';
  return 'free';
}
