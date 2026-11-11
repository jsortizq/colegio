import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { StoreProvider, useStore } from '../useStore';
import type { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function wrapper({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}

describe('useStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('throws when used outside StoreProvider', () => {
    expect(() => renderHook(() => useStore())).toThrow(
      'useStore must be used inside <StoreProvider>',
    );
  });

  it('provides initial mock data', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.students.length).toBeGreaterThanOrEqual(8);
    expect(result.current.teachers.length).toBeGreaterThanOrEqual(5);
    expect(result.current.grades.length).toBeGreaterThanOrEqual(5);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.currentUser).toBeNull();
  });

  describe('authentication', () => {
    it('logs in with valid admin credentials', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      act(() => {
        const ok = result.current.login('admin@edugestion.edu', 'admin123');
        expect(ok).toBe(true);
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser).not.toBeNull();
    });

    it('rejects invalid credentials', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      act(() => {
        const ok = result.current.login('wrong@email.com', 'wrong');
        expect(ok).toBe(false);
      });
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('logs out', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      act(() => { result.current.login('admin@edugestion.edu', 'admin123'); });
      act(() => { result.current.logout(); });
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.currentUser).toBeNull();
    });
  });

  describe('student CRUD', () => {
    it('adds a student', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      const count = result.current.students.length;
      act(() => {
        result.current.addStudent({
          id: 'new-1',
          firstName: 'Test',
          lastName: 'Student',
          email: 'test@edugestion.edu',
          gradeId: 'grd-001',
          enrollmentDate: '2025-03-01',
          status: 'active',
          parentName: 'Parent',
          parentPhone: '555-0000',
        });
      });
      expect(result.current.students.length).toBe(count + 1);
    });

    it('updates a student', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      const first = result.current.students[0];
      act(() => {
        result.current.updateStudent({ ...first, firstName: 'Updated' });
      });
      expect(result.current.students.find((s) => s.id === first.id)?.firstName).toBe('Updated');
    });

    it('deletes a student', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      const first = result.current.students[0];
      const count = result.current.students.length;
      act(() => { result.current.deleteStudent(first.id); });
      expect(result.current.students.length).toBe(count - 1);
    });
  });

  describe('teacher CRUD', () => {
    it('adds a teacher', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      const count = result.current.teachers.length;
      act(() => {
        result.current.addTeacher({
          id: 'new-t1',
          firstName: 'New',
          lastName: 'Teacher',
          email: 'newteacher@edugestion.edu',
          subject: 'Ciencias',
          phone: '555-1111',
          hireDate: '2025-01-01',
          status: 'active',
        });
      });
      expect(result.current.teachers.length).toBe(count + 1);
    });

    it('deletes a teacher', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      const first = result.current.teachers[0];
      const count = result.current.teachers.length;
      act(() => { result.current.deleteTeacher(first.id); });
      expect(result.current.teachers.length).toBe(count - 1);
    });
  });

  describe('persistence', () => {
    it('saves to localStorage on data change', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      act(() => {
        result.current.addStudent({
          id: 'persist-1',
          firstName: 'Persist',
          lastName: 'Test',
          email: 'persist@edugestion.edu',
          gradeId: 'grd-001',
          enrollmentDate: '2025-03-01',
          status: 'active',
          parentName: 'Parent',
          parentPhone: '555-9999',
        });
      });
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('resets data and clears localStorage', () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      act(() => { result.current.deleteStudent(result.current.students[0].id); });
      const countAfterDelete = result.current.students.length;
      act(() => { result.current.resetData(); });
      expect(result.current.students.length).toBeGreaterThan(countAfterDelete);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('edugestion-data');
    });
  });
});
