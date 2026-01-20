import { Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated, logout } from '../api/auth'

// Layouts
import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'

// Pages (we'll create these next)
import HomePage from '../pages/HomePage'
import ExplorePage from '../pages/ExplorePage'
import ServicesPage from '../pages/ServicesPage'
import ContactsPage from '../pages/ContactsPage'
import BookServicePage from '../pages/BookServicePage'
import VillaDetailPage from '../pages/VillaDetailPage'
import SpacesMomentsPage from '../pages/SpacesMomentsPage'
import EventsPage from '../pages/EventsPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import DashboardPage from '../pages/DashboardPage'
import ProfilePage from '../pages/ProfilePage'
import TermsPage from '../pages/TermsPage'
import PrivacyPage from '../pages/PrivacyPage'
import FAQsPage from '../pages/FAQsPage'
import MaintenancePage from '../pages/MaintenancePage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminMediaPage from '../pages/admin/AdminMediaPage'
import AdminReviewsPage from '../pages/admin/AdminReviewsPage'
import AdminSchedulePage from '../pages/admin/AdminSchedulePage'

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Check if session has expired (30 minutes inactivity)
  const lastActivity = localStorage.getItem('lastActivity')
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes
  if (lastActivity) {
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10)
    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
      // Session expired - logout and redirect
      logout()
      window.history.replaceState(null, '', '/login')
      return <Navigate to="/login" replace />
    }
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Maintenance page - standalone, no layout */}
      <Route path="/maintenance" element={<MaintenancePage />} />

      {/* Public Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="villa/:villaId" element={<VillaDetailPage />} />
        <Route path="spaces-moments" element={<SpacesMomentsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="faqs" element={<FAQsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Auth Layout (for login/register) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfilePage />} />
      </Route>

      <Route
        path="/book/:serviceId"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BookServicePage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="schedule" element={<AdminSchedulePage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
