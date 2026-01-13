import { useEffect, useState } from 'react'
import { getMyBookings } from '../api/bookings'
import { AlertCircle } from 'lucide-react'
import './Page.css'

function DashboardPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const data = await getMyBookings()
        setBookings(data?.bookings || [])
      } catch (err) {
        setError(err.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="section-header">
            <div className="skel skel-line" style={{ height: '32px', width: '200px', marginBottom: '0.5rem' }}></div>
            <div className="skel skel-line skel-line--medium" style={{ height: '16px', marginBottom: '2rem' }}></div>
          </div>
          <div className="bookings-list">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skel skeleton-title"></div>
                  <div className="skel skeleton-badge"></div>
                </div>
                <div className="skeleton-content">
                  <div className="skeleton-row">
                    <div className="skel skel-line" style={{ width: '60px' }}></div>
                    <div className="skel skel-line skel-line--long"></div>
                  </div>
                  <div className="skeleton-row">
                    <div className="skel skel-line" style={{ width: '50px' }}></div>
                    <div className="skel skel-line skel-line--long"></div>
                  </div>
                  <div className="skeleton-row">
                    <div className="skel skel-line" style={{ width: '90px' }}></div>
                    <div className="skel skel-line skel-line--medium"></div>
                  </div>
                  <div className="skeleton-row">
                    <div className="skel skel-line" style={{ width: '40px' }}></div>
                    <div className="skel skel-line skel-line--short"></div>
                  </div>
                  <div className="skeleton-row">
                    <div className="skel skel-line" style={{ width: '50px' }}></div>
                    <div className="skel skel-line skel-line--short"></div>
                  </div>
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
      <div className="page">
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
    <div className="page dashboard-page">
      <div className="container">
        <h1>My Bookings</h1>
        <p className="page-subtitle">View and manage your reservations</p>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any bookings yet.</p>
            <a href="/services" className="btn btn-primary">
              Browse Packages
            </a>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking }) {
  const statusColors = {
    pending: 'var(--warning)',
    approved: 'var(--success)',
    completed: 'var(--info)',
    cancelled: 'var(--error)',
  }

  const statusKey = String(booking.status || 'Pending').toLowerCase()
  const start = booking.startAt ? new Date(booking.startAt) : null
  const end = booking.endAt ? new Date(booking.endAt) : null

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3>Booking #{booking._id.slice(-6)}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: statusColors[statusKey] || 'var(--gray-500)' }}
        >
          {String(booking.status || 'Pending').toUpperCase()}
        </span>
      </div>
      <div className="booking-details">
        <p>
          <strong>Start:</strong> {start ? start.toLocaleString() : 'N/A'}
        </p>
        <p>
          <strong>End:</strong> {end ? end.toLocaleString() : 'N/A'}
        </p>
        <p>
          <strong>Event Type:</strong> {booking.eventType}
        </p>
        <p>
          <strong>Pax:</strong> {booking.paxCount}
        </p>
        {booking.pricing && (
          <p>
            <strong>Total:</strong> ₱{booking.pricing.total.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
