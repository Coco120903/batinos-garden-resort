# Batino’s Garden Farm Resort — Appointment Booking & Management (MERN)

Production-ready appointment booking + admin management system for Batino’s Garden Farm Resort (Silang).

## Architecture (high level)

- **Frontend**: React (SPA) for public browsing + user booking + admin dashboard
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (access token) + role-based authorization (Admin vs User)
- **Media**: Simple image uploads for services/rooms/facilities

## Project structure

```
/
  backend/                 # Express API
    src/
      config/              # env + db config
      controllers/         # request handlers (thin)
      middlewares/         # auth, role checks, error handling
      models/              # Mongoose schemas
      routes/              # route definitions
      services/            # business logic (optional, grows with complexity)
      utils/               # helpers (tokens, validation, etc.)
      app.js               # express app wiring
      server.js            # process start (listening)
  frontend/                # React app
    src/
      api/                 # API client wrappers
      components/          # reusable UI components
      layouts/             # page shells (AdminLayout/UserLayout)
      pages/               # route pages
      routes/              # route definitions (protected routes)
      styles/              # design tokens + global styles
      utils/               # UI helpers
```

## Quick Start

1. **Set up MongoDB Database** (required first):
   - See `MONGODB_SETUP_TUTORIAL.md` for detailed step-by-step instructions
   - Creates free MongoDB Atlas account, organization, cluster, and connection string

2. **Backend Setup**:
   ```bash
   cd backend
   cp env.sample .env
   # Edit .env with your MONGODB_URI and JWT_SECRET
   npm install
   npm run seed:resort  # Creates initial resort packages
   npm run dev
   ```

3. **Frontend Setup** (coming next):
   ```bash
   cd frontend
   npm install
   npm start
   ```

## How we'll build (incrementally)

We'll build "vertical slices" (small end-to-end features) rather than dumping lots of code:

1) Backend skeleton + health endpoint ✅  
2) Auth (Admin login) + RBAC middleware ✅  
3) Core models (User/Service/Booking) ✅  
4) REST API endpoints (auth, services, bookings) ✅  
5) Frontend React app (user + admin dashboards)  
6) Booking workflow (Pending → Approved/Cancelled → Completed)  
7) Media uploads for service images  
8) Deployment readiness

