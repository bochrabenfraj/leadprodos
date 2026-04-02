import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  // Récupérer les infos utilisateur au chargement
  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        setUser(decoded)
      } catch (error) {
        console.error('Token invalide')
        localStorage.removeItem('token')
        setToken(null)
      }
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion')
      }

      const newToken = data.token

      localStorage.setItem('token', newToken)
      setToken(newToken)

      const decoded = JSON.parse(atob(newToken.split('.')[1]))
      setUser(decoded)

      return { success: true }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription')
      }

      const newToken = data.token

      localStorage.setItem('token', newToken)
      setToken(newToken)

      const decoded = JSON.parse(atob(newToken.split('.')[1]))
      setUser(decoded)

      return { success: true }
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const changePassword = async (email, oldPassword, newPassword) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, oldPassword, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors du changement de mot de passe')
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur de changement de mot de passe:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}
