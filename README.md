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
npm install
npm run dev


### 2. Seed deals (optional)
```bash
cd backend
npm run seed
```

This inserts sample deals (mix of open and restricted). No users are created by the seed.

### 3. Frontend
```bash
cd frontend
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



## Internal flow of claiming a deal

1. User clicks “Claim this deal” on the deal detail page.
2. Frontend: if not logged in, redirect to login with `?redirect=/deals/:id`. If logged in, `POST /api/claims` with body `{ dealId }`.
3. Frontend: on success, redirect to dashboard where the new claim appears with status “pending”.

---




