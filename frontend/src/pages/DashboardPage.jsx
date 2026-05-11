import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CharacterCard from '../components/CharacterCard';
import apiClient from '../api/client';
import logo from '../assets/vault-logo.png';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [characters, setCharacters]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [importing, setImporting]     = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }
  const fileInputRef = useRef(null);

  // ── Fetch characters on mount ──────────────────────────
  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/characters');
      setCharacters(response.data.characters);
    } catch (err) {
      setError('Failed to load characters. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // ── Import JSON file ───────────────────────────────────
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input so the same file can be re-imported if needed
    e.target.value = '';

    if (!file.name.endsWith('.json')) {
      setError('Please select a .json file.');
      return;
    }

    setImporting(true);
    setError('');

    try {
      // Read the file as text
      const text = await file.text();
      const sheet_data = JSON.parse(text);

      // Send to backend
      await apiClient.post('/characters', { sheet_data });

      // Refresh the list
      await fetchCharacters();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON file. Please check the file and try again.');
      } else {
        setError(err.response?.data?.error || 'Failed to import character.');
      }
    } finally {
      setImporting(false);
    }
  };

  // ── Delete character ───────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await apiClient.delete(`/characters/${deleteConfirm.id}`);
      setCharacters(prev => prev.filter(c => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete character.');
      setDeleteConfirm(null);
    }
  };

  // ── Logout ─────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ── Top Navigation Bar ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10"
           style={{
             background: 'var(--bg-nav)',
             borderColor: 'var(--accent)33',
             backdropFilter: 'blur(8px)',
           }}>
        <div className="flex items-center gap-3">
          <img src={logo} alt="The Catoolu"
               className="object-contain flex-shrink-0"
               style={{ width: '32px', height: '32px' }} />
          <div>
            <h1 style={{ 
              fontFamily: 'var(--font-serif)',
              fontSize: '20px',
              color: 'var(--color-primary-dark)',
              margin: 0,
              letterSpacing: '0.01em',
            }}>
              The Catoolu
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              Welcome back, {user?.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Import JSON Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-150"
            style={{
              background: 'var(--accent)22',
              color: 'var(--accent)',
              border: '1px solid var(--accent)44',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)44'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)22'}
          >
            {importing ? '⏳ Importing...' : '📂 Import JSON'}
          </button>

          {/* Hidden file input — triggered by button above */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />

          {/* Profile button — add this between Import JSON and Sign Out */}
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 rounded text-sm font-medium transition-all"
            style={{
              background: 'transparent',
              color:      'var(--accent)',
              border:     '1px solid var(--border-main)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            👤 Profile
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-150"
            style={{
              background: 'var(--danger)22',
              color: 'var(--danger)',
              border: '1px solid var(--danger)44',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--danger)44'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--danger)22'}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
            Investigators
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {characters.length === 0
              ? 'No investigators yet — import a JSON file to begin'
              : `${characters.length} investigator${characters.length !== 1 ? 's' : ''} in the vault`}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm flex items-center justify-between"
               style={{ background: 'var(--danger)22', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
            <span>⚠ {error}</span>
            <button onClick={() => setError('')} style={{ color: 'var(--danger)', opacity: 0.7 }}>✕</button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🐙</div>
              <p style={{ color: 'var(--text-muted)' }}>Summoning investigators...</p>
            </div>
          </div>

        /* Empty state */
        ) : characters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-6 opacity-30">📜</div>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              The vault is empty
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Import a Dhole's House JSON file to add your first investigator
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded font-medium transition-all duration-150"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-input)',
              }}>
              📂 Import Your First Character
            </button>
          </div>

        /* Character grid */
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map(character => (
              <CharacterCard
                key={character.id}
                character={character}
                onOpen={(id) => navigate(`/character/${id}`)}
                onDelete={(id, name) => setDeleteConfirm({ id, name })}
              />
            ))}

            {/* "Add another" card */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg p-5 border-2 border-dashed flex flex-col items-center justify-center gap-3 min-h-48 transition-all duration-200"
              style={{ borderColor: 'var(--accent)33', color: 'var(--accent)55' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--accent)33';
                e.currentTarget.style.color = 'var(--accent)55';
              }}
            >
              <span className="text-3xl">+</span>
              <span className="text-sm font-medium">Import Another</span>
            </button>
          </div>
        )}
      </main>

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
             style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-sm rounded-lg p-6 border"
               style={{
                 background:  'var(--bg-card)',
                 borderColor: 'var(--danger)',
                 boxShadow:   '0 0 40px rgba(139,26,26,0.3)',
               }}>
            <h3 className="font-bold text-lg mb-2"
                style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Delete Investigator?
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Are you sure you want to delete{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {deleteConfirm.name}
              </strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded text-sm font-medium transition-all"
                style={{
                  background:  'var(--bg-input)',
                  color:       'var(--text-muted)',
                  border:      '1px solid var(--border-main)',
                }}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded text-sm font-medium transition-all"
                style={{
                  background: 'var(--danger)',
                  color:      'var(--text-primary)',
                }}>
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
