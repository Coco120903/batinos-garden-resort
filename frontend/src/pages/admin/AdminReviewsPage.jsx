import { useEffect, useState } from 'react'
import { adminListReviews, adminApproveReview, adminRejectReview } from '../../api/reviews'
import { AlertCircle, CheckCircle, Trash2, Search, Calendar } from 'lucide-react'
import './AdminPage.css'

function Stars({ rating }) {
  const r = Math.max(1, Math.min(5, Number(rating || 0)))
  return (
    <span className="stars" aria-label={`${r} out of 5`}>
      {'★★★★★'.slice(0, r)}
      <span className="stars--muted">{'★★★★★'.slice(r)}</span>
    </span>
  )
}

function AdminReviewsPage() {
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const fetch = async () => {
    try {
      setLoading(true)
      const res = await adminListReviews(status)
      setItems(res.items || [])
      setError(null)
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const approve = async (id) => {
    await adminApproveReview(id)
    await fetch()
  }

  const reject = async (id) => {
    if (!confirm('Reject (delete) this review?')) return
    await adminRejectReview(id)
    await fetch()
  }

  if (loading) {
    return (
      <div className="page admin-dashboard">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="skel skel-line" style={{ height: '32px', width: '200px', marginBottom: '0.5rem' }}></div>
              <div className="skel skel-line skel-line--medium" style={{ height: '16px' }}></div>
            </div>
            <div className="skel skel-line" style={{ height: '36px', width: '120px' }}></div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="skel skel-line" style={{ height: '40px', width: '300px' }}></div>
          </div>
          <div className="reviews-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header">
                  <div>
                    <div className="skel skel-line" style={{ height: '18px', width: '150px', marginBottom: '0.5rem' }}></div>
                    <div className="skel skel-line skel-line--short" style={{ height: '14px', width: '200px' }}></div>
                  </div>
                  <div className="skel skeleton-badge"></div>
                </div>
                <div className="skel skel-line skel-line--long" style={{ height: '60px', marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}></div>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                  <div className="skel skeleton-button" style={{ width: '100px', height: '32px' }}></div>
                  <div className="skel skeleton-button" style={{ width: '80px', height: '32px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page admin-dashboard">
        <div className="container">
          <div className="error-state">
            <div className="error-state__row">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page admin-dashboard">
      <div className="container">
        <div className="section-header-row">
          <div>
            <h1>Customer Reviews</h1>
            <p className="page-subtitle">Approve reviews before they appear on the Home page.</p>
          </div>
          <div className="filter-group">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="filter-select">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
          <div className="input-wrap" style={{ maxWidth: '300px' }}>
            <Search size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <p>No reviews in this list.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {items
              .filter((r) => {
                if (!searchQuery) return true
                const query = searchQuery.toLowerCase()
                const name = (r.name || r.user?.name || r.user?.email || 'Guest').toLowerCase()
                const comment = (r.comment || '').toLowerCase()
                return name.includes(query) || comment.includes(query)
              })
              .map((r) => (
                <div key={r._id} className="review-card">
                  <div className="review-card__head">
                    <div>
                      <div className="review-card__name">{r.name || r.user?.name || r.user?.email || 'Guest'}</div>
                      <div className="review-card__meta">
                        <Stars rating={r.rating} /> • <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        {new Date(r.createdAt).toLocaleDateString()} at {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {!r.isApproved && (
                      <span className="status-badge status-pending">Pending</span>
                    )}
                    {r.isApproved && <span className="status-badge status-approved">Approved</span>}
                  </div>
                  <p className="review-card__comment">{r.comment}</p>
                  <div className="review-card__actions">
                    {!r.isApproved && (
                      <button className="btn btn-success btn-xs" onClick={() => approve(r._id)}>
                        <CheckCircle size={16} /> Approve
                      </button>
                    )}
                    <button className="btn btn-danger btn-xs" onClick={() => reject(r._id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviewsPage

