export type GradeLevel = 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type SubjectId = 'math' | 'science' | 'language' | 'social';

export type PortalRole = 'student' | 'parent' | 'admin';

export type DeviceView = 'desktop' | 'iphone' | 'android' | 'ipad' | 'tablet';

export interface VisualManipulativeData {
  type: 'fraction_bar' | 'base_ten' | 'balance_scale' | 'number_line' | 'canadian_currency' | 'science_cell' | 'geometry_shape';
  data: any;
}

export interface Question {
  id: string;
  skillId: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  visual?: VisualManipulativeData;
  difficulty: 'easy' | 'medium' | 'hard' | 'challenge';
}

export interface CurriculumSkill {
  id: string; // e.g., 'ON-M3-B1.1'
  curriculumCode: string; // e.g., 'B1.1'
  title: string;
  subject: SubjectId;
  grade: GradeLevel;
  strand: string; // e.g., 'Number Sense & Operations'
  substrand?: string;
  description: string;
  ontarioExpectation: string; // Official curriculum expectation text
  smartScore?: number; // 0 - 100
  questionsAnswered?: number;
  isMastered?: boolean;
  questions: Question[];
}

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string; // e.g. '🦊' or '🚀' or '🦉'
  grade: GradeLevel;
  targetSchoolBoard: string; // e.g. 'Toronto District School Board (TDSB)'
  totalQuestions: number;
  totalTimeMinutes: number;
  currentStreakDays: number;
  masteredSkillsCount: number;
  diagnosticOverallScore: number; // 300 - 800
  diagnosticGradeLevel: string; // e.g. "Grade 3.6"
  stickersEarned: string[];
  recentHurdles: Array<{
    skillId: string;
    skillTitle: string;
    misconception: string;
    parentTip: string;
    detectedAt: string;
  }>;
}

export interface TutorMessage {
  id: string;
  sender: 'lumi' | 'student';
  text: string;
  timestamp: string;
  conceptTip?: string;
  misconceptionNote?: string;
  audioUrl?: string;
  isReading?: boolean;
}

export interface DiagnosticAssessment {
  overallScore: number; // e.g. 460
  gradeEquivalent: string; // e.g. "Grade 4.2"
  mathStrands: {
    numberSense: number;
    algebraCoding: number;
    dataLiteracy: number;
    spatialSense: number;
    financialLiteracy: number;
  };
  scienceStrands: {
    stemSkills: number;
    lifeSystems: number;
    matterEnergy: number;
    earthSpace: number;
  };
  keyStrengths: string[];
  growthAreas: string[];
  recommendations: Array<{
    code: string;
    title: string;
    reason: string;
  }>;
}
