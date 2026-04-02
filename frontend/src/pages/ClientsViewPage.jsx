import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function ClientsViewPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/clients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Erreur lors du chargement des clients')
      const data = await response.json()
      setClients(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>Chargement des clients...</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#1f2937', margin: 0 }}>Annuaire des Clients 👥</h1>
        <Link to="/clients/manage" style={{
          padding: '0.75rem 1.5rem',
          background: '#667eea',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 600
        }}>
          ⚙️ Gérer les clients
        </Link>
      </div>

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

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
      </div>

      {filteredClients.length === 0 ? (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          background: '#f9fafb',
          borderRadius: '8px',
          color: '#6b7280'
        }}>
          <p style={{ fontSize: '1.1rem' }}>Aucun client trouvé</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredClients.map(client => (
            <div
              key={client.id}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.1rem' }}>
                  {client.name}
                </h3>
                {client.company && (
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    📍 {client.company}
                  </p>
                )}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0861f2' }}>
                  <span>📧</span>
                  <a href={`mailto:${client.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {client.email}
                  </a>
                </div>
                {client.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                    <span>📱</span>
                    <a href={`tel:${client.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {client.phone}
                    </a>
                  </div>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.85rem' }}>Intérêt</p>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.5rem 0.75rem',
                    background: client.interestScore >= 70 ? '#d1fae5' : client.interestScore >= 40 ? '#fef3c7' : '#fee2e2',
                    color: client.interestScore >= 70 ? '#065f46' : client.interestScore >= 40 ? '#92400e' : '#991b1b',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}>
                    ⭐ {client.interestScore}/100
                  </span>
                </div>
                {client.socialMediaProfiles && (
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.85rem' }}>Réseaux</p>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>
                      {client.socialMediaProfiles}
                    </p>
                  </div>
                )}
              </div>

              <button style={{
                width: '100%',
                padding: '0.75rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                📞 Contacter
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
