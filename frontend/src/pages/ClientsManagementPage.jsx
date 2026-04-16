import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../components/context/AuthContext'
import { getClients, createClient, updateClient, deleteClient } from '../services/api'

export default function ClientsManagementPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    socialMediaProfiles: '',
    interestScore: '0'
  })
  const { user, loading: authLoading } = useContext(AuthContext)

  useEffect(() => {
    if (!authLoading && user) {
      fetchClients()
    }
  }, [authLoading, user])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await getClients()
      setClients(response.data || [])
      setError('')
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des clients')
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
      
      if (!formData.name || !formData.email) {
        setError('Veuillez remplir les champs obligatoires')
        return
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        company: formData.company || '',
        socialMediaProfiles: formData.socialMediaProfiles || '',
        interestScore: parseInt(formData.interestScore) || 0
      }

      console.log('📤 Envoi du payload:', payload)
      console.log('📝 Mode:', editingId ? 'Modification' : 'Création')
      
      if (editingId) {
        console.log(`🔄 Modification du client ${editingId}`)
        await updateClient(editingId, payload)
      } else {
        console.log('✨ Création d\'un nouveau client')
        await createClient(payload)
      }

      console.log('✅ Succès!')
      fetchClients()
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', email: '', phone: '', company: '', socialMediaProfiles: '', interestScore: '0' })
      setError('')
    } catch (err) {
      console.error('❌ Erreur complète:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Erreur lors de l\'enregistrement'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (client) => {
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      socialMediaProfiles: client.socialMediaProfiles || '',
      interestScore: String(client.interestScore || '0')
    })
    setEditingId(client.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    setConfirmAction({ type: 'delete-client', id, name: clients.find(c => c.id === id)?.name })
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    try {
      setLoading(true)
      await deleteClient(confirmAction.id)
      fetchClients()
      setError('')
      setShowConfirmModal(false)
      setConfirmAction(null)
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAction = () => {
    setShowConfirmModal(false)
    setConfirmAction(null)
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', company: '', socialMediaProfiles: '', interestScore: '0' })
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
        <p>Seul l'administrateur peut gérer les clients.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#1f2937' }}>Gestion des Clients 👥</h1>

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
              Êtes-vous sûr de vouloir supprimer le client <strong>{confirmAction?.name}</strong> ? Cette action est irréversible.
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
        {showForm ? 'Annuler' : '+ Ajouter un client'}
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
            {editingId ? 'Modifier le client' : 'Nouveau client'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                  Nom du client *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Ahmed Gharbi"
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
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemple.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+216 20 123 456"
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
                  Entreprise
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Ex: Acme Corp"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                Profils Réseaux Sociaux
              </label>
              <input
                type="text"
                name="socialMediaProfiles"
                value={formData.socialMediaProfiles}
                onChange={handleInputChange}
                placeholder="LinkedIn, Twitter, etc."
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
                Score d'Intérêt (0-100)
              </label>
              <input
                type="number"
                name="interestScore"
                value={formData.interestScore}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                max="100"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  marginBottom: '1rem'
                }}
              />
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
              {loading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer le client'}
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
        {clients.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Aucun client enregistré. Créez votre premier client !
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Nom</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Entreprise</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Score</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ fontWeight: 600, color: '#1f2937' }}>{client.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{client.phone}</div>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#0861f2' }}>
                    <a href={`mailto:${client.email}`} style={{ textDecoration: 'none' }}>
                      {client.email}
                    </a>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ color: '#6b7280' }}>{client.company || 'N/A'}</span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: client.interestScore >= 70 ? '#d1fae5' : client.interestScore >= 40 ? '#fef3c7' : '#fee2e2',
                      color: client.interestScore >= 70 ? '#065f46' : client.interestScore >= 40 ? '#92400e' : '#991b1b',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>
                      {client.interestScore}/100
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(client)}
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
                      onClick={() => handleDelete(client.id)}
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

