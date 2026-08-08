/**
 * Floor plan sourced from typical luxury duplex penthouse layouts:
 * - Main level: foyer → open living/dining/kitchen along the view façade,
 *   master + guests on the quiet side (cf. Miami UPH, NYC duplexes).
 * - Upper level: mostly rooftop terrace with residential pool, spa,
 *   summer kitchen & small pavilion (cf. Sole PH Grove Isle, Ocean Park PH).
 *
 * NOT a public aquatics complex — pool is residential (~10×4 m), on the roof.
 *
 * Units: meters. Origin at plan center.
 * +Z = entry core (drawn toward bottom). −Z = primary view (drawn toward top).
 */

export const LEVEL = {
  H: 3.6,
  L2: 3.8,
}

export const PLAN_META = {
  title: 'Dream House — Duplex Penthouse',
  subtitle: 'Main living level · rooftop pool terrace · ~620 m² interior',
  units: 'm',
  xMin: -18,
  xMax: 18,
  zMin: -16,
  zMax: 14,
  // Building envelope (both levels share this plate)
  envelope: { x0: -16, x1: 16, z0: -12, z1: 12 },
  scaleBarMeters: 5,
}

/**
 * MAIN LEVEL — social core + private suites
 * Circulation: foyer/elevator at center-south, gallery spine to living.
 */
export const L1_ROOMS = [
  {
    id: 'foyer',
    name: 'Foyer',
    level: 1,
    x0: -3,
    x1: 3,
    z0: 7,
    z1: 12,
    note: 'Private elevator',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    level: 1,
    x0: -2,
    x1: 2,
    z0: 1,
    z1: 7,
    note: 'Circulation',
    corridor: true,
  },
  {
    id: 'living',
    name: 'Living',
    level: 1,
    x0: -14,
    x1: 2,
    z0: -10,
    z1: 1,
    note: 'Open to terrace',
    void: true,
  },
  {
    id: 'dining',
    name: 'Dining',
    level: 1,
    x0: 2,
    x1: 9,
    z0: -10,
    z1: -2,
    note: 'Open plan',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    level: 1,
    x0: 9,
    x1: 15,
    z0: -10,
    z1: -2,
    note: 'Island · pantry',
  },
  {
    id: 'pantry',
    name: 'Pantry',
    level: 1,
    x0: 12,
    x1: 15,
    z0: -2,
    z1: 2,
    note: '',
  },
  {
    id: 'powder',
    name: 'Powder',
    level: 1,
    x0: 3,
    x1: 6,
    z0: 4,
    z1: 7,
    note: '',
  },
  {
    id: 'stairs',
    name: 'Stair',
    level: 1,
    x0: 6,
    x1: 10,
    z0: 4,
    z1: 10,
    note: 'To roof',
    stair: true,
  },
  {
    id: 'study',
    name: 'Study',
    level: 1,
    x0: 10,
    x1: 15,
    z0: 2,
    z1: 8,
    note: '',
  },
  {
    id: 'master',
    name: 'Primary Suite',
    level: 1,
    x0: -15,
    x1: -5,
    z0: 1,
    z1: 11,
    note: 'Bedroom',
  },
  {
    id: 'dressing',
    name: 'Dressing',
    level: 1,
    x0: -15,
    x1: -10,
    z0: -4,
    z1: 1,
    note: 'WIC',
  },
  {
    id: 'mbath',
    name: 'Primary Bath',
    level: 1,
    x0: -10,
    x1: -5,
    z0: -4,
    z1: 1,
    note: '',
  },
  {
    id: 'guest1',
    name: 'Guest 1',
    level: 1,
    x0: -5,
    x1: -2,
    z0: 4,
    z1: 11,
    note: 'En suite',
  },
  {
    id: 'guest2',
    name: 'Guest 2',
    level: 1,
    x0: 10,
    x1: 15,
    z0: 8,
    z1: 12,
    note: 'En suite',
  },
  {
    id: 'terrace-l1',
    name: 'View Terrace',
    level: 1,
    x0: -15,
    x1: 15,
    z0: -14,
    z1: -10,
    note: 'Off living',
    outdoor: true,
  },
]

/**
 * ROOF LEVEL — entertainment terrace (Sole PH / Miami UPH roof pattern)
 * Small indoor pavilion + outdoor pool deck. Pool is residential scale.
 */
export const L2_ROOMS = [
  {
    id: 'pavilion',
    name: 'Sky Lounge',
    level: 2,
    x0: -4,
    x1: 6,
    z0: 2,
    z1: 10,
    note: 'Covered pavilion',
  },
  {
    id: 'stairs2',
    name: 'Stair',
    level: 2,
    x0: 6,
    x1: 10,
    z0: 4,
    z1: 10,
    note: '',
    stair: true,
  },
  {
    id: 'powder2',
    name: 'Powder',
    level: 2,
    x0: -4,
    x1: -1,
    z0: 7,
    z1: 10,
    note: '',
  },
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
    water: { x0: -6, x1: 6, z0: -9, z1: -4 }, // ~12 × 5 m infinity
    water2: { x0: -11, x1: -7, z0: -8, z1: -5 }, // spa ~4 × 3 m
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
