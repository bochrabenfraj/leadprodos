import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import apiClient from '../../services/api'

export const AuthContext = createContext()

// Client axios dédié pour l'authentification (sans redirection auto sur 401)
const authClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

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
      // Validation frontend
      if (!email || !password) {
        throw new Error('Email et mot de passe sont requis')
      }

      // POST /api/auth/login
      const response = await authClient.post('/auth/login', { email, password })

      const newToken = response.data.token

      localStorage.setItem('token', newToken)
      setToken(newToken)

      const decoded = JSON.parse(atob(newToken.split('.')[1]))
      setUser(decoded)

      return { success: true }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      
      // Gestion des codes d'erreur HTTP
      if (error.response?.status === 400) {
        // Validation échouée (champs vides ou invalides)
        return { success: false, error: error.response?.data?.message || 'Veuillez remplir tous les champs' }
      } else if (error.response?.status === 401) {
        // Authentification échouée (email not found ou password incorrect)
        return { success: false, error: error.response?.data?.message || 'Email ou mot de passe incorrect' }
      } else {
        return { success: false, error: error.message || 'Erreur de connexion' }
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password) => {
    setLoading(true)
    try {
      // POST /api/auth/register
      const response = await authClient.post('/auth/register', { username, email, password })

      const newToken = response.data.token

      localStorage.setItem('token', newToken)
      setToken(newToken)

      const decoded = JSON.parse(atob(newToken.split('.')[1]))
      setUser(decoded)

      return { success: true }
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      
      if (error.response?.status === 400) {
        return { success: false, error: error.response?.data?.message || 'Erreur lors de l\'inscription' }
      } else if (error.response?.status === 401) {
        return { success: false, error: error.response?.data?.message || 'Authentification échouée' }
      } else {
        return { success: false, error: error.message || 'Erreur lors de l\'inscription' }
      }
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
      // PUT /api/auth/change-password (utilise apiClient avec JWT auto)
      await apiClient.put('/auth/change-password', { email, oldPassword, newPassword })
      return { success: true }
    } catch (error) {
      console.error('Erreur changement de mot de passe:', error)
      return { success: false, error: error.message || 'Erreur lors du changement de mot de passe' }
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

