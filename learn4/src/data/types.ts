export type Subject = 'english' | 'maths' | 'science' | 'hass';

export type StepType = 'video' | 'worked-example' | 'quiz' | 'free-response' | 'homework';

export interface VideoStep {
  id: string; type: 'video';
  title: string; duration: string;
  youtubeId: string;
  youtubeSearchQuery?: string;
  description: string;
  teacherNote: string; keyPoints: string[];
}

export interface WorkedExampleBody {
  label: string; text: string;
  highlight: 'green' | 'blue' | 'orange' | 'purple';
}
export interface WorkedExampleQuestion { q: string; a: string; }
export interface WorkedExampleStep {
  id: string; type: 'worked-example';
  title: string; teacherNote: string;
  content: {
    heading: string;
    body: WorkedExampleBody[];
    questions: WorkedExampleQuestion[];
  };
}

export interface QuizQuestion {
  id: string; text: string; image: string | null;
  options: string[]; correct: number; explanation: string;
}
export interface QuizStep {
  id: string; type: 'quiz';
  title: string; teacherNote: string;
  questions: QuizQuestion[];
}

export interface FreeResponseField {
  id: string; label: string; placeholder: string;
  multiline?: boolean; minRows?: number;
}
export interface FreeResponseStep {
  id: string; type: 'free-response';
  title: string; teacherNote: string;
  prompt: string; fields: FreeResponseField[];
}

export interface HomeworkTask {
  id: string; label: string; hint: string;
}
export interface HomeworkStep {
  id: string; type: 'homework';
  title: string; teacherNote: string;
  dueNext: boolean; tasks: HomeworkTask[];
}

export type LessonStep = VideoStep | WorkedExampleStep | QuizStep | FreeResponseStep | HomeworkStep;

export interface Session {
  id: string; subject: Subject;
  title: string; victorianCode: string;
  description: string; yearLevel: number;
  estimatedMinutes: number; starsAvailable: number;
  color: string; icon: string;
  steps: LessonStep[];
}
