import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../components/context/AuthContext'
import ProductFilter from '../components/ProductFilter'
import { getProducts, createProduct, deleteProduct, updateProduct } from '../services/api'
import '../styles/ProductsPage.css'

export default function ProductsPage() {
  const { user } = useContext(AuthContext)
  
  // Si ce n'est pas un Admin, afficher un message d'accès refusé
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
        <p>Seul l'administrateur peut gérer les produits.</p>
      </div>
    )
  }
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateProduct(editingId, formData)
        setEditingId(null)
      } else {
        await createProduct(formData)
      }
      setFormData({ name: '', description: '', price: '', stock: '', category: '' })
      setShowForm(false)
      window.location.reload()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }))
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>🛍️ Product Catalog</h1>
        <button 
          className="btn-add-product"
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: '', description: '', price: '', stock: '', category: '' })
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Arduino Uno"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Product description..."
                rows="3"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Cartes Électroniques"
                  list="categories"
                />
                <datalist id="categories">
                  <option value="Cartes Électroniques" />
                  <option value="Mini Robots" />
                  <option value="Composants Électroniques" />
                  <option value="Kits IoT" />
                  <option value="Outils Électroniques" />
                  <option value="Audio" />
                  <option value="Caméras" />
                  <option value="Drones" />
                  <option value="Smartphones" />
                  <option value="Tablettes" />
                  <option value="Ordinateurs" />
                  <option value="Téléviseurs" />
                  <option value="Wearables" />
                </datalist>
              </div>

              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              {editingId ? 'Update' : 'Create'} Product
            </button>
          </form>
        </div>
      )}

      <ProductFilter />
    </div>
  )
}

