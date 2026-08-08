import * as THREE from 'three'
import { LEVEL, PLAN_META } from './floorplan-data.js'
import { ROOMS } from './rooms.js'
import { createMaterials, box, cyl } from './materials.js'
import {
  sofa,
  loungeChair,
  coffeeTable,
  diningTable,
  kitchenIsland,
  kitchenRun,
  bed,
  desk,
  bookshelf,
  fireplace,
  tvConsole,
  lounger,
  planter,
  outdoorKitchen,
  glassRail,
} from './furniture.js'

export { ROOMS, LEVEL }

const H = LEVEL.H
const L2 = LEVEL.L2
const ENV = PLAN_META.envelope

/**
 * Build duplex penthouse from floor plan.
 * Visual language: open living → glass → terrace; rooftop residential pool
 * (Glyfada / Tel Aviv / Marbella duplex references).
 */
export function createPenthouse(scene) {
  const root = new THREE.Group()
  root.name = 'penthouse'
  scene.add(root)
  const M = createMaterials()

  buildStructure(root, M)
  furnishMainLevel(root, M)
  furnishRoof(root, M)
  addLights(scene)

  return { root, rooms: ROOMS }
}

function buildStructure(root, M) {
  const W = ENV.x1 - ENV.x0
  const D = ENV.z1 - ENV.z0
  const cx = (ENV.x0 + ENV.x1) / 2
  const cz = (ENV.z0 + ENV.z1) / 2

  // —— Main floor slab ——
  box(W, 0.35, D, M.floorOak, cx, -0.175, cz, root, false)

  // View terrace L1 (north strip)
  box(30, 0.32, 4.2, M.floorStone, 0, -0.16, -12, root, false)

  // —— Roof deck slab (full plate) ——
  box(W, 0.3, D + 2, M.floorRoof, cx, L2 - 0.15, cz - 1, root, false)

  // Pavilion roof over sky lounge only
  box(11, 0.2, 9, M.ceiling, 1, L2 + 2.7, 6, root, false)

  // —— Exterior walls (with openings) ——
  // South (entry)
  wallWithDoor(root, M, 0, H / 2, ENV.z1, W, H, 0.2, 0, true)
  // East / West solid
  box(0.25, H, D, M.wall, ENV.x1, H / 2, cz, root)
  box(0.25, H, D, M.wall, ENV.x0, H / 2, cz, root)
  // North — mostly open glass to terrace
  addViewGlass(root, M)

  // —— Interior partitions (from plan adjacencies) ——
  // Gallery sides
  box(0.15, H - 0.2, 5.5, M.wall, -2.05, H / 2, 4, root)
  box(0.15, H - 0.2, 5.5, M.wall, 2.05, H / 2, 4, root)
  // Master wing wall
  box(9.5, H - 0.2, 0.15, M.wall, -10, H / 2, 1, root)
  box(0.15, H - 0.2, 9.5, M.wall, -5, H / 2, 6, root)
  // Between dressing / bath
  box(0.15, H - 0.2, 4.5, M.wall, -10, H / 2, -1.5, root)
  // Guest1
  box(0.15, H - 0.2, 6.5, M.wall, -2.05, H / 2, 7.5, root)
  box(2.8, H - 0.2, 0.15, M.wall, -3.5, H / 2, 4, root)
  // Study / guest2 / stair zone
  box(0.15, H - 0.2, 5.5, M.wall, 10, H / 2, 5, root)
  box(4.5, H - 0.2, 0.15, M.wall, 12.5, H / 2, 8, root)
  box(4.5, H - 0.2, 0.15, M.wall, 12.5, H / 2, 2, root)
  // Kitchen / pantry
  box(2.8, H - 0.2, 0.15, M.wall, 13.5, H / 2, -2, root)
  // Powder
  box(2.8, H - 0.2, 0.15, M.wall, 4.5, H / 2, 4, root)
  box(0.15, H - 0.2, 2.8, M.wall, 6, H / 2, 5.5, root)

  // Ceiling L1 (not over full double-height void — leave living open to feel taller)
  box(W - 0.5, 0.12, 10, M.ceiling, 0, H, 6, root, false)
  box(14, 0.12, 12, M.ceiling, 8, H, -4, root, false)
  box(10, 0.12, 10, M.ceiling, -10, H, 6, root, false)
  // Living gets high ceiling feel via cove
  box(15, 0.08, 10, M.ceiling, -6, H + 0.8, -4.5, root, false)

  // Stair
  addStair(root, M)

  // Pavilion walls on roof (open north)
  box(0.15, 2.5, 7.5, M.wall, -4, L2 + 1.3, 6, root)
  box(0.15, 2.5, 7.5, M.wall, 6, L2 + 1.3, 6, root)
  box(10, 2.5, 0.15, M.wall, 1, L2 + 1.3, 10, root)
  // Glass front of pavilion toward pool
  const pavGlass = box(9.5, 2.3, 0.08, M.glass, 1, L2 + 1.25, 2.1, root, false)
  pavGlass.material = M.glass

  // Exterior frame accents
  for (const x of [-14, -7, 0, 7, 14]) {
    box(0.12, H, 0.12, M.bronze, x, H / 2, ENV.z0, root)
  }
}

function wallWithDoor(root, M, x, y, z, w, h, t, rotY, hasDoor) {
  if (!hasDoor) {
    box(w, h, t, M.wall, x, y, z, root)
    return
  }
  // Two sides + header around a 1.2m door
  const doorW = 1.2
  const side = (w - doorW) / 2
  box(side, h, t, M.wall, x - doorW / 2 - side / 2, y, z, root)
  box(side, h, t, M.wall, x + doorW / 2 + side / 2, y, z, root)
  box(doorW, h - 2.2, t, M.wall, x, y + 1.1, z, root)
  // Door leaf
  box(1.05, 2.15, 0.06, M.woodDark, x, 1.1, z - 0.05, root)
  cyl(0.02, 0.02, 0.08, M.bronze, x + 0.4, 1.05, z - 0.1, root, 8)
}

function addViewGlass(root, M) {
  // Full-width sliding glass on north façade (living/dining/kitchen)
  const pane = box(28, H - 0.3, 0.08, M.glass, 0, H / 2, ENV.z0, root, false)
  pane.material = M.glass
  // Mullions
  for (const x of [-10.5, -3.5, 3.5, 10.5]) {
    box(0.08, H - 0.2, 0.1, M.bronze, x, H / 2, ENV.z0, root)
  }
  // Track
  box(28, 0.06, 0.12, M.bronze, 0, 0.05, ENV.z0, root)
  box(28, 0.06, 0.12, M.bronze, 0, H - 0.1, ENV.z0, root)
}

function addStair(root, M) {
  const steps = 14
  const rise = L2 / steps
  const run = 0.28
  const x = 8
  const z0 = 9.2
  for (let i = 0; i < steps; i++) {
    box(2.6, rise, run, M.marble, x, rise * (i + 0.5), z0 - i * run, root)
  }
  // Glass balustrade
  glassRail(root, M, x - 1.35, z0, x - 1.35, z0 - steps * run, 0)
  glassRail(root, M, x + 1.35, z0, x + 1.35, z0 - steps * run, 0)
  // Landing
  box(3.0, 0.12, 1.4, M.marble, x, L2, z0 - steps * run - 0.5, root)
}

function furnishMainLevel(root, M) {
  // Foyer
  box(1.2, 2.1, 0.08, M.wallFeature, 0, 1.1, 11.2, root) // elevator door
  box(0.9, 0.08, 0.35, M.marble, 0, 0.9, 9.5, root) // console
  box(0.9, 0.7, 0.3, M.wood, 0, 0.45, 9.5, root)
  cyl(0.15, 0.12, 0.35, M.glow, 0, 1.15, 9.5, root, 12)

  // Living — Glyfada-style: sofa facing fireplace + glass to terrace
  sofa(root, M, -6, 0, -3, { w: 3.2, d: 1.1, rot: 0 })
  sofa(root, M, -2.2, 0, -6.5, { w: 2.2, d: 1.0, rot: Math.PI / 2 })
  coffeeTable(root, M, -5.5, 0, -5.2)
  loungeChair(root, M, -9.5, 0, -5.5, Math.PI * 0.25)
  fireplace(root, M, -6, 0, 0.7)
  // Rug
  box(5.5, 0.02, 4.2, M.linen, -5.5, 0.02, -4.5, root, false)
  planter(root, M, -12.5, 0, -8.5)

  // Dining
  diningTable(root, M, 5, 0, -5.5, 6)
  // Pendant glow
  cyl(0.35, 0.25, 0.08, M.glow, 5, 2.6, -5.5, root, 20)
  cyl(0.02, 0.02, 0.8, M.bronze, 5, 3.0, -5.5, root, 6)

  // Kitchen
  kitchenIsland(root, M, 11.5, 0, -5.5)
  kitchenRun(root, M, 13.5, 0, -8.5, 3.5)

  // Study
  desk(root, M, 12.5, 0, 5, Math.PI)
  bookshelf(root, M, 14.5, 0, 4.5, 1.8, 2.5)

  // Primary suite
  bed(root, M, -10, 0, 6, Math.PI)
  // Bench
  box(1.2, 0.4, 0.4, M.velvet, -10, 0.28, 3.8, root)
  // Dressing rods / shelves
  box(4.5, 2.3, 0.4, M.wood, -12.5, 1.2, -1.5, root)
  for (let i = 0; i < 4; i++) {
    box(4.3, 0.03, 0.35, M.woodDark, -12.5, 0.5 + i * 0.5, -1.45, root)
  }
  // Bath
  box(2.2, 0.75, 0.55, M.marble, -7.5, 0.45, -2, root)
  box(2.2, 0.04, 0.55, M.marble, -7.5, 0.85, -2, root)
  cyl(0.55, 0.5, 0.45, M.marble, -7.5, 0.3, -1, root, 28)
  const bathWater = cyl(0.42, 0.42, 0.12, M.water, -7.5, 0.48, -1, root, 28)
  bathWater.material = M.water

  // Guest rooms
  bed(root, M, -3.5, 0, 7.5, Math.PI / 2)
  bed(root, M, 12.5, 0, 10, Math.PI)

  // L1 terrace loungers
  lounger(root, M, -4, 0, -12.5, 0)
  lounger(root, M, 0, 0, -12.5, 0)
  lounger(root, M, 4, 0, -12.5, 0)
  glassRail(root, M, -14, -14, 14, -14, 0)
  planter(root, M, -13, 0, -13)
  planter(root, M, 13, 0, -13)
}

function furnishRoof(root, M) {
  const y = L2

  // Sky lounge pavilion
  sofa(root, M, 0, y, 6, { w: 2.6, d: 1.0 })
  coffeeTable(root, M, 0, y, 4.5)
  loungeChair(root, M, 3, y, 5.5, -0.4)

  // Infinity pool — dark stone basin (Pitsou Kedem / Glyfada style)
  box(13.2, 0.95, 5.8, M.marbleDark, 0, y + 0.2, -6.5, root)
  const pool = box(12, 0.4, 5, M.water, 0, y + 0.45, -6.5, root, false)
  pool.material = M.water
  // Infinity lip toward view
  box(12.2, 0.1, 0.25, M.marbleDark, 0, y + 0.55, -9.15, root)
  // Coping
  box(13.4, 0.08, 0.35, M.marble, 0, y + 0.72, -3.7, root)
  box(13.4, 0.08, 0.35, M.marble, 0, y + 0.72, -9.3, root)

  // Spa
  box(4.4, 0.85, 3.4, M.marbleDark, -9, y + 0.2, -6.5, root)
  const spa = box(3.8, 0.35, 2.8, M.water, -9, y + 0.45, -6.5, root, false)
  spa.material = M.water

  // Loungers / sun deck
  lounger(root, M, -12, y, -10, 0)
  lounger(root, M, -9.5, y, -10, 0)
  lounger(root, M, 8, y, -8.5, Math.PI / 2)
  lounger(root, M, 8, y, -5.5, Math.PI / 2)

  outdoorKitchen(root, M, 11, y, -1.5)
  // Outdoor dining
  box(1.6, 0.06, 0.9, M.wood, 11, y + 0.74, 0.5, root)
  for (const s of [-0.45, 0.45]) {
    box(0.35, 0.4, 0.35, M.linen, 11 + s, y + 0.3, 0.1, root)
    box(0.35, 0.4, 0.35, M.linen, 11 + s, y + 0.3, 0.9, root)
  }

  planter(root, M, -14, y, -11)
  planter(root, M, 14, y, -11)
  planter(root, M, -14, y, 0)
  planter(root, M, 14, y, 0)

  // Roof perimeter glass rail
  glassRail(root, M, -15, -12, 15, -12, y)
  glassRail(root, M, -15, -12, -15, 10, y)
  glassRail(root, M, 15, -12, 15, 10, y)
}

function addLights(scene) {
  const pts = [
    [0, 2.8, 9, 0xfff2dc, 12],
    [-6, 3.2, -4, 0xfff6e8, 16],
    [5, 3.0, -5, 0xfff0d8, 12],
    [12, 2.8, -6, 0xfff8ec, 12],
    [-10, 2.6, 6, 0xffefd4, 10],
    [0, L2 + 2.2, 6, 0xfff4e4, 12],
    [0, L2 + 2.0, -6, 0xfff6e8, 14],
    [-9, L2 + 1.8, -6, 0xe8f4ff, 8],
  ]
  for (const [x, y, z, c, d] of pts) {
    const l = new THREE.PointLight(c, 14, d, 2)
    l.position.set(x, y, z)
    scene.add(l)
  }
}
