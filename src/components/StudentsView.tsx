import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, GraduationCap, Phone, Mail, Calendar, X, Download, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useI18n } from '../i18n';
import type { Student } from '../types';

const emptyStudent: Omit<Student, 'id'> = {
  name: '', email: '', studentId: '', grade: '', year: new Date().getFullYear(),
  birthDate: '', address: '', phone: '', parentName: '', parentPhone: '',
  enrollmentDate: new Date().toISOString().slice(0, 10), status: 'active',
};

export default function StudentsView() {
  const { students, certificates, documents, addStudent, updateStudent, deleteStudent } = useStore();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [modal, setModal] = useState<{ type: 'view' | 'form' | 'delete' | 'certs' | 'docs'; student?: Student } | null>(null);
  const [form, setForm] = useState<Omit<Student, 'id'>>(emptyStudent);
  const [editId, setEditId] = useState<string | null>(null);

  const allGrades = useMemo(() => [...new Set(students.map(s => s.grade))].sort(), [students]);

  const filtered = useMemo(() =>
    students.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q);
      const matchGrade = !gradeFilter || s.grade === gradeFilter;
      return matchSearch && matchGrade;
    }),
  [students, search, gradeFilter]);

  const openAdd = () => { setForm(emptyStudent); setEditId(null); setModal({ type: 'form' }); };
  const openEdit = (s: Student) => { const { id, ...rest } = s; setForm(rest); setEditId(id); setModal({ type: 'form', student: s }); };
  const openView = (s: Student) => setModal({ type: 'view', student: s });
  const openDelete = (s: Student) => setModal({ type: 'delete', student: s });
  const openCerts = (s: Student) => setModal({ type: 'certs', student: s });
  const openDocs = (s: Student) => setModal({ type: 'docs', student: s });
  const close = () => { setModal(null); setEditId(null); };

  const handleSave = () => {
    if (!form.name || !form.studentId) return;
    if (editId) updateStudent(editId, form);
    else addStudent(form);
    close();
  };

  const handleDelete = () => {
    if (modal?.student) { deleteStudent(modal.student.id); close(); }
  };

  const initials = (name: string) => name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const certTypeLabel = (type: string) => {
    const map: Record<string, string> = { study: t('students.certStudy'), conduct: t('students.certConduct'), grades: t('students.certGrades'), attendance: t('students.certAttendance') };
    return map[type] ?? type;
  };

  const certStatusLabel = (status: string) => {
    const map: Record<string, string> = { issued: t('certificates.issued'), delivered: t('certificates.delivered'), pending: t('certificates.pending') };
    return map[status] ?? status;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t('students.pageTitle')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('students.pageSubtitle')}</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder={t('students.searchPlaceholder')} value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white appearance-none">
            <option value="">{t('students.allGrades')}</option>
            {allGrades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> {t('students.newStudent')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">{t('students.colStudent')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider hidden sm:table-cell">{t('students.colId')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">{t('students.colGrade')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider hidden md:table-cell">{t('students.colContact')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">{t('students.colStatus')}</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase text-xs tracking-wider">{t('students.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {initials(s.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">{s.name}</p>
                        <p className="text-gray-400 text-xs truncate">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{s.studentId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">{s.grade}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                      s.status === 'active' ? 'bg-leaf-100 text-leaf-600' : 'bg-red-100 text-red-700'
                    }`}>{s.status === 'active' ? t('common.active') : t('common.inactive')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openView(s)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title={t('common.edit')}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-leaf-600 rounded-lg hover:bg-leaf-100" title={t('common.edit')}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => openCerts(s)} className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50" title={t('students.certsTitle')}>
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => openDelete(s)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" title={t('common.delete')}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">{t('students.noResults')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
          <div className="bg-white rounded-2xl shadow-lift max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop-in" onClick={e => e.stopPropagation()}>
            {/* View */}
            {modal.type === 'view' && modal.student && (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-ink">{t('students.viewTitle')}</h2>
                  <button onClick={close} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">
                        {initials(modal.student.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink">{modal.student.name}</h3>
                        <p className="text-gray-500 text-sm">ID: {modal.student.studentId} · {t('students.grade')}: {modal.student.grade}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span>{modal.student.email}</span></div>
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{modal.student.phone}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span>{t('students.born')} {modal.student.birthDate}</span></div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <h4 className="font-semibold text-ink">{t('students.additionalInfo')}</h4>
                    <p><span className="text-gray-500">{t('students.address')}:</span> {modal.student.address}</p>
                    <p><span className="text-gray-500">{t('students.parentName')}:</span> {modal.student.parentName}</p>
                    <p><span className="text-gray-500">{t('students.parentPhone')}:</span> {modal.student.parentPhone}</p>
                    <p><span className="text-gray-500">{t('students.enrollment')}:</span> {modal.student.enrollmentDate}</p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                      modal.student.status === 'active' ? 'bg-leaf-100 text-leaf-600' : 'bg-red-100 text-red-700'
                    }`}>{modal.student.status === 'active' ? t('common.active') : t('common.inactive')}</span>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.close')}</button>
                  <button onClick={() => { close(); openEdit(modal.student!); }} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('common.edit')}</button>
                </div>
              </>
            )}

            {/* Form (Add/Edit) */}
            {modal.type === 'form' && (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-ink">{editId ? t('students.editTitle') : t('students.newTitle')}</h2>
                  <button onClick={close} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([
                    ['name', t('students.fullName'), 'text'],
                    ['email', t('students.email'), 'email'],
                    ['studentId', t('students.studentId'), 'text'],
                    ['grade', t('students.grade'), 'text'],
                    ['birthDate', t('students.birthDate'), 'date'],
                    ['phone', t('students.phone'), 'tel'],
                    ['address', t('students.address'), 'text'],
                    ['parentName', t('students.parentName'), 'text'],
                    ['parentPhone', t('students.parentPhone'), 'tel'],
                    ['enrollmentDate', t('students.enrollDate'), 'date'],
                  ] as [string, string, string][]).map(([key, label, type]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                      <input type={type} value={(form as Record<string, unknown>)[key] as string}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t('students.year')}</label>
                    <input type="number" value={form.year}
                      onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t('students.status')}</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white">
                      <option value="active">{t('common.active')}</option>
                      <option value="inactive">{t('common.inactive')}</option>
                    </select>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                  <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {editId ? t('students.saveChanges') : t('students.createStudent')}
                  </button>
                </div>
              </>
            )}

            {/* Delete */}
            {modal.type === 'delete' && modal.student && (
              <>
                <div className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-ink mb-2">{t('common.delete')}</h2>
                  <p className="text-gray-500 text-sm">{t('students.deleteConfirmMsg', { name: modal.student.name })}</p>
                </div>
                <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                  <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">{t('common.delete')}</button>
                </div>
              </>
            )}

            {/* Certificates */}
            {modal.type === 'certs' && modal.student && (() => {
              const certs = certificates.filter(c => c.studentId === modal.student!.id);
              return (
                <>
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-ink">{t('students.certsTitle')} — {modal.student.name}</h2>
                    <button onClick={close} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="p-5 space-y-3">
                    {certs.length === 0 && <p className="text-sm text-gray-400 text-center py-6">{t('students.noCerts')}</p>}
                    {certs.map(c => (
                      <div key={c.id} className="border border-gray-100 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-ink text-sm">{certTypeLabel(c.type)}</p>
                          <p className="text-xs text-gray-400">{t('grades.yearLabel')} {c.year} · {c.issuedDate}</p>
                          <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                            c.status === 'issued' ? 'bg-leaf-100 text-leaf-600' : c.status === 'delivered' ? 'bg-blue-50 text-blue-700' : 'bg-sun-100 text-sun-500'
                          }`}>{certStatusLabel(c.status)}</span>
                        </div>
                        <button className="p-2 text-leaf-500 hover:bg-leaf-100 rounded-lg"><Download className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 border-t border-gray-100 flex justify-end">
                    <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.close')}</button>
                  </div>
                </>
              );
            })()}

            {/* Documents */}
            {modal.type === 'docs' && modal.student && (() => {
              const docs = documents.filter(d => d.studentId === modal.student!.id);
              return (
                <>
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-ink">{t('students.docsTitle')} — {modal.student.name}</h2>
                    <button onClick={close} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="p-5 space-y-3">
                    {docs.length === 0 && <p className="text-sm text-gray-400 text-center py-6">{t('students.noDocs')}</p>}
                    {docs.map(d => (
                      <div key={d.id} className="border border-gray-100 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-ink text-sm">{d.name}</p>
                          <p className="text-xs text-gray-400">{d.type} · {d.uploadDate}</p>
                        </div>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 border-t border-gray-100 flex justify-end">
                    <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.close')}</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
