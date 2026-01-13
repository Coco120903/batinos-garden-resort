import placeholderImg from '../assets/placeholder-resort.svg'
import './ImageSlot.css'

/**
 * ImageSlot
 * - Shows a real image if provided
 * - Otherwise shows a consistent placeholder so you know exactly where to add photos later
 */
function ImageSlot({ src, alt, aspect = '16 / 9' }) {
  const resolvedSrc = src || placeholderImg
  return (
    <div className="image-slot" style={{ aspectRatio: aspect }}>
      <img className="image-slot__img" src={resolvedSrc} alt={alt || 'Resort image'} />
    </div>
  )
}

export default ImageSlot

