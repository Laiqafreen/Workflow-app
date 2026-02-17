import { createContext, useContext, useState, useEffect } from "react"
import authService from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData.data)
        } catch (error) {
          console.error("Token validation failed:", error)
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      if (data.token) {
        setUser(data.user)
      }
      return data
    } catch (error) {
      throw error
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password)
      if (data.token) {
        setUser(data.user)
      }
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    window.location.href = "/"
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
