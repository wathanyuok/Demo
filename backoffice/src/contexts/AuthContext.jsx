// middileware ดัก Token Fronetend

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/backoffice/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/backoffice/auth/login', {
        email,
        password
      })
      const { token: newToken, user: userData } = response.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}