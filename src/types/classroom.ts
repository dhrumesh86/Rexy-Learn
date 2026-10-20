export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  todayCompletedCount: number;
  dailyGoalCount: number; // e.g. 5 questions/skills
  streakFreezesAvailable: number;
  weeklyHistory: Array<{
    day: string; // 'Mon', 'Tue', etc.
    date: string;
    completed: boolean;
    questionsCount: number;
    isToday?: boolean;
  }>;
  milestones: Array<{
    days: number;
    title: string;
    reward: string;
    unlocked: boolean;
  }>;
}

export interface GoogleClassroomCourse {
  id: string;
  name: string;
  section: string;
  teacherName: string;
  room: string;
  color: string; // tailwind color class
}

export type AssignmentStatus = 'assigned' | 'in_progress' | 'submitted' | 'graded';

export interface ClassroomAssignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: AssignmentStatus;
  points?: number;
  maxPoints: number;
  teacherFeedback?: string;
  ontarioSkillCode?: string;
  estimatedMinutes: number;
  attachments?: string[];
  submittedAt?: string;
}

export type ScheduleItemType = 'school' | 'extracurricular' | 'homework' | 'family' | 'rest';

export interface ScheduleItem {
  id: string;
  title: string;
  type: ScheduleItemType;
  startTime: string; // "16:30"
  endTime: string;   // "17:15"
  daysOfWeek: string[]; // ['Mon', 'Wed', 'Fri']
  icon: string;
  location?: string;
  notes?: string;
  isCompletedToday?: boolean;
}
