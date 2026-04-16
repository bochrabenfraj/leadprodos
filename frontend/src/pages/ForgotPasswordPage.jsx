import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/forgot-password', { email });
      setSuccess(true);
      setEmail('');
      
      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f3460 0%, #1a5490 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxWidth: '450px',
        width: '100%'
      }}>
        <h1 style={{
          color: '#0f3460',
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Mot de passe oublié ?
        </h1>

        <p style={{
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.95rem'
        }}>
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe
        </p>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.95rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#dcfce7',
            color: '#166534',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.95rem'
          }}>
            ✅ Email envoyé ! Vérifiez votre boîte de réception. Redirection en cours...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              color: '#374151',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : '#0f3460',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#1a5490';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#0f3460';
            }}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.95rem'
        }}>
          <p>
            Vous vous souvenez de votre mot de passe?{' '}
            <Link
              to="/login"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

