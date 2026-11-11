export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  grade: string;
  year: number;
  birthDate: string;
  address: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  teacherId: string;
  subjects: string[];
  grades: string[];
  phone: string;
  specialization: string;
  hireDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Grade {
  id: string;
  name: string;
  year: number;
  students: Student[];
  teachers: Teacher[];
  capacity: number;
}

export interface Certificate {
  id: string;
  studentId: string;
  type: 'study' | 'conduct' | 'grades' | 'attendance';
  year: number;
  issuedDate: string;
  status: 'pending' | 'issued' | 'delivered';
}

export interface StudentDocument {
  id: string;
  studentId: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
}

export interface AppState {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  grades: Grade[];
  certificates: Certificate[];
  documents: StudentDocument[];
}
