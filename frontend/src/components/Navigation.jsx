import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

export default function Navigation() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null // Ne pas afficher la navigation si non connecté
  }

  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">📊 Tableau de Bord</Link></li>
        <li><Link to="/products">📦 Produits</Link></li>
        <li><Link to="/clients">👥 Clients</Link></li>
        <li><Link to="/leads">🎯 Leads</Link></li>
        {user?.role === 'Admin' && (
          <>
            <li><Link to="/admin/categories">🏷️ Catégories</Link></li>
            <li><Link to="/users">⚙️ Utilisateurs</Link></li>
          </>
        )}
        <li style={{ marginLeft: 'auto' }}>
          <Link to="/profile" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>👤 Profil</Link>
          <Link to="/change-password" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>🔐 Changer mot de passe</Link>
          <span style={{ color: 'white', marginRight: '1rem' }}>👤 {user?.sub || 'Utilisateur'}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '1rem 0' }}>
            🚪 Déconnexion
          </button>
        </li>
      </ul>
    </nav>
  )
}
