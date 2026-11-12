export type TopicType = 
  | '자연어 처리'
  | '기계학습'
  | '순서도 도형'
  | '실생활 모델링'
  | '파이썬 입출력·자료형'
  | 'if·elif 조건문'
  | 'for·while 반복문';

export type DifficultyType = '기초' | '보통' | '심화';

export interface Question {
  id: string;
  topic: TopicType;
  question: string;
  codeSnippet?: string;
  flowchartData?: {
    steps: {
      shape: 'oval' | 'parallelogram' | 'rectangle' | 'diamond' | 'wave_rect';
      label: string;
      sub?: string;
    }[];
  };
  choices: string[];
  correctIndex: number;
  explanation: string;
  difficulty: DifficultyType;
  conceptTip?: string;
}

export interface ExamResult {
  totalQuestions: number;
  correctCount: number;
  score: number;
  timeSpentSeconds: number;
  topicScores: Record<string, { correct: number; total: number }>;
  userAnswers: Record<string, number>;
}

export type ModelingCategory = '입력 (Input)' | '출력 (Output)' | '조건 (Condition)' | '변수 (Variable)';

export interface ModelingItem {
  id: string;
  text: string;
  category: ModelingCategory;
  hint: string;
}

export interface ModelingScenario {
  id: string;
  title: string;
  icon: string;
  description: string;
  context: string;
  items: ModelingItem[];
  pythonCodePreview: string;
}
