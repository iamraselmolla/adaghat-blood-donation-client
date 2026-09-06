# LifeDrop — Blood Donation Admin (Frontend)

Production-ready Next.js 14 (App Router) + TypeScript PWA admin dashboard for a Blood Donation Management platform.

## Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS + custom crimson (`#e11d48`) theme, glassmorphism cards
- Framer Motion (page transitions, micro-interactions)
- Shadcn-style UI primitives built on Radix UI
- Zustand (auth state) + TanStack React Query (server state)
- React Hook Form + Zod (forms & validation)
- Axios (API client w/ access + refresh token interceptor)
- `next-pwa` (installable PWA, service worker, offline caching)
- Recharts (dashboard charts)

## Getting Started
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your backend
npm run dev
```

## Folder Structure
```
app/
  (auth)/login/page.tsx          # unified email-or-phone login/signup
  (dashboard)/
    layout.tsx                   # sidebar + topbar + bottom nav + auth guard
    dashboard/page.tsx           # overview: stats, quick actions, recent donors
    donors/page.tsx              # filterable donor list + modals
    donors/[id]/page.tsx         # deep-link stub
    roles/page.tsx               # Super Admin: manage admins/members
    requests/page.tsx            # emergency requests (scaffold)
    settings/page.tsx
  layout.tsx / globals.css
components/
  ui/            # button, card, input, dialog, sheet, tabs, select, etc.
  layout/        # sidebar, topbar, bottom-nav, mobile-drawer, theme-toggle
  dashboard/     # stat-card, stats-grid, recent-donors-table, quick-actions, chart
  donors/        # table, filters, detail modal, multi-step form modal, stepper
  roles/         # add-staff modal, staff-row
  providers/     # theme + react-query providers
  shared/        # page-transition, pagination
lib/
  axios.ts, services/*.ts        # API integration layer
  schemas/donor-schema.ts        # Zod validation
  nav-config.ts, bd-locations.ts, utils.ts
store/auth-store.ts              # Zustand auth store
hooks/                           # use-permissions (RBAC), use-auth-guard, use-debounced-value
types/index.ts                   # shared TypeScript types
public/manifest.json             # PWA manifest (next-pwa generates sw.js at build)
```

## Role-Based Access (RBAC)
`hooks/use-permissions.ts` centralizes all UI-level permission checks:
- **SUPER_ADMIN**: full access, including Role Management
- **ADMIN**: create/edit donors + medical records (no delete, no role management)
- **MEMBER**: strictly read-only — action buttons/menus are hidden entirely

> Note: UI-level gating is a UX convenience only. The backend must independently enforce RBAC on every endpoint (see backend deliverable).

## PWA
- `public/manifest.json` defines install metadata, icons, and app shortcuts.
- `next-pwa` auto-generates and registers the service worker at build (disabled in dev).
- Add real icon PNGs to `public/icons/` (192, 256, 384, 512, and a 512 maskable) before production build.

## Notes / Next Steps
- Replace `lib/bd-locations.ts` with the full Bangladesh division/district/upazila dataset.
- `app/(dashboard)/requests` is scaffolded but not wired to an API yet.
- Icons in `public/icons/` are placeholders — swap in branded assets.
