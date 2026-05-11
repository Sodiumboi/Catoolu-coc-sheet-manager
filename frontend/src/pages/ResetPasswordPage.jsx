import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import logo from '../assets/vault-logo.png';

export default function ResetPasswordPage() {
  const [searchParams]         = useSearchParams();
  const navigate               = useNavigate();
  const { login: saveSession } = useAuth();
  const token                  = searchParams.get('token');

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);

  useEffect(() => {
    if (!token) setError('Invalid reset link. Please request a new one.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/reset-password', { token, password });
      localStorage.setItem('coc_token', res.data.token);
      localStorage.setItem('coc_user',  JSON.stringify(res.data.user));
      setSuccess(true);
      setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px 16px',
      background:     'var(--bg-page)',
      fontFamily:     'var(--font-sans)',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={logo} alt="The Catoolu"
               style={{ display: 'block', margin: '0 auto 12px', width: '64px', height: '64px', objectFit: 'contain' }} />
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize:   '28px',
            color:      'var(--color-primary-dark)',
            margin:     0,
          }}>
            The Catoolu
          </h1>
        </div>

        <div style={{
          background:   'var(--bg-card)',
          border:       '1px solid var(--border-main)',
          borderRadius: '16px',
          boxShadow:    'var(--shadow-card)',
          padding:      '28px',
        }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize:   '20px',
                color:      'var(--text-primary)',
                margin:     '0 0 8px',
              }}>
                Password Reset!
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Redirecting you to the vault...
              </p>
            </div>
          ) : (
            <>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize:   '20px',
                color:      'var(--text-primary)',
                margin:     '0 0 8px',
              }}>
                Set New Password
              </h2>
              <p style={{
                fontSize:   '13px',
                color:      'var(--text-muted)',
                margin:     '0 0 24px',
              }}>
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleSubmit}>
                {[
                  { label: 'New Password',      value: password, set: setPassword },
                  { label: 'Confirm Password',  value: confirm,  set: setConfirm  },
                ].map(field => (
                  <div key={field.label} style={{ marginBottom: '16px' }}>
                    <label style={{
                      display:       'block',
                      fontSize:      '11px',
                      fontWeight:    '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color:         'var(--text-muted)',
                      marginBottom:  '6px',
                    }}>
                      {field.label}
                    </label>
                    <input
                      type="password"
                      value={field.value}
                      onChange={e => field.set(e.target.value)}
                      required
                      minLength={8}
                      style={{
                        width:        '100%',
                        padding:      '9px 12px',
                        borderRadius: '8px',
                        border:       '1px solid var(--border-input)',
                        background:   'var(--bg-input)',
                        color:        'var(--text-primary)',
                        fontFamily:   'var(--font-sans)',
                        fontSize:     '14px',
                        outline:      'none',
                        boxSizing:    'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                      onBlur={e  => e.target.style.borderColor = 'var(--border-input)'}
                    />
                  </div>
                ))}

                {confirm && confirm !== password && (
                  <p style={{ fontSize: '12px', color: 'var(--danger)', margin: '-8px 0 12px' }}>
                    Passwords don't match
                  </p>
                )}

                {error && (
                  <div style={{
                    background:   'var(--danger-bg)',
                    border:       '1px solid var(--danger)',
                    borderRadius: '8px',
                    padding:      '10px 14px',
                    marginBottom: '16px',
                    fontSize:     '13px',
                    color:        'var(--danger)',
                  }}>
                    ⚠ {error}
                    {error.includes('expired') && (
                      <> <Link to="/forgot-password"
                               style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        Request a new link
                      </Link></>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  style={{
                    width:        '100%',
                    padding:      '11px',
                    borderRadius: '10px',
                    border:       'none',
                    background:   loading ? 'var(--text-muted)' : 'var(--color-primary)',
                    color:        '#ffffff',
                    fontFamily:   'var(--font-sans)',
                    fontSize:     '14px',
                    fontWeight:   '500',
                    cursor:       loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Saving...' : 'Set New Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}