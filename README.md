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
    donations/page.tsx           # donation log: record + browse donation history
    roles/page.tsx               # Super Admin: manage admins/members
    requests/page.tsx            # emergency requests (scaffold)
    settings/page.tsx
  layout.tsx / globals.css
components/
  ui/            # button, card, input, dialog, sheet, tabs, select, etc.
  layout/        # sidebar, topbar, bottom-nav, mobile-drawer, theme-toggle
  dashboard/     # stat-card, stats-grid, recent-donors-table, quick-actions, chart
  donors/        # table, filters, detail modal, multi-step form modal, stepper
  donations/     # donor-picker (eligibility-filtered), record-donation modal, history list
  roles/         # add-staff modal, staff-row
  providers/     # theme + react-query providers
  shared/        # page-transition, pagination, install-pwa-button
lib/
  axios.ts, services/*.ts        # API integration layer (auth, donor, donation, admin)
  schemas/*.ts                   # Zod validation (donor form, donation form)
  nav-config.ts, bd-locations.ts, utils.ts
store/auth-store.ts              # Zustand auth store
hooks/                           # use-permissions (RBAC), use-auth-guard, use-debounced-value, use-install-prompt
types/index.ts                   # shared TypeScript types
public/manifest.json             # PWA manifest (next-pwa generates sw.js at build)
```

## Donation Tracking & Eligibility

- **3-month rule**: `lib/utils.ts` exports `MIN_DONATION_GAP_DAYS = 90` and `isEligibleByDate()` / `daysUntilEligible()`. A donor can't be selected for a new donation until 90 days have passed since their last one.
- **`components/donations/donor-picker.tsx`**: the donor search used when recording a donation automatically filters out anyone still inside that 3-month window (and shows how many were hidden).
- **`components/donations/record-donation-modal.tsx`**: captures donation date, location, recipient/patient name, and optional requester name + phone. Submitting updates the donor's `lastDonationDate` (handled by the backend) and adds an entry to their history.
- **Donor Detail modal** shows each donor's full donation history and a "Record Donation" action that's disabled with a tooltip while they're ineligible.
- ⚠️ **This eligibility check must also be enforced server-side** — the frontend filtering is UX only, not a security boundary. The backend's `POST /donations` endpoint should independently reject donations that violate the 90-day rule.

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

## API Contract Expected by the Frontend

Base URL comes from `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5000/api/v1`). All authenticated requests send `Authorization: Bearer <accessToken>`; a 401 on any non-auth route triggers a silent refresh via `POST /auth/refresh` (see `lib/axios.ts`).

**Auth** (`lib/services/auth.service.ts`)
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/login` | body `{ identifier, password }` → `{ user, accessToken, refreshToken }` |
| POST | `/auth/register-staff` | body `{ name, identifier, password, role }` |
| GET  | `/auth/me` | returns current `AuthUser` |
| POST | `/auth/logout` | |
| POST | `/auth/refresh` | body `{ refreshToken }` → `{ accessToken }` (called automatically by the axios interceptor) |

**Donors** (`lib/services/donor.service.ts`)
| Method | Path | Notes |
|---|---|---|
| GET | `/donors` | query = `DonorFilters` (search, bloodGroup, division, district, upazila, availability, eligibility, page, limit) → `PaginatedResponse<Donor>` |
| GET | `/donors/:id` | |
| POST | `/donors` | ADMIN+ only |
| PUT | `/donors/:id` | ADMIN+ only |
| DELETE | `/donors/:id` | SUPER_ADMIN only |
| PUT | `/donors/:id/medical-record` | ADMIN+ only |

**Donations** (`lib/services/donation.service.ts`)
| Method | Path | Notes |
|---|---|---|
| GET | `/donations` | query `{ page, limit, donorId?, search? }` → `PaginatedResponse<DonationRecord>` with `donorName`/`donorBloodGroup` populated |
| GET | `/donors/:donorId/donations` | full history for one donor, newest first |
| POST | `/donations` | ADMIN+ only. **Must re-validate the 90-day rule server-side** and reject with a clear error if violated. On success, update the donor's `lastDonationDate`. |

**Admin** (`lib/services/admin.service.ts`)
| Method | Path | Notes |
|---|---|---|
| GET | `/admin/stats` | → `DashboardStats` (totalDonors, eligibleDonors, emergencyRequests, activeAdmins, optional trend %s) |
| GET | `/admin/staff` | SUPER_ADMIN only → `StaffMember[]` |
| PUT | `/admin/staff/:id/role` | SUPER_ADMIN only, body `{ role }` |
| PUT | `/admin/staff/:id/status` | SUPER_ADMIN only, body `{ status }` |

Exact shapes for every payload/response are in `types/index.ts`.

## Notes / Next Steps
- Replace `lib/bd-locations.ts` with the full Bangladesh division/district/upazila dataset.
- `app/(dashboard)/requests` is scaffolded but not wired to an API yet.
- Icons in `public/icons/` are placeholders — swap in branded assets.
