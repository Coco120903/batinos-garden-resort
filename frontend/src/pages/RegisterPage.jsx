import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'
import { CheckCircle2, AlertCircle, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import './Page.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      })
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page auth-page auth-page--enhanced">
        <div className="container">
          <div className="auth-card auth-card--centered">
            <div className="verification-sent">
              <div className="verification-sent__icon">
                <CheckCircle2 size={48} />
              </div>
              <h2>Verification Email Sent!</h2>
              <p className="verification-sent__message">
                We've sent a verification link to <strong>{formData.email}</strong>
              </p>
              <p className="verification-sent__instructions">
                Please check your email and click the verification link to activate your account. 
                You must verify your email before you can make bookings.
              </p>
              <div className="verification-sent__note">
                <p>Didn't receive the email? Check your spam folder or contact support.</p>
              </div>
              <div className="verification-sent__actions">
                <Link to="/login" className="btn btn-primary">
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page auth-page auth-page--enhanced">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-visual">
            <div className="auth-visual__inner">
              <div className="pill pill-secondary">
                <CheckCircle2 size={16} />
                Join us
              </div>
              <h1 className="auth-visual__title">Create Your Account</h1>
              <p className="auth-visual__subtitle">
                Sign up to book your event at Batino's Garden Farm Resort. Verify your email to start booking.
              </p>
              <div className="auth-visual__grid">
                <div className="auth-visual__card">
                  <span className="auth-visual__label">Secure</span>
                  <span className="auth-visual__value">Email verification required</span>
                </div>
                <div className="auth-visual__card">
                  <span className="auth-visual__label">Private</span>
                  <span className="auth-visual__value">We never sell your data</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card auth-card--wide">
            <h2 className="auth-title">Sign Up</h2>
            <p className="auth-subtitle">
              Sign up to book your event at Batino's Garden Farm Resort
            </p>
            <p className="auth-privacy-notice">
              <CheckCircle2 size={16} />
              We respect your privacy. We will never sell or misuse your personal information.
            </p>

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
              <label htmlFor="name">Full Name</label>
              <div className="input-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone (Optional)</label>
              <div className="input-wrap">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="0912 345 6789"
                  autoComplete="tel"
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={loading}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
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
              <small>Minimum 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Sign Up'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
