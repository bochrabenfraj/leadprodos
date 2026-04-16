import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../components/context/AuthContext'

export default function AdminResetPasswordPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs')
      }

      const data = await response.json()
      setUsers(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!selectedUserId || !newPassword) {
      setError('Veuillez sélectionner un utilisateur et entrer un nouveau mot de passe')
      return
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUserId,
          newPassword: newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la réinitialisation du mot de passe')
      }

      setSuccessMessage(data.message || 'Mot de passe réinitialisé avec succès!')
      setSelectedUserId('')
      setNewPassword('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (user?.role !== 'Admin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Accès refusé</h2>
        <p>Seuls les administrateurs peuvent accéder à cette page</p>
      </div>
    )
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Réinitialiser mot de passe utilisateur</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        En tant qu'administrateur, vous pouvez réinitialiser le mot de passe de n'importe quel utilisateur.
      </p>

      {error && <div className="auth-error">{error}</div>}
      {successMessage && <div style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>{successMessage}</div>}

      <form onSubmit={handleResetPassword} style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '6px' }}>
        <div className="form-group">
          <label htmlFor="user-select">Sélectionner un utilisateur</label>
          <select
            id="user-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          >
            <option value="">-- Sélectionner un utilisateur --</option>
            {users.map((usr) => (
              <option key={usr.id} value={usr.id}>
                {usr.username} ({usr.email}) - {usr.role}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            id="password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Au moins 6 caractères"
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

        <div style={{ 
          backgroundColor: '#fef3c7', 
          color: '#92400e', 
          padding: '1rem', 
          borderRadius: '6px', 
          marginBottom: '1.5rem',
          border: '1px solid #fcd34d'
        }}>
          <strong>⚠️ Attention:</strong> Cela remplacera le mot de passe existant de l'utilisateur.
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          Réinitialiser le mot de passe
        </button>
      </form>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
        <h3 style={{ marginTop: '0' }}>Liste des utilisateurs</h3>
        <ul style={{ listStylePosition: 'inside', color: '#6b7280' }}>
          {users.map((usr) => (
            <li key={usr.id}>
              <strong>{usr.username}</strong> - {usr.email} ({usr.role})
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

