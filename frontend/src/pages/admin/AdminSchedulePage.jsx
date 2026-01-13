import { useEffect, useMemo, useState } from 'react'
import { getAllBookings } from '../../api/bookings'
import { AlertCircle, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import './AdminPage.css'

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function startOfWeek(d) {
  // Monday-based week
  const x = startOfDay(d)
  const day = x.getDay() // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1 - day)
  return addDays(x, diff)
}

function startOfMonth(d) {
  const x = startOfDay(d)
  x.setDate(1)
  return x
}

function fmtDayShort(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function fmtMonthTitle(d) {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export default function AdminSchedulePage() {
  const [view, setView] = useState('week') // week | month
  const [anchor, setAnchor] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookings, setBookings] = useState([])

  const fetch = async () => {
    try {
      setLoading(true)
      const res = await getAllBookings({ limit: 200 })
      setBookings(res.bookings || [])
      setError(null)
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load schedule')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const approvedPending = useMemo(() => {
    return bookings.filter((b) => {
      const s = String(b.status || '').toLowerCase()
      return s === 'approved' || s === 'pending'
    })
  }, [bookings])

  const weekDays = useMemo(() => {
    const s = startOfWeek(anchor)
    return Array.from({ length: 7 }).map((_, i) => addDays(s, i))
  }, [anchor])

  const monthGrid = useMemo(() => {
    const m0 = startOfMonth(anchor)
    const gridStart = startOfWeek(m0)
    return Array.from({ length: 42 }).map((_, i) => addDays(gridStart, i))
  }, [anchor])

  const byDay = useMemo(() => {
    const map = new Map()
    for (const b of approvedPending) {
      const key = startOfDay(new Date(b.startAt)).toISOString()
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(b)
    }
    for (const [, list] of map) {
      list.sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    }
    return map
  }, [approvedPending])

  const next = () => {
    if (view === 'week') setAnchor((d) => addDays(d, 7))
    else {
      const x = new Date(anchor)
      x.setMonth(x.getMonth() + 1)
      setAnchor(x)
    }
  }

  const prev = () => {
    if (view === 'week') setAnchor((d) => addDays(d, -7))
    else {
      const x = new Date(anchor)
      x.setMonth(x.getMonth() - 1)
      setAnchor(x)
    }
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
          </div>
          <div className="skeleton-card" style={{ height: '600px', marginTop: 'var(--spacing-xl)' }}></div>
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
            <h1>Schedule</h1>
            <p className="page-subtitle">Week / month view of pending + approved bookings</p>
          </div>
          <div className="schedule-toolbar">
            <button className="btn btn-outline btn-sm" onClick={prev}>
              <ChevronLeft size={18} /> Prev
            </button>
            <div className="schedule-title">
              <CalendarDays size={18} /> {fmtMonthTitle(anchor)}
            </div>
            <button className="btn btn-outline btn-sm" onClick={next}>
              Next <ChevronRight size={18} />
            </button>
            <div className="schedule-view-toggle">
              <button
                className={`btn btn-sm ${view === 'week' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button
                className={`btn btn-sm ${view === 'month' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setView('month')}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {view === 'week' ? (
          <div className="week-grid">
            {weekDays.map((d) => {
              const key = startOfDay(d).toISOString()
              const list = byDay.get(key) || []
              return (
                <div key={key} className="week-col">
                  <div className="week-col__head">{fmtDayShort(d)}</div>
                  {list.length === 0 ? (
                    <div className="week-col__empty">No bookings</div>
                  ) : (
                    <div className="week-col__list">
                      {list.map((b) => (
                        <div key={b._id} className="week-item">
                          <div className="week-item__time">
                            {new Date(b.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–{new Date(
                              b.endAt
                            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="week-item__main">{b.service?.name || 'Service'}</div>
                          <div className="week-item__sub">{b.user?.name || b.user?.email || 'Guest'}</div>
                          <div className={`status-badge ${String(b.status).toLowerCase() === 'approved' ? 'status-approved' : 'status-pending'}`}>
                            {b.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="month-grid">
            {monthGrid.map((d) => {
              const key = startOfDay(d).toISOString()
              const list = byDay.get(key) || []
              const inMonth = d.getMonth() === anchor.getMonth()
              return (
                <div key={key} className={`month-cell ${inMonth ? '' : 'month-cell--muted'}`}>
                  <div className="month-cell__day">{d.getDate()}</div>
                  {list.slice(0, 3).map((b) => (
                    <div key={b._id} className="month-chip">
                      {new Date(b.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {b.service?.name || 'Service'}
                    </div>
                  ))}
                  {list.length > 3 && <div className="month-more">+{list.length - 3} more</div>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

