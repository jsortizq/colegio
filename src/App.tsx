import React, { useState } from 'react';
import { StoreProvider, useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import StudentsView from './components/StudentsView';
import TeachersView from './components/TeachersView';
import GradesView from './components/GradesView';
import UsersView from './components/UsersView';
import CertificatesView from './components/CertificatesView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import { RotateCcw } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, resetData } = useStore();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDemo = import.meta.env.VITE_DEMO === 'true';

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'grades':
        return <GradesView />;
      case 'users':
        return <UsersView />;
      case 'certificates':
        return <CertificatesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Demo banner */}
      {isDemo && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-sun-400 text-ink-DEFAULT text-center text-sm font-semibold py-1.5 px-4 flex items-center justify-center gap-3">
          <span>🚀 Demo Beta — Los datos se guardan localmente</span>
          <button
            onClick={resetData}
            className="inline-flex items-center gap-1 bg-ink-DEFAULT/10 hover:bg-ink-DEFAULT/20 text-ink-DEFAULT text-xs font-bold px-2.5 py-0.5 rounded-full transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reiniciar datos
          </button>
        </div>
      )}

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile as overlay */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          transform transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isDemo ? 'md:pt-8' : ''}
        `}
      >
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div className={`flex-1 flex flex-col min-w-0 ${isDemo ? 'pt-8' : ''}`}>
        {/* Mobile topbar */}
        <Topbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
