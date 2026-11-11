import { useState } from 'react';
import { Settings, School, RotateCcw, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useI18n } from '../i18n';

export default function SettingsView() {
  const { currentUser, resetData } = useStore();
  const { t } = useI18n();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">{t('settings.pageTitle')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('settings.pageSubtitle')}</p>
      </div>

      {/* School Info */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <School className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{t('settings.schoolInfo')}</h2>
            <p className="text-xs text-gray-500">{t('settings.schoolInfoSub')}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('settings.schoolName')}</label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">EduGestión</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('settings.schoolEmail')}</label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">info@edugestion.edu</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('settings.schoolPhone')}</label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">+57 300 123 4567</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('settings.academicYear')}</label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">2025</p>
          </div>
        </div>
      </section>

      {/* Current User */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-leaf-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{t('settings.activeSession')}</h2>
            <p className="text-xs text-gray-500">{t('settings.activeSessionSub')}</p>
          </div>
        </div>
        {currentUser && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('settings.userName')}</label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{currentUser.name}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('settings.userEmail')}</label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{currentUser.email}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('settings.userRole')}</label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2 capitalize">{currentUser.role}</p>
            </div>
          </div>
        )}
      </section>

      {/* Reset Data */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{t('settings.resetData')}</h2>
            <p className="text-xs text-gray-500">{t('settings.resetDataSub')}</p>
          </div>
        </div>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            {t('settings.resetAll')}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-red-600">{t('settings.resetConfirm')}</p>
            <button
              onClick={() => { resetData(); setShowConfirm(false); }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
            >
              {t('settings.confirm')}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        )}
      </section>

      {/* About */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sun-100 flex items-center justify-center">
            <Info className="w-5 h-5 text-sun-500" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{t('settings.about')}</h2>
            <p className="text-xs text-gray-500">{t('settings.aboutDesc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
