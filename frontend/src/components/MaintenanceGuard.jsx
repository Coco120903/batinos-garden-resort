import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSiteSettings } from '../api/site'

const DEFAULT_MESSAGE = 'System is temporarily unavailable. Please try again later.'

function isAllowedDuringMaintenance(pathname) {
  if (!pathname) return false
  if (pathname.startsWith('/admin')) return true
  if (pathname === '/login') return true
  if (pathname === '/auth/login') return true
  return false
}

export default function MaintenanceGuard() {
  const location = useLocation()
  const navigate = useNavigate()
  const inFlightRef = useRef(false)
  const lastCheckRef = useRef({ ts: 0, isOpen: true, message: DEFAULT_MESSAGE })

  useEffect(() => {
    const pathname = location.pathname || '/'

    // Never interfere with admin or login routes.
    if (isAllowedDuringMaintenance(pathname)) return

    // Avoid spamming /api/site on rapid route changes.
    const now = Date.now()
    const cacheTtlMs = 10_000
    if (now - lastCheckRef.current.ts < cacheTtlMs) {
      if (lastCheckRef.current.isOpen === false) {
        sessionStorage.setItem('maintenanceMessage', lastCheckRef.current.message || DEFAULT_MESSAGE)
        sessionStorage.setItem('showMaintenanceModal', 'true')
        navigate('/login', { replace: true, state: { from: pathname } })
      }
      return
    }

    if (inFlightRef.current) return
    inFlightRef.current = true

    ;(async () => {
      try {
        const settings = await getSiteSettings()
        const isOpen = settings?.system?.isBookingOpen ?? true
        const message = settings?.system?.maintenanceMessage || DEFAULT_MESSAGE
        lastCheckRef.current = { ts: Date.now(), isOpen, message }

        if (!isOpen) {
          sessionStorage.setItem('maintenanceMessage', message)
          sessionStorage.setItem('showMaintenanceModal', 'true')
          navigate('/login', { replace: true, state: { from: pathname } })
        }
      } catch {
        // If we can't fetch settings, don't lock users out.
        lastCheckRef.current = { ts: Date.now(), isOpen: true, message: DEFAULT_MESSAGE }
      } finally {
        inFlightRef.current = false
      }
    })()
  }, [location.pathname, navigate])

  return null
}

