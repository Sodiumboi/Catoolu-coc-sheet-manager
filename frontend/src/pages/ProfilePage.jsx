import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

function Section({ title, children }) {
  return (
    <div className="rounded-lg border mb-6"
         style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}>
      <div className="px-5 py-3 border-b"
           style={{ borderColor: 'var(--border-main)', background: 'var(--bg-section-hd)' }}>
        <h2 className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}>
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs uppercase tracking-widest mb-1"
             style={{ color: 'var(--accent)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, type = 'text', placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded text-sm outline-none"
      style={{
        background: 'var(--bg-input)',
        border:     '1px solid var(--border-input)',
        color:      'var(--text-primary)',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
      onBlur={e  => e.target.style.borderColor = 'var(--border-input)'}
    />
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  // Profile fields
  const [username,  setUsername]  = useState('');
  const [email,     setEmail]     = useState('');
  const [joinedAt,  setJoinedAt]  = useState('');

  // Password fields
  const [currentPw, setCurrentPw] = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Status
  const [profileMsg,  setProfileMsg]  = useState({ text: '', type: '' });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Load current profile on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/profile');
        const u   = res.data.user;
        setUsername(u.username);
        setEmail(u.email);
        setJoinedAt(new Date(u.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        }));
      } catch {
        setProfileMsg({ text: 'Could not load profile.', type: 'error' });
      }
    };
    load();
  }, []);

  // ── Save profile changes ─────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });
    setSavingProfile(true);
    try {
      const res = await apiClient.put('/profile', { username, email });

      // Update the stored user info so the nav bar reflects the new name
      const updatedUser = { ...user, username: res.data.user.username, email: res.data.user.email };
      localStorage.setItem('coc_user', JSON.stringify(updatedUser));

      setProfileMsg({ text: '✓ Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.error || 'Update failed.', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Save password change ─────────────────────────────────
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (newPw !== confirmPw) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (newPw.length < 8) {
      setPasswordMsg({ text: 'Password must be at least 8 characters.', type: 'error' });
      return;
    }

    setSavingPassword(true);
    try {
      await apiClient.put('/profile/password', {
        currentPassword: currentPw,
        newPassword:     newPw,
      });
      setPasswordMsg({ text: '✓ Password changed successfully!', type: 'success' });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.error || 'Password change failed.', type: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* Nav */}
       <NavBar activeTab={null} />

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Account Info (read-only) */}
        <Section title="Account Information">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                 style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '2px solid var(--border-main)' }}>
              {username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{username}</p>
              <p className="text-sm"   style={{ color: 'var(--text-muted)'  }}>{email}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                Member since {joinedAt}
              </p>
            </div>
          </div>
        </Section>

        {/* Edit Profile */}
        <Section title="Edit Profile">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <Field label="Username">
              <TextInput value={username} onChange={setUsername} placeholder="Your username" />
            </Field>
            <Field label="Email Address">
              <TextInput value={email} onChange={setEmail} type="email" placeholder="your@email.com" />
            </Field>

            {profileMsg.text && (
              <div className="text-sm px-3 py-2 rounded"
                   style={{
                     background: profileMsg.type === 'success' ? 'var(--success)22' : 'var(--danger)22',
                     color:      profileMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                     border:     `1px solid ${profileMsg.type === 'success' ? 'var(--success)' : 'var(--danger)'}44`,
                   }}>
                {profileMsg.text}
              </div>
            )}

            <button type="submit" disabled={savingProfile}
                    className="px-6 py-2 rounded text-sm font-bold transition-all"
                    style={{
                      background: savingProfile ? 'var(--text-muted)' : 'var(--accent)',
                      color:      'var(--bg-page)',
                      cursor:     savingProfile ? 'not-allowed' : 'pointer',
                    }}>
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </Section>

        {/* Change Password */}
        <Section title="Change Password">
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <Field label="Current Password">
              <TextInput value={currentPw} onChange={setCurrentPw} type="password" placeholder="Your current password" />
            </Field>
            <Field label="New Password">
              <TextInput value={newPw} onChange={setNewPw} type="password" placeholder="At least 8 characters" />
            </Field>
            <Field label="Confirm New Password">
              <TextInput value={confirmPw} onChange={setConfirmPw} type="password" placeholder="Same password again" />
              {confirmPw && confirmPw !== newPw && (
                <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>Passwords don't match</p>
              )}
            </Field>

            {passwordMsg.text && (
              <div className="text-sm px-3 py-2 rounded"
                   style={{
                     background: passwordMsg.type === 'success' ? 'var(--success)22' : 'var(--danger)22',
                     color:      passwordMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                     border:     `1px solid ${passwordMsg.type === 'success' ? 'var(--success)' : 'var(--danger)'}44`,
                   }}>
                {passwordMsg.text}
              </div>
            )}

            <button type="submit" disabled={savingPassword}
                    className="px-6 py-2 rounded text-sm font-bold transition-all"
                    style={{
                      background: savingPassword ? 'var(--text-muted)' : 'var(--accent)',
                      color:      'var(--bg-page)',
                      cursor:     savingPassword ? 'not-allowed' : 'pointer',
                    }}>
              {savingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </Section>

      </div>
      // bottom of return:
      <Footer />
    </div>
  );
}