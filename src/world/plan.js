/**
 * Layer 2 — Plan data only
 *
 * Source of truth for later mesh layers. No geometry builders here.
 *
 * Units: meters. Origin at plan center.
 * +X = east · −X = west · +Z = entry (south) · −Z = view (north)
 *
 * Walls are centerline segments. Every T-junction splits both walls so
 * endpoints share exact coordinates (Layer 3+ extrudes thickness from these).
 * Intentional stubs use freeEnd: 'a' | 'b' | 'both'.
 */

/** Story heights */
export const LEVEL = {
  H: 3.6,
  L2: 3.8,
  pavilionH: 2.8,
  wallT: 0.2,
  wallExt: 0.25,
  slab: 0.3,
}

export const PLAN_META = {
  title: 'Dream House — Duplex Penthouse',
  subtitle: 'Main living · rooftop residential pool · ~620 m² interior',
  units: 'm',
  xMin: -18,
  xMax: 18,
  zMin: -16,
  zMax: 14,
  envelope: { x0: -16, x1: 16, z0: -12, z1: 12 },
  terrace: { x0: -15, x1: 15, z0: -14, z1: -12 },
  glassLineZ: -12,
  scaleBarMeters: 5,
  plateW: 32,
  plateD: 24,
}

// ─── Rooms ──────────────────────────────────────────────────────────────────

export const L1_ROOMS = [
  { id: 'foyer', name: 'Foyer', level: 1, x0: -3, x1: 3, z0: 7, z1: 12, note: 'Private elevator' },
  { id: 'gallery', name: 'Gallery', level: 1, x0: -2, x1: 2, z0: 1, z1: 7, note: 'Circulation', corridor: true },
  { id: 'living', name: 'Living', level: 1, x0: -14, x1: 2, z0: -10, z1: 1, note: 'Open to terrace', void: true },
  { id: 'dining', name: 'Dining', level: 1, x0: 2, x1: 9, z0: -10, z1: -2, note: 'Open plan' },
  { id: 'kitchen', name: 'Kitchen', level: 1, x0: 9, x1: 15, z0: -10, z1: -2, note: 'Island · pantry' },
  { id: 'pantry', name: 'Pantry', level: 1, x0: 12, x1: 15, z0: -2, z1: 2, note: '' },
  { id: 'powder', name: 'Powder', level: 1, x0: 3, x1: 6, z0: 4, z1: 7, note: '' },
  { id: 'stairs', name: 'Stair', level: 1, x0: 6, x1: 10, z0: 4, z1: 10, note: 'To roof', stair: true },
  { id: 'study', name: 'Study', level: 1, x0: 10, x1: 15, z0: 2, z1: 8, note: '' },
  { id: 'master', name: 'Primary Suite', level: 1, x0: -15, x1: -5, z0: 1, z1: 11, note: 'Bedroom' },
  { id: 'dressing', name: 'Dressing', level: 1, x0: -15, x1: -10, z0: -4, z1: 1, note: 'WIC' },
  { id: 'mbath', name: 'Primary Bath', level: 1, x0: -10, x1: -5, z0: -4, z1: 1, note: '' },
  { id: 'guest1', name: 'Guest 1', level: 1, x0: -5, x1: -2, z0: 4, z1: 11, note: 'En suite' },
  { id: 'guest2', name: 'Guest 2', level: 1, x0: 10, x1: 15, z0: 8, z1: 12, note: 'En suite' },
  {
    id: 'terrace-l1',
    name: 'View Terrace',
    level: 1,
    x0: -15,
    x1: 15,
    z0: -14,
    z1: -12,
    note: 'Off living',
    outdoor: true,
  },
]

export const L2_ROOMS = [
  { id: 'pavilion', name: 'Sky Lounge', level: 2, x0: -4, x1: 6, z0: 2, z1: 10, note: 'Covered pavilion' },
  { id: 'stairs2', name: 'Stair', level: 2, x0: 6, x1: 10, z0: 4, z1: 10, note: '', stair: true },
  { id: 'powder2', name: 'Powder', level: 2, x0: -4, x1: -1, z0: 7, z1: 10, note: '' },
  {
    id: 'rooftop',
    name: 'Rooftop Deck',
    level: 2,
    x0: -15,
    x1: 15,
    z0: -12,
    z1: 2,
    note: 'Open sky',
    outdoor: true,
    water: { x0: -6, x1: 6, z0: -9, z1: -4 },
    spa: { x0: -11, x1: -7, z0: -8, z1: -5 },
  },
  {
    id: 'summer',
    name: 'Summer Kitchen',
    level: 2,
    x0: 8,
    x1: 14,
    z0: -4,
    z1: 1,
    note: 'Outdoor',
    outdoor: true,
  },
  {
    id: 'sundeck',
    name: 'Sun Deck',
    level: 2,
    x0: -15,
    x1: -7,
    z0: -12,
    z1: -8,
    note: 'Loungers',
    outdoor: true,
  },
]

export const ALL_PLAN_ROOMS = [...L1_ROOMS, ...L2_ROOMS]

// ─── Walls ──────────────────────────────────────────────────────────────────

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

/**
 * Exterior closed loop, split at every interior T.
 * Joints on envelope: (±16,±12), and T points listed in comments.
 */
export const L1_EXTERIOR_WALLS = [
  // North glass z=-12: (−16)──(2)──(16)  — (2) joins open-plan rib
  W('ext-n-w', E.x0, E.z0, 2, E.z0, {
    thickness: Te,
    kind: 'glass',
    openings: [{ id: 'terrace-slide', t: 9, width: 8, type: 'opening' }],
  }),
  W('ext-n-e', 2, E.z0, E.x1, E.z0, { thickness: Te, kind: 'glass' }),

  // East x=16: (−12)──(−2)──(1)──(2)──(8)──(12)
  W('ext-e-0', E.x1, E.z0, E.x1, -2, { thickness: Te, kind: 'exterior' }),
  W('ext-e-1', E.x1, -2, E.x1, 1, { thickness: Te, kind: 'exterior' }),
  W('ext-e-1b', E.x1, 1, E.x1, 2, { thickness: Te, kind: 'exterior' }),
  W('ext-e-2', E.x1, 2, E.x1, 8, { thickness: Te, kind: 'exterior' }),
  W('ext-e-3', E.x1, 8, E.x1, E.z1, { thickness: Te, kind: 'exterior' }),

  // South z=12: (16)──(10)──(3)──(−3)──(−16)
  W('ext-s-0', E.x1, E.z1, 10, E.z1, { thickness: Te, kind: 'exterior' }),
  W('ext-s-1', 10, E.z1, 3, E.z1, { thickness: Te, kind: 'exterior' }),
  W('ext-s-2', 3, E.z1, -3, E.z1, {
    thickness: Te,
    kind: 'exterior',
    openings: [{ id: 'entry', t: 3, width: 2.4, type: 'door' }],
  }),
  W('ext-s-3', -3, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior' }),

  // West x=-16: (12)──(1)──(−4)──(−12)
  W('ext-w-0', E.x0, E.z1, E.x0, 1, { thickness: Te, kind: 'exterior' }),
  W('ext-w-1', E.x0, 1, E.x0, -4, { thickness: Te, kind: 'exterior' }),
  W('ext-w-2', E.x0, -4, E.x0, E.z0, { thickness: Te, kind: 'exterior' }),
]

export const L1_INTERIOR_WALLS = [
  // ── Spine z=1: (−16)──(−15)──(−10)──(−5)──(−2)   gap   (2)──(6)──(10)──(15)──(16)
  W('z1-0', E.x0, 1, -15, 1),
  W('z1-1', -15, 1, -10, 1, {
    openings: [{ id: 'master-door', t: 2.5, width: 1.0, type: 'door' }],
  }),
  W('z1-2', -10, 1, -5, 1),
  W('z1-3', -5, 1, -2, 1),
  W('z1-4', 2, 1, 6, 1),
  W('z1-5', 6, 1, 10, 1, {
    openings: [{ id: 'east-wing', t: 2, width: 1.2, type: 'opening' }],
  }),
  W('z1-6', 10, 1, 12, 1),
  W('z1-6b', 12, 1, 15, 1),
  W('z1-7', 15, 1, E.x1, 1),

  // ── Gallery flanks x=±2 from z=1 to z=7 ──
  W('gal-w-0', -2, 1, -2, 4, {
    openings: [{ id: 'guest1-door', t: 2, width: 0.9, type: 'door' }],
  }),
  W('gal-w-1', -2, 4, -2, 7),
  W('gal-e-0', 2, 1, 2, 7),

  // ── Foyer (−3..3 × 7..12) ──
  W('foy-w', -3, 7, -3, 12),
  W('foy-e', 3, 7, 3, 12),
  W('foy-n-0', -3, 7, -2, 7),
  W('foy-n-1', -2, 7, 2, 7, {
    openings: [{ id: 'foyer-to-gallery', t: 2, width: 2.2, type: 'opening' }],
  }),
  W('foy-n-2', 2, 7, 3, 7),

  // Link gallery-e top to foyer: already at (2,7)
  // Link powder west to foyer east line via z=7 run 3→6
  W('z7-pow', 3, 7, 6, 7),

  // ── Guest 1 (−5..−2 × 4..11) ──
  W('g1-e', -5, 1, -5, 4),
  W('g1-e2', -5, 4, -5, 11),
  W('g1-n', -5, 11, -2, 11),
  W('g1-w-top', -2, 7, -2, 11),

  // ── Primary suite west of living ──
  // North wall z=-4: (−16)──(−15)──(−10)──(−5)
  W('suite-n-0', E.x0, -4, -15, -4),
  W('suite-n-1', -15, -4, -10, -4, {
    openings: [{ id: 'suite-to-living', t: 2.5, width: 1.2, type: 'door' }],
  }),
  W('suite-n-2', -10, -4, -5, -4),
  // Split dressing | bath
  W('suite-x10', -10, -4, -10, 1, {
    openings: [{ id: 'dress-bath', t: 2.5, width: 0.9, type: 'door' }],
  }),
  // Suite east (bath | living) x=-5 from −4 to 1
  W('suite-e', -5, -4, -5, 1),
  // Suite west x=-15 from −4 to 1
  W('suite-w', -15, -4, -15, 1),

  // ── Powder (3..6 × 4..7) + stair (6..10 × 4..10) ──
  W('pow-w', 3, 4, 3, 7),
  W('pow-s', 3, 4, 6, 4, {
    openings: [{ id: 'powder-door', t: 1.5, width: 0.8, type: 'door' }],
  }),
  // Stair west x=6: z1──4──7──10
  W('st-w-0', 6, 1, 6, 4, {
    openings: [{ id: 'stair-entry', t: 1.5, width: 1.1, type: 'opening' }],
  }),
  W('st-w-1', 6, 4, 6, 7),
  W('st-w-2', 6, 7, 6, 10),
  // Stair east x=10: z1──4──8──10──12
  W('st-e-0', 10, 1, 10, 2),
  W('st-e-0b', 10, 2, 10, 4),
  W('st-e-1', 10, 4, 10, 8, {
    openings: [{ id: 'study-door', t: 2, width: 0.9, type: 'door' }],
  }),
  W('st-e-2', 10, 8, 10, 10),
  W('st-e-3', 10, 10, 10, 12),
  W('st-n', 6, 10, 10, 10),
  W('st-s', 6, 4, 10, 4),

  // ── East wing: guest2 / study / pantry ──
  W('g2-s', 10, 8, 15, 8, {
    openings: [{ id: 'guest2-door', t: 2.5, width: 0.9, type: 'door' }],
  }),
  W('g2-s-tie', 15, 8, E.x1, 8),
  W('study-n', 10, 2, 12, 2),
  W('study-n-b', 12, 2, 15, 2),
  W('study-n-tie', 15, 2, E.x1, 2),

  // Pantry (12..15 × −2..2)
  W('pan-w-0', 12, -2, 12, 1, {
    openings: [{ id: 'pantry-door', t: 1.5, width: 0.8, type: 'door' }],
  }),
  W('pan-w-1', 12, 1, 12, 2),
  W('pan-s', 12, -2, 15, -2),
  W('pan-s-tie', 15, -2, E.x1, -2),
  // pan north edge shares study-n-b (12,2)-(15,2)

  // ── Open-plan ribs toward glass (free at north) ──
  // Living | dining at x=2: from z=1 down to glass, with soft open mid
  W('rib-live-0', 2, 1, 2, -2, {
    openings: [{ id: 'live-dine-open', t: 4, width: 3.2, type: 'opening' }],
  }),
  W('rib-live-1', 2, -2, 2, -10),
  W('rib-live-2', 2, -10, 2, E.z0), // joins glass at (2,-12)

  // Dining | kitchen at x=9 — free toward the view (no full wall to glass)
  W('rib-kit-0', 9, -2, 9, -10, {
    openings: [{ id: 'pass', t: 4, width: 2.4, type: 'opening' }],
    freeEnd: 'b',
  }),
  // Cross bar at z=-2 from dining rib to pantry
  W('bar-z-2a', 2, -2, 9, -2),
  W('bar-z-2b', 9, -2, 12, -2),
]

/** L2 pavilion + stair — closed joins; railing free ends allowed */
export const L2_WALLS = [
  // Pavilion (−4..6 × 2..10), split east wall at stair link z=4
  W('pav-n-0', -4, 2, 6, 2, {
    level: 2,
    kind: 'exterior',
    openings: [{ id: 'pav-to-deck', t: 5, width: 4, type: 'opening' }],
  }),
  W('pav-e-0', 6, 2, 6, 4, {
    level: 2,
    kind: 'exterior',
    openings: [{ id: 'pav-to-stair', t: 1, width: 1.1, type: 'opening' }],
  }),
  W('pav-e-1', 6, 4, 6, 10, { level: 2, kind: 'exterior' }),
  W('pav-s-0', 6, 10, -1, 10, { level: 2, kind: 'exterior' }),
  W('pav-s-1', -1, 10, -4, 10, { level: 2, kind: 'exterior' }),
  W('pav-w-0', -4, 10, -4, 7, { level: 2, kind: 'exterior' }),
  W('pav-w-1', -4, 7, -4, 2, { level: 2, kind: 'exterior' }),

  // Stair box on L2
  W('stair2-s', 6, 4, 10, 4, { level: 2 }),
  W('stair2-e', 10, 4, 10, 10, { level: 2 }),
  W('stair2-n', 10, 10, 6, 10, { level: 2 }),

  // Powder (−4..−1 × 7..10)
  W('pow2-e', -1, 7, -1, 10, { level: 2 }),
  W('pow2-s', -4, 7, -1, 7, {
    level: 2,
    openings: [{ id: 'pow2-door', t: 1.5, width: 0.8, type: 'door' }],
  }),

  // Roof edge rail (free ends at terrace corners)
  W('rail-n', -15, -12, 15, -12, {
    level: 2,
    kind: 'railing',
    thickness: 0.08,
    freeEnd: 'both',
  }),
]

export const ALL_WALLS = [...L1_EXTERIOR_WALLS, ...L1_INTERIOR_WALLS, ...L2_WALLS]

export const WATER = {
  pool: { x0: -6, x1: 6, z0: -9, z1: -4, depth: 1.2 },
  spa: { x0: -11, x1: -7, z0: -8, z1: -5, depth: 0.9 },
}

/**
 * Validate wall endpoint joins.
 * An endpoint is OK if degree ≥ 2, or it is marked freeEnd on its wall.
 */
export function validateWallJoins(walls = ALL_WALLS) {
  const key = (x, z) => `${x.toFixed(4)},${z.toFixed(4)}`
  const joints = new Map()

  for (const w of walls) {
    const ends = [
      { x: w.ax, z: w.az, which: 'a' },
      { x: w.bx, z: w.bz, which: 'b' },
    ]
    for (const e of ends) {
      const k = key(e.x, e.z)
      if (!joints.has(k)) joints.set(k, { x: e.x, z: e.z, hits: [] })
      joints.get(k).hits.push({ wall: w.id, which: e.which, freeEnd: w.freeEnd })
    }
  }

  const orphans = []
  for (const [, j] of joints) {
    if (j.hits.length >= 2) continue
    const hit = j.hits[0]
    const free =
      hit.freeEnd === 'both' ||
      hit.freeEnd === hit.which
    if (!free) orphans.push({ x: j.x, z: j.z, wall: hit.wall })
  }

  return {
    ok: orphans.length === 0,
    orphanCount: orphans.length,
    orphans,
    jointCount: joints.size,
    wallCount: walls.length,
  }
}
