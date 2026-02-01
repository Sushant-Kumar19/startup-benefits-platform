# Startup Benefits Platform

A full-stack application that provides exclusive SaaS deals and benefits for startup founders, early-stage teams, and indie hackers. Some deals are public; others are restricted and require user verification.

## Repository structure

- **`backend/`** — Node.js + Express + MongoDB REST API (JWT auth, deals, claims).
- **`frontend/`** — Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas connection string)

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

API runs at **http://localhost:4000**.

### 2. Seed deals (optional)

```bash
cd backend
npm run seed
```

This inserts sample deals (mix of open and restricted). No users are created by the seed.

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000/api if needed
npm install
npm run dev
```

App runs at **http://localhost:3000**.

---

## End-to-end application flow

1. **Landing** — User sees value proposition and CTAs to explore deals or sign up.
2. **Auth** — User registers or logs in; JWT is stored in `localStorage` and sent on API requests.
3. **Deals listing** — User browses deals, filters by category and access level (open/restricted), and searches.
4. **Deal detail** — User reads description, partner, benefits, eligibility; can claim if eligible.
5. **Claim** — Logged-in user claims a deal; backend checks auth and, for locked deals, verification. Claim is created with status `pending`.
6. **Dashboard** — User sees profile (name, email, verification status) and list of claimed deals with status (pending / approved / rejected).

Protected flows: dashboard and claim API require a valid JWT. Claiming a **locked** deal additionally requires `user.verified === true`; otherwise the API returns 403.

---

## Authentication and authorization strategy

- **Registration** (`POST /api/auth/register`): body `email`, `password`, `name`. Password is hashed with bcrypt; JWT is returned with user payload.
- **Login** (`POST /api/auth/login`): body `email`, `password`. JWT returned on success.
- **Current user** (`GET /api/auth/me`): requires `Authorization: Bearer <token>`. Returns user profile (including `verified`).
- **JWT**: signed with `JWT_SECRET`, contains `userId` and `email`. Expiry set via `JWT_EXPIRES_IN` (e.g. `7d`).
- **Protected routes**: `GET /api/claims`, `POST /api/claims` use a `protect` middleware that validates the JWT and attaches `req.user` (id, email, verified).
- **Locked deals**: `POST /api/claims` checks `deal.isLocked`; if true, the user must be verified (`req.user.verified === true`), otherwise the API responds with 403 and a clear message. No separate “requireVerified” middleware is used on the route; the check is done inside the claim controller.

Frontend: token is stored in `localStorage` after login/register. `api.ts` adds `Authorization: Bearer <token>` to requests when present. Dashboard and claim actions are only available when the user is logged in; the dashboard page redirects to login when not authenticated.

---

## Internal flow of claiming a deal

1. User clicks “Claim this deal” on the deal detail page.
2. Frontend: if not logged in, redirect to login with `?redirect=/deals/:id`. If logged in, `POST /api/claims` with body `{ dealId }`.
3. Backend:
   - **Auth**: `protect` middleware ensures a valid JWT and sets `req.user`.
   - **Validation**: `dealId` is validated (non-empty, valid ObjectId).
   - **Deal exists**: fetch deal by id; 404 if not found.
   - **Locked + unverified**: if `deal.isLocked && !req.user.verified`, respond 403 with a message that the deal is restricted and verification is required.
   - **Duplicate**: check for existing claim for this user+deal; 409 if already claimed.
   - **Create**: insert a `Claim` with `user`, `deal`, `status: 'pending'`. Return 201 with the created claim (populated deal summary).
4. Frontend: on success, redirect to dashboard where the new claim appears with status “pending”.

---

## Frontend–backend interaction

- **Base URL**: frontend uses `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`) for all API calls.
- **Auth**: login/register return `token` and `user`; frontend stores the token in `localStorage` and passes it in the `Authorization` header for `/auth/me`, `/claims`, and any other protected call.
- **Pages**:
  - **Landing**: static + links; no API.
  - **Deals list**: `GET /api/deals` with optional query params `category`, `accessLevel`, `search`.
  - **Deal detail**: `GET /api/deals/:id`; claim via `POST /api/claims` with `dealId`.
  - **Dashboard**: `GET /api/auth/me` (via AuthContext) and `GET /api/claims` to show profile and claimed deals.
- **Errors**: API returns `{ message: string }` (and sometimes `errors`) on failure; frontend shows these in forms or inline (e.g. claim error on deal page).
- **CORS**: backend is configured to allow the frontend origin (e.g. `http://localhost:3000`) so browser requests succeed.

---

## Known limitations and weak points

- **Verification**: There is no in-app flow to become “verified”. In production this would be an admin action or a separate verification workflow (e.g. document upload, manual review). For demo, a user can be set to verified by updating the `User` document in MongoDB (`verified: true`).
- **Claim status**: Claims are created as `pending`. There is no UI or API to approve/reject claims; that would be an admin or partner feature.
- **Token storage**: Using `localStorage` is simple but vulnerable to XSS. For production, consider httpOnly cookies or a more secure strategy.
- **Rate limiting**: No rate limiting on auth or claim endpoints; recommended for production.
- **Pagination**: Deals and claims lists are not paginated; fine for small datasets but should be added at scale.
- **SEO**: Deal pages could use dynamic metadata; not implemented.
- **Tests**: No unit or integration tests; adding them would improve maintainability and safety for refactors.

---

## Improvements required for production readiness

- **Security**: Move auth token to httpOnly cookie or similar; add rate limiting; enforce HTTPS; sanitize inputs and validate file uploads if any.
- **Verification**: Implement a verification workflow (admin panel or self-service with review) and surface status clearly in the UI.
- **Admin**: Endpoints and UI to approve/reject claims, manage deals, and mark users as verified.
- **Data**: Pagination and filtering for deals and claims; indexes already support category, locked, and search.
- **Observability**: Logging, error tracking, and health checks; structured logs for API and auth events.
- **Deployment**: Use env-based config; separate staging/production DBs; CI/CD and automated tests.
- **Accessibility**: Audit and fix focus order, ARIA, and keyboard navigation where needed.
- **Performance**: Consider caching for deal list (e.g. short TTL); optimize images if partner logos are added.

---

## UI and performance considerations

- **Animations**: Implemented with Framer Motion: landing hero and sections (staggered fade/slide), deal cards (hover lift, list stagger), dashboard and forms (fade/slide). Transitions are short and purposeful to avoid distraction.
- **Loading**: Skeleton loaders on deals list and dashboard; button loading states on login, register, and claim. Spinner/skeleton components are reusable.
- **Responsiveness**: Layouts and nav are responsive; filters stack on small screens; forms and cards adapt.
- **Dark mode**: CSS variables and Tailwind dark variants are used so the app respects `prefers-color-scheme: dark`.
- **Performance**: No heavy 3D or scroll-driven libraries by default; optional enhancements (e.g. Three.js hero) can be added without blocking core UX. Client-side data fetching is used for deals and claims; for production, consider ISR or static generation where appropriate.

---

## API summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/auth/register` | No | Register; returns token + user |
| POST | `/api/auth/login` | No | Login; returns token + user |
| GET | `/api/auth/me` | Yes | Current user profile |
| GET | `/api/deals` | No | List deals (query: category, accessLevel, search) |
| GET | `/api/deals/:id` | No | Single deal |
| GET | `/api/claims` | Yes | Current user’s claims |
| POST | `/api/claims` | Yes | Claim a deal (body: `dealId`) |
| GET | `/api/health` | No | Health check |

---

## Tech stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT (jsonwebtoken), bcryptjs, express-validator, TypeScript.
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion.

No GraphQL, Firebase, Supabase, or serverless abstractions are used; the backend is a single Express app with REST APIs and JWT-based authentication as required.
