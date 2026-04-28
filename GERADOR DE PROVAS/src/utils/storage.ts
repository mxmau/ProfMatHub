import { ExamParams, ExamData } from '../services/gemini';

export interface StoredExam {
  id: string;
  timestamp: number;
  params: ExamParams;
  examData: ExamData;
}

const STORAGE_KEY = 'ais_exam_bank';

export function saveExamToBank(params: ExamParams, examData: ExamData): void {
  try {
    const exams = getExamsFromBank();
    const newExam: StoredExam = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      params,
      examData
    };
    
    // Keep only the last 50 exams to avoid quota issues
    exams.unshift(newExam);
    if (exams.length > 50) {
      exams.pop();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
  } catch (error) {
    console.error('Error saving exam to bank:', error);
  }
}

export function getExamsFromBank(): StoredExam[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as StoredExam[];
    }
  } catch (error) {
    console.error('Error reading exams from bank:', error);
  }
  return [];
}

export function findSimilarExam(params: ExamParams): StoredExam | null {
  const exams = getExamsFromBank();
  
  // Find an exam with exact matching key parameters
  for (const exam of exams) {
    if (
      exam.params.subject === params.subject &&
      exam.params.grade === params.grade &&
      exam.params.curriculum === params.curriculum &&
      exam.params.topics === params.topics &&
      exam.params.questionCount === params.questionCount &&
      exam.params.difficulty === params.difficulty
    ) {
      return exam;
    }
  }
  
  return null;
}
