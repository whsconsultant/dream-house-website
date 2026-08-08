import { LEVEL } from './plan.js'

/**
 * Architectural floor plan — source of truth for SVG + future 3D.
 *
 * Coordinates in meters. Origin at plan center.
 * +Z = entrance (drawn toward bottom of plan). −Z = terrace (top of plan).
 *
 * Enclosed: 88m × 52m
 * Open terrace: continues north of glass line, open sky (no L2 above).
 * L2 setback: only south of z = -16 so outdoor pools stay uncovered.
 */

export { LEVEL }

export const PLAN_META = {
  title: 'Dream House — Crown Duplex',
  subtitle: '88 × 52 m enclosed · open north terrace · L2 setback',
  units: 'm',
  // World extents for SVG viewBox mapping
  xMin: -44,
  xMax: 44,
  zMin: -50, // includes terrace
  zMax: 26,
  glassLineZ: -26,
  l2LimitZ: -16, // L2 must not extend north of this
}

/** Level 1 rooms — walls implied by adjacent bounds. */
export const L1_ROOMS = [
  {
    id: 'foyer',
    name: 'Foyer',
    level: 1,
    x0: -8,
    x1: 8,
    z0: 16,
    z1: 26,
    note: 'Arrival · lift lobby',
  },
  {
    id: 'living',
    name: 'Great Room',
    level: 1,
    x0: -16,
    x1: 16,
    z0: -10,
    z1: 16,
    note: 'Double-height · opens to terrace',
    void: true,
  },
  {
    id: 'dining',
    name: 'Dining',
    level: 1,
    x0: 16,
    x1: 30,
    z0: 4,
    z1: 16,
    note: 'Seats 10',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    level: 1,
    x0: 30,
    x1: 42,
    z0: -6,
    z1: 8,
    note: 'Island · pantry',
  },
  {
    id: 'media',
    name: 'Cinema',
    level: 1,
    x0: 30,
    x1: 42,
    z0: 14,
    z1: 24,
    note: 'Screen wall',
  },
  {
    id: 'library',
    name: 'Library',
    level: 1,
    x0: 30,
    x1: 42,
    z0: -22,
    z1: -6,
    note: 'Shelves · desk',
  },
  {
    id: 'indoorpool',
    name: 'Indoor Pool',
    level: 1,
    x0: -42,
    x1: -16,
    z0: -18,
    z1: 8,
    note: 'Heated 25 × 12 m lap',
    water: { x0: -40, x1: -18, z0: -14, z1: 4 },
  },
  {
    id: 'guest',
    name: 'Guest Suite',
    level: 1,
    x0: -42,
    x1: -28,
    z0: 10,
    z1: 24,
    note: 'Bed · bath',
  },
  {
    id: 'stairs',
    name: 'Stair',
    level: 1,
    x0: 8,
    x1: 14,
    z0: 8,
    z1: 18,
    note: 'To L2',
    stair: true,
  },
  {
    id: 'terrace',
    name: 'Pool Terrace',
    level: 1,
    x0: -42,
    x1: 42,
    z0: -50,
    z1: -26,
    note: 'Open sky · no upper floor',
    outdoor: true,
    water: { x0: -14, x1: 14, z0: -46, z1: -36 }, // infinity pool
    water2: { x0: -36, x1: -28, z0: -46, z1: -38 }, // plunge
  },
]

/** Level 2 — set back; nothing over outdoor terrace. */
export const L2_ROOMS = [
  {
    id: 'skylounge',
    name: 'Sky Lounge',
    level: 2,
    x0: -12,
    x1: 12,
    z0: 4,
    z1: 20,
    note: 'Mezzanine over foyer',
  },
  {
    id: 'master',
    name: 'Master Suite',
    level: 2,
    x0: -40,
    x1: -14,
    z0: -10,
    z1: 16,
    note: 'Bed · dressing · bath',
  },
  {
    id: 'gym',
    name: 'Sky Gym',
    level: 2,
    x0: 14,
    x1: 40,
    z0: -10,
    z1: 16,
    note: 'Training · mirror wall',
  },
  {
    id: 'overlook',
    name: 'Overlook',
    level: 2,
    x0: -14,
    x1: 14,
    z0: -16,
    z1: -6,
    note: 'Looks down to terrace pool',
  },
]

export const ALL_PLAN_ROOMS = [...L1_ROOMS, ...L2_ROOMS]
