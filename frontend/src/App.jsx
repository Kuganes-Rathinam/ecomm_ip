import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider }          from './context/CartContext'
import Navbar     from './components/Navbar'
import Home       from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart       from './pages/Cart'
import Checkout   from './pages/Checkout'
import Dashboard  from './pages/Dashboard'
import Login      from './pages/Login'
import Register   from './pages/Register'

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>
  return user ? children : <Navigate to="/login" replace />
}

/**
 * AppShell — needs AuthContext (provided by AuthProvider above it).
 * CartProvider must be inside AuthProvider because it reads useAuth().
 */
function AppShell() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/"                   element={<Home />} />
        <Route path="/products/:slug"     element={<ProductDetail />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />

        {/* Protected Routes */}
        <Route path="/cart"       element={
          <ProtectedRoute><Cart /></ProtectedRoute>
        } />
        <Route path="/checkout"   element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="/dashboard"  element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
