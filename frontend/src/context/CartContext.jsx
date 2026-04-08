import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartApi } from '../api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart]       = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return }
    setLoading(true)
    try {
      const res = await cartApi.getCart(user.id)
      setCart(res.data)
    } catch {
      // Cart not found — will be created on first add
    } finally {
      setLoading(false)
    }
  }, [user])

  // Reload cart whenever user changes
  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return }
    try {
      const res = await cartApi.addItem(user.id, productId, quantity)
      setCart(res.data)
      toast.success('Added to cart! 🛒')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart')
    }
  }

  const removeItem = async (productId) => {
    if (!user) return
    try {
      const res = await cartApi.removeItem(user.id, productId)
      setCart(res.data)
      toast.success('Item removed')
    } catch {
      toast.error('Could not remove item')
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (!user) return
    try {
      const res = await cartApi.updateItem(user.id, productId, quantity)
      setCart(res.data)
    } catch {
      toast.error('Could not update quantity')
    }
  }

  const clearCart = async () => {
    if (!user) return
    try {
      await cartApi.clearCart(user.id)
      setCart(prev => prev ? { ...prev, items: [] } : null)
    } catch {
      toast.error('Could not clear cart')
    }
  }

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  return (
    <CartContext.Provider value={{
      cart, loading, itemCount,
      addItem, removeItem, updateQuantity, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
