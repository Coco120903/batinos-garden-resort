import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, updateMe, deleteAccount } from '../api/users'
import { logout } from '../api/auth'
import { AlertCircle, Save, CheckCircle2, XCircle, Trash2, User, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react'
import './Page.css'

function ProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', password: '' })
  const [user, setUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await getMe()
        setUser(res.user)
        setForm((p) => ({
          ...p,
          name: res.user?.name || '',
          phone: res.user?.phone || '',
        }))
      } catch (e) {
        setError(e.response?.data?.message || e.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError(null)
    setMessage(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      setMessage(null)
      const payload = { name: form.name, phone: form.phone }
      if (form.password.trim()) payload.password = form.password
      const res = await updateMe(payload)
      setForm((p) => ({ ...p, password: '' }))
      setUser(res.user)
      setMessage('Profile updated successfully.')
      // Update localStorage user
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem('user', JSON.stringify({ ...storedUser, ...res.user }))
    } catch (e2) {
      setError(e2.response?.data?.message || e2.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'Delete') {
      setError('Please type "Delete" to confirm')
      return
    }
    try {
      setDeleting(true)
      setError(null)
      await deleteAccount(deleteConfirm)
      logout()
      // Clear history and prevent back button
      window.history.replaceState(null, '', '/login')
      navigate('/login', { replace: true })
      alert('Your account has been archived. You can contact support to restore it.')
      // Force reload to clear any cached state
      window.location.reload()
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to delete account')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="section-header">
            <div className="skel skel-line" style={{ height: '32px', width: '150px', marginBottom: '0.5rem' }}></div>
            <div className="skel skel-line skel-line--medium" style={{ height: '16px', marginBottom: '2rem' }}></div>
          </div>
          
          {/* Status Card Skeleton */}
          <div className="skeleton-card" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div className="skeleton-row" style={{ marginBottom: 'var(--spacing-md)' }}>
              <div className="skel skeleton-avatar"></div>
              <div style={{ flex: 1 }}>
                <div className="skel skel-line" style={{ width: '80px', marginBottom: '0.5rem' }}></div>
                <div className="skel skel-line skel-line--medium"></div>
              </div>
            </div>
            <div className="skeleton-row" style={{ marginBottom: 'var(--spacing-md)' }}>
              <div className="skel skeleton-avatar"></div>
              <div style={{ flex: 1 }}>
                <div className="skel skel-line" style={{ width: '120px', marginBottom: '0.5rem' }}></div>
                <div className="skel skel-line skel-line--short"></div>
              </div>
            </div>
            <div className="skeleton-row">
              <div className="skel skeleton-avatar"></div>
              <div style={{ flex: 1 }}>
                <div className="skel skel-line" style={{ width: '100px', marginBottom: '0.5rem' }}></div>
                <div className="skel skel-line skel-line--short"></div>
              </div>
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="profile-sections">
            <div className="profile-section">
              <div className="skel skel-line" style={{ height: '24px', width: '200px', marginBottom: 'var(--spacing-lg)' }}></div>
              <div className="skeleton-card">
                <div className="skeleton-form-group">
                  <div className="skel skeleton-label"></div>
                  <div className="skel skeleton-input"></div>
                </div>
                <div className="skeleton-form-group">
                  <div className="skel skeleton-label"></div>
                  <div className="skel skeleton-input"></div>
                </div>
                <div className="skeleton-form-group">
                  <div className="skel skeleton-label"></div>
                  <div className="skel skeleton-input"></div>
                </div>
                <div className="skel skeleton-button"></div>
              </div>
            </div>
            <div className="profile-section">
              <div className="skel skel-line" style={{ height: '24px', width: '150px', marginBottom: 'var(--spacing-lg)' }}></div>
              <div className="skeleton-card">
                <div className="skel skel-line skel-line--long" style={{ marginBottom: 'var(--spacing-md)' }}></div>
                <div className="skel skeleton-button" style={{ width: '180px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <h1>My Profile</h1>
          <p className="section-subtitle">Manage your account information and settings.</p>
        </div>

        {/* Account Status */}
        {user && (
          <div className="profile-status-card">
            <div className="profile-status-row">
              <div className="profile-status-item">
                <Mail size={18} />
                <div>
                  <span className="profile-status-label">Email</span>
                  <span className="profile-status-value">{user.email}</span>
                </div>
              </div>
              <div className="profile-status-item">
                <ShieldCheck size={18} />
                <div>
                  <span className="profile-status-label">Verification Status</span>
                  <span className={`profile-status-value ${user.isEmailVerified ? 'verified' : 'unverified'}`}>
                    {user.isEmailVerified ? (
                      <>
                        <CheckCircle2 size={16} /> Verified
                      </>
                    ) : (
                      <>
                        <XCircle size={16} /> Not Verified
                      </>
                    )}
                  </span>
                </div>
              </div>
              <div className="profile-status-item">
                <Calendar size={18} />
                <div>
                  <span className="profile-status-label">Member Since</span>
                  <span className="profile-status-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            {!user.isEmailVerified && (
              <div className="profile-verification-warning">
                <AlertCircle size={18} />
                <span>Please verify your email to make bookings. Check your inbox for the verification link.</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <div className="alert__row">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}
        {message && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            <div className="alert__row">
              <CheckCircle2 size={18} />
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className="profile-sections">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <form className="auth-card" onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  <User size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                  Full Name
                </label>
                <input id="name" name="name" value={form.name} onChange={onChange} disabled={saving} required />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                  Phone Number
                </label>
                <input id="phone" name="phone" value={form.phone} onChange={onChange} disabled={saving} placeholder="0912 345 6789" />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <ShieldCheck size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                  New Password (optional)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  disabled={saving}
                  placeholder="Leave blank to keep current password"
                />
                <small>Minimum 6 characters.</small>
              </div>

              <button className="btn btn-primary" type="submit" disabled={saving}>
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="profile-section profile-section--danger">
            <h2>Danger Zone</h2>
            <div className="auth-card">
              <p className="danger-zone-description">
                Deleting your account will archive it in our database. You can contact support to restore it later.
                This action cannot be undone easily.
              </p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <>
            <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}></div>
            <div className="modal-content">
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <XCircle size={20} />
              </button>
              <h3>Delete Account</h3>
              <p>This will archive your account. Type <strong>"Delete"</strong> to confirm:</p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type 'Delete' to confirm"
                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
              />
              {error && <p className="auth-muted" style={{ color: 'var(--error)' }}>{error}</p>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirm('')
                    setError(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirm !== 'Delete'}
                >
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfilePage

