import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  MapPin,
  Camera,
  Trees,
  Waves,
  UtensilsCrossed,
  Users,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'
import ImageSlot from '../components/ImageSlot'
import { getSiteSettings } from '../api/site'
import './Page.css'

function ExplorePage() {
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const siteRes = await getSiteSettings()
        setSite(siteRes)
      } catch {
        // ignore (fallback to placeholders)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const spacesMoments = site?.home?.spacesMoments || []
  const recentEvents = site?.home?.recentEvents || []

  return (
    <div className="page explore-page">
      <div className="container">
        <section className="explore-hero">
          <div className="explore-hero__content">
            <div className="pill">
              <MapPin size={16} />
              Silang, Cavite
            </div>
            <h1>About Batino's</h1>
            <p className="hero-subtitle">
              A private pool resort and event place designed for unforgettable celebrations. Comfortable, convenient, and
              beautifully maintained.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-primary btn-lg">
                View Packages <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            </div>
          </div>
          <div className="explore-hero__media">
            <ImageSlot aspect="4 / 3" alt="Resort preview" />
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <h2>Who We Are</h2>
            <p>
              Batino&apos;s Garden Farm Resort is a relaxing venue for private stays and events. From intimate gatherings to
              big celebrations.
            </p>
          </div>

          <div className="highlight-grid">
            <HighlightCard icon={<Waves size={18} />} title="Private Pool Resort" desc="Enjoy a refreshing indoor pool experience." />
            <HighlightCard icon={<Users size={18} />} title="Event Place" desc="Perfect for birthdays, reunions, weddings, and more." />
            <HighlightCard icon={<Trees size={18} />} title="Villas & Hotel" desc="Options for Villa 1, 2, 3 and hotel-style stays." />
            <HighlightCard icon={<UtensilsCrossed size={18} />} title="Catering Services" desc="Food and setup options for all kinds of events." />
            <HighlightCard icon={<Camera size={18} />} title="Add-ons" desc="Photobooth, photographer, mobile bar, and more." />
            <HighlightCard icon={<CalendarDays size={18} />} title="Booking Support" desc="Easy booking flow with admin confirmation." />
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <h2>Spaces & Moments</h2>
          </div>

          <div className="gallery-grid">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-media-image" style={{ aspectRatio: '3 / 2', borderRadius: 'var(--border-radius-lg)' }}></div>
              ))
            ) : spacesMoments.length > 0 ? (
              spacesMoments.slice(0, 3).map((item, idx) => (
                <ImageSlot key={idx} src={item.url} alt={item.alt || item.title || `Spaces & Moments ${idx + 1}`} aspect="3 / 2" />
              ))
            ) : (
              <>
                <ImageSlot aspect="3 / 2" alt="Resort photo placeholder 1" />
                <ImageSlot aspect="3 / 2" alt="Resort photo placeholder 2" />
                <ImageSlot aspect="3 / 2" alt="Resort photo placeholder 3" />
              </>
            )}
          </div>
          
          {spacesMoments.length > 3 && (
            <div className="gallery-view-more">
              <button className="btn btn-outline">
                View More
              </button>
            </div>
          )}
        </section>

        <section className="section recent-events">
          <div className="section__header">
            <h2>Recent Events</h2>
          </div>

          <div className="recent-events__grid">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="recent-event-card">
                  <div className="skeleton-media-image" style={{ aspectRatio: '16 / 9', borderRadius: 'var(--border-radius-lg)' }}></div>
                  <div className="recent-event-card__body">
                    <div className="skel skel-line" style={{ height: '20px', width: '150px', marginBottom: '0.5rem' }}></div>
                    <div className="skel skel-line skel-line--long" style={{ height: '14px' }}></div>
                  </div>
                </div>
              ))
            ) : recentEvents.length > 0 ? (
              recentEvents.slice(0, 3).map((item, idx) => (
                <div key={idx} className="recent-event-card">
                  <ImageSlot src={item.url} alt={item.alt || item.title || `Recent event ${idx + 1}`} aspect="16 / 9" />
                  <div className="recent-event-card__body">
                    <h3>{item.title || 'Event'}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="recent-event-card">
                  <ImageSlot aspect="16 / 9" alt="Recent event placeholder 1" />
                  <div className="recent-event-card__body">
                    <h3>Birthday Celebration</h3>
                    <p>A warm, family-style setup with beautiful lighting and photo spots.</p>
                  </div>
                </div>
                <div className="recent-event-card">
                  <ImageSlot aspect="16 / 9" alt="Recent event placeholder 2" />
                  <div className="recent-event-card__body">
                    <h3>Wedding Reception</h3>
                    <p>Elegant venue hall arrangement with catering and coordinated setup.</p>
                  </div>
                </div>
                <div className="recent-event-card">
                  <ImageSlot aspect="16 / 9" alt="Recent event placeholder 3" />
                  <div className="recent-event-card__body">
                    <h3>Team Building</h3>
                    <p>Spacious grounds and amenities for fun activities and bonding.</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {recentEvents.length > 3 && (
            <div className="recent-events-view-more">
              <button className="btn btn-outline">
                View More Events
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function HighlightCard({ icon, title, desc }) {
  return (
    <div className="highlight-card">
      <div className="highlight-card__icon">{icon}</div>
      <div>
        <h3 className="highlight-card__title">{title}</h3>
        <p className="highlight-card__desc">{desc}</p>
      </div>
    </div>
  )
}

export default ExplorePage

