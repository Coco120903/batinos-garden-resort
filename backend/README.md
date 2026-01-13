# Backend (Express + MongoDB)

## Setup

1) **Set up MongoDB Database** (required first step):
   - **Option A (Recommended)**: Use MongoDB Atlas (cloud) - See `../MONGODB_SETUP_TUTORIAL.md` for detailed step-by-step instructions
   - **Option B**: Use local MongoDB - Install MongoDB Community Server locally

2) Create `backend/.env` locally (do not commit). Use `backend/env.sample` as reference.
   - Copy `env.sample` to `.env`
   - Fill in your `MONGODB_URI` (from Atlas or local)
   - Set a secure `JWT_SECRET` (long random string)

3) Install dependencies:

```bash
cd backend
npm install
```

4) Seed initial data (creates resort packages):

```bash
npm run seed:resort
```

5) Run API:

```bash
npm run dev
```

## Smoke test

- With the server running, `GET http://localhost:5001/api/health` should return `{ ok: true, ... }`
- After seeding, `GET http://localhost:5001/api/services` should return your resort packages

## MongoDB Setup Help

**New to MongoDB?** See the detailed tutorial: `../MONGODB_SETUP_TUTORIAL.md`
- Step-by-step Atlas setup (with screenshots descriptions)
- Organization and project creation
- Connection string configuration
- Common issues and solutions

