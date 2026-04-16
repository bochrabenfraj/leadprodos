import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../components/context/AuthContext'
import { getLeads } from '../services/api'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all, prospect, contact, qualified, converted
  const [scoreFilter, setScoreFilter] = useState('all') // all, high, medium, low
  const [sortBy, setSortBy] = useState('date') // date, score, name
  const { user } = useContext(AuthContext)

  useEffect(() => {
    console.log('🔄 Montage de LeadsPage...')
    const token = localStorage.getItem('token')
    console.log('🔐 Token présent?', !!token)
    fetchLeads()
  }, [])

  // Filter and sort leads whenever filters change
  useEffect(() => {
    applyFilters()
  }, [leads, searchTerm, statusFilter, scoreFilter, sortBy])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      console.log('🔄 Appel GET /api/leads...')
      const response = await getLeads()
      console.log('✅ Réponse reçue:', response)
      console.log('📥 Leads reçus:', response.data)
      setLeads(response.data || [])
      setError('')
    } catch (err) {
      console.error('❌ Erreur getLeads:', err)
      console.error('   Response:', err.response)
      console.error('   Message:', err.message)
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors du chargement des prospects'
      setError(errorMsg)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...leads]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        (lead.clientId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.productId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.status?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter - case insensitive
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status?.toLowerCase() === statusFilter.toLowerCase())
    }

    // Score filter
    if (scoreFilter !== 'all') {
      const getScore = lead => lead.matchScore || 0
      if (scoreFilter === 'high') {
        filtered = filtered.filter(lead => getScore(lead) >= 70)
      } else if (scoreFilter === 'medium') {
        filtered = filtered.filter(lead => getScore(lead) >= 40 && getScore(lead) < 70)
      } else if (scoreFilter === 'low') {
        filtered = filtered.filter(lead => getScore(lead) < 40)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'score') {
        return (b.matchScore || 0) - (a.matchScore || 0)
      } else if (sortBy === 'name') {
        return (a.clientId || '').localeCompare(b.clientId || '')
      } else {
        // date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    setFilteredLeads(filtered)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'prospect': { color: '#6b7280', label: '🔍 Prospect' },
      'contact': { color: '#f59e0b', label: '📞 Contact' },
      'qualified': { color: '#10b981', label: '✅ Qualifié' },
      'converted': { color: '#3b82f6', label: '🎉 Converti' }
    }
    const config = statusConfig[(status || '').toLowerCase()] || { color: '#6b7280', label: '❓ ' + (status || 'Inconnu') }
    return (
      <span style={{
        background: config.color,
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: 600
      }}>
        {config.label}
      </span>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981'
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>Chargement des prospects...</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '2rem' }}>🎯 Prospects & Leads</h1>

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

      {/* Search Bar + Filter Button */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par ID client, ID produit ou statut..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '2px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={() => applyFilters()}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'background-color 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          🔍 Filtrer
        </button>
      </div>

      {/* Filters Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        {/* Status Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
            📊 Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="prospect">🔍 Prospect</option>
            <option value="contact">📞 Contact</option>
            <option value="qualified">✅ Qualifié</option>
            <option value="converted">🎉 Converti</option>
          </select>
        </div>

        {/* Score Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
            ⭐ Score de match
          </label>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">Tous les scores</option>
            <option value="high">🟢 Excellent (≥70%)</option>
            <option value="medium">🟡 Bon (40-69%)</option>
            <option value="low">🔴 Faible (&lt;40%)</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
            🔄 Trier par
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <option value="date">📅 Plus récent</option>
            <option value="score">⭐ Score (décroissant)</option>
            <option value="name">👤 Nom (A-Z)</option>
          </select>
        </div>

        {/* Results Count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          padding: '0.5rem'
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
            📈 {filteredLeads.length} prospect{filteredLeads.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Results Table */}
      {filteredLeads.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6b7280',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>😴 Aucun prospect trouvé</p>
          <p style={{ fontSize: '0.9rem' }}>Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>ID Client</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>ID Produit</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>Statut</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>Score</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>Détails</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#1f2937' }}>
                    {lead.clientId || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>
                    {lead.productId || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>
                    {getStatusBadge(lead.status || 'prospect')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-block',
                      background: getScoreColor(lead.matchScore || 0),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {lead.matchScore || 0}%
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'left', color: '#6b7280', fontSize: '0.85rem' }}>
                    {lead.analysisDetails || 'Aucun détail'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

