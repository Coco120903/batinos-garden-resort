import { useEffect, useMemo, useState } from 'react'
import { adminListMedia, adminCreateMedia, adminDeleteMedia } from '../../api/adminMedia'
import { adminGetSiteSettings, adminUpdateSiteSettings } from '../../api/site'
import { AlertCircle, Plus, Trash2, Copy, Save } from 'lucide-react'
import ImageSlot from '../../components/ImageSlot'
import './AdminPage.css'

function normalizeTags(str) {
  return String(str || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20)
}

function AdminMediaPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [site, setSite] = useState(null)
  const [library, setLibrary] = useState([])

  const [heroDraft, setHeroDraft] = useState([])
  const [highlightsDraft, setHighlightsDraft] = useState([])
  const [spacesMomentsDraft, setSpacesMomentsDraft] = useState([])
  const [recentEventsDraft, setRecentEventsDraft] = useState([])
  const [villa1Draft, setVilla1Draft] = useState([])
  const [villa2Draft, setVilla2Draft] = useState([])
  const [villa3Draft, setVilla3Draft] = useState([])
  const [editingHero, setEditingHero] = useState(null) // { index, title, description }
  const [editingHighlights, setEditingHighlights] = useState(null) // { index, title, description }
  const [editingSpacesMoments, setEditingSpacesMoments] = useState(null) // { index, title, description }
  const [editingRecentEvents, setEditingRecentEvents] = useState(null) // { index, title, description }
  const [editingVilla1, setEditingVilla1] = useState(null) // { index, title, description }
  const [editingVilla2, setEditingVilla2] = useState(null) // { index, title, description }
  const [editingVilla3, setEditingVilla3] = useState(null) // { index, title, description }
  
  // Pagination states
  const [heroPage, setHeroPage] = useState(1)
  const [highlightsPage, setHighlightsPage] = useState(1)
  const itemsPerPage = 3 // Show 3 images per page, so with max 5 images, pagination will show

  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAlt, setNewAlt] = useState('')
  const [newTags, setNewTags] = useState('')
  const [saving, setSaving] = useState(false)

  // Direct upload states for Hero and Highlights
  const [heroFile, setHeroFile] = useState(null)
  const [heroTitle, setHeroTitle] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [highlightsFile, setHighlightsFile] = useState(null)
  const [highlightsTitle, setHighlightsTitle] = useState('')
  const [highlightsDescription, setHighlightsDescription] = useState('')
  const [spacesMomentsFile, setSpacesMomentsFile] = useState(null)
  const [spacesMomentsTitle, setSpacesMomentsTitle] = useState('')
  const [recentEventsThumbnailFile, setRecentEventsThumbnailFile] = useState(null)
  const [recentEventsTitle, setRecentEventsTitle] = useState('')
  const [recentEventsDescription, setRecentEventsDescription] = useState('')
  const [recentEventsGalleryFiles, setRecentEventsGalleryFiles] = useState([]) // For multiple images
  const [editingEventGallery, setEditingEventGallery] = useState(null) // { eventIndex, galleryImages: [] }
  const [villa1File, setVilla1File] = useState(null)
  const [villa1Title, setVilla1Title] = useState('')
  const [villa2File, setVilla2File] = useState(null)
  const [villa2Title, setVilla2Title] = useState('')
  const [villa3File, setVilla3File] = useState(null)
  const [villa3Title, setVilla3Title] = useState('')

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [siteRes, libRes] = await Promise.all([adminGetSiteSettings(), adminListMedia()])
      setSite(siteRes)
      setLibrary(libRes.items || [])
      setHeroDraft(siteRes?.home?.heroImages || [])
      setHighlightsDraft(siteRes?.home?.highlightsImages || [])
      setSpacesMomentsDraft(siteRes?.home?.spacesMoments || [])
      // Convert old format to new format if needed
      const events = siteRes?.home?.recentEvents || []
      const convertedEvents = events.map(event => {
        // If it's the old format (has url property), convert to new format
        if (event.url && !event.thumbnail) {
          return {
            thumbnail: event.url,
            title: event.title || '',
            description: event.description || '',
            images: []
          }
        }
        // Already in new format
        return event
      })
      setRecentEventsDraft(convertedEvents)
      setVilla1Draft(siteRes?.home?.villa1Images || [])
      setVilla2Draft(siteRes?.home?.villa2Images || [])
      setVilla3Draft(siteRes?.home?.villa3Images || [])
      setError(null)
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const addToDraft = (where, url, title = '', alt = '', description = '') => {
    const item = { url, title: title.trim() || '', alt, description }
    if (where === 'hero') {
      if (heroDraft.length >= 5) {
        alert('Maximum 5 images allowed in Hero Carousel')
        return
      }
      setHeroDraft((p) => [item, ...p])
    }
    if (where === 'highlights') {
      if (highlightsDraft.length >= 5) {
        alert('Maximum 5 images allowed in Highlights Carousel')
        return
      }
      setHighlightsDraft((p) => [item, ...p])
    }
    if (where === 'spacesMoments') {
      if (spacesMomentsDraft.length >= 3) {
        alert('Maximum 3 images allowed in Spaces & Moments')
        return
      }
      setSpacesMomentsDraft((p) => [item, ...p])
    }
    if (where === 'recentEvents') {
      if (recentEventsDraft.length >= 3) {
        alert('Maximum 3 items allowed in Recent Events')
        return
      }
      setRecentEventsDraft((p) => [item, ...p])
    }
    if (where === 'villa1') {
      setVilla1Draft((p) => [item, ...p])
    }
    if (where === 'villa2') {
      setVilla2Draft((p) => [item, ...p])
    }
    if (where === 'villa3') {
      setVilla3Draft((p) => [item, ...p])
    }
  }

  const handleFileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const addHeroImage = async () => {
    if (!heroFile) return
    try {
      const dataUrl = await handleFileToDataUrl(heroFile)
      addToDraft('hero', dataUrl, heroTitle.trim(), '', heroDescription.trim())
      setHeroFile(null)
      setHeroTitle('')
      setHeroDescription('')
      // Reset file input
      const fileInput = document.getElementById('hero-file-input')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      alert('Failed to process image. Please try again.')
    }
  }

  const addHighlightsImage = async () => {
    if (!highlightsFile) return
    try {
      const dataUrl = await handleFileToDataUrl(highlightsFile)
      addToDraft('highlights', dataUrl, highlightsTitle.trim(), '', highlightsDescription.trim())
      setHighlightsFile(null)
      setHighlightsTitle('')
      setHighlightsDescription('')
      // Reset file input
      const fileInput = document.getElementById('highlights-file-input')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      alert('Failed to process image. Please try again.')
    }
  }

  const addSpacesMomentsImage = async () => {
    if (!spacesMomentsFile) return
    try {
      const dataUrl = await handleFileToDataUrl(spacesMomentsFile)
      addToDraft('spacesMoments', dataUrl, spacesMomentsTitle.trim(), '', '')
      setSpacesMomentsFile(null)
      setSpacesMomentsTitle('')
      // Reset file input
      const fileInput = document.getElementById('spaces-moments-file-input')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      alert('Failed to process image. Please try again.')
    }
  }

  const addRecentEventsImage = async () => {
    if (!recentEventsThumbnailFile || !recentEventsTitle.trim()) {
      alert('Please provide a thumbnail image and title for the event.')
      return
    }
    if (recentEventsDraft.length >= 3) {
      alert('Maximum 3 events allowed')
      return
    }
    try {
      const thumbnailUrl = await handleFileToDataUrl(recentEventsThumbnailFile)
      
      // Process gallery images
      const galleryUrls = []
      for (const file of recentEventsGalleryFiles) {
        const url = await handleFileToDataUrl(file)
        galleryUrls.push(url)
      }

      const newEvent = {
        thumbnail: thumbnailUrl,
        title: recentEventsTitle.trim(),
        description: recentEventsDescription.trim(),
        images: galleryUrls
      }

      setRecentEventsDraft([...recentEventsDraft, newEvent])
      setRecentEventsThumbnailFile(null)
      setRecentEventsTitle('')
      setRecentEventsDescription('')
      setRecentEventsGalleryFiles([])
      
      // Reset file inputs
      const thumbnailInput = document.getElementById('recent-events-thumbnail-input')
      const galleryInput = document.getElementById('recent-events-gallery-input')
      if (thumbnailInput) thumbnailInput.value = ''
      if (galleryInput) galleryInput.value = ''
    } catch (err) {
      alert('Failed to process image. Please try again.')
    }
  }

  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files || [])
    setRecentEventsGalleryFiles(files)
  }

  const addImagesToEventGallery = async (eventIndex) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.multiple = true
    fileInput.onchange = async (e) => {
      const files = Array.from(e.target.files || [])
      try {
        const newImageUrls = []
        for (const file of files) {
          const url = await handleFileToDataUrl(file)
          newImageUrls.push(url)
        }
        const updatedEvents = [...recentEventsDraft]
        updatedEvents[eventIndex].images = [...(updatedEvents[eventIndex].images || []), ...newImageUrls]
        setRecentEventsDraft(updatedEvents)
      } catch (err) {
        alert('Failed to process images. Please try again.')
      }
    }
    fileInput.click()
  }

  const removeImageFromEventGallery = (eventIndex, imageIndex) => {
    const updatedEvents = [...recentEventsDraft]
    updatedEvents[eventIndex].images = updatedEvents[eventIndex].images.filter((_, idx) => idx !== imageIndex)
    setRecentEventsDraft(updatedEvents)
  }

  const addVilla1Image = async () => {
    if (!villa1File) return
    try {
      const dataUrl = await handleFileToDataUrl(villa1File)
      addToDraft('villa1', dataUrl, villa1Title.trim(), '', '')
      setVilla1File(null)
      setVilla1Title('')
      const fileInput = document.getElementById('villa1-file-input')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      alert('Failed to process image. Please try again.')
    }
  }

  const addVilla2Image = async () => {
    if (!villa2File) return
    try {
      const dataUrl = await handleFileToDataUrl(villa2File)
      addToDraft('villa2', dataUrl, villa2Title.trim(), '', '')
      setVilla2File(null)
      setVilla2Title('')
      const fileInput = document.getElementById('villa2-file-input')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      alert('Failed to process image. Please try again.')
    }
  }

  const addVilla3Image = async () => {
    if (!villa3File) return
    try {
      const dataUrl = await handleFileToDataUrl(villa3File)
      addToDraft('villa3', dataUrl, villa3Title.trim(), '', '')
      setVilla3File(null)
      setVilla3Title('')
      const fileInput = document.getElementById('villa3-file-input')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      alert('Failed to process image. Please try again.')
    }
  }

  const updateHeroItem = (idx, updates) => {
    setHeroDraft((p) => p.map((item, i) => (i === idx ? { ...item, ...updates } : item)))
  }

  const updateHighlightsItem = (idx, updates) => {
    setHighlightsDraft((p) => p.map((item, i) => (i === idx ? { ...item, ...updates } : item)))
  }

  const updateSpacesMomentsItem = (idx, updates) => {
    setSpacesMomentsDraft((p) => p.map((item, i) => (i === idx ? { ...item, ...updates } : item)))
  }

  const updateRecentEventsItem = (idx, updates) => {
    setRecentEventsDraft((p) => p.map((item, i) => (i === idx ? { ...item, ...updates } : item)))
  }

  const updateVilla1Item = (idx, updates) => {
    setVilla1Draft((p) => p.map((item, i) => (i === idx ? { ...item, ...updates } : item)))
  }

  const updateVilla2Item = (idx, updates) => {
    setVilla2Draft((p) => p.map((item, i) => (i === idx ? { ...item, ...updates } : item)))
  }

  const updateVilla3Item = (idx, updates) => {
    setVilla3Draft((p) => p.map((item, i) => (i === idx ? { ...item, ...updates } : item)))
  }

  const saveHeroEdit = () => {
    if (editingHero !== null) {
      updateHeroItem(editingHero.index, {
        title: editingHero.title || '',
        description: editingHero.description || ''
      })
      setEditingHero(null)
    }
  }

  const saveHighlightsEdit = () => {
    if (editingHighlights !== null) {
      updateHighlightsItem(editingHighlights.index, {
        title: editingHighlights.title || '',
        description: editingHighlights.description || ''
      })
      setEditingHighlights(null)
    }
  }

  const saveSpacesMomentsEdit = () => {
    if (editingSpacesMoments !== null) {
      updateSpacesMomentsItem(editingSpacesMoments.index, {
        title: editingSpacesMoments.title || '',
        description: editingSpacesMoments.description || ''
      })
      setEditingSpacesMoments(null)
    }
  }

  const saveRecentEventsEdit = () => {
    if (editingRecentEvents !== null) {
      updateRecentEventsItem(editingRecentEvents.index, {
        title: editingRecentEvents.title || '',
        description: editingRecentEvents.description || ''
      })
      setEditingRecentEvents(null)
    }
  }

  const saveVilla1Edit = () => {
    if (editingVilla1 !== null) {
      updateVilla1Item(editingVilla1.index, {
        title: editingVilla1.title || '',
        description: editingVilla1.description || ''
      })
      setEditingVilla1(null)
    }
  }

  const saveVilla2Edit = () => {
    if (editingVilla2 !== null) {
      updateVilla2Item(editingVilla2.index, {
        title: editingVilla2.title || '',
        description: editingVilla2.description || ''
      })
      setEditingVilla2(null)
    }
  }

  const saveVilla3Edit = () => {
    if (editingVilla3 !== null) {
      updateVilla3Item(editingVilla3.index, {
        title: editingVilla3.title || '',
        description: editingVilla3.description || ''
      })
      setEditingVilla3(null)
    }
  }

  const removeFromDraft = (where, idx) => {
    if (where === 'hero') {
      setHeroDraft((p) => {
        const newList = p.filter((_, i) => i !== idx)
        // Reset to page 1 if current page becomes empty
        const maxPage = Math.ceil(newList.length / itemsPerPage)
        if (heroPage > maxPage && maxPage > 0) {
          setHeroPage(maxPage)
        } else if (newList.length === 0) {
          setHeroPage(1)
        }
        return newList
      })
    }
    if (where === 'highlights') {
      setHighlightsDraft((p) => {
        const newList = p.filter((_, i) => i !== idx)
        // Reset to page 1 if current page becomes empty
        const maxPage = Math.ceil(newList.length / itemsPerPage)
        if (highlightsPage > maxPage && maxPage > 0) {
          setHighlightsPage(maxPage)
        } else if (newList.length === 0) {
          setHighlightsPage(1)
        }
        return newList
      })
    }
    if (where === 'spacesMoments') {
      setSpacesMomentsDraft((p) => p.filter((_, i) => i !== idx))
    }
    if (where === 'recentEvents') {
      setRecentEventsDraft((p) => p.filter((_, i) => i !== idx))
    }
    if (where === 'villa1') {
      setVilla1Draft((p) => p.filter((_, i) => i !== idx))
    }
    if (where === 'villa2') {
      setVilla2Draft((p) => p.filter((_, i) => i !== idx))
    }
    if (where === 'villa3') {
      setVilla3Draft((p) => p.filter((_, i) => i !== idx))
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      await adminUpdateSiteSettings({
        brand: site?.brand,
        home: {
          heroImages: heroDraft,
          highlightsImages: highlightsDraft,
          spacesMoments: spacesMomentsDraft,
          recentEvents: recentEventsDraft,
          villa1Images: villa1Draft,
          villa2Images: villa2Draft,
          villa3Images: villa3Draft,
        },
      })
      await fetchAll()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const createLibraryItem = async () => {
    if (!newUrl) return
    try {
      setSaving(true)
      await adminCreateMedia({ url: newUrl, title: newTitle, tags: normalizeTags(newTags) })
      setNewUrl('')
      setNewTitle('')
      setNewAlt('')
      setNewTags('')
      await fetchAll()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to add media')
    } finally {
      setSaving(false)
    }
  }

  const deleteLibraryItem = async (id) => {
    if (!confirm('Delete this media item?')) return
    try {
      setSaving(true)
      await adminDeleteMedia(id)
      await fetchAll()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete media')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page admin-dashboard">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="skel skel-line" style={{ height: '32px', width: '200px', marginBottom: '0.5rem' }}></div>
              <div className="skel skel-line skel-line--medium" style={{ height: '16px' }}></div>
            </div>
            <div className="skel skeleton-button" style={{ width: '140px' }}></div>
          </div>

          <div className="analytics-section">
            <div className="skel skel-line" style={{ height: '24px', width: '180px', marginBottom: 'var(--spacing-lg)' }}></div>
            <div className="skeleton-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-media-card">
                  <div className="skel skeleton-media-image"></div>
                  <div className="skeleton-media-content">
                    <div className="skel skel-line" style={{ marginBottom: '0.5rem' }}></div>
                    <div className="skel skel-line skel-line--short"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-section" style={{ marginTop: 'var(--spacing-2xl)' }}>
            <div className="skel skel-line" style={{ height: '24px', width: '220px', marginBottom: 'var(--spacing-lg)' }}></div>
            <div className="skeleton-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-media-card">
                  <div className="skel skeleton-media-image"></div>
                  <div className="skeleton-media-content">
                    <div className="skel skel-line" style={{ marginBottom: '0.5rem' }}></div>
                    <div className="skel skel-line skel-line--short"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page admin-dashboard">
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

  return (
    <div className="page admin-dashboard">
      <div className="container">
        <div className="section-header-row">
          <div>
            <h1>Media & Site Images</h1>
            <p className="page-subtitle">Manage hero/gallery images and reuse them across the site.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={saveSettings} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

        <div className="media-section-card">
          <div className="analytics-section">
            <h2>Home: Hero Carousel</h2>
          <div className="media-add" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <input
              type="file"
              id="hero-file-input"
              accept="image/*"
              onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={addHeroImage} disabled={!heroFile || heroDraft.length >= 5}>
              <Plus size={18} /> Add to Hero {heroDraft.length >= 5 && '(Max 5)'}
            </button>
          </div>
          {heroDraft.length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing {Math.min((heroPage - 1) * itemsPerPage + 1, heroDraft.length)}-{Math.min(heroPage * itemsPerPage, heroDraft.length)} of {heroDraft.length} images
            </div>
          )}
          <div className="media-grid">
            {heroDraft.length === 0 ? (
              <div className="empty-state">
                <p>No hero images yet. Add from library below.</p>
              </div>
            ) : (
              heroDraft
                .slice((heroPage - 1) * itemsPerPage, heroPage * itemsPerPage)
                .map((img, idx) => {
                  const actualIdx = (heroPage - 1) * itemsPerPage + idx
                  return (
                <div key={`${img.url}-${actualIdx}`} className="media-card">
                  <ImageSlot src={img.url} alt={img.alt || img.title || 'Hero image'} aspect="21 / 9" />
                  <div className="media-card__meta">
                    {editingHero?.index === actualIdx ? (
                      <div className="media-edit-form">
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={editingHero.title || ''}
                          onChange={(e) => setEditingHero({ ...editingHero, title: e.target.value })}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
                        />
                        <textarea
                          placeholder="Description (optional, shown in carousel)"
                          value={editingHero.description || ''}
                          onChange={(e) => setEditingHero({ ...editingHero, description: e.target.value })}
                          rows={2}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%', resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-primary btn-xs" onClick={saveHeroEdit}>
                            <Save size={14} /> Save
                          </button>
                          <button className="btn btn-outline btn-xs" onClick={() => setEditingHero(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {img.title && (
                          <div className="media-card__title">{img.title}</div>
                        )}
                        {img.description && (
                          <div className="media-card__description" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {img.description}
                          </div>
                        )}
                        <div className="media-card__sub" style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {img.url.startsWith('data:') ? 'Uploaded Image' : img.url}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="media-card__actions">
                    {editingHero?.index !== actualIdx && (
                      <>
                        <button className="btn btn-outline btn-xs" onClick={() => setEditingHero({ index: actualIdx, title: img.title || '', description: img.description || '' })}>
                          <Save size={16} /> Edit
                        </button>
                        <button className="btn btn-danger btn-xs" onClick={() => removeFromDraft('hero', actualIdx)}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
                  )
                })
            )}
          </div>
          {heroDraft.length > itemsPerPage && (
            <div className="pagination">
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setHeroPage(p => Math.max(1, p - 1))}
                disabled={heroPage === 1}
              >
                Previous
              </button>
              <span style={{ padding: '0 1rem' }}>
                Page {heroPage} of {Math.ceil(heroDraft.length / itemsPerPage)}
              </span>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setHeroPage(p => Math.min(Math.ceil(heroDraft.length / itemsPerPage), p + 1))}
                disabled={heroPage >= Math.ceil(heroDraft.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
          )}

          <h2 style={{ marginTop: '2rem' }}>Home: Highlights Carousel</h2>
          <div className="media-add" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <input
              type="file"
              id="highlights-file-input"
              accept="image/*"
              onChange={(e) => setHighlightsFile(e.target.files?.[0] || null)}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={highlightsTitle}
              onChange={(e) => setHighlightsTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={highlightsDescription}
              onChange={(e) => setHighlightsDescription(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={addHighlightsImage} disabled={!highlightsFile || highlightsDraft.length >= 5}>
              <Plus size={18} /> Add to Highlights {highlightsDraft.length >= 5 && '(Max 5)'}
            </button>
          </div>
          {highlightsDraft.length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing {Math.min((highlightsPage - 1) * itemsPerPage + 1, highlightsDraft.length)}-{Math.min(highlightsPage * itemsPerPage, highlightsDraft.length)} of {highlightsDraft.length} images
            </div>
          )}
          <div className="media-grid">
            {highlightsDraft.length === 0 ? (
              <div className="empty-state">
                <p>No highlight images yet. Add from library below.</p>
              </div>
            ) : (
              highlightsDraft
                .slice((highlightsPage - 1) * itemsPerPage, highlightsPage * itemsPerPage)
                .map((img, idx) => {
                  const actualIdx = (highlightsPage - 1) * itemsPerPage + idx
                  return (
                <div key={`${img.url}-${actualIdx}`} className="media-card">
                  <ImageSlot src={img.url} alt={img.alt || img.title || 'Highlights image'} aspect="21 / 9" />
                  <div className="media-card__meta">
                    {editingHighlights?.index === actualIdx ? (
                      <div className="media-edit-form">
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={editingHighlights.title || ''}
                          onChange={(e) => setEditingHighlights({ ...editingHighlights, title: e.target.value })}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
                        />
                        <textarea
                          placeholder="Description (optional, shown in carousel)"
                          value={editingHighlights.description || ''}
                          onChange={(e) => setEditingHighlights({ ...editingHighlights, description: e.target.value })}
                          rows={2}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%', resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-primary btn-xs" onClick={saveHighlightsEdit}>
                            <Save size={14} /> Save
                          </button>
                          <button className="btn btn-outline btn-xs" onClick={() => setEditingHighlights(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {img.title && (
                          <div className="media-card__title">{img.title}</div>
                        )}
                        {img.description && (
                          <div className="media-card__description" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {img.description}
                          </div>
                        )}
                        <div className="media-card__sub" style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {img.url.startsWith('data:') ? 'Uploaded Image' : img.url}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="media-card__actions">
                    {editingHighlights?.index !== actualIdx && (
                      <>
                        <button className="btn btn-outline btn-xs" onClick={() => setEditingHighlights({ index: actualIdx, title: img.title || '', description: img.description || '' })}>
                          <Save size={16} /> Edit
                        </button>
                        <button className="btn btn-danger btn-xs" onClick={() => removeFromDraft('highlights', actualIdx)}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
                  )
                })
            )}
          </div>
          {highlightsDraft.length > itemsPerPage && (
            <div className="pagination">
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setHighlightsPage(p => Math.max(1, p - 1))}
                disabled={highlightsPage === 1}
              >
                Previous
              </button>
              <span style={{ padding: '0 1rem' }}>
                Page {highlightsPage} of {Math.ceil(highlightsDraft.length / itemsPerPage)}
              </span>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setHighlightsPage(p => Math.min(Math.ceil(highlightsDraft.length / itemsPerPage), p + 1))}
                disabled={highlightsPage >= Math.ceil(highlightsDraft.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
          )}
          </div>
        </div>

        <div className="media-section-card media-section-card--blue">
          <div className="analytics-section">
            <h2>Explore: Spaces & Moments</h2>
          <div className="media-add" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <input
              type="file"
              id="spaces-moments-file-input"
              accept="image/*"
              onChange={(e) => setSpacesMomentsFile(e.target.files?.[0] || null)}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={spacesMomentsTitle}
              onChange={(e) => setSpacesMomentsTitle(e.target.value)}
            />
            <div style={{ width: '100%' }}></div>
            <button className="btn btn-primary btn-sm" onClick={addSpacesMomentsImage} disabled={!spacesMomentsFile || spacesMomentsDraft.length >= 3}>
              <Plus size={18} /> Add to Spaces & Moments {spacesMomentsDraft.length >= 3 && '(Max 3)'}
            </button>
          </div>
          <div className="media-grid">
            {spacesMomentsDraft.length === 0 ? (
              <div className="empty-state">
                <p>No images yet. Add images to display in the Explore page.</p>
              </div>
            ) : (
              spacesMomentsDraft.map((img, idx) => (
                <div key={`${img.url}-${idx}`} className="media-card">
                  <ImageSlot src={img.url} alt={img.alt || img.title || 'Spaces & Moments image'} aspect="3 / 2" />
                  <div className="media-card__meta">
                    {editingSpacesMoments?.index === idx ? (
                      <div className="media-edit-form">
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={editingSpacesMoments.title || ''}
                          onChange={(e) => setEditingSpacesMoments({ ...editingSpacesMoments, title: e.target.value })}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-primary btn-xs" onClick={saveSpacesMomentsEdit}>
                            <Save size={14} /> Save
                          </button>
                          <button className="btn btn-outline btn-xs" onClick={() => setEditingSpacesMoments(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {img.title && (
                          <div className="media-card__title">{img.title}</div>
                        )}
                        <div className="media-card__sub" style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {img.url.startsWith('data:') ? 'Uploaded Image' : img.url}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="media-card__actions">
                    {editingSpacesMoments?.index !== idx && (
                      <>
                        <button className="btn btn-outline btn-xs" onClick={() => setEditingSpacesMoments({ index: idx, title: img.title || '', description: img.description || '' })}>
                          <Save size={16} /> Edit
                        </button>
                        <button className="btn btn-danger btn-xs" onClick={() => removeFromDraft('spacesMoments', idx)}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <h2 style={{ marginTop: '2rem' }}>Explore: Recent Events</h2>
          <div className="event-form-card">
            <div className="event-form-header">
              <h3>Add New Event</h3>
              <span className="event-form-badge">{recentEventsDraft.length} / 3 events</span>
            </div>
            <div className="event-form-body">
              <div className="event-form-row">
                <div className="event-form-group">
                  <label className="event-form-label">
                    <span>Thumbnail Image (Main Image)</span>
                    <span className="required-asterisk">*</span>
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="recent-events-thumbnail-input"
                      accept="image/*"
                      onChange={(e) => setRecentEventsThumbnailFile(e.target.files?.[0] || null)}
                      className="file-input"
                    />
                    {recentEventsThumbnailFile && (
                      <div className="file-selected">
                        ✓ {recentEventsThumbnailFile.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="event-form-group">
                  <label className="event-form-label">
                    <span>Additional Images (Gallery)</span>
                    <span className="optional-badge">Optional</span>
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="recent-events-gallery-input"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFilesChange}
                      className="file-input"
                    />
                    {recentEventsGalleryFiles.length > 0 && (
                      <div className="file-selected">
                        ✓ {recentEventsGalleryFiles.length} {recentEventsGalleryFiles.length === 1 ? 'image' : 'images'} selected
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="event-form-row">
                <div className="event-form-group event-form-group--full">
                  <label className="event-form-label">
                    <span>Event Title</span>
                    <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Birthday Celebration"
                    value={recentEventsTitle}
                    onChange={(e) => setRecentEventsTitle(e.target.value)}
                    className="event-form-input"
                  />
                </div>
              </div>
              <div className="event-form-row">
                <div className="event-form-group event-form-group--full">
                  <label className="event-form-label">
                    <span>Event Description</span>
                    <span className="optional-badge">Optional</span>
                  </label>
                  <textarea
                    placeholder="Describe the event, occasion, or celebration..."
                    value={recentEventsDescription}
                    onChange={(e) => setRecentEventsDescription(e.target.value)}
                    rows={3}
                    className="event-form-textarea"
                  />
                </div>
              </div>
              <div className="event-form-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={addRecentEventsImage} 
                  disabled={!recentEventsThumbnailFile || !recentEventsTitle.trim() || recentEventsDraft.length >= 3}
                >
                  <Plus size={18} /> Add Event {recentEventsDraft.length >= 3 && '(Max 3)'}
                </button>
              </div>
            </div>
          </div>
          <div className="media-grid">
            {recentEventsDraft.length === 0 ? (
              <div className="empty-state">
                <p>No events yet. Add events to display in the Explore page.</p>
              </div>
            ) : (
              recentEventsDraft.map((event, idx) => (
                <div key={`event-${idx}`} className="media-card" style={{ position: 'relative' }}>
                  <div style={{ position: 'relative' }}>
                    <ImageSlot src={event.thumbnail} alt={event.title || 'Recent event image'} aspect="16 / 9" />
                    {event.images && event.images.length > 0 && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '0.5rem', 
                        right: '0.5rem', 
                        background: 'rgba(0,0,0,0.7)', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 'var(--border-radius)',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        +{event.images.length} {event.images.length === 1 ? 'photo' : 'photos'}
                      </div>
                    )}
                  </div>
                  <div className="media-card__meta">
                    {editingRecentEvents?.index === idx ? (
                      <div className="media-edit-form">
                        <input
                          type="text"
                          placeholder="Title (e.g., Birthday Celebration)"
                          value={editingRecentEvents.title || ''}
                          onChange={(e) => setEditingRecentEvents({ ...editingRecentEvents, title: e.target.value })}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
                        />
                        <textarea
                          placeholder="Description (optional)"
                          value={editingRecentEvents.description || ''}
                          onChange={(e) => setEditingRecentEvents({ ...editingRecentEvents, description: e.target.value })}
                          rows={2}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%', resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-primary btn-xs" onClick={saveRecentEventsEdit}>
                            <Save size={14} /> Save
                          </button>
                          <button className="btn btn-outline btn-xs" onClick={() => setEditingRecentEvents(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {event.title && (
                          <div className="media-card__title">{event.title}</div>
                        )}
                        {event.description && (
                          <div className="media-card__description" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {event.description}
                          </div>
                        )}
                        <div className="media-card__sub" style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          marginTop: '0.5rem'
                        }}>
                          Thumbnail: {event.thumbnail?.startsWith('data:') ? 'Uploaded Image' : 'Image URL'}
                          {event.images && event.images.length > 0 && (
                            <div style={{ marginTop: '0.25rem' }}>
                              Gallery: {event.images.length} {event.images.length === 1 ? 'image' : 'images'}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="media-card__actions">
                    {editingRecentEvents?.index !== idx && (
                      <>
                        <button className="btn btn-outline btn-xs" onClick={() => setEditingRecentEvents({ index: idx, title: event.title || '', description: event.description || '' })}>
                          <Save size={16} /> Edit
                        </button>
                        <button className="btn btn-outline btn-xs" onClick={() => addImagesToEventGallery(idx)}>
                          <Plus size={16} /> Add Images
                        </button>
                        {event.images && event.images.length > 0 && (
                          <div className="event-gallery-preview">
                            <span className="event-gallery-count">{event.images.length} gallery {event.images.length === 1 ? 'image' : 'images'}</span>
                          </div>
                        )}
                        <button className="btn btn-danger btn-xs" onClick={() => removeFromDraft('recentEvents', idx)}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          </div>
        </div>

        <div className="media-section-card media-section-card--purple">
          <div className="analytics-section">
            <h2>Villa 1 Images</h2>
          <div className="media-add" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <input
              type="file"
              id="villa1-file-input"
              accept="image/*"
              onChange={(e) => setVilla1File(e.target.files?.[0] || null)}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={villa1Title}
              onChange={(e) => setVilla1Title(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={addVilla1Image} disabled={!villa1File}>
              <Plus size={18} /> Add to Villa 1
            </button>
          </div>
          <div className="media-grid">
            {villa1Draft.length === 0 ? (
              <div className="empty-state">
                <p>No images yet. Add images for Villa 1.</p>
              </div>
            ) : (
              villa1Draft.map((img, idx) => (
                <div key={`${img.url}-${idx}`} className="media-card">
                  <ImageSlot src={img.url} alt={img.alt || img.title || 'Villa 1 image'} aspect="16 / 9" />
                  <div className="media-card__meta">
                    {editingVilla1?.index === idx ? (
                      <div className="media-edit-form">
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={editingVilla1.title || ''}
                          onChange={(e) => setEditingVilla1({ ...editingVilla1, title: e.target.value })}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-primary btn-xs" onClick={saveVilla1Edit}>
                            <Save size={16} /> Save
                          </button>
                          <button className="btn btn-outline btn-xs" onClick={() => setEditingVilla1(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {img.title && (
                          <div className="media-card__title">{img.title}</div>
                        )}
                        <div className="media-card__sub" style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {img.url.startsWith('data:') ? 'Uploaded Image' : img.url}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="media-card__actions">
                    {editingVilla1?.index !== idx && (
                      <>
                        <button className="btn btn-outline btn-xs" onClick={() => setEditingVilla1({ index: idx, title: img.title || '', description: img.description || '' })}>
                          <Save size={16} /> Edit
                        </button>
                        <button className="btn btn-danger btn-xs" onClick={() => removeFromDraft('villa1', idx)}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          </div>

          <div className="analytics-section" style={{ marginTop: 'var(--spacing-2xl)' }}>
            <h2>Villa 2 Images</h2>
          <div className="media-add" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <input
              type="file"
              id="villa2-file-input"
              accept="image/*"
              onChange={(e) => setVilla2File(e.target.files?.[0] || null)}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={villa2Title}
              onChange={(e) => setVilla2Title(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={addVilla2Image} disabled={!villa2File}>
              <Plus size={18} /> Add to Villa 2
            </button>
          </div>
          <div className="media-grid">
            {villa2Draft.length === 0 ? (
              <div className="empty-state">
                <p>No images yet. Add images for Villa 2.</p>
              </div>
            ) : (
              villa2Draft.map((img, idx) => (
                <div key={`${img.url}-${idx}`} className="media-card">
                  <ImageSlot src={img.url} alt={img.alt || img.title || 'Villa 2 image'} aspect="16 / 9" />
                  <div className="media-card__meta">
                    {editingVilla2?.index === idx ? (
                      <div className="media-edit-form">
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={editingVilla2.title || ''}
                          onChange={(e) => setEditingVilla2({ ...editingVilla2, title: e.target.value })}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-primary btn-xs" onClick={saveVilla2Edit}>
                            <Save size={16} /> Save
                          </button>
                          <button className="btn btn-outline btn-xs" onClick={() => setEditingVilla2(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {img.title && (
                          <div className="media-card__title">{img.title}</div>
                        )}
                        <div className="media-card__sub" style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {img.url.startsWith('data:') ? 'Uploaded Image' : img.url}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="media-card__actions">
                    {editingVilla2?.index !== idx && (
                      <>
                        <button className="btn btn-outline btn-xs" onClick={() => setEditingVilla2({ index: idx, title: img.title || '', description: img.description || '' })}>
                          <Save size={16} /> Edit
                        </button>
                        <button className="btn btn-danger btn-xs" onClick={() => removeFromDraft('villa2', idx)}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          </div>

          <div className="analytics-section" style={{ marginTop: 'var(--spacing-2xl)' }}>
            <h2>Villa 3 Images</h2>
          <div className="media-add" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <input
              type="file"
              id="villa3-file-input"
              accept="image/*"
              onChange={(e) => setVilla3File(e.target.files?.[0] || null)}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={villa3Title}
              onChange={(e) => setVilla3Title(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={addVilla3Image} disabled={!villa3File}>
              <Plus size={18} /> Add to Villa 3
            </button>
          </div>
          <div className="media-grid">
            {villa3Draft.length === 0 ? (
              <div className="empty-state">
                <p>No images yet. Add images for Villa 3.</p>
              </div>
            ) : (
              villa3Draft.map((img, idx) => (
                <div key={`${img.url}-${idx}`} className="media-card">
                  <ImageSlot src={img.url} alt={img.alt || img.title || 'Villa 3 image'} aspect="16 / 9" />
                  <div className="media-card__meta">
                    {editingVilla3?.index === idx ? (
                      <div className="media-edit-form">
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={editingVilla3.title || ''}
                          onChange={(e) => setEditingVilla3({ ...editingVilla3, title: e.target.value })}
                          style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-primary btn-xs" onClick={saveVilla3Edit}>
                            <Save size={16} /> Save
                          </button>
                          <button className="btn btn-outline btn-xs" onClick={() => setEditingVilla3(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {img.title && (
                          <div className="media-card__title">{img.title}</div>
                        )}
                        <div className="media-card__sub" style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {img.url.startsWith('data:') ? 'Uploaded Image' : img.url}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="media-card__actions">
                    {editingVilla3?.index !== idx && (
                      <>
                        <button className="btn btn-outline btn-xs" onClick={() => setEditingVilla3({ index: idx, title: img.title || '', description: img.description || '' })}>
                          <Save size={16} /> Edit
                        </button>
                        <button className="btn btn-danger btn-xs" onClick={() => removeFromDraft('villa3', idx)}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          </div>
        </div>

        <div className="analytics-section">
          <h2>Media Library</h2>
          <p className="page-subtitle">
            Add image URLs here (later we can upgrade to real uploads). Then reuse them in hero/highlights.
          </p>

          <div className="media-add">
            <input
              type="url"
              placeholder="Image URL (https://...)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={createLibraryItem} disabled={saving || !newUrl}>
              <Plus size={18} /> Add to library
            </button>
          </div>

          <div className="media-grid">
            {library.map((m) => (
              <div key={m._id} className="media-card">
                <ImageSlot src={m.url} alt={m.title || 'Media'} aspect="21 / 9" />
                <div className="media-card__meta">
                  {m.title && (
                    <div className="media-card__title">{m.title}</div>
                  )}
                  <div className="media-card__sub">{m.url}</div>
                </div>
                <div className="media-card__actions">
                  <button
                    className="btn btn-outline btn-xs"
                    onClick={() => {
                      navigator.clipboard?.writeText(m.url)
                      alert('Copied URL')
                    }}
                  >
                    <Copy size={16} /> Copy
                  </button>
                  <button className="btn btn-success btn-xs" onClick={() => addToDraft('hero', m.url, m.title || '', '', '')}>
                    Use in Hero
                  </button>
                  <button
                    className="btn btn-success btn-xs"
                    onClick={() => addToDraft('highlights', m.url, m.title || '', '', '')}
                  >
                    Use in Highlights
                  </button>
                  <button
                    className="btn btn-success btn-xs"
                    onClick={() => addToDraft('spacesMoments', m.url, m.title || '', '', '')}
                  >
                    Use in Spaces & Moments
                  </button>
                  <button
                    className="btn btn-success btn-xs"
                    onClick={() => addToDraft('recentEvents', m.url, m.title || '', '', '')}
                  >
                    Use in Recent Events
                  </button>
                  <button className="btn btn-danger btn-xs" onClick={() => deleteLibraryItem(m._id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMediaPage

