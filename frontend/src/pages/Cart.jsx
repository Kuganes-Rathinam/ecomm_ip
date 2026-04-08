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

  const [productDetails, setProductDetails] = useState({}) 

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
        <h3 className="empty-state-title">Please Sign in</h3>
        <p className="empty-state-desc">You need to be logged in to view your cart</p>
        <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px' }}>Sign in to your account</Link>
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
    <div className="page-wrapper cart-page">
      <div className="container">
        {items.length === 0 ? (
          <div className="cart-empty-container">
            <div className="cart-empty-content">
              <h2>Your Amazon Cart is empty.</h2>
              <p>Check your Saved for later items below or <Link to="/">continue shopping</Link>.</p>
            </div>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items List */}
            <div className="cart-items-section">
              <h2>Shopping Cart</h2>
              <div className="cart-price-header">Price</div>
              <div className="divider" />
              
              {items.map(item => {
                const p = productDetails[item.productId]
                const price = p?.salePrice || p?.originalPrice || 0
                return (
                  <div key={item.productId} className="cart-item" id={`cart-item-${item.productId}`}>
                    {/* Image */}
                    <div className="cart-item-image">
                      {p?.imageUrl
                        ? <img src={p.imageUrl} alt={p?.productName} />
                        : <div className="cart-item-placeholder">No Image</div>
                      }
                    </div>

                    {/* Info */}
                    <div className="cart-item-info">
                      <Link to={`/products/${p?.slug}`} className="cart-item-name">
                        {p?.productName || 'Loading...'}
                      </Link>
                      <div className="cart-item-stock">In stock</div>
                      <div className="cart-item-actions">
                         <select 
                           value={item.quantity} 
                           onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                           className="qty-dropdown"
                         >
                           {[...Array(10)].map((_, i) => (
                             <option key={i+1} value={i+1}>Qty: {i+1}</option>
                           ))}
                         </select>
                         <span className="action-separator">|</span>
                         <button
                           id={`remove-${item.productId}`}
                           className="cart-action-link"
                           onClick={() => removeItem(item.productId)}
                         >Delete</button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="cart-item-price">
                       ₹{(price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                )
              })}
              <div className="divider" />
              <div className="cart-subtotal-row">
                Subtotal ({items.length} items): <span className="cart-subtotal-price">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="cart-summary-section">
              <div className="summary-protection">
                <span className="protection-icon">✓</span>
                Your order is eligible for FREE Delivery.
              </div>
              <div className="cart-subtotal-main">
                Subtotal ({items.length} items): <span className="cart-subtotal-price">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <button
                id="proceed-checkout-btn"
                className="btn btn-primary btn-lg checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Buy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
