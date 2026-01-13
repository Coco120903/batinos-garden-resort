import { useEffect, useState } from 'react'
import { getServices } from '../api/services'
import { AlertCircle, CalendarPlus } from 'lucide-react'
import ImageSlot from '../components/ImageSlot'
import { Link } from 'react-router-dom'
import './Page.css'

function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await getServices()
        setServices(data)
      } catch (err) {
        setError(err.message || 'Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="section-header">
            <h1>Our Packages</h1>
            <p className="page-subtitle">Loading available packages...</p>
          </div>
          <div className="services-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="service-card service-card--skel">
                <div className="skel skel-media"></div>
                <div className="skel skel-line"></div>
                <div className="skel skel-line skel-line--short"></div>
                <div className="skel skel-btn"></div>
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

  const mainService = services.length > 0 ? services[0] : null

  return (
    <div className="page services-page">
      <div className="container">
        <div className="section-header">
          <h1>Booking Overview</h1>
          <p className="section-subtitle">
            Choose a package, review what's included, then proceed to schedule your booking.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="empty-state">
            <p>No services available at the moment.</p>
          </div>
        ) : mainService ? (
          <div className="resort-booking-layout">
            <div className="resort-booking__hero">
              <div className="resort-booking__media">
                {Array.isArray(mainService.images) && mainService.images.length > 0 ? (
                  <ImageSlot src={mainService.images[0]} alt={mainService.name} aspect="16 / 9" />
                ) : (
                  <ImageSlot alt={mainService.name} aspect="16 / 9" />
                )}
              </div>
              <div className="resort-booking__info">
                <h2>{mainService.name}</h2>
                <p className="resort-booking__description">{mainService.description}</p>
              </div>
            </div>

            {mainService.options && mainService.options.length > 0 && (
              <div className="resort-packages">
                <h3>Available Packages</h3>
                <div className="packages-grid">
                  {mainService.options.map((option, idx) => (
                    <div key={idx} className="package-card">
                      <div className="package-card__header">
                        <h4>{option.name}</h4>
                        <div className="package-card__price">{Number(option.basePrice).toLocaleString()}</div>
                      </div>
                      <div className="package-card__details">
                        <div className="package-detail">
                          <strong>Duration:</strong> {option.durationHours} hours
                        </div>
                        <div className="package-detail">
                          <strong>Included:</strong> {option.includedPax} pax
                        </div>
                        {option.excessPaxFee > 0 && (
                          <div className="package-detail">
                            <strong>Excess:</strong> ₱{Number(option.excessPaxFee).toLocaleString()} per person
                          </div>
                        )}
                        {option.notes && (
                          <div className="package-notes">{option.notes}</div>
                        )}
                      </div>
                      <Link to={`/book/${mainService._id}`} className="btn btn-primary btn-block">
                        <CalendarPlus size={18} />
                        Book This Package
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mainService.extras && mainService.extras.length > 0 && (
              <div className="resort-extras">
                <h3>Available Add-ons</h3>
                <div className="extras-grid">
                  {mainService.extras.map((extra, idx) => (
                    <div key={idx} className="extra-card">
                      <strong>{extra.name}</strong>
                      {extra.notes && <span className="extra-notes"> ({extra.notes})</span>}
                      <div className="extra-pricing">
                        {(extra.pricing || []).map((p) => (
                          <span key={p.key} className="extra-pill">
                            {p.key}: ₱{Number(p.price).toLocaleString()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}


export default ServicesPage
