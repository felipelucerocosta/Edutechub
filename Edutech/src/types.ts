// ==============================
// TYPES – Edu-Tech Platform
// ==============================

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string; // initials
}

export interface ClassRoom {
  id: string;
  code: string;          // 6-char invite code
  course: string;        // e.g. "5to Año"
  division: string;      // e.g. "A"
  subject: string;       // e.g. "Robótica Avanzada"
  teacherId: string;
  teacherName: string;
  memberIds: string[];
  color: CardColor;
  createdAt: string;
}

export type CardColor = 'cyan' | 'purple' | 'blue' | 'teal' | 'orange' | 'pink';

export type AssignmentType = 'assignment' | 'exam';

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;
  type: AssignmentType;
  maxScore: number;
  createdAt: string;
}

export interface Grade {
  id: string;
  assignmentId: string;
  classId: string;
  studentId: string;
  studentName: string;
  score: number;
  feedback: string;
  gradedAt: string;
}

export interface ForumPost {
  id: string;
  classId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  body: string;
  createdAt: string;
  likes: string[]; // userIds who liked
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  classId: string;
  title: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  type: 'class' | 'assignment' | 'exam' | 'event';
  description?: string;
}

export interface StudentGradeSummary {
  studentId: string;
  studentName: string;
  grades: { assignmentId: string; assignmentTitle: string; type: AssignmentType; score: number; maxScore: number }[];
  average: number;
}
