import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { orderApi, paymentApi } from '../api'
import toast from 'react-hot-toast'
import './Checkout.css'

const PAYMENT_METHODS = [
  { id: 'upi',         label: '📱 UPI',           desc: 'Pay via UPI ID' },
  { id: 'credit_card', label: '💳 Credit Card',    desc: 'Visa, Mastercard, Amex' },
  { id: 'debit_card',  label: '💳 Debit Card',     desc: 'All major debit cards' },
  { id: 'cod',         label: '💵 Cash on Delivery', desc: 'Pay when delivered' },
]

export default function Checkout() {
  const { user }           = useAuth()
  const { cart, fetchCart } = useCart()
  const navigate           = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [placing, setPlacing]             = useState(false)
  const [address, setAddress]             = useState(user?.address || '')

  if (!user) return (
    <div className="page-wrapper">
      <div className="container empty-state">
        <div className="empty-state-icon">🔐</div>
        <h3 className="empty-state-title">Please Login</h3>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    </div>
  )

  const items = cart?.items || []
  if (items.length === 0) return (
    <div className="page-wrapper">
      <div className="container empty-state">
        <div className="empty-state-icon">🛒</div>
        <h3 className="empty-state-title">Your cart is empty</h3>
        <Link to="/" className="btn btn-primary">Shop Now</Link>
      </div>
    </div>
  )

  // Rough total from cart (exact total comes from backend)
  const roughTotal = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address')
      return
    }
    setPlacing(true)
    try {
      // 1. Place order (atomically decrements inventory on backend)
      const orderRes = await orderApi.placeOrder(user.id)
      const order    = orderRes.data

      // 2. Create payment record
      await paymentApi.create({
        orderId:       order.id,
        amount:        order.totalAmount,
        paymentMethod: paymentMethod,
      })

      toast.success('🎉 Order placed successfully!')
      await fetchCart() // refresh cart count
      navigate(`/dashboard`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title">Checkout</h1>
        <p className="section-subtitle">Review your order and complete payment</p>

        <div className="checkout-layout">
          {/* Left: Delivery + Payment */}
          <div className="checkout-form">

            {/* Delivery Address */}
            <div className="checkout-section glass-card">
              <h3 className="checkout-section-title">📍 Delivery Address</h3>
              <div className="divider" />
              <div className="form-group">
                <label className="form-label" htmlFor="delivery-name">Full Name</label>
                <input
                  id="delivery-name"
                  className="form-input"
                  type="text"
                  defaultValue={user.name}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="delivery-address">Address</label>
                <textarea
                  id="delivery-address"
                  className="form-input checkout-textarea"
                  placeholder="Enter your full delivery address..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="delivery-phone">Phone</label>
                <input
                  id="delivery-phone"
                  className="form-input"
                  type="text"
                  defaultValue={user.phone || ''}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section glass-card">
              <h3 className="checkout-section-title">💳 Payment Method</h3>
              <div className="divider" />
              <div className="payment-methods">
                {PAYMENT_METHODS.map(pm => (
                  <label
                    key={pm.id}
                    id={`payment-${pm.id}`}
                    className={`payment-option ${paymentMethod === pm.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      style={{ display: 'none' }}
                    />
                    <div className="payment-option-indicator" />
                    <div>
                      <div className="payment-option-label">{pm.label}</div>
                      <div className="payment-option-desc">{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary glass-card">
            <h3 className="cart-summary-title">Order Summary</h3>
            <div className="divider" />

            <div className="checkout-items">
              {items.map(item => (
                <div key={item.productId} className="checkout-item-row">
                  <span className="checkout-item-qty">×{item.quantity}</span>
                  <span className="checkout-item-id">{item.productId.slice(-8)}…</span>
                  <span className="checkout-item-sub">
                    {item.price ? `₹${(item.price * item.quantity).toFixed(2)}` : '—'}
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" />
            <div className="summary-row">
              <span>Items ({items.length})</span>
              <span>₹{roughTotal > 0 ? roughTotal.toFixed(2) : '—'}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="summary-free">FREE</span>
            </div>
            <div className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{roughTotal > 0 ? `₹${roughTotal.toFixed(2)}` : 'Calculated on order'}</span>
            </div>

            <button
              id="place-order-btn"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 'var(--space-6)' }}
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? '⏳ Placing Order...' : '✅ Place Order'}
            </button>

            <p className="checkout-disclaimer">
              By placing this order you agree to our terms. Your inventory is reserved at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
