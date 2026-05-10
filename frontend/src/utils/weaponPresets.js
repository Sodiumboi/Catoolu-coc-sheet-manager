// ============================================================
// Official CoC 7th Edition Weapon Presets
// Data sourced from the Keeper Rulebook & Investigator Handbook
// Organised by era and category
// ============================================================

export const WEAPON_PRESETS = [
  // ── Hand-to-Hand ─────────────────────────────────────────
  { category: 'Hand-to-Hand', name: 'Unarmed',             skillname: 'Brawl',    damage: '1D3+DB',   range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Knife, small',        skillname: 'Brawl',    damage: '1D4+DB',   range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Knife, large',        skillname: 'Brawl',    damage: '1D8+DB',   range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Club / Blackjack',    skillname: 'Brawl',    damage: '1D6+DB',   range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Hatchet',             skillname: 'Brawl',    damage: '1D6+1+DB', range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Axe, hand',           skillname: 'Brawl',    damage: '1D6+1+DB', range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Axe, large',          skillname: 'Brawl',    damage: '1D8+2+DB', range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Sword',               skillname: 'Fighting', damage: '1D8+DB',   range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Spear',               skillname: 'Fighting', damage: '1D8+1+DB', range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Baseball Bat',        skillname: 'Brawl',    damage: '1D8+DB',   range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Whip',                skillname: 'Fighting', damage: '1D3',      range: '5 yds', attacks: '1', ammo: '-',  malf: '-'   },
  { category: 'Hand-to-Hand', name: 'Garrote',             skillname: 'Brawl',    damage: '1D6',      range: 'Touch', attacks: '1', ammo: '-',  malf: '-'   },

  // ── Handguns (1920s) ──────────────────────────────────────
  { category: 'Handgun',      name: '.22 Derringer',        skillname: 'Firearms (Handgun)', damage: '1D6',      range: '10 yds',  attacks: '1',   ammo: '2',   malf: '100' },
  { category: 'Handgun',      name: '.32 Revolver',         skillname: 'Firearms (Handgun)', damage: '1D8',      range: '15 yds',  attacks: '1',   ammo: '6',   malf: '100' },
  { category: 'Handgun',      name: '.38 Revolver',         skillname: 'Firearms (Handgun)', damage: '1D10',     range: '15 yds',  attacks: '1',   ammo: '6',   malf: '100' },
  { category: 'Handgun',      name: '.45 Revolver',         skillname: 'Firearms (Handgun)', damage: '1D10+2',   range: '15 yds',  attacks: '1',   ammo: '6',   malf: '100' },
  { category: 'Handgun',      name: '.32 Automatic',        skillname: 'Firearms (Handgun)', damage: '1D8',      range: '15 yds',  attacks: '1',   ammo: '8',   malf: '99'  },
  { category: 'Handgun',      name: '.38 Automatic',        skillname: 'Firearms (Handgun)', damage: '1D10',     range: '15 yds',  attacks: '1',   ammo: '9',   malf: '99'  },
  { category: 'Handgun',      name: '.45 Automatic (M1911)',skillname: 'Firearms (Handgun)', damage: '1D10+2',   range: '15 yds',  attacks: '1',   ammo: '7',   malf: '99'  },
  { category: 'Handgun',      name: '9mm Automatic',        skillname: 'Firearms (Handgun)', damage: '1D10',     range: '15 yds',  attacks: '1',   ammo: '9',   malf: '99'  },
  { category: 'Handgun',      name: 'Luger P08 (9mm)',      skillname: 'Firearms (Handgun)', damage: '1D10',     range: '15 yds',  attacks: '1',   ammo: '8',   malf: '99'  },

  // ── Rifles ────────────────────────────────────────────────
  { category: 'Rifle',        name: 'Hunting Rifle (.30-06)',skillname: 'Firearms (Rifle)',  damage: '2D6+4',    range: '110 yds', attacks: '1',   ammo: '5',   malf: '100' },
  { category: 'Rifle',        name: 'Winchester Model 94',   skillname: 'Firearms (Rifle)',  damage: '2D6+4',    range: '110 yds', attacks: '1',   ammo: '7',   malf: '100' },
  { category: 'Rifle',        name: 'Springfield M1903',     skillname: 'Firearms (Rifle)',  damage: '2D6+4',    range: '110 yds', attacks: '1',   ammo: '5',   malf: '100' },
  { category: 'Rifle',        name: 'Lee-Enfield .303',      skillname: 'Firearms (Rifle)',  damage: '2D6+4',    range: '110 yds', attacks: '1',   ammo: '10',  malf: '100' },
  { category: 'Rifle',        name: 'Mauser Kar98k',         skillname: 'Firearms (Rifle)',  damage: '2D6+4',    range: '110 yds', attacks: '1',   ammo: '5',   malf: '100' },
  { category: 'Rifle',        name: 'Thompson SMG (.45)',     skillname: 'Firearms (Rifle)',  damage: '1D10+2',   range: '20 yds',  attacks: '3',   ammo: '20',  malf: '96'  },

  // ── Shotguns ──────────────────────────────────────────────
  { category: 'Shotgun',      name: 'Double Barrel 12g',     skillname: 'Firearms (Shotgun)', damage: '4D6/2D6/1D6', range: '10 yds', attacks: '2', ammo: '2', malf: '100' },
  { category: 'Shotgun',      name: 'Pump Action 12g',       skillname: 'Firearms (Shotgun)', damage: '4D6/2D6/1D6', range: '10 yds', attacks: '1', ammo: '5', malf: '100' },
  { category: 'Shotgun',      name: 'Single Barrel 12g',     skillname: 'Firearms (Shotgun)', damage: '4D6/2D6/1D6', range: '10 yds', attacks: '1', ammo: '1', malf: '100' },

  // ── Thrown ────────────────────────────────────────────────
  { category: 'Thrown',       name: 'Dynamite (1 stick)',    skillname: 'Throw',  damage: '4D6',      range: '10 yds', attacks: '1', ammo: '-', malf: '-' },
  { category: 'Thrown',       name: 'Hand Grenade (Mk II)',  skillname: 'Throw',  damage: '4D6',      range: '10 yds', attacks: '1', ammo: '-', malf: '-' },
  { category: 'Thrown',       name: 'Rock / Bottle',         skillname: 'Throw',  damage: '1D4+DB',   range: '10 yds', attacks: '1', ammo: '-', malf: '-' },

  // ── Modern ────────────────────────────────────────────────
  { category: 'Modern',       name: 'Glock 17 (9mm)',        skillname: 'Firearms (Handgun)', damage: '1D10',  range: '15 yds', attacks: '1', ammo: '17', malf: '99' },
  { category: 'Modern',       name: 'Desert Eagle (.50)',    skillname: 'Firearms (Handgun)', damage: '1D10+4',range: '15 yds', attacks: '1', ammo: '7',  malf: '99' },
  { category: 'Modern',       name: 'AR-15 / M16 (5.56mm)', skillname: 'Firearms (Rifle)',   damage: '2D6+1', range: '90 yds', attacks: '3', ammo: '30', malf: '99' },
  { category: 'Modern',       name: 'AK-47 (7.62mm)',        skillname: 'Firearms (Rifle)',   damage: '2D6+3', range: '90 yds', attacks: '3', ammo: '30', malf: '99' },
  { category: 'Modern',       name: 'Taser',                 skillname: 'Firearms (Handgun)', damage: 'Stun',  range: '5 yds',  attacks: '1', ammo: '1',  malf: '100'},
];

// Get unique categories for the filter dropdown
export const WEAPON_CATEGORIES = ['All', ...new Set(WEAPON_PRESETS.map(w => w.category))];