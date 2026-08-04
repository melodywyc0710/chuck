export type SubscriptionTier = 'free' | 'plus' | 'pro';

export interface Species {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requiredTier: SubscriptionTier;
  personality: string;
  stages?: string[]; // image paths for stage 1-5
}

// Returns the stage image URL for a given species and level
export function getStageImage(speciesId: string, level: number): string | null {
  const species = SPECIES_LIST.find(s => s.id === speciesId);
  if (!species?.stages) return null;
  const stageIndex = Math.min(Math.floor((level - 1) / 5), species.stages.length - 1);
  return species.stages[Math.max(0, stageIndex)];
}

export const SPECIES_LIST: Species[] = [
  {
    id: 'melmel',
    name: 'Melmel',
    emoji: '🦌',
    description: 'Soft, gentle, always by your side',
    requiredTier: 'free',
    personality: 'gentle',
    stages: [
      '/species/melmel-1.png',
      '/species/melmel-2.png',
      '/species/melmel-3.png',
      '/species/melmel-4.png',
      '/species/melmel-5.png',
    ],
  },
  {
    id: 'lolo',
    name: 'Lolo',
    emoji: '🦊',
    description: 'Clever and curious, loves a challenge',
    requiredTier: 'plus',
    personality: 'clever',
  },
  {
    id: 'didi',
    name: 'Didi',
    emoji: '🐉',
    description: 'Fierce and loyal, grows stronger with you',
    requiredTier: 'plus',
    personality: 'fierce',
  },
  {
    id: 'chacha',
    name: 'Chacha',
    emoji: '🐺',
    description: 'Mysterious and resilient, a rare companion',
    requiredTier: 'pro',
    personality: 'resilient',
  },
  {
    id: 'kiki',
    name: 'Kiki',
    emoji: '🦋',
    description: 'Radiant and free, transcends limits',
    requiredTier: 'pro',
    personality: 'radiant',
  },
];

export function canAccessSpecies(tier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const order: SubscriptionTier[] = ['free', 'plus', 'pro'];
  return order.indexOf(tier) >= order.indexOf(requiredTier);
}

export function isPlus(tier: SubscriptionTier) {
  return tier === 'plus' || tier === 'pro';
}

export function isPro(tier: SubscriptionTier) {
  return tier === 'pro';
}
