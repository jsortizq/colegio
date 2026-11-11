import React from 'react';
import { Menu } from 'lucide-react';
import { useStore } from '../store/useStore';

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { currentUser } = useStore();

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shrink-0">
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      <div className="flex items-center gap-2">
        <svg viewBox="0 0 36 36" className="w-7 h-7" aria-hidden="true">
          <circle cx="18" cy="18" r="18" fill="#008cc7" />
          <path d="M18 10 L10 16 V26 H26 V16 Z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
          <rect x="15" y="21" width="6" height="5" rx="0.8" fill="#ffd23f" />
          <circle cx="18" cy="16" r="2.5" fill="#fff" />
        </svg>
        <span className="font-display font-bold text-ink text-base">EduGestión</span>
      </div>

      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
        {initials}
      </div>
    </header>
  );
}
