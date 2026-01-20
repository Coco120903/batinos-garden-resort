import { useEffect, useMemo, useState } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { isAuthenticated, logout, getStoredUser } from '../api/auth'
import { useAutoLogout } from '../hooks/useAutoLogout'
import { Leaf, LogOut, Shield, User, Menu, X, Phone, Facebook, MapPin, Mail } from 'lucide-react'
import './Layout.css'

function UserLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const authenticated = isAuthenticated()
  const user = getStoredUser()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  // Enable auto-logout after 30 minutes of inactivity
  // Hook handles authentication check internally
  useAutoLogout()

  const handleLogout = () => {
    logout()
    // Clear history and prevent back button
    window.history.replaceState(null, '', '/login')
    navigate('/login', { replace: true })
    // Force reload to clear any cached state
    window.location.reload()
  }

  // Close mobile menu on route change
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

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`

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
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <div className="logo-content">
                <span className="logo-mark" aria-hidden="true">
                  <Leaf size={18} />
                </span>
                <div className="logo-text">
                  <h1>Batino&apos;s</h1>
                  <span className="logo-subtitle">Garden Farm Resort</span>
                </div>
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
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
              <NavLink to="/explore" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/services" className={navLinkClass}>
                Booking
              </NavLink>
              <NavLink to="/contacts" className={navLinkClass}>
                Contacts
              </NavLink>
              {authenticated ? (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    My Bookings
                  </NavLink>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="nav-link-icon">
                      <Shield size={18} />
                      Admin
                    </Link>
                  )}
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
                        <Link to="/profile" className="account-menu__item">
                          Profile
                        </Link>
                        <button type="button" onClick={handleLogout} className="account-menu__item account-menu__danger">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm nav-login-btn nav-login-btn--invert">
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <Link to="/" className="logo">
                <div className="logo-content">
                  <span className="logo-mark" aria-hidden="true">
                    <Leaf size={18} />
                  </span>
                  <div className="logo-text">
                    <h3>Batino&apos;s</h3>
                    <span className="logo-subtitle">Garden Farm Resort</span>
                  </div>
                </div>
              </Link>
              <p>
                Private pool resort &amp; event place in Silang, Cavite. Ideal for celebrations, staycations, and memorable
                gatherings.
              </p>
            </div>
            <div className="footer-section">
              <h4>Legal &amp; Help</h4>
              <ul>
                <li><Link to="/terms">Terms &amp; Conditions</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li className="footer-item">
                  <Phone size={16} /> <a href="tel:+639272726865">0927 272 6865</a>
                </li>
                <li className="footer-item">
                  <Mail size={16} /> <a href="mailto:batino50@gmail.com">batino50@gmail.com</a>
                </li>
                <li className="footer-item">
                  <Facebook size={16} />{' '}
                  <a
                    href="https://www.facebook.com/people/Batinos-farm-resort/100063931547018/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Batino&apos;s Farm Resort
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Location</h4>
              <ul>
                <li className="footer-item">
                  <a href="https://maps.app.goo.gl/HBgXnASeCD4v2LRk9" target="_blank" rel="noopener noreferrer">
                    <MapPin size={16} /> Silang, Cavite, Philippines
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Batino's Garden Farm Resort. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserLayout
