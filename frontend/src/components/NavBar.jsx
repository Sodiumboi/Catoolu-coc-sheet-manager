import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/vault-logo.png';

// ── Tab definitions ────────────────────────────────────────
// 'available' tabs are clickable, 'soon' tabs are greyed out
const TABS = [
  { id: 'investigators', label: 'Investigators', path: '/dashboard', status: 'available' },
  { id: 'keeper',        label: 'Keeper',        path: '/keeper',   status: 'available' },
  { id: 'campaign',      label: 'Campaign',      path: '/campaign', status: 'available' },
  { id: 'inbox',         label: 'Inbox',         path: '/inbox',    status: 'available' },
];

export default function NavBar({ activeTab = 'investigators', onImport, investigatorCount }) {
  const { user, logout }          = useAuth();
  const { theme, toggleTheme }    = useTheme();
  const navigate                  = useNavigate();
  const location                  = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltip,      setTooltip]      = useState(null); // { id, label }
  const dropdownRef                     = useRef(null);
  const fileInputRef                    = useRef(null);

  // ── Close dropdown when clicking outside ────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Close dropdown on route change ──────────────────────
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // ── Handlers ─────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    if (onImport) onImport(e);
    e.target.value = '';
  };

  // Get user initials for avatar
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <nav style={{
      background:   'var(--bg-nav)',
      borderBottom: '1px solid var(--border-main)',
      boxShadow:    'var(--shadow-nav)',
      position:     'sticky',
      top:          0,
      zIndex:       50,
    }}>
      <div style={{
        width:      '100%',
        padding:    '0 24px',
        display:    'flex',
        alignItems: 'center',
        height:     '56px',
        gap:        '24px',
      }}>

        {/* ── Logo ── */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            padding:    '0',
            flexShrink: 0,
          }}
        >
          <img
            src={logo}
            alt="The Catoolu"
            style={{ width: '36px', height: '36px', objectFit: 'contain' }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize:   '18px',
              color:      'var(--color-primary-dark)',
              lineHeight: '1.1',
            }}>
              The Catoolu
            </div>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize:   '11px',
              color:      'var(--text-muted)',
              lineHeight: '1.2',
            }}>
              welcome back, {user?.username}
            </div>
          </div>
        </button>

        {/* ── Tabs — pill shaped ── */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '4px',
          flex:       1,
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const isSoon   = tab.status === 'soon';

            return (
              <div key={tab.id} style={{ position: 'relative' }}>
                <button
                  onClick={() => !isSoon && navigate(tab.path)}
                  onMouseEnter={() => isSoon && setTooltip({ id: tab.id, label: tab.version })}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '6px',
                    padding:       '5px 14px',
                    borderRadius:  '20px',
                    border:        isActive
                      ? '1.5px solid var(--color-primary)'
                      : '1.5px solid transparent',
                    background:    isActive
                      ? 'var(--accent-bg)'
                      : 'transparent',
                    cursor:        isSoon ? 'default' : 'pointer',
                    fontFamily:    'var(--font-sans)',
                    fontSize:      '13px',
                    fontWeight:    isActive ? '500' : '400',
                    color:         isActive
                      ? 'var(--color-primary)'
                      : isSoon
                        ? 'var(--text-faint)'
                        : 'var(--text-secondary)',
                    whiteSpace:    'nowrap',
                    transition:    'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isSoon && !isActive) {
                      e.currentTarget.style.background   = 'var(--row-hover)';
                      e.currentTarget.style.color        = 'var(--text-primary)';
                      e.currentTarget.style.borderColor  = 'var(--border-main)';
                    }
                    if (isSoon) setTooltip({ id: tab.id, label: tab.version });
                  }}
                  onMouseLeave={e => {
                    if (!isSoon && !isActive) {
                      e.currentTarget.style.background  = 'transparent';
                      e.currentTarget.style.color       = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                    setTooltip(null);
                  }}
                >
                  {tab.label}

                  {/* Count badge */}
                  {tab.id === 'investigators' && investigatorCount > 0 && (
                    <span style={{
                      background:   isActive ? 'var(--color-primary)' : 'var(--border-main)',
                      color:        isActive ? '#ffffff' : 'var(--text-muted)',
                      borderRadius: '10px',
                      fontSize:     '10px',
                      fontWeight:   '500',
                      padding:      '0px 6px',
                      lineHeight:   '1.6',
                    }}>
                      {investigatorCount}
                    </span>
                  )}

                  {/* Lock icon */}
                  {isSoon && (
                    <span style={{ fontSize: '10px', opacity: 0.4 }}>🔒</span>
                  )}
                </button>

                {/* Tooltip */}
                {tooltip?.id === tab.id && (
                  <div style={{
                    position:     'absolute',
                    top:          'calc(100% + 6px)',
                    left:         '50%',
                    transform:    'translateX(-50%)',
                    background:   'var(--text-primary)',
                    color:        'var(--bg-page)',
                    fontSize:     '11px',
                    padding:      '4px 10px',
                    borderRadius: '6px',
                    whiteSpace:   'nowrap',
                    pointerEvents:'none',
                    zIndex:       100,
                  }}>
                    Coming in {tab.version}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Right side — pushed to far right with marginLeft auto ── */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '8px',
          marginLeft: 'auto',
          flexShrink: 0,
        }}>

          {/* Import button */}
          {onImport && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '5px',
                  background:   'transparent',
                  border:       '1px solid var(--border-main)',
                  borderRadius: '8px',
                  padding:      '5px 12px',
                  cursor:       'pointer',
                  fontFamily:   'var(--font-sans)',
                  fontSize:     '13px',
                  color:        'var(--text-secondary)',
                  transition:   'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color       = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-main)';
                  e.currentTarget.style.color       = 'var(--text-secondary)';
                }}
              >
                📂 Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </>
          )}

          {/* Avatar */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                width:         '36px',
                height:        '36px',
                borderRadius:  '50%',
                background:    'var(--color-primary-light)',
                border:        `1.5px solid ${dropdownOpen ? 'var(--color-primary)' : 'var(--border-main)'}`,
                cursor:        'pointer',
                fontFamily:    'var(--font-sans)',
                fontSize:      '12px',
                fontWeight:    '500',
                color:         'var(--color-primary-dark)',
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
                transition:    'border-color 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={e => {
                if (!dropdownOpen)
                  e.currentTarget.style.borderColor = 'var(--border-main)';
              }}
            >
              {initials}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div style={{
                position:     'absolute',
                top:          'calc(100% + 8px)',
                right:        0,
                width:        '180px',
                background:   'var(--bg-card)',
                border:       '1px solid var(--border-main)',
                borderRadius: '12px',
                boxShadow:    'var(--shadow-dropdown)',
                overflow:     'hidden',
                zIndex:       100,
              }}>

                {/* Username only — no email */}
                <div style={{
                  padding:      '12px 16px 10px',
                  borderBottom: '1px solid var(--border-main)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize:   '15px',
                    color:      'var(--text-primary)',
                  }}>
                    {user?.username}
                  </div>
                </div>

                <div style={{ padding: '6px' }}>
                  <DropdownItem
                    label="Profile"
                    icon="👤"
                    onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  />
                  <DropdownItem
                    label="Preferences"
                    icon="⚙️"
                    onClick={() => { navigate('/preferences'); setDropdownOpen(false); }}
                  />
                  <div
                    onClick={toggleTheme}
                    style={{
                      display:       'flex',
                      alignItems:    'center',
                      gap:           '8px',
                      padding:       '8px 10px',
                      borderRadius:  '8px',
                      cursor:        'pointer',
                      fontFamily:    'var(--font-sans)',
                      fontSize:      '13px',
                      color:         'var(--text-secondary)',
                      transition:    'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--row-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>{theme === 'dark' ? '☀️' : '🌑'}</span>
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </div>

                  <div style={{
                    height:     '1px',
                    background: 'var(--border-main)',
                    margin:     '4px 0',
                  }} />

                  <DropdownItem
                    label="Sign Out"
                    icon="→"
                    onClick={handleLogout}
                    danger
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Dropdown menu item ─────────────────────────────────────
function DropdownItem({ label, icon, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '8px',
        width:      '100%',
        padding:    '8px 10px',
        borderRadius:'8px',
        background: 'transparent',
        border:     'none',
        cursor:     'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize:   '13px',
        color:      danger ? 'var(--danger)' : 'var(--text-secondary)',
        textAlign:  'left',
        transition: 'background 0.1s ease, color 0.1s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'var(--danger-bg)' : 'var(--row-hover)';
        if (!danger) e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color      = danger ? 'var(--danger)' : 'var(--text-secondary)';
      }}
    >
      <span style={{ fontSize: '14px' }}>{icon}</span>
      {label}
    </button>
  );
}