import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout }    = useAuth()
  const { itemCount }       = useCart()
  const navigate            = useNavigate()
  const location            = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">EBS</span>
          <span className="logo-tag">Store</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/"         className={isActive('/')}>Catalog</Link>
          {user && (
            <Link to="/dashboard" className={isActive('/dashboard')}>My Orders</Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Cart Button */}
          <Link to="/cart" className="nav-cart-btn" id="cart-nav-btn">
            <span className="cart-icon">🛒</span>
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">
                <span className="user-avatar">{user.name?.[0]?.toUpperCase()}</span>
                {user.name?.split(' ')[0]}
              </span>
              <button
                id="logout-btn"
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login"    className="btn btn-secondary btn-sm" id="login-nav-btn">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm"   id="register-nav-btn">Register</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}
