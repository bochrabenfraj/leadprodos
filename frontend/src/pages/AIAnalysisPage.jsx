import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/context/AuthContext'
import { api } from '../services/api'

export default function AIAnalysisPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [error, setError] = useState('')
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Charger les produits au montage
  useEffect(() => {
    if (!user || user.role !== 'Commercial') {
      navigate('/')
      return
    }
    
    loadProducts()
  }, [user, navigate])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Récupérer tous les produits
      const response = await api.get('/api/products')
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err)
      setError('Impossible de charger les produits')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeProduct = async () => {
    if (!selectedProduct) {
      setError('Veuillez sélectionner un produit')
      return
    }

    try {
      setAnalyzing(true)
      setError('')
      setAnalysisResults(null)

      // Récupérer les clients
      const clientsResponse = await api.get('/api/clients')
      const clients = clientsResponse.data || []

      // Préparer les données pour l'analyse
      const analysisRequest = {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        clients: clients.map(client => ({
          id: client.id,
          name: client.name,
          email: client.email,
          features: generateClientFeatures(client),
          social_media_text: client.description || client.name
        }))
      }

      // Appeler l'endpoint d'analyse IA
      const response = await api.post('/api/AIAnalysis/analyze-product-clients', analysisRequest)
      
      setAnalysisResults(response.data)
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err)
      setError(err.response?.data?.message || 'Erreur lors de l\'analyse IA')
    } finally {
      setAnalyzing(false)
    }
  }

  // Générer les features pour un client (simulation)
  const generateClientFeatures = (client) => {
    // Dans une vraie application, ces features proviendraient de la base de données
    // ou d'un service d'extraction de features
    return [
      Math.random() * 1000,     // Budget
      Math.random(),             // Taux de conversion
      Math.random(),             // Engagement
      Math.random() * 5,         // Nombre de contacts
      Math.random()              // Score de confiance
    ]
  }

  const getScoreColor = (score) => {
    if (score >= 0.8) return { bg: 'bg-green-100', text: 'text-green-900', border: 'border-green-300' }
    if (score >= 0.6) return { bg: 'bg-yellow-100', text: 'text-yellow-900', border: 'border-yellow-300' }
    return { bg: 'bg-red-100', text: 'text-red-900', border: 'border-red-300' }
  }

  const getScoreBadge = (score) => {
    const colors = getScoreColor(score)
    return (
      <div className={`${colors.bg} ${colors.text} px-4 py-2 rounded-lg font-bold text-lg border ${colors.border}`}>
        {(score * 100).toFixed(1)}%
      </div>
    )
  }

  const handleContactClient = (client) => {
    navigate(`/contact/${client.id}`, { state: { client, product: selectedProduct } })
  }

  const handleViewProfile = (client) => {
    navigate(`/clients/${client.id}`)
  }

  const handleCreateLead = (client) => {
    navigate(`/create-lead`, { state: { client, product: selectedProduct } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🤖 Analyse IA Clients
          </h1>
          <p className="text-gray-600 text-lg">
            Découvrez les clients potentiels pour vos produits avec l'intelligence artificielle
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Sélection du produit */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Étape 1 : Sélectionnez un produit</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Chargement des produits...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedProduct?.id === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  {product.price && (
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      {product.price.toFixed(2)} €
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aucun produit disponible</p>
          )}

          <button
            onClick={handleAnalyzeProduct}
            disabled={!selectedProduct || analyzing}
            className={`mt-6 px-8 py-3 rounded-lg font-bold text-white transition-all ${
              selectedProduct && !analyzing
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {analyzing ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Analyse en cours...
              </>
            ) : (
              '🚀 Analyser les clients'
            )}
          </button>
        </div>

        {/* Résultats */}
        {analysisResults && (
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Résultats d'analyse : {analysisResults.product_name}
              </h2>
              <p className="text-gray-600 mb-6">
                {analysisResults.total_analyzed} clients analysés • Classés par score de pertinence
              </p>

              {analysisResults.analyzed_clients && analysisResults.analyzed_clients.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analysisResults.analyzed_clients.map((client, idx) => (
                    <div key={idx} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      {/* En-tête avec score */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                          {client.email && (
                            <p className="text-sm text-gray-600">{client.email}</p>
                          )}
                        </div>
                        {getScoreBadge(client.score)}
                      </div>

                      {/* Cluster et Confiance */}
                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Cluster</p>
                          <p className="text-lg font-bold text-gray-900">#{client.cluster}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Confiance</p>
                          <p className="text-lg font-bold text-gray-900">{(client.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Mots-clés */}
                      {client.keywords && client.keywords.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Mots-clés extraits</p>
                          <div className="flex flex-wrap gap-2">
                            {client.keywords.map((kw, i) => (
                              <span key={i} className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-sm">
                                {kw.keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Boutons d'action */}
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleContactClient(client)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded font-semibold text-sm transition-colors"
                        >
                          📞 Contacter
                        </button>
                        <button
                          onClick={() => handleViewProfile(client)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded font-semibold text-sm transition-colors"
                        >
                          👤 Profil
                        </button>
                        <button
                          onClick={() => handleCreateLead(client)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded font-semibold text-sm transition-colors"
                        >
                          ✨ Lead
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">Aucun client analysé</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

