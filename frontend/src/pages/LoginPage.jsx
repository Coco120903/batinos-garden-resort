import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
import { AlertCircle, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react'
import './Page.css'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [maintenanceOpen, setMaintenanceOpen] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'System is temporarily unavailable. Please try again later.'
  )

  useEffect(() => {
    const shouldShow = sessionStorage.getItem('showMaintenanceModal') === 'true'
    const msg = sessionStorage.getItem('maintenanceMessage')
    if (shouldShow) {
      setMaintenanceMessage(msg || 'System is temporarily unavailable. Please try again later.')
      setMaintenanceOpen(true)
      sessionStorage.removeItem('showMaintenanceModal')
      sessionStorage.removeItem('maintenanceMessage')
    }

    // Prevent back button navigation after logout
    // If user tries to go back, replace history to prevent accessing authenticated pages
    const handlePopState = () => {
      // Check if user is logged out but trying to go back
      const token = localStorage.getItem('token')
      if (!token) {
        // User is logged out, prevent going back to authenticated pages
        window.history.pushState(null, '', window.location.href)
      }
    }

    // Push a state to prevent back navigation
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(formData)
      // Redirect based on user role
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page auth-page auth-page--enhanced">
      <div className="container">
        <div className="auth-shell">
          {maintenanceOpen && (
            <div className="maintenance-modal-overlay" role="dialog" aria-modal="true">
              <div className="maintenance-modal">
                <div className="maintenance-modal__icon">
                  <AlertTriangle size={22} />
                </div>
                <div className="maintenance-modal__content">
                  <h3 className="maintenance-modal__title">System Under Maintenance</h3>
                  <p className="maintenance-modal__text">{maintenanceMessage}</p>
                </div>
                <div className="maintenance-modal__actions">
                  <button className="btn btn-primary" type="button" onClick={() => setMaintenanceOpen(false)}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="auth-visual">
            <div className="auth-visual__inner">
              <div className="pill pill-secondary">
                <ShieldCheck size={16} />
                Secure access
              </div>
              <h1 className="auth-visual__title">Welcome back</h1>
              <p className="auth-visual__subtitle">
                Manage your bookings, view package details, and receive updates from Batino&apos;s.
              </p>
              <div className="auth-visual__grid">
                <div className="auth-visual__card">
                  <span className="auth-visual__label">Fast</span>
                  <span className="auth-visual__value">Loads smoothly on low-end phones</span>
                </div>
                <div className="auth-visual__card">
                  <span className="auth-visual__label">Safe</span>
                  <span className="auth-visual__value">JWT + role-based access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card auth-card--wide">
            <h2 className="auth-title">Login</h2>
            <p className="auth-subtitle">Enter your email and password to continue.</p>

          {error && (
            <div className="alert alert-error">
              <div className="alert__row">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="check">
                <input type="checkbox" disabled={loading} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Login'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
