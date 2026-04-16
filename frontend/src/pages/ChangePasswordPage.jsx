import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/context/AuthContext'
import { changePassword } from '../services/api'

export default function ChangePasswordPage() {
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Pré-remplir l'email avec celui de l'utilisateur connecté
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation frontend
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas')
      return
    }

    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (oldPassword === newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien')
      return
    }

    setLoading(true)
    try {
      // Appel au service API via api.js avec gestion JWT automatique
      await changePassword(email, oldPassword, newPassword)

      setSuccess('Mot de passe modifié avec succès!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Erreur changement de mot de passe:', error)
      
      // Gestion spécifique des codes d'erreur HTTP
      if (error.response?.status === 401) {
        // La redirection est gérée par l'interceptor axios
        setError('Session expirée. Veuillez vous reconnecter.')
      } else if (error.response?.status === 400) {
        // Erreur 400 - afficher le message du backend
        const errorMessage = error.response?.data?.message || 'Erreur lors du changement de mot de passe'
        setError(errorMessage)
      } else {
        setError(error.message || 'Erreur lors du changement de mot de passe')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Non autorisé</h2>
          <p>Veuillez vous connecter d'abord</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Changer mon mot de passe</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Modifiez votre mot de passe pour sécuriser votre compte
        </p>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', fontWeight: 500 }}>✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              disabled={loading}
              title="Cet email est pré-rempli automatiquement"
            />
          </div>

          <div className="form-group">
            <label>Ancien mot de passe</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Votre mot de passe actuel"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez le nouveau mot de passe"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Modification en cours...' : 'Modifier le mot de passe'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/dashboard" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>← Retour au tableau de bord</a>
        </p>
      </div>
    </div>
  )
}

