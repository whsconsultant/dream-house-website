import * as THREE from 'three'
import { ROOMS, LEVEL } from './rooms.js'

export { ROOMS, LEVEL }

/**
 * Duplex crown penthouse — layout follows floorplan-data.js.
 * Living opens to an uncovered infinity terrace; L2 is set back.
 */

const COLORS = {
  floor: 0xd8d2c6,
  floorUpper: 0xcfc7bb,
  wall: 0xf4f0e8,
  wood: 0x6e5238,
  woodDark: 0x3f2e20,
  bronze: 0xa88858,
  glass: 0xa8c4d8,
  water: 0x3d7f96,
  waterDeep: 0x2a6580,
  stone: 0x8e8a82,
  tile: 0xd2dde4,
  velvet: 0x2f3845,
  linen: 0xebe4d8,
  marble: 0xefebe3,
  ceiling: 0xfaf7f2,
  green: 0x3a5640,
  cushion: 0xc4b49a,
}

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.65,
    metalness: opts.metalness ?? 0.04,
    ...opts,
  })
}

function mesh(geo, material, x, y, z, parent, cast = true) {
  const m = new THREE.Mesh(geo, material)
  m.position.set(x, y, z)
  m.castShadow = cast
  m.receiveShadow = true
  parent.add(m)
  return m
}

function box(w, h, d, material, x, y, z, parent, cast = true) {
  return mesh(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent, cast)
}

function cyl(rTop, rBot, h, material, x, y, z, parent, seg = 24) {
  return mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), material, x, y, z, parent)
}

export function createPenthouse(scene) {
  const root = new THREE.Group()
  root.name = 'penthouse'
  scene.add(root)

  const M = {
    floor: mat(COLORS.floor, { roughness: 0.34, metalness: 0.06 }),
    upper: mat(COLORS.floorUpper, { roughness: 0.4 }),
    wall: mat(COLORS.wall, { roughness: 0.9 }),
    wood: mat(COLORS.wood, { roughness: 0.55 }),
    woodDark: mat(COLORS.woodDark, { roughness: 0.5 }),
    bronze: mat(COLORS.bronze, { roughness: 0.32, metalness: 0.62 }),
    velvet: mat(COLORS.velvet, { roughness: 0.92 }),
    linen: mat(COLORS.linen, { roughness: 0.82 }),
    stone: mat(COLORS.stone, { roughness: 0.62 }),
    tile: mat(COLORS.tile, { roughness: 0.28, metalness: 0.05 }),
    marble: mat(COLORS.marble, { roughness: 0.22, metalness: 0.1 }),
    ceiling: mat(COLORS.ceiling, { roughness: 0.94 }),
    green: mat(COLORS.green, { roughness: 0.9 }),
    cushion: mat(COLORS.cushion, { roughness: 0.85 }),
  }

  const glass = new THREE.MeshPhysicalMaterial({
    color: COLORS.glass,
    transmission: 0.88,
    transparent: true,
    opacity: 0.22,
    roughness: 0.04,
    metalness: 0.02,
    thickness: 0.25,
    ior: 1.45,
    side: THREE.DoubleSide,
  })
  const waterDeep = new THREE.MeshPhysicalMaterial({
    color: COLORS.waterDeep,
    transmission: 0.45,
    transparent: true,
    opacity: 0.8,
    roughness: 0.06,
    metalness: 0.08,
    thickness: 1.2,
  })
  const waterOut = new THREE.MeshPhysicalMaterial({
    color: COLORS.water,
    transmission: 0.5,
    transparent: true,
    opacity: 0.78,
    roughness: 0.08,
    metalness: 0.06,
    thickness: 1.0,
  })

  const H = LEVEL.H
  const L2 = LEVEL.L2
  // Enclosed volume
  const W = 96
  const D = 64 // z from -32 to +32
  const terraceDepth = 28 // open deck beyond north glass (z < -32)

  // —— Slabs ——
  // Main indoor floor
  box(W, 0.4, D, M.floor, 0, -0.2, 0, root, false)
  // Open terrace slab — same width as building, continuous, NOT under L2
  box(W - 4, 0.4, terraceDepth, M.stone, 0, -0.2, -32 - terraceDepth / 2, root, false)

  // L2 only over indoor footprint, set back from north glass (stops at z ≈ -18)
  addUpperLevel(root, M, L2, H, W)

  // Roof only over L2 footprint
  box(W - 12, 0.25, 42, M.ceiling, 0, L2 + H, 2, root, false)

  addGlassShell(root, glass, M.bronze, W, D, L2 + H)
  // Open north: frameless sliding line at z = -D/2 (no glass wall blocking terrace)
  addNorthOpening(root, M.bronze, W, D, H)

  addPartitions(root, M, H, L2)
  addStair(root, M, L2)

  // Interiors — cleaner, fewer pieces
  addFoyer(root, M, H)
  addLiving(root, M)
  addDining(root, M)
  addKitchen(root, M)
  addMedia(root, M)
  addLibrary(root, M)
  addGuest(root, M, H)
  addIndoorPools(root, M, waterDeep, H)
  addOutdoorTerrace(root, M, waterOut, W, D, terraceDepth)
  addUpperRooms(root, M, L2)
  addOverlookBalcony(root, M, L2, W)

  addLights(scene, L2)

  return { root, rooms: ROOMS }
}

/** L2 plates: east/west/south only — nothing north of z = -18 (terrace stays open sky). */
function addUpperLevel(root, M, L2, H, W) {
  const y = L2 - 0.18
  box(30, 0.36, 44, M.upper, -33, y, 4, root, false) // west private
  box(30, 0.36, 44, M.upper, 33, y, 4, root, false) // east private
  box(36, 0.36, 22, M.upper, 0, y, 14, root, false) // south lounge bridge
  // Narrow overlook strip at north edge of L2 (balcony), still indoor side of glass
  box(40, 0.36, 8, M.upper, 0, y, -18, root, false)
  // L1 ceilings under those plates only
  box(30, 0.14, 40, M.ceiling, -33, H - 0.08, 4, root, false)
  box(30, 0.14, 40, M.ceiling, 33, H - 0.08, 4, root, false)
  box(36, 0.14, 18, M.ceiling, 0, H - 0.08, 16, root, false)
}

function addGlassShell(root, glass, bronze, W, D, totalH) {
  const t = 0.12
  // South + east + west only (north opens to terrace)
  mesh(new THREE.BoxGeometry(W - 6, totalH - 0.4, t), glass, 0, totalH / 2, D / 2, root, false)
  mesh(new THREE.BoxGeometry(t, totalH - 0.4, D), glass, W / 2, totalH / 2, 0, root, false)
  mesh(new THREE.BoxGeometry(t, totalH - 0.4, D), glass, -W / 2, totalH / 2, 0, root, false)

  for (let i = -6; i <= 6; i++) {
    box(0.16, totalH, 0.16, bronze, i * 7, totalH / 2, D / 2, root)
  }
  for (let i = -3; i <= 3; i++) {
    box(0.16, totalH, 0.16, bronze, W / 2, totalH / 2, i * 8, root)
    box(0.16, totalH, 0.16, bronze, -W / 2, totalH / 2, i * 8, root)
  }
}

function addNorthOpening(root, bronze, W, D, H) {
  // Structural columns at north glass line — open bays to terrace
  for (const x of [-40, -24, -8, 8, 24, 40]) {
    box(0.35, H, 0.35, bronze, x, H / 2, -D / 2, root)
  }
  // Slim header beam
  box(W - 8, 0.35, 0.4, bronze, 0, H - 0.2, -D / 2, root)
}

function addPartitions(root, M, H, L2) {
  const h = H - 0.35
  box(0.28, h, 36, M.wall, -18, h / 2, 2, root) // pool wing
  box(0.28, h, 30, M.wall, 18, h / 2, 0, root)
  box(22, h, 0.28, M.wall, 30, h / 2, 10, root)
  box(20, h, 0.28, M.wall, 30, h / 2, -10, root)
  box(0.28, h, 20, M.wall, -42, h / 2, 16, root)
  // L2
  const h2 = H - 0.4
  const y = L2 + h2 / 2
  box(0.28, h2, 28, M.wall, -16, y, 4, root)
  box(0.28, h2, 28, M.wall, 16, y, 4, root)
}

function addStair(root, M, L2) {
  const steps = 16
  const rise = L2 / steps
  const run = 0.38
  for (let i = 0; i < steps; i++) {
    box(3.2, rise, run, M.marble, 10, rise * (i + 0.5), 18 - i * run, root)
  }
  box(3.8, 0.18, 2.0, M.marble, 10, L2, 18 - steps * run - 0.5, root)
  // Glass-style rail posts
  for (const x of [8.3, 11.7]) {
    box(0.06, 1.05, 7.5, M.bronze, x, L2 + 0.52, -2, root, false)
  }
}

function sofa(root, M, x, y, z, w, d, facing = 0) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = facing
  box(w, 0.42, d, M.velvet, 0, 0.32, 0, g)
  box(w, 0.55, 0.22, M.velvet, 0, 0.7, -d / 2 + 0.12, g)
  box(0.22, 0.5, d * 0.9, M.velvet, -w / 2 + 0.12, 0.65, 0, g)
  box(0.22, 0.5, d * 0.9, M.velvet, w / 2 - 0.12, 0.65, 0, g)
  box(w * 0.35, 0.18, 0.4, M.cushion, -w * 0.22, 0.62, 0.1, g, false)
  box(w * 0.35, 0.18, 0.4, M.cushion, w * 0.22, 0.62, 0.1, g, false)
  root.add(g)
}

function diningSet(root, M, x, z, seats = 8) {
  box(seats * 0.7, 0.08, 1.15, M.woodDark, x, 0.76, z, root)
  box(seats * 0.55, 0.7, 0.08, M.bronze, x, 0.38, z, root)
  const half = Math.floor(seats / 2)
  for (let i = 0; i < half; i++) {
    const ox = x - ((half - 1) * 0.7) / 2 + i * 0.7
    box(0.42, 0.48, 0.42, M.linen, ox, 0.35, z - 0.85, root)
    box(0.42, 0.48, 0.42, M.linen, ox, 0.35, z + 0.85, root)
  }
}

function bed(root, M, x, y, z) {
  box(2.2, 0.35, 2.3, M.wood, x, y + 0.28, z, root)
  box(2.1, 0.28, 2.15, M.linen, x, y + 0.58, z, root)
  box(2.2, 0.85, 0.22, M.velvet, x, y + 0.85, z + 1.05, root)
  box(0.5, 0.45, 0.4, M.wood, x - 1.45, y + 0.3, z + 0.9, root)
  box(0.5, 0.45, 0.4, M.wood, x + 1.45, y + 0.3, z + 0.9, root)
}

function addFoyer(root, M, H) {
  box(8, 0.05, 6, M.marble, 0, 0.02, 26, root, false)
  box(2.4, 0.85, 0.55, M.wood, 0, 0.48, 29.5, root)
  cyl(0.08, 0.08, 1.6, M.bronze, 0, H - 0.9, 24, root)
  cyl(0.55, 0.35, 0.12, M.bronze, 0, H - 1.75, 24, root)
}

function addLiving(root, M) {
  sofa(root, M, -3, 0, -2, 5.5, 2.2)
  sofa(root, M, 4, 0, -4, 2.2, 4.2, Math.PI / 2)
  box(2.4, 0.08, 1.2, M.woodDark, 0, 0.4, -5.5, root)
  for (const [x, z] of [
    [-0.9, -5.9],
    [0.9, -5.9],
    [-0.9, -5.1],
    [0.9, -5.1],
  ]) {
    box(0.08, 0.32, 0.08, M.bronze, x, 0.2, z, root)
  }
  box(9, 0.03, 7, M.linen, 0, 0.02, -3, root, false)
  // Fireplace feature
  box(4.5, 1.5, 0.35, M.wood, 0, 0.85, -14, root)
  box(2.4, 0.95, 0.12, M.bronze, 0, 0.9, -13.8, root)
}

function addDining(root, M) {
  diningSet(root, M, 24, 6, 10)
  box(2.6, 0.9, 0.45, M.woodDark, 24, 0.5, 1.5, root)
}

function addKitchen(root, M) {
  box(5.5, 0.92, 1.35, M.marble, 34, 0.52, -4, root)
  box(5.5, 0.06, 1.4, M.bronze, 34, 1.0, -4, root)
  box(10, 0.92, 0.65, M.stone, 36, 0.52, -12, root)
  box(0.65, 0.92, 8, M.stone, 42, 0.52, -7, root)
  box(10, 0.85, 0.4, M.wood, 36, 2.7, -12.1, root)
  for (const z of [-3.3, -4, -4.7]) {
    cyl(0.2, 0.2, 0.06, M.wood, 31.6, 0.7, z, root)
    cyl(0.04, 0.04, 0.6, M.bronze, 31.6, 0.35, z, root)
  }
}

function addMedia(root, M) {
  sofa(root, M, 34, 0, 18, 4.5, 2.4)
  box(4.2, 2.2, 0.1, M.woodDark, 34, 1.5, 24, root)
  box(3.8, 1.9, 0.04, mat(0x12161c, { roughness: 0.35, metalness: 0.3 }), 34, 1.5, 23.92, root)
}

function addLibrary(root, M) {
  box(2.2, 0.08, 0.9, M.woodDark, 34, 0.76, -16, root)
  box(0.6, 0.48, 0.6, M.linen, 34, 0.35, -17.3, root)
  box(0.35, 2.6, 5, M.wood, 42.5, 1.4, -16, root)
  for (let i = 0; i < 5; i++) {
    box(0.3, 0.04, 4.7, M.woodDark, 42.45, 0.4 + i * 0.5, -16, root)
  }
}

function addGuest(root, M, H) {
  bed(root, M, -38, 0, 22)
  box(0.22, H - 0.4, 6, M.wall, -32, (H - 0.4) / 2, 22, root)
}

function addIndoorPools(root, M, water, H) {
  // 50×25 main — west wing, fully indoors under ceiling
  const cx = -30
  const cz = -6
  box(56, 0.08, 32, M.tile, cx, 0.04, cz, root, false)
  box(52, 1.2, 27, M.tile, cx, 0.25, cz, root)
  mesh(new THREE.BoxGeometry(50, 0.55, 25), water, cx, 0.55, cz, root, false)
  for (let i = -3.5; i <= 3.5; i++) {
    box(49.5, 0.015, 0.1, M.marble, cx, 0.82, cz + i * 3.05, root, false)
  }
  // Coping
  box(52.5, 0.1, 0.4, M.marble, cx, 0.88, cz - 13.1, root, false)
  box(52.5, 0.1, 0.4, M.marble, cx, 0.88, cz + 13.1, root, false)
  // Skylight band
  const glow = mat(0xfff1dc, { roughness: 1, emissive: 0xffe0b0, emissiveIntensity: 0.7 })
  box(40, 0.08, 1.6, glow, cx, H - 0.15, cz, root, false)

  // 25×15 training — NW corner indoors
  const tx = -38
  const tz = 12
  box(28, 0.06, 18, M.tile, tx, 0.03, tz, root, false)
  box(26.5, 1.0, 16.5, M.tile, tx, 0.2, tz, root)
  mesh(new THREE.BoxGeometry(25, 0.45, 15), water, tx, 0.48, tz, root, false)
}

/**
 * Outdoor infinity terrace — open sky, flush with building width, north of glass line.
 * Referenced to duplex penthouses where the pool terrace continues the living plane outdoors.
 */
function addOutdoorTerrace(root, M, water, W, D, terraceDepth) {
  const terraceZ = -32 - terraceDepth / 2 // center of open deck
  // Deck finish already placed as slab; add pool basin inset in deck
  // Infinity pool ~28×9 — residential scale, sits fully on terrace
  const poolW = 28
  const poolD = 9
  const poolZ = -44
  box(poolW + 2.4, 1.05, poolD + 2.2, M.stone, 0, 0.15, poolZ, root)
  mesh(new THREE.BoxGeometry(poolW, 0.45, poolD), water, 0, 0.42, poolZ, root, false)
  // Infinity edge toward view (north)
  box(poolW + 0.5, 0.12, 0.28, M.stone, 0, 0.55, poolZ - poolD / 2 - 0.35, root)

  // Secondary plunge / spa square on west of terrace
  box(8.5, 1.0, 8.5, M.stone, -32, 0.15, -48, root)
  mesh(new THREE.BoxGeometry(7, 0.4, 7), water, -32, 0.4, -48, root, false)

  // Loungers — aligned, not scattered
  for (const x of [-10, -4, 4, 10]) {
    box(0.85, 0.22, 2.0, M.linen, x, 0.22, -36, root)
    box(0.85, 0.45, 0.32, M.linen, x, 0.42, -35.2, root)
  }

  // Outdoor dining east
  box(2.4, 0.08, 1.1, M.wood, 28, 0.74, -38, root)
  for (const s of [-0.7, 0.7]) {
    box(0.4, 0.45, 0.4, M.linen, 28 + s, 0.32, -37.2, root)
    box(0.4, 0.45, 0.4, M.linen, 28 + s, 0.32, -38.8, root)
  }

  // Planter edge flush with terrace perimeter (not floating past building)
  for (const x of [-W / 2 + 6, W / 2 - 6]) {
    box(1.2, 0.65, 1.2, M.stone, x, 0.35, -32 - terraceDepth + 2, root)
    cyl(0.32, 0.4, 1.2, M.green, x, 1.15, -32 - terraceDepth + 2, root, 8)
  }

  // Low glass wind screen at terrace edge
  box(W - 10, 1.0, 0.08, M.bronze, 0, 0.7, -32 - terraceDepth + 0.5, root, false)
}

function addUpperRooms(root, M, L2) {
  const y = L2
  sofa(root, M, 0, y, 12, 4.5, 2.2)
  bed(root, M, -28, y, 6)
  box(6, 0.04, 5, M.stone, 30, y + 0.02, 4, root, false)
  box(2.4, 0.3, 0.8, M.wood, 28, y + 0.25, 6, root)
  box(5, 2.2, 0.06, mat(0xc8d2dc, { roughness: 0.18, metalness: 0.35 }), 30, y + 1.3, -2, root, false)
}

/** L2 overlook — glass rail looking down onto open terrace pools (not covering them). */
function addOverlookBalcony(root, M, L2, W) {
  box(36, 1.05, 0.08, M.bronze, 0, L2 + 0.55, -22, root, false)
  for (const x of [-14, 0, 14]) {
    box(0.08, 1.05, 0.08, M.bronze, x, L2 + 0.55, -22, root, false)
  }
  // Two lounge chairs on overlook
  box(0.8, 0.22, 1.8, M.linen, -4, L2 + 0.22, -19, root)
  box(0.8, 0.22, 1.8, M.linen, 4, L2 + 0.22, -19, root)
}

function addLights(scene, L2) {
  const pts = [
    [0, 3.8, 24, 0xfff2dc, 28],
    [0, 7.2, 0, 0xfff6e8, 40],
    [-30, 3.8, -6, 0xe8f2ff, 40],
    [-38, 3.5, 12, 0xeef4ff, 22],
    [0, 3.2, -44, 0xfff4e0, 30],
    [24, 3.5, 6, 0xffefd4, 20],
    [34, 3.5, -4, 0xfff8ec, 20],
    [0, L2 + 3.0, 10, 0xfff4e4, 22],
    [-28, L2 + 3.0, 6, 0xfff0d8, 18],
    [0, L2 + 2.8, -20, 0xfff6e8, 18],
  ]
  for (const [x, y, z, c, d] of pts) {
    const l = new THREE.PointLight(c, 16, d, 2)
    l.position.set(x, y, z)
    scene.add(l)
  }
}
