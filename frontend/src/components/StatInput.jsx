// A labeled number input for core CoC characteristics
// Shows the stat name, current value, and highlights on focus

export default function StatInput({ label, value, onChange, readOnly = false }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Stat label */}
      <span className="text-xs uppercase tracking-widest font-bold"
            style={{ color: '#b8860b' }}>
        {label}
      </span>

      {/* Value input */}
      <input
        type="number"
        min="1"
        max="99"
        value={value || ''}
        onChange={e => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        className="w-14 h-14 text-center text-xl font-bold rounded outline-none transition-all"
        style={{
          background:  readOnly ? '#1a1208' : '#0f0b07',
          border:      '2px solid #b8860b44',
          color:       '#f5f0e8',
          cursor:      readOnly ? 'default' : 'text',
        }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = '#b8860b'; }}
        onBlur={e  => { e.target.style.borderColor = '#b8860b44'; }}
      />
    </div>
  );
}