import { useState, useEffect } from 'react'
import { getProducts, createProduct, deleteProduct } from '../services/api'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await getProducts()
      setProducts(response.data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createProduct(formData)
      setFormData({ name: '', description: '', price: '', category: '' })
      setShowForm(false)
      loadProducts()
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr?')) {
      try {
        await deleteProduct(id)
        loadProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  // Extraire catégories uniques
  const getCategories = () => {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
    return ['Tous', ...categories].sort()
  }

  // Filtrer les produits par catégorie
  const filteredProducts = selectedCategory === 'Tous' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <div className="container">
      <h2>🛍️ Catalogue de Produits</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Annuler' : '+ Ajouter un Produit'}
      </button>

      {/* Filtrage par catégorie */}
      <div style={{ 
        marginTop: '1.5rem', 
        marginBottom: '1.5rem', 
        display: 'flex', 
        gap: '0.5rem', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 600, color: '#374151' }}>Catégories:</span>
        {getCategories().map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedCategory === category ? '#667eea' : '#e5e7eb',
              color: selectedCategory === category ? 'white' : '#374151',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: selectedCategory === category ? 600 : 500,
              transition: 'all 0.2s'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <label>Nom du Produit</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <label>Prix</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <label>Catégorie</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <button type="submit">Créer Produit</button>
        </form>
      )}

      {loading ? (
        <p>Chargement des produits...</p>
      ) : filteredProducts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}€</td>
                <td>{product.category}</td>
                <td>
                  <button className="delete" onClick={() => handleDelete(product.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun produit trouvé dans cette catégorie.</p>
      )}
    </div>
  )
}
