import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getServices } from '../api/services'
import { createBooking } from '../api/bookings'
import { AlertCircle, Calendar, Users, Clock, ArrowLeft } from 'lucide-react'
import './Page.css'

function addHours(date, hours) {
  const d = new Date(date)
  d.setHours(d.getHours() + hours)
  return d
}

function toLocalDateTimeInputValue(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`
}

function BookServicePage() {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [conflict, setConflict] = useState(null)

  const nowRounded = useMemo(() => {
    const d = new Date()
    d.setMinutes(0, 0, 0)
    d.setHours(d.getHours() + 24)
    return d
  }, [])

  const [form, setForm] = useState({
    serviceOptionId: '',
    startAt: toLocalDateTimeInputValue(nowRounded),
    paxCount: 25,
    eventType: 'Other',
    eventTypeOther: '',
    notes: '',
  })

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const services = await getServices()
        const found = (services || []).find((s) => s._id === serviceId)
        if (!found) {
          setError('Service not found.')
          return
        }
        setService(found)
        const firstOptionId = found.options?.[0]?._id || ''
        setForm((prev) => ({ ...prev, serviceOptionId: firstOptionId }))
      } catch (e) {
        setError(e.message || 'Failed to load service.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [serviceId])

  const selectedOption = useMemo(() => {
    if (!service?.options?.length) return null
    return service.options.find((o) => o._id === form.serviceOptionId) || service.options[0] || null
  }, [service, form.serviceOptionId])

  const computedEndAt = useMemo(() => {
    const start = new Date(form.startAt)
    const durationHours = selectedOption?.durationHours || 9
    return addHours(start, durationHours)
  }, [form.startAt, selectedOption])

  const includedPax = selectedOption?.includedPax ?? 25
  const excessFee = selectedOption?.excessPaxFee ?? 0
  const excessCount = Math.max(0, Number(form.paxCount || 0) - Number(includedPax || 0))
  const excessTotal = excessCount * Number(excessFee || 0)
  const basePrice = selectedOption?.basePrice ?? service?.price ?? 0
  const totalEstimate = Number(basePrice || 0) + Number(excessTotal || 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
    setConflict(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!service) return

    try {
      setSubmitting(true)
      setError(null)
      setConflict(null)

      const payload = {
        serviceId: service._id,
        serviceOptionId: form.serviceOptionId || undefined,
        startAt: new Date(form.startAt).toISOString(),
        endAt: computedEndAt.toISOString(),
        paxCount: Number(form.paxCount || 1),
        eventType: form.eventType,
        eventTypeOther: form.eventType === 'Other' ? String(form.eventTypeOther || '') : '',
        notes: String(form.notes || ''),
        extras: [],
      }

      await createBooking(payload)
      navigate('/dashboard')
    } catch (err) {
      const status = err.response?.status
      if (status === 409) {
        const c = err.response?.data?.conflict
        setConflict(c || true)
        setError(err.response?.data?.message || 'Schedule conflict. Please choose another time.')
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to create booking.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="section-header">
            <div className="skel skel-line" style={{ height: '32px', width: '250px', marginBottom: '0.5rem' }}></div>
            <div className="skel skel-line skel-line--medium" style={{ height: '16px', marginBottom: '2rem' }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
            <div className="skeleton-card">
              <div className="skel skel-line" style={{ height: '24px', width: '150px', marginBottom: 'var(--spacing-lg)' }}></div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-form-group">
                  <div className="skel skeleton-label"></div>
                  <div className="skel skeleton-input"></div>
                </div>
              ))}
              <div className="skel skeleton-button" style={{ marginTop: 'var(--spacing-md)' }}></div>
            </div>
            <div className="skeleton-card">
              <div className="skel skel-line" style={{ height: '24px', width: '120px', marginBottom: 'var(--spacing-md)' }}></div>
              <div className="skeleton-media-image" style={{ height: '200px', marginBottom: 'var(--spacing-md)', borderRadius: 'var(--border-radius-lg)' }}></div>
              <div className="skel skel-line" style={{ marginBottom: '0.5rem' }}></div>
              <div className="skel skel-line skel-line--short" style={{ marginBottom: '0.5rem' }}></div>
              <div className="skel skel-line skel-line--medium" style={{ marginTop: 'var(--spacing-md)' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !service) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <div className="error-state__row">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/services" className="btn btn-outline">
              <ArrowLeft size={18} /> Back to Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <h1>Book: {service?.name}</h1>
          <p className="section-subtitle">Choose your schedule and details. Admin will confirm your booking.</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <div className="alert__row">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            {conflict && conflict.startAt && conflict.endAt && (
              <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                Conflicts with an existing booking:{" "}
                <strong>
                  {new Date(conflict.startAt).toLocaleString()} – {new Date(conflict.endAt).toLocaleString()}
                </strong>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-card auth-card--wide">
          {service?.options?.length > 0 && (
            <div className="form-group">
              <label htmlFor="serviceOptionId">Package option</label>
              <select
                id="serviceOptionId"
                name="serviceOptionId"
                value={form.serviceOptionId}
                onChange={handleChange}
                disabled={submitting}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
              >
                {service.options.map((opt) => (
                  <option key={opt._id} value={opt._id}>
                    {opt.name} — ₱{Number(opt.basePrice).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="startAt">
              <Calendar size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
              Start date & time
            </label>
            <input
              type="datetime-local"
              id="startAt"
              name="startAt"
              value={form.startAt}
              onChange={handleChange}
              required
              disabled={submitting}
            />
            <small>
              <Clock size={14} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
              End time will auto-compute based on the selected package.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="paxCount">
              <Users size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
              Pax count
            </label>
            <input
              type="number"
              id="paxCount"
              name="paxCount"
              min="1"
              value={form.paxCount}
              onChange={handleChange}
              required
              disabled={submitting}
            />
            <small>
              Included: {includedPax} pax. Excess: {excessFee ? `₱${Number(excessFee).toLocaleString()} / pax` : 'N/A'}.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="eventType">Event type</label>
            <select
              id="eventType"
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
            >
              <option>Family Gathering</option>
              <option>Birthday</option>
              <option>Reunion</option>
              <option>Wedding</option>
              <option>Team Building</option>
              <option>Special Occasion</option>
              <option>Other</option>
            </select>
          </div>

          {form.eventType === 'Other' && (
            <div className="form-group">
              <label htmlFor="eventTypeOther">If other, please specify</label>
              <input
                type="text"
                id="eventTypeOther"
                name="eventTypeOther"
                value={form.eventTypeOther}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={form.notes}
              onChange={handleChange}
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
            />
          </div>

          <div className="auth-row" style={{ marginTop: '1rem' }}>
            <div className="auth-muted">
              Estimated total: <strong>₱{Number(totalEstimate).toLocaleString()}</strong> (final total may include extras)
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="spinner"></span> : 'Submit booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookServicePage

