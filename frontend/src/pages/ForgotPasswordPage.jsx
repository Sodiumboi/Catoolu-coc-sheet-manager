import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

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
      setSubmitted(true); // always show success (even if email not found — security)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'var(--bg-page)' }}>
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐙</div>
          <h1 className="text-2xl font-bold tracking-widest uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif' }}>
            The Catoolu
          </h1>
        </div>

        <div className="rounded-lg p-8 border"
             style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}>

          {submitted ? (
            // ── Success state ──
            <div className="text-center">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-lg font-bold mb-3"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                Check Your Inbox
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                If <strong style={{ color: 'var(--text-primary)' }}>{email}</strong> is
                registered, a reset link has been sent. Check your spam folder if it
                doesn't appear within a few minutes.
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                The link expires in <strong style={{ color: 'var(--text-primary)' }}>1 hour</strong>.
              </p>
              <Link to="/login"
                    className="text-sm font-medium"
                    style={{ color: 'var(--accent)' }}>
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            // ── Form state ──
            <>
              <h2 className="text-lg font-bold mb-2"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                Forgot Password
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1"
                         style={{ color: 'var(--accent)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="investigator@arkham.edu"
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

                {error && (
                  <div className="text-sm px-3 py-2 rounded"
                       style={{ background: 'var(--danger)22', color: 'var(--danger)', border: '1px solid var(--danger)44' }}>
                    ⚠ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded font-bold uppercase tracking-widest text-sm"
                  style={{
                    background: loading ? 'var(--text-muted)' : 'var(--accent)',
                    color:      'var(--bg-page)',
                    cursor:     loading ? 'not-allowed' : 'pointer',
                  }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
                Remember it?{' '}
                <Link to="/login" style={{ color: 'var(--accent)' }}>
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