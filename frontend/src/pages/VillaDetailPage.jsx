import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getServices } from '../api/services'
import { getSiteSettings } from '../api/site'
import { AlertCircle, ArrowLeft, CalendarPlus, CheckCircle } from 'lucide-react'
import ImageSlot from '../components/ImageSlot'
import BookingModal from '../components/BookingModal'
import './Page.css'

function VillaDetailPage() {
  const { villaId } = useParams()
  const navigate = useNavigate()
  const [villa, setVilla] = useState(null)
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [services, siteData] = await Promise.all([getServices(), getSiteSettings()])
        const found = services.find((s) => s._id === villaId && s.name && s.name.startsWith('Villa'))
        if (!found) {
          setError('Villa not found.')
          return
        }
        setVilla(found)
        setSite(siteData)
      } catch (e) {
        setError(e.message || 'Failed to load villa details.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [villaId])

  const getVillaImages = (villaName) => {
    if (!site?.home) return []
    const villaNum = villaName.match(/\d+/)?.[0]
    if (villaNum === '1') return site.home.villa1Images || []
    if (villaNum === '2') return site.home.villa2Images || []
    if (villaNum === '3') return site.home.villa3Images || []
    return []
  }

  const villaImages = villa ? getVillaImages(villa.name) : []
  const mainImage = villaImages.length > 0 ? villaImages[0].url : null

  const handleBookPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowBookingModal(true)
  }

  const handleBookingSuccess = () => {
    setShowBookingModal(false)
    setSelectedPackage(null)
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="section-header">
            <h1>Loading villa details...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (error || !villa) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <div className="error-state__row">
              <AlertCircle size={20} />
              <p>{error || 'Villa not found'}</p>
            </div>
            <Link to="/services" className="btn btn-primary">
              <ArrowLeft size={18} /> Back to Booking
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page villa-detail-page">
      <div className="container">
        <Link to="/services" className="btn btn-outline btn-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <ArrowLeft size={18} /> Back to Booking
        </Link>

        <div className="villa-detail-hero">
          <div className="villa-detail-hero__content">
            <h1>{villa.name}</h1>
            <p className="villa-detail-description">{villa.description}</p>
            {mainImage && (
              <div className="villa-detail-hero__image">
                <ImageSlot src={mainImage} alt={villa.name} aspect="21 / 9" />
              </div>
            )}
          </div>
        </div>

        {villa.inclusions && (
          <div className="villa-detail-inclusions">
            <h2>What's Included</h2>
            <div className="villa-inclusions">
              {villa.inclusions.roomArea && villa.inclusions.roomArea.length > 0 && (
                <div className="inclusion-section">
                  <h3>INCLUSION: ROOM AREA</h3>
                  <ul className="inclusion-list">
                    {villa.inclusions.roomArea.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle size={16} style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {villa.inclusions.poolArea && villa.inclusions.poolArea.length > 0 && (
                <div className="inclusion-section">
                  <h3>INCLUSION: POOL AREA</h3>
                  <ul className="inclusion-list">
                    {villa.inclusions.poolArea.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle size={16} style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {villa.options && villa.options.length > 0 && (
          <div className="villa-detail-packages">
            <h2>Available Packages & Rates</h2>
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
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleBookPackage(option)}
                  >
                    <CalendarPlus size={18} />
                    Book This Package
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {villa.extras && villa.extras.length > 0 && (
          <div className="villa-detail-extras">
            <h2>Available Add-ons</h2>
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

        {showBookingModal && selectedPackage && (
          <BookingModal
            villa={villa}
            selectedPackage={selectedPackage}
            onClose={() => {
              setShowBookingModal(false)
              setSelectedPackage(null)
            }}
            onSuccess={handleBookingSuccess}
          />
        )}
      </div>
    </div>
  )
}

export default VillaDetailPage
