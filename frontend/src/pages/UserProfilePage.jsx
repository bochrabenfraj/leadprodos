import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function UserProfilePage() {
  const { user, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    if (!formData.username || !formData.email) {
      setError('Veuillez remplir tous les champs')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email
        })
      })

      let data
      try {
        data = await response.json()
      } catch {
        data = {}
      }

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}`)
      }

      setSuccessMessage('Profil mis à jour avec succès!')
      setIsEditing(false)
      
      // Mettre à jour le contexte avec les nouvelles infos
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Veuillez vous connecter</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#1f2937' }}>👤 Mon Profil</h1>

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{
          background: '#d1fae5',
          color: '#065f46',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem'
        }}>
          {successMessage}
        </div>
      )}

      {!isEditing ? (
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#6b7280' }}>
              Nom d'utilisateur
            </label>
            <p style={{ fontSize: '1.1rem', color: '#1f2937', margin: 0 }}>{user.username}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#6b7280' }}>
              Email
            </label>
            <p style={{ fontSize: '1.1rem', color: '#1f2937', margin: 0 }}>{user.email}</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#6b7280' }}>
              Rôle
            </label>
            <p style={{
              fontSize: '1.1rem',
              margin: 0,
              display: 'inline-block',
              backgroundColor: user.role === 'Admin' ? '#fee2e2' : '#d1fae5',
              color: user.role === 'Admin' ? '#991b1b' : '#065f46',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>
              {user.role}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              marginRight: '1rem'
            }}
          >
            ✏️ Éditer mon profil
          </button>

          <button
            onClick={() => window.location.href = '/change-password'}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🔑 Changer mot de passe
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#f9f9f9',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              marginRight: '1rem',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Enregistrement...' : '✅ Enregistrer les modifications'}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(false)}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            ❌ Annuler
          </button>
        </form>
      )}
    </div>
  )
}
