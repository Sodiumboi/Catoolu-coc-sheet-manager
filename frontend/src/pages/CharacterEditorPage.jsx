import { useState, useEffect, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import SkillGroup from '../components/SkillGroup';
import { WEAPON_PRESETS, WEAPON_CATEGORIES } from '../utils/weaponPresets';
import { useTheme } from '../context/ThemeContext';
import PortraitDisplay from '../components/PortraitDisplay';
import StatInput from '../components/StatInput';
import WeaponRow from '../components/WeaponRow';
import InvestigatorNotes from '../components/InvestigatorNotes';
import logo from '../assets/vault-logo.png';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import {
  recalculateAll,
  calcHalf,
  calcFifth,
  calcDodge,
} from '../utils/cocCalculations';

// ── Reusable section wrapper ───────────────────────────────
function Section({ title, children }) {
  return (
    <div className="rounded-lg border mb-6 overflow-hidden"
         style={{ borderColor: 'var(--border-main)', background: 'var(--bg-card)' }}>
      <div className="px-4 py-2 border-b"
           style={{ borderColor: 'var(--border-main)', background: 'var(--bg-section-hd)' }}>
        <h2 className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}>
          {title}
        </h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ── Backstory textarea ─────────────────────────────────────
function BackstoryField({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-xs uppercase tracking-widest mb-1"
             style={{ color: 'var(--accent)' }}>
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 rounded text-sm outline-none resize-y"
        style={{
          background: 'var(--bg-input)',
          border:     '1px solid var(--accent)33',
          color:      'var(--text-primary)',
          lineHeight: '1.6',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border-main)'}
      />
    </div>
  );
}

// ── Personal detail text input ─────────────────────────────
function DetailInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-1"
             style={{ color: 'var(--accent)' }}>
        {label}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded text-sm outline-none"
        style={{
          background: 'var(--bg-input)',
          border:     '1px solid var(--accent)33',
          color:      'var(--text-primary)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border-main)'}
      />
    </div>
  );
}

// ── Derived stat display box ───────────────────────────────
function DerivedStat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-lg font-bold py-2 rounded"
           style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--accent)22' }}>
        {value ?? '—'}
      </div>
    </div>
  );
}

// ── Stat box showing Reg / Half / Fifth ───────────────────
function StatBox({ label, value, onChange, sublabel }) {
  const num   = parseInt(value) || 0;
  const half  = Math.floor(num / 2);
  const fifth = Math.floor(num / 5);

  return (
    <div className="flex items-center gap-2">

      {/* Stat label — vertically centred next to the boxes */}
      <div className="flex flex-col items-center justify-center"
           style={{ width: '36px' }}>
        <span className="font-bold uppercase text-sm leading-none"
              style={{ color: 'var(--accent)' }}>
          {label}
        </span>
        {sublabel && (
          <span className="leading-none mt-0.5"
                style={{ color: 'var(--text-faint)', fontSize: '8px' }}>
            {sublabel}
          </span>
        )}
      </div>

      {/* Three boxes */}
      <div className="flex gap-1 items-end">

        {/* Reg — editable, large */}
        <div className="flex flex-col items-center">
          <span className="mb-0.5" style={{ color: 'var(--text-faint)', fontSize: '9px' }}>
            Reg
          </span>
          <input
            type="number" min="1" max="99"
            value={value || ''}
            onChange={e => onChange && onChange(e.target.value)}
            className="rounded outline-none font-bold"
            style={{
              width: '48px', height: '48px',
              fontSize: '1.2rem',
              textAlign: 'center',
              background: 'var(--bg-input)',
              border:     '2px solid var(--border-main)',
              color:      'var(--text-primary)',
              MozAppearance: 'textfield',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border-input)'}
          />
        </div>

        {/* Half */}
        <div className="flex flex-col items-center">
          <span className="mb-0.5" style={{ color: 'var(--text-faint)', fontSize: '9px' }}>½</span>
          <div className="rounded font-bold flex items-center justify-center"
               style={{
                 width: '38px', height: '38px', fontSize: '0.95rem',
                 textAlign: 'center',
                 background: 'var(--bg-input)',
                 border:     '1.5px solid var(--border-input)',
                 color:      'var(--text-muted)',
               }}>
            {half}
          </div>
        </div>

        {/* Fifth */}
        <div className="flex flex-col items-center">
          <span className="mb-0.5" style={{ color: 'var(--text-faint)', fontSize: '9px' }}>⅕</span>
          <div className="rounded font-bold flex items-center justify-center"
               style={{
                 width: '38px', height: '38px', fontSize: '0.95rem',
                 textAlign: 'center',
                 background: 'var(--bg-input)',
                 border:     '1.5px solid var(--border-input)',
                 color:      'var(--text-muted)',
               }}>
            {fifth}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tracked stat (Max + Current boxes) ────────────────────
function TrackedStat({ label, maxVal, currentVal, onChangeCurrent,
                       thirdLabel, thirdVal }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}>
        {label}
      </span>
      <div className="flex gap-2 items-end">

        <div className="flex flex-col items-center">
          <span className="text-xs mb-0.5"
                style={{ color: 'var(--text-faint)', fontSize: '9px' }}>
            Max
          </span>
          <div className="text-center font-bold rounded flex items-center justify-center"
               style={{
                 width: '44px', height: '44px', fontSize: '1.1rem',
                 background: 'var(--bg-input)',
                 border:     '1.5px solid var(--border-input)',
                 color:      'var(--text-muted)',
               }}>
            {maxVal ?? '—'}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs mb-0.5"
                style={{ color: 'var(--text-faint)', fontSize: '9px' }}>
            Current
          </span>
          <input
            type="number"
            value={currentVal ?? maxVal ?? ''}
            onChange={e => onChangeCurrent(e.target.value)}
            className="text-center font-bold rounded outline-none"
            style={{
              width: '44px', height: '44px', fontSize: '1.1rem',
              background: 'var(--bg-input)',
              border:     '2px solid var(--border-focus)',
              color:      'var(--text-primary)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border-focus)'}
          />
        </div>

        {thirdLabel && (
          <div className="flex flex-col items-center">
            <span className="text-xs mb-0.5"
                  style={{ color: 'var(--text-faint)', fontSize: '9px' }}>
              {thirdLabel}
            </span>
            <div className="text-center font-bold rounded flex items-center justify-center"
                 style={{
                   width: '44px', height: '44px', fontSize: '1.1rem',
                   background: 'var(--bg-input)',
                   border:     '1.5px solid var(--border-input)',
                   color:      'var(--text-muted)',
                 }}>
              {thirdVal ?? '—'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function CharacterEditorPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [sheet,   setSheet]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState(id);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  // ★ NEW — skill search filter
  const [skillSearch, setSkillSearch] = useState('');
  const [showPresets,     setShowPresets]     = useState(false);
  const [presetCategory,  setPresetCategory]  = useState('All');
  const [presetSearch,    setPresetSearch]    = useState('');

  // ★ NEW — ref for hidden portrait file input
  const { theme, toggleTheme, skillSize, setSkillSize } = useTheme();
  const portraitInputRef = useRef(null);

  // ── Load character ───────────────────────────────────────
  useEffect(() => {
    // Reset ALL state when the character ID changes
    // This prevents the old character's data from bleeding into the new render
    setCurrentId(id);
    setSheet(null);
    setError('');
    setLoading(true);
    setSaved(false);

    const fetch = async () => {
      try {
        const res = await apiClient.get(`/characters/${id}`);
        const data = res.data.character.sheet_data;

        if (!data || !data.Investigator) {
          setError('Character data is missing or in an unsupported format.');
          return;
        }

        // ── Normalise Dhole's House quirks ─────────────────
        // When a character has only 1 weapon, Dhole's House exports
        // it as a plain object {} instead of an array [{}]
        // We normalise it to always be an array so .map() never crashes
        const weapons = data.Investigator?.Weapons?.weapon;
        if (weapons && !Array.isArray(weapons)) {
          data.Investigator.Weapons.weapon = [weapons];
        }

        // Same normalisation for Possessions items
        const items = data.Investigator?.Possessions?.item;
        if (items && !Array.isArray(items)) {
          data.Investigator.Possessions.item = [items];
        }

        setSheet(data);

      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'Character not found.'
            : 'Could not load character. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // ── Shortcuts ────────────────────────────────────────────
  const inv     = sheet?.Investigator;
  const details = inv?.PersonalDetails    || {};
  const chars   = inv?.Characteristics   || {};
  const skills  = inv?.Skills?.Skill     || [];
  const weapons = inv?.Weapons?.weapon   || [];
  const back    = inv?.Backstory         || {};
  const items   = inv?.Possessions?.item || [];
  const cash    = inv?.Cash              || {};
  const portrait = details?.Portrait;

  // ── Generic deep updater ─────────────────────────────────
  const updateSheet = (updater) => {
    setSheet(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      updater(next);
      return next;
    });
  };

  // ── Personal details ─────────────────────────────────────
  const updateDetail = (field, value) => {
    updateSheet(s => { s.Investigator.PersonalDetails[field] = value; });
  };

  // ── Characteristics + derived recalc ────────────────────
  const updateChar = (field, value) => {
    updateSheet(s => {
      s.Investigator.Characteristics[field] = value;
      const updated = recalculateAll(
        { ...s.Investigator.Characteristics, [field]: value },
        s.Investigator.Skills?.Skill
      );
      s.Investigator.Characteristics = updated;

      if (!s.Investigator.Characteristics.HitPts) {
        s.Investigator.Characteristics.HitPts = updated.HitPtsMax;
      }
      if (!s.Investigator.Characteristics.MagicPts) {
        s.Investigator.Characteristics.MagicPts = updated.MagicPtsMax;
      }
      if (!s.Investigator.Characteristics.Sanity) {
        s.Investigator.Characteristics.Sanity = updated.SanityStart;
      }
      if (!s.Investigator.Characteristics.Luck) {
        s.Investigator.Characteristics.Luck = updated.LuckMax;
      }

      s.Investigator.Combat.Dodge = {
        value: String(calcDodge(updated.DEX)),
        half:  String(calcHalf(calcDodge(updated.DEX))),
        fifth: String(calcFifth(calcDodge(updated.DEX))),
      };
    });
  };

  // ── Skills ───────────────────────────────────────────────
  const updateSkill = (index, updatedSkill) => {
    updateSheet(s => {
      s.Investigator.Skills.Skill[index] = {
        ...updatedSkill,
        half:  String(calcHalf(parseInt(updatedSkill.value) || 0)),
        fifth: String(calcFifth(parseInt(updatedSkill.value) || 0)),
      };
      if (updatedSkill.name === 'Cthulhu Mythos') {
        s.Investigator.Characteristics.SanityMax = String(99 - (parseInt(updatedSkill.value) || 0));
      }
    });
  };

  // ── Backstory ────────────────────────────────────────────
  const updateBack = (field, value) => {
    updateSheet(s => { s.Investigator.Backstory[field] = value; });
  };

  // ★ NEW — Portrait upload handler ────────────────────────
  const handlePortraitUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only accept images
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      // result is "data:image/jpeg;base64,/9j/4AAQ..."
      // We strip the prefix to store just the base64 string
      const base64 = evt.target.result.split(',')[1];
      updateSheet(s => { s.Investigator.PersonalDetails.Portrait = base64; });
    };
    reader.readAsDataURL(file);

    // Reset so the same file can be re-selected if needed
    e.target.value = '';
  };

  // ★ NEW — Weapon handlers ────────────────────────────────
  const updateWeapon = (index, updated) => {
    updateSheet(s => { s.Investigator.Weapons.weapon[index] = updated; });
  };

  const deleteWeapon = (index) => {
    updateSheet(s => {
      s.Investigator.Weapons.weapon.splice(index, 1);
    });
  };

  const addWeapon = () => {
    const blank = {
      name: 'New Weapon', skillname: 'Brawl',
      regular: '—', hard: '—', extreme: '—',
      damage: '1D4', range: 'Touch', attacks: '1',
      ammo: '—', malf: '—',
    };
    updateSheet(s => {
      if (!s.Investigator.Weapons) s.Investigator.Weapons = { weapon: [] };
      s.Investigator.Weapons.weapon.push(blank);
    });
  };

  // ★ NEW — Possession handlers ────────────────────────────
  const updatePossession = (index, value) => {
    updateSheet(s => { s.Investigator.Possessions.item[index].description = value; });
  };

  const deletePossession = (index) => {
    updateSheet(s => { s.Investigator.Possessions.item.splice(index, 1); });
  };

  const addPossession = () => {
    updateSheet(s => {
      if (!s.Investigator.Possessions) s.Investigator.Possessions = { item: [] };
      s.Investigator.Possessions.item.push({ description: 'New Item' });
    });
  };

  // ★ NEW — Cash handlers ──────────────────────────────────
  const updateCash = (field, value) => {
    updateSheet(s => { s.Investigator.Cash[field] = value; });
  };

  // ── Save ─────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiClient.put(`/characters/${id}`, { sheet_data: sheet });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Export JSON ──────────────────────────────────────────
  const handleExport = () => {
    const hasNotes = inv?.Notes && inv.Notes.trim() !== '' && inv.Notes !== '<br>';
    if (hasNotes) {
      const confirmed = window.confirm(
        '⚠ Session Notes are not included in the JSON export.\n\n' +
        'Your notes are saved in the database and will still be here ' +
        'when you return. Only the character sheet data will be exported.\n\n' +
        'Continue with export?'
      );
      if (!confirmed) return;
    }

    const exportData = JSON.parse(JSON.stringify(inv));
    delete exportData.Notes;

    const output = JSON.stringify({ Investigator: exportData }, null, 2);
    const blob   = new Blob([output], { type: 'application/json' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href       = url;
    a.download   = `${details.Name || 'character'}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ★ NEW — Filtered skills for search ─────────────────────
  const filteredSkillIndices = skills
    .map((skill, index) => ({ skill, index }))
    .filter(({ skill }) => {
      if (!skillSearch.trim()) return true;
      const q    = skillSearch.toLowerCase();
      const name = skill.name.toLowerCase();
      const sub  = (skill.subskill || '').toLowerCase();
      return name.includes(q) || sub.includes(q);
    });

  // ★ NEW — Split filtered skills into left and right columns
  const half        = Math.ceil(filteredSkillIndices.length / 2);
  const leftSkills  = filteredSkillIndices.slice(0, half);
  const rightSkills = filteredSkillIndices.slice(half);

  // ── Loading / error states ───────────────────────────────
  // Sheet hasn't loaded yet OR is between navigation states
  if (loading || (!sheet && !error) || currentId !== id) return (
    <div className="flex items-center justify-center min-h-screen"
         style={{ background: 'var(--bg-page)' }}>
      <div className="text-center">
        <img src={logo} alt="The Catoolu"
               className="object-contain flex-shrink-0"
               style={{ width: '32px', height: '32px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading investigator file...</p>
      </div>
    </div>
  );

  if (error && !sheet) return (
    <div className="flex items-center justify-center min-h-screen"
         style={{ background: 'var(--bg-page)' }}>
      <div className="text-center">
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <button onClick={() => navigate('/dashboard')}
                className="mt-4 px-4 py-2 rounded text-sm"
                style={{ background: 'var(--accent)', color: 'var(--bg-page)' }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-input)' }}>

      {/* ── Sticky Top Bar ── */}
      {/* ── NavBar (shared) ── */}
      <NavBar activeTab="investigators" />

      {/* ── Editor top bar (character-specific controls) ── */}
      <div style={{
        position:      'sticky',
        top:           '56px',
        zIndex:        40,
        borderBottom:  '1px solid var(--border-main)',
        padding:       '8px 24px',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
        background:    'var(--bg-nav)',
        backdropFilter:'blur(8px)',
      }}>
        {/* Left: back button + character name */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
                  style={{
                    fontSize:    '13px',
                    padding:     '5px 12px',
                    borderRadius:'7px',
                    border:      '1px solid var(--border-main)',
                    background:  'transparent',
                    color:       'var(--accent)',
                    cursor:      'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            ← Dashboard
          </button>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--text-primary)', margin: 0 }}>
              {details.Name || 'Investigator'}
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--accent)', margin: 0 }}>
              {details.Occupation} · {inv?.Header?.GameType}
            </p>
          </div>
        </div>

        {/* Right: status + export + save */}
        <div className="flex items-center gap-3">
          {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>⚠ {error}</span>}
          {saved && <span style={{ fontSize: '12px', color: 'var(--success)' }}>✓ Saved!</span>}

          <button onClick={handleExport}
                  style={{
                    padding:      '6px 14px',
                    borderRadius: '8px',
                    fontSize:     '13px',
                    border:       '1px solid var(--success)',
                    background:   'transparent',
                    color:        'var(--success)',
                    cursor:       'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            ↓ Export JSON
          </button>

          <button onClick={handleSave} disabled={saving}
                  style={{
                    padding:      '6px 14px',
                    borderRadius: '8px',
                    fontSize:     '13px',
                    fontWeight:   '500',
                    border:       'none',
                    background:   saving ? 'var(--text-muted)' : 'var(--accent)',
                    color:        '#ffffff',
                    cursor:       saving ? 'not-allowed' : 'pointer',
                  }}>
            {saving ? 'Saving...' : '💾 Save'}
          </button>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ══ PERSONAL DETAILS + PORTRAIT ══ */}
        <Section title="Personal Details">
          <div className="flex gap-6">

            {/* ★ NEW — Clickable portrait with upload overlay */}
            <PortraitDisplay
              portrait={portrait}
              onUploadClick={() => portraitInputRef.current?.click()}
            />
            <input
              ref={portraitInputRef}
              type="file"
              accept="image/*"
              onChange={handlePortraitUpload}
              className="hidden"
            />

            {/* Detail fields */}
            <div className="flex-1 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DetailInput label="Name"       value={details.Name}       onChange={v => updateDetail('Name', v)} />
              <DetailInput label="Occupation" value={details.Occupation} onChange={v => updateDetail('Occupation', v)} />
              <DetailInput label="Age"        value={details.Age}        onChange={v => updateDetail('Age', v)} />
              <DetailInput label="Gender"     value={details.Gender}     onChange={v => updateDetail('Gender', v)} />
              <DetailInput label="Birthplace" value={details.Birthplace} onChange={v => updateDetail('Birthplace', v)} />
              <DetailInput label="Residence"  value={details.Residence}  onChange={v => updateDetail('Residence', v)} />
            </div>
          </div>
        </Section>

        {/* ══ CHARACTERISTICS ══ */}
        <Section title="Characteristics">

          <div className="flex gap-6 mb-6 items-start flex-wrap">

            {/* Left column */}
            <div className="flex flex-col gap-3">
              {[
                { key: 'STR' },
                { key: 'CON' },
                { key: 'DEX' },
                { key: 'INT', sub: 'IDEA' },
              ].map(({ key, sub }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm font-bold uppercase w-8 text-right"
                        style={{ color: 'var(--accent)' }}>
                    {key}
                    {sub && <span className="block text-xs font-normal"
                                  style={{ color: 'var(--text-faint)', fontSize: '8px' }}>
                      {sub}
                    </span>}
                  </span>
                  <StatBox value={chars[key]} onChange={v => updateChar(key, v)} />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px self-stretch"
                 style={{ background: 'var(--border-main)' }} />

            {/* Right column */}
            <div className="flex flex-col gap-3">
              {[
                { key: 'SIZ' },
                { key: 'POW' },
                { key: 'APP' },
                { key: 'EDU', sub: 'KNOW' },
              ].map(({ key, sub }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm font-bold uppercase w-8 text-right"
                        style={{ color: 'var(--accent)' }}>
                    {key}
                    {sub && <span className="block text-xs font-normal"
                                  style={{ color: 'var(--text-faint)', fontSize: '8px' }}>
                      {sub}
                    </span>}
                  </span>
                  <StatBox value={chars[key]} onChange={v => updateChar(key, v)} />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px self-stretch"
                 style={{ background: 'var(--border-main)' }} />

            {/* Tracked stats column */}
            <div className="flex flex-col gap-3 justify-center">
              <TrackedStat
                label="Hit Points"
                maxVal={chars.HitPtsMax}
                currentVal={chars.HitPts}
                onChangeCurrent={v => updateSheet(s => {
                  s.Investigator.Characteristics.HitPts = v;
                })}
              />
              <TrackedStat
                label="Magic Points"
                maxVal={chars.MagicPtsMax}
                currentVal={chars.MagicPts}
                onChangeCurrent={v => updateSheet(s => {
                  s.Investigator.Characteristics.MagicPts = v;
                })}
              />
              <TrackedStat
                label="Luck"
                maxVal={chars.LuckMax}
                currentVal={chars.Luck}
                onChangeCurrent={v => updateSheet(s => {
                  s.Investigator.Characteristics.Luck = v;
                })}
              />
              <TrackedStat
                label="Sanity"
                maxVal={chars.SanityStart}
                currentVal={chars.Sanity}
                onChangeCurrent={v => updateSheet(s => {
                  s.Investigator.Characteristics.Sanity = v;
                })}
                thirdLabel="Insane"
                thirdVal={chars.SanityMax}
              />
            </div>

            {/* Divider */}
            <div className="w-px self-stretch"
                 style={{ background: 'var(--border-main)' }} />

            {/* Notes column */}
            <div className="flex-1" style={{ minWidth: '220px', maxWidth: '360px' }}>
              <InvestigatorNotes
                characterId={id}
                initialNotes={inv?.Notes || ''}
                onSave={notes => updateSheet(s => {
                  s.Investigator.Notes = notes;
                })}
              />
            </div>
          </div>

          <div className="border-t mb-4"
               style={{ borderColor: 'var(--border-main)' }} />

          {/* ── Damage Bonus / Build / Dodge / Move ── */}
          <div className="flex gap-6 flex-wrap justify-center">
            <ReadOnlyBadge label="Damage Bonus"
                           value={chars.DamageBonus || 'None'}
                           color="var(--danger)" />
            <ReadOnlyBadge label="Build"
                           value={chars.Build}
                           color="var(--text-primary)" />
            <ReadOnlyBadge label="Dodge"
                           value={inv?.Combat?.Dodge?.value
                             || calcDodge(chars.DEX)}
                           color="#60a5fa" />
            <ReadOnlyBadge label="Move"
                           value={chars.Move}
                           color="var(--text-primary)" />
          </div>
        </Section>

        {/* ══ SKILLS ══ */}
        <Section title="Skills">
          <div className="mb-3 flex items-center gap-4 flex-wrap">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent)' }}>●</span> = Occupation skill &nbsp;·&nbsp;
              ½ and ⅕ update automatically
            </p>
            {/* Skill search */}
            <input
              type="text"
              placeholder="🔍 Search skills..."
              value={skillSearch}
              onChange={e => setSkillSearch(e.target.value)}
              className="ml-auto px-3 py-1 rounded text-xs outline-none"
              style={{
                background: 'var(--bg-input)', border: '1px solid var(--border-input)',
                color: 'var(--text-primary)', width: '180px',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
              onBlur={e  => e.target.style.borderColor = 'var(--border-input)'}
            />
          </div>

          <SkillGroup
            skills={
              skillSearch.trim()
                ? skills.filter(s => {
                    const q = skillSearch.toLowerCase();
                    return s.name.toLowerCase().includes(q) ||
                           (s.subskill || '').toLowerCase().includes(q);
                  })
                : skills
            }
            onChangeSkill={updateSkill}
          />
        </Section>

        {/* ══ WEAPONS & COMBAT ══ */}
        <Section title="Weapons & Combat">

          {/* Weapon table */}
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-main)' }}>
                  {['Weapon','Skill','Reg','Hard','Ext','Damage','Range','Attacks',''].map((h,i) => (
                    <th key={i} className="text-left py-2 pl-2 text-xs uppercase tracking-widest"
                        style={{ color: 'var(--accent)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weapons.map((weapon, i) => (
                  <WeaponRow
                    key={i} weapon={weapon} index={i}
                    onChange={updateWeapon} onDelete={deleteWeapon}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={addWeapon}
                    className="px-4 py-2 rounded text-xs font-medium transition-all"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--border-main)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-bg)'}>
              + Add Blank Weapon
            </button>

            <button onClick={() => setShowPresets(p => !p)}
                    className="px-4 py-2 rounded text-xs font-medium transition-all"
                    style={{
                      background: showPresets ? 'var(--accent)' : 'var(--accent-bg)',
                      color:      showPresets ? 'var(--bg-page)' : 'var(--accent)',
                      border:     '1.5px solid var(--border-input)',
                    }}>
              📋 {showPresets ? 'Hide Presets' : 'Add from Preset List'}
            </button>
          </div>

          {/* ── Weapon Preset Picker ── */}
          {showPresets && (
            <div className="mt-4 rounded-lg border overflow-hidden"
                 style={{ borderColor: 'var(--border-main)', background: 'var(--bg-input)' }}>

              {/* Filter bar */}
              <div className="p-3 border-b flex gap-2 flex-wrap items-center"
                   style={{ borderColor: 'var(--border-main)', background: 'var(--bg-section-hd)' }}>
                <span className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: 'var(--accent)' }}>
                  Official CoC 7e Weapons
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={presetSearch}
                  onChange={e => setPresetSearch(e.target.value)}
                  className="px-2 py-1 rounded text-xs outline-none"
                  style={{
                    background: 'var(--bg-input)', border: '1px solid var(--border-input)',
                    color: 'var(--text-primary)', width: '140px',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border-input)'}
                />
                <select
                  value={presetCategory}
                  onChange={e => setPresetCategory(e.target.value)}
                  className="px-2 py-1 rounded text-xs outline-none"
                  style={{
                    background: 'var(--bg-input)', border: '1px solid var(--border-input)',
                    color: 'var(--text-primary)',
                  }}>
                  {WEAPON_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Preset list */}
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <table className="w-full text-xs">
                  <thead className="sticky top-0"
                         style={{ 
                           background: 'var(--bg-nav)',
                           boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                         }}>
                    <tr className="border-b" style={{ borderColor: 'var(--border-main)' }}>
                      <th className="text-left py-2 pl-3" style={{ color: 'var(--accent)' }}>Weapon</th>
                      <th className="text-left py-2"      style={{ color: 'var(--accent)' }}>Skill</th>
                      <th className="text-left py-2"      style={{ color: 'var(--accent)' }}>Damage</th>
                      <th className="text-left py-2"      style={{ color: 'var(--accent)' }}>Range</th>
                      <th className="text-left py-2"      style={{ color: 'var(--accent)' }}>Ammo</th>
                      <th className="py-2 pr-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {WEAPON_PRESETS
                      .filter(w => {
                        const matchCat = presetCategory === 'All' || w.category === presetCategory;
                        const matchQ   = !presetSearch.trim() ||
                          w.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
                          w.skillname.toLowerCase().includes(presetSearch.toLowerCase());
                        return matchCat && matchQ;
                      })
                      .map((preset, i) => (
                        <tr key={i}
                            className="border-b transition-colors"
                            style={{ borderColor: 'var(--border-main)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--row-hover)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td className="py-1.5 pl-3" style={{ color: 'var(--text-primary)' }}>
                            {preset.name}
                          </td>
                          <td className="py-1.5" style={{ color: 'var(--text-secondary)' }}>
                            {preset.skillname}
                          </td>
                          <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>
                            {preset.damage}
                          </td>
                          <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>
                            {preset.range}
                          </td>
                          <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>
                            {preset.ammo}
                          </td>
                          <td className="py-1.5 pr-3 text-right">
                            <button
                              onClick={() => {
                                // Calculate skill values from the character sheet
                                const skillMatch = skills.find(s =>
                                  s.name.toLowerCase().includes(
                                    preset.skillname.toLowerCase().split('(')[0].trim()
                                  )
                                );
                                const baseVal = skillMatch?.value || '—';
                                const hard    = skillMatch
                                  ? String(Math.floor(parseInt(skillMatch.value) / 2))
                                  : '—';
                                const extreme = skillMatch
                                  ? String(Math.floor(parseInt(skillMatch.value) / 5))
                                  : '—';

                                updateSheet(s => {
                                  s.Investigator.Weapons.weapon.push({
                                    name:      preset.name,
                                    skillname: preset.skillname,
                                    regular:   baseVal,
                                    hard,
                                    extreme,
                                    damage:    preset.damage,
                                    range:     preset.range,
                                    attacks:   preset.attacks,
                                    ammo:      preset.ammo,
                                    malf:      preset.malf,
                                  });
                                });
                              }}
                              className="px-2 py-0.5 rounded font-medium transition-all"
                              style={{
                                background: 'var(--accent-bg)',
                                color:      'var(--accent)',
                                border:     '1.5px solid var(--border-input)',
                                fontSize:   '10px',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-bg)'}>
                              + Add
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Section>

        {/* ══ BACKSTORY ══ */}
        <Section title="Backstory & Psychology">
          <BackstoryField label="Description"           value={back.description}  onChange={v => updateBack('description', v)} />
          <BackstoryField label="Traits"                value={back.traits}       onChange={v => updateBack('traits', v)} />
          <BackstoryField label="Ideology & Beliefs"    value={back.ideology}     onChange={v => updateBack('ideology', v)} />
          <BackstoryField label="Significant People"    value={back.people}       onChange={v => updateBack('people', v)} />
          <BackstoryField label="Phobias & Manias"      value={back.phobias}      onChange={v => updateBack('phobias', v)} />
          <BackstoryField label="Meaningful Locations"  value={back.locations}    onChange={v => updateBack('locations', v)} />
          <BackstoryField label="Treasured Possessions" value={back.possessions}  onChange={v => updateBack('possessions', v)} />
          <BackstoryField label="Tomes & Artefacts"     value={back.tomes}        onChange={v => updateBack('tomes', v)} />
        </Section>

        {/* ══ POSSESSIONS ══ */}
        <Section title="Possessions & Equipment">

          {/* ★ NEW — Editable possession items with delete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>◆</span>
                <input
                  type="text"
                  value={item.description}
                  onChange={e => updatePossession(i, e.target.value)}
                  className="flex-1 px-2 py-1 rounded text-sm outline-none"
                  style={{
                    background: 'var(--bg-input)',
                    border:     '1px solid var(--accent)22',
                    color:      'var(--text-primary)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--accent-bg)'}
                />
                <button
                  onClick={() => deletePossession(i)}
                  className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 transition-all"
                  style={{ color: 'var(--danger)', border: '1px solid var(--danger)33' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--danger)22'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* ★ NEW — Add possession button */}
          <button
            onClick={addPossession}
            className="px-4 py-2 rounded text-xs font-medium transition-all"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent)44' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border-main)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-bg)'}>
            + Add Item
          </button>
        </Section>

        {/* ══ FINANCIAL STATUS ══ */}
        <Section title="Financial Status">

          {/* ★ NEW — Editable cash fields */}
          <div className="flex gap-4 flex-wrap">
            {[
              { label: 'Spending Limit', field: 'spending' },
              { label: 'Cash on Hand',   field: 'cash'     },
              { label: 'Assets',         field: 'assets'   },
            ].map(({ label, field }) => (
              <div key={field} className="flex flex-col items-center">
                <label className="text-xs uppercase tracking-widest mb-1"
                       style={{ color: 'var(--accent)' }}>
                  {label}
                </label>
                <input
                  type="text"
                  value={cash[field] || ''}
                  onChange={e => updateCash(field, e.target.value)}
                  className="text-center px-3 py-2 rounded text-base font-bold outline-none"
                  style={{
                    background: 'var(--bg-input)',
                    border:     '1px solid var(--accent)33',
                    color:      'var(--success)',
                    width:      '140px',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border-main)'}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ── Bottom action bar ── */}
        <div className="flex justify-end gap-3 mt-2 pb-8">
          <button onClick={handleExport}
                  className="px-6 py-3 rounded text-sm font-medium transition-all"
                  style={{ background: '#1a3a1a', color: 'var(--success)', border: '1px solid var(--success)33' }}>
            ↓ Export JSON
          </button>
          <button onClick={handleSave} disabled={saving}
                  className="px-6 py-3 rounded text-sm font-bold"
                  style={{ background: saving ? '#6b5000' : 'var(--accent)', color: 'var(--bg-input)' }}>
            {saving ? 'Saving...' : '💾 Save Character'}
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
}

// ── Skill table column headers (shared by both columns) ────
function SkillTableHeader() {
  return (
    <tr className="border-b" style={{ borderColor: 'var(--border-main)' }}>
      <th className="w-3" />
      <th className="text-left py-1.5 pl-1 text-xs uppercase tracking-widest"
          style={{ color: 'var(--accent)' }}>Skill</th>
      <th className="text-center py-1.5 text-xs uppercase tracking-widest"
          style={{ color: 'var(--accent)' }}>Val</th>
      <th className="text-center py-1.5 text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}>½</th>
      <th className="text-center py-1.5 pr-2 text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}>⅕</th>
    </tr>
  );
}

// ── Read-only badge (Damage Bonus, Build, Dodge) ───────────
function ReadOnlyBadge({ label, value, color }) {
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
        {label}
      </div>
      <div className="text-lg font-bold px-4 py-2 rounded"
           style={{ background: 'var(--bg-input)', color, border: '1px solid var(--accent)33' }}>
        {value ?? '—'}
      </div>
    </div>
  );
}