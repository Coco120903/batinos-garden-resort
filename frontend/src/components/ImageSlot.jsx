import { useState } from 'react'
import './ImageSlot.css'

/**
 * ImageSlot
 * - Shows a real image if provided
 * - Shows skeleton loader while loading or if no image
 */
function ImageSlot({ src, alt, aspect = '16 / 9' }) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  // If no src provided, show skeleton
  if (!src) {
    return (
      <div className="image-slot" style={{ aspectRatio: aspect }}>
        <div className="skeleton-media-image" style={{ width: '100%', height: '100%', borderRadius: 0 }}></div>
      </div>
    )
  }

  return (
    <div className="image-slot" style={{ aspectRatio: aspect }}>
      {imageLoading && (
        <div className="skeleton-media-image" style={{ width: '100%', height: '100%', borderRadius: 0, position: 'absolute', top: 0, left: 0 }}></div>
      )}
      {!imageError ? (
        <img
          className="image-slot__img"
          src={src}
          alt={alt || 'Resort image'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      ) : (
        <div className="skeleton-media-image" style={{ width: '100%', height: '100%', borderRadius: 0 }}></div>
      )}
    </div>
  )
}

export default ImageSlot

