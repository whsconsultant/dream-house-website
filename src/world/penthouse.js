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
  stone: 0x9a968e,
  velvet: 0x3a4554,
  linen: 0xefe8dc,
  marble: 0xeeeae2,
  ceiling: 0xfaf8f4,
  green: 0x3d5c45,
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
  H: 4.8,
  L2: 5.0,
}

/**
 * Crown duplex ~96m × 68m plate (~40,000+ sq ft across two levels).
 * Indoor lap pool + outdoor infinity pool. +Z entrance · −Z terrace.
 */
export const ROOMS = [
  { id: 'foyer', name: 'Grand Foyer', position: new THREE.Vector3(0, 1.65, 28), lookAt: new THREE.Vector3(0, 3, 4) },
  { id: 'living', name: 'Great Room', position: new THREE.Vector3(0, 1.65, 4), lookAt: new THREE.Vector3(0, 2, -14) },
  { id: 'dining', name: 'Dining Hall', position: new THREE.Vector3(22, 1.65, 6), lookAt: new THREE.Vector3(28, 1.5, 6) },
  { id: 'kitchen', name: 'Chef Kitchen', position: new THREE.Vector3(34, 1.65, -8), lookAt: new THREE.Vector3(38, 1.5, -14) },
  { id: 'media', name: 'Cinema Lounge', position: new THREE.Vector3(34, 1.65, 18), lookAt: new THREE.Vector3(36, 1.5, 20) },
  { id: 'library', name: 'Library', position: new THREE.Vector3(-34, 1.65, 18), lookAt: new THREE.Vector3(-36, 1.5, 20) },
  { id: 'guest', name: 'Guest Wing', position: new THREE.Vector3(-30, 1.65, -6), lookAt: new THREE.Vector3(-34, 1.5, -12) },
  { id: 'spa', name: 'Wellness Spa', position: new THREE.Vector3(-36, 1.65, -22), lookAt: new THREE.Vector3(-38, 1.5, -24) },
  { id: 'indoorpool', name: 'Indoor Pool', position: new THREE.Vector3(30, 1.65, -22), lookAt: new THREE.Vector3(34, 1.5, -26) },
  { id: 'terrace', name: 'Outdoor Pool', position: new THREE.Vector3(0, 1.65, -38), lookAt: new THREE.Vector3(0, 1.5, -48) },
  { id: 'stairs', name: 'Grand Stair', position: new THREE.Vector3(10, 1.65, 16), lookAt: new THREE.Vector3(10, 5, 10) },
  { id: 'master', name: 'Master Suite', position: new THREE.Vector3(-24, LEVEL.L2 + 1.65, -8), lookAt: new THREE.Vector3(-30, LEVEL.L2 + 1.5, -12) },
  { id: 'dressing', name: 'Dressing Gallery', position: new THREE.Vector3(-34, LEVEL.L2 + 1.65, 4), lookAt: new THREE.Vector3(-36, LEVEL.L2 + 1.5, 4) },
  { id: 'gym', name: 'Sky Gym', position: new THREE.Vector3(30, LEVEL.L2 + 1.65, -10), lookAt: new THREE.Vector3(34, LEVEL.L2 + 1.5, -12) },
  { id: 'skylounge', name: 'Sky Lounge', position: new THREE.Vector3(0, LEVEL.L2 + 1.65, 10), lookAt: new THREE.Vector3(0, LEVEL.L2 + 1.5, 0) },
  { id: 'roof', name: 'Morning Deck', position: new THREE.Vector3(0, LEVEL.L2 + 1.65, -32), lookAt: new THREE.Vector3(0, LEVEL.L2 + 1.5, -42) },
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
  const marbleMat = mat(COLORS.marble, { roughness: 0.22, metalness: 0.12 })
  const ceilingMat = mat(COLORS.ceiling, { roughness: 0.92 })
  const greenMat = mat(COLORS.green, { roughness: 0.9 })
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
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: COLORS.water,
    transmission: 0.5,
    transparent: true,
    opacity: 0.72,
    roughness: 0.12,
    metalness: 0.08,
    thickness: 0.9,
  })
  const waterDeepMat = new THREE.MeshPhysicalMaterial({
    color: COLORS.waterDeep,
    transmission: 0.4,
    transparent: true,
    opacity: 0.8,
    roughness: 0.1,
    metalness: 0.1,
    thickness: 1.2,
  })

  const H = LEVEL.H
  const L2 = LEVEL.L2
  const W = 96
  const D = 68

  box(W, 0.45, D, floorMat, 0, -0.22, 0, root)
  addUpperFloor(root, floorUpperMat, ceilingMat, L2, H, W, D)
  box(W - 10, 0.28, D - 22, ceilingMat, 0, L2 + H, -4, root)

  // Outdoor terrace decks
  box(84, 0.35, 24, stoneMat, 0, -0.2, -46, root)
  box(52, 0.3, 18, stoneMat, 0, L2 - 0.12, -46, root)

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
  addSpa(root, marbleMat, stoneMat, bronzeMat, waterMat, woodMat)
  addIndoorPool(root, stoneMat, marbleMat, bronzeMat, waterDeepMat, linenMat, H)
  addOutdoorPool(root, stoneMat, woodMat, bronzeMat, waterMat, linenMat, greenMat)

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
  box(34, 0.35, D - 2, floorMat, -31, L2 - 0.175, 0, root)
  box(34, 0.35, D - 2, floorMat, 31, L2 - 0.175, 0, root)
  box(28, 0.35, 22, floorMat, 0, L2 - 0.175, -22, root)
  box(28, 0.35, 14, floorMat, 0, L2 - 0.175, 26, root)
  box(W - 0.5, 0.15, 18, ceilingMat, 0, H - 0.1, -24, root)
  box(32, 0.15, 36, ceilingMat, -32, H - 0.1, 4, root)
  box(32, 0.15, 36, ceilingMat, 32, H - 0.1, 4, root)
}

function addGlassEnvelope(root, glassMat, frameMat, W, D, totalH) {
  const t = 0.14
  for (const [w, h, d, x, y, z] of [
    [W - 8, totalH - 0.5, t, 0, totalH / 2, D / 2],
    [t, totalH - 0.5, D, W / 2, totalH / 2, 0],
    [t, totalH - 0.5, D, -W / 2, totalH / 2, 0],
  ]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glassMat)
    m.position.set(x, y, z)
    root.add(m)
  }
  for (const x of [-36, -18, 0, 18, 36]) {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(14, totalH - 0.5, t), glassMat)
    pane.position.set(x, totalH / 2, -D / 2)
    root.add(pane)
  }
  for (let i = -7; i <= 7; i++) {
    box(0.22, totalH, 0.22, frameMat, i * 6.5, totalH / 2, D / 2, root)
    box(0.22, totalH, 0.22, frameMat, i * 6.5, totalH / 2, -D / 2, root)
  }
  for (let i = -4; i <= 4; i++) {
    box(0.22, totalH, 0.22, frameMat, W / 2, totalH / 2, i * 7.5, root)
    box(0.22, totalH, 0.22, frameMat, -W / 2, totalH / 2, i * 7.5, root)
  }
}

function addL1Partitions(root, wallMat, woodMat, H) {
  const h = H - 0.35
  box(0.3, h, 36, wallMat, -18, h / 2, -4, root)
  box(0.3, h, 30, wallMat, 18, h / 2, -2, root)
  box(22, h, 0.3, wallMat, 30, h / 2, 8, root)
  box(22, h, 0.3, wallMat, -30, h / 2, 8, root)
  box(24, h, 0.3, wallMat, -30, h / 2, -14, root)
  box(0.3, h, 16, wallMat, -40, h / 2, -24, root)
  box(0.3, h, 18, wallMat, 20, h / 2, -22, root) // indoor pool wing
  box(20, h, 0.3, wallMat, 32, h / 2, -14, root)
  box(14, h * 0.9, 0.24, woodMat, -10, (h * 0.9) / 2, -10, root)
}

function addL2Partitions(root, wallMat, woodMat, L2, H) {
  const h = H - 0.4
  const y = L2 + h / 2
  box(0.3, h, 30, wallMat, -14, y, -4, root)
  box(0.3, h, 26, wallMat, 16, y, -2, root)
  box(18, h, 0.3, wallMat, -32, y, 0, root)
  box(20, h, 0.3, wallMat, 30, y, 2, root)
  box(12, h * 0.85, 0.24, woodMat, -26, L2 + (h * 0.85) / 2, -12, root)
}

function addGrandStair(root, marble, bronze, wood, L2) {
  const steps = 18
  const rise = L2 / steps
  const run = 0.4
  for (let i = 0; i < steps; i++) {
    box(3.6, rise, run + 0.05, marble, 10, rise * (i + 0.5), 18 - i * run, root)
  }
  box(4.6, 0.22, 2.4, marble, 10, L2, 18 - steps * run - 0.7, root)
  box(0.1, L2 * 0.95, 0.1, bronze, 8, (L2 * 0.95) / 2, 11, root)
  box(0.1, L2 * 0.95, 0.1, bronze, 12, (L2 * 0.95) / 2, 11, root)
  for (const x of [-12, 12]) {
    box(0.12, 1.15, 22, bronze, x, L2 + 0.55, 2, root)
  }
  box(24, 1.15, 0.12, bronze, 0, L2 + 0.55, -10, root)
  box(0.16, L2, 7.5, wood, 7.9, L2 / 2, 14, root)
}

function addFoyer(root, marble, bronze, wood, H) {
  box(14, 0.06, 12, marble, 0, 0.03, 26, root)
  box(4, 0.95, 0.8, wood, 0, 0.52, 31, root)
  box(4, 0.08, 0.85, marble, 0, 1.02, 31, root)
  cyl(0.12, 0.12, 3.2, bronze, 0, H + 1.4, 22, root)
  cyl(1.1, 0.65, 0.22, bronze, 0, H + 0.15, 22, root)
}

function addLiving(root, velvet, linen, wood, woodDark, bronze) {
  box(10, 0.55, 3, velvet, -4, 0.4, 0, root)
  box(3, 0.55, 7.5, velvet, 3.5, 0.4, -3, root)
  box(4, 0.1, 1.8, woodDark, -1, 0.42, -6.5, root)
  box(12, 0.04, 10, linen, 0, 0.02, -2, root)
  box(7, 1.7, 0.5, wood, 0, 0.95, -15, root)
  box(4, 1.2, 0.14, bronze, 0, 1.0, -14.7, root)
  box(1.4, 0.5, 1.4, velvet, 9, 0.35, -7, root)
  box(1.4, 0.5, 1.4, velvet, 11.5, 0.35, -4.5, root)
}

function addDining(root, woodDark, linen, bronze) {
  box(7, 0.12, 1.8, woodDark, 24, 0.78, 4, root)
  box(6.4, 0.1, 0.2, bronze, 24, 0.4, 4, root)
  for (let i = -4; i <= 4; i++) {
    box(0.5, 0.55, 0.5, linen, 24 + i * 0.72, 0.4, 2.8, root)
    box(0.5, 0.55, 0.5, linen, 24 + i * 0.72, 0.4, 5.2, root)
  }
  box(4.2, 1.05, 0.6, woodDark, 24, 0.55, -1.5, root)
}

function addKitchen(root, marble, wood, bronze, stone) {
  box(8, 0.95, 1.8, marble, 34, 0.55, -8, root)
  box(8, 0.08, 1.85, bronze, 34, 1.05, -8, root)
  for (const z of [-7, -8, -9]) {
    cyl(0.25, 0.25, 0.08, wood, 30.5, 0.72, z, root)
    cyl(0.05, 0.05, 0.65, bronze, 30.5, 0.35, z, root)
  }
  box(16, 0.95, 0.8, stone, 36, 0.55, -18, root)
  box(0.8, 0.95, 12, stone, 43, 0.55, -12, root)
  box(16, 1.05, 0.55, wood, 36, 3.0, -18.1, root)
  box(1.5, 2.4, 1.0, stone, 42.5, 1.3, -4, root)
}

function addMedia(root, velvet, woodDark) {
  box(7.5, 0.5, 3.5, velvet, 34, 0.35, 18, root)
  box(8.5, 0.05, 4, woodDark, 34, 0.05, 18.2, root)
  box(6.5, 2.8, 0.16, woodDark, 34, 1.8, 26, root)
  box(6, 2.4, 0.06, mat(0x151820, { roughness: 0.35, metalness: 0.25 }), 34, 1.8, 25.9, root)
}

function addLibrary(root, wood, woodDark, linen) {
  box(3.4, 0.1, 1.2, woodDark, -34, 0.78, 18, root)
  box(0.8, 0.55, 0.8, linen, -34, 0.4, 16.2, root)
  box(0.5, 3.4, 10, wood, -45, 1.8, 18, root)
  for (let i = 0; i < 7; i++) {
    box(0.45, 0.05, 9.5, woodDark, -44.95, 0.45 + i * 0.48, 18, root)
  }
  box(1.2, 0.5, 1.2, linen, -28, 0.35, 20, root)
  box(1.2, 0.5, 1.2, linen, -31, 0.35, 22, root)
}

function addGuestWing(root, linen, wood, velvet, wallMat, H) {
  const rooms = [
    [-36, -18],
    [-28, -18],
    [-20, -18],
    [-12, -18],
  ]
  for (const [x, z] of rooms) {
    box(2.2, 0.42, 2.4, wood, x, 0.35, z, root)
    box(2.1, 0.32, 2.25, linen, x, 0.68, z, root)
    box(2.2, 0.85, 0.24, velvet, x, 0.9, z + 1.25, root)
    box(0.24, H - 0.4, 5.5, wallMat, x + 3.5, (H - 0.4) / 2, z, root)
  }
}

function addSpa(root, marble, stone, bronze, water, wood) {
  cyl(1.4, 1.3, 0.6, marble, -40, 0.38, -26, root, 36)
  const soak = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.14, 36), water)
  soak.position.set(-40, 0.58, -26)
  root.add(soak)
  box(4.5, 0.9, 0.7, stone, -44, 0.5, -30, root)
  box(4.5, 0.06, 0.7, marble, -44, 0.98, -30, root)
  box(2.6, 2.8, 2.6, stone, -34, 1.5, -30, root)
  box(0.1, 0.55, 0.1, bronze, -34, 2.7, -30, root)
  box(3.5, 2.5, 3.0, wood, -45, 1.35, -20, root)
}

/** Indoor 25m-style lap pool pavilion on the east wing. */
function addIndoorPool(root, stone, marble, bronze, water, linen, H) {
  // Pool hall shell
  box(22, 0.08, 14, stone, 34, 0.04, -26, root)
  // Basin
  box(20, 1.15, 7.5, stone, 34, 0.2, -26, root)
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.55, 6.2), water)
  waterMesh.position.set(34, 0.45, -26)
  root.add(waterMesh)
  // Lane markers
  for (const x of [28, 31, 34, 37, 40]) {
    box(0.08, 0.02, 6, marble, x, 0.72, -26, root)
  }
  // Coping
  box(21, 0.12, 0.45, marble, 34, 0.85, -22.4, root)
  box(21, 0.12, 0.45, marble, 34, 0.85, -29.6, root)
  // Lounge chairs along the pool
  for (const x of [25, 27.5, 41, 43.5]) {
    box(0.85, 0.28, 2.1, linen, x, 0.28, -21, root)
    box(0.85, 0.55, 0.35, linen, x, 0.5, -20.2, root)
  }
  // Skylight strip suggestion
  const glow = mat(0xfff0d8, { roughness: 1, emissive: 0xffe0a8, emissiveIntensity: 0.7 })
  box(16, 0.08, 1.2, glow, 34, H - 0.2, -26, root)
  // Columns
  for (const x of [24.5, 43.5]) {
    cyl(0.28, 0.28, H - 0.4, bronze, x, (H - 0.4) / 2, -20.5, root)
    cyl(0.28, 0.28, H - 0.4, bronze, x, (H - 0.4) / 2, -31.5, root)
  }
}

/** Outdoor infinity pool on the north terrace. */
function addOutdoorPool(root, stone, wood, bronze, water, linen, green) {
  box(32, 1.15, 9, stone, 0, -0.15, -48, root)
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(29.5, 0.45, 7.2), water)
  waterMesh.position.set(0, 0.32, -48)
  root.add(waterMesh)
  // Infinity edge lip
  box(30, 0.15, 0.35, stone, 0, 0.55, -52, root)

  for (const x of [-18, -10, 10, 18]) {
    box(1.0, 0.28, 2.4, linen, x, 0.28, -38, root)
    box(1.0, 0.6, 0.4, linen, x, 0.55, -37, root)
  }

  cyl(1.5, 1.5, 0.42, stone, 26, 0.3, -40, root, 28)
  cyl(0.65, 0.65, 0.28, bronze, 26, 0.58, -40, root, 18)
  for (let a = 0; a < Math.PI * 2; a += 1.0) {
    box(1.05, 0.42, 0.8, linen, 26 + Math.cos(a) * 3.0, 0.32, -40 + Math.sin(a) * 3.0, root)
  }

  box(4, 0.1, 1.4, wood, -26, 0.78, -40, root)
  for (let i = -1; i <= 1; i++) {
    box(0.5, 0.5, 0.5, linen, -26 + i * 1.1, 0.35, -39, root)
    box(0.5, 0.5, 0.5, linen, -26 + i * 1.1, 0.35, -41, root)
  }

  for (const x of [-38, -32, 32, 38]) {
    box(1.6, 0.8, 1.6, stone, x, 0.45, -56, root)
    cyl(0.45, 0.55, 1.8, green, x, 1.5, -56, root, 8)
  }
}

function addSkyLounge(root, velvet, linen, wood, bronze, L2) {
  const y = L2
  box(6, 0.5, 2.6, velvet, -2.5, y + 0.35, 12, root)
  box(2.6, 0.5, 5, velvet, 2.5, y + 0.35, 10, root)
  box(2.8, 0.1, 1.3, wood, 0, y + 0.42, 8, root)
  box(8, 0.04, 6, linen, 0, y + 0.02, 10, root)
  box(0.1, 0.35, 0.1, bronze, -0.9, y + 0.2, 7.6, root)
  box(0.1, 0.35, 0.1, bronze, 0.9, y + 0.2, 7.6, root)
}

function addMasterSuite(root, linen, wood, velvet, bronze, marble, L2) {
  const y = L2
  box(2.8, 0.5, 3.0, wood, -26, y + 0.4, -10, root)
  box(2.7, 0.38, 2.8, linen, -26, y + 0.78, -10, root)
  box(2.8, 1.05, 0.3, velvet, -26, y + 1.05, -8.4, root)
  box(0.7, 0.55, 0.55, wood, -28.2, y + 0.38, -8.5, root)
  box(0.7, 0.55, 0.55, wood, -23.8, y + 0.38, -8.5, root)
  cyl(0.14, 0.14, 0.35, bronze, -28.2, y + 0.8, -8.5, root)
  box(2.2, 0.42, 0.6, velvet, -26, y + 0.32, -12.5, root)
  cyl(1.2, 1.1, 0.55, marble, -36, y + 0.38, -18, root, 32)
  box(3.5, 0.9, 0.65, marble, -38, y + 0.5, -22, root)
}

function addDressing(root, wood, woodDark, marble, L2) {
  const y = L2
  box(10, 2.7, 0.22, wood, -36, y + 1.45, 2, root)
  box(0.22, 2.7, 7, wood, -42, y + 1.45, 6, root)
  for (let i = 0; i < 5; i++) {
    box(9.5, 0.05, 0.15, woodDark, -36, y + 0.55 + i * 0.5, 2.05, root)
  }
  box(2.4, 0.08, 0.9, marble, -34, y + 0.9, 8, root)
}

function addGym(root, stone, wood, linen, L2) {
  const y = L2
  box(10, 0.05, 8, stone, 32, y + 0.03, -10, root)
  box(3.2, 0.35, 1.0, wood, 28, y + 0.3, -7, root)
  box(1.3, 0.2, 2.4, linen, 35, y + 0.25, -11, root)
  box(0.45, 2.1, 2.0, wood, 38, y + 1.15, -13, root)
  box(8, 2.5, 0.08, mat(0xc5d0dc, { roughness: 0.15, metalness: 0.4 }), 32, y + 1.45, -15.5, root)
}

function addMorningDeck(root, stone, wood, linen, green, bronze, L2) {
  const y = L2
  for (const x of [-12, -5, 5, 12]) {
    box(1.0, 0.28, 2.3, linen, x, y + 0.28, -38, root)
    box(1.0, 0.55, 0.38, linen, x, y + 0.5, -37, root)
  }
  box(3.0, 0.1, 1.2, wood, 0, y + 0.78, -42, root)
  for (const x of [-0.9, 0.9]) {
    box(0.45, 0.5, 0.45, linen, x, y + 0.35, -41.2, root)
    box(0.45, 0.5, 0.45, linen, x, y + 0.35, -42.8, root)
  }
  cyl(0.75, 0.75, 0.35, stone, 18, y + 0.25, -40, root)
  cyl(0.35, 0.35, 0.2, bronze, 18, y + 0.5, -40, root)
  for (const x of [-20, 20]) {
    box(1.4, 0.7, 1.4, stone, x, y + 0.4, -48, root)
    cyl(0.4, 0.5, 1.6, green, x, y + 1.4, -48, root, 8)
  }
}

function addInteriorLights(scene, L2) {
  const spots = [
    [0, 4.0, 26, 0xfff2dc, 32],
    [0, 8.0, 0, 0xfff6e8, 48],
    [0, 4.0, 0, 0xfff0d8, 40],
    [24, 3.8, 4, 0xffefd4, 26],
    [34, 3.8, -8, 0xfff8ec, 28],
    [34, 3.8, 18, 0xe8f0ff, 20],
    [-34, 3.8, 18, 0xffefd4, 20],
    [-30, 3.6, -18, 0xfff0dc, 24],
    [-40, 3.4, -26, 0xeef4ff, 18],
    [34, 3.6, -26, 0xe8f6ff, 28],
    [0, 3.4, -44, 0xfff4e0, 32],
    [-26, L2 + 3.3, -10, 0xfff0d8, 22],
    [32, L2 + 3.3, -10, 0xf0f4ff, 20],
    [0, L2 + 3.3, 10, 0xfff4e4, 26],
    [0, L2 + 3.1, -38, 0xfff6e8, 24],
  ]
  for (const [x, y, z, color, dist] of spots) {
    const light = new THREE.PointLight(color, 16, dist, 2)
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
  box(W - 4, 0.05, 0.1, glow, 0, H - 0.12, D / 2 - 1, root)
  box(W - 4, 0.05, 0.1, glow, 0, H - 0.12, -D / 2 + 1, root)
  box(0.1, 0.05, D - 4, glow, W / 2 - 1, H - 0.12, 0, root)
  box(0.1, 0.05, D - 4, glow, -W / 2 + 1, H - 0.12, 0, root)
  box(W - 16, 0.05, 0.1, glow, 0, L2 + H - 0.15, 20, root)
  box(W - 16, 0.05, 0.1, glow, 0, L2 + H - 0.15, -26, root)
}
