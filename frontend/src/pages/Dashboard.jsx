import { useState, useEffect } from 'react'
import { getProducts, getClients, getLeads } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    clients: 0,
    leads: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [productsRes, clientsRes, leadsRes] = await Promise.all([
        getProducts(),
        getClients(),
        getLeads()
      ])
      
      setStats({
        products: productsRes.data?.length || 0,
        clients: clientsRes.data?.length || 0,
        leads: leadsRes.data?.length || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Tableau de Bord</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div className="card">
            <h3>📦 Produits</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.products}</p>
          </div>
          <div className="card">
            <h3>👥 Clients</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.clients}</p>
          </div>
          <div className="card">
            <h3>🎯 Leads</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.leads}</p>
          </div>
        </div>
      )}
    </div>
  )
}
