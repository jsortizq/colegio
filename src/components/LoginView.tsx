import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useI18n } from '../i18n';

export default function LoginView() {
  const { login } = useStore();
  const { t, lang, setLang } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 600));

    const ok = login(email, password);
    if (!ok) {
      setError(t('login.error'));
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Language toggle — floating */}
      <button
        onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur text-ink text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-gray-200/60 hover:bg-white transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        {lang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
      </button>

      {/* Left panel — illustration (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ink-DEFAULT via-blue-900 to-blue-700 relative overflow-hidden items-center justify-center p-12">
        {/* Abstract decorative SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          viewBox="0 0 800 800"
          aria-hidden="true"
        >
          <circle cx="400" cy="400" r="350" fill="none" stroke="#fff" strokeWidth="1" />
          <circle cx="400" cy="400" r="250" fill="none" stroke="#fff" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="150" fill="none" stroke="#fff" strokeWidth="0.5" />
          <line x1="0" y1="400" x2="800" y2="400" stroke="#fff" strokeWidth="0.5" />
          <line x1="400" y1="0" x2="400" y2="800" stroke="#fff" strokeWidth="0.5" />
        </svg>

        <div className="relative text-center max-w-md animate-fade-up">
          {/* Hero illustration — school-themed SVG */}
          <svg viewBox="0 0 240 200" className="w-56 h-auto mx-auto mb-10" aria-hidden="true">
            {/* Building */}
            <rect x="60" y="70" width="120" height="100" rx="4" fill="#fff" fillOpacity="0.15" />
            <rect x="90" y="130" width="24" height="40" rx="2" fill="#ffd23f" fillOpacity="0.8" />
            <rect x="126" y="130" width="24" height="40" rx="2" fill="#ffd23f" fillOpacity="0.8" />
            {/* Roof */}
            <path d="M50 75 L120 30 L190 75" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Clock */}
            <circle cx="120" cy="95" r="14" fill="none" stroke="#fff" strokeWidth="2" />
            <line x1="120" y1="95" x2="120" y2="86" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="120" y1="95" x2="128" y2="95" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            {/* Flag */}
            <line x1="120" y1="30" x2="120" y2="10" stroke="#fff" strokeWidth="2" />
            <rect x="121" y="10" width="18" height="11" rx="1" fill="#ffd23f" fillOpacity="0.9" />
            {/* Books on the left */}
            <rect x="20" y="145" width="14" height="25" rx="2" fill="#2ec7fa" fillOpacity="0.6" transform="rotate(-10 27 157)" />
            <rect x="30" y="143" width="14" height="25" rx="2" fill="#4ccb76" fillOpacity="0.6" transform="rotate(5 37 155)" />
            {/* Graduation cap on right */}
            <path d="M200 120 L220 130 L200 140 L180 130 Z" fill="#fff" fillOpacity="0.7" />
            <line x1="200" y1="130" x2="200" y2="150" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.7" />
            <path d="M190 135 L190 148 Q200 155 210 148 L210 135" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.5" />
          </svg>

          <h1 className="text-3xl font-display font-black text-white mb-3">{t('login.hero.title')}</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            {t('login.hero.subtitle')}
          </p>
          <p className="text-blue-300/70 text-sm mt-4">
            {t('login.hero.description')}
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <svg viewBox="0 0 36 36" className="w-14 h-14 mx-auto mb-3" aria-hidden="true">
              <circle cx="18" cy="18" r="18" fill="#008cc7" />
              <path d="M18 10 L10 16 V26 H26 V16 Z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
              <rect x="15" y="21" width="6" height="5" rx="0.8" fill="#ffd23f" />
              <circle cx="18" cy="16" r="2.5" fill="#fff" />
            </svg>
            <h1 className="text-2xl font-display font-bold text-ink">{t('login.hero.title')}</h1>
            <p className="text-gray-500 text-sm">{t('login.hero.subtitle')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-200/60">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-ink">{t('login.title')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('login.subtitle')}</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2 bg-red-50 text-red-700 text-sm rounded-lg p-3 border border-red-200 animate-pop-in">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('login.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder={t('login.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-xl text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder={t('login.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                    {t('login.loading')}
                  </>
                ) : (
                  t('login.submit')
                )}
              </button>
            </form>
          </div>

          {/* Demo hint */}
          <div className="mt-5 text-center">
            <div className="inline-flex items-center gap-2 bg-sun-100 text-ink text-xs font-medium px-4 py-2 rounded-full border border-sun-300/40">
              <span className="font-bold">Demo:</span>
              <code className="bg-white/60 px-1.5 py-0.5 rounded text-[11px]">admin@edugestion.edu</code>
              <span>/</span>
              <code className="bg-white/60 px-1.5 py-0.5 rounded text-[11px]">admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
