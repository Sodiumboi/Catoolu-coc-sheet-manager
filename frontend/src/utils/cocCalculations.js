// ============================================================
// Call of Cthulhu 7th Edition — Rules Calculation Engine
// All functions are pure (input → output, no side effects)
// Used by the Character Editor for live stat updates
// ============================================================

/**
 * Calculate Maximum Hit Points
 * Formula: floor((CON + SIZ) / 10)
 */
export function calcMaxHP(con, siz) {
  const c = parseInt(con) || 0;
  const s = parseInt(siz) || 0;
  return Math.floor((c + s) / 10);
}

/**
 * Calculate Maximum Magic Points
 * Formula: floor(POW / 5)
 */
export function calcMaxMP(pow) {
  const p = parseInt(pow) || 0;
  return Math.floor(p / 5);
}

/**
 * Calculate Starting Sanity
 * Formula: POW (as a number)
 */
export function calcStartingSanity(pow) {
  return parseInt(pow) || 0;
}

/**
 * Calculate Maximum Sanity
 * Formula: 99 - Cthulhu Mythos skill value
 */
export function calcMaxSanity(cthulhuMythos) {
  const cm = parseInt(cthulhuMythos) || 0;
  return 99 - cm;
}

/**
 * Calculate Damage Bonus and Build
 * Based on STR + SIZ combined score
 *
 * STR+SIZ | Damage Bonus | Build
 * 2–64    | -2           | -2
 * 65–84   | -1           | -1
 * 85–124  | None         | 0
 * 125–164 | +1D4         | 1
 * 165–204 | +1D6         | 2
 * 205–284 | +2D6         | 3
 * 285–364 | +3D6         | 4
 * 365–444 | +4D6         | 5
 */
export function calcDamageBonusAndBuild(str, siz) {
  const total = (parseInt(str) || 0) + (parseInt(siz) || 0);

  if (total <= 64)  return { damageBonus: '-2',   build: -2 };
  if (total <= 84)  return { damageBonus: '-1',   build: -1 };
  if (total <= 124) return { damageBonus: 'None', build:  0 };
  if (total <= 164) return { damageBonus: '+1D4', build:  1 };
  if (total <= 204) return { damageBonus: '+1D6', build:  2 };
  if (total <= 284) return { damageBonus: '+2D6', build:  3 };
  if (total <= 364) return { damageBonus: '+3D6', build:  4 };
  return              { damageBonus: '+4D6', build:  5 };
}

/**
 * Calculate Dodge base value
 * Formula: floor(DEX / 2)
 */
export function calcDodge(dex) {
  return Math.floor((parseInt(dex) || 0) / 2);
}

/**
 * Calculate Move Rate
 * Rules:
 * - Both STR and DEX < SIZ → MOV 7
 * - Both STR and DEX > SIZ → MOV 9
 * - Otherwise              → MOV 8
 * (Age penalties applied separately in full rules)
 */
export function calcMove(str, dex, siz) {
  const s = parseInt(str) || 0;
  const d = parseInt(dex) || 0;
  const sz = parseInt(siz) || 0;

  if (s < sz && d < sz) return 7;
  if (s > sz && d > sz) return 9;
  return 8;
}

/**
 * Calculate skill half value
 * Formula: floor(value / 2)
 */
export function calcHalf(value) {
  return Math.floor((parseInt(value) || 0) / 2);
}

/**
 * Calculate skill fifth value
 * Formula: floor(value / 5)
 */
export function calcFifth(value) {
  return Math.floor((parseInt(value) || 0) / 5);
}

/**
 * Recalculate ALL derived stats from a full sheet
 * Returns updated Characteristics object
 */
export function recalculateAll(characteristics, skills) {
  const { STR, DEX, CON, POW, SIZ, INT, APP, EDU } = characteristics;

  const maxHP  = calcMaxHP(CON, SIZ);
  const maxMP  = calcMaxMP(POW);
  const sanity = calcStartingSanity(POW);

  // Find Cthulhu Mythos skill value for MaxSanity calc
  const mythosSkill = skills?.find(s => s.name === 'Cthulhu Mythos');
  const mythosValue = mythosSkill?.value || '0';
  const maxSanity   = calcMaxSanity(mythosValue);

  const { damageBonus, build } = calcDamageBonusAndBuild(STR, SIZ);
  const dodge = calcDodge(DEX);
  const move  = calcMove(STR, DEX, SIZ);

  return {
    ...characteristics,
    HitPtsMax:    String(maxHP),
    MagicPtsMax:  String(maxMP),
    MagicPts:     String(maxMP),
    SanityStart:  String(sanity),
    SanityMax:    String(maxSanity),
    DamageBonus:  damageBonus,
    Build:        String(build),
    Move:         String(move),
  };
}