import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, X, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useI18n } from '../i18n';
import type { User } from '../types';

const roleBadge: Record<User['role'], string> = {
  admin: 'bg-blue-50 text-blue-700',
  teacher: 'bg-leaf-100 text-leaf-600',
  student: 'bg-purple-50 text-purple-700',
};

const emptyUser = { name: '', email: '', role: 'student' as User['role'], createdAt: new Date().toISOString().slice(0, 10) };

export default function UsersView() {
  const { users, addUser, updateUser, deleteUser } = useStore();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ type: 'form' | 'delete'; user?: User } | null>(null);
  const [form, setForm] = useState(emptyUser);
  const [editId, setEditId] = useState<string | null>(null);

  const roleLabel = (role: User['role']) => t(`common.${role}`);

  const filtered = useMemo(() =>
    users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())),
  [users, search]);

  const openAdd = () => { setForm(emptyUser); setEditId(null); setModal({ type: 'form' }); };
  const openEdit = (u: User) => { const { id, ...rest } = u; setForm(rest); setEditId(id); setModal({ type: 'form', user: u }); };
  const openDelete = (u: User) => setModal({ type: 'delete', user: u });
  const close = () => { setModal(null); setEditId(null); };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editId) updateUser(editId, form);
    else addUser(form);
    close();
  };
  const handleDelete = () => { if (modal?.user) { deleteUser(modal.user.id); close(); } };

  const initials = (n: string) => n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t('users.pageTitle')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('users.pageSubtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={t('users.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> {t('users.newUser')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">{t('users.colUser')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider hidden sm:table-cell">{t('users.colEmail')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">{t('users.colRole')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider hidden md:table-cell">{t('users.colCreated')}</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase text-xs tracking-wider">{t('users.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {initials(u.name)}
                      </div>
                      <span className="font-medium text-ink">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${roleBadge[u.role]}`}>
                      <Shield className="w-3 h-3" />{roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{u.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => openDelete(u)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400">{t('users.noResults')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
          <div className="bg-white rounded-2xl shadow-lift max-w-md w-full animate-pop-in" onClick={e => e.stopPropagation()}>
            {modal.type === 'form' && (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-ink">{editId ? t('users.editTitle') : t('users.newTitle')}</h2>
                  <button onClick={close} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t('users.name')}</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t('users.email')}</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t('users.role')}</label>
                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as User['role'] }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white">
                      <option value="admin">{t('common.admin')}</option>
                      <option value="teacher">{t('common.teacher')}</option>
                      <option value="student">{t('common.student')}</option>
                    </select>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
                  <button onClick={close} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                  <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editId ? t('users.save') : t('users.create')}</button>
                </div>
              </>
            )}
            {modal.type === 'delete' && modal.user && (
              <>
                <div className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-ink mb-2">{t('users.deleteTitle')}</h2>
                  <p className="text-gray-500 text-sm">{t('users.deleteConfirmMsg', { name: modal.user.name })}</p>
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
