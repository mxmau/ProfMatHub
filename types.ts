export type ContentType = 'lesson' | 'exercise' | 'activity' | 'exam' | 'practical';

export interface LessonContent {
  intro: string;
  development: string[];
  examples: { question: string; answer: string }[];
  conclusion: string;
}

export interface AssessmentQuestion {
  question: string;
  options?: string[];
  answer: string; // Answer key / Explanation
  spaceForWork?: boolean; // If true, leaves space for calculation in print mode
  imageUrl?: string; // Optional image URL for geometry or visual questions
}

export interface Item {
  id: string;
  type: ContentType;
  title: string;
  skill?: string;
  duration?: string; // e.g., "50 min" ou "2 aulas"
  complexity?: 'Baixa' | 'Média' | 'Alta';
  content?: LessonContent;
  questions?: AssessmentQuestion[];
  practicalDescription?: string; // For practical lessons
}

export interface Unit {
  id: string;
  title: string;
  dateRange: string;
  description: string;
  color: string; // Hex color for calendar
  items: Item[];
  bnccSkills?: string[]; // Detailed skills list
}

export interface Grade {
  id: string;
  title: string;
  units: Unit[];
}
