/** @type {import('tailwindcss').Config} */
// Paleta inspirada en el escudo de Semillitas del Futuro:
// cielo turquesa (marca), estrellas amarillas (acento) y hojas verdes.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Se redefine "blue" para que todas las vistas existentes tomen el color de marca.
        blue: {
          50: '#effaff',
          100: '#ddf4ff',
          200: '#b5eaff',
          300: '#76dbff',
          400: '#2ec7fa',
          500: '#05afe8',
          600: '#008cc7',
          700: '#0170a1',
          800: '#065e85',
          900: '#0b4e6e',
          950: '#082f45',
        },
        ink: {
          DEFAULT: '#0b2239',
          soft: '#163452',
        },
        sun: {
          100: '#fff6cc',
          300: '#ffe066',
          400: '#ffd23f',
          500: '#f5b700',
        },
        leaf: {
          100: '#dcf7e3',
          400: '#4ccb76',
          500: '#2fb35d',
          600: '#22914a',
        },
        gray: {
          50: '#f7f9fc',
          100: '#eef2f7',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f1c2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,34,57,0.04), 0 4px 16px -4px rgba(11,34,57,0.08)',
        lift: '0 10px 30px -10px rgba(11,34,57,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'pop-in': 'pop-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
