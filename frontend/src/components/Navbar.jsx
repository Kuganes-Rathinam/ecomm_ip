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
  
  // Extract search from URL if present
  const searchParams = new URLSearchParams(location.search)
  const initialSearch = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      navigate('/')
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Left: Text Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">e</span>
          <span className="logo-text">Commerce</span>
          <span className="logo-tag">.in</span>
        </Link>
        
        {/* Center: Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        {/* Right Actions */}
        <div className="navbar-actions">
          {user && (
            <Link to="/dashboard" className="nav-link">Orders</Link>
          )}

          <Link to="/cart" className="nav-cart-btn" id="cart-nav-btn">
            <span className="cart-badge">{itemCount || 0}</span>
            <span className="cart-icon">🛒</span>
            <span>Cart</span>
          </Link>

          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">
                Hello, {user.name?.split(' ')[0]}
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
              <Link to="/login" id="login-nav-btn">Sign in</Link>
              <Link to="/register" id="register-nav-btn">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
