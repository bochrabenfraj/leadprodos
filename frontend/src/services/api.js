import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Ajouter le token JWT à chaque requête
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Gérer les erreurs 401 (token expiré)
apiClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

// Products API
export const getProducts = () => apiClient.get('/products')
export const getProductById = (id) => apiClient.get(`/products/${id}`)
export const createProduct = (data) => apiClient.post('/products', data)
export const updateProduct = (id, data) => apiClient.put(`/products/${id}`, data)
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`)

// Clients API
export const getClients = () => apiClient.get('/clients')
export const getClientById = (id) => apiClient.get(`/clients/${id}`)
export const createClient = (data) => apiClient.post('/clients', data)
export const updateClient = (id, data) => apiClient.put(`/clients/${id}`, data)
export const deleteClient = (id) => apiClient.delete(`/clients/${id}`)

// Leads API
export const getLeads = () => apiClient.get('/leads')
export const getLeadById = (id) => apiClient.get(`/leads/${id}`)
export const createLead = (data) => apiClient.post('/leads', data)
export const updateLead = (id, data) => apiClient.put(`/leads/${id}`, data)
export const analyzeLeads = (data) => apiClient.post('/leads/analyze', data)

export default apiClient
