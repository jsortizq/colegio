import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, UserCheck, Phone, Mail, X, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useI18n } from '../i18n';
import type { Teacher } from '../types';

const emptyTeacher: Omit<Teacher, 'id'> = {
  name: '', email: '', teacherId: '', subjects: [], grades: [], phone: '',
  specialization: '', hireDate: new Date().toISOString().slice(0, 10), status: 'active',
};

export default function TeachersView() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useStore();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [modal, setModal] = useState<{ type: 'view' | 'form' | 'delete'; teacher?: Teacher } | null>(null);
  const [form, setForm] = useState(emptyTeacher);
  const [subjectsText, setSubjectsText] = useState('');
  const [gradesText, setGradesText] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const specs = useMemo(() => [...new Set(teachers.map(tc => tc.specialization))].sort(), [teachers]);

  const filtered = useMemo(() =>
    teachers.filter(tc => {
      const q = search.toLowerCase();
      const ms = !q || tc.name.toLowerCase().includes(q) || tc.teacherId.toLowerCase().includes(q);
      const mf = !specFilter || tc.specialization === specFilter;
      return ms && mf;
    }),
  [teachers, search, specFilter]);

  const openAdd = () => { setForm(emptyTeacher); setSubjectsText(''); setGradesText(''); setEditId(null); setModal({ type: 'form' }); };
  const openEdit = (tc: Teacher) => {
    const { id, ...rest } = tc;
    setForm(rest); setSubjectsText(tc.subjects.join(', ')); setGradesText(tc.grades.join(', '));
    setEditId(id); setModal({ type: 'form', teacher: tc });
  };
  const openView = (tc: Teacher) => setModal({ type: 'view', teacher: tc });
  const openDelete = (tc: Teacher) => setModal({ type: 'delete', teacher: tc });
  const close = () => { setModal(null); setEditId(null); };

  const handleSave = () => {
    if (!form.name || !form.teacherId) return;
    const data = {
      ...form,
      subjects: subjectsText.split(',').map(s => s.trim()).filter(Boolean),
      grades: gradesText.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (editId) updateTeacher(editId, data);
    else addTeacher(data);
    close();
  };

  const handleDelete = () => { if (modal?.teacher) { deleteTeacher(modal.teacher.id); close(); } };

  const initials = (name: string) => name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t('teachers.pageTitle')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('teachers.pageSubtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={t('teachers.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select value={specFilter} onChange={e => setSpecFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white appearance-none">
            <option value="">{t('teachers.allSpecs')}</option>
            {specs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 bg-leaf-500 hover:bg-leaf-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> {t('teachers.newTeacher')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">{t('teachers.colTeacher')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider hidden sm:table-cell">{t('teachers.colId')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">{t('teachers.colSpec')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider hidden md:table-cell">{t('teachers.colSubjects')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">{t('teachers.colStatus')}</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase text-xs tracking-wider">{t('teachers.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(tc => (
                <tr key={tc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-leaf-100 text-leaf-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {initials(tc.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">{tc.name}</p>
                        <p className="text-gray-400 text-xs truncate">{tc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{tc.teacherId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">{tc.specialization}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {tc.subjects.slice(0, 2).map((s, i) => (
                        <span key={i} className="inline-flex px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">{s}</span>
                      ))}
                      {tc.subjects.length > 2 && <span className="inline-flex px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">+{tc.subjects.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                      tc.status === 'active' ? 'bg-leaf-100 text-leaf-600' : 'bg-red-100 text-red-700'
                    }`}>{tc.status === 'active' ? t('common.active') : t('common.inactive')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openView(tc)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(tc)} className="p-1.5 text-gray-400 hover:text-leaf-600 rounded-lg hover:bg-leaf-100"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => openDelete(tc)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-gray-400">{t('teachers.noResults')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
          <div className="bg-white rounded-2xl shadow-lift max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop-in" onClick={e => e.stopPropagation()}>
            {modal.type === 'view' && modal.teacher && (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-ink">{t('teachers.viewTitle')}</h2>
                  <button onClick={close} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="p-5 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-leaf-100 text-leaf-600 flex items-center justify-center text-lg font-bold">
                      {initials(modal.teacher.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink">{modal.teacher.name}</h3>
                      <p className="text-gray-500 text-sm">ID: {modal.teacher.teacherId} · {modal.teacher.specialization}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-ink">{t('teachers.contact')}</h4>
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{modal.teacher.email}</div>
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{modal.teacher.phone}</div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-ink">{t('teachers.academic')}</h4>
                      <p><span className="text-gray-500">{t('teachers.hired')}:</span> {modal.teacher.hireDate}</p>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        modal.teacher.status === 'active' ? 'bg-leaf-100 text-leaf-600' : 'bg-red-100 text-red-700'
                      }`}>{modal.teacher.status === 'active' ? t('common.active') : t('common.inactive')}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink text-sm mb-2">{t('teachers.subjects')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {modal.teacher.subjects.map((s, i) => <span key={i} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink text-sm mb-2">{t('teachers.grades')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {modal.teacher.grades.map((g, i) => <span key={i} className="px-3 py-1 text-sm bg-leaf-100 text-leaf-600 rounded-full">{g}</span>)}
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.close')}</button>
                  <button onClick={() => { close(); openEdit(modal.teacher!); }} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('common.edit')}</button>
                </div>
              </>
            )}

            {modal.type === 'form' && (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-ink">{editId ? t('teachers.editTitle') : t('teachers.newTitle')}</h2>
                  <button onClick={close} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([
                    ['name', t('teachers.fullName'), 'text'],
                    ['email', t('teachers.email'), 'email'],
                    ['teacherId', t('teachers.teacherId'), 'text'],
                    ['phone', t('teachers.phone'), 'tel'],
                    ['specialization', t('teachers.specialization'), 'text'],
                    ['hireDate', t('teachers.hireDate'), 'date'],
                  ] as [string, string, string][]).map(([key, label, type]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                      <input type={type} value={(form as Record<string, unknown>)[key] as string}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t('teachers.subjectsComma')}</label>
                    <input type="text" value={subjectsText} onChange={e => setSubjectsText(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Matemáticas, Física" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t('teachers.gradesComma')}</label>
                    <input type="text" value={gradesText} onChange={e => setGradesText(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="10-A, 11-B" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t('teachers.status')}</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white">
                      <option value="active">{t('common.active')}</option>
                      <option value="inactive">{t('common.inactive')}</option>
                    </select>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                  <button onClick={handleSave} className="px-4 py-2 text-sm bg-leaf-500 text-white rounded-lg hover:bg-leaf-600">
                    {editId ? t('teachers.saveChanges') : t('teachers.createTeacher')}
                  </button>
                </div>
              </>
            )}

            {modal.type === 'delete' && modal.teacher && (
              <>
                <div className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-ink mb-2">{t('common.delete')}</h2>
                  <p className="text-gray-500 text-sm">{t('teachers.deleteConfirmMsg', { name: modal.teacher.name })}</p>
                </div>
                <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                  <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">{t('common.delete')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
