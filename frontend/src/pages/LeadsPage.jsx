import { useState, useEffect } from 'react'
import { getLeads, analyzeLeads } from '../services/api'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [productId, setProductId] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      const response = await getLeads()
      setLeads(response.data || [])
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!productId) {
      alert('Veuillez sélectionner un produit')
      return
    }

    setAnalyzing(true)
    try {
      const response = await analyzeLeads({ productId: parseInt(productId) })
      console.log('Analysis results:', response.data)
      alert('Analyse complète! Vérifiez la console pour les résultats.')
      loadLeads()
    } catch (error) {
      console.error('Error analyzing leads:', error)
      alert('Erreur lors de l\'analyse')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="container">
      <h2>Gestion des Leads & Analyse IA</h2>
      
      <form onSubmit={handleAnalyze} style={{ marginBottom: '2rem' }}>
        <label>ID du Produit à Analyser</label>
        <input
          type="number"
          required
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Entrez l'ID du produit"
        />
        <button type="submit" disabled={analyzing}>
          {analyzing ? 'Analyse en cours...' : '🤖 Analyser les Leads'}
        </button>
      </form>

      {loading ? (
        <p>Chargement des leads...</p>
      ) : leads.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID Client</th>
              <th>ID Produit</th>
              <th>Statut</th>
              <th>Score Match</th>
              <th>Créé le</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.clientId}</td>
                <td>{lead.productId}</td>
                <td>{lead.status}</td>
                <td>{(lead.matchScore * 100).toFixed(1)}%</td>
                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun lead trouvé. Lancez une analyse IA pour en générer.</p>
      )}
    </div>
  )
}
