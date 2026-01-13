import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageSlot from './ImageSlot'
import './ImageCarousel.css'

/**
 * ImageCarousel - Modern, accessible image carousel
 * @param {Array} images - Array of image objects { src, alt, title? }
 * @param {boolean} autoPlay - Auto-advance slides (default: true)
 * @param {number} interval - Auto-play interval in ms (default: 5000)
 */
function ImageCarousel({ images = [], autoPlay = true, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, isPaused, images.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsPaused(true)
    // Resume auto-play after 8 seconds
    setTimeout(() => setIsPaused(false), 8000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 8000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 8000)
  }

  if (images.length === 0) {
    // Default placeholder images for demo
    const defaultImages = [
      { src: null, alt: 'Resort swimming pool', title: 'Swimming Pools' },
      { src: null, alt: 'Resort venue hall', title: 'Venue Halls' },
      { src: null, alt: 'Resort cottages', title: 'Cottages' },
      { src: null, alt: 'Resort recreation area', title: 'Recreation Area' },
    ]
    return (
      <div className="image-carousel">
        <div className="carousel-container">
          {defaultImages.map((img, idx) => (
            <div
              key={idx}
              className={`carousel-slide ${idx === currentIndex ? 'active' : ''}`}
            >
              <ImageSlot src={img.src} alt={img.alt} aspect="21 / 9" />
              {img.title && (
                <div className="carousel-caption">
                  <h3>{img.title}</h3>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className="carousel-btn carousel-btn--prev"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="carousel-btn carousel-btn--next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
        <div className="carousel-indicators">
          {defaultImages.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-indicator ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="image-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-container">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`carousel-slide ${idx === currentIndex ? 'active' : ''}`}
          >
            <ImageSlot src={img.src || img.url} alt={img.alt} aspect="21 / 9" />
            {(img.title || img.description) && (
              <div className="carousel-caption">
                {img.title && <h3>{img.title}</h3>}
                {img.description && <p>{img.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            className="carousel-btn carousel-btn--prev"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="carousel-btn carousel-btn--next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
          <div className="carousel-indicators">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`carousel-indicator ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageCarousel
