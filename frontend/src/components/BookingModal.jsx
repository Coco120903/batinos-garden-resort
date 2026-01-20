import { useState, useMemo, useEffect } from 'react'
import { createBooking } from '../api/bookings'
import { X, Calendar, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import './BookingModal.css'

function addHours(date, hours) {
  const d = new Date(date)
  d.setHours(d.getHours() + hours)
  return d
}

function toLocalDateTimeInputValue(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function BookingModal({ villa, selectedPackage, onClose, onSuccess }) {
  const [form, setForm] = useState({
    startAt: '',
    paxCount: selectedPackage?.includedPax || 25,
    eventType: 'Other',
    eventTypeOther: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [conflict, setConflict] = useState(null)

  const nowRounded = useMemo(() => {
    const d = new Date()
    d.setMinutes(0, 0, 0)
    d.setHours(d.getHours() + 24)
    return d
  }, [])

  useEffect(() => {
    if (!form.startAt) {
      setForm((prev) => ({ ...prev, startAt: toLocalDateTimeInputValue(nowRounded) }))
    }
  }, [nowRounded])

  const computedEndAt = useMemo(() => {
    if (!form.startAt) return null
    const start = new Date(form.startAt)
    const durationHours = selectedPackage?.durationHours || 9
    return addHours(start, durationHours)
  }, [form.startAt, selectedPackage])

  const includedPax = selectedPackage?.includedPax ?? 25
  const excessFee = selectedPackage?.excessPaxFee ?? 0
  const excessCount = Math.max(0, Number(form.paxCount || 0) - Number(includedPax || 0))
  const excessTotal = excessCount * Number(excessFee || 0)
  const basePrice = selectedPackage?.basePrice ?? 0
  const totalEstimate = Number(basePrice || 0) + Number(excessTotal || 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
    setConflict(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!villa || !selectedPackage) return

    try {
      setSubmitting(true)
      setError(null)
      setConflict(null)

      const startAt = new Date(form.startAt)
      const endAt = computedEndAt

      if (startAt < new Date()) {
        setError('Start date must be in the future.')
        setSubmitting(false)
        return
      }

      const bookingData = {
        serviceId: villa._id,
        serviceOptionId: selectedPackage._id || selectedPackage.code || undefined,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        paxCount: Number(form.paxCount),
        eventType: form.eventType === 'Other' ? form.eventTypeOther : form.eventType,
        eventTypeOther: form.eventType === 'Other' ? String(form.eventTypeOther || '') : '',
        notes: String(form.notes || ''),
        extras: [],
      }

      await createBooking(bookingData)
      
      if (onSuccess) {
        onSuccess()
      } else {
        onClose()
      }
    } catch (e) {
      const status = e.response?.status
      if (status === 409) {
        const c = e.response?.data?.conflict
        setConflict(c || true)
        setError(e.response?.data?.message || 'Schedule conflict. Please choose another time.')
      } else {
        setError(e.response?.data?.message || e.message || 'Failed to create booking.')
      }
      setSubmitting(false)
    }
  }

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal__header">
          <h2>Book {villa?.name} - {selectedPackage?.name}</h2>
          <button className="booking-modal__close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="booking-modal__form">
          <div className="booking-modal__package-info">
            <div className="package-summary">
              <div className="package-summary__item">
                <strong>Package:</strong> {selectedPackage?.name}
              </div>
              <div className="package-summary__item">
                <strong>Base Price:</strong> ₱{Number(selectedPackage?.basePrice || 0).toLocaleString()}
              </div>
              <div className="package-summary__item">
                <strong>Duration:</strong> {selectedPackage?.durationHours} hours
              </div>
              <div className="package-summary__item">
                <strong>Included:</strong> {selectedPackage?.includedPax} pax
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="startAt">
              <Calendar size={18} />
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="startAt"
              name="startAt"
              value={form.startAt}
              onChange={handleChange}
              required
              min={toLocalDateTimeInputValue(nowRounded)}
            />
            {computedEndAt && (
              <div className="form-hint">
                End time: {computedEndAt.toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="paxCount">
              <Users size={18} />
              Number of Guests
            </label>
            <input
              type="number"
              id="paxCount"
              name="paxCount"
              value={form.paxCount}
              onChange={handleChange}
              required
              min={1}
              max={200}
            />
            <div className="form-hint">
              Included: {includedPax} pax. Excess: ₱{Number(excessFee).toLocaleString()} per person
            </div>
            {excessCount > 0 && (
              <div className="form-hint form-hint--warning">
                Excess guests: {excessCount} × ₱{Number(excessFee).toLocaleString()} = ₱{Number(excessTotal).toLocaleString()}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="eventType">
              <Clock size={18} />
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              required
            >
              <option value="Birthday">Birthday</option>
              <option value="Wedding">Wedding</option>
              <option value="Family Gathering">Family Gathering</option>
              <option value="Reunion">Reunion</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Team Building">Team Building</option>
              <option value="Other">Other</option>
            </select>
            {form.eventType === 'Other' && (
              <input
                type="text"
                name="eventTypeOther"
                placeholder="Please specify event type"
                value={form.eventTypeOther}
                onChange={handleChange}
                required
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special requests or additional information..."
            />
          </div>

          <div className="booking-modal__summary">
            <div className="price-breakdown">
              <div className="price-item">
                <span>Base Price ({selectedPackage?.name}):</span>
                <span>₱{Number(basePrice).toLocaleString()}</span>
              </div>
              {excessCount > 0 && (
                <div className="price-item">
                  <span>Excess Guests ({excessCount} × ₱{Number(excessFee).toLocaleString()}):</span>
                  <span>₱{Number(excessTotal).toLocaleString()}</span>
                </div>
              )}
              <div className="price-item price-item--total">
                <span>Total Estimate:</span>
                <span>₱{Number(totalEstimate).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {conflict && (
            <div className="alert alert-warning">
              <AlertCircle size={18} />
              <div>
                <strong>Time conflict detected:</strong>
                <p>{conflict.message || 'This time slot may already be booked. Please choose a different time.'}</p>
              </div>
            </div>
          )}

          <div className="booking-modal__actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
