# Bank Ledger

Modern full‑stack banking ledger with secure auth, transfers, idempotent transactions, and real‑time balances.

- Live Frontend: https://bank-ledger-9.onrender.com
- Live Backend: https://bank-ledger-1.onrender.com

## Stack

- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + Axios
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT
- Email (optional): Nodemailer (Gmail OAuth2)
- Deployment: Render (Web Services), `render.yaml` blueprint

## Monorepo Layout

- backend/ — Express API (`server.js`, routes under `src/`)
- frontend/ — Next.js app (App Router, Tailwind)
- render.yaml — Render blueprint (two web services)
- .gitignore — excludes node_modules and .env files

## Quick Start (Local)

1) Clone the repo

```powershell
git clone https://github.com/Priya-0217/bank-ledger.git
cd bank-ledger
```

2) Backend (port 3000)

- Create backend/.env

```powershell
# backend/.env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<a-strong-random-secret>
# Optional email (can be omitted)
EMAIL_USER=...
CLIENT_ID=...
CLIENT_SECRET=...
REFRESH_TOKEN=...
```

- Install & run

```powershell
cd backend
npm ci
npm run dev
```

3) Frontend (port 3001)

- For local dev the Next rewrite already proxies `/api/*` to `http://localhost:3000`, so no env needed.
- Install & run

```powershell
cd ..\frontend
npm ci
npm run dev
```

Open http://localhost:3001 and register/login.

## API Endpoints

Base URL: `{BACKEND_URL}` (e.g., http://localhost:3000 or your Render URL)

- Auth
  - POST `/api/auth/register` { name, email, password }
  - POST `/api/auth/login` { email, password }
  - POST `/api/auth/logout`
- Accounts
  - POST `/api/account` (create account for current user)
  - GET `/api/account` (list accounts for current user)
  - GET `/api/account/balance/:accountId` (derived from ledger)
- Transactions
  - POST `/api/transaction` { fromAccount, toAccount, amount, idempotencyKey }
  - POST `/api/transaction/initial-funds` (system user only)
  - GET `/api/transaction/history` (list transactions for user’s accounts)

Notes:
- Transfers include an intentional ~15s processing delay before commit to simulate asynchronous settlement.
- `idempotencyKey` prevents duplicates.

## Deployment (Render)

This repo includes a `render.yaml` for a two‑service setup. You can either use the blueprint or create services manually.

### Using the Blueprint

- In Render: New → Blueprint → point to repo root.
- Provide env vars when prompted.

### Manual Services

- Backend (Web Service):
  - Root Directory: `backend`
  - Build Command: `npm ci`
  - Start Command: `node server.js`
  - Environment:
    - `MONGO_URI`, `JWT_SECRET` (required)
    - `NODE_VERSION=20` (optional; engines already pinned)
- Frontend (Web Service):
  - Root Directory: `frontend`
  - Build Command: `npm ci && npm run build`
  - Start Command: `npm run start`
  - Environment:
    - `NEXT_PUBLIC_API_URL=https://bank-ledger-1.onrender.com`
    - `NODE_VERSION=20` (optional)

The frontend uses `NEXT_PUBLIC_API_URL` for server‑side rewrites in production. Locally it defaults to `http://localhost:3000`.

## Features

- JWT auth with cookie/header support and logout blacklist
- Protected routes on frontend via layout guard
- Accounts: creation and derived balance from ledger entries
- Transfers with idempotency and simulated processing delay
- Transaction history for user accounts
- Clean, responsive UI (slate/indigo palette, gradient balance cards)

## Troubleshooting

- Registration failed:
  - Ensure backend has `MONGO_URI` and `JWT_SECRET`.
  - If the email was previously used (e.g., Postman), you'll get a 422 — try a new email.
  - Check the browser Network tab for `/api/auth/register` status and message.
- Frontend build on Render:
  - Use a Web Service (not Static Site).
  - Build `npm ci && npm run build` and Start `npm run start`.
- CORS:
  - Avoided by Next rewrite. Ensure `NEXT_PUBLIC_API_URL` is set correctly in production.

## Scripts

Frontend
- `npm run dev` → Next dev server on port 3001
- `npm run build` → Build
- `npm run start` → Production server (uses PORT env in Render)

Backend
- `npm run dev` → Nodemon dev server on port 3000 (or `PORT` if set)

## Security

- Never commit `.env` files (repo `.gitignore` excludes them).
- Use strong, unique `JWT_SECRET`.
- Keep dependencies up to date.
