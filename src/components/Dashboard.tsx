import { useMemo } from 'react';
import {
  GraduationCap, UserCheck, Award, BookOpen, TrendingUp,
  FileText, Calendar, Users, ClipboardList, BarChart3, Bell
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useI18n } from '../i18n';

export default function Dashboard() {
  const { students, teachers, certificates, grades, currentUser } = useStore();
  const { t } = useI18n();

  const stats = useMemo(() => [
    {
      title: t('dashboard.totalStudents'),
      value: students.length,
      icon: GraduationCap,
      accent: 'from-blue-400 to-blue-600',
      iconBg: 'bg-blue-500',
      change: `${students.filter(s => s.status === 'active').length} ${t('dashboard.active')}`,
    },
    {
      title: t('dashboard.activeTeachers'),
      value: teachers.filter(tc => tc.status === 'active').length,
      icon: UserCheck,
      accent: 'from-leaf-400 to-leaf-600',
      iconBg: 'bg-leaf-500',
      change: `${teachers.length} ${t('dashboard.total')}`,
    },
    {
      title: t('dashboard.certificatesIssued'),
      value: certificates.filter(c => c.status === 'issued' || c.status === 'delivered').length,
      icon: Award,
      accent: 'from-sun-300 to-sun-500',
      iconBg: 'bg-sun-500',
      change: `${certificates.filter(c => c.status === 'pending').length} ${t('dashboard.pending')}`,
    },
    {
      title: t('dashboard.activeGrades'),
      value: grades.length,
      icon: BookOpen,
      accent: 'from-purple-400 to-purple-600',
      iconBg: 'bg-purple-500',
      change: `${grades.reduce((sum, g) => sum + g.capacity, 0)} ${t('dashboard.totalSlots')}`,
    },
  ], [students, teachers, certificates, grades, t]);

  const recentActivities = [
    { action: t('dashboard.activity.newStudent'), time: t('dashboard.activity.hoursAgo', { n: 2 }), icon: GraduationCap, color: 'text-blue-600 bg-blue-50' },
    { action: t('dashboard.activity.certIssued'), time: t('dashboard.activity.hoursAgo', { n: 4 }), icon: Award, color: 'text-sun-500 bg-sun-100' },
    { action: t('dashboard.activity.teacherAssigned'), time: t('dashboard.activity.daysAgo', { n: 1 }), icon: UserCheck, color: 'text-leaf-500 bg-leaf-100' },
    { action: t('dashboard.activity.reportGenerated'), time: t('dashboard.activity.daysAgo', { n: 2 }), icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
    { action: t('dashboard.activity.docUploaded'), time: t('dashboard.activity.daysAgo', { n: 3 }), icon: FileText, color: 'text-blue-600 bg-blue-50' },
  ];

  const quickActions = [
    { title: t('dashboard.qa.files'), subtitle: t('dashboard.qa.records'), icon: FileText, color: 'bg-blue-50 text-blue-600 ring-blue-200' },
    { title: t('dashboard.qa.management'), subtitle: t('dashboard.qa.requests'), icon: Calendar, color: 'bg-leaf-100 text-leaf-600 ring-leaf-200' },
    { title: t('dashboard.qa.resources'), subtitle: t('dashboard.qa.technical'), icon: Users, color: 'bg-sun-100 text-sun-500 ring-sun-300' },
    { title: t('dashboard.qa.files'), subtitle: t('dashboard.qa.orders'), icon: ClipboardList, color: 'bg-purple-50 text-purple-600 ring-purple-200' },
    { title: t('dashboard.qa.management'), subtitle: t('dashboard.qa.reports'), icon: TrendingUp, color: 'bg-red-50 text-red-500 ring-red-200' },
    { title: t('dashboard.qa.management'), subtitle: t('dashboard.qa.orderTypes'), icon: Award, color: 'bg-indigo-50 text-indigo-600 ring-indigo-200' },
  ];

  const enrollmentByGrade = useMemo(() =>
    grades.map(g => ({
      name: g.name,
      count: g.students.length,
      capacity: g.capacity,
      pct: g.capacity > 0 ? Math.round((g.students.length / g.capacity) * 100) : 0,
    })),
  [grades]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <span className="text-2xl">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">
              {t('dashboard.welcome', { name: currentUser?.name ?? 'Admin' })}
            </h1>
            <p className="text-gray-500">{t('dashboard.tagline')}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="relative bg-white rounded-xl shadow-card p-5 hover:shadow-lift transition-shadow animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${stat.accent}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-ink mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.iconBg} p-2.5 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Actions + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-card p-6 animate-fade-up" style={{ animationDelay: '320ms' }}>
            <h2 className="text-lg font-semibold text-ink mb-5">{t('dashboard.academicMgmt')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 hover:shadow-card transition-all text-left group"
                  >
                    <div className={`inline-flex p-2 rounded-lg ${item.color} ring-1 mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{item.title}</p>
                    <p className="font-semibold text-ink group-hover:text-blue-600 transition-colors">{item.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-card p-6 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-ink">{t('dashboard.recentActivity')}</h2>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <ul className="space-y-3">
              {recentActivities.map((a, i) => {
                const Icon = a.icon;
                return (
                  <li key={i} className="flex items-center gap-3 py-2">
                    <div className={`p-2 rounded-lg ${a.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{a.action}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right: Enrollment Chart */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-card p-6 animate-fade-up" style={{ animationDelay: '480ms' }}>
            <h3 className="text-lg font-semibold text-ink mb-6">{t('dashboard.enrollmentByGrade')}</h3>
            {enrollmentByGrade.length > 0 ? (
              <div className="space-y-4">
                {enrollmentByGrade.map((g, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">{g.name}</span>
                      <span className="text-sm text-gray-500">{g.count}/{g.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(g.pct, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">{t('dashboard.noGradeData')}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-card p-6 animate-fade-up" style={{ animationDelay: '560ms' }}>
            <h3 className="text-lg font-semibold text-ink mb-4">{t('dashboard.certificates')}</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: t('dashboard.pendingCerts'), count: certificates.filter(c => c.status === 'pending').length, color: 'text-sun-500' },
                { label: t('dashboard.issuedCerts'), count: certificates.filter(c => c.status === 'issued').length, color: 'text-leaf-500' },
                { label: t('dashboard.deliveredCerts'), count: certificates.filter(c => c.status === 'delivered').length, color: 'text-blue-600' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
