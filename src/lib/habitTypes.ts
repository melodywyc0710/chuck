export type TrackingType =
  | 'complete'
  | 'timer'
  | 'counter'
  | 'numeric'
  | 'avoid'
  | 'journal'
  | 'checklist'
  | 'workout';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'weekly';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  tracking_type: TrackingType;
  target_value: number | null;
  target_unit: string | null;
  frequency: HabitFrequency;
  checklist_items: string[];
  sort_order: number;
  archived: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  user_id: string;
  habit_id: string;
  date_key: string;
  value: number | null;
  notes: string | null;
  logged_at: string;
}
