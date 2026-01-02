
// Import React to use ReactNode type
import React from 'react';

export type Theme = 'light' | 'dark';
export type Language = 'English' | 'Kinyarwanda' | 'French' | 'Swahili' | 'Spanish';

export interface SubjectProgress {
  currentDifficulty: number;
  consecutiveFails: number;
  masteryStreak: number;
  examsPassed: number;
  totalPoints: number;
  lastExamDate?: number;
  bestScore?: number;
}

export interface StudyReminder {
  id: string;
  time: string; // "HH:mm" 24h format
  label: string;
  enabled: boolean;
}

export interface User {
  name: string;
  grade: string;
  avatar: string; // base64 string
  signature?: string; // base64 string for handwritten signature
  username: string;
  password?: string;
  progress?: Record<string, SubjectProgress>;
  school?: string;
  learningGoals?: string;
  preferredLanguage?: Language;
  // New Identity Fields
  age?: string;
  location?: string;
  email?: string;
  // Reminders
  reminders?: StudyReminder[];
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface Subject {
  name: string;
  icon: React.ReactNode;
  color: string;
}

export enum View {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  LEARNING = 'LEARNING',
  EXAM = 'EXAM',
  REPORT = 'REPORT',
  SETTINGS = 'SETTINGS',
  ARENA = 'ARENA',
  STUDY_PLAN = 'STUDY_PLAN',
  CLASSROOM = 'CLASSROOM',
  NOTEBOOK = 'NOTEBOOK',
  SUBJECT_HUB = 'SUBJECT_HUB',
  TEAM_ROOM = 'TEAM_ROOM',
  CODELAB = 'CODELAB',
  CUSTOM_EXAM = 'CUSTOM_EXAM',
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LogicLoop {
  id: string;
  statement: string;
  isValid: boolean;
  explanation: string;
}

export interface Exam {
  id: string;
  subject: string;
  questions: Question[];
  date: number;
  difficulty: number;
  duration: number;
}

export interface UserAnswer {
    question: string;
    chosenAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

export interface Report {
  examId: string;
  subject: string;
  score: number;
  totalQuestions: number;
  results: UserAnswer[];
  feedback: string;
  date: number;
  difficulty: number;
  marker?: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface GeneratedStudyDay {
  day: string;
  topic: string;
  tasks: string[];
}

export interface StudyTask {
  description: string;
  completed: boolean;
}

export interface StudyDay {
  day: string;
  topic: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  subject: string;
  goal: string;
  duration: string;
  plan: StudyDay[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
}

export interface Syllabus {
  subject: string;
  grade: string;
  lessons: Lesson[];
}

export type UserRole = 'teacher' | 'student';

export interface GroupMember {
  username: string;
  name: string;
  avatar: string;
  role: UserRole;
  joinedAt: number;
}

export interface GroupExamResult {
  username: string;
  score: number;
  total: number;
  date: number;
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  code: string;
  teacherUsername: string;
  members: GroupMember[];
  activeExam?: Exam;
  activeLesson?: Lesson;
  results: GroupExamResult[];
}
