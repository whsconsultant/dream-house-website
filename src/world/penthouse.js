import * as THREE from 'three'

const COLORS = {
  floor: 0xd4cec2,
  floorUpper: 0xcfc6b8,
  wall: 0xf5f1ea,
  wood: 0x7a5a3a,
  woodDark: 0x4a3422,
  bronze: 0xb8925a,
  glass: 0xa8c8e0,
  water: 0x4a90a8,
  waterDeep: 0x2f6f88,
  waterLeisure: 0x5aa8b8,
  stone: 0x9a968e,
  tile: 0xd8e4ea,
  velvet: 0x3a4554,
  linen: 0xefe8dc,
  marble: 0xeeeae2,
  ceiling: 0xfaf8f4,
  green: 0x3d5c45,
  seat: 0xc4b8a8,
}

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.7,
    metalness: opts.metalness ?? 0.05,
    ...opts,
  })
}

function box(w, h, d, material, x, y, z, parent) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

function cyl(rTop, rBot, h, material, x, y, z, parent, segments = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segments), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

export const LEVEL = {
  H: 5.2, // taller halls for pool pavilion
  L2: 5.4,
}

/**
 * Crown duplex referenced to Tuen Mun pool complexes:
 * Indoor heated 50×25 main + 25×15 training; outdoor leisure, 25×12.5 teaching/training, diving spa.
 * Plate ~130m × 105m (~90,000+ sq ft across two levels).
 */
export const ROOMS = [
  { id: 'foyer', name: 'Grand Foyer', position: new THREE.Vector3(0, 1.7, 42), lookAt: new THREE.Vector3(0, 3, 10) },
  { id: 'living', name: 'Great Room', position: new THREE.Vector3(0, 1.7, 8), lookAt: new THREE.Vector3(0, 2.5, -16) },
  { id: 'dining', name: 'Dining Hall', position: new THREE.Vector3(28, 1.7, 12), lookAt: new THREE.Vector3(36, 1.5, 12) },
  { id: 'kitchen', name: 'Chef Kitchen', position: new THREE.Vector3(48, 1.7, -6), lookAt: new THREE.Vector3(52, 1.5, -12) },
  { id: 'media', name: 'Cinema Lounge', position: new THREE.Vector3(48, 1.7, 28), lookAt: new THREE.Vector3(50, 1.5, 30) },
  { id: 'library', name: 'Library', position: new THREE.Vector3(-48, 1.7, 28), lookAt: new THREE.Vector3(-50, 1.5, 30) },
  { id: 'guest', name: 'Guest Wing', position: new THREE.Vector3(-42, 1.7, -4), lookAt: new THREE.Vector3(-48, 1.5, -10) },
  { id: 'spa', name: 'Wellness Spa', position: new THREE.Vector3(-50, 1.7, -28), lookAt: new THREE.Vector3(-52, 1.5, -30) },
  { id: 'indoorpool', name: 'Indoor Main Pool', position: new THREE.Vector3(20, 1.7, -28), lookAt: new THREE.Vector3(30, 2, -28) },
  { id: 'indoortrain', name: 'Indoor Training', position: new THREE.Vector3(48, 1.7, -42), lookAt: new THREE.Vector3(48, 1.5, -45) },
  { id: 'outdoor', name: 'Outdoor Pools', position: new THREE.Vector3(0, 1.7, -58), lookAt: new THREE.Vector3(0, 1.5, -70) },
  { id: 'stairs', name: 'Grand Stair', position: new THREE.Vector3(14, 1.7, 24), lookAt: new THREE.Vector3(14, 5.5, 16) },
  { id: 'master', name: 'Master Suite', position: new THREE.Vector3(-32, LEVEL.L2 + 1.7, -10), lookAt: new THREE.Vector3(-40, LEVEL.L2 + 1.5, -14) },
  { id: 'dressing', name: 'Dressing Gallery', position: new THREE.Vector3(-48, LEVEL.L2 + 1.7, 6), lookAt: new THREE.Vector3(-50, LEVEL.L2 + 1.5, 6) },
  { id: 'gym', name: 'Sky Gym', position: new THREE.Vector3(42, LEVEL.L2 + 1.7, -8), lookAt: new THREE.Vector3(48, LEVEL.L2 + 1.5, -10) },
  { id: 'skylounge', name: 'Sky Lounge', position: new THREE.Vector3(0, LEVEL.L2 + 1.7, 16), lookAt: new THREE.Vector3(0, LEVEL.L2 + 1.5, 4) },
  { id: 'roof', name: 'Morning Deck', position: new THREE.Vector3(0, LEVEL.L2 + 1.7, -48), lookAt: new THREE.Vector3(0, LEVEL.L2 + 1.5, -60) },
]

export function createPenthouse(scene) {
  const root = new THREE.Group()
  root.name = 'penthouse'
  scene.add(root)

  const floorMat = mat(COLORS.floor, { roughness: 0.32, metalness: 0.08 })
  const floorUpperMat = mat(COLORS.floorUpper, { roughness: 0.38, metalness: 0.06 })
  const wallMat = mat(COLORS.wall, { roughness: 0.88 })
  const woodMat = mat(COLORS.wood, { roughness: 0.55 })
  const woodDarkMat = mat(COLORS.woodDark, { roughness: 0.5 })
  const bronzeMat = mat(COLORS.bronze, { roughness: 0.35, metalness: 0.65 })
  const velvetMat = mat(COLORS.velvet, { roughness: 0.9 })
  const linenMat = mat(COLORS.linen, { roughness: 0.8 })
  const stoneMat = mat(COLORS.stone, { roughness: 0.6 })
  const tileMat = mat(COLORS.tile, { roughness: 0.35, metalness: 0.05 })
  const marbleMat = mat(COLORS.marble, { roughness: 0.22, metalness: 0.12 })
  const ceilingMat = mat(COLORS.ceiling, { roughness: 0.92 })
  const greenMat = mat(COLORS.green, { roughness: 0.9 })
  const seatMat = mat(COLORS.seat, { roughness: 0.75 })
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: COLORS.glass,
    transmission: 0.82,
    transparent: true,
    opacity: 0.28,
    roughness: 0.06,
    metalness: 0.02,
    thickness: 0.35,
    ior: 1.45,
    side: THREE.DoubleSide,
  })
  const waterMain = new THREE.MeshPhysicalMaterial({
    color: COLORS.waterDeep,
    transmission: 0.42,
    transparent: true,
    opacity: 0.82,
    roughness: 0.08,
    metalness: 0.1,
    thickness: 1.4,
  })
  const waterTrain = new THREE.MeshPhysicalMaterial({
    color: COLORS.water,
    transmission: 0.48,
    transparent: true,
    opacity: 0.78,
    roughness: 0.1,
    metalness: 0.08,
    thickness: 1.0,
  })
  const waterLeisure = new THREE.MeshPhysicalMaterial({
    color: COLORS.waterLeisure,
    transmission: 0.5,
    transparent: true,
    opacity: 0.75,
    roughness: 0.12,
    metalness: 0.06,
    thickness: 0.9,
  })

  const H = LEVEL.H
  const L2 = LEVEL.L2
  const W = 130
  const D = 105

  box(W, 0.5, D, floorMat, 0, -0.25, 0, root)
  addUpperFloor(root, floorUpperMat, ceilingMat, L2, H, W, D)
  box(W - 14, 0.3, D - 28, ceilingMat, 0, L2 + H, -6, root)

  // Outdoor terrace plate (north)
  box(118, 0.4, 36, stoneMat, 0, -0.22, -70, root)
  box(70, 0.32, 24, stoneMat, 0, L2 - 0.14, -68, root)

  addGlassEnvelope(root, glassMat, bronzeMat, W, D, L2 + H)
  addL1Partitions(root, wallMat, woodMat, H)
  addL2Partitions(root, wallMat, woodMat, L2, H)
  addGrandStair(root, marbleMat, bronzeMat, woodMat, L2)

  addFoyer(root, marbleMat, bronzeMat, woodMat, H)
  addLiving(root, velvetMat, linenMat, woodMat, woodDarkMat, bronzeMat)
  addDining(root, woodDarkMat, linenMat, bronzeMat)
  addKitchen(root, marbleMat, woodMat, bronzeMat, stoneMat)
  addMedia(root, velvetMat, woodDarkMat)
  addLibrary(root, woodMat, woodDarkMat, linenMat)
  addGuestWing(root, linenMat, woodMat, velvetMat, wallMat, H)
  addSpa(root, marbleMat, stoneMat, bronzeMat, waterTrain, woodMat)

  // Tuen Mun–inspired aquatic wing
  addIndoorMainPool(root, tileMat, marbleMat, bronzeMat, waterMain, linenMat, seatMat, H)
  addIndoorTrainingPool(root, tileMat, marbleMat, waterTrain, H)
  addOutdoorPoolComplex(root, stoneMat, tileMat, woodMat, bronzeMat, waterLeisure, waterTrain, linenMat, greenMat)

  addSkyLounge(root, velvetMat, linenMat, woodMat, bronzeMat, L2)
  addMasterSuite(root, linenMat, woodMat, velvetMat, bronzeMat, marbleMat, L2)
  addDressing(root, woodMat, woodDarkMat, marbleMat, L2)
  addGym(root, stoneMat, woodMat, linenMat, L2)
  addMorningDeck(root, stoneMat, woodMat, linenMat, greenMat, bronzeMat, L2)

  addInteriorLights(scene, L2)
  addCoveLights(root, H, L2, W, D)

  return { root, rooms: ROOMS }
}

function addUpperFloor(root, floorMat, ceilingMat, L2, H, W, D) {
  box(46, 0.38, D - 4, floorMat, -42, L2 - 0.19, 0, root)
  box(46, 0.38, D - 4, floorMat, 42, L2 - 0.19, 0, root)
  box(36, 0.38, 30, floorMat, 0, L2 - 0.19, -32, root)
  box(36, 0.38, 18, floorMat, 0, L2 - 0.19, 40, root)
  box(W - 1, 0.16, 22, ceilingMat, 0, H - 0.1, -36, root)
  box(42, 0.16, 48, ceilingMat, -44, H - 0.1, 6, root)
  box(42, 0.16, 48, ceilingMat, 44, H - 0.1, 6, root)
}

function addGlassEnvelope(root, glassMat, frameMat, W, D, totalH) {
  const t = 0.16
  for (const [w, h, d, x, y, z] of [
    [W - 10, totalH - 0.5, t, 0, totalH / 2, D / 2],
    [t, totalH - 0.5, D, W / 2, totalH / 2, 0],
    [t, totalH - 0.5, D, -W / 2, totalH / 2, 0],
  ]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glassMat)
    m.position.set(x, y, z)
    root.add(m)
  }
  for (const x of [-50, -25, 0, 25, 50]) {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(18, totalH - 0.5, t), glassMat)
    pane.position.set(x, totalH / 2, -D / 2)
    root.add(pane)
  }
  for (let i = -9; i <= 9; i++) {
    box(0.24, totalH, 0.24, frameMat, i * 6.8, totalH / 2, D / 2, root)
    box(0.24, totalH, 0.24, frameMat, i * 6.8, totalH / 2, -D / 2, root)
  }
  for (let i = -6; i <= 6; i++) {
    box(0.24, totalH, 0.24, frameMat, W / 2, totalH / 2, i * 8, root)
    box(0.24, totalH, 0.24, frameMat, -W / 2, totalH / 2, i * 8, root)
  }
}

function addL1Partitions(root, wallMat, woodMat, H) {
  const h = H - 0.4
  box(0.32, h, 48, wallMat, -24, h / 2, -2, root)
  box(0.32, h, 40, wallMat, 24, h / 2, 0, root)
  box(28, h, 0.32, wallMat, 42, h / 2, 14, root)
  box(28, h, 0.32, wallMat, -42, h / 2, 14, root)
  box(32, h, 0.32, wallMat, -42, h / 2, -16, root)
  box(0.32, h, 22, wallMat, -56, h / 2, -32, root)
  // Pool pavilion walls
  box(0.32, h, 40, wallMat, -8, h / 2, -32, root)
  box(70, h, 0.32, wallMat, 28, h / 2, -12, root)
  box(16, h * 0.9, 0.26, woodMat, -12, (h * 0.9) / 2, -12, root)
}

function addL2Partitions(root, wallMat, woodMat, L2, H) {
  const h = H - 0.45
  const y = L2 + h / 2
  box(0.32, h, 40, wallMat, -18, y, -4, root)
  box(0.32, h, 34, wallMat, 22, y, -2, root)
  box(24, h, 0.32, wallMat, -44, y, 2, root)
  box(26, h, 0.32, wallMat, 42, y, 4, root)
  box(14, h * 0.85, 0.26, woodMat, -34, L2 + (h * 0.85) / 2, -14, root)
}

function addGrandStair(root, marble, bronze, wood, L2) {
  const steps = 20
  const rise = L2 / steps
  const run = 0.4
  for (let i = 0; i < steps; i++) {
    box(4.0, rise, run + 0.05, marble, 14, rise * (i + 0.5), 26 - i * run, root)
  }
  box(5.0, 0.24, 2.6, marble, 14, L2, 26 - steps * run - 0.8, root)
  box(0.1, L2 * 0.95, 0.1, bronze, 11.8, (L2 * 0.95) / 2, 16, root)
  box(0.1, L2 * 0.95, 0.1, bronze, 16.2, (L2 * 0.95) / 2, 16, root)
  for (const x of [-16, 16]) box(0.14, 1.2, 28, bronze, x, L2 + 0.6, 4, root)
  box(32, 1.2, 0.14, bronze, 0, L2 + 0.6, -14, root)
  box(0.18, L2, 8.5, wood, 11.7, L2 / 2, 20, root)
}

function addFoyer(root, marble, bronze, wood, H) {
  box(18, 0.07, 16, marble, 0, 0.04, 40, root)
  box(5, 1.0, 0.9, wood, 0, 0.55, 48, root)
  box(5, 0.08, 0.95, marble, 0, 1.08, 48, root)
  cyl(0.14, 0.14, 3.6, bronze, 0, H + 1.5, 34, root)
  cyl(1.3, 0.7, 0.24, bronze, 0, H + 0.1, 34, root)
}

function addLiving(root, velvet, linen, wood, woodDark, bronze) {
  box(12, 0.58, 3.4, velvet, -5, 0.42, 2, root)
  box(3.4, 0.58, 9, velvet, 4.5, 0.42, -2, root)
  box(4.5, 0.12, 2.0, woodDark, -1, 0.45, -8, root)
  box(14, 0.04, 12, linen, 0, 0.02, 0, root)
  box(8, 1.8, 0.55, wood, 0, 1.0, -20, root)
  box(4.5, 1.3, 0.14, bronze, 0, 1.05, -19.7, root)
  box(1.5, 0.52, 1.5, velvet, 12, 0.36, -8, root)
  box(1.5, 0.52, 1.5, velvet, 15, 0.36, -5, root)
}

function addDining(root, woodDark, linen, bronze) {
  box(8.5, 0.12, 2.0, woodDark, 32, 0.8, 10, root)
  box(8, 0.1, 0.22, bronze, 32, 0.42, 10, root)
  for (let i = -5; i <= 5; i++) {
    box(0.52, 0.55, 0.52, linen, 32 + i * 0.72, 0.4, 8.7, root)
    box(0.52, 0.55, 0.52, linen, 32 + i * 0.72, 0.4, 11.3, root)
  }
  box(5, 1.1, 0.65, woodDark, 32, 0.58, 4, root)
}

function addKitchen(root, marble, wood, bronze, stone) {
  box(10, 0.95, 2.0, marble, 48, 0.55, -6, root)
  box(10, 0.08, 2.05, bronze, 48, 1.08, -6, root)
  for (const z of [-5, -6, -7]) {
    cyl(0.26, 0.26, 0.08, wood, 43.5, 0.74, z, root)
    cyl(0.05, 0.05, 0.65, bronze, 43.5, 0.36, z, root)
  }
  box(20, 0.95, 0.85, stone, 50, 0.55, -18, root)
  box(0.85, 0.95, 14, stone, 58, 0.55, -10, root)
  box(20, 1.1, 0.55, wood, 50, 3.2, -18.1, root)
}

function addMedia(root, velvet, woodDark) {
  box(9, 0.52, 4, velvet, 48, 0.36, 28, root)
  box(10, 0.05, 4.5, woodDark, 48, 0.05, 28.2, root)
  box(7.5, 3.0, 0.16, woodDark, 48, 1.9, 38, root)
  box(7, 2.6, 0.06, mat(0x151820, { roughness: 0.35, metalness: 0.25 }), 48, 1.9, 37.9, root)
}

function addLibrary(root, wood, woodDark, linen) {
  box(3.6, 0.1, 1.3, woodDark, -48, 0.8, 28, root)
  box(0.85, 0.55, 0.85, linen, -48, 0.4, 26, root)
  box(0.55, 3.6, 12, wood, -62, 1.9, 28, root)
  for (let i = 0; i < 8; i++) {
    box(0.5, 0.05, 11.5, woodDark, -61.95, 0.45 + i * 0.45, 28, root)
  }
  box(1.3, 0.5, 1.3, linen, -40, 0.35, 30, root)
  box(1.3, 0.5, 1.3, linen, -44, 0.35, 33, root)
}

function addGuestWing(root, linen, wood, velvet, wallMat, H) {
  const rooms = [
    [-52, -22],
    [-42, -22],
    [-32, -22],
    [-22, -22],
  ]
  for (const [x, z] of rooms) {
    box(2.4, 0.42, 2.5, wood, x, 0.35, z, root)
    box(2.3, 0.32, 2.35, linen, x, 0.68, z, root)
    box(2.4, 0.85, 0.24, velvet, x, 0.9, z + 1.3, root)
    box(0.26, H - 0.45, 6, wallMat, x + 4, (H - 0.45) / 2, z, root)
  }
}

function addSpa(root, marble, stone, bronze, water, wood) {
  cyl(1.5, 1.35, 0.6, marble, -54, 0.38, -34, root, 36)
  const soak = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.14, 36), water)
  soak.position.set(-54, 0.58, -34)
  root.add(soak)
  box(5, 0.9, 0.75, stone, -58, 0.5, -40, root)
  box(5, 0.06, 0.75, marble, -58, 0.98, -40, root)
  box(2.8, 2.9, 2.8, stone, -46, 1.55, -40, root)
  box(3.8, 2.6, 3.2, wood, -60, 1.4, -26, root)
}

/**
 * Indoor heated main pool — Tuen Mun standard 50×25m with lane lines + guest gallery.
 */
function addIndoorMainPool(root, tile, marble, bronze, water, linen, seat, H) {
  const cx = 28
  const cz = -32
  // Deck / wet floor
  box(62, 0.1, 38, tile, cx, 0.05, cz, root)
  // Basin shell 50×25
  box(52, 1.4, 27, tile, cx, 0.15, cz, root)
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(50, 0.7, 25), water)
  waterMesh.position.set(cx, 0.55, cz)
  root.add(waterMesh)
  // 8 lane markers (competition-style)
  for (let i = -3.5; i <= 3.5; i++) {
    box(50, 0.02, 0.12, marble, cx, 0.9, cz + i * 3.1, root)
  }
  // Starting block plinths
  for (let i = -3.5; i <= 3.5; i++) {
    box(0.55, 0.35, 0.55, marble, cx - 24.2, 1.05, cz + i * 3.1, root)
    box(0.55, 0.35, 0.55, marble, cx + 24.2, 1.05, cz + i * 3.1, root)
  }
  // Coping
  box(53, 0.14, 0.5, marble, cx, 0.95, cz - 13.2, root)
  box(53, 0.14, 0.5, marble, cx, 0.95, cz + 13.2, root)
  // Guest gallery / mini stand (residential, not 1200 seats)
  for (let row = 0; row < 4; row++) {
    box(40, 0.35, 0.9, seat, cx, 0.4 + row * 0.38, cz + 16.5 + row * 0.85, root)
  }
  // Lounge edge
  for (const x of [cx - 22, cx - 12, cx + 12, cx + 22]) {
    box(1.0, 0.28, 2.2, linen, x, 0.28, cz - 16.5, root)
    box(1.0, 0.55, 0.38, linen, x, 0.5, cz - 15.6, root)
  }
  // Skylight strips + columns (channel-glass energy idea simplified)
  const glow = mat(0xfff2dc, { roughness: 1, emissive: 0xffe2b0, emissiveIntensity: 0.85 })
  box(46, 0.1, 2.2, glow, cx, H - 0.15, cz, root)
  box(46, 0.1, 1.2, glow, cx, H - 0.15, cz - 8, root)
  box(46, 0.1, 1.2, glow, cx, H - 0.15, cz + 8, root)
  for (const x of [cx - 28, cx + 28]) {
    for (const z of [cz - 16, cz + 16]) {
      cyl(0.32, 0.32, H - 0.5, bronze, x, (H - 0.5) / 2, z, root)
    }
  }
}

/** Indoor training pool — 25×15m (Tuen Mun indoor training). */
function addIndoorTrainingPool(root, tile, marble, water, H) {
  const cx = 52
  const cz = -48
  box(32, 0.08, 22, tile, cx, 0.04, cz, root)
  box(27, 1.15, 17, tile, cx, 0.2, cz, root)
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(25, 0.55, 15), water)
  waterMesh.position.set(cx, 0.5, cz)
  root.add(waterMesh)
  for (let i = -2; i <= 2; i++) {
    box(25, 0.02, 0.1, marble, cx, 0.78, cz + i * 2.8, root)
  }
  const glow = mat(0xfff0d8, { roughness: 1, emissive: 0xffe0a8, emissiveIntensity: 0.65 })
  box(20, 0.08, 1.0, glow, cx, H - 0.2, cz, root)
}

/**
 * Outdoor complex inspired by Tuen Mun: leisure pool, 25×12.5 teaching/training, diving spa basin.
 */
function addOutdoorPoolComplex(root, stone, tile, wood, bronze, waterLeisure, waterTrain, linen, green) {
  // Leisure / infinity main outdoor (~40×18 freeform-ish rectangle)
  box(44, 1.2, 20, stone, -8, -0.15, -72, root)
  const leisure = new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 16.5), waterLeisure)
  leisure.position.set(-8, 0.35, -72)
  root.add(leisure)
  box(41, 0.16, 0.4, stone, -8, 0.58, -80.5, root) // infinity lip

  // Outdoor teaching / training 25×12.5
  box(29, 1.1, 16, tile, 32, -0.1, -70, root)
  const train = new THREE.Mesh(new THREE.BoxGeometry(25, 0.45, 12.5), waterTrain)
  train.position.set(32, 0.35, -70)
  root.add(train)
  for (let i = -2; i <= 2; i++) {
    box(25, 0.02, 0.1, mat(COLORS.marble, { roughness: 0.3 }), 32, 0.58, -70 + i * 2.4, root)
  }

  // Diving / deep spa square ~11×11
  box(13, 1.4, 13, stone, -42, -0.2, -70, root)
  const dive = new THREE.Mesh(new THREE.BoxGeometry(11, 0.7, 11), waterTrain)
  dive.position.set(-42, 0.4, -70)
  root.add(dive)
  // Board suggestion
  box(1.2, 0.12, 4.5, wood, -42, 1.6, -64.5, root)
  box(0.2, 1.5, 0.2, bronze, -42, 0.85, -63.5, root)

  // Deck loungers
  for (const x of [-24, -14, 4, 14]) {
    box(1.05, 0.28, 2.4, linen, x, 0.28, -58, root)
    box(1.05, 0.6, 0.4, linen, x, 0.55, -57, root)
  }

  // Fire lounge
  cyl(1.6, 1.6, 0.42, stone, 48, 0.3, -58, root, 28)
  cyl(0.7, 0.7, 0.28, bronze, 48, 0.58, -58, root, 18)
  for (let a = 0; a < Math.PI * 2; a += 1.0) {
    box(1.05, 0.42, 0.8, linen, 48 + Math.cos(a) * 3.2, 0.32, -58 + Math.sin(a) * 3.2, root)
  }

  // Outdoor dining
  box(4.2, 0.1, 1.5, wood, -28, 0.78, -58, root)
  for (let i = -1; i <= 1; i++) {
    box(0.5, 0.5, 0.5, linen, -28 + i * 1.15, 0.35, -57, root)
    box(0.5, 0.5, 0.5, linen, -28 + i * 1.15, 0.35, -59, root)
  }

  // Planters / greening edge (Tuen Mun NW eco idea)
  for (const x of [-55, -48, 48, 55]) {
    box(1.8, 0.85, 1.8, stone, x, 0.45, -86, root)
    cyl(0.5, 0.6, 2.0, green, x, 1.6, -86, root, 8)
  }
}

function addSkyLounge(root, velvet, linen, wood, bronze, L2) {
  const y = L2
  box(7, 0.52, 3, velvet, -3, y + 0.36, 18, root)
  box(3, 0.52, 6, velvet, 3.5, y + 0.36, 15, root)
  box(3.2, 0.1, 1.4, wood, 0, y + 0.44, 12, root)
  box(10, 0.04, 8, linen, 0, y + 0.02, 15, root)
}

function addMasterSuite(root, linen, wood, velvet, bronze, marble, L2) {
  const y = L2
  box(3.0, 0.52, 3.2, wood, -36, y + 0.42, -12, root)
  box(2.9, 0.4, 3.0, linen, -36, y + 0.82, -12, root)
  box(3.0, 1.1, 0.32, velvet, -36, y + 1.1, -10.2, root)
  box(0.75, 0.55, 0.55, wood, -38.4, y + 0.4, -10.3, root)
  box(0.75, 0.55, 0.55, wood, -33.6, y + 0.4, -10.3, root)
  cyl(1.25, 1.15, 0.55, marble, -48, y + 0.4, -22, root, 32)
  box(4, 0.9, 0.7, marble, -50, y + 0.52, -26, root)
}

function addDressing(root, wood, woodDark, marble, L2) {
  const y = L2
  box(12, 2.8, 0.24, wood, -50, y + 1.5, 4, root)
  box(0.24, 2.8, 8, wood, -58, y + 1.5, 8, root)
  for (let i = 0; i < 5; i++) {
    box(11.5, 0.05, 0.15, woodDark, -50, y + 0.55 + i * 0.5, 4.05, root)
  }
  box(2.6, 0.08, 1.0, marble, -46, y + 0.95, 10, root)
}

function addGym(root, stone, wood, linen, L2) {
  const y = L2
  box(12, 0.05, 10, stone, 46, y + 0.03, -10, root)
  box(3.5, 0.35, 1.1, wood, 42, y + 0.3, -6, root)
  box(1.4, 0.2, 2.6, linen, 50, y + 0.25, -12, root)
  box(9, 2.6, 0.08, mat(0xc5d0dc, { roughness: 0.15, metalness: 0.4 }), 46, y + 1.5, -18, root)
}

function addMorningDeck(root, stone, wood, linen, green, bronze, L2) {
  const y = L2
  for (const x of [-16, -6, 6, 16]) {
    box(1.05, 0.28, 2.4, linen, x, y + 0.28, -54, root)
    box(1.05, 0.55, 0.4, linen, x, y + 0.5, -53, root)
  }
  box(3.4, 0.1, 1.3, wood, 0, y + 0.78, -60, root)
  cyl(0.8, 0.8, 0.35, stone, 24, y + 0.25, -56, root)
  cyl(0.38, 0.38, 0.2, bronze, 24, y + 0.5, -56, root)
  for (const x of [-28, 28]) {
    box(1.5, 0.75, 1.5, stone, x, y + 0.42, -66, root)
    cyl(0.42, 0.52, 1.7, green, x, y + 1.45, -66, root, 8)
  }
}

function addInteriorLights(scene, L2) {
  const spots = [
    [0, 4.2, 40, 0xfff2dc, 36],
    [0, 8.5, 4, 0xfff6e8, 55],
    [28, 4.5, -32, 0xe8f4ff, 55],
    [52, 4.0, -48, 0xeef6ff, 30],
    [0, 3.6, -68, 0xfff4e0, 40],
    [32, 3.6, 10, 0xffefd4, 28],
    [48, 3.8, -6, 0xfff8ec, 28],
    [48, 3.8, 28, 0xe8f0ff, 22],
    [-48, 3.8, 28, 0xffefd4, 22],
    [-42, 3.6, -22, 0xfff0dc, 26],
    [-54, 3.4, -34, 0xeef4ff, 18],
    [-36, L2 + 3.4, -12, 0xfff0d8, 24],
    [46, L2 + 3.4, -10, 0xf0f4ff, 22],
    [0, L2 + 3.4, 16, 0xfff4e4, 28],
    [0, L2 + 3.2, -52, 0xfff6e8, 26],
  ]
  for (const [x, y, z, color, dist] of spots) {
    const light = new THREE.PointLight(color, 18, dist, 2)
    light.position.set(x, y, z)
    scene.add(light)
  }
}

function addCoveLights(root, H, L2, W, D) {
  const glow = new THREE.MeshStandardMaterial({
    color: 0xffe8c8,
    emissive: 0xffd090,
    emissiveIntensity: 0.85,
    roughness: 1,
  })
  box(W - 6, 0.05, 0.12, glow, 0, H - 0.14, D / 2 - 1.5, root)
  box(W - 6, 0.05, 0.12, glow, 0, H - 0.14, -D / 2 + 1.5, root)
  box(0.12, 0.05, D - 6, glow, W / 2 - 1.5, H - 0.14, 0, root)
  box(0.12, 0.05, D - 6, glow, -W / 2 + 1.5, H - 0.14, 0, root)
  box(W - 20, 0.05, 0.12, glow, 0, L2 + H - 0.16, 28, root)
  box(W - 20, 0.05, 0.12, glow, 0, L2 + H - 0.16, -40, root)
}
