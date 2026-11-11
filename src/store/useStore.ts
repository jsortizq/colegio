import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  mockUsers,
  mockStudents,
  mockTeachers,
  mockGrades,
  mockCertificates,
  mockDocuments,
} from '../data/mockData';
import type { User, Student, Teacher, Grade, Certificate, StudentDocument } from '../types';

/* ── Persisted shape ───────────────────────────────────── */
interface PersistedState {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  grades: Grade[];
  certificates: Certificate[];
  documents: StudentDocument[];
}

/* ── Context value ─────────────────────────────────────── */
interface StoreValue extends PersistedState {
  isAuthenticated: boolean;
  currentUser: User | null;

  // Auth
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Students CRUD
  addStudent: (s: Student) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;

  // Teachers CRUD
  addTeacher: (t: Teacher) => void;
  updateTeacher: (t: Teacher) => void;
  deleteTeacher: (id: string) => void;

  // Users CRUD
  addUser: (u: User) => void;
  updateUser: (u: User) => void;
  deleteUser: (id: string) => void;

  // Reset
  resetData: () => void;
}

const STORAGE_KEY = 'edugestion-data';

/* ── Helpers ───────────────────────────────────────────── */
function loadFromStorage(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    /* ignore */
  }
  return defaultData();
}

function saveToStorage(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private‐mode – silently ignore */
  }
}

function defaultData(): PersistedState {
  return {
    users: mockUsers,
    students: mockStudents,
    teachers: mockTeachers,
    grades: mockGrades,
    certificates: mockCertificates,
    documents: mockDocuments,
  };
}

/* ── Credential map (demo only) ────────────────────────── */
const CREDENTIALS: Record<string, { password: string; role: User['role'] }> = {};

// Admin
CREDENTIALS['admin@edugestion.edu'] = { password: 'admin123', role: 'admin' };

// Teachers – any teacher email with "docente123"
mockTeachers.forEach((t) => {
  CREDENTIALS[t.email] = { password: 'docente123', role: 'teacher' };
});

// Students – any student email with "est123"
mockStudents.forEach((s) => {
  CREDENTIALS[s.email] = { password: 'est123', role: 'student' };
});

/* ── Context ───────────────────────────────────────────── */
const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PersistedState>(loadFromStorage);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Persist on every data change
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  /* ── Auth ──────────────────────────────────────────── */
  const login = useCallback(
    (email: string, password: string): boolean => {
      const cred = CREDENTIALS[email.toLowerCase()];
      if (!cred || cred.password !== password) return false;

      const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        setCurrentUser(user);
      } else {
        // Create a transient user record for the session
        setCurrentUser({
          id: 'session',
          name: email.split('@')[0],
          email,
          role: cred.role,
          createdAt: new Date().toISOString().slice(0, 10),
        });
      }
      setIsAuthenticated(true);
      return true;
    },
    [data.users],
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  /* ── Generic updater ──────────────────────────────── */
  const patch = useCallback((fn: (prev: PersistedState) => PersistedState) => {
    setData((prev) => fn(prev));
  }, []);

  /* ── Students ─────────────────────────────────────── */
  const addStudent = useCallback(
    (s: Student) => patch((p) => ({ ...p, students: [...p.students, s] })),
    [patch],
  );
  const updateStudent = useCallback(
    (s: Student) =>
      patch((p) => ({
        ...p,
        students: p.students.map((old) => (old.id === s.id ? s : old)),
      })),
    [patch],
  );
  const deleteStudent = useCallback(
    (id: string) =>
      patch((p) => ({ ...p, students: p.students.filter((s) => s.id !== id) })),
    [patch],
  );

  /* ── Teachers ─────────────────────────────────────── */
  const addTeacher = useCallback(
    (t: Teacher) => patch((p) => ({ ...p, teachers: [...p.teachers, t] })),
    [patch],
  );
  const updateTeacher = useCallback(
    (t: Teacher) =>
      patch((p) => ({
        ...p,
        teachers: p.teachers.map((old) => (old.id === t.id ? t : old)),
      })),
    [patch],
  );
  const deleteTeacher = useCallback(
    (id: string) =>
      patch((p) => ({ ...p, teachers: p.teachers.filter((t) => t.id !== id) })),
    [patch],
  );

  /* ── Users ────────────────────────────────────────── */
  const addUser = useCallback(
    (u: User) => patch((p) => ({ ...p, users: [...p.users, u] })),
    [patch],
  );
  const updateUser = useCallback(
    (u: User) =>
      patch((p) => ({
        ...p,
        users: p.users.map((old) => (old.id === u.id ? u : old)),
      })),
    [patch],
  );
  const deleteUser = useCallback(
    (id: string) =>
      patch((p) => ({ ...p, users: p.users.filter((u) => u.id !== id) })),
    [patch],
  );

  /* ── Reset ────────────────────────────────────────── */
  const resetData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(defaultData());
  }, []);

  const value: StoreValue = {
    ...data,
    isAuthenticated,
    currentUser,
    login,
    logout,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addUser,
    updateUser,
    deleteUser,
    resetData,
  };

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
