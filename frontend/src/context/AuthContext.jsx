import { createContext, useContext, useState, useEffect } from 'react'
import { userApi } from '../api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ebs_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const register = async (data) => {
    const res = await userApi.register(data)
    const newUser = res.data
    setUser(newUser)
    localStorage.setItem('ebs_user', JSON.stringify(newUser))
    toast.success(`Welcome, ${newUser.name}! 🎉`)
    return newUser
  }

  const login = async (email, password) => {
    const res = await userApi.login({ email, password })
    const loggedIn = res.data
    setUser(loggedIn)
    localStorage.setItem('ebs_user', JSON.stringify(loggedIn))
    toast.success(`Welcome back, ${loggedIn.name}!`)
    return loggedIn
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ebs_user')
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
