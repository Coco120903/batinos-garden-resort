import { Outlet, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import './Layout.css'

function AuthLayout() {
  return (
    <div className="layout auth-layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <div className="logo-content">
              <Leaf size={22} />
              <h1>Batino's Garden Farm Resort</h1>
            </div>
          </Link>
        </div>
      </header>

      <main className="main auth-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
