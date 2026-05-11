import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import logo from '../assets/vault-logo.png';

export default function ResetPasswordPage() {
  const [searchParams]                = useSearchParams();
  const navigate                      = useNavigate();
  const { login: saveSession }        = useAuth();

  const token = searchParams.get('token');

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);

  // If no token in URL, show error immediately
  useEffect(() => {
    if (!token) setError('Invalid reset link. Please request a new one.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/reset-password', { token, password });

      // Save token to localStorage
      localStorage.setItem('coc_token', res.data.token);
      localStorage.setItem('coc_user',  JSON.stringify(res.data.user));

      setSuccess(true);

      // Use window.location instead of navigate() so the whole app
      // reinitialises and AuthContext re-reads the new token from localStorage
      setTimeout(() => { window.location.href = '/dashboard'; }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'var(--bg-page)' }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <img src={logo} alt="The Catoolu"
               style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 12px' }} />
          <h1 style={{
            fontFamily:    'var(--font-serif)',
            fontSize:      '28px',
            color:         'var(--color-primary-dark)',
            letterSpacing: '0.05em',
            margin:        '0 0 4px',
          }}>
            The Catoolu
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Call of Cthulhu Character Manager
          </p>
        </div>

        <div className="rounded-lg p-8 border"
             style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}>

          {success ? (
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-lg font-bold mb-2"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                Password Reset!
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Redirecting you to the vault...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-2"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                Set New Password
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1"
                         style={{ color: 'var(--accent)' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required minLength={8}
                    placeholder="At least 8 characters"
                    className="w-full px-3 py-2 rounded text-sm outline-none"
                    style={{
                      background: 'var(--bg-input)',
                      border:     '1px solid var(--border-input)',
                      color:      'var(--text-primary)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border-input)'}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1"
                         style={{ color: 'var(--accent)' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    placeholder="Same password again"
                    className="w-full px-3 py-2 rounded text-sm outline-none"
                    style={{
                      background: 'var(--bg-input)',
                      border:     `1px solid ${confirm && confirm !== password ? 'var(--danger)' : 'var(--border-input)'}`,
                      color:      'var(--text-primary)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                    onBlur={e  => e.target.style.borderColor = confirm !== password ? 'var(--danger)' : 'var(--border-input)'}
                  />
                  {confirm && confirm !== password && (
                    <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>
                      Passwords don't match
                    </p>
                  )}
                </div>

                {error && (
                  <div className="text-sm px-3 py-2 rounded"
                       style={{ background: 'var(--danger)22', color: 'var(--danger)', border: '1px solid var(--danger)44' }}>
                    ⚠ {error}
                    {error.includes('expired') && (
                      <span> <Link to="/forgot-password" style={{ color: 'var(--accent)' }}>
                        Request a new link
                      </Link></span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-3 rounded font-bold uppercase tracking-widest text-sm"
                  style={{
                    background: loading ? 'var(--text-muted)' : 'var(--accent)',
                    color:      'var(--bg-page)',
                    cursor:     loading ? 'not-allowed' : 'pointer',
                  }}>
                  {loading ? 'Saving...' : 'Set New Password'}
                </button>
              </form>
            </>
          )}
        </div>
        {/* Footer */}
           <p className="text-center text-xs mt-4" style={{ color: 'var(--text-faint)' }}>
          Powered by Kon Tuen Claude and Resend — Built by someone, who rolled 1 on adv d20.
        </p>
      </div>
    </div>
  );
}