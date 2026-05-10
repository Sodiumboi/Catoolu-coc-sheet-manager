export default function CharacterCard({ character, onDelete, onOpen }) {
  const {
    id, name, occupation, game_type,
    sanity, hp, updated_at, portrait_data
  } = character;

  const lastUpdated = new Date(updated_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div
      onClick={() => onOpen(id)}          /* ← whole card is now clickable */
      className="rounded-lg border overflow-hidden transition-all duration-300
                 flex cursor-pointer select-none"
      style={{
        background:  'var(--bg-card, rgba(26,18,8,0.9))',
        borderColor: 'var(--border-main, #b8860b44)',
        boxShadow:   '0 4px 20px rgba(0,0,0,0.4)',
        minHeight:   '180px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent, #b8860b)';
        e.currentTarget.style.transform   = 'translateY(-2px)';
        e.currentTarget.style.boxShadow   = '0 8px 30px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-main, #b8860b44)';
        e.currentTarget.style.transform   = 'translateY(0)';
        e.currentTarget.style.boxShadow   = '0 4px 20px rgba(0,0,0,0.4)';
      }}
    >

      {/* ── LEFT: Portrait ── */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ width: '120px' }}>
        {portrait_data ? (
          <img
            src={`data:image/jpeg;base64,${portrait_data}`}
            alt={name}
            className="w-full h-full object-cover object-top"
            style={{ display: 'block' }}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{
              background:  'var(--bg-card, #1a1208)',
              borderRight: '1px solid var(--border-main, #b8860b22)',
            }}
          >
            <span style={{ fontSize: '2rem', opacity: 0.3 }}>🕵</span>
            <span className="text-xs text-center px-2"
                  style={{ color: 'var(--text-faint, #3d3530)' }}>
              No Portrait
            </span>
          </div>
        )}
        {/* Right-edge fade */}
        <div
          className="absolute inset-y-0 right-0 w-6 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent, var(--bg-card, rgba(26,18,8,0.9)))',
          }}
        />
      </div>

      {/* ── RIGHT: Info ── */}
      <div className="flex flex-col flex-1 p-4 min-w-0">

        {/* Name & Occupation */}
        <div className="mb-3 flex-1">
          <h3
            className="text-lg font-bold leading-tight truncate"
            style={{ color: 'var(--text-primary, #f5f0e8)', fontFamily: 'Georgia, serif' }}
          >
            {name}
          </h3>
          <p className="text-sm truncate mt-0.5" style={{ color: 'var(--accent, #b8860b)' }}>
            {occupation || 'Unknown Occupation'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted, #6b7280)' }}>
            {game_type}
          </p>
        </div>

        {/* Stat pills */}
        <div className="flex gap-2 mb-3">
          <StatPill label="SAN" value={sanity} color="#4ade80" />
          <StatPill label="HP"  value={hp}     color="#f87171" />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-2 border-t"
          style={{ borderColor: 'var(--border-main, #b8860b22)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-faint, #3d3530)' }}>
            {lastUpdated}
          </span>
          <div className="flex gap-2">
            {/* Open button — also navigates but kept for clarity */}
            <ActionButton
              label="Open"
              onClick={() => onOpen(id)}
              color="#b8860b"
            />
            {/* Delete — stopPropagation inside so card click doesn't fire */}
            <ActionButton
              label="Delete"
              onClick={() => onDelete(id, name)}
              color="#8b1a1a"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────

function StatPill({ label, value, color }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{
        background: 'var(--bg-input, #0f0b07)',
        border: `1px solid ${color}33`,
      }}
    >
      <span style={{ color: 'var(--text-muted, #6b7280)' }}>{label}</span>
      <span style={{ color, fontWeight: 'bold' }}>{value ?? '?'}</span>
    </div>
  );
}

function ActionButton({ label, onClick, color }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // prevent card click from also firing
        onClick();
      }}
      className="px-3 py-1 rounded text-xs font-medium transition-all duration-150"
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = `${color}44`}
      onMouseLeave={e => e.currentTarget.style.background = `${color}22`}
    >
      {label}
    </button>
  );
}