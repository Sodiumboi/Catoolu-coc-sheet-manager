import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ComingSoon from '../components/ComingSoon';

export default function InboxPage() {
  return (
    <div style={{
      minHeight:     '100vh',
      background:    'var(--bg-page)',
      display:       'flex',
      flexDirection: 'column',
    }}>
      <NavBar activeTab="inbox" />
      <ComingSoon
        tab="Inbox"
        version="v1.5 — Nyarlathotep"
        description="Notifications, Keeper messages, and session invites — all in one place."
        icon="📬"
      />
      <Footer />
    </div>
  );
}