/**
 * Layer 2 — Plan data
 *
 * One house: St. Regis Miami UPH A + UPH B combined into a single
 * full-floor duplex + private roof (no A/B demising neighbor).
 *
 * Approx. scale: ~1,850 m² interior · ~1,000 m² exterior (A+B totals).
 * Plate: 46 × 26 m full floor (~1,196 m²) each main level.
 *
 * Units: meters. Origin at plan center.
 * +X = east · −X = west · +Z = entry (south) · −Z = view (north)
 */

export const LEVEL = {
  H: 3.6,
  L2: 3.8,
  roof: 7.4,
  pavilionH: 2.8,
  wallT: 0.2,
  wallExt: 0.25,
  slab: 0.3,
}

export const PLAN_META = {
  title: 'Dream House — Full-Floor Duplex',
  subtitle: 'UPH A+B combined · ~1,850 m² interior · private roof pool',
  units: 'm',
  xMin: -26,
  xMax: 26,
  zMin: -18,
  zMax: 16,
  envelope: { x0: -23, x1: 23, z0: -13, z1: 13 },
  terrace: { x0: -21, x1: 21, z0: -17, z1: -13 },
  glassLineZ: -13,
  scaleBarMeters: 5,
  plateW: 46,
  plateD: 26,
  reference: 'St. Regis Residences Miami UPH A + UPH B as one residence',
}

const T = LEVEL.wallT
const Te = LEVEL.wallExt
const E = PLAN_META.envelope

function W(id, ax, az, bx, bz, opts = {}) {
  return {
    id,
    ax,
    az,
    bx,
    bz,
    thickness: opts.thickness ?? T,
    kind: opts.kind ?? 'interior',
    level: opts.level ?? 1,
    ...(opts.freeEnd ? { freeEnd: opts.freeEnd } : {}),
    ...(opts.openings ? { openings: opts.openings } : {}),
  }
}

// ─── Level 1 — Main living (full floor social) ──────────────────────────────
// Program merged from UPH A/B upper levels: great room, dining, kitchen,
// breakfast, family, catering, foyer, gallery, service, powders.

export const L1_ROOMS = [
  { id: 'foyer', name: 'Foyer', level: 1, x0: -4, x1: 4, z0: 8, z1: 13, note: 'Private elevator' },
  { id: 'elev', name: 'Elev. vestibule', level: 1, x0: -2, x1: 2, z0: 5, z1: 8, note: '', corridor: true },
  { id: 'gallery', name: 'Gallery', level: 1, x0: -2.5, x1: 2.5, z0: -1, z1: 5, note: 'Former A|B spine', corridor: true },
  { id: 'great', name: 'Great Room', level: 1, x0: -21, x1: -2.5, z0: -11, z1: 2, note: 'Merged living', void: true },
  { id: 'dining', name: 'Dining', level: 1, x0: 2.5, x1: 12, z0: -11, z1: -3, note: '' },
  { id: 'kitchen', name: 'Kitchen', level: 1, x0: 12, x1: 21, z0: -11, z1: -4, note: 'Chef island' },
  { id: 'catering', name: 'Catering / Pantry', level: 1, x0: 16, x1: 21, z0: -4, z1: 2, note: '' },
  { id: 'breakfast', name: 'Breakfast', level: 1, x0: 2.5, x1: 12, z0: -3, z1: 2, note: '' },
  { id: 'family', name: 'Family Room', level: 1, x0: -21, x1: -8, z0: 2, z1: 10, note: '' },
  { id: 'office', name: 'Office / Den', level: 1, x0: -8, x1: -2.5, z0: 2, z1: 10, note: '' },
  { id: 'powder1', name: 'Powder 1', level: 1, x0: 2.5, x1: 5.5, z0: 4, z1: 7, note: '' },
  { id: 'powder2', name: 'Powder 2', level: 1, x0: 5.5, x1: 8.5, z0: 4, z1: 7, note: '' },
  { id: 'stairs', name: 'Grand Stair', level: 1, x0: 8.5, x1: 14, z0: 4, z1: 11, note: 'To suites', stair: true },
  { id: 'laundry', name: 'Laundry', level: 1, x0: 14, x1: 18, z0: 7, z1: 11, note: '' },
  { id: 'service', name: 'Service', level: 1, x0: 18, x1: 21, z0: 2, z1: 11, note: 'Windowed suite' },
  { id: 'wetbar', name: 'Wet Bar', level: 1, x0: 2.5, x1: 8.5, z0: 2, z1: 4, note: '' },
  {
    id: 'terrace-n',
    name: 'View Terrace',
    level: 1,
    x0: -21,
    x1: 21,
    z0: -17,
    z1: -13,
    note: 'Full-width',
    outdoor: true,
  },
  {
    id: 'terrace-e',
    name: 'East Terrace',
    level: 1,
    x0: 21,
    x1: 23,
    z0: -11,
    z1: 2,
    note: '',
    outdoor: true,
  },
]

// ─── Level 2 — Private suites (full floor) ──────────────────────────────────
// Combined bedroom wings from both UPH lowers: primary + 5 bedrooms.

export const L2_ROOMS = [
  { id: 'stairs2', name: 'Grand Stair', level: 2, x0: 8.5, x1: 14, z0: 4, z1: 11, note: '', stair: true },
  { id: 'elev2', name: 'Elevator', level: 2, x0: -2, x1: 2, z0: 8, z1: 13, note: '', corridor: true },
  { id: 'hall', name: 'Suite Gallery', level: 2, x0: -2.5, x1: 2.5, z0: -1, z1: 8, note: '', corridor: true },
  { id: 'primary', name: 'Primary Bedroom', level: 2, x0: -21, x1: -8, z0: -11, z1: 1, note: '~8.4×6 m class' },
  { id: 'sitting', name: 'Sitting Room', level: 2, x0: -21, x1: -12, z0: 1, z1: 7, note: '' },
  { id: 'her-wic', name: 'Her WIC', level: 2, x0: -12, x1: -8, z0: 1, z1: 8, note: '' },
  { id: 'his-wic', name: 'His WIC', level: 2, x0: -8, x1: -2.5, z0: 1, z1: 5, note: '' },
  { id: 'her-bath', name: 'Her Bath', level: 2, x0: -8, x1: -2.5, z0: 5, z1: 10, note: '' },
  { id: 'his-bath', name: 'His Bath', level: 2, x0: -21, x1: -12, z0: 7, z1: 12, note: '' },
  { id: 'bed2', name: 'Bedroom 2', level: 2, x0: 2.5, x1: 10, z0: -11, z1: -3, note: 'En suite' },
  { id: 'bath2', name: 'Bath 2', level: 2, x0: 10, x1: 14, z0: -11, z1: -6, note: '' },
  { id: 'bed3', name: 'Jr. Suite', level: 2, x0: 14, x1: 21, z0: -11, z1: -3, note: 'En suite' },
  { id: 'bath3', name: 'Bath 3', level: 2, x0: 14, x1: 18, z0: -3, z1: 1, note: '' },
  { id: 'bed4', name: 'Bedroom 4', level: 2, x0: 2.5, x1: 10, z0: -3, z1: 4, note: 'En suite' },
  { id: 'bath4', name: 'Bath 4', level: 2, x0: 10, x1: 14, z0: -6, z1: -1, note: '' },
  { id: 'bed5', name: 'Bedroom 5', level: 2, x0: 14, x1: 21, z0: 1, z1: 8, note: 'En suite' },
  { id: 'bath5', name: 'Bath 5', level: 2, x0: 18, x1: 21, z0: 8, z1: 12, note: '' },
  { id: 'bed6', name: 'Bedroom 6', level: 2, x0: 2.5, x1: 8.5, z0: 4, z1: 11, note: 'En suite' },
  { id: 'bath6', name: 'Bath 6', level: 2, x0: 14, x1: 18, z0: 8, z1: 12, note: '' },
  { id: 'service2', name: 'Service', level: 2, x0: 18, x1: 21, z0: -3, z1: 1, note: '' },
  {
    id: 'terrace2-n',
    name: 'Suite Terrace',
    level: 2,
    x0: -21,
    x1: 8,
    z0: -17,
    z1: -13,
    note: 'Off primary',
    outdoor: true,
  },
]

// ─── Roof — entertainment deck ──────────────────────────────────────────────

export const L3_ROOMS = [
  { id: 'roof-foyer', name: 'Roof Foyer', level: 3, x0: -4, x1: 8, z0: 6, z1: 12, note: 'Covered' },
  { id: 'stairs3', name: 'Stair', level: 3, x0: 8.5, x1: 14, z0: 4, z1: 11, note: '', stair: true },
  { id: 'summer', name: 'Summer Kitchen', level: 3, x0: 14, x1: 21, z0: 2, z1: 10, note: 'Outdoor', outdoor: true },
  { id: 'bath7', name: 'Bath 7', level: 3, x0: 8.5, x1: 12, z0: 11, z1: 13, note: '' },
  {
    id: 'rooftop',
    name: 'Roof Terrace',
    level: 3,
    x0: -21,
    x1: 21,
    z0: -13,
    z1: 6,
    note: 'Open sky',
    outdoor: true,
  },
  {
    id: 'sundeck',
    name: 'Sun Deck',
    level: 3,
    x0: -21,
    x1: -10,
    z0: -11,
    z1: -4,
    note: 'Loungers',
    outdoor: true,
  },
]

export const ALL_PLAN_ROOMS = [...L1_ROOMS, ...L2_ROOMS, ...L3_ROOMS]

export const WATER = {
  pool: { x0: -6, x1: 10, z0: -10, z1: -5, depth: 1.3 }, // ~16 × 5 m combined
  spa: { x0: -12, x1: -7, z0: -9, z1: -5, depth: 0.95 },
}

// ─── Walls L1 ───────────────────────────────────────────────────────────────

export const L1_EXTERIOR_WALLS = [
  // North glass
  W('l1-n-0', E.x0, E.z0, -2.5, E.z0, {
    thickness: Te,
    kind: 'glass',
    openings: [{ id: 'great-slide', t: 10, width: 10, type: 'opening' }],
  }),
  W('l1-n-1', -2.5, E.z0, 2.5, E.z0, { thickness: Te, kind: 'glass' }),
  W('l1-n-2', 2.5, E.z0, 12, E.z0, {
    thickness: Te,
    kind: 'glass',
    openings: [{ id: 'dine-slide', t: 5, width: 4, type: 'opening' }],
  }),
  W('l1-n-3', 12, E.z0, E.x1, E.z0, { thickness: Te, kind: 'glass' }),
  // East
  W('l1-e-0', E.x1, E.z0, E.x1, -4, { thickness: Te, kind: 'exterior' }),
  W('l1-e-1', E.x1, -4, E.x1, 2, { thickness: Te, kind: 'exterior' }),
  W('l1-e-2', E.x1, 2, E.x1, 11, { thickness: Te, kind: 'exterior' }),
  W('l1-e-3', E.x1, 11, E.x1, E.z1, { thickness: Te, kind: 'exterior' }),
  // South
  W('l1-s-0', E.x1, E.z1, 14, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s-1', 14, E.z1, 4, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s-2', 4, E.z1, -4, E.z1, {
    thickness: Te,
    kind: 'exterior',
    openings: [{ id: 'entry', t: 4, width: 3.2, type: 'door' }],
  }),
  W('l1-s-3', -4, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior' }),
  // West
  W('l1-w-0', E.x0, E.z1, E.x0, 10, { thickness: Te, kind: 'exterior' }),
  W('l1-w-1', E.x0, 10, E.x0, 2, { thickness: Te, kind: 'exterior' }),
  W('l1-w-2', E.x0, 2, E.x0, E.z0, { thickness: Te, kind: 'exterior' }),
]

export const L1_INTERIOR_WALLS = [
  // Gallery spine x = ±2.5
  W('l1-gal-w0', -2.5, E.z0, -2.5, -1),
  W('l1-gal-w1', -2.5, -1, -2.5, 2),
  W('l1-gal-w2', -2.5, 2, -2.5, 5),
  W('l1-gal-w3', -2.5, 5, -2.5, 8),
  W('l1-gal-w4', -2.5, 8, -2.5, 10), // ties office north to gallery
  W('l1-gal-e0', 2.5, E.z0, 2.5, -3),
  W('l1-gal-e1', 2.5, -3, 2.5, 2),
  W('l1-gal-e2', 2.5, 2, 2.5, 4),
  W('l1-gal-e3', 2.5, 4, 2.5, 8),

  // Foyer
  W('l1-foy-w', -4, 8, -4, 13),
  W('l1-foy-e', 4, 8, 4, 13),
  W('l1-foy-n0', -4, 8, -2, 8),
  W('l1-foy-n1', -2, 8, 2, 8, {
    openings: [{ id: 'foyer-open', t: 2, width: 2.8, type: 'opening' }],
  }),
  W('l1-foy-n2', 2, 8, 4, 8),

  // Elev vest
  W('l1-ev-w', -2, 5, -2, 8),
  W('l1-ev-e', 2, 5, 2, 8),
  W('l1-ev-s', -2, 5, 2, 5, {
    openings: [{ id: 'gal-to-elev', t: 2, width: 2.2, type: 'opening' }],
  }),

  // Family | office at x=-8
  W('l1-fam-e', -8, 2, -8, 10, {
    openings: [{ id: 'fam-office', t: 4, width: 1.2, type: 'opening' }],
  }),
  W('l1-z2-w', E.x0, 2, -8, 2),
  W('l1-z2-m', -8, 2, -2.5, 2),
  W('l1-office-n', -8, 10, -2.5, 10),
  W('l1-fam-n0', E.x0, 10, -8, 10),

  // Wet bar / powder / stair block
  W('l1-z2-e', 2.5, 2, 8.5, 2),
  W('l1-z2-e2', 8.5, 2, 14, 2),
  W('l1-z2-e3', 14, 2, 18, 2),
  W('l1-z2-e4', 18, 2, E.x1, 2),
  W('l1-bar-n', 2.5, 4, 5.5, 4),
  W('l1-bar-n2', 5.5, 4, 8.5, 4),
  W('l1-pow-x', 5.5, 4, 5.5, 7),
  W('l1-pow-n', 2.5, 7, 5.5, 7, {
    openings: [{ id: 'pow1', t: 1.5, width: 0.8, type: 'door' }],
  }),
  W('l1-pow2-n', 5.5, 7, 8.5, 7, {
    openings: [{ id: 'pow2', t: 1.5, width: 0.8, type: 'door' }],
  }),
  W('l1-pow-w', 2.5, 4, 2.5, 7), // closes powder 1 to gallery east

  // Stair box
  W('l1-st-w0', 8.5, 2, 8.5, 4),
  W('l1-st-w1', 8.5, 4, 8.5, 7),
  W('l1-st-w2', 8.5, 7, 8.5, 11, {
    openings: [{ id: 'stair-entry', t: 2, width: 1.2, type: 'opening' }],
  }),
  W('l1-st-e0', 14, 2, 14, 4),
  W('l1-st-e1', 14, 4, 14, 7),
  W('l1-st-e2', 14, 7, 14, 11),
  W('l1-st-n', 8.5, 11, 14, 11),
  W('l1-st-s', 8.5, 4, 14, 4),

  // Laundry / service
  W('l1-lau-s', 14, 7, 18, 7),
  W('l1-lau-e', 18, 7, 18, 11),
  W('l1-svc-w', 18, 2, 18, 7),
  W('l1-svc-n', 18, 11, E.x1, 11),

  // Dining | kitchen | breakfast — tie x=12 up to wet-bar line z=2
  W('l1-x12-0', 12, E.z0, 12, -4, {
    openings: [{ id: 'kit-pass', t: 4, width: 2.4, type: 'opening' }],
  }),
  W('l1-x12-1', 12, -4, 12, -3),
  W('l1-x12-2', 12, -3, 12, 2),
  W('l1-z2-kit', 12, 2, 16, 2),
  W('l1-z2-kit2', 16, 2, 18, 2),
  W('l1-z-3', 2.5, -3, 12, -3, {
    openings: [{ id: 'dine-break', t: 5, width: 2.8, type: 'opening' }],
  }),
  W('l1-z-4a', 12, -4, 16, -4),
  W('l1-z-4b', 16, -4, E.x1, -4),
  W('l1-cat-w', 16, -4, 16, 2, {
    openings: [{ id: 'pantry', t: 3, width: 1.0, type: 'door' }],
  }),
]

// ─── Walls L2 ───────────────────────────────────────────────────────────────

export const L2_EXTERIOR_WALLS = [
  W('l2-n-0', E.x0, E.z0, -8, E.z0, {
    thickness: Te,
    kind: 'glass',
    level: 2,
    openings: [{ id: 'primary-slide', t: 6, width: 6, type: 'opening' }],
  }),
  W('l2-n-1', -8, E.z0, 2.5, E.z0, { thickness: Te, kind: 'glass', level: 2 }),
  W('l2-n-2', 2.5, E.z0, 14, E.z0, { thickness: Te, kind: 'glass', level: 2 }),
  W('l2-n-3', 14, E.z0, E.x1, E.z0, { thickness: Te, kind: 'glass', level: 2 }),
  W('l2-e-0', E.x1, E.z0, E.x1, -3, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-e-1', E.x1, -3, E.x1, 1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-e-2', E.x1, 1, E.x1, 8, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-e-3', E.x1, 8, E.x1, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s-0', E.x1, E.z1, 14, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s-1', 14, E.z1, 8.5, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s-2', 8.5, E.z1, 2, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s-3', 2, E.z1, -2, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s-4', -2, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w-0', E.x0, E.z1, E.x0, 12, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w-1', E.x0, 12, E.x0, 7, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w-2', E.x0, 7, E.x0, 1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w-3', E.x0, 1, E.x0, E.z0, { thickness: Te, kind: 'exterior', level: 2 }),
]

export const L2_INTERIOR_WALLS = [
  // Hall spine
  W('l2-h-w0', -2.5, E.z0, -2.5, 1, { level: 2 }),
  W('l2-h-w1', -2.5, 1, -2.5, 5, { level: 2 }),
  W('l2-h-w2', -2.5, 5, -2.5, 8, { level: 2 }),
  W('l2-h-tie-w', -2.5, 8, -2, 8, { level: 2 }),
  W('l2-h-e0', 2.5, E.z0, 2.5, -3, { level: 2 }),
  W('l2-h-e1', 2.5, -3, 2.5, 4, { level: 2 }),
  W('l2-h-e2', 2.5, 4, 2.5, 8, { level: 2 }),
  W('l2-h-tie-e', 2.5, 8, 2, 8, { level: 2 }),

  // Primary suite
  W('l2-pri-e', -8, E.z0, -8, 1, {
    level: 2,
    openings: [{ id: 'primary-door', t: 6, width: 1.2, type: 'door' }],
  }),
  W('l2-z1-0', E.x0, 1, -12, 1, { level: 2 }),
  W('l2-z1-1', -12, 1, -8, 1, { level: 2 }),
  W('l2-z1-2', -8, 1, -2.5, 1, { level: 2 }),
  W('l2-sit-e', -12, 1, -12, 7, { level: 2 }),
  W('l2-x-8a', -8, 1, -8, 5, { level: 2 }),
  W('l2-x-8b', -8, 5, -8, 8, {
    level: 2,
    openings: [{ id: 'her-wic-door', t: 1.5, width: 0.9, type: 'door' }],
  }),
  W('l2-x-8c', -8, 8, -8, 10, { level: 2 }),
  W('l2-his-n', -8, 5, -2.5, 5, { level: 2 }),
  W('l2-her-n', -12, 7, -8, 7, { level: 2 }),
  W('l2-hisbath-s', E.x0, 7, -12, 7, { level: 2 }),
  W('l2-hisbath-e', -12, 7, -12, E.z1, { level: 2 }),
  W('l2-herbath-n', -8, 10, -2.5, 10, { level: 2 }),
  W('l2-herbath-tie', -2.5, 10, -2.5, 8, { level: 2 }),
  W('l2-sit-n', E.x0, 7, -12, 7, { level: 2 }),

  // Elev
  W('l2-ev-w', -2, 8, -2, 13, { level: 2 }),
  W('l2-ev-e', 2, 8, 2, 13, { level: 2 }),
  W('l2-ev-s', -2, 8, 2, 8, {
    level: 2,
    openings: [{ id: 'elev2', t: 2, width: 1.2, type: 'opening' }],
  }),

  // Stair (align L1)
  W('l2-st-w', 8.5, 4, 8.5, 11, { level: 2 }),
  W('l2-st-e', 14, 4, 14, 11, { level: 2 }),
  W('l2-st-n', 8.5, 11, 14, 11, { level: 2 }),
  W('l2-st-s', 8.5, 4, 14, 4, {
    level: 2,
    openings: [{ id: 'stair2', t: 2.5, width: 1.2, type: 'opening' }],
  }),

  // East bedrooms
  W('l2-z-3', 2.5, -3, 10, -3, { level: 2 }),
  W('l2-z-3b', 10, -3, 14, -3, { level: 2 }),
  W('l2-z-3c', 14, -3, E.x1, -3, { level: 2 }),
  W('l2-x10-0', 10, E.z0, 10, -6, { level: 2 }),
  W('l2-x10-1', 10, -6, 10, -3, { level: 2 }),
  W('l2-x10-2', 10, -3, 10, -1, { level: 2 }),
  W('l2-x10-3', 10, -1, 10, 4, {
    level: 2,
    openings: [{ id: 'bed4-door', t: 2, width: 0.9, type: 'door' }],
  }),
  W('l2-x10-4', 10, 4, 8.5, 4, { level: 2 }), // tie to stair
  W('l2-x14-0', 14, E.z0, 14, -6, { level: 2 }),
  W('l2-x14-0b', 14, -6, 14, -3, { level: 2 }),
  W('l2-x14-0c', 14, -3, 14, -1, { level: 2 }),
  W('l2-x14-1', 14, -1, 14, 1, { level: 2 }),
  W('l2-x14-2', 14, 1, 14, 4, { level: 2 }),
  W('l2-x14-3', 14, 4, 14, 8, { level: 2 }),
  W('l2-x14-4', 14, 8, 14, 11, { level: 2 }),
  W('l2-bath2-n', 10, -6, 14, -6, { level: 2 }),
  W('l2-bath4-n', 10, -1, 14, -1, { level: 2 }),
  W('l2-z1-e', 14, 1, 18, 1, { level: 2 }),
  W('l2-z1-e2', 18, 1, E.x1, 1, { level: 2 }),
  W('l2-z4-e', 2.5, 4, 8.5, 4, { level: 2 }),
  W('l2-z4-e2', 8.5, 4, 14, 4, { level: 2 }),
  W('l2-bed5-s', 14, 8, 18, 8, { level: 2 }),
  W('l2-bed5-s2', 18, 8, E.x1, 8, { level: 2 }),
  W('l2-x18-0', 18, -3, 18, 1, { level: 2 }),
  W('l2-x18-1', 18, 1, 18, 8, {
    level: 2,
    openings: [{ id: 'bed5-door', t: 3, width: 0.9, type: 'door' }],
  }),
  W('l2-x18-2', 18, 8, 18, E.z1, { level: 2 }),
  W('l2-bath6-w', 14, 8, 14, 12, { level: 2 }),
  W('l2-bath6-n', 14, 12, 18, 12, { level: 2 }),
  W('l2-bath6-tie', 14, 12, 14, E.z1, { level: 2 }),
]

// ─── Walls L3 roof pavilion / rail ──────────────────────────────────────────

export const L3_WALLS = [
  W('l3-foy-n', -4, 6, 8.5, 6, {
    level: 3,
    kind: 'exterior',
    openings: [{ id: 'roof-open', t: 6, width: 5, type: 'opening' }],
  }),
  W('l3-foy-e1', 8.5, 6, 8.5, 11, { level: 3, kind: 'exterior' }),
  W('l3-foy-e2', 8.5, 11, 8.5, 12, { level: 3, kind: 'exterior' }),
  W('l3-foy-s', 8.5, 12, -4, 12, { level: 3, kind: 'exterior' }),
  W('l3-foy-w', -4, 12, -4, 6, { level: 3, kind: 'exterior' }),
  W('l3-st-w', 8.5, 4, 8.5, 6, { level: 3 }),
  W('l3-st-e', 14, 4, 14, 11, { level: 3 }),
  W('l3-st-s', 8.5, 4, 14, 4, { level: 3 }),
  W('l3-st-n', 8.5, 11, 14, 11, { level: 3 }),
  W('l3-bath-w', 8.5, 11, 8.5, 13, { level: 3 }),
  W('l3-bath-e', 12, 11, 12, 13, { level: 3 }),
  W('l3-bath-n', 8.5, 13, 12, 13, { level: 3 }),
  W('l3-bath-s', 8.5, 11, 12, 11, {
    level: 3,
    openings: [{ id: 'bath7', t: 1.5, width: 0.8, type: 'door' }],
  }),
  W('l3-rail-n', -21, -13, 21, -13, {
    level: 3,
    kind: 'railing',
    thickness: 0.08,
    freeEnd: 'both',
  }),
]

const WALLS_RAW = [
  ...L1_EXTERIOR_WALLS,
  ...L1_INTERIOR_WALLS,
  ...L2_EXTERIOR_WALLS,
  ...L2_INTERIOR_WALLS,
  ...L3_WALLS,
]

function nearly(a, b, eps = 1e-6) {
  return Math.abs(a - b) < eps
}

function pointOnSeg(px, pz, ax, az, bx, bz, eps = 1e-4) {
  const minx = Math.min(ax, bx) - eps
  const maxx = Math.max(ax, bx) + eps
  const minz = Math.min(az, bz) - eps
  const maxz = Math.max(az, bz) + eps
  if (px < minx || px > maxx || pz < minz || pz > maxz) return false
  const cross = (px - ax) * (bz - az) - (pz - az) * (bx - ax)
  return Math.abs(cross) <= 1e-3
}

/** Split walls at every T so endpoints share exact coordinates. */
function splitWallsForJoins(walls) {
  const byLevel = new Map()
  for (const w of walls) {
    if (!byLevel.has(w.level)) byLevel.set(w.level, [])
    byLevel.get(w.level).push(w)
  }
  const out = []
  for (const [, levelWalls] of byLevel) {
    const pts = []
    for (const w of levelWalls) pts.push([w.ax, w.az], [w.bx, w.bz])
    for (const w of levelWalls) {
      const cuts = [
        [w.ax, w.az],
        [w.bx, w.bz],
      ]
      for (const [px, pz] of pts) {
        if (pointOnSeg(px, pz, w.ax, w.az, w.bx, w.bz)) {
          if (!cuts.some(([x, z]) => nearly(x, px) && nearly(z, pz))) cuts.push([px, pz])
        }
      }
      const dx = w.bx - w.ax
      const dz = w.bz - w.az
      cuts.sort(
        (a, b) =>
          (a[0] - w.ax) * dx +
          (a[1] - w.az) * dz -
          ((b[0] - w.ax) * dx + (b[1] - w.az) * dz),
      )
      for (let i = 0; i < cuts.length - 1; i++) {
        const [ax, az] = cuts[i]
        const [bx, bz] = cuts[i + 1]
        if (nearly(ax, bx) && nearly(az, bz)) continue
        out.push({ ...w, id: `${w.id}_${i}`, ax, az, bx, bz })
      }
    }
  }
  return out
}

export const ALL_WALLS = splitWallsForJoins(WALLS_RAW)

export function validateWallJoins(walls = ALL_WALLS) {
  const key = (x, z) => `${x.toFixed(4)},${z.toFixed(4)}`
  const byLevel = new Map()
  for (const w of walls) {
    if (!byLevel.has(w.level)) byLevel.set(w.level, [])
    byLevel.get(w.level).push(w)
  }

  const orphans = []
  let jointCount = 0
  for (const [, levelWalls] of byLevel) {
    const joints = new Map()
    for (const w of levelWalls) {
      for (const e of [
        { x: w.ax, z: w.az, which: 'a' },
        { x: w.bx, z: w.bz, which: 'b' },
      ]) {
        const k = key(e.x, e.z)
        if (!joints.has(k)) joints.set(k, { x: e.x, z: e.z, hits: [] })
        joints.get(k).hits.push({ wall: w.id, which: e.which, freeEnd: w.freeEnd })
      }
    }
    jointCount += joints.size
    for (const [, j] of joints) {
      if (j.hits.length >= 2) continue
      const hit = j.hits[0]
      const free = hit.freeEnd === 'both' || hit.freeEnd === hit.which
      if (!free) orphans.push({ x: j.x, z: j.z, wall: hit.wall })
    }
  }

  return {
    ok: orphans.length === 0,
    orphanCount: orphans.length,
    orphans,
    jointCount,
    wallCount: walls.length,
  }
}
