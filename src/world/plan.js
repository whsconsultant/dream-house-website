/**
 * Plan — tighter full-floor duplex, every zone earns its keep.
 *
 * Plate 34 × 20 m (~680 m²) — still full-floor, not a warehouse.
 * L1: living + dining + kitchen open together; compact service core.
 * L2: right-sized primary + 2 guests (no 300 m² empty bedroom).
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
  subtitle: '34×20 m · open live/dine/cook · 3 beds · roof pool',
  units: 'm',
  xMin: -19,
  xMax: 19,
  zMin: -15,
  zMax: 12,
  envelope: { x0: -17, x1: 17, z0: -10, z1: 10 },
  terrace: { x0: -15, x1: 15, z0: -13, z1: -10 },
  glassLineZ: -10,
  scaleBarMeters: 5,
  plateW: 34,
  plateD: 20,
  reference: 'Tighter plate; living/dining/kitchen open; no dead corners',
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
  { id: 'foyer', name: 'Foyer', level: 1, x0: -2.5, x1: 2.5, z0: 7, z1: 10, note: 'Elevator' },
  { id: 'coat', name: 'Coat', level: 1, x0: -5, x1: -2.5, z0: 7, z1: 10, note: 'Closet' },
  {
    id: 'living',
    name: 'Living',
    level: 1,
    x0: -15,
    x1: 0,
    z0: -8,
    z1: 7,
    note: 'Open to dining',
    void: true,
  },
  {
    id: 'dining',
    name: 'Dining',
    level: 1,
    x0: 0,
    x1: 7,
    z0: -8,
    z1: 2,
    note: 'Open · by kitchen',
    void: true,
  },
  { id: 'kitchen', name: 'Kitchen', level: 1, x0: 7, x1: 15, z0: -8, z1: 0, note: 'Island' },
  { id: 'pantry', name: 'Pantry', level: 1, x0: 12, x1: 15, z0: 0, z1: 3.5, note: '' },
  { id: 'office', name: 'Office', level: 1, x0: 7, x1: 12, z0: 0, z1: 5, note: '' },
  { id: 'powder', name: 'Powder', level: 1, x0: 2.5, x1: 5, z0: 4, z1: 7, note: 'From living' },
  { id: 'stairs', name: 'Stair', level: 1, x0: 5, x1: 9, z0: 4, z1: 9, note: '', stair: true },
  { id: 'laundry', name: 'Laundry', level: 1, x0: 9, x1: 13, z0: 6.5, z1: 9.5, note: '' },
  {
    id: 'terrace',
    name: 'Terrace',
    level: 1,
    x0: -15,
    x1: 15,
    z0: -13,
    z1: -10,
    note: '3 m deep',
    outdoor: true,
  },
]

export const L2_ROOMS = [
  { id: 'stairs2', name: 'Stair', level: 2, x0: 5, x1: 9, z0: 4, z1: 9, note: '', stair: true },
  { id: 'landing', name: 'Landing', level: 2, x0: 1, x1: 5, z0: 4, z1: 9, note: '', corridor: true },
  {
    id: 'primary',
    name: 'Primary',
    level: 2,
    x0: -15,
    x1: 1,
    z0: -8,
    z1: 2,
    note: '~5×8 m class bed zone',
  },
  { id: 'sitting', name: 'Sitting', level: 2, x0: -15, x1: -8, z0: 2, z1: 7, note: 'In suite' },
  { id: 'dressing', name: 'Dressing', level: 2, x0: -8, x1: -2, z0: 2, z1: 7, note: 'WIC' },
  { id: 'pbath', name: 'Primary Bath', level: 2, x0: -2, x1: 1, z0: 2, z1: 7, note: '' },
  { id: 'guest1', name: 'Guest 1', level: 2, x0: 9, x1: 15, z0: -8, z1: -1, note: 'En suite' },
  { id: 'bath1', name: 'Bath 1', level: 2, x0: 9, x1: 12.5, z0: -1, z1: 2.5, note: '' },
  { id: 'guest2', name: 'Guest 2', level: 2, x0: 9, x1: 15, z0: 2.5, z1: 9, note: 'En suite' },
  { id: 'bath2', name: 'Bath 2', level: 2, x0: 12.5, x1: 15, z0: -1, z1: 2.5, note: '' },
  {
    id: 'terrace2',
    name: 'Terrace',
    level: 2,
    x0: -15,
    x1: 5,
    z0: -13,
    z1: -10,
    note: 'Off primary',
    outdoor: true,
  },
]

export const L3_ROOMS = [
  { id: 'stairs3', name: 'Stair', level: 3, x0: 5, x1: 9, z0: 4, z1: 9, note: '', stair: true },
  { id: 'lounge', name: 'Sky Lounge', level: 3, x0: -1, x1: 5, z0: 4, z1: 9, note: 'Covered' },
  {
    id: 'summer',
    name: 'Summer Kitchen',
    level: 3,
    x0: 9,
    x1: 15,
    z0: 3,
    z1: 9,
    note: '',
    outdoor: true,
  },
  { id: 'bath3', name: 'Bath', level: 3, x0: 5, x1: 7.5, z0: 9, z1: 10, note: '' },
  {
    id: 'rooftop',
    name: 'Roof Deck',
    level: 3,
    x0: -15,
    x1: 15,
    z0: -10,
    z1: 4,
    note: 'Open',
    outdoor: true,
  },
]

export const ALL_PLAN_ROOMS = [...L1_ROOMS, ...L2_ROOMS, ...L3_ROOMS]

export const WATER = {
  pool: { x0: -3, x1: 9, z0: -7, z1: -3, depth: 1.25 }, // 12 × 4 m
  spa: { x0: -8, x1: -4, z0: -6.5, z1: -3.5, depth: 0.9 },
}

// ─── L1 walls ───────────────────────────────────────────────────────────────

export const L1_EXTERIOR_WALLS = [
  W('l1-n', E.x0, E.z0, E.x1, E.z0, {
    thickness: Te,
    kind: 'glass',
    openings: [{ id: 'terrace-slide', t: 17, width: 10, type: 'opening' }],
  }),
  W('l1-e', E.x1, E.z0, E.x1, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s0', E.x1, E.z1, 2.5, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s1', 2.5, E.z1, -2.5, E.z1, {
    thickness: Te,
    kind: 'exterior',
    openings: [{ id: 'entry', t: 2.5, width: 2.4, type: 'door' }],
  }),
  W('l1-s2', -2.5, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-w', E.x0, E.z1, E.x0, E.z0, { thickness: Te, kind: 'exterior' }),
]

export const L1_INTERIOR_WALLS = [
  // Foyer + coat
  W('foy-w', -2.5, 7, -2.5, 10),
  W('foy-e', 2.5, 7, 2.5, 10),
  W('foy-n', -2.5, 7, 2.5, 7, {
    openings: [{ id: 'to-living', t: 2.5, width: 2.8, type: 'opening' }],
  }),
  W('coat-w', -5, 7, -5, 10),
  W('coat-n', -5, 7, -2.5, 7, {
    openings: [{ id: 'coat', t: 1.2, width: 0.8, type: 'door' }],
  }),

  // Service core — powder from living
  W('core-w', 2.5, 4, 2.5, 7, {
    openings: [{ id: 'powder', t: 1.5, width: 0.8, type: 'door' }],
  }),
  W('core-s', 2.5, 4, 9, 4),
  W('pow-e', 5, 4, 5, 7),
  W('pow-n', 2.5, 7, 5, 7),
  W('st-e', 9, 4, 9, 9),
  W('st-n', 5, 9, 9, 9),
  W('st-w', 5, 4, 5, 9, {
    openings: [{ id: 'stair', t: 2.5, width: 1.1, type: 'opening' }],
  }),
  W('lau-s', 9, 6.5, 13, 6.5),
  W('lau-e', 13, 6.5, 13, 9.5),
  W('lau-n', 9, 9.5, 13, 9.5),
  W('lau-tie', 9, 9, 9, 9.5),

  // Office + pantry (kitchen stays open to dining)
  W('off-s', 7, 0, 12, 0, {
    openings: [{ id: 'office', t: 2.5, width: 1.0, type: 'door' }],
  }),
  W('off-w', 7, 0, 7, 5),
  W('off-n', 7, 5, 12, 5),
  W('off-e', 12, 0, 12, 5),
  W('pan-s', 12, 0, E.x1, 0, {
    openings: [{ id: 'pantry', t: 1.5, width: 0.9, type: 'door' }],
  }),
  W('pan-n', 12, 3.5, E.x1, 3.5),
]

// ─── L2 walls ───────────────────────────────────────────────────────────────

export const L2_EXTERIOR_WALLS = [
  W('l2-n', E.x0, E.z0, E.x1, E.z0, {
    thickness: Te,
    kind: 'glass',
    level: 2,
    openings: [{ id: 'primary-slide', t: 10, width: 7, type: 'opening' }],
  }),
  W('l2-e', E.x1, E.z0, E.x1, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s', E.x1, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w', E.x0, E.z1, E.x0, E.z0, { thickness: Te, kind: 'exterior', level: 2 }),
]

export const L2_INTERIOR_WALLS = [
  // Primary suite west of landing
  W('pri-e', 1, E.z0, 1, 2, {
    level: 2,
    openings: [{ id: 'primary', t: 6, width: 1.1, type: 'door' }],
  }),
  W('pri-e2', 1, 2, 1, 7, { level: 2 }),
  W('pri-e3', 1, 7, 1, E.z1, { level: 2 }),
  W('suite-n', E.x0, 2, -8, 2, { level: 2 }),
  W('suite-n2', -8, 2, -2, 2, {
    level: 2,
    openings: [{ id: 'to-dress', t: 3, width: 1.0, type: 'door' }],
  }),
  W('suite-n3', -2, 2, 1, 2, {
    level: 2,
    openings: [{ id: 'to-bath', t: 1.5, width: 0.9, type: 'door' }],
  }),
  W('sit-e', -8, 2, -8, 7, {
    level: 2,
    openings: [{ id: 'sit-dress', t: 2.5, width: 0.9, type: 'door' }],
  }),
  W('dress-e', -2, 2, -2, 7, {
    level: 2,
    openings: [{ id: 'dress-bath', t: 2.5, width: 0.9, type: 'door' }],
  }),
  W('suite-top', E.x0, 7, -8, 7, { level: 2 }),
  W('suite-top2', -8, 7, -2, 7, { level: 2 }),
  W('suite-top3', -2, 7, 1, 7, { level: 2 }),

  // Stair + landing
  W('st2-w', 5, 4, 5, 9, {
    level: 2,
    openings: [{ id: 'stair2', t: 2.5, width: 1.1, type: 'opening' }],
  }),
  W('st2-e', 9, 4, 9, 9, { level: 2 }),
  W('st2-s', 5, 4, 9, 4, { level: 2 }),
  W('st2-n', 5, 9, 9, 9, { level: 2 }),
  W('land-s', 1, 4, 5, 4, { level: 2 }),

  // Guests
  W('g-w0', 9, E.z0, 9, -1, { level: 2 }),
  W('g-w1', 9, -1, 9, 2.5, {
    level: 2,
    openings: [{ id: 'g1', t: 1.5, width: 0.9, type: 'door' }],
  }),
  W('g-w2', 9, 2.5, 9, 4, { level: 2 }),
  W('g-w3', 9, 4, 9, 9, {
    level: 2,
    openings: [{ id: 'g2', t: 2.5, width: 0.9, type: 'door' }],
  }),
  W('g-mid', 9, -1, E.x1, -1, { level: 2 }),
  W('g-bath', 9, 2.5, E.x1, 2.5, { level: 2 }),
  W('bath-split', 12.5, -1, 12.5, 2.5, { level: 2 }),
]

// ─── Roof ───────────────────────────────────────────────────────────────────

export const L3_WALLS = [
  W('l3-ln', -1, 4, 5, 4, {
    level: 3,
    kind: 'exterior',
    openings: [{ id: 'lounge', t: 3, width: 3.5, type: 'opening' }],
  }),
  W('l3-le', 5, 4, 5, 9, { level: 3, kind: 'exterior' }),
  W('l3-ls', 5, 9, -1, 9, { level: 3, kind: 'exterior' }),
  W('l3-lw', -1, 9, -1, 4, { level: 3, kind: 'exterior' }),
  W('l3-st-e', 9, 4, 9, 9, { level: 3 }),
  W('l3-st-s', 5, 4, 9, 4, { level: 3 }),
  W('l3-st-n', 5, 9, 9, 9, { level: 3 }),
  W('l3-b-w', 5, 9, 5, 10, { level: 3 }),
  W('l3-b-e', 7.5, 9, 7.5, 10, { level: 3 }),
  W('l3-b-n', 5, 10, 7.5, 10, { level: 3 }),
  W('l3-b-s', 5, 9, 7.5, 9, {
    level: 3,
    openings: [{ id: 'roof-bath', t: 1.2, width: 0.8, type: 'door' }],
  }),
  W('l3-rail', -15, -10, 15, -10, {
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
