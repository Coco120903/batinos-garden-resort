import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, isAuthenticated } from '../api/auth'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

/**
 * Custom hook for auto-logout after inactivity
 * Logs out user after 30 minutes of inactivity
 */
export function useAutoLogout() {
  const navigate = useNavigate()
  const timeoutRef = useRef(null)
  const lastActivityRef = useRef(Date.now())

  const resetTimer = () => {
    if (!isAuthenticated()) {
      return // Don't set timer if not authenticated
    }

    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Update last activity time
    lastActivityRef.current = Date.now()
    localStorage.setItem('lastActivity', lastActivityRef.current.toString())

    // Set new timer
    timeoutRef.current = setTimeout(() => {
      // Check if still authenticated (user might have logged out manually)
      if (isAuthenticated()) {
        // Enhanced logout that prevents back button
        logout()
        // Clear any cached data
        sessionStorage.clear()
        // Replace current history entry to prevent back button
        window.history.replaceState(null, '', '/login')
        // Navigate to login
        navigate('/login', { replace: true })
        // Force reload to clear any cached state
        window.location.reload()
      }
    }, INACTIVITY_TIMEOUT)
  }

  const handleActivity = () => {
    resetTimer()
  }

  useEffect(() => {
    // Only set up auto-logout if user is authenticated
    if (!isAuthenticated()) {
      return
    }

    // Check if session has already expired
    const lastActivity = localStorage.getItem('lastActivity')
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10)
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        // Session already expired
        logout()
        sessionStorage.clear()
        window.history.replaceState(null, '', '/login')
        navigate('/login', { replace: true })
        window.location.reload()
        return
      } else {
        // Resume from last activity
        const remainingTime = INACTIVITY_TIMEOUT - timeSinceLastActivity
        timeoutRef.current = setTimeout(() => {
          if (isAuthenticated()) {
            logout()
            sessionStorage.clear()
            window.history.replaceState(null, '', '/login')
            navigate('/login', { replace: true })
            window.location.reload()
          }
        }, remainingTime)
      }
    } else {
      // First time, set initial activity
      resetTimer()
    }

    // Add event listeners for user activity
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, true)
    })

    // Also listen to visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated()) {
        // Check if session expired while tab was hidden
        const lastActivity = localStorage.getItem('lastActivity')
        if (lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10)
          if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
            logout()
            sessionStorage.clear()
            window.history.replaceState(null, '', '/login')
            navigate('/login', { replace: true })
            window.location.reload()
            return
          }
        }
        resetTimer()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity, true)
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [navigate])

  return null
}
