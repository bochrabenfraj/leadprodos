import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/context/AuthContext'
import { api } from '../services/api'
import { colors } from '../styles/colorPalette'

export default function AIAnalysisPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    topScore: 0,
    avgScore: 0
  })
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [user])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data || [])
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeProduct = async () => {
    if (!selectedProduct) return
    try {
      setAnalyzing(true)
      setError('')
      const response = await api.post('/AIAnalysis/analyze-product-clients', {
        productId: selectedProduct.id
      })
      const results = response.data
      setAnalysisResults(results.clients || [])
      setStats({
        totalAnalyzed: results.clients?.length || 0,
        topScore: Math.max(...(results.clients?.map(c => c.score) || [0])),
        avgScore: results.clients?.length > 0 
          ? results.clients.reduce((sum, c) => sum + c.score, 0) / results.clients.length 
          : 0
      })
    } catch (err) {
      console.error('Error analyzing:', err)
      setError('Failed to analyze product-client matches')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return colors.success
    if (score >= 60) return colors.warning
    return colors.error
  }

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: colors.darkBg,
    padding: '20px',
    color: colors.text
  }

  const headerStyle = {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: `2px solid ${colors.primary}`
  }

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.primary,
    margin: 0
  }

  const subtitleStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '5px'
  }

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.text,
    marginBottom: '15px',
    marginTop: '30px'
  }

  const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  }

  const productCardStyle = (isSelected) => ({
    padding: '15px',
    backgroundColor: isSelected ? colors.primary : colors.darkBgAlt,
    border: `2px solid ${isSelected ? colors.primary : colors.darkBgAlt}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: isSelected ? colors.darkBg : colors.text
  })

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: colors.secondary,
    color: colors.darkBg,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  }

  const statCardStyle = (borderColor) => ({
    backgroundColor: colors.darkBgAlt,
    borderLeft: `4px solid ${borderColor}`,
    padding: '20px',
    borderRadius: '6px',
    marginBottom: '15px'
  })

  const statLabelStyle = {
    fontSize: '12px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: '5px'
  }

  const statValueStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.text
  }

  const clientGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '15px'
  }

  const clientCardStyle = {
    backgroundColor: colors.darkBgAlt,
    padding: '20px',
    borderRadius: '8px',
    color: colors.text
  }

  const scoreBadgeStyle = (score) => ({
    display: 'inline-block',
    backgroundColor: getScoreColor(score),
    color: colors.darkBg,
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '8px'
  })

  const tagsContainerStyle = {
    marginTop: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  }

  const tagStyle = {
    backgroundColor: colors.primary,
    color: colors.darkBg,
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600'
  }

  const actionButtonsStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  }

  const contactButtonStyle = {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: colors.blue,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  }

  const createLeadButtonStyle = {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: colors.success,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🎯 Analyse IA</h1>
        <p style={subtitleStyle}>Analysez les correspondances produit-client avec l'IA</p>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: colors.error + '20', 
          color: colors.error, 
          padding: '15px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div>
        <h2 style={sectionTitleStyle}>Sélectionnez un produit</h2>
        {loading ? (
          <p>Chargement des produits...</p>
        ) : (
          <>
            <div style={productGridStyle}>
              {products.map(product => (
                <div
                  key={product.id}
                  style={productCardStyle(selectedProduct?.id === product.id)}
                  onClick={() => setSelectedProduct(product)}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <strong>{product.name}</strong>
                  <p style={{ fontSize: '12px', color: selectedProduct?.id === product.id ? 'inherit' : '#9ca3af', margin: '8px 0 0 0' }}>
                    {product.category}
                  </p>
                </div>
              ))}
            </div>
            <button 
              style={{...buttonStyle, opacity: selectedProduct ? 1 : 0.5, cursor: selectedProduct ? 'pointer' : 'not-allowed'}}
              onClick={handleAnalyzeProduct}
              disabled={!selectedProduct || analyzing}
            >
              {analyzing ? '⏳ Analyse en cours...' : '🔍 Analyser les Clients'}
            </button>
          </>
        )}
      </div>

      {analysisResults && analysisResults.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Statistiques</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div style={statCardStyle(colors.primary)}>
              <div style={statLabelStyle}>Total Analysé</div>
              <div style={statValueStyle}>{stats.totalAnalyzed}</div>
            </div>
            <div style={statCardStyle(colors.success)}>
              <div style={statLabelStyle}>Meilleur Score</div>
              <div style={statValueStyle}>{stats.topScore.toFixed(0)}%</div>
            </div>
            <div style={statCardStyle(colors.warning)}>
              <div style={statLabelStyle}>Score Moyen</div>
              <div style={statValueStyle}>{stats.avgScore.toFixed(0)}%</div>
            </div>
          </div>

          <h2 style={sectionTitleStyle}>Résultats</h2>
          <div style={clientGridStyle}>
            {analysisResults.map((client, idx) => (
              <div key={idx} style={clientCardStyle}>
                <div>
                  <strong style={{ fontSize: '16px' }}>{client.name}</strong>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                    {client.email}
                  </p>
                </div>
                <div style={scoreBadgeStyle(client.score)}>
                  Score: {client.score.toFixed(0)}%
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
                  <div>Cluster: <span style={{ color: colors.primary, fontWeight: 'bold' }}>{client.cluster}</span></div>
                  <div>Confiance: <span style={{ color: colors.success, fontWeight: 'bold' }}>{(client.confidence * 100).toFixed(0)}%</span></div>
                </div>
                {client.keywords && client.keywords.length > 0 && (
                  <div style={tagsContainerStyle}>
                    {client.keywords.slice(0, 3).map((keyword, i) => (
                      <span key={i} style={tagStyle}>{keyword}</span>
                    ))}
                  </div>
                )}
                <div style={actionButtonsStyle}>
                  <button 
                    style={contactButtonStyle}
                    onClick={() => navigate(`/clients?email=${client.email}`)}
                  >
                    ✉️ Contacter
                  </button>
                  <button 
                    style={createLeadButtonStyle}
                    onClick={() => navigate('/leads')}
                  >
                    ➕ Lead
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysisResults && analysisResults.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Aucun client ne correspond</p>
        </div>
      )}
    </div>
  )
}
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/context/AuthContext'
import { api } from '../services/api'
import { colors } from '../styles/colorPalette'

export default function AIAnalysisPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ totalAnalyzed: 0, topScore: 0, avgScore: 0 })
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'Commercial') navigate('/')
    else loadProducts()
  }, [user, navigate])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/api/products')
      if (response.data?.length) setProducts(response.data)
    } catch (err) {
      setError('Impossible de charger les produits')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeProduct = async () => {
    if (!selectedProduct) { setError('Veuillez sélectionner un produit'); return }
    try {
      setAnalyzing(true)
      setError('')
      setAnalysisResults(null)
      const clientsResponse = await api.get('/api/clients')
      const response = await api.post('/api/AIAnalysis/analyze-product-clients', {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        clients: (clientsResponse.data || []).map(c => ({
          id: c.id, name: c.name, email: c.email,
          features: [Math.random() * 1000, Math.random(), Math.random(), Math.random() * 5, Math.random()],
          social_media_text: c.description || c.name
        }))
      })
      if (response.data.analyzed_clients) {
        const scores = response.data.analyzed_clients.map(c => c.score || 0)
        setStats({
          totalAnalyzed: response.data.analyzed_clients.length,
          topScore: Math.max(...scores),
          avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
        })
      }
      setAnalysisResults(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'analyse IA')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 0.8) return { bg: colors.success, text: 'white' }
    if (score >= 0.6) return { bg: colors.warning, text: 'white' }
    return { bg: colors.error, text: 'white' }
  }

  return (
    <div style={{ backgroundColor: colors.darkBg, minHeight: '100vh' }}>
      <div style={{ backgroundColor: colors.darkBgAlt, borderBottom: `1px solid rgba(255,255,255,0.1)`, padding: '40px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>📊 Analyse IA Avancée</h1>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>Prospection IA avancée - Identifiez les clients potentiels pour vos produits</p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
        {error && <div style={{ backgroundColor: colors.errorLight, borderLeft: `4px solid ${colors.error}`, color: colors.error, padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkBg, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><span>🎯</span> Sélectionner un Produit</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ display: 'inline-block', width: '32px', height: '32px', border: `3px solid ${colors.primary}`, borderTop: `3px solid transparent`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
              <p style={{ color: '#6b7280', marginTop: '16px' }}>Chargement...</p>
            </div>
          ) : products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {products.map(p => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ padding: '16px', border: `2px solid ${selectedProduct?.id === p.id ? colors.primary : '#e5e7eb'}`, backgroundColor: selectedProduct?.id === p.id ? `${colors.primary}15` : 'white', borderRadius: '8px', cursor: 'pointer' }}>
                  <h3 style={{ fontWeight: 'bold', color: colors.darkBg }}>{p.name}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{p.category || 'Sans catégorie'}</p>
                  {p.price && <p style={{ fontSize: '14px', fontWeight: 'bold', color: colors.primary }}>{p.price.toFixed(2)} €</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>Aucun produit</p>
          )}

          <button onClick={handleAnalyzeProduct} disabled={!selectedProduct || analyzing} style={{ padding: '12px 32px', borderRadius: '8px', fontWeight: 'bold', color: 'white', fontSize: '16px', border: 'none', cursor: selectedProduct && !analyzing ? 'pointer' : 'not-allowed', backgroundColor: selectedProduct && !analyzing ? colors.secondary : '#d1d5db', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {analyzing ? <><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>Analyse...</> : <>🚀 Analyser</>}
          </button>
        </div>

        {analysisResults && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${colors.primary}`, borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>👥 Total</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: colors.primary }}>{stats.totalAnalyzed}</div>
              </div>
              <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${colors.success}`, borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>⭐ Top</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: colors.success }}>{(stats.topScore * 100).toFixed(0)}%</div>
              </div>
              <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${colors.warning}`, borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>📈 Moyenne</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: colors.warning }}>{(stats.avgScore * 100).toFixed(0)}%</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkBg, marginBottom: '8px' }}>📋 Résultats: {analysisResults.product_name}</h2>
              <p style={{ color: '#6b7280' }}>{stats.totalAnalyzed} clients analysés</p>
            </div>

            {analysisResults.analyzed_clients?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {analysisResults.analyzed_clients.map((client, idx) => {
                  const scoreColor = getScoreColor(client.score)
                  return (
                    <div key={idx} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.darkBg }}>{client.name}</h3>
                          {client.email && <p style={{ fontSize: '13px', color: '#6b7280' }}>{client.email}</p>}
                        </div>
                        <div style={{ backgroundColor: scoreColor.bg, color: scoreColor.text, padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '18px' }}>{(client.score * 100).toFixed(0)}%</div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                        <div>
                          <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Cluster</p>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.primary }}>#{client.cluster}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Confiance</p>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.success }}>{(client.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      {client.keywords?.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Tags</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {client.keywords.slice(0, 3).map((kw, i) => (
                              <span key={i} style={{ backgroundColor: `${colors.primary}20`, color: colors.primary, padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                                {typeof kw === 'string' ? kw : kw.keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                        <button style={{ padding: '8px 12px', backgroundColor: colors.blue, color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>📞 Contacter</button>
                        <button style={{ padding: '8px 12px', backgroundColor: colors.success, color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>✨ Lead</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '48px 32px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '18px' }}>Aucun client</p>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/context/AuthContext'
import { api } from '../services/api'
import { colors } from '../styles/colorPalette'

export default function AIAnalysisPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    topScore: 0,
    avgScore: 0
  })
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

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

      const clientsResponse = await api.get('/api/clients')
      const clients = clientsResponse.data || []

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

      const response = await api.post('/api/AIAnalysis/analyze-product-clients', analysisRequest)
      
      if (response.data.analyzed_clients) {
        const scores = response.data.analyzed_clients.map(c => c.score || 0)
        setStats({
          totalAnalyzed: response.data.analyzed_clients.length,
          topScore: Math.max(...scores),
          avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
        })
      }
      
      setAnalysisResults(response.data)
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err)
      setError(err.response?.data?.message || 'Erreur lors de l\'analyse IA')
    } finally {
      setAnalyzing(false)
    }
  }

  const generateClientFeatures = (client) => {
    return [Math.random() * 1000, Math.random(), Math.random(), Math.random() * 5, Math.random()]
  }

  const getScoreColor = (score) => {
    if (score >= 0.8) return { bg: colors.success, text: 'text-white' }
    if (score >= 0.6) return { bg: colors.warning, text: 'text-white' }
    return { bg: colors.error, text: 'text-white' }
  }

  const handleContactClient = (client) => {
    navigate(`/contact/${client.id}`, { state: { client, product: selectedProduct } })
  }

  const handleCreateLead = (client) => {
    navigate(`/create-lead`, { state: { client, product: selectedProduct } })
  }

  return (
    <div style={{ backgroundColor: colors.darkBg, minHeight: '100vh' }}>
      <div style={{ backgroundColor: colors.darkBgAlt, borderBottom: `1px solid rgba(255,255,255,0.1)`, padding: '40px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>📊 Analyse IA Avancée</h1>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>Prospection IA avancée - Identifiez les clients potentiels pour vos produits</p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
        {error && (
          <div style={{ backgroundColor: colors.errorLight, borderLeft: `4px solid ${colors.error}`, color: colors.error, padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkBg, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>🎯</span> Sélectionner un Produit
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ display: 'inline-block', width: '32px', height: '32px', border: `3px solid ${colors.primary}`, borderTop: `3px solid transparent`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
              <p style={{ color: '#6b7280', marginTop: '16px' }}>Chargement des produits...</p>
            </div>
          ) : products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {products.map(product => (
                <div key={product.id} onClick={() => setSelectedProduct(product)} style={{ padding: '16px', border: `2px solid ${selectedProduct?.id === product.id ? colors.primary : '#e5e7eb'}`, backgroundColor: selectedProduct?.id === product.id ? `${colors.primary}15` : 'white', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                  <h3 style={{ fontWeight: 'bold', color: colors.darkBg, marginBottom: '4px' }}>{product.name}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{product.category || 'Sans catégorie'}</p>
                  {product.price && <p style={{ fontSize: '14px', fontWeight: 'bold', color: colors.primary }}>{product.price.toFixed(2)} €</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>Aucun produit disponible</p>
          )}

          <button onClick={handleAnalyzeProduct} disabled={!selectedProduct || analyzing} style={{ padding: '12px 32px', borderRadius: '8px', fontWeight: 'bold', color: 'white', fontSize: '16px', border: 'none', cursor: selectedProduct && !analyzing ? 'pointer' : 'not-allowed', backgroundColor: selectedProduct && !analyzing ? colors.secondary : '#d1d5db', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {analyzing ? (<><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>Analyse en cours...</>) : (<>🚀 Analyser les Clients</>)}
          </button>
        </div>

        {analysisResults && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${colors.primary}`, borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>👥 Total Analysés</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: colors.primary }}>{stats.totalAnalyzed}</div>
              </div>
              <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${colors.success}`, borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>⭐ Meilleur Score</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: colors.success }}>{(stats.topScore * 100).toFixed(0)}%</div>
              </div>
              <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${colors.warning}`, borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>📈 Score Moyen</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: colors.warning }}>{(stats.avgScore * 100).toFixed(0)}%</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkBg, marginBottom: '8px' }}>📋 Résultats d'Analyse : {analysisResults.product_name}</h2>
              <p style={{ color: '#6b7280' }}>{stats.totalAnalyzed} clients analysés et classés par score de pertinence</p>
            </div>

            {analysisResults.analyzed_clients && analysisResults.analyzed_clients.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {analysisResults.analyzed_clients.map((client, idx) => {
                  const scoreColor = getScoreColor(client.score)
                  return (
                    <div key={idx} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.darkBg, marginBottom: '4px' }}>{client.name}</h3>
                          {client.email && <p style={{ fontSize: '13px', color: '#6b7280' }}>{client.email}</p>}
                        </div>
                        <div style={{ backgroundColor: scoreColor.bg, color: scoreColor.text, padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '18px', minWidth: '70px', textAlign: 'center' }}>{(client.score * 100).toFixed(0)}%</div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                        <div>
                          <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Cluster</p>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.primary }}>#{client.cluster}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Confiance</p>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.success }}>{(client.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      {client.keywords && client.keywords.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Mots-clés</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {client.keywords.slice(0, 4).map((kw, i) => (
                              <span key={i} style={{ backgroundColor: `${colors.primary}20`, color: colors.primary, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                                {typeof kw === 'string' ? kw : kw.keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                        <button onClick={() => handleContactClient(client)} style={{ padding: '8px 12px', backgroundColor: colors.blue, color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>📞 Contacter</button>
                        <button onClick={() => handleCreateLead(client)} style={{ padding: '8px 12px', backgroundColor: colors.success, color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>✨ Créer Lead</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '48px 32px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '18px' }}>Aucun client analysé</p>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/context/AuthContext'
import { api } from '../services/api'
import { colors } from '../styles/colorPalette'

export default function AIAnalysisPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    topScore: 0,
    avgScore: 0
  })
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

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

      const clientsResponse = await api.get('/api/clients')
      const clients = clientsResponse.data || []

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

      const response = await api.post('/api/AIAnalysis/analyze-product-clients', analysisRequest)
      
      if (response.data.analyzed_clients) {
        const scores = response.data.analyzed_clients.map(c => c.score || 0)
        setStats({
          totalAnalyzed: response.data.analyzed_clients.length,
          topScore: Math.max(...scores),
          avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
        })
      }
      
      setAnalysisResults(response.data)
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err)
      setError(err.response?.data?.message || 'Erreur lors de l\'analyse IA')
    } finally {
      setAnalyzing(false)
    }
  }

  const generateClientFeatures = (client) => {
    return [
      Math.random() * 1000,
      Math.random(),
      Math.random(),
      Math.random() * 5,
      Math.random()
    ]
  }

  const getScoreColor = (score) => {
    if (score >= 0.8) return { bg: colors.success, text: 'text-white', border: colors.success }
    if (score >= 0.6) return { bg: colors.warning, text: 'text-white', border: colors.warning }
    return { bg: colors.error, text: 'text-white', border: colors.error }
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
    <div style={{ backgroundColor: colors.darkBg, minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ 
        backgroundColor: colors.darkBgAlt, 
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
        padding: '40px 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '8px'
          }}>
            📊 Analyse IA Avancée
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Prospection IA avancée - Identifiez les clients potentiels pour vos produits
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
        
        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: colors.errorLight,
            borderLeft: `4px solid ${colors.error}`,
            color: colors.error,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Product Selection Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: colors.darkBg,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>🎯</span> Sélectionner un Produit
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: `3px solid ${colors.primary}`,
                borderTop: `3px solid transparent`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <p style={{ color: '#6b7280', marginTop: '16px' }}>Chargement des produits...</p>
            </div>
          ) : products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  style={{
                    padding: '16px',
                    border: `2px solid ${selectedProduct?.id === product.id ? colors.primary : '#e5e7eb'}`,
                    backgroundColor: selectedProduct?.id === product.id ? `${colors.primary}15` : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedProduct?.id === product.id ? `0 0 0 3px ${colors.primary}30` : 'none'
                  }}
                >
                  <h3 style={{
                    fontWeight: 'bold',
                    color: colors.darkBg,
                    marginBottom: '4px'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    {product.category || 'Sans catégorie'}
                  </p>
                  {product.price && (
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: colors.primary
                    }}>
                      {product.price.toFixed(2)} €
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>Aucun produit disponible</p>
          )}

          <button
            onClick={handleAnalyzeProduct}
            disabled={!selectedProduct || analyzing}
            style={{
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '16px',
              border: 'none',
              cursor: selectedProduct && !analyzing ? 'pointer' : 'not-allowed',
              backgroundColor: selectedProduct && !analyzing ? colors.secondary : '#d1d5db',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (selectedProduct && !analyzing) {
                e.target.style.backgroundColor = '#d97706'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedProduct && !analyzing) {
                e.target.style.backgroundColor = colors.secondary
              }
            }}
          >
            {analyzing ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></span>
                Analyse en cours...
              </>
            ) : (
              <>
                🚀 Analyser les Clients
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <div>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {/* Total Analyzed Card */}
              <div style={{
                backgroundColor: 'white',
                borderLeft: `4px solid ${colors.primary}`,
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  👥 Total Analysés
                </div>
                <div style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: colors.primary
                }}>
                  {stats.totalAnalyzed}
                </div>
              </div>

              {/* Top Score Card */}
              <div style={{
                backgroundColor: 'white',
                borderLeft: `4px solid ${colors.success}`,
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  ⭐ Meilleur Score
                </div>
                <div style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: colors.success
                }}>
                  {(stats.topScore * 100).toFixed(0)}%
                </div>
              </div>

              {/* Average Score Card */}
              <div style={{
                backgroundColor: 'white',
                borderLeft: `4px solid ${colors.warning}`,
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  📈 Score Moyen
                </div>
                <div style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: colors.warning
                }}>
                  {(stats.avgScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.darkBg,
                marginBottom: '8px'
              }}>
                📋 Résultats d'Analyse : {analysisResults.product_name}
              </h2>
              <p style={{ color: '#6b7280' }}>
                {stats.totalAnalyzed} clients analysés et classés par score de pertinence
              </p>
            </div>

            {/* Client Cards */}
            {analysisResults.analyzed_clients && analysisResults.analyzed_clients.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {analysisResults.analyzed_clients.map((client, idx) => {
                  const scoreColor = getScoreColor(client.score)
                  return (
                    <div 
                      key={idx}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Header with Score */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: colors.darkBg,
                            marginBottom: '4px'
                          }}>
                            {client.name}
                          </h3>
                          {client.email && (
                            <p style={{
                              fontSize: '13px',
                              color: '#6b7280'
                            }}>
                              {client.email}
                            </p>
                          )}
                        </div>
                        <div style={{
                          backgroundColor: scoreColor.bg,
                          color: scoreColor.text,
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '18px',
                          minWidth: '70px',
                          textAlign: 'center'
                        }}>
                          {(client.score * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginBottom: '16px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <div>
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}>
                            Cluster
                          </p>
                          <p style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: colors.primary
                          }}>
                            #{client.cluster}
                          </p>
                        </div>
                        <div>
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}>
                            Confiance
                          </p>
                          <p style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: colors.success
                          }}>
                            {(client.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {/* Keywords */}
                      {client.keywords && client.keywords.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                          }}>
                            Mots-clés
                          </p>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}>
                            {client.keywords.slice(0, 4).map((kw, i) => (
                              <span key={i} style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {typeof kw === 'string' ? kw : kw.keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        <button
                          onClick={() => handleContactClient(client)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: colors.blue,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2563eb'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = colors.blue
                          }}
                        >
                          📞 Contacter
                        </button>
                        <button
                          onClick={() => handleCreateLead(client)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: colors.success,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#059669'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = colors.success
                          }}
                        >
                          ✨ Créer Lead
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '48px 32px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#6b7280', fontSize: '18px' }}>
                  Aucun client analysé
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/context/AuthContext'
import { api } from '../services/api'
import { colors } from '../styles/colorPalette'

export default function AIAnalysisPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    topScore: 0,
    avgScore: 0
  })
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

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

      const clientsResponse = await api.get('/api/clients')
      const clients = clientsResponse.data || []

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

      const response = await api.post('/api/AIAnalysis/analyze-product-clients', analysisRequest)
      
      if (response.data.analyzed_clients) {
        const scores = response.data.analyzed_clients.map(c => c.score || 0)
        setStats({
          totalAnalyzed: response.data.analyzed_clients.length,
          topScore: Math.max(...scores),
          avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
        })
      }
      
      setAnalysisResults(response.data)
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err)
      setError(err.response?.data?.message || 'Erreur lors de l\'analyse IA')
    } finally {
      setAnalyzing(false)
    }
  }

  const generateClientFeatures = (client) => {
    return [
      Math.random() * 1000,
      Math.random(),
      Math.random(),
      Math.random() * 5,
      Math.random()
    ]
  }

  const getScoreColor = (score) => {
    if (score >= 0.8) return { bg: colors.success, text: 'text-white', border: colors.success }
    if (score >= 0.6) return { bg: colors.warning, text: 'text-white', border: colors.warning }
    return { bg: colors.error, text: 'text-white', border: colors.error }
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
    <div style={{ backgroundColor: colors.darkBg, minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ 
        backgroundColor: colors.darkBgAlt, 
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
        padding: '40px 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '8px'
          }}>
            📊 Analyse IA Avancée
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Prospection IA avancée - Identifiez les clients potentiels pour vos produits
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
        
        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: colors.errorLight,
            borderLeft: `4px solid ${colors.error}`,
            color: colors.error,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Product Selection Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: colors.darkBg,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>🎯</span> Sélectionner un Produit
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: `3px solid ${colors.primary}`,
                borderTop: `3px solid transparent`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <p style={{ color: '#6b7280', marginTop: '16px' }}>Chargement des produits...</p>
            </div>
          ) : products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  style={{
                    padding: '16px',
                    border: `2px solid ${selectedProduct?.id === product.id ? colors.primary : '#e5e7eb'}`,
                    backgroundColor: selectedProduct?.id === product.id ? `${colors.primary}15` : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedProduct?.id === product.id ? `0 0 0 3px ${colors.primary}30` : 'none'
                  }}
                >
                  <h3 style={{
                    fontWeight: 'bold',
                    color: colors.darkBg,
                    marginBottom: '4px'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    {product.category || 'Sans catégorie'}
                  </p>
                  {product.price && (
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: colors.primary
                    }}>
                      {product.price.toFixed(2)} €
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>Aucun produit disponible</p>
          )}

          <button
            onClick={handleAnalyzeProduct}
            disabled={!selectedProduct || analyzing}
            style={{
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '16px',
              border: 'none',
              cursor: selectedProduct && !analyzing ? 'pointer' : 'not-allowed',
              backgroundColor: selectedProduct && !analyzing ? colors.secondary : '#d1d5db',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (selectedProduct && !analyzing) {
                e.target.style.backgroundColor = '#d97706'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedProduct && !analyzing) {
                e.target.style.backgroundColor = colors.secondary
              }
            }}
          >
            {analyzing ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></span>
                Analyse en cours...
              </>
            ) : (
              <>
                🚀 Analyser les Clients
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <div>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {/* Total Analyzed Card */}
              <div style={{
                backgroundColor: 'white',
                borderLeft: `4px solid ${colors.primary}`,
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  👥 Total Analysés
                </div>
                <div style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: colors.primary
                }}>
                  {stats.totalAnalyzed}
                </div>
              </div>

              {/* Top Score Card */}
              <div style={{
                backgroundColor: 'white',
                borderLeft: `4px solid ${colors.success}`,
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  ⭐ Meilleur Score
                </div>
                <div style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: colors.success
                }}>
                  {(stats.topScore * 100).toFixed(0)}%
                </div>
              </div>

              {/* Average Score Card */}
              <div style={{
                backgroundColor: 'white',
                borderLeft: `4px solid ${colors.warning}`,
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  📈 Score Moyen
                </div>
                <div style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: colors.warning
                }}>
                  {(stats.avgScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.darkBg,
                marginBottom: '8px'
              }}>
                📋 Résultats d'Analyse : {analysisResults.product_name}
              </h2>
              <p style={{ color: '#6b7280' }}>
                {stats.totalAnalyzed} clients analysés et classés par score de pertinence
              </p>
            </div>

            {/* Client Cards */}
            {analysisResults.analyzed_clients && analysisResults.analyzed_clients.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {analysisResults.analyzed_clients.map((client, idx) => {
                  const scoreColor = getScoreColor(client.score)
                  return (
                    <div 
                      key={idx}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Header with Score */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: colors.darkBg,
                            marginBottom: '4px'
                          }}>
                            {client.name}
                          </h3>
                          {client.email && (
                            <p style={{
                              fontSize: '13px',
                              color: '#6b7280'
                            }}>
                              {client.email}
                            </p>
                          )}
                        </div>
                        <div style={{
                          backgroundColor: scoreColor.bg,
                          color: scoreColor.text,
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '18px',
                          minWidth: '70px',
                          textAlign: 'center'
                        }}>
                          {(client.score * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginBottom: '16px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <div>
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}>
                            Cluster
                          </p>
                          <p style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: colors.primary
                          }}>
                            #{client.cluster}
                          </p>
                        </div>
                        <div>
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}>
                            Confiance
                          </p>
                          <p style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: colors.success
                          }}>
                            {(client.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {/* Keywords */}
                      {client.keywords && client.keywords.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                          }}>
                            Mots-clés
                          </p>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}>
                            {client.keywords.slice(0, 4).map((kw, i) => (
                              <span key={i} style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {typeof kw === 'string' ? kw : kw.keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        <button
                          onClick={() => handleContactClient(client)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: colors.blue,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2563eb'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = colors.blue
                          }}
                        >
                          📞 Contacter
                        </button>
                        <button
                          onClick={() => handleCreateLead(client)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: colors.success,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#059669'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = colors.success
                          }}
                        >
                          ✨ Créer Lead
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '48px 32px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#6b7280', fontSize: '18px' }}>
                  Aucun client analysé
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
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

