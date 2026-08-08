// Shared TypeScript schemas for AI feature inputs and outputs.

export interface FoodItem {
  name: string;
  calories: number;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  portion: string;
}

export interface FoodPhotoResult {
  items: FoodItem[];
  total_calories: number;
  total_protein_g: number | null;
  total_carbs_g: number | null;
  total_fat_g: number | null;
  confidence: 'high' | 'medium' | 'low';
  notes: string | null;
  follow_up_question: string | null;
}

export type VerificationStatus =
  | 'verified'
  | 'likely_verified'
  | 'uncertain'
  | 'insufficient_evidence';

export interface TaskVerifyResult {
  status: VerificationStatus;
  confidence: number; // 0–100
  reasoning: string;
}

export interface HabitInsight {
  type: 'pattern' | 'recommendation' | 'streak' | 'drop_off';
  title: string;
  body: string;
}

export interface HabitInsightsResult {
  insights: HabitInsight[];
  summary: string | null;
}
