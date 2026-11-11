import { useState, useMemo } from 'react';
import { Award, Filter, CheckCircle, Clock, Truck, Search } from 'lucide-react';
import { useStore } from '../store/useStore';

const typeLabel: Record<string, string> = { study: 'Estudios', conduct: 'Conducta', grades: 'Calificaciones', attendance: 'Asistencia' };
const statusBadge: Record<string, string> = {
  pending: 'bg-sun-100 text-sun-500',
  issued: 'bg-leaf-100 text-leaf-600',
  delivered: 'bg-blue-50 text-blue-700',
};
const statusLabel: Record<string, string> = { pending: 'Pendiente', issued: 'Emitido', delivered: 'Entregado' };
const StatusIcon: Record<string, typeof Clock> = { pending: Clock, issued: CheckCircle, delivered: Truck };

export default function CertificatesView() {
  const { certificates, students } = useStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const studentMap = useMemo(() => new Map(students.map(s => [s.id, s.name])), [students]);

  const filtered = useMemo(() =>
    certificates.filter(c => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (typeFilter && c.type !== typeFilter) return false;
      if (search) {
        const name = studentMap.get(c.studentId) ?? '';
        return name.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    }),
  [certificates, statusFilter, typeFilter, search, studentMap]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Certificados</h1>
        <p className="text-gray-500 text-sm mt-1">Gestión y seguimiento de certificados</p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre de estudiante…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white appearance-none">
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="issued">Emitido</option>
              <option value="delivered">Entregado</option>
            </select>
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white">
            <option value="">Todos los tipos</option>
            {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(['pending', 'issued', 'delivered'] as const).map(status => {
          const Icon = StatusIcon[status];
          const count = certificates.filter(c => c.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl shadow-card p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${statusBadge[status]}`}><Icon className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-bold text-ink">{count}</p>
                <p className="text-xs text-gray-400">{statusLabel[status]}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">Estudiante</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider hidden sm:table-cell">Año</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider hidden md:table-cell">Fecha Emisión</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => {
                const Icon = StatusIcon[c.status];
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sun-100 text-sun-500 flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-ink">{studentMap.get(c.studentId) ?? `ID ${c.studentId}`}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{typeLabel[c.type] ?? c.type}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.year}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{c.issuedDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadge[c.status]}`}>
                        <Icon className="w-3 h-3" />{statusLabel[c.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400">Sin certificados</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
