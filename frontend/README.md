# Frontend (React + Vite)

Modern React application with Vite for fast development and production builds.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000` and proxy API requests to `http://localhost:5001/api`.

## Project Structure

```
frontend/src/
├── api/              # API client wrappers (axios)
│   ├── client.js     # Axios instance with auth interceptors
│   ├── auth.js       # Authentication endpoints
│   ├── services.js   # Service/package endpoints
│   └── bookings.js   # Booking endpoints
├── components/       # Reusable UI components (to be added)
├── layouts/         # Page layouts
│   ├── UserLayout.jsx
│   ├── AdminLayout.jsx
│   └── AuthLayout.jsx
├── pages/           # Route pages
│   ├── HomePage.jsx
│   ├── ServicesPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   └── admin/
│       └── AdminDashboardPage.jsx
├── routes/          # Route definitions + protected routes
│   └── AppRoutes.jsx
└── styles/          # Theme tokens (green-based palette) + globals
    └── index.css
```

## Features

- ✅ React Router for navigation
- ✅ Protected routes (auth + admin role checks)
- ✅ API client with JWT token management
- ✅ Green-themed design system
- ✅ Responsive layouts (mobile-first)
- ✅ Loading states and error handling
- ✅ Form validation

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

