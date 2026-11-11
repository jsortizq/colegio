import React from 'react';
import {
  Home,
  Users,
  GraduationCap,
  UserCheck,
  Award,
  BarChart3,
  Settings,
  ChevronLeft,
  School,
  LogOut,
  X,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'grades', label: 'Grados', icon: School },
  { id: 'students', label: 'Estudiantes', icon: GraduationCap },
  { id: 'teachers', label: 'Docentes', icon: UserCheck },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'certificates', label: 'Certificados', icon: Award },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar({ activeView, onViewChange, collapsed, onToggleCollapse, onClose }: SidebarProps) {
  const { currentUser, logout } = useStore();

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div
      className={`bg-ink text-white h-full flex flex-col transition-all duration-200 ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Inline SVG logo */}
            <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" aria-hidden="true">
              <circle cx="18" cy="18" r="18" fill="#008cc7" />
              <path
                d="M18 10 L10 16 V26 H26 V16 Z"
                fill="none"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <rect x="15" y="21" width="6" height="5" rx="0.8" fill="#ffd23f" />
              <circle cx="18" cy="16" r="2.5" fill="#fff" />
            </svg>
            <div className="min-w-0">
              <h1 className="text-base font-display font-bold truncate leading-tight">EduGestión</h1>
              <p className="text-[11px] text-gray-400 truncate">Gestión Escolar</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {/* Close button — mobile only */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg hover:bg-ink-soft transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {/* Collapse toggle — desktop only */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:block p-1.5 rounded-lg hover:bg-ink-soft transition-colors"
            aria-label={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-ink-soft hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="shrink-0 p-3 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser?.name ?? 'Usuario'}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser?.email ?? ''}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="p-1.5 rounded-lg hover:bg-ink-soft transition-colors text-gray-400 hover:text-white shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
