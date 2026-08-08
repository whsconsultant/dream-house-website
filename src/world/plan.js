/**
 * Plan data — open-plan duplex (not a corridor maze).
 *
 * L1: foyer opens into one great room + kitchen (no gallery spine).
 *     Powder / stair / laundry = one service core by the entry.
 * L2: primary west · two guests east · short landing at stair (no long hall).
 * Roof: open deck + pool.
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
  subtitle: 'Open great room · 3 beds · roof pool',
  units: 'm',
  xMin: -22,
  xMax: 22,
  zMin: -16,
  zMax: 14,
  envelope: { x0: -20, x1: 20, z0: -12, z1: 12 },
  terrace: { x0: -18, x1: 18, z0: -16, z1: -12 },
  glassLineZ: -12,
  scaleBarMeters: 5,
  plateW: 40,
  plateD: 24,
  reference: 'Open plan: foyer → great room/kitchen; suites upstairs; no corridor maze',
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

// ─── Rooms ──────────────────────────────────────────────────────────────────

export const L1_ROOMS = [
  { id: 'foyer', name: 'Foyer', level: 1, x0: -3, x1: 3, z0: 8, z1: 12, note: 'Elevator' },
  {
    id: 'great',
    name: 'Great Room',
    level: 1,
    x0: -18,
    x1: 8,
    z0: -10,
    z1: 8,
    note: 'Living + dining · fully open',
    void: true,
  },
  { id: 'kitchen', name: 'Kitchen', level: 1, x0: 8, x1: 18, z0: -10, z1: 0, note: 'Open to great room' },
  { id: 'pantry', name: 'Pantry', level: 1, x0: 14, x1: 18, z0: 0, z1: 4, note: '' },
  { id: 'office', name: 'Office', level: 1, x0: 8, x1: 14, z0: 0, z1: 6, note: '' },
  { id: 'powder', name: 'Powder', level: 1, x0: 3, x1: 6, z0: 5, z1: 8, note: '' },
  { id: 'stairs', name: 'Stair', level: 1, x0: 6, x1: 11, z0: 5, z1: 11, note: '', stair: true },
  { id: 'laundry', name: 'Laundry', level: 1, x0: 11, x1: 16, z0: 8, z1: 11, note: '' },
  {
    id: 'terrace',
    name: 'Terrace',
    level: 1,
    x0: -18,
    x1: 18,
    z0: -16,
    z1: -12,
    note: '4 m deep',
    outdoor: true,
  },
]

export const L2_ROOMS = [
  { id: 'stairs2', name: 'Stair', level: 2, x0: 6, x1: 11, z0: 5, z1: 11, note: '', stair: true },
  { id: 'landing', name: 'Landing', level: 2, x0: 2, x1: 6, z0: 5, z1: 11, note: '', corridor: true },
  {
    id: 'primary',
    name: 'Primary',
    level: 2,
    x0: -18,
    x1: 2,
    z0: -10,
    z1: 5,
    note: 'Bedroom',
  },
  { id: 'dressing', name: 'Dressing', level: 2, x0: -18, x1: -10, z0: 5, z1: 11, note: 'WIC' },
  { id: 'pbath', name: 'Primary Bath', level: 2, x0: -10, x1: 2, z0: 5, z1: 11, note: '' },
  { id: 'guest1', name: 'Guest 1', level: 2, x0: 11, x1: 18, z0: -10, z1: -1, note: 'En suite' },
  { id: 'bath1', name: 'Bath 1', level: 2, x0: 11, x1: 15, z0: -1, z1: 3, note: '' },
  { id: 'guest2', name: 'Guest 2', level: 2, x0: 11, x1: 18, z0: 3, z1: 11, note: 'En suite' },
  { id: 'bath2', name: 'Bath 2', level: 2, x0: 15, x1: 18, z0: -1, z1: 3, note: '' },
  {
    id: 'terrace2',
    name: 'Terrace',
    level: 2,
    x0: -18,
    x1: 8,
    z0: -16,
    z1: -12,
    note: 'Off primary',
    outdoor: true,
  },
]

export const L3_ROOMS = [
  { id: 'stairs3', name: 'Stair', level: 3, x0: 6, x1: 11, z0: 5, z1: 11, note: '', stair: true },
  { id: 'lounge', name: 'Sky Lounge', level: 3, x0: -2, x1: 6, z0: 5, z1: 11, note: 'Covered' },
  {
    id: 'summer',
    name: 'Summer Kitchen',
    level: 3,
    x0: 11,
    x1: 18,
    z0: 4,
    z1: 11,
    note: '',
    outdoor: true,
  },
  { id: 'bath3', name: 'Bath', level: 3, x0: 6, x1: 9, z0: 11, z1: 12, note: '' },
  {
    id: 'rooftop',
    name: 'Roof Deck',
    level: 3,
    x0: -18,
    x1: 18,
    z0: -12,
    z1: 5,
    note: 'Open',
    outdoor: true,
  },
]

export const ALL_PLAN_ROOMS = [...L1_ROOMS, ...L2_ROOMS, ...L3_ROOMS]

export const WATER = {
  pool: { x0: -4, x1: 10, z0: -9, z1: -4, depth: 1.25 },
  spa: { x0: -10, x1: -5, z0: -8, z1: -4, depth: 0.9 },
}

// ─── L1 — exterior + minimal interiors ──────────────────────────────────────

export const L1_EXTERIOR_WALLS = [
  W('l1-n', E.x0, E.z0, E.x1, E.z0, {
    thickness: Te,
    kind: 'glass',
    openings: [{ id: 'terrace-slide', t: 20, width: 12, type: 'opening' }],
  }),
  W('l1-e', E.x1, E.z0, E.x1, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s0', E.x1, E.z1, 3, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s1', 3, E.z1, -3, E.z1, {
    thickness: Te,
    kind: 'exterior',
    openings: [{ id: 'entry', t: 3, width: 2.8, type: 'door' }],
  }),
  W('l1-s2', -3, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-w', E.x0, E.z1, E.x0, E.z0, { thickness: Te, kind: 'exterior' }),
]

/**
 * Few interiors only:
 * - Foyer pocket at entry
 * - Service core (powder + stair + laundry) along south-east
 * - Office + pantry on east (kitchen stays open to great room)
 */
export const L1_INTERIOR_WALLS = [
  // Foyer — open north into great room
  W('foy-w', -3, 8, -3, 12),
  W('foy-e', 3, 8, 3, 12),
  W('foy-n', -3, 8, 3, 8, {
    openings: [{ id: 'to-living', t: 3, width: 3.2, type: 'opening' }],
  }),

  // Service core block: x 3..16, z 5..11
  W('core-w', 3, 5, 3, 8),
  W('core-s', 3, 5, 11, 5),
  W('pow-e', 6, 5, 6, 8, {
    openings: [{ id: 'powder', t: 1.5, width: 0.8, type: 'door' }],
  }),
  W('st-e', 11, 5, 11, 11),
  W('st-n', 6, 11, 11, 11),
  W('st-open', 6, 5, 6, 11, {
    openings: [{ id: 'stair', t: 3, width: 1.2, type: 'opening' }],
  }),
  W('lau-s', 11, 8, 16, 8),
  W('lau-e', 16, 8, 16, 11),
  W('lau-n', 11, 11, 16, 11),

  // East rooms — kitchen open (no wall at kitchen/great)
  W('off-s', 8, 0, 14, 0, {
    openings: [{ id: 'office', t: 3, width: 1.0, type: 'door' }],
  }),
  W('off-w', 8, 0, 8, 6),
  W('off-n', 8, 6, 14, 6),
  W('off-e', 14, 0, 14, 6),
  W('pan-s', 14, 0, E.x1, 0, {
    openings: [{ id: 'pantry', t: 2, width: 0.9, type: 'door' }],
  }),
  W('pan-n', 14, 4, E.x1, 4),
]

// ─── L2 — simple suite split ────────────────────────────────────────────────

export const L2_EXTERIOR_WALLS = [
  W('l2-n', E.x0, E.z0, E.x1, E.z0, {
    thickness: Te,
    kind: 'glass',
    level: 2,
    openings: [{ id: 'primary-slide', t: 12, width: 8, type: 'opening' }],
  }),
  W('l2-e', E.x1, E.z0, E.x1, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s', E.x1, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w', E.x0, E.z1, E.x0, E.z0, { thickness: Te, kind: 'exterior', level: 2 }),
]

export const L2_INTERIOR_WALLS = [
  // Primary | landing / guests  at x=2 and x=11
  W('pri-e', 2, E.z0, 2, 5, {
    level: 2,
    openings: [{ id: 'primary', t: 8, width: 1.2, type: 'door' }],
  }),
  W('pri-e2', 2, 5, 2, E.z1, { level: 2 }),
  W('suite-n', E.x0, 5, -10, 5, { level: 2 }),
  W('suite-n2', -10, 5, 2, 5, {
    level: 2,
    openings: [{ id: 'to-dress', t: 6, width: 1.0, type: 'door' }],
  }),
  W('dress-e', -10, 5, -10, E.z1, {
    level: 2,
    openings: [{ id: 'dress-bath', t: 3, width: 0.9, type: 'door' }],
  }),
  W('bath-n', -10, 11, 2, 11, { level: 2 }),
  W('dress-n', E.x0, 11, -10, 11, { level: 2 }),

  // Stair + landing
  W('st2-w', 6, 5, 6, 11, {
    level: 2,
    openings: [{ id: 'stair2', t: 3, width: 1.2, type: 'opening' }],
  }),
  W('st2-e', 11, 5, 11, 11, { level: 2 }),
  W('st2-s', 6, 5, 11, 5, { level: 2 }),
  W('st2-n', 6, 11, 11, 11, { level: 2 }),
  W('land-s', 2, 5, 6, 5, { level: 2 }),

  // Guest wing east of stair
  W('g-w', 11, E.z0, 11, -1, { level: 2 }),
  W('g-w2', 11, -1, 11, 3, {
    level: 2,
    openings: [{ id: 'g1', t: 2, width: 0.9, type: 'door' }],
  }),
  W('g-w3', 11, 3, 11, 5, { level: 2 }),
  W('g-w4', 11, 5, 11, 11, {
    level: 2,
    openings: [{ id: 'g2', t: 3, width: 0.9, type: 'door' }],
  }),
  W('g-mid', 11, -1, E.x1, -1, { level: 2 }),
  W('g-bath', 11, 3, E.x1, 3, { level: 2 }),
  W('bath-split', 15, -1, 15, 3, { level: 2 }),
]

// ─── Roof ───────────────────────────────────────────────────────────────────

export const L3_WALLS = [
  W('l3-ln', -2, 5, 6, 5, {
    level: 3,
    kind: 'exterior',
    openings: [{ id: 'lounge', t: 4, width: 4, type: 'opening' }],
  }),
  W('l3-le', 6, 5, 6, 11, { level: 3, kind: 'exterior' }),
  W('l3-ls', 6, 11, -2, 11, { level: 3, kind: 'exterior' }),
  W('l3-lw', -2, 11, -2, 5, { level: 3, kind: 'exterior' }),
  W('l3-st-e', 11, 5, 11, 11, { level: 3 }),
  W('l3-st-s', 6, 5, 11, 5, { level: 3 }),
  W('l3-st-n', 6, 11, 11, 11, { level: 3 }),
  W('l3-b-w', 6, 11, 6, 12, { level: 3 }),
  W('l3-b-e', 9, 11, 9, 12, { level: 3 }),
  W('l3-b-n', 6, 12, 9, 12, { level: 3 }),
  W('l3-b-s', 6, 11, 9, 11, {
    level: 3,
    openings: [{ id: 'roof-bath', t: 1.5, width: 0.8, type: 'door' }],
  }),
  W('l3-rail', -18, -12, 18, -12, {
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
          (a[0] - w.ax) * dx + (a[1] - w.az) * dz - ((b[0] - w.ax) * dx + (b[1] - w.az) * dz),
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
