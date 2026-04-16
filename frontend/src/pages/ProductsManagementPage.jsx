import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../components/context/AuthContext'
import { createProduct, updateProduct, deleteProduct, getProducts } from '../services/api'

export default function ProductsManagementPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Général'
  })
  const { user, loading: authLoading } = useContext(AuthContext)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err)
    }
  }

  // Fetch products using API service with Axios
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts()
      setProducts(response.data)
      setError('')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Votre session a expiré. Veuillez vous reconnecter.')
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement des produits')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Sequence Diagram Flow: Admin → Form → POST /api/products (JWT) → Backend Validation → DB → 201 Created → Success Message
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      setSubmitting(true)

      // Frontend validation (step 1 in diagram: Admin inputs)
      if (!formData.name || !formData.price) {
        setError('Veuillez remplir les champs obligatoires (nom et prix)')
        return
      }

      // Prepare payload for backend
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        category: formData.category?.trim() || 'Général'
      }

      let response

      try {
        if (editingId) {
          // Update existing product (PUT request)
          response = await updateProduct(editingId, payload)
          setSuccess(`✅ Produit "${payload.name}" mis à jour avec succès !`)
        } else {
          // Create new product (POST request - returns 201 Created)
          // This follows the sequence diagram: POST with JWT → Validation → InsertOneAsync → 201 Created
          response = await createProduct(payload)
          setSuccess(`✅ Produit "${payload.name}" créé avec succès ! (ID: ${response.data.id})`)
        }

        // Refresh product list after successful operation
        await fetchProducts()

        // Reset form
        resetForm()

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000)
      } catch (apiError) {
        // Handle specific HTTP status codes from backend (step 6 in diagram)
        if (apiError.response?.status === 400) {
          // Backend validation error (step 3 in diagram: Validation failed)
          setError(`❌ Erreur de validation: ${apiError.response.data?.message || 'Données invalides'}`)
        } else if (apiError.response?.status === 401) {
          // Unauthorized - token invalid/expired (security step in diagram)
          setError('❌ Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.')
        } else if (apiError.response?.status === 403) {
          // Forbidden - insufficient permissions
          setError('❌ Vous n\'avez pas les permissions nécessaires.')
        } else {
          // Generic error
          setError(`❌ Erreur: ${apiError.response?.data?.message || apiError.message}`)
        }
      }
    } catch (err) {
      setError(`❌ Une erreur inattendue s'est produite: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || 'Général'
    })
    setEditingId(product.id)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id)
    setConfirmAction({ type: 'delete-product', id, name: product?.name })
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    try {
      setLoading(true)
      await deleteProduct(confirmAction.id)
      setSuccess(`✅ Produit "${confirmAction.name}" supprimé avec succès`)
      fetchProducts()
      setError('')
      setShowConfirmModal(false)
      setConfirmAction(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      if (err.response?.status === 401) {
        setError('❌ Non autorisé. Veuillez vous reconnecter.')
      } else if (err.response?.status === 403) {
        setError('❌ Vous n\'avez pas les permissions pour supprimer.')
      } else {
        setError(`❌ Erreur lors de la suppression: ${err.response?.data?.message || err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAction = () => {
    setShowConfirmModal(false)
    setConfirmAction(null)
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: 'Général' })
    setEditingId(null)
    setShowForm(false)
  }

  if (authLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#1f2937' }}>Gestion des Produits 📦</h1>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginTop: 0, color: '#1f2937', marginBottom: '1rem' }}>Confirmer la suppression</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Êtes-vous sûr de vouloir supprimer le produit <strong>{confirmAction?.name}</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelAction}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: loading ? '#d1d5db' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          border: '1px solid #fca5a5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div style={{
          background: '#dcfce7',
          color: '#15803d',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          border: '1px solid #86efac',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{success}</span>
          <button 
            onClick={() => setSuccess('')}
            style={{ background: 'none', border: 'none', color: '#15803d', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ×
          </button>
        </div>
      )}

      <button
        onClick={() => !showForm ? setShowForm(true) : resetForm()}
        style={{
          padding: '0.75rem 1.5rem',
          background: showForm ? '#ef4444' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        {showForm ? 'Annuler' : '+ Ajouter un produit'}
      </button>

      {showForm && (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#1f2937', fontSize: '1.25rem' }}>
            {editingId ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                  Nom du produit *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Laptop Pro"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    background: 'white'
                  }}
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description du produit"
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                  Prix *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: submitting ? '#d1d5db' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer le produit'}
            </button>
          </form>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {products.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Aucun produit enregistré. Créez votre premier produit !
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Nom</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Prix</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Catégorie</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#1f2937' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    {product.description || 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#059669' }}>
                    {product.price} TND
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: product.stock > 10 ? '#d1fae5' : product.stock > 0 ? '#fef3c7' : '#fee2e2',
                      color: product.stock > 10 ? '#065f46' : product.stock > 0 ? '#92400e' : '#991b1b',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: '#6b7280' }}>
                    {product.category}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

