import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Use a standard, immediate scroll reset on route change.
    // (Non-standard values like "instant" can cause inconsistent behavior across browsers.)
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
