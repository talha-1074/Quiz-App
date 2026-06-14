// src/types/index.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface Question {
  _id?: string;
  questionText: string;
  options: string[];
  correctAnswer?: number;
}

export interface Quiz {
  _id: string;
  title: string;
  subject: string;
  duration: number;
  code: string;
  teacher: string;
  questions: Question[];
  isActive?: boolean;
  expiresAt?: string;   // ADD THIS
  createdAt?: string;
}

export interface Result {
  _id: string;
  student: { _id: string; name: string; email: string };
  quiz: { _id: string; title: string; subject: string };
  correct: number;
  wrong: number;
  total: number;
  percent: number;
  passed: boolean;
  createdAt: string;
}