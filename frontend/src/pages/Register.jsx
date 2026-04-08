import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]       = useState({
    name: '', email: '', password: '', phone: '', address: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email, and password are required')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />

      <div className="auth-card auth-card-wide glass-card fade-in-up">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span>⚡</span>
            <span>EBS Store</span>
          </Link>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Join thousands of shoppers — it's free and takes under a minute
          </p>
        </div>

        {/* Form */}
        <form id="register-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-two-col">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name *</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address *</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password * (min 6 chars)</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-two-col">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number</label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="+91 XXXXXXXXXX"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-address">Address</label>
              <input
                id="reg-address"
                name="address"
                type="text"
                className="form-input"
                placeholder="City, State"
                value={form.address}
                onChange={handleChange}
                autoComplete="street-address"
              />
            </div>
          </div>

          {/* Password strength visual */}
          {form.password.length > 0 && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className={`strength-fill strength-${
                    form.password.length < 6 ? 'weak' :
                    form.password.length < 10 ? 'medium' : 'strong'
                  }`}
                  style={{
                    width: `${Math.min(100, (form.password.length / 12) * 100)}%`
                  }}
                />
              </div>
              <span className="strength-label">
                {form.password.length < 6 ? '🔴 Too short' :
                 form.password.length < 10 ? '🟡 Fair' : '🟢 Strong'}
              </span>
            </div>
          )}

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading ? '⏳ Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" id="go-login-link" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
