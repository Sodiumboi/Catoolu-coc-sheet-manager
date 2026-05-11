import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import logo from '../assets/vault-logo.png';

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
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

        {/* Header */}
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
          {submitted ? (
            /* Success state */
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📬</div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize:   '20px',
                color:      'var(--text-primary)',
                margin:     '0 0 12px',
              }}>
                Check Your Inbox
              </h2>
              <p style={{
                fontSize:   '13px',
                color:      'var(--text-muted)',
                lineHeight: '1.7',
                margin:     '0 0 8px',
              }}>
                If <strong style={{ color: 'var(--text-primary)' }}>{email}</strong> is
                registered, a reset link has been sent.
                Check your spam folder if it doesn't appear within a few minutes.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px' }}>
                The link expires in <strong style={{ color: 'var(--text-primary)' }}>1 hour</strong>.
              </p>
              <Link to="/login" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize:   '20px',
                color:      'var(--text-primary)',
                margin:     '0 0 8px',
              }}>
                Forgot Password
              </h2>
              <p style={{
                fontSize:   '13px',
                color:      'var(--text-muted)',
                lineHeight: '1.6',
                margin:     '0 0 24px',
              }}>
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display:       'block',
                    fontSize:      '11px',
                    fontWeight:    '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    color:         'var(--text-muted)',
                    marginBottom:  '6px',
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="investigator@arkham.edu"
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
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '20px' }}>
                Remember it?{' '}
                <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}