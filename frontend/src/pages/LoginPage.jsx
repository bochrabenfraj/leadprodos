import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      }
      navigate('/dashboard');
    } else {
      setError(result.error || 'Erreur de connexion');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f3460 0%, #1a5490 100%)' }}>
      {/* Features Modal */}
      {showFeatures && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#0f3460', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Fonctionnalités LeadProdos</h2>
              <button
                onClick={() => setShowFeatures(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ color: '#374151', lineHeight: 1.8 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0f3460', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>👥 Gestion des Clients</h3>
                <p>Centralisez toutes vos données clients, suivez les interactions et gérez vos relationships efficacement.</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0f3460', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>📊 Gestion des Prospects</h3>
                <p>Créez et suivez vos leads avec des outils avancés de segmentation et de scoring.</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0f3460', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>🛍️ Catalogue de Produits</h3>
                <p>Gérez votre portefeuille produits et associez automatiquement les products aux clients potentiels.</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0f3460', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>🤖 Powered by AI</h3>
                <p>Bénéficiez de recommandations intelligentes pour optimiser vos efforts de prospection.</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0f3460', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>👨‍💼 Gestion des Utilisateurs</h3>
                <p>Créez des comptes utilisateurs et gérez les permissions pour votre équipe.</p>
              </div>

              <div>
                <h3 style={{ color: '#0f3460', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>🔐 Sécurité</h3>
                <p>Authentification sécurisée avec JWT tokens et protection des données.</p>
              </div>
            </div>

            <button
              onClick={() => setShowFeatures(false)}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: '#0f3460',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '1.5rem'
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Left Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Background decorative elements */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '200px', height: '200px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '30px', transform: 'rotate(45deg)' }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '150px', height: '150px', background: 'rgba(102, 126, 234, 0.15)', borderRadius: '30px', transform: 'rotate(-20deg)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1rem' }}>Bienvenue ! 👋</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '500px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Accédez à votre tableau de bord LeadProdos alimenté par l'IA pour la prospection avancée et l'appariement produit-client.
          </p>
          <button
            type="button"
            onClick={() => setShowFeatures(true)}
            style={{
              padding: '0.875rem 1.75rem',
              background: 'white',
              color: '#0f3460',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Découvrir les fonctionnalités
          </button>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '3rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', color: '#0f3460', fontWeight: 700, marginBottom: '0.5rem' }}>Connexion</h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Connectez-vous à votre compte</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>IDENTIFIANT</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', zIndex: 1 }}>👤</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  disabled={loading}
                  style={{ paddingLeft: '2.5rem', paddingRight: '1rem', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>MOT DE PASSE</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', zIndex: 1 }}>🔐</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  disabled={loading}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0',
                    zIndex: 2
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                Se souvenir de moi
              </label>
              <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
                Mot de passe oublié ?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: loading ? '#d1d5db' : '#0f3460',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginBottom: '1rem',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#1a5490')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#0f3460')}
            >
              {loading ? '⏳ Connexion en cours...' : 'CONNEXION'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
