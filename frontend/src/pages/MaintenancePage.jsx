import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSiteSettings } from '../api/site'
import './Page.css'

function MaintenancePage() {
  const [message, setMessage] = useState('System is temporarily unavailable. Please try again later.')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    // Get message from sessionStorage (set by API interceptor) or fetch from API
    const storedMessage = sessionStorage.getItem('maintenanceMessage')
    if (storedMessage) {
      setMessage(storedMessage)
      sessionStorage.removeItem('maintenanceMessage')
    } else {
      // Try to fetch current site settings
      getSiteSettings()
        .then((settings) => {
          if (settings?.system?.maintenanceMessage) {
            setMessage(settings.system.maintenanceMessage)
          }
        })
        .catch(() => {
          // Use default message if fetch fails
        })
    }
  }, [])

  const handleRetry = async () => {
    setChecking(true)
    try {
      const settings = await getSiteSettings()
      if (settings?.system?.isBookingOpen) {
        // System is back online, redirect to home
        window.location.href = '/'
      } else {
        // Still in maintenance, update message if changed
        if (settings?.system?.maintenanceMessage) {
          setMessage(settings.system.maintenanceMessage)
        }
      }
    } catch (err) {
      // Still in maintenance or error
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="page maintenance-page">
      <div className="maintenance-background">
        <div className="maintenance-shapes">
          <div className="maintenance-shape maintenance-shape--1"></div>
          <div className="maintenance-shape maintenance-shape--2"></div>
          <div className="maintenance-shape maintenance-shape--3"></div>
        </div>
      </div>
      <div className="maintenance-container">
        <div className="maintenance-card">
          <div className="maintenance-icon-wrapper">
            <div className="maintenance-icon-bg"></div>
            <AlertTriangle className="maintenance-icon" size={72} />
          </div>
          <div className="maintenance-content">
            <h1 className="maintenance-title">System Under Maintenance</h1>
            <p className="maintenance-subtitle">
              We&apos;re working hard to improve your experience. Please check back soon.
            </p>
            <div className="maintenance-message-box">
              <div className="maintenance-message-icon">ℹ️</div>
              <div className="maintenance-message-text">{message}</div>
            </div>
          </div>
          <div className="maintenance-actions">
            <button 
              className="btn btn-primary btn-maintenance" 
              onClick={handleRetry}
              disabled={checking}
            >
              {checking ? (
                <>
                  <RefreshCw size={18} className="spinning" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  <span>Check Again</span>
                </>
              )}
            </button>
            <Link to="/login" className="btn btn-outline btn-maintenance">
              <LogIn size={18} />
              <span>Go to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenancePage
