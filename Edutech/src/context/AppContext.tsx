// ==============================
// APP CONTEXT – Edu-Tech Platform
// Global state: auth, classes, assignments, grades, posts, events
// ==============================
import { createContext, useContext, useState, type ReactNode } from 'react';
import type {
  User, ClassRoom, Assignment, Grade,
  ForumPost, ForumComment, CalendarEvent, CardColor
} from '../types';

// ---- Seed data ----
const TEACHER: User = { id: 'u1', name: 'Juan Pérez', email: 'jperez@edutech.edu.ve', role: 'teacher', avatar: 'JP' };
const STUDENT: User = { id: 'u2', name: 'María García', email: 'mgarcia@edutech.edu.ve', role: 'student', avatar: 'MG' };
const ADMIN: User   = { id: 'u3', name: 'Admin', email: 'admin@edutech.edu.ve', role: 'admin', avatar: 'AD' };

const DEMO_USERS: Record<string, User> = { teacher: TEACHER, student: STUDENT, admin: ADMIN };

const COLORS: CardColor[] = ['cyan', 'purple', 'blue', 'teal', 'orange', 'pink'];

function genCode(n = 6) {
  return Math.random().toString(36).toUpperCase().slice(2, 2 + n);
}

interface AppState {
  user: User | null;
  classes: ClassRoom[];
  assignments: Assignment[];
  grades: Grade[];
  posts: ForumPost[];
  events: CalendarEvent[];
  // actions
  login: (role: 'student' | 'teacher' | 'admin') => void;
  logout: () => void;
  createClass: (data: { course: string; division: string; subject: string }) => { ok: boolean; reason?: string };
  joinClass: (code: string) => { ok: boolean; reason?: string };
  createAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => void;
  gradeAssignment: (data: Omit<Grade, 'id' | 'gradedAt'>) => void;
  addPost: (data: Omit<ForumPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<ForumComment, 'id' | 'createdAt'>) => void;
  addEvent: (data: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [classes, setClasses]         = useState<ClassRoom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades]           = useState<Grade[]>([]);
  const [posts, setPosts]             = useState<ForumPost[]>([]);
  const [events, setEvents]           = useState<CalendarEvent[]>([]);

  const login = (role: 'student' | 'teacher' | 'admin') => setUser(DEMO_USERS[role]);
  const logout = () => setUser(null);

  const createClass = (data: { course: string; division: string; subject: string }) => {
    // Validate: teacher can't create duplicate course+division+subject
    const duplicate = classes.find(
      c => c.course === data.course && c.division === data.division && c.subject === data.subject
    );
    if (duplicate) return { ok: false, reason: `Ya existe una clase de "${data.subject}" para ${data.course} – Div. ${data.division}.` };
    const newClass: ClassRoom = {
      id: 'cls_' + Date.now(),
      code: genCode(),
      course: data.course,
      division: data.division,
      subject: data.subject,
      teacherId: user!.id,
      teacherName: user!.name,
      memberIds: [user!.id],
      color: COLORS[classes.length % COLORS.length],
      createdAt: new Date().toISOString(),
    };
    setClasses(prev => [...prev, newClass]);
    return { ok: true };
  };

  const joinClass = (code: string) => {
    const cls = classes.find(c => c.code === code.trim().toUpperCase());
    if (!cls) return { ok: false, reason: 'Código de invitación inválido.' };
    if (cls.memberIds.includes(user!.id)) return { ok: false, reason: 'Ya estás inscrito en esta clase.' };
    setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, memberIds: [...c.memberIds, user!.id] } : c));
    return { ok: true };
  };

  const createAssignment = (data: Omit<Assignment, 'id' | 'createdAt'>) => {
    setAssignments(prev => [...prev, { ...data, id: 'asgn_' + Date.now(), createdAt: new Date().toISOString() }]);
  };

  const gradeAssignment = (data: Omit<Grade, 'id' | 'gradedAt'>) => {
    const existing = grades.find(g => g.assignmentId === data.assignmentId && g.studentId === data.studentId);
    if (existing) {
      setGrades(prev => prev.map(g => g.id === existing.id ? { ...g, ...data, gradedAt: new Date().toISOString() } : g));
    } else {
      setGrades(prev => [...prev, { ...data, id: 'grd_' + Date.now(), gradedAt: new Date().toISOString() }]);
    }
  };

  const addPost = (data: Omit<ForumPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    setPosts(prev => [{ ...data, id: 'post_' + Date.now(), createdAt: new Date().toISOString(), likes: [], comments: [] }, ...prev]);
  };

  const likePost = (postId: string, userId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(userId);
      return { ...p, likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
    }));
  };

  const addComment = (postId: string, comment: Omit<ForumComment, 'id' | 'createdAt'>) => {
    setPosts(prev => prev.map(p => p.id !== postId ? p : {
      ...p,
      comments: [...p.comments, { ...comment, id: 'cmt_' + Date.now(), createdAt: new Date().toISOString() }]
    }));
  };

  const addEvent = (data: Omit<CalendarEvent, 'id'>) => {
    setEvents(prev => [...prev, { ...data, id: 'evt_' + Date.now() }]);
  };

  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  return (
    <AppContext.Provider value={{
      user, classes, assignments, grades, posts, events,
      login, logout, createClass, joinClass,
      createAssignment, gradeAssignment,
      addPost, likePost, addComment,
      addEvent, deleteEvent,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
