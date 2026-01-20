import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import { getSiteSettings } from '../api/site'
import ImageSlot from '../components/ImageSlot'
import EventModal from '../components/EventModal'
import './Page.css'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const load = async () => {
      try {
        const siteRes = await getSiteSettings()
        const eventsData = siteRes?.home?.recentEvents || []
        // Convert old format to new format if needed
        const convertedEvents = eventsData.map(event => {
          if (event.url && !event.thumbnail) {
            return {
              thumbnail: event.url,
              title: event.title || '',
              description: event.description || '',
              images: []
            }
          }
          return event
        })
        setEvents(convertedEvents)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const eventIndex = searchParams.get('event')
    if (eventIndex && events.length > 0) {
      const index = parseInt(eventIndex, 10)
      if (index >= 0 && index < events.length) {
        setSelectedEvent(events[index])
        setShowModal(true)
      }
    }
  }, [searchParams, events])

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  return (
    <div className="page events-page">
      <div className="container">
        <Link to="/explore" className="btn btn-outline btn-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <ArrowLeft size={18} /> Back to Explore
        </Link>

        <div className="section-header">
          <h1>Recent Events</h1>
          <p className="section-subtitle">
            Browse through our recent celebrations and gatherings at Batino's Garden Farm Resort.
          </p>
        </div>

        {loading ? (
          <div className="events-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="event-card">
                <div className="skeleton-media-image" style={{ aspectRatio: '16 / 9', borderRadius: 'var(--border-radius-lg)' }}></div>
                <div className="event-card__body">
                  <div className="skel skel-line" style={{ height: '24px', width: '200px', marginBottom: '0.5rem' }}></div>
                  <div className="skel skel-line skel-line--long" style={{ height: '16px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
            <p>No events to display yet.</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event, idx) => (
              <div key={idx} className="event-card event-card--clickable" onClick={() => handleEventClick(event)}>
                <ImageSlot 
                  src={event.thumbnail || event.url} 
                  alt={event.title || `Event ${idx + 1}`} 
                  aspect="16 / 9" 
                />
                <div className="event-card__body">
                  <h3>{event.title || 'Event'}</h3>
                  {event.description && <p>{event.description}</p>}
                  {event.images && event.images.length > 0 && (
                    <div className="event-card__image-count">
                      {event.images.length} {event.images.length === 1 ? 'photo' : 'photos'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => {
              setShowModal(false)
              setSelectedEvent(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default EventsPage
