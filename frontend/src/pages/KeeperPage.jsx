import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ComingSoon from '../components/ComingSoon';

export default function KeeperPage() {
  return (
    <div style={{
      minHeight:     '100vh',
      background:    'var(--bg-page)',
      display:       'flex',
      flexDirection: 'column',
    }}>
      <NavBar activeTab="keeper" />
      <ComingSoon
        tab="Keeper"
        version="v1.5 — Nyarlathotep"
        description="The Keeper's Screen — live view of all investigator stats, push sanity loss and damage, manage handouts and NPCs."
        icon="🎭"
      />
      <Footer />
    </div>
  );
}