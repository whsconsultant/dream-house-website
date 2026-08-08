/**
 * Layer 2 — Plan data (redesigned for usefulness)
 *
 * Research takeaway (NYC/Monaco/Glyfada duplex PHs):
 * - 3 bedrooms beat 6 undersized ones
 * - Day/night split: social on L1, private on L2
 * - One open great room (live + dine) — don't chop into family/wet-bar/breakfast boxes
 * - Support: pantry, powder, laundry only
 * - Roof: pool + lounge + summer kitchen
 *
 * Full-floor plate 40 × 24 m (~960 m²). One house, no A/B neighbor.
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
  subtitle: '3-bed · open great room · roof pool · designed to live in',
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
  reference: 'Open-plan duplex pattern: foyer→great room→kitchen; suites upstairs; roof pool',
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

// ─── Rooms (lean program) ───────────────────────────────────────────────────

export const L1_ROOMS = [
  { id: 'foyer', name: 'Foyer', level: 1, x0: -3.5, x1: 3.5, z0: 8, z1: 12, note: 'Private elevator' },
  { id: 'gallery', name: 'Gallery', level: 1, x0: -2, x1: 2, z0: 1, z1: 8, note: '', corridor: true },
  {
    id: 'great',
    name: 'Great Room',
    level: 1,
    x0: -18,
    x1: 2,
    z0: -10,
    z1: 1,
    note: 'Living + dining · open',
    void: true,
  },
  { id: 'kitchen', name: 'Kitchen', level: 1, x0: 2, x1: 12, z0: -10, z1: -1, note: 'Island · open to great' },
  { id: 'pantry', name: 'Pantry', level: 1, x0: 12, x1: 18, z0: -6, z1: -1, note: '' },
  { id: 'office', name: 'Office', level: 1, x0: 12, x1: 18, z0: -1, z1: 6, note: 'Flex / guest' },
  { id: 'powder', name: 'Powder', level: 1, x0: 3, x1: 6, z0: 4, z1: 7, note: '' },
  { id: 'stairs', name: 'Stair', level: 1, x0: 6, x1: 11, z0: 4, z1: 10, note: 'To suites', stair: true },
  { id: 'laundry', name: 'Laundry', level: 1, x0: 11, x1: 16, z0: 7, z1: 11, note: '' },
  {
    id: 'terrace',
    name: 'View Terrace',
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
  { id: 'stairs2', name: 'Stair', level: 2, x0: 6, x1: 11, z0: 4, z1: 10, note: '', stair: true },
  { id: 'hall', name: 'Hall', level: 2, x0: -2, x1: 2, z0: -2, z1: 8, note: '', corridor: true },
  { id: 'elev2', name: 'Elevator', level: 2, x0: -2, x1: 2, z0: 8, z1: 12, note: '', corridor: true },
  {
    id: 'primary',
    name: 'Primary Bedroom',
    level: 2,
    x0: -18,
    x1: -4,
    z0: -10,
    z1: 2,
    note: 'View suite',
  },
  { id: 'dressing', name: 'Dressing', level: 2, x0: -18, x1: -10, z0: 2, z1: 9, note: 'WIC' },
  { id: 'pbath', name: 'Primary Bath', level: 2, x0: -10, x1: -4, z0: 2, z1: 9, note: 'Spa bath' },
  { id: 'guest1', name: 'Guest Suite', level: 2, x0: 4, x1: 12, z0: -10, z1: -1, note: 'En suite' },
  { id: 'bath1', name: 'Bath', level: 2, x0: 12, x1: 16, z0: -10, z1: -5, note: '' },
  { id: 'guest2', name: 'Guest Suite', level: 2, x0: 4, x1: 12, z0: -1, z1: 8, note: 'En suite' },
  { id: 'bath2', name: 'Bath', level: 2, x0: 12, x1: 16, z0: -5, z1: 0, note: '' },
  { id: 'media', name: 'Media / Lounge', level: 2, x0: 11, x1: 18, z0: 4, z1: 11, note: 'Family' },
  {
    id: 'terrace2',
    name: 'Suite Terrace',
    level: 2,
    x0: -18,
    x1: 4,
    z0: -16,
    z1: -12,
    note: 'Off primary',
    outdoor: true,
  },
]

export const L3_ROOMS = [
  { id: 'stairs3', name: 'Stair', level: 3, x0: 6, x1: 11, z0: 4, z1: 10, note: '', stair: true },
  { id: 'lounge', name: 'Sky Lounge', level: 3, x0: -4, x1: 6, z0: 4, z1: 11, note: 'Covered' },
  { id: 'summer', name: 'Summer Kitchen', level: 3, x0: 11, x1: 18, z0: 2, z1: 10, note: 'Outdoor', outdoor: true },
  { id: 'bath3', name: 'Bath', level: 3, x0: 6, x1: 9, z0: 10, z1: 12, note: '' },
  {
    id: 'rooftop',
    name: 'Roof Deck',
    level: 3,
    x0: -18,
    x1: 18,
    z0: -12,
    z1: 4,
    note: 'Open sky',
    outdoor: true,
  },
  {
    id: 'sundeck',
    name: 'Sun Deck',
    level: 3,
    x0: -18,
    x1: -8,
    z0: -10,
    z1: -4,
    note: 'Loungers',
    outdoor: true,
  },
]

export const ALL_PLAN_ROOMS = [...L1_ROOMS, ...L2_ROOMS, ...L3_ROOMS]

export const WATER = {
  pool: { x0: -4, x1: 10, z0: -9, z1: -4, depth: 1.25 }, // 14 × 5 m
  spa: { x0: -10, x1: -5, z0: -8, z1: -4, depth: 0.9 },
}

// ─── L1 walls ───────────────────────────────────────────────────────────────

export const L1_EXTERIOR_WALLS = [
  W('l1-n0', E.x0, E.z0, 2, E.z0, {
    thickness: Te,
    kind: 'glass',
    openings: [{ id: 'great-slide', t: 10, width: 8, type: 'opening' }],
  }),
  W('l1-n1', 2, E.z0, 12, E.z0, {
    thickness: Te,
    kind: 'glass',
    openings: [{ id: 'kit-slide', t: 5, width: 4, type: 'opening' }],
  }),
  W('l1-n2', 12, E.z0, E.x1, E.z0, { thickness: Te, kind: 'glass' }),
  W('l1-e0', E.x1, E.z0, E.x1, -1, { thickness: Te, kind: 'exterior' }),
  W('l1-e1', E.x1, -1, E.x1, 6, { thickness: Te, kind: 'exterior' }),
  W('l1-e2', E.x1, 6, E.x1, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s0', E.x1, E.z1, 11, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s1', 11, E.z1, 3.5, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-s2', 3.5, E.z1, -3.5, E.z1, {
    thickness: Te,
    kind: 'exterior',
    openings: [{ id: 'entry', t: 3.5, width: 2.8, type: 'door' }],
  }),
  W('l1-s3', -3.5, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior' }),
  W('l1-w0', E.x0, E.z1, E.x0, 1, { thickness: Te, kind: 'exterior' }),
  W('l1-w1', E.x0, 1, E.x0, E.z0, { thickness: Te, kind: 'exterior' }),
]

export const L1_INTERIOR_WALLS = [
  // Gallery
  W('l1-gw0', -2, E.z0, -2, 1),
  W('l1-gw1', -2, 1, -2, 8),
  W('l1-ge0', 2, E.z0, 2, -1),
  W('l1-ge1', 2, -1, 2, 1),
  W('l1-ge2', 2, 1, 2, 4),
  W('l1-ge3', 2, 4, 2, 8),

  // Foyer
  W('l1-fw', -3.5, 8, -3.5, 12),
  W('l1-fe', 3.5, 8, 3.5, 12),
  W('l1-fn0', -3.5, 8, -2, 8),
  W('l1-fn1', -2, 8, 2, 8, {
    openings: [{ id: 'foyer-open', t: 2, width: 2.4, type: 'opening' }],
  }),
  W('l1-fn2', 2, 8, 3.5, 8),

  // Open living | kitchen (wide opening)
  W('l1-z-1', 2, -1, 12, -1, {
    openings: [{ id: 'great-kit', t: 5, width: 4, type: 'opening' }],
  }),
  W('l1-x12a', 12, E.z0, 12, -6),
  W('l1-x12b', 12, -6, 12, -1, {
    openings: [{ id: 'pantry-door', t: 2.5, width: 0.9, type: 'door' }],
  }),
  W('l1-x12c', 12, -1, 12, 6, {
    openings: [{ id: 'office-door', t: 3, width: 1.0, type: 'door' }],
  }),
  W('l1-pan-s', 12, -6, E.x1, -6),
  W('l1-off-n', 12, 6, E.x1, 6),

  // Powder + stair + laundry
  W('l1-z1e', 2, 1, 6, 1),
  W('l1-z1e2', 6, 1, 11, 1),
  W('l1-pow-s', 3, 4, 6, 4, {
    openings: [{ id: 'powder', t: 1.5, width: 0.8, type: 'door' }],
  }),
  W('l1-pow-e', 6, 4, 6, 7),
  W('l1-pow-n', 3, 7, 6, 7),
  W('l1-pow-w', 3, 4, 3, 7),
  W('l1-st-w0', 6, 1, 6, 4),
  W('l1-st-w1', 6, 4, 6, 7, {
    openings: [{ id: 'stair', t: 1.5, width: 1.1, type: 'opening' }],
  }),
  W('l1-st-w2', 6, 7, 6, 10),
  W('l1-st-e0', 11, 1, 11, 7),
  W('l1-st-e1', 11, 7, 11, 10),
  W('l1-st-n', 6, 10, 11, 10),
  W('l1-st-s', 6, 4, 11, 4),
  W('l1-lau-s', 11, 7, 16, 7),
  W('l1-lau-e', 16, 7, 16, 11),
  W('l1-lau-e2', 16, 11, 16, 12),
  W('l1-lau-n', 11, 11, 16, 11),
  W('l1-lau-tie', 11, 10, 11, 11),
  W('l1-lau-tie2', 11, 11, 11, 12),
]

// ─── L2 walls ───────────────────────────────────────────────────────────────

export const L2_EXTERIOR_WALLS = [
  W('l2-n0', E.x0, E.z0, -4, E.z0, {
    thickness: Te,
    kind: 'glass',
    level: 2,
    openings: [{ id: 'primary-slide', t: 7, width: 6, type: 'opening' }],
  }),
  W('l2-n1', -4, E.z0, 4, E.z0, { thickness: Te, kind: 'glass', level: 2 }),
  W('l2-n2', 4, E.z0, 12, E.z0, { thickness: Te, kind: 'glass', level: 2 }),
  W('l2-n3', 12, E.z0, E.x1, E.z0, { thickness: Te, kind: 'glass', level: 2 }),
  W('l2-e0', E.x1, E.z0, E.x1, 0, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-e1', E.x1, 0, E.x1, 4, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-e2', E.x1, 4, E.x1, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s0', E.x1, E.z1, 11, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s1', 11, E.z1, 2, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s2', 2, E.z1, -2, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-s3', -2, E.z1, E.x0, E.z1, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w0', E.x0, E.z1, E.x0, 9, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w1', E.x0, 9, E.x0, 2, { thickness: Te, kind: 'exterior', level: 2 }),
  W('l2-w2', E.x0, 2, E.x0, E.z0, { thickness: Te, kind: 'exterior', level: 2 }),
]

export const L2_INTERIOR_WALLS = [
  W('l2-hw0', -2, E.z0, -2, 2, { level: 2 }),
  W('l2-hw1', -2, 2, -2, 8, { level: 2 }),
  W('l2-he0', 2, E.z0, 2, -2, { level: 2 }),
  W('l2-he1', 2, -2, 2, 4, { level: 2 }),
  W('l2-he2', 2, 4, 2, 8, { level: 2 }),
  W('l2-ht0', -2, 8, 2, 8, {
    level: 2,
    openings: [{ id: 'elev', t: 2, width: 1.2, type: 'opening' }],
  }),

  // Primary suite
  W('l2-pe', -4, E.z0, -4, 2, {
    level: 2,
    openings: [{ id: 'primary-door', t: 6, width: 1.1, type: 'door' }],
  }),
  W('l2-z2a', E.x0, 2, -10, 2, { level: 2 }),
  W('l2-z2b', -10, 2, -4, 2, { level: 2 }),
  W('l2-z2c', -4, 2, -2, 2, { level: 2 }),
  W('l2-dx', -10, 2, -10, 9, {
    level: 2,
    openings: [{ id: 'dress-bath', t: 3.5, width: 0.9, type: 'door' }],
  }),
  W('l2-dn', E.x0, 9, -10, 9, { level: 2 }),
  W('l2-bn', -10, 9, -4, 9, { level: 2 }),
  W('l2-be', -4, 2, -4, 9, { level: 2 }),

  // Guests
  W('l2-z-1e', 2, -1, 4, -1, { level: 2 }),
  W('l2-z-1e2', 4, -1, 12, -1, {
    level: 2,
    openings: [{ id: 'g1-door', t: 4, width: 0.9, type: 'door' }],
  }),
  W('l2-z-1e3', 12, -1, 16, -1, { level: 2 }),
  W('l2-x4a', 4, E.z0, 4, -1, { level: 2 }),
  W('l2-x4b', 4, -1, 4, 4, {
    level: 2,
    openings: [{ id: 'g2-door', t: 2.5, width: 0.9, type: 'door' }],
  }),
  W('l2-x4c', 4, 4, 4, 8, { level: 2 }),
  W('l2-x12a', 12, E.z0, 12, -5, { level: 2 }),
  W('l2-x12b', 12, -5, 12, -1, { level: 2 }),
  W('l2-x12c', 12, -1, 12, 0, { level: 2 }),
  W('l2-x12d', 12, 0, 12, 4, { level: 2 }),
  W('l2-b1n', 12, -5, 16, -5, { level: 2 }),
  W('l2-b2n', 12, 0, 16, 0, { level: 2 }),
  W('l2-x16a', 16, E.z0, 16, -5, { level: 2 }),
  W('l2-x16b', 16, -5, 16, 0, { level: 2 }),
  W('l2-x16c', 16, 0, 16, 4, { level: 2 }),
  W('l2-x16d', 16, 4, 16, 11, {
    level: 2,
    openings: [{ id: 'media-door', t: 3, width: 1.0, type: 'door' }],
  }),
  W('l2-x16e', 16, 11, 16, 12, { level: 2 }),
  W('l2-med-n', 11, 11, 16, 11, { level: 2 }),

  // Stair
  W('l2-st-w', 6, 4, 6, 10, { level: 2 }),
  W('l2-st-e', 11, 4, 11, 10, { level: 2 }),
  W('l2-st-n', 6, 10, 11, 10, { level: 2 }),
  W('l2-st-s', 6, 4, 11, 4, {
    level: 2,
    openings: [{ id: 'stair2', t: 2.5, width: 1.1, type: 'opening' }],
  }),
  W('l2-med-s', 11, 4, 16, 4, { level: 2 }),
  W('l2-med-s2', 16, 4, E.x1, 4, { level: 2 }),
  W('l2-g2-n', 4, 8, 6, 8, { level: 2 }),
]

// ─── L3 roof ────────────────────────────────────────────────────────────────

export const L3_WALLS = [
  W('l3-ln', -4, 4, 6, 4, {
    level: 3,
    kind: 'exterior',
    openings: [{ id: 'lounge-open', t: 5, width: 5, type: 'opening' }],
  }),
  W('l3-le', 6, 4, 6, 10, { level: 3, kind: 'exterior' }),
  W('l3-le2', 6, 10, 6, 11, { level: 3, kind: 'exterior' }),
  W('l3-ls', 6, 11, -4, 11, { level: 3, kind: 'exterior' }),
  W('l3-lw', -4, 11, -4, 4, { level: 3, kind: 'exterior' }),
  W('l3-st-w', 6, 4, 6, 10, { level: 3 }),
  W('l3-st-e', 11, 4, 11, 10, { level: 3 }),
  W('l3-st-s', 6, 4, 11, 4, { level: 3 }),
  W('l3-st-n', 6, 10, 11, 10, { level: 3 }),
  W('l3-b-w', 6, 10, 6, 12, { level: 3 }),
  W('l3-b-e', 9, 10, 9, 12, { level: 3 }),
  W('l3-b-n', 6, 12, 9, 12, { level: 3 }),
  W('l3-b-s', 6, 10, 9, 10, {
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
