import { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './components/context/AuthContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import ProductsViewPage from './pages/ProductsViewPage'
import ProductsManagementPage from './pages/ProductsManagementPage'
import ClientsViewPage from './pages/ClientsViewPage'
import ClientsManagementPage from './pages/ClientsManagementPage'
import CategoriesManagementPage from './pages/CategoriesManagementPage'
import LeadsPage from './pages/LeadsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import UsersManagementPage from './pages/UsersManagementPage'
import UserProfilePage from './pages/UserProfilePage'
import AdminResetPasswordPage from './pages/AdminResetPasswordPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import './App.css'

function ProtectedRoute({ children, user }) {
  return user ? children : <Navigate to="/login" />
}

function AppContent() {
  const authContext = useContext(AuthContext)
  const user = authContext?.user

  return (
    <>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><UserProfilePage /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute user={user}><ChangePasswordPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute user={user}><UsersManagementPage /></ProtectedRoute>} />
        <Route path="/reset-password-admin" element={<ProtectedRoute user={user}><AdminResetPasswordPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute user={user}><ProductsViewPage /></ProtectedRoute>} />
        <Route path="/products/manage" element={<ProtectedRoute user={user}><ProductsManagementPage /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute user={user}><ProductsManagementPage /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute user={user}><ClientsViewPage /></ProtectedRoute>} />
        <Route path="/clients/manage" element={<ProtectedRoute user={user}><ClientsManagementPage /></ProtectedRoute>} />
        <Route path="/admin/clients" element={<ProtectedRoute user={user}><ClientsManagementPage /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute user={user}><CategoriesManagementPage /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute user={user}><LeadsPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
