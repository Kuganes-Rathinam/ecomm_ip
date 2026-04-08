import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi, paymentApi } from '../api'
import './Dashboard.css'

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   cls: 'badge-warning' },
  SHIPPED:   { label: 'Shipped',   cls: 'badge-info'    },
  DELIVERED: { label: 'Delivered', cls: 'badge-success' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-danger'  },
}

const PAYMENT_CONFIG = {
  PAID:    { label: 'Paid',    cls: 'badge-success' },
  PENDING: { label: 'Pending', cls: 'badge-warning' },
  FAILED:  { label: 'Failed',  cls: 'badge-danger'  },
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [orders,   setOrders]   = useState([])
  const [payments, setPayments] = useState({}) // orderId → Payment
  const [loading,  setLoading]  = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    if (!user) return
    orderApi.getByUser(user.id)
      .then(async res => {
        const orders = res.data
        setOrders(orders)
        // Fetch payment for each order
        const paymentResults = await Promise.allSettled(
          orders.map(o => paymentApi.getByOrder(o.id))
        )
        const map = {}
        paymentResults.forEach((r, i) => {
          if (r.status === 'fulfilled') map[orders[i].id] = r.value.data
        })
        setPayments(map)
      })
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return (
    <div className="page-wrapper">
      <div className="container empty-state">
        <div className="empty-state-icon">🔐</div>
        <h3 className="empty-state-title">Please Login</h3>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    </div>
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Profile Header */}
        <div className="dashboard-header glass-card fade-in-up">
          <div className="dash-avatar">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="dash-user-info">
            <h1 className="dash-name">{user.name}</h1>
            <p className="dash-email">{user.email}</p>
            {user.phone && <p className="dash-meta">📞 {user.phone}</p>}
            {user.address && <p className="dash-meta">📍 {user.address}</p>}
          </div>
          <button
            id="dashboard-logout-btn"
            className="btn btn-secondary btn-sm"
            onClick={logout}
            style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          <button
            id="tab-orders"
            className={`dash-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 My Orders ({orders.length})
          </button>
          <button
            id="tab-profile"
            className={`dash-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          loading ? (
            <div className="spinner-wrapper"><div className="spinner" /></div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No orders yet</h3>
              <p className="empty-state-desc">Your order history will appear here</p>
              <Link to="/" className="btn btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => {
                const status  = STATUS_CONFIG[order.status]  || { label: order.status,  cls: 'badge-info' }
                const payment = payments[order.id]
                const pStatus = payment ? (PAYMENT_CONFIG[payment.paymentStatus] || { label: payment.paymentStatus, cls: 'badge-info' }) : null

                return (
                  <div key={order.id} className="order-card glass-card fade-in-up" id={`order-${order.id}`}>
                    <div className="order-card-header">
                      <div>
                        <p className="order-id">Order #{order.id?.slice(-10).toUpperCase()}</p>
                        <p className="order-date">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="order-badges">
                        <span className={`badge ${status.cls}`}>{status.label}</span>
                        {pStatus && (
                          <span className={`badge ${pStatus.cls}`}>{pStatus.label}</span>
                        )}
                      </div>
                    </div>

                    <div className="divider" />

                    {/* Order Items */}
                    <div className="order-items">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span className="order-item-qty">×{item.quantity}</span>
                          <span className="order-item-id">Product ID: {item.productId?.slice(-8)}…</span>
                          <span className="order-item-price">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="divider" />

                    <div className="order-card-footer">
                      <div className="order-payment-method">
                        {payment && (
                          <span className="order-meta">
                            💳 {payment.paymentMethod?.replace('_', ' ').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="order-total">
                        Total: <strong>₹{order.totalAmount?.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-card glass-card fade-in-up">
            <h3 className="checkout-section-title">Account Information</h3>
            <div className="divider" />
            <div className="profile-grid">
              <div className="profile-field">
                <span className="form-label">Full Name</span>
                <span className="profile-value">{user.name}</span>
              </div>
              <div className="profile-field">
                <span className="form-label">Email</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-field">
                <span className="form-label">Phone</span>
                <span className="profile-value">{user.phone || '—'}</span>
              </div>
              <div className="profile-field">
                <span className="form-label">Address</span>
                <span className="profile-value">{user.address || '—'}</span>
              </div>
              <div className="profile-field">
                <span className="form-label">User ID</span>
                <span className="profile-value profile-id">{user.id}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
