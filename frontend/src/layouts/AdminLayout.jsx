import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { logout, getStoredUser } from '../api/auth'
import { useAutoLogout } from '../hooks/useAutoLogout'
import { LogOut, Leaf, ExternalLink, Images, MessageSquareText, CalendarDays, Menu, X, User } from 'lucide-react'
import './Layout.css'

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getStoredUser()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  // Enable auto-logout after 30 minutes of inactivity
  useAutoLogout()

  const handleLogout = () => {
    logout()
    // Clear history and prevent back button
    window.history.replaceState(null, '', '/login')
    navigate('/login', { replace: true })
    // Force reload to clear any cached state
    window.location.reload()
  }

  useEffect(() => {
    setMobileNavOpen(false)
    setAccountOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  const navLinkClass = ({ isActive }) => `nav-link-icon ${isActive ? 'nav-link--active' : ''}`

  return (
    <div className="layout">
      {/* Mobile Navigation Overlay */}
      {mobileNavOpen && (
        <div
          className="mobile-nav-overlay mobile-nav-overlay--open"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <header className="header header-admin">
        <div className="container">
          <div className="header-content">
            <Link to="/admin" className="logo">
              <div className="logo-content">
                <Leaf size={22} />
                <h1>Admin Dashboard</h1>
              </div>
            </Link>
            <button
              className="nav-toggle"
              type="button"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <nav className={`nav ${mobileNavOpen ? 'nav--open' : ''}`}>
              <NavLink to="/admin/schedule" className={navLinkClass}>
                <CalendarDays size={18} />
                <span className="nav-link-icon__text">Schedule</span>
              </NavLink>
              <NavLink to="/admin/media" className={navLinkClass}>
                <Images size={18} />
                <span className="nav-link-icon__text">Media</span>
              </NavLink>
              <NavLink to="/admin/reviews" className={navLinkClass}>
                <MessageSquareText size={18} />
                <span className="nav-link-icon__text">Reviews</span>
              </NavLink>
              <Link to="/" className="nav-link-icon">
                <ExternalLink size={18} />
                <span className="nav-link-icon__text">View Site</span>
              </Link>
              <div className="account">
                <button
                  type="button"
                  className="account-btn"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                >
                  <User size={16} />
                  <span className="account-btn__text">{user?.name || user?.email}</span>
                </button>
                {accountOpen && (
                  <div className="account-menu">
                    <button type="button" onClick={handleLogout} className="account-menu__item account-menu__danger">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
