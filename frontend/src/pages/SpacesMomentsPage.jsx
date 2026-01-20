import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import { getSiteSettings } from '../api/site'
import ImageSlot from '../components/ImageSlot'
import './Page.css'

function SpacesMomentsPage() {
  const [spacesMoments, setSpacesMoments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const siteRes = await getSiteSettings()
        setSpacesMoments(siteRes?.home?.spacesMoments || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="page spaces-moments-page">
      <div className="container">
        <Link to="/explore" className="btn btn-outline btn-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <ArrowLeft size={18} /> Back to Explore
        </Link>

        <div className="section-header">
          <h1>Spaces & Moments</h1>
          <p className="section-subtitle">
            Explore the beautiful spaces and memorable moments at Batino's Garden Farm Resort.
          </p>
        </div>

        {loading ? (
          <div className="gallery-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-media-image" style={{ aspectRatio: '3 / 2', borderRadius: 'var(--border-radius-lg)' }}></div>
            ))}
          </div>
        ) : spacesMoments.length === 0 ? (
          <div className="empty-state">
            <Camera size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
            <p>No images to display yet.</p>
          </div>
        ) : (
          <div className="gallery-grid gallery-grid--full">
            {spacesMoments.map((item, idx) => (
              <ImageSlot 
                key={idx} 
                src={item.url} 
                alt={item.alt || item.title || `Spaces & Moments ${idx + 1}`} 
                aspect="3 / 2" 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SpacesMomentsPage
