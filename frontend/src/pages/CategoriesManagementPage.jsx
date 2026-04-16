import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../components/context/AuthContext'

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#667eea',
    icon: '📦'
  })
  const { user, loading: authLoading } = useContext(AuthContext)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Erreur lors du chargement des catégories')
      const data = await response.json()
      setCategories(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!formData.name) {
        setError('Veuillez remplir le champ nom')
        return
      }

      const payload = {
        name: formData.name,
        description: formData.description || '',
        color: formData.color || '#667eea',
        icon: formData.icon || '📦'
      }

      const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: `Erreur ${response.status}` }
        }
        throw new Error(errorData.message || 'Erreur lors de l\'enregistrement')
      }

      fetchCategories()
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', description: '', color: '#667eea', icon: '📦' })
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#667eea',
      icon: category.icon || '📦'
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    setConfirmAction({ type: 'delete-category', id, name: categories.find(c => c.id === id)?.name })
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/categories/${confirmAction.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: `Erreur ${response.status}` }
        }
        throw new Error(errorData.message || 'Erreur lors de la suppression')
      }
      fetchCategories()
      setError('')
      setShowConfirmModal(false)
      setConfirmAction(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAction = () => {
    setShowConfirmModal(false)
    setConfirmAction(null)
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#667eea', icon: '📦' })
    setEditingId(null)
    setShowForm(false)
  }

  if (authLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>

  if (!user || user.role !== 'Admin') {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        color: '#991b1b',
        background: '#fee2e2',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '3rem auto',
        border: '2px solid #fca5a5'
      }}>
        <h2>❌ Accès Refusé</h2>
        <p>Seul l'administrateur peut gérer les catégories.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#1f2937' }}>Gestion des Catégories 📂</h1>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginTop: 0, color: '#1f2937', marginBottom: '1rem' }}>Confirmer la suppression</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Êtes-vous sûr de vouloir supprimer la catégorie <strong>{confirmAction?.name}</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelAction}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: loading ? '#d1d5db' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          border: '1px solid #fca5a5'
        }}>
          {error}
        </div>
      )}

      <button
        onClick={() => !showForm ? setShowForm(true) : resetForm()}
        style={{
          padding: '0.75rem 1.5rem',
          background: showForm ? '#ef4444' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        {showForm ? 'Annuler' : '+ Ajouter une catégorie'}
      </button>

      {showForm && (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#1f2937', fontSize: '1.25rem' }}>
            {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Électronique"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                  Icône
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="📦">📦 Boîte (défaut)</option>
                  <option value="📱">📱 Smartphone</option>
                  <option value="📺">📺 Téléviseur</option>
                  <option value="🔊">🔊 Audio</option>
                  <option value="💻">💻 Ordinateur</option>
                  <option value="⌚">⌚ Montre</option>
                  <option value="🚁">🚁 Drone</option>
                  <option value="📷">📷 Caméra</option>
                  <option value="🔌">🔌 Électronique</option>
                  <option value="⚙️">⚙️ Composants</option>
                  <option value="🌐">🌐 IoT</option>
                  <option value="🔧">🔧 Outils</option>
                  <option value="🤖">🤖 Robot</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description de la catégorie"
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                Couleur
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={formData.color}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    background: '#f9fafb'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: loading ? '#d1d5db' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer la catégorie'}
            </button>
          </form>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {categories.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Aucune catégorie enregistrée. Créez votre première catégorie !
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Icône</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Nom</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Couleur</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontSize: '1.5rem' }}>
                    {category.icon}
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#1f2937' }}>
                    {category.name}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    {category.description || 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      background: category.color,
                      borderRadius: '4px',
                      margin: '0 auto',
                      border: '1px solid #d1d5db'
                    }}></div>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(category)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

