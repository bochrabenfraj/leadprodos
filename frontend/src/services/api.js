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

// Products Categories API
export const getProductsCategories = () => apiClient.get('/products/categories/list')
export const getProductsByCategory = () => apiClient.get('/products/by-category')
export const filterProductsByCategory = (category) => apiClient.get(`/products/filter-by-category/${encodeURIComponent(category)}`)

// Clients API
export const getClients = () => apiClient.get('/clients')
export const getClientById = (id) => apiClient.get(`/clients/${id}`)
export const createClient = (data) => apiClient.post('/clients', data)
export const updateClient = (id, data) => apiClient.put(`/clients/${id}`, data)
export const deleteClient = (id) => apiClient.delete(`/clients/${id}`)
export const searchClients = (searchTerm, company, minScore, maxScore) => {
  const params = {}
  
  if (searchTerm) params.searchTerm = searchTerm
  if (company) params.company = company
  if (minScore !== undefined && minScore !== null) params.minScore = minScore
  if (maxScore !== undefined && maxScore !== null) params.maxScore = maxScore
  
  return apiClient.get('/clients/search', { params })
}

// Leads API
export const getLeads = async () => {
  try {
    const response = await apiClient.get('/leads')
    console.log('✅ getLeads success:', response.data)
    return response
  } catch (error) {
    console.error('❌ getLeads error:', error.response?.status, error.response?.data || error.message)
    throw error
  }
}
export const getLeadById = (id) => apiClient.get(`/leads/${id}`)
export const createLead = (data) => apiClient.post('/leads', data)
export const updateLead = (id, data) => apiClient.put(`/leads/${id}`, data)
export const analyzeLeads = (data) => apiClient.post('/leads/analyze', data)

// Auth API
export const login = (email, password) => apiClient.post('/auth/login', { email, password })
export const register = (username, email, password) => apiClient.post('/auth/register', { username, email, password })
export const changePassword = (email, oldPassword, newPassword) => apiClient.put('/auth/change-password', { email, oldPassword, newPassword })

export default apiClient
