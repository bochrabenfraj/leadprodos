import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token invalide ou expiré');
      setValidToken(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/reset-password-with-token', {
        token,
        newPassword
      });

      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
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
          width: '100%',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: '#991b1b',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            ❌ Token Invalide
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Le lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link
            to="/forgot-password"
            style={{
              display: 'inline-block',
              background: '#0f3460',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

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
          Réinitialiser le mot de passe
        </h1>

        <p style={{
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.95rem'
        }}>
          Entrez votre nouveau mot de passe
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
            ✅ Mot de passe réinitialisé avec succès! Redirection vers la connexion...
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
              Nouveau mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 12px',
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#6b7280'
                }}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#374151',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Confirmer le mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 12px',
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
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#6b7280'
                }}
              >
                {showConfirmPassword ? '👁️' : '🔒'}
              </button>
            </div>
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
            {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.95rem'
        }}>
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
        </div>
      </div>
    </div>
  );
}

