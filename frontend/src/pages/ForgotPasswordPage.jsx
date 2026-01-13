import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../api/auth'
import { Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import './Page.css'

function ForgotPasswordPage() {
  const [step, setStep] = useState('request') // 'request' or 'reset'
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await forgotPassword(email)
      setSuccess(true)
      setTimeout(() => {
        setStep('reset')
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await resetPassword({ token, email, password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Check if token is in URL (from email link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    const urlEmail = params.get('email')
    if (urlToken && urlEmail) {
      setToken(urlToken)
      setEmail(urlEmail)
      setStep('reset')
    }
  }, [])

  if (step === 'reset') {
    return (
      <div className="page auth-page auth-page--enhanced">
        <div className="container">
          <div className="auth-shell">
            <div className="auth-visual">
              <div className="auth-visual__inner">
                <div className="pill pill-secondary">
                  <Lock size={16} />
                  Reset password
                </div>
                <h1 className="auth-visual__title">Create New Password</h1>
                <p className="auth-visual__subtitle">
                  Enter your new password below. Make sure it's at least 6 characters long.
                </p>
              </div>
            </div>

            <div className="auth-card auth-card--wide">
              <h2 className="auth-title">Reset Password</h2>
              <p className="auth-subtitle">Enter your new password</p>

              {success ? (
                <div className="alert alert-success">
                  <div className="alert__row">
                    <CheckCircle2 size={18} />
                    <span>Password reset successfully!</span>
                  </div>
                  <p style={{ marginTop: '0.5rem' }}>
                    <Link to="/login">Go to login</Link>
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="alert alert-error">
                      <div className="alert__row">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="auth-form">
                    <div className="form-group">
                      <label htmlFor="reset-email">Email</label>
                      <div className="input-wrap">
                        <Mail size={18} className="input-icon" />
                        <input
                          type="email"
                          id="reset-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading || !!token}
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reset-token">Reset Token</label>
                      <div className="input-wrap">
                        <Lock size={18} className="input-icon" />
                        <input
                          type="text"
                          id="reset-token"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          required
                          disabled={loading}
                          placeholder="Enter token from email"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reset-password">New Password</label>
                      <div className="input-wrap">
                        <Lock size={18} className="input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="reset-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          disabled={loading}
                          placeholder="Minimum 6 characters"
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
                      <label htmlFor="reset-confirm">Confirm Password</label>
                      <div className="input-wrap">
                        <Lock size={18} className="input-icon" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="reset-confirm"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={loading}
                          placeholder="Confirm your password"
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

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                      {loading ? <span className="spinner"></span> : 'Reset Password'}
                    </button>
                  </form>

                  <p className="auth-footer">
                    Remember your password? <Link to="/login">Login here</Link>
                  </p>
                </>
              )}
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
                <Mail size={16} />
                Password recovery
              </div>
              <h1 className="auth-visual__title">Forgot Password?</h1>
              <p className="auth-visual__subtitle">
                No worries! Enter your email and we'll send you a link to reset your password.
              </p>
            </div>
          </div>

          <div className="auth-card auth-card--wide">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">Enter your email to receive a reset link</p>

            {success && (
              <div className="alert alert-success">
                <div className="alert__row">
                  <CheckCircle2 size={18} />
                  <span>Reset link sent!</span>
                </div>
                <p style={{ marginTop: '0.5rem' }}>
                  Check your email for the password reset link. It will expire in 30 minutes.
                </p>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <div className="alert__row">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {!success && (
              <form onSubmit={handleRequestReset} className="auth-form">
                <div className="form-group">
                  <label htmlFor="forgot-email">Email</label>
                  <div className="input-wrap">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="forgot-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? <span className="spinner"></span> : 'Send Reset Link'}
                </button>
              </form>
            )}

            <p className="auth-footer">
              Remember your password? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
