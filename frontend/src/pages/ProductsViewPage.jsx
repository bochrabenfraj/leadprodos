import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function ProductsViewPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Erreur lors du chargement des produits')
      const data = await response.json()
      setProducts(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>Chargement des produits...</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#1f2937', margin: 0 }}>Catalogue de Produits 📦</h1>
        <Link to="/products/manage" style={{
          padding: '0.75rem 1.5rem',
          background: '#667eea',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 600
        }}>
          ⚙️ Gérer les produits
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
          placeholder="🔍 Rechercher un produit..."
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

      {filteredProducts.length === 0 ? (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          background: '#f9fafb',
          borderRadius: '8px',
          color: '#6b7280'
        }}>
          <p style={{ fontSize: '1.1rem' }}>Aucun produit trouvé</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '1rem'
              }}>
                <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.1rem' }}>
                  {product.name}
                </h3>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {product.category || 'Général'}
                </span>
              </div>

              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {product.description || 'Pas de description'}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.85rem' }}>Prix</p>
                  <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#059669' }}>
                    {product.price} TND
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.85rem' }}>Stock</p>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.5rem 0.75rem',
                    background: product.stock > 0 ? '#d1fae5' : '#fee2e2',
                    color: product.stock > 0 ? '#065f46' : '#991b1b',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    {product.stock > 0 ? `${product.stock} unités` : 'Rupture'}
                  </span>
                </div>
              </div>

              <button style={{
                width: '100%',
                padding: '0.75rem',
                background: product.stock > 0 ? '#3b82f6' : '#d1d5db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                opacity: product.stock > 0 ? 1 : 0.6
              }}>
                🛒 {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
