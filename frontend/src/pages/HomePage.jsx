import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  Waves,
  Mic,
  Building2,
  Home as HomeIcon,
  Car,
  Gamepad2,
  ArrowRight,
  Calendar,
  Star,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import ImageCarousel from '../components/ImageCarousel'
import { getSiteSettings } from '../api/site'
import { getApprovedReviews, submitReview } from '../api/reviews'
import { isAuthenticated, getStoredUser } from '../api/auth'
import './Page.css'

function HomePage() {
  const navigate = useNavigate()
  const [site, setSite] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMsg, setReviewMsg] = useState(null)
  const [hoverRating, setHoverRating] = useState(0)
  const [showBookNowModal, setShowBookNowModal] = useState(false)
  const [reviewCarouselIndex, setReviewCarouselIndex] = useState(0)

  const authed = isAuthenticated()
  const user = getStoredUser()

  useEffect(() => {
    const load = async () => {
      try {
        const [siteRes, revRes] = await Promise.all([getSiteSettings(), getApprovedReviews(20)])
        setSite(siteRes)
        setReviews(revRes.items || [])
      } catch {
        // ignore (fallback to placeholders)
      } finally {
        setReviewsLoading(false)
      }
    }
    load()
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showBookNowModal) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [showBookNowModal])

  // Auto-rotate reviews carousel (3 at a time)
  useEffect(() => {
    if (reviews.length <= 3) return
    const interval = setInterval(() => {
      setReviewCarouselIndex((prev) => {
        const maxIndex = Math.ceil(reviews.length / 3) - 1
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [reviews.length])

  const handleBookNow = () => {
    if (authed) {
      navigate('/services')
    } else {
      setShowBookNowModal(true)
    }
  }

  const handleBookNowContinue = () => {
    setShowBookNowModal(false)
    navigate('/services')
  }

  const handleBookNowLogin = () => {
    setShowBookNowModal(false)
    navigate('/login')
  }

  const heroImages = useMemo(() => {
    const images = site?.home?.heroImages || []
    return images.map(img => ({
      src: img.url,
      alt: img.alt || img.title || 'Resort image',
      title: img.title,
      description: img.description
    }))
  }, [site])
  
  const highlightsImages = useMemo(() => {
    const images = site?.home?.highlightsImages || []
    return images.map(img => ({
      src: img.url,
      alt: img.alt || img.title || 'Resort image',
      title: img.title,
      description: img.description
    }))
  }, [site])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!authed) {
      setReviewMsg('Please login first to submit a review.')
      return
    }
    if (!reviewForm.rating || reviewForm.rating === 0) {
      setReviewMsg('Please select a rating.')
      return
    }
    if (!reviewForm.comment.trim()) {
      setReviewMsg('Please write your feedback.')
      return
    }
    try {
      setReviewSubmitting(true)
      setReviewMsg(null)
      await submitReview({ rating: Number(reviewForm.rating), comment: reviewForm.comment })
      setReviewForm({ rating: 0, comment: '' })
      setReviewMsg('Thanks! Your review was sent for admin approval.')
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  return (
    <div className="page home-page">
      {/* Featured Image Carousel - Full Width */}
      <section className="featured-carousel-section">
        <ImageCarousel images={heroImages} autoPlay={true} interval={5000} />
      </section>

      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="pill">
              <Sparkles size={16} />
              Your Perfect Event Destination
            </div>
            <h1>Welcome to Batino's Garden Farm Resort</h1>
            <p className="hero-subtitle">
              Where moments become memories. Your perfect escape for celebrations, gatherings, and
              special occasions awaits.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-primary btn-lg">
                View Packages <ArrowRight size={18} />
              </Link>
              <Link to="/explore" className="btn btn-outline btn-lg">
                Explore Resort
              </Link>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="highlights-section">
          <div className="highlights-content">
            <div className="highlights-text">
              <div className="pill pill-secondary">
                <Star size={16} />
                Why Choose Us
              </div>
              <h2>Experience the Best</h2>
              <p>
                Batino's Garden Farm Resort offers a unique blend of natural beauty and modern
                amenities. Our spacious grounds, multiple facilities, and flexible packages make us
                the perfect choice for any occasion.
              </p>
              <ul className="highlights-list">
                <li>
                  <Calendar size={20} />
                  <span>Flexible booking options tailored to your needs</span>
                </li>
                <li>
                  <Users size={20} />
                  <span>Spacious grounds perfect for groups of any size</span>
                </li>
                <li>
                  <Star size={20} />
                  <span>Super affordable packages with transparent pricing</span>
                </li>
              </ul>
            </div>
            <div className="highlights-image">
              <ImageCarousel
                images={highlightsImages}
                autoPlay={true}
                interval={6000}
              />
            </div>
          </div>
        </section>

        {/* Why Clients Trust Section */}
        <section className="trust-section">
          <div className="section-header">
            <h2>Why Clients Trust Batino's Garden</h2>
            <p className="section-subtitle">
              Every booking is handled by our family-led team with careful planning, transparent communication, and a focus on creating memorable experiences.
            </p>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">
                <Calendar size={32} />
              </div>
              <h3>Years of Experience</h3>
              <p className="trust-stat">20+ years</p>
              <p className="trust-desc">Decades of hands-on work across Silang, Cavite and nearby provinces.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">
                <Users size={32} />
              </div>
              <h3>Completed Events</h3>
              <p className="trust-stat">500+ events</p>
              <p className="trust-desc">From intimate gatherings to large celebrations and corporate events.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">
                <Star size={32} />
              </div>
              <h3>Happy Clients</h3>
              <p className="trust-stat">Local & Returning</p>
              <p className="trust-desc">Many of our clients return for repeat bookings and recommend us to others.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="section-header">
            <h2>What We Offer</h2>
            <p className="section-subtitle">
              Everything you need for the perfect celebration or gathering
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Waves size={28} />
              </div>
              <h3>3 Swimming Pools</h3>
              <p>Adult, teens, and baby pools with 7 colors</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Mic size={28} />
              </div>
              <h3>Videoke</h3>
              <p>Available until 10PM for your entertainment</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Building2 size={28} />
              </div>
              <h3>Venue Halls</h3>
              <p>2 venue halls perfect for events and catering</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <HomeIcon size={28} />
              </div>
              <h3>3 Cottages</h3>
              <p>Comfortable accommodations for your stay</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Car size={28} />
              </div>
              <h3>Parking</h3>
              <p>Parking lot for 13 cars</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Gamepad2 size={28} />
              </div>
              <h3>Recreation</h3>
              <p>Gaming area, playground, and half court</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="cta-content">
            <h2>Ready to Book Your Event?</h2>
            <p>
              We accept family gatherings, birthdays, reunions, weddings, team building, and all
              special occasions. Book now and create memories that last a lifetime.
            </p>
            <div className="cta-actions">
              <button onClick={handleBookNow} className="btn btn-primary btn-lg">
                Book Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Book Now Modal */}
        {showBookNowModal && (
          <>
            <div className="modal-overlay" onClick={() => setShowBookNowModal(false)}></div>
            <div className="modal-content modal-content--centered">
              <button className="modal-close" onClick={() => setShowBookNowModal(false)}>
                <X size={20} />
              </button>
              <h3>Continue to Booking?</h3>
              <p>You need to be logged in to make a booking. Would you like to continue as a guest or login to your account?</p>
              <div className="modal-actions">
                <button onClick={handleBookNowContinue} className="btn btn-outline">
                  Continue as Guest
                </button>
                <button onClick={handleBookNowLogin} className="btn btn-primary">
                  Go to Login
                </button>
              </div>
            </div>
          </>
        )}

        {/* Reviews Section */}
        <section className="reviews-section">
          <div className="section-header">
            <h2>Customer Reviews</h2>
          </div>

          {reviewsLoading ? (
            <div className="reviews-carousel">
              <div className="reviews-carousel__track">
                <div className="reviews-carousel__group">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="review-card-skel">
                      <div className="review-card-skel__header">
                        <div className="skel review-card-skel__name"></div>
                        <div className="skel review-card-skel__stars"></div>
                      </div>
                      <div className="skel review-card-skel__text"></div>
                      <div className="skel review-card-skel__meta"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="empty-state">
              <p>No reviews yet. Be the first to share your experience.</p>
            </div>
          ) : (
            <div className="reviews-carousel">
              <div className="reviews-carousel__track" style={{ transform: `translateX(-${reviewCarouselIndex * 100}%)` }}>
                {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, groupIdx) => (
                  <div key={groupIdx} className="reviews-carousel__group">
                    {reviews.slice(groupIdx * 3, (groupIdx + 1) * 3).map((r) => (
                      <div key={r._id || r.createdAt} className="review-card">
                        <div className="review-card__top">
                          <div className="review-card__name">{r.name}</div>
                          <div className="review-card__stars">{'★★★★★'.slice(0, r.rating)}</div>
                        </div>
                        <p className="review-card__text">{r.comment}</p>
                        <div className="review-card__meta">
                          {new Date(r.createdAt).toLocaleDateString()} at {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {reviews.length > 3 && (
                <div className="reviews-carousel__dots">
                  {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`reviews-carousel__dot ${idx === reviewCarouselIndex ? 'active' : ''}`}
                      onClick={() => setReviewCarouselIndex(idx)}
                      aria-label={`Go to review group ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="review-form-wrap">
            <div className="review-form-head">
              <div>
                <h3>Leave feedback</h3>
                <p className="auth-muted">
                  {authed ? `Logged in as ${user?.name || user?.email}` : 'Login to submit a review.'}
                </p>
              </div>
            </div>

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="review-form__row">
                <div className="review-stars">
                  <span className="review-stars__label">Rating {reviewForm.rating > 0 ? `${reviewForm.rating}/5` : '0/5'}</span>
                  <div 
                    className="review-stars__inputs" 
                    role="radiogroup" 
                    aria-label="Rating"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => {
                      const isActive = reviewForm.rating >= n
                      const isHovered = hoverRating >= n && authed
                      const shouldHighlight = reviewForm.rating > 0 ? isActive : isHovered
                      
                      return (
                        <label 
                          key={n} 
                          className={`star ${shouldHighlight ? 'star--active' : ''} ${!authed ? 'star--disabled' : ''}`}
                          onClick={() => {
                            if (!reviewSubmitting && authed) {
                              setReviewForm((p) => ({ ...p, rating: n }))
                            }
                          }}
                          onMouseEnter={() => authed && setHoverRating(n)}
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={n}
                            checked={Number(reviewForm.rating) === n}
                            onChange={() => setReviewForm((p) => ({ ...p, rating: n }))}
                            disabled={reviewSubmitting || !authed}
                          />
                          <span aria-hidden="true">★</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              <label>
                Comment
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  disabled={reviewSubmitting || !authed}
                />
              </label>

              <div className="review-form-actions">
                {reviewMsg && <p className="auth-muted">{reviewMsg}</p>}
                {authed ? (
                  <button className="btn btn-primary" type="submit" disabled={reviewSubmitting}>
                    {reviewSubmitting ? <span className="spinner"></span> : 'Submit review'}
                  </button>
                ) : (
                  <div className="review-login-message">
                    <p>Please <Link to="/login">login</Link> to submit a review.</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage
