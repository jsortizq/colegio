# EduGestión — Plataforma de Gestión Escolar

[![CI](https://github.com/jsortizq/colegio-semillitas/actions/workflows/ci.yml/badge.svg)](https://github.com/jsortizq/colegio-semillitas/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)](https://tailwindcss.com/)

A **fully client-side** school management platform built with React 18, TypeScript, and Tailwind CSS. Designed as a modern, responsive SPA with in-memory CRUD, localStorage persistence, and a demo mode for showcasing without a backend.

## ✨ Features

- **Role-based authentication** — Admin, Teacher, and Student roles with different access levels
- **Student management** — Full CRUD with search, filtering, and status tracking
- **Teacher management** — Track faculty by subject, hire date, and status
- **Grade management** — Organize students by academic grade/section
- **Certificate generation** — Issue study, grade, and conduct certificates
- **Document registry** — Track uploaded student documents by type
- **Reports dashboard** — Enrollment stats, grade distribution, faculty overview
- **Settings panel** — Institution config and data reset
- **Demo mode** — `VITE_DEMO=true` shows a banner with reset capability; demo credentials are hinted at login

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 with Hooks & Context API |
| Language | TypeScript 5.5 (strict mode) |
| Styling | Tailwind CSS 3.4 with custom brand palette |
| Build | Vite 5 |
| Icons | Lucide React |
| Testing | Vitest + React Testing Library |
| State | React Context + `useReducer`-like pattern with localStorage persistence |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Demo build (shows beta banner + demo credentials)
npm run build:demo

# Run tests
npm test
```

## 🎨 Design System

The UI uses a custom palette inspired by a sky-turquoise brand identity:

- **Blue** (brand): `#05afe8` → `#008cc7` gradient
- **Ink**: `#0b2239` (dark backgrounds)
- **Sun**: Gold accent `#ffd23f`
- **Leaf**: Green success `#4ccb76`
- **Typography**: Inter (body) + Nunito (display headings)

Custom utilities: `shadow-card`, `shadow-lift`, `animate-fade-up`, `animate-pop-in`.

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@edugestion.edu` | `admin123` |
| Teacher | `maria.gonzalez@edugestion.edu` | `docente123` |
| Student | `ana.martinez@edugestion.edu` | `est123` |

## 📁 Project Structure

```
src/
├── components/         # All view components
│   ├── LoginView.tsx   # Authentication screen
│   ├── Dashboard.tsx   # Stats overview
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Topbar.tsx      # Mobile header
│   ├── StudentsView.tsx
│   ├── TeachersView.tsx
│   ├── GradesView.tsx
│   ├── CertificatesView.tsx
│   ├── DocumentsView.tsx
│   ├── UsersView.tsx
│   ├── ReportsView.tsx
│   └── SettingsView.tsx
├── store/
│   └── useStore.ts     # React Context store with localStorage
├── data/
│   └── mockData.ts     # Seed data (10 students, 5 teachers, 5 grades)
├── types/
│   └── index.ts        # TypeScript interfaces
└── test/
    └── setup.ts        # Vitest setup
```

## 🏗 Architecture Decisions

1. **No backend required** — All data lives in a React Context store backed by localStorage. This makes the app instantly deployable as a static site.
2. **Brand-agnostic naming** — Uses the fictional "EduGestión" brand to demonstrate the platform without ties to any real institution.
3. **VITE_DEMO env flag** — When set, renders a top banner and exposes a data-reset button, making it safe for public demos.
4. **Custom Tailwind palette** — Instead of using default colors, the `blue` scale is overridden with brand-specific turquoise tones for a cohesive look.
5. **No router library** — Simple `useState`-based view switching keeps the bundle small (~245KB gzipped JS). Suitable for the scale of this SPA.

## 🧪 Testing

The test suite covers the core store logic:

- Authentication flow (login, logout, invalid credentials)
- Student CRUD (add, update, delete)
- Teacher CRUD
- localStorage persistence and data reset

```bash
npm test        # Single run
npm run test:watch  # Watch mode
```

## 📄 License

MIT
