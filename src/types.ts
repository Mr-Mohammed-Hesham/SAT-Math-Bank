export type ModuleType = 1 | 2;

export type QuestionCategory =
  | 'Algebra'
  | 'Advanced Math'
  | 'Problem-Solving and Data Analysis'
  | 'Geometry and Trigonometry';

export type QuestionFormat = 'MCQ' | 'SPR'; // Multiple Choice vs Student-Produced Response (Grid-in)

export interface QuestionOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect?: boolean;
}

export interface QuestionVisualData {
  type: 'linear-graph' | 'scatterplot' | 'triangle' | 'circle' | 'table' | 'inequality-graph' | 'parabola' | 'system-graph';
  title?: string;
  data?: any;
}

export interface QuestionItem {
  id: string; // e.g. "M1-Q1"
  module: ModuleType;
  questionNumber: number;
  category: QuestionCategory;
  categoryAr: string;
  format: QuestionFormat;
  questionText: string;
  questionTextAr?: string;
  equation?: string;
  visual?: QuestionVisualData;
  options?: QuestionOption[];
  correctAnswer: string; // e.g. "B" or "100"
  acceptableAnswers?: string[];
  explanation: {
    en: string;
    ar: string;
    steps: string[];
    desmosTip?: string;
    teacherNote?: string;
  };
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pageInPdf?: number;
}

export interface TestExam {
  id: string;
  title: string;
  titleAr: string;
  subtitle?: string;
  subtitleAr?: string;
  badge?: string;
  badgeColor?: string;
  difficulty?: 'Balanced' | 'Standard' | 'Advanced' | 'Hard';
  difficultyRating?: 'Standard' | 'Challenging' | 'Expert (Hard Module Focus)';
  description: string;
  descriptionAr: string;
  date?: string;
  totalQuestions: number;
  modules: number;
  questions: QuestionItem[];
}

export interface FilterState {
  testId: string;
  module: 'all' | 1 | 2;
  category: 'all' | QuestionCategory;
  format: 'all' | QuestionFormat;
  difficulty: 'all' | 'Easy' | 'Medium' | 'Hard';
  searchQuery: string;
  bookmarkedOnly: boolean;
  viewMode: 'study' | 'quiz' | 'print';
}
