import * as THREE from 'three'

/**
 * ROOM PLAN (meters)
 * Origin: plan center. +Z entrance (south). −Z terrace (north). Y up.
 *
 * Enclosed footprint: 88 × 52
 *   X: -44 .. +44
 *   Z: -26 .. +26
 *
 * Open terrace (no roof / no L2 above):
 *   X: -42 .. +42  (inset 2m from sides)
 *   Z: -26 .. -50  (continues north from glass line)
 *
 * L2 setback: only where z > -16 (never covers outdoor pools)
 */

export const LEVEL = {
  H: 4.6, // L1 ceiling height
  L2: 4.8, // L2 floor top
}

export const PLAN = {
  W: 88,
  D: 52,
  terraceDepth: 24,
  glassLineZ: -26, // north face of enclosed volume
}

/** Teleport / HUD rooms — architecture first, then visit furniture. */
export const ROOMS = [
  {
    id: 'foyer',
    name: 'Foyer',
    level: 1,
    // bounds for reference
    bounds: { x0: -6, x1: 6, z0: 16, z1: 26 },
    position: new THREE.Vector3(0, 1.6, 22),
    lookAt: new THREE.Vector3(0, 1.8, 8),
  },
  {
    id: 'living',
    name: 'Great Room',
    level: 1,
    bounds: { x0: -16, x1: 16, z0: -10, z1: 14 },
    position: new THREE.Vector3(0, 1.6, 4),
    lookAt: new THREE.Vector3(0, 1.8, -18),
  },
  {
    id: 'dining',
    name: 'Dining',
    level: 1,
    bounds: { x0: 16, x1: 32, z0: 2, z1: 14 },
    position: new THREE.Vector3(22, 1.6, 8),
    lookAt: new THREE.Vector3(26, 1.5, 8),
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    level: 1,
    bounds: { x0: 28, x1: 42, z0: -8, z1: 4 },
    position: new THREE.Vector3(34, 1.6, -2),
    lookAt: new THREE.Vector3(38, 1.5, -6),
  },
  {
    id: 'media',
    name: 'Cinema',
    level: 1,
    bounds: { x0: 28, x1: 42, z0: 14, z1: 24 },
    position: new THREE.Vector3(34, 1.6, 18),
    lookAt: new THREE.Vector3(36, 1.5, 20),
  },
  {
    id: 'library',
    name: 'Library',
    level: 1,
    bounds: { x0: 28, x1: 42, z0: -22, z1: -8 },
    position: new THREE.Vector3(34, 1.6, -14),
    lookAt: new THREE.Vector3(38, 1.5, -14),
  },
  {
    id: 'indoorpool',
    name: 'Indoor Pool',
    level: 1,
    bounds: { x0: -42, x1: -16, z0: -18, z1: 8 },
    position: new THREE.Vector3(-28, 1.6, -4),
    lookAt: new THREE.Vector3(-32, 1.8, -4),
  },
  {
    id: 'guest',
    name: 'Guest Suite',
    level: 1,
    bounds: { x0: -42, x1: -28, z0: 10, z1: 24 },
    position: new THREE.Vector3(-34, 1.6, 16),
    lookAt: new THREE.Vector3(-36, 1.5, 16),
  },
  {
    id: 'terrace',
    name: 'Pool Terrace',
    level: 1,
    bounds: { x0: -42, x1: 42, z0: -50, z1: -26 },
    position: new THREE.Vector3(0, 1.6, -36),
    lookAt: new THREE.Vector3(0, 1.4, -46),
  },
  {
    id: 'stairs',
    name: 'Stair Hall',
    level: 1,
    bounds: { x0: 6, x1: 14, z0: 8, z1: 18 },
    position: new THREE.Vector3(10, 1.6, 14),
    lookAt: new THREE.Vector3(10, 4, 8),
  },
  {
    id: 'skylounge',
    name: 'Sky Lounge',
    level: 2,
    bounds: { x0: -14, x1: 14, z0: 4, z1: 20 },
    position: new THREE.Vector3(0, LEVEL.L2 + 1.6, 12),
    lookAt: new THREE.Vector3(0, LEVEL.L2 + 1.5, 2),
  },
  {
    id: 'master',
    name: 'Master Suite',
    level: 2,
    bounds: { x0: -40, x1: -16, z0: -8, z1: 16 },
    position: new THREE.Vector3(-28, LEVEL.L2 + 1.6, 4),
    lookAt: new THREE.Vector3(-32, LEVEL.L2 + 1.5, 0),
  },
  {
    id: 'gym',
    name: 'Sky Gym',
    level: 2,
    bounds: { x0: 16, x1: 40, z0: -8, z1: 16 },
    position: new THREE.Vector3(28, LEVEL.L2 + 1.6, 4),
    lookAt: new THREE.Vector3(32, LEVEL.L2 + 1.5, 0),
  },
  {
    id: 'overlook',
    name: 'Overlook',
    level: 2,
    bounds: { x0: -16, x1: 16, z0: -16, z1: -8 },
    position: new THREE.Vector3(0, LEVEL.L2 + 1.6, -12),
    lookAt: new THREE.Vector3(0, 1.5, -40),
  },
]
