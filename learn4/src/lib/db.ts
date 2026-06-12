import { supabase } from './supabase';
import type { Subject } from '../store/appStore';

// Inline to avoid circular import with appStore
interface SessionResult {
  sessionId: string;
  subject: Subject;
  completedAt: string;
  score: number;
  total: number;
  starsEarned: number;
  freeResponses: Record<string, string>;
  homeworkSet: boolean;
  timeSpentMinutes: number;
}

export interface DbProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  mascot: string;
  density: string;
  color_theme: string;
  teacher_id: string | null;
  created_at: string;
}

export async function upsertProfile(profile: Omit<DbProfile, 'created_at'>) {
  const { error } = await supabase.from('profiles').upsert(profile);
  if (error) console.error('upsertProfile', error);
}

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data ?? null;
}

export async function fetchAllStudents(): Promise<DbProfile[]> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('name');
  return data ?? [];
}

export async function saveSessionResult(studentId: string, result: SessionResult) {
  const { error } = await supabase.from('session_results').insert({
    student_id: studentId,
    session_id: result.sessionId,
    subject: result.subject,
    completed_at: result.completedAt,
    score: result.score,
    total: result.total,
    stars_earned: result.starsEarned,
    free_responses: result.freeResponses,
    homework_set: result.homeworkSet,
    time_spent_minutes: result.timeSpentMinutes,
  });
  if (error) console.error('saveSessionResult', error);
}

export type { SessionResult as DbSessionResult };

export async function fetchStudentResults(studentId: string): Promise<SessionResult[]> {
  const { data } = await supabase
    .from('session_results')
    .select('*')
    .eq('student_id', studentId)
    .order('completed_at');
  if (!data) return [];
  return data.map(r => ({
    sessionId: r.session_id as string,
    subject: r.subject as Subject,
    completedAt: r.completed_at as string,
    score: r.score as number,
    total: r.total as number,
    starsEarned: r.stars_earned as number,
    freeResponses: (r.free_responses ?? {}) as Record<string, string>,
    homeworkSet: r.homework_set as boolean,
    timeSpentMinutes: r.time_spent_minutes as number,
  }));
}
