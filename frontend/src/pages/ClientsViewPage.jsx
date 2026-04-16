import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../components/context/AuthContext'
import { Link } from 'react-router-dom'
import { searchClients, getClients } from '../services/api'

export default function ClientsViewPage() {
  const [clients, setClients] = useState([])
  const [allClients, setAllClients] = useState([]) // Store all clients for company extraction
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [scoreFilter, setScoreFilter] = useState('all') // 'all', 'high', 'medium', 'low'
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchAllClients() // Fetch all to get companies list
  }, [])

  // Refetch when filters change
  useEffect(() => {
    // Only search if filters are actually applied
    if (searchTerm || selectedCompanies.length > 0 || scoreFilter !== 'all') {
      performSearch()
    } else {
      // Reset to show all clients from allClients if no filters
      setClients(allClients)
      setError('')
    }
  }, [searchTerm, selectedCompanies, scoreFilter, allClients])

  const fetchAllClients = async () => {
    try {
      setLoading(true)
      const response = await getClients()
      setAllClients(response.data || [])
      setClients(response.data || [])
      setError('')
    } catch (err) {
      console.error('Error loading clients:', err)
      setError(err.message || 'Erreur lors du chargement des clients')
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async () => {
    try {
      setLoading(true)
      
      // Calculate score range from filter
      let minScore = undefined
      let maxScore = undefined
      
      if (scoreFilter === 'high') {
        minScore = 70
      } else if (scoreFilter === 'medium') {
        minScore = 40
        maxScore = 69
      } else if (scoreFilter === 'low') {
        maxScore = 39
      }

      // Prepare company filter
      const companyFilter = selectedCompanies.length > 0 
        ? selectedCompanies[0] // Single selection for API
        : ''

      const response = await searchClients(
        searchTerm,
        companyFilter,
        minScore,
        maxScore
      )
      
      setClients(response.data || [])
      setError('')
    } catch (err) {
      setError(err.message || 'Erreur lors de la recherche')
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  // Get unique companies
  const companies = [...new Set(allClients.map(c => c.company || 'Non spécifié'))]

  const toggleCompany = (company) => {
    setSelectedCompanies(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [company] // Only one company at a time for API
    )
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>Chargement des clients...</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#1f2937', margin: 0 }}>Annuaire des Clients 👥</h1>
        {user && user.role === 'Admin' && (
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
        )}
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
          placeholder="🔍 Rechercher un client (nom, email, téléphone)..."
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

      {/* Filters Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        {/* Company Filter */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '0.95rem', fontWeight: 600 }}>
            🏢 Entreprises
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {companies.length > 0 ? (
              companies.map(company => (
                <button
                  key={company}
                  onClick={() => toggleCompany(company)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedCompanies.includes(company) ? '#667eea' : '#e5e7eb',
                    color: selectedCompanies.includes(company) ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {company}
                </button>
              ))
            ) : (
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Aucune entreprise disponible</span>
            )}
          </div>
        </div>

        {/* Interest Score Filter */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '0.95rem', fontWeight: 600 }}>
            ⭐ Score d'Intérêt
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { value: 'all', label: 'Tous les clients' },
              { value: 'high', label: '🔥 Très intéressés (70+)' },
              { value: 'medium', label: '👍 Intéressés (40-69)' },
              { value: 'low', label: '⏳ Peu intéressés (<40)' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setScoreFilter(option.value)}
                style={{
                  padding: '0.5rem 1rem',
                  background: scoreFilter === option.value ? '#667eea' : '#e5e7eb',
                  color: scoreFilter === option.value ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {clients.length === 0 ? (
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
          {clients.map(client => (
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

