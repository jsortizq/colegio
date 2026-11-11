import { useMemo, useState } from 'react';
import { BarChart3, Download, Users, UserCheck, Award, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useI18n } from '../i18n';

export default function ReportsView() {
  const { students, teachers, grades, certificates } = useStore();
  const { t } = useI18n();
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  /* Enrollment by grade */
  const enrollment = useMemo(() => {
    const map = new Map<string, number>();
    grades.forEach(g => map.set(g.name, (map.get(g.name) ?? 0) + g.students.length));
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [grades]);
  const maxEnroll = Math.max(...enrollment.map(([, v]) => v), 1);

  /* Teachers by specialization */
  const specDist = useMemo(() => {
    const map = new Map<string, number>();
    teachers.forEach(tc => map.set(tc.specialization, (map.get(tc.specialization) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [teachers]);
  const maxSpec = Math.max(...specDist.map(([, v]) => v), 1);

  /* Certificate status */
  const certStats = useMemo(() => ({
    pending: certificates.filter(c => c.status === 'pending').length,
    issued: certificates.filter(c => c.status === 'issued').length,
    delivered: certificates.filter(c => c.status === 'delivered').length,
  }), [certificates]);
  const certTotal = Math.max(certStats.pending + certStats.issued + certStats.delivered, 1);

  const colors = ['bg-blue-500', 'bg-leaf-500', 'bg-sun-400', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{t('reports.pageTitle')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('reports.pageSubtitle')}</p>
        </div>
        <button onClick={() => showToast(t('reports.exportNotAvailable'))}
          className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" /> {t('reports.exportPdf')}
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('reports.students'), value: students.length, Icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: t('reports.teachers'), value: teachers.length, Icon: UserCheck, color: 'text-leaf-600 bg-leaf-100' },
          { label: t('reports.grades'), value: grades.length, Icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
          { label: t('reports.certificates'), value: certificates.length, Icon: Award, color: 'text-sun-500 bg-sun-100' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-card p-4 flex items-center gap-3 animate-fade-up">
            <div className={`p-2.5 rounded-lg ${s.color}`}><s.Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-bold text-ink">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment chart */}
        <div className="bg-white rounded-xl shadow-card p-5 animate-fade-up">
          <h2 className="font-semibold text-ink mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> {t('reports.enrollmentByGrade')}</h2>
          {enrollment.length > 0 ? (
            <div className="space-y-3">
              {enrollment.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-24 shrink-0 truncate">{name}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-700`}
                      style={{ width: `${(count / maxEnroll) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-ink w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">{t('reports.noEnrollmentData')}</p>}
        </div>

        {/* Teacher distribution */}
        <div className="bg-white rounded-xl shadow-card p-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <h2 className="font-semibold text-ink mb-4 flex items-center gap-2"><UserCheck className="w-4 h-4 text-leaf-500" /> {t('reports.teachersBySpec')}</h2>
          {specDist.length > 0 ? (
            <div className="space-y-3">
              {specDist.map(([spec, count], i) => (
                <div key={spec} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-28 shrink-0 truncate">{spec}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[(i + 2) % colors.length]} transition-all duration-700`}
                      style={{ width: `${(count / maxSpec) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-ink w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">{t('reports.noTeachersData')}</p>}
        </div>

        {/* Certificate breakdown */}
        <div className="bg-white rounded-xl shadow-card p-5 lg:col-span-2 animate-fade-up" style={{ animationDelay: '160ms' }}>
          <h2 className="font-semibold text-ink mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-sun-500" /> {t('reports.certStatus')}</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Stacked bar */}
            <div className="flex-1">
              <div className="h-10 rounded-full overflow-hidden flex bg-gray-100">
                {certStats.pending > 0 && <div className="bg-sun-400 transition-all duration-700" style={{ width: `${(certStats.pending / certTotal) * 100}%` }} />}
                {certStats.issued > 0 && <div className="bg-leaf-500 transition-all duration-700" style={{ width: `${(certStats.issued / certTotal) * 100}%` }} />}
                {certStats.delivered > 0 && <div className="bg-blue-500 transition-all duration-700" style={{ width: `${(certStats.delivered / certTotal) * 100}%` }} />}
              </div>
              <div className="flex items-center gap-6 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-sun-400" /> {t('reports.certPending')} ({certStats.pending})</span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-leaf-500" /> {t('reports.certIssued')} ({certStats.issued})</span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-blue-500" /> {t('reports.certDelivered')} ({certStats.delivered})</span>
              </div>
            </div>
            {/* Big number */}
            <div className="flex items-center justify-center gap-3 sm:border-l sm:pl-6 border-gray-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-ink">{certTotal}</div>
                <div className="text-xs text-gray-400 mt-1">{t('reports.totalCerts')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-5 py-3 rounded-xl shadow-lift flex items-center gap-2 animate-pop-in">
          <CheckCircle className="w-4 h-4 text-sun-300" /> {toast}
        </div>
      )}
    </div>
  );
}
