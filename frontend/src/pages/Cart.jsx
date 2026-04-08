import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { productApi } from '../api'
import './Cart.css'

export default function Cart() {
  const { cart, loading, removeItem, updateQuantity } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [productDetails, setProductDetails] = useState({}) // productId → Product

  // Fetch product details for display (names, images)
  useEffect(() => {
    if (!cart?.items?.length) return
    Promise.all(cart.items.map(item => productApi.getById(item.productId)))
      .then(results => {
        const map = {}
        results.forEach(r => { map[r.data.id] = r.data })
        setProductDetails(map)
      })
  }, [cart?.items])

  if (!user) return (
    <div className="page-wrapper">
      <div className="container empty-state">
        <div className="empty-state-icon">🔐</div>
        <h3 className="empty-state-title">Please Login</h3>
        <p className="empty-state-desc">You need to be logged in to view your cart</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    </div>
  )

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>

  const items = cart?.items || []
  const subtotal = items.reduce((sum, item) => {
    const p = productDetails[item.productId]
    const price = p?.salePrice || p?.originalPrice || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title">Your Cart</h1>
        <p className="section-subtitle">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-desc">Add some products to get started</p>
            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items List */}
            <div className="cart-items-list">
              {items.map(item => {
                const p = productDetails[item.productId]
                const price = p?.salePrice || p?.originalPrice || 0
                return (
                  <div key={item.productId} className="cart-item glass-card" id={`cart-item-${item.productId}`}>
                    {/* Image */}
                    <div className="cart-item-image">
                      {p?.imageUrl
                        ? <img src={p.imageUrl} alt={p?.productName} />
                        : <div className="cart-item-placeholder">🛍️</div>
                      }
                    </div>

                    {/* Info */}
                    <div className="cart-item-info">
                      <Link to={`/products/${p?.slug}`} className="cart-item-name">
                        {p?.productName || 'Loading...'}
                      </Link>
                      <p className="cart-item-price">₹{price.toFixed(2)} each</p>
                    </div>

                    {/* Quantity */}
                    <div className="qty-stepper">
                      <button
                        id={`qty-dec-${item.productId}`}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        id={`qty-inc-${item.productId}`}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >+</button>
                    </div>

                    {/* Line Total */}
                    <div className="cart-item-total">
                      ₹{(price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <button
                      id={`remove-${item.productId}`}
                      className="cart-remove-btn"
                      onClick={() => removeItem(item.productId)}
                      title="Remove item"
                    >✕</button>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="cart-summary glass-card">
              <h3 className="cart-summary-title">Order Summary</h3>
              <div className="divider" />

              <div className="summary-row">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="summary-free">FREE</span>
              </div>
              <div className="divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <button
                id="proceed-checkout-btn"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 'var(--space-6)' }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>
              <Link to="/" className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-3)' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
