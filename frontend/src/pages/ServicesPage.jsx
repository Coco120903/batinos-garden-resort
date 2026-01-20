import { useEffect, useState } from 'react'
import { getServices } from '../api/services'
import { getSiteSettings } from '../api/site'
import { AlertCircle } from 'lucide-react'
import ImageCarousel from '../components/ImageCarousel'
import ImageSlot from '../components/ImageSlot'
import { Link } from 'react-router-dom'
import './Page.css'

function ServicesPage() {
  const [services, setServices] = useState([])
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const [servicesData, siteData] = await Promise.all([
          getServices(),
          getSiteSettings()
        ])
        setServices(servicesData)
        setSite(siteData)
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

  // Filter to get only villa services (Villa 1, Villa 2, Villa 3)
  const villas = services.filter(s => s.name && s.name.startsWith('Villa')).sort((a, b) => {
    const numA = parseInt(a.name.match(/\d+/)?.[0] || '0')
    const numB = parseInt(b.name.match(/\d+/)?.[0] || '0')
    return numA - numB
  })

  const getVillaImages = (villaName) => {
    if (!site?.home) return []
    const villaNum = villaName.match(/\d+/)?.[0]
    if (villaNum === '1') return site.home.villa1Images || []
    if (villaNum === '2') return site.home.villa2Images || []
    if (villaNum === '3') return site.home.villa3Images || []
    return []
  }

  return (
    <div className="page services-page">
      <div className="container">
        <div className="section-header">
          <h1>Booking Overview</h1>
          <p className="section-subtitle">
            Choose a villa, review what's included, then proceed to schedule your booking.
          </p>
        </div>

        {villas.length === 0 ? (
          <div className="empty-state">
            <p>No villas available at the moment.</p>
          </div>
        ) : (
          <div className="villas-grid">
            {villas.map((villa) => {
              const villaImages = getVillaImages(villa.name) || []
              const formattedImages = Array.isArray(villaImages) && villaImages.length > 0
                ? villaImages
                    .filter(img => img && (img.url || img.src)) // Filter out invalid images
                    .map(img => ({
                      src: img.url || img.src || '',
                      alt: img.title || img.alt || villa.name,
                      title: img.title,
                      description: img.description
                    }))
                    .filter(img => img.src) // Remove any images without a valid src
                : []
              
              return (
                <div key={villa._id} className="villa-card">
                  <div className="villa-card__header">
                    {villaImages.length > 0 ? (
                      <div className="villa-card__image">
                        <ImageCarousel images={formattedImages} autoPlay={true} interval={3000} />
                      </div>
                    ) : (
                      <div className="villa-card__image">
                        <ImageSlot alt={villa.name} aspect="16 / 9" />
                      </div>
                    )}
                    <h2>{villa.name}</h2>
                    <p className="villa-card__description">{villa.description}</p>
                  </div>

                  {villa.inclusions && (
                    <div className="villa-inclusions">
                      {villa.inclusions.roomArea && villa.inclusions.roomArea.length > 0 && (
                        <div className="inclusion-section">
                          <h3>INCLUSION: ROOM AREA</h3>
                          <ul className="inclusion-list">
                            {villa.inclusions.roomArea.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {villa.inclusions.poolArea && villa.inclusions.poolArea.length > 0 && (
                        <div className="inclusion-section">
                          <h3>INCLUSION: POOL AREA</h3>
                          <ul className="inclusion-list">
                            {villa.inclusions.poolArea.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {villa.options && villa.options.length > 0 && (
                    <div className="villa-packages">
                      <h3>Available Packages</h3>
                      <div className="packages-grid">
                        {villa.options.map((option, idx) => (
                          <div key={idx} className="package-card">
                            <div className="package-card__header">
                              <h4>{option.name}</h4>
                              <div className="package-card__price">₱{Number(option.basePrice).toLocaleString()}</div>
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {villa.extras && villa.extras.length > 0 && (
                    <div className="villa-extras">
                      <h3>Available Add-ons</h3>
                      <div className="extras-grid">
                        {villa.extras.map((extra, idx) => (
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

                  <div className="villa-card__action">
                    <Link to={`/villa/${villa._id}`} className="btn btn-primary btn-lg">
                      View Details & Book
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


export default ServicesPage
