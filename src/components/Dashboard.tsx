import { useMemo } from 'react';
import {
  GraduationCap, UserCheck, Award, BookOpen, TrendingUp,
  FileText, Calendar, Users, ClipboardList, BarChart3, Bell
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Dashboard() {
  const { students, teachers, certificates, grades, currentUser } = useStore();

  const stats = useMemo(() => [
    {
      title: 'Total Estudiantes',
      value: students.length,
      icon: GraduationCap,
      accent: 'from-blue-400 to-blue-600',
      iconBg: 'bg-blue-500',
      change: `${students.filter(s => s.status === 'active').length} activos`,
    },
    {
      title: 'Docentes Activos',
      value: teachers.filter(t => t.status === 'active').length,
      icon: UserCheck,
      accent: 'from-leaf-400 to-leaf-600',
      iconBg: 'bg-leaf-500',
      change: `${teachers.length} en total`,
    },
    {
      title: 'Certificados Emitidos',
      value: certificates.filter(c => c.status === 'issued' || c.status === 'delivered').length,
      icon: Award,
      accent: 'from-sun-300 to-sun-500',
      iconBg: 'bg-sun-500',
      change: `${certificates.filter(c => c.status === 'pending').length} pendientes`,
    },
    {
      title: 'Grados Activos',
      value: grades.length,
      icon: BookOpen,
      accent: 'from-purple-400 to-purple-600',
      iconBg: 'bg-purple-500',
      change: `${grades.reduce((sum, g) => sum + g.capacity, 0)} cupos totales`,
    },
  ], [students, teachers, certificates, grades]);

  const recentActivities = [
    { action: 'Nuevo estudiante registrado', time: 'Hace 2 horas', icon: GraduationCap, color: 'text-blue-600 bg-blue-50' },
    { action: 'Certificado de estudios emitido', time: 'Hace 4 horas', icon: Award, color: 'text-sun-500 bg-sun-100' },
    { action: 'Docente asignado a grado 10-A', time: 'Hace 1 día', icon: UserCheck, color: 'text-leaf-500 bg-leaf-100' },
    { action: 'Reporte trimestral generado', time: 'Hace 2 días', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
    { action: 'Documento de matrícula subido', time: 'Hace 3 días', icon: FileText, color: 'text-blue-600 bg-blue-50' },
  ];

  const quickActions = [
    { title: 'Archivos', subtitle: 'Actas', icon: FileText, color: 'bg-blue-50 text-blue-600 ring-blue-200' },
    { title: 'Gestión', subtitle: 'Solicitudes', icon: Calendar, color: 'bg-leaf-100 text-leaf-600 ring-leaf-200' },
    { title: 'Recursos', subtitle: 'Técnicos', icon: Users, color: 'bg-sun-100 text-sun-500 ring-sun-300' },
    { title: 'Archivos', subtitle: 'Órdenes', icon: ClipboardList, color: 'bg-purple-50 text-purple-600 ring-purple-200' },
    { title: 'Gestión', subtitle: 'Informes', icon: TrendingUp, color: 'bg-red-50 text-red-500 ring-red-200' },
    { title: 'Gestión', subtitle: 'Tipo Órdenes', icon: Award, color: 'bg-indigo-50 text-indigo-600 ring-indigo-200' },
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
              ¡Bienvenido, {currentUser?.name ?? 'Administrador'}!
            </h1>
            <p className="text-gray-500">Gestión académica integral — EduGestión</p>
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
            <h2 className="text-lg font-semibold text-ink mb-5">Gestión Académica</h2>
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
              <h2 className="text-lg font-semibold text-ink">Actividad Reciente</h2>
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
            <h3 className="text-lg font-semibold text-ink mb-6">Matrícula por Grado</h3>
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
              <p className="text-sm text-gray-400 text-center py-8">Sin datos de grados</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-card p-6 animate-fade-up" style={{ animationDelay: '560ms' }}>
            <h3 className="text-lg font-semibold text-ink mb-4">Certificados</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Pendientes', count: certificates.filter(c => c.status === 'pending').length, color: 'text-sun-500' },
                { label: 'Emitidos', count: certificates.filter(c => c.status === 'issued').length, color: 'text-leaf-500' },
                { label: 'Entregados', count: certificates.filter(c => c.status === 'delivered').length, color: 'text-blue-600' },
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
