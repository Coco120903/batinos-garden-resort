import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageSlot from './ImageSlot'
import './EventModal.css'

function EventModal({ event, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Combine thumbnail with additional images
  const allImages = [
    event.thumbnail || event.url,
    ...(event.images || [])
  ].filter(Boolean)

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  if (!event || allImages.length === 0) {
    return null
  }

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal__header">
          <div>
            <h2>{event.title || 'Event'}</h2>
            {event.description && (
              <p className="event-modal__description">{event.description}</p>
            )}
          </div>
          <button className="event-modal__close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="event-modal__content">
          <div className="event-modal__main-image">
            <ImageSlot 
              src={allImages[currentImageIndex]} 
              alt={`${event.title || 'Event'} - Image ${currentImageIndex + 1}`} 
              aspect="16 / 9" 
            />
            {allImages.length > 1 && (
              <>
                <button
                  className="event-modal__nav event-modal__nav--prev"
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="event-modal__nav event-modal__nav--next"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="event-modal__counter">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="event-modal__thumbnails">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`event-modal__thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <ImageSlot src={img} alt={`Thumbnail ${idx + 1}`} aspect="16 / 9" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventModal
