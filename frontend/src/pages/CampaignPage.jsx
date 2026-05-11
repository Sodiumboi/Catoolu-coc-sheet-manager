import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ComingSoon from '../components/ComingSoon';

export default function CampaignPage() {
  return (
    <div style={{
      minHeight:     '100vh',
      background:    'var(--bg-page)',
      display:       'flex',
      flexDirection: 'column',
    }}>
      <NavBar activeTab="campaign" />
      <ComingSoon
        tab="Campaign"
        version="v1.5 — Nyarlathotep"
        description="Campaigns bring your group together — invite players, share a chatroom, and roll dice in real time."
        icon="⚔️"
      />
      <Footer />
    </div>
  );
}