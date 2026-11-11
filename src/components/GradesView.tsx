import { useState, useMemo } from 'react';
import { School, Users, UserCheck, Eye, Plus, Calendar, BookOpen, X, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Grade } from '../types';

export default function GradesView() {
  const { grades, students, teachers } = useStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [modal, setModal] = useState<{ type: 'view' | 'form'; grade?: Grade } | null>(null);

  const years = useMemo(() => {
    const yrs = [...new Set(grades.map(g => g.year))];
    if (!yrs.includes(selectedYear)) yrs.push(selectedYear);
    return yrs.sort((a, b) => b - a);
  }, [grades, selectedYear]);

  const filtered = useMemo(() => grades.filter(g => g.year === selectedYear), [grades, selectedYear]);

  const openView = (g: Grade) => setModal({ type: 'view', grade: g });
  const close = () => setModal(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Gestión de Grados</h1>
        <p className="text-gray-500 text-sm mt-1">Consulta grados por año y gestiona asignaciones</p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <label className="text-sm font-medium text-gray-600">Año Académico:</label>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nuevo Grado
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(g => {
            const pct = g.capacity > 0 ? Math.round((g.students.length / g.capacity) * 100) : 0;
            return (
              <div key={g.id} className="bg-white rounded-xl shadow-card p-5 hover:shadow-lift transition-shadow animate-fade-up">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center">
                      <School className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink">Grado {g.name}</h3>
                      <p className="text-xs text-gray-400">Año {g.year}</p>
                    </div>
                  </div>
                  <button onClick={() => openView(g)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver detalles">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500"><Users className="w-4 h-4" /> Estudiantes</div>
                    <span className="font-medium text-ink">{g.students.length} <span className="text-gray-400">/ {g.capacity}</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500"><UserCheck className="w-4 h-4" /> Docentes</div>
                    <span className="font-medium text-ink">{g.teachers.length}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Ocupación</span>
                      <span className="text-xs font-medium text-gray-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                </div>

                <button onClick={() => openView(g)}
                  className="mt-4 w-full text-center text-sm font-medium text-gray-600 hover:text-blue-600 py-2 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                  Ver Detalles Completos
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <h3 className="text-lg font-medium text-ink mb-2">No hay grados para {selectedYear}</h3>
          <p className="text-gray-400 text-sm">Crea el primer grado del año académico.</p>
        </div>
      )}

      {modal?.type === 'view' && modal.grade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
          <div className="bg-white rounded-2xl shadow-lift max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-pop-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-ink">Grado {modal.grade.name} — {modal.grade.year}</h2>
              <button onClick={close} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Students */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-ink flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> Estudiantes</h3>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">{modal.grade.students.length}/{modal.grade.capacity}</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {modal.grade.students.length > 0 ? modal.grade.students.map(s => (
                      <div key={s.id} className="border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{s.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium text-ink">{s.name}</p>
                          <p className="text-xs text-gray-400">ID: {s.studentId}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-400 text-center py-8">Sin estudiantes asignados</p>
                    )}
                  </div>
                </div>
                {/* Teachers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-ink flex items-center gap-2"><UserCheck className="w-4 h-4 text-leaf-500" /> Docentes</h3>
                    <span className="bg-leaf-100 text-leaf-600 px-2.5 py-0.5 rounded-full text-xs font-medium">{modal.grade.teachers.length}</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {modal.grade.teachers.length > 0 ? modal.grade.teachers.map(t => (
                      <div key={t.id} className="border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-leaf-100 text-leaf-600 flex items-center justify-center"><UserCheck className="w-4 h-4" /></div>
                        <div>
                          <p className="text-sm font-medium text-ink">{t.name}</p>
                          <p className="text-xs text-gray-400">{t.specialization}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {t.subjects.map((s, i) => <span key={i} className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded">{s}</span>)}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-400 text-center py-8">Sin docentes asignados</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{modal.grade.students.length}</div>
                  <div className="text-xs text-gray-500">Estudiantes</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-leaf-500">{modal.grade.teachers.length}</div>
                  <div className="text-xs text-gray-500">Docentes</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-sun-500">
                    {modal.grade.capacity > 0 ? Math.round((modal.grade.students.length / modal.grade.capacity) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500">Ocupación</div>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end">
              <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
