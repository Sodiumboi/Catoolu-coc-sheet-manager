import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/vault-logo.png';


export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Toggle between 'login' and 'register' modes
  const [mode, setMode]           = useState('login');
  const [username, setUsername]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the browser from reloading the page
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate('/dashboard'); // success — go to dashboard
    } catch (err) {
      // The error message comes from our backend
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at center, #1a0f05 0%, var(--bg-input) 70%)' }}>

      {/* Decorative border container */}
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="The Catoolu"
               className="mx-auto mb-4 object-contain"
               style={{ width: '72px', height: '72px' }} />
          <h1 className="text-3xl font-bold tracking-widest uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}>
            The Catoolu
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Call of Cthulhu Character Manager
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg p-8 border"
             style={{
               background: 'rgba(26, 18, 8, 0.95)',
               borderColor: 'var(--accent)',
               boxShadow: '0 0 40px rgba(184, 134, 11, 0.15), inset 0 0 40px rgba(0,0,0,0.3)'
             }}>

          {/* Mode Toggle */}
          <div className="flex rounded-md mb-6 overflow-hidden border"
               style={{ borderColor: 'var(--accent)33' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className="flex-1 py-2 text-sm font-medium transition-all duration-200"
              style={{
                background: mode === 'login' ? 'var(--accent)' : 'transparent',
                color: mode === 'login' ? 'var(--bg-input)' : 'var(--accent)',
              }}>
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className="flex-1 py-2 text-sm font-medium transition-all duration-200"
              style={{
                background: mode === 'register' ? 'var(--accent)' : 'transparent',
                color: mode === 'register' ? 'var(--bg-input)' : 'var(--accent)',
              }}>
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username field — only shown in register mode */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1"
                       style={{ color: 'var(--accent)' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder="InvestigatorName"
                  className="w-full px-3 py-2 rounded text-sm outline-none transition-all"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--accent)55',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--accent)55'}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1"
                     style={{ color: 'var(--accent)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="investigator@arkham.edu"
                className="w-full px-3 py-2 rounded text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--accent)55',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--accent)55'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1"
                     style={{ color: 'var(--accent)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--accent)55',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--accent)55'}
              />
            </div>
            {/* Add this right after the password input's closing </div> */}
              {mode === 'login' && (
                <div className="text-right">
                  <Link to="/forgot-password"
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                    Forgot password?
                  </Link>
                </div>
              )}
            {/* Error message */}
            {error && (
              <div className="text-sm px-3 py-2 rounded"
                   style={{ background: 'var(--danger)22', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-bold uppercase tracking-widest text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? '#6b5000' : 'var(--accent)',
                color: 'var(--bg-input)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading
                ? 'Consulting the Ancient Tomes...'
                : mode === 'login' ? 'Enter the Vault' : 'Begin Investigation'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-faint)' }}>
          Powered by Kon Tuen Claude and Resend — Built by someone, who rolled 1 on adv d20.
        </p>
      </div>
    </div>
  );
}
