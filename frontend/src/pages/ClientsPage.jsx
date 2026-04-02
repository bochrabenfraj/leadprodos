import { useState, useEffect } from 'react'
import { getClients, createClient, deleteClient } from '../services/api'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await getClients()
      setClients(response.data || [])
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createClient(formData)
      setFormData({ name: '', email: '', phone: '', company: '' })
      setShowForm(false)
      loadClients()
    } catch (error) {
      console.error('Error creating client:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr?')) {
      try {
        await deleteClient(id)
        loadClients()
      } catch (error) {
        console.error('Error deleting client:', error)
      }
    }
  }

  return (
    <div className="container">
      <h2>Gestion des Clients</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Annuler' : '+ Ajouter un Client'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <label>Nom du Client</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label>Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <label>Téléphone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <label>Entreprise</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <button type="submit">Créer Client</button>
        </form>
      )}

      {loading ? (
        <p>Chargement des clients...</p>
      ) : clients.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Entreprise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.company}</td>
                <td>
                  <button className="delete" onClick={() => handleDelete(client.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun client trouvé.</p>
      )}
    </div>
  )
}
