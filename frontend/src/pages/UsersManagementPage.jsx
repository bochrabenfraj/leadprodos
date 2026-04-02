import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function UsersManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User'
  })
  const [editingId, setEditingId] = useState(null)
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

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!formData.username || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création')
      }

      setSuccessMessage('Utilisateur créé avec succès!')
      setFormData({ username: '', email: '', password: '', role: 'User' })
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setSuccessMessage('Utilisateur supprimé avec succès!')
      fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/users/${id}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la modification')
      }

      setSuccessMessage(data.message)
      fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!formData.username || !formData.email) {
      setError('Veuillez remplir les champs requis')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const body = {
        username: formData.username,
        email: formData.email,
        role: formData.role
      }

      if (formData.password) {
        body.password = formData.password
      }

      const response = await fetch(`http://localhost:5000/api/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      try {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la modification')
        }
      } catch (e) {
        if (!response.ok) {
          throw new Error('Erreur lors de la modification')
        }
      }

      setSuccessMessage('Utilisateur modifié avec succès!')
      setEditingId(null)
      setFormData({ username: '', email: '', password: '', role: 'User' })
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const startEditUser = (usr) => {
    setEditingId(usr.id)
    setFormData({
      username: usr.username,
      email: usr.email,
      password: '',
      role: usr.role
    })
    setShowForm(true)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ username: '', email: '', password: '', role: 'User' })
    setShowForm(false)
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

  const activeUsersCount = users.filter(u => u.isActive).length
  const adminsCount = users.filter(u => u.role === 'Admin').length

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* ==== EN-TÊTE PROFESSIONNEL ==== */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: '800', color: '#1f2937' }}>
              👥 Gestion des Utilisateurs
            </h1>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '1rem', lineHeight: '1.5' }}>
              Gérez les comptes utilisateurs, les rôles, les permissions et l'accès à la plateforme
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <a 
              href="/reset-password"
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
            >
              🔐 Réinitialiser mot de passe
            </a>
            <button 
              onClick={() => editingId ? cancelEdit() : setShowForm(!showForm)}
              style={{
                backgroundColor: showForm ? '#ef4444' : '#10b981',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = showForm ? '#dc2626' : '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = showForm ? '#ef4444' : '#10b981'}
            >
              {showForm ? '❌ Annuler' : '➕ Nouvel utilisateur'}
            </button>
          </div>
        </div>

        {/* Messages d'erreur et succès */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            ❌ {error}
          </div>
        )}
        {successMessage && (
          <div style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            border: '1px solid #6ee7b7',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            ✅ {successMessage}
          </div>
        )}
      </div>

      {/* Formulaire de création/modification */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', color: '#1f2937' }}>
            {editingId ? '✏️ Modifier utilisateur' : '➕ Créer un nouvel utilisateur'}
          </h2>
          
          <form onSubmit={editingId ? handleEditUser : handleCreateUser}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Nom d'utilisateur <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="ex: john.doe"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ex: john@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Mot de passe {editingId ? '(optionnel pour modification)' : <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingId ? 'Laisser vide pour ne pas changer' : 'Entrez le mot de passe'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Rôle <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="User">👤 Utilisateur</option>
                  <option value="Admin">🔐 Administrateur</option>
                </select>
              </div>

              {/* Bouton Submit - span 2 colonnes */}
              <div style={{ gridColumn: '1 / -1' }}>
                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  {editingId ? '💾 Enregistrer les modifications' : '✅ Créer l\'utilisateur'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tableau des utilisateurs */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>#</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>👤 Nom d'utilisateur</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>✉️ Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>🏷️ Rôle</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>📊 Statut</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usr, index) => (
                <tr 
                  key={usr.id} 
                  style={{ 
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem', color: '#6b7280', fontWeight: '500' }}>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      {index + 1}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '500' }}>{usr.username}</td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{usr.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      backgroundColor: usr.role === 'Admin' ? '#fecaca' : '#bfdbfe',
                      color: usr.role === 'Admin' ? '#991b1b' : '#1e40af',
                      padding: '0.5rem 0.875rem',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      display: 'inline-block'
                    }}>
                      {usr.role === 'Admin' ? '🔐 Admin' : '👤 Utilisateur'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      backgroundColor: usr.isActive ? '#d1fae5' : '#fee2e2',
                      color: usr.isActive ? '#065f46' : '#991b1b',
                      padding: '0.5rem 0.875rem',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      display: 'inline-block'
                    }}>
                      {usr.isActive ? '✅ Actif' : '❌ Inactif'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => startEditUser(usr)}
                        title="Éditer l'utilisateur"
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleToggleStatus(usr.id, usr.isActive)}
                        title={usr.isActive ? 'Désactiver' : 'Activer'}
                        style={{
                          backgroundColor: usr.isActive ? '#ef4444' : '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = usr.isActive ? '#dc2626' : '#059669'}
                        onMouseOut={(e) => e.target.style.backgroundColor = usr.isActive ? '#ef4444' : '#10b981'}
                      >
                        {usr.isActive ? '⏸️ Désactiver' : '▶️ Activer'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(usr.id)}
                        title="Supprimer l'utilisateur"
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pas d'utilisateurs */}
      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <p style={{ fontSize: '1.1rem' }}>📭 Aucun utilisateur trouvé</p>
        </div>
      )}

      {/* Statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {/* Total Users */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            👥 Total Utilisateurs
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#3b82f6' }}>
            {users.length}
          </div>
        </div>

        {/* Active Users */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            ✅ Utilisateurs Actifs
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981' }}>
            {activeUsersCount}
          </div>
        </div>

        {/* Admins */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #ef4444'
        }}>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            🔐 Administrateurs
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ef4444' }}>
            {adminsCount}
          </div>
        </div>
      </div>
    </div>
  )
}
