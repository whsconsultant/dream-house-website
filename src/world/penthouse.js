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

/** Level heights */
export const LEVEL = {
  H: 4.6, // ceiling height per floor
  L2: 4.8, // second floor slab top
}

/**
 * Duplex mega-penthouse ~72m × 50m plate (~28,000+ sq ft across two levels).
 * +Z entrance · −Z terrace · Y up.
 */
export const ROOMS = [
  { id: 'foyer', name: 'Grand Foyer', position: new THREE.Vector3(0, 1.65, 20), lookAt: new THREE.Vector3(0, 3, 0) },
  { id: 'living', name: 'Great Room', position: new THREE.Vector3(0, 1.65, 2), lookAt: new THREE.Vector3(0, 2, -12) },
  { id: 'dining', name: 'Dining Hall', position: new THREE.Vector3(16, 1.65, 4), lookAt: new THREE.Vector3(22, 1.5, 4) },
  { id: 'kitchen', name: 'Chef Kitchen', position: new THREE.Vector3(26, 1.65, -6), lookAt: new THREE.Vector3(28, 1.5, -12) },
  { id: 'media', name: 'Cinema Lounge', position: new THREE.Vector3(26, 1.65, 14), lookAt: new THREE.Vector3(28, 1.5, 16) },
  { id: 'library', name: 'Library', position: new THREE.Vector3(-26, 1.65, 14), lookAt: new THREE.Vector3(-28, 1.5, 16) },
  { id: 'guest', name: 'Guest Wing', position: new THREE.Vector3(-22, 1.65, -8), lookAt: new THREE.Vector3(-26, 1.5, -12) },
  { id: 'spa', name: 'Wellness Spa', position: new THREE.Vector3(-28, 1.65, -18), lookAt: new THREE.Vector3(-30, 1.5, -20) },
  { id: 'terrace', name: 'Pool Terrace', position: new THREE.Vector3(0, 1.65, -28), lookAt: new THREE.Vector3(0, 1.5, -38) },
  { id: 'stairs', name: 'Grand Stair', position: new THREE.Vector3(8, 1.65, 12), lookAt: new THREE.Vector3(8, 5, 8) },
  { id: 'master', name: 'Master Suite', position: new THREE.Vector3(-18, LEVEL.L2 + 1.65, -6), lookAt: new THREE.Vector3(-24, LEVEL.L2 + 1.5, -10) },
  { id: 'dressing', name: 'Dressing Gallery', position: new THREE.Vector3(-26, LEVEL.L2 + 1.65, 4), lookAt: new THREE.Vector3(-28, LEVEL.L2 + 1.5, 4) },
  { id: 'gym', name: 'Sky Gym', position: new THREE.Vector3(22, LEVEL.L2 + 1.65, -8), lookAt: new THREE.Vector3(26, LEVEL.L2 + 1.5, -10) },
  { id: 'skylounge', name: 'Sky Lounge', position: new THREE.Vector3(0, LEVEL.L2 + 1.65, 8), lookAt: new THREE.Vector3(0, LEVEL.L2 + 1.5, 0) },
  { id: 'roof', name: 'Morning Deck', position: new THREE.Vector3(0, LEVEL.L2 + 1.65, -24), lookAt: new THREE.Vector3(0, LEVEL.L2 + 1.5, -32) },
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

  const H = LEVEL.H
  const L2 = LEVEL.L2
  const W = 72
  const D = 50

  // —— Level 1 slab + upper slab ——
  box(W, 0.4, D, floorMat, 0, -0.2, 0, root)
  // Upper floor with atrium cutouts (built as pieces around voids)
  addUpperFloor(root, floorUpperMat, ceilingMat, L2, H, W, D)
  // Roof slab over L2 private zones
  box(W - 8, 0.25, D - 18, ceilingMat, 0, L2 + H, -2, root)

  // Terrace decks
  box(64, 0.32, 18, stoneMat, 0, -0.18, -34, root)
  box(40, 0.28, 14, stoneMat, 0, L2 - 0.1, -34, root)

  // Glass envelope
  addGlassEnvelope(root, glassMat, bronzeMat, W, D, L2 + H)

  // Partitions both levels
  addL1Partitions(root, wallMat, woodMat, H)
  addL2Partitions(root, wallMat, woodMat, L2, H)

  // Grand stair + atrium rail
  addGrandStair(root, marbleMat, bronzeMat, woodMat, L2)

  // Furnish L1
  addFoyer(root, marbleMat, bronzeMat, woodMat, H)
  addLiving(root, velvetMat, linenMat, woodMat, woodDarkMat, bronzeMat)
  addDining(root, woodDarkMat, linenMat, bronzeMat)
  addKitchen(root, marbleMat, woodMat, bronzeMat, stoneMat)
  addMedia(root, velvetMat, woodDarkMat)
  addLibrary(root, woodMat, woodDarkMat, linenMat)
  addGuestWing(root, linenMat, woodMat, velvetMat, wallMat, H)
  addSpa(root, marbleMat, stoneMat, bronzeMat, waterMat)
  addPoolTerrace(root, stoneMat, woodMat, bronzeMat, waterMat, linenMat, greenMat)

  // Furnish L2
  addSkyLounge(root, velvetMat, linenMat, woodMat, bronzeMat, L2)
  addMasterSuite(root, linenMat, woodMat, velvetMat, bronzeMat, marbleMat, L2)
  addDressing(root, woodMat, woodDarkMat, marbleMat, L2)
  addGym(root, stoneMat, woodMat, linenMat, L2)
  addMorningDeck(root, stoneMat, woodMat, linenMat, greenMat, bronzeMat, L2)

  addInteriorLights(scene, L2)
  addCoveLights(root, H, L2)

  return { root, rooms: ROOMS }
}

function addUpperFloor(root, floorMat, ceilingMat, L2, H, W, D) {
  // Split upper floor around double-height great room + foyer void
  // Void roughly x:-10..10, z:-8..18
  box(26, 0.35, D - 2, floorMat, -23, L2 - 0.175, 0, root) // west wing
  box(26, 0.35, D - 2, floorMat, 23, L2 - 0.175, 0, root) // east wing
  box(20, 0.35, 16, floorMat, 0, L2 - 0.175, -16, root) // north bridge toward terrace
  box(20, 0.35, 10, floorMat, 0, L2 - 0.175, 20, root) // south mezzanine over foyer edge
  // Ceiling under L1 where not void
  box(W - 0.5, 0.15, 14, ceilingMat, 0, H - 0.1, -18, root)
  box(24, 0.15, 28, ceilingMat, -24, H - 0.1, 2, root)
  box(24, 0.15, 28, ceilingMat, 24, H - 0.1, 2, root)
}

function addGlassEnvelope(root, glassMat, frameMat, W, D, totalH) {
  const t = 0.14
  const panes = [
    [W - 6, totalH - 0.5, t, 0, totalH / 2, D / 2],
    [t, totalH - 0.5, D, W / 2, totalH / 2, 0],
    [t, totalH - 0.5, D, -W / 2, totalH / 2, 0],
  ]
  for (const [w, h, d, x, y, z] of panes) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glassMat)
    m.position.set(x, y, z)
    root.add(m)
  }
  // North openings toward terrace — intermittent glass
  for (const x of [-28, -14, 0, 14, 28]) {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(10, totalH - 0.5, t), glassMat)
    pane.position.set(x, totalH / 2, -D / 2)
    root.add(pane)
  }
  // Mullions
  for (let i = -5; i <= 5; i++) {
    box(0.2, totalH, 0.2, frameMat, i * 6.5, totalH / 2, D / 2, root)
    box(0.2, totalH, 0.2, frameMat, i * 6.5, totalH / 2, -D / 2, root)
  }
  for (let i = -3; i <= 3; i++) {
    box(0.2, totalH, 0.2, frameMat, W / 2, totalH / 2, i * 7, root)
    box(0.2, totalH, 0.2, frameMat, -W / 2, totalH / 2, i * 7, root)
  }
}

function addL1Partitions(root, wallMat, woodMat, H) {
  const h = H - 0.35
  box(0.28, h, 28, wallMat, -14, h / 2, -4, root) // west living divider
  box(0.28, h, 22, wallMat, 14, h / 2, -2, root) // east living divider
  box(16, h, 0.28, wallMat, 22, h / 2, 6, root) // media / kitchen
  box(16, h, 0.28, wallMat, -22, h / 2, 6, root) // library wall
  box(18, h, 0.28, wallMat, -22, h / 2, -12, root) // guest corridor
  box(0.28, h, 12, wallMat, -30, h / 2, -18, root) // spa
  box(12, h * 0.9, 0.22, woodMat, -8, (h * 0.9) / 2, -8, root) // feature wall
}

function addL2Partitions(root, wallMat, woodMat, L2, H) {
  const h = H - 0.4
  const y = L2 + h / 2
  box(0.28, h, 24, wallMat, -10, y, -4, root)
  box(0.28, h, 20, wallMat, 12, y, -2, root)
  box(14, h, 0.28, wallMat, -24, y, 0, root)
  box(16, h, 0.28, wallMat, 22, y, 2, root)
  box(10, h * 0.85, 0.22, woodMat, -20, L2 + (h * 0.85) / 2, -10, root)
}

function addGrandStair(root, marble, bronze, wood, L2) {
  const steps = 16
  const rise = L2 / steps
  const run = 0.38
  for (let i = 0; i < steps; i++) {
    box(3.2, rise, run + 0.05, marble, 8, rise * (i + 0.5), 14 - i * run, root)
  }
  // Landing
  box(4.2, 0.2, 2.2, marble, 8, L2, 14 - steps * run - 0.6, root)
  // Rails
  box(0.08, L2 * 0.95, 0.08, bronze, 6.3, (L2 * 0.95) / 2, 8, root)
  box(0.08, L2 * 0.95, 0.08, bronze, 9.7, (L2 * 0.95) / 2, 8, root)
  // Atrium glass rail on L2 edge
  for (const x of [-9, 9]) {
    box(0.1, 1.1, 18, bronze, x, L2 + 0.55, 2, root)
  }
  box(18, 1.1, 0.1, bronze, 0, L2 + 0.55, -7.5, root)
  // Stair side panel
  box(0.15, L2, 6.5, wood, 6.2, L2 / 2, 11, root)
}

function addFoyer(root, marble, bronze, wood, H) {
  box(10, 0.06, 8, marble, 0, 0.03, 18, root)
  box(3.2, 0.9, 0.7, wood, 0, 0.5, 22.5, root)
  box(3.2, 0.08, 0.75, marble, 0, 0.98, 22.5, root)
  cyl(0.1, 0.1, 2.4, bronze, 0, H + 1.2, 16, root)
  cyl(0.9, 0.55, 0.2, bronze, 0, H + 0.2, 16, root)
}

function addLiving(root, velvet, linen, wood, woodDark, bronze) {
  box(8, 0.55, 2.6, velvet, -3, 0.4, -2, root)
  box(2.6, 0.55, 6, velvet, 2.5, 0.4, -4, root)
  box(3.2, 0.1, 1.6, woodDark, -1, 0.42, -5.5, root)
  for (const [x, z] of [
    [-2.2, -6.1],
    [0.2, -6.1],
    [-2.2, -4.9],
    [0.2, -4.9],
  ]) {
    box(0.1, 0.35, 0.1, bronze, x, 0.2, z, root)
  }
  box(10, 0.04, 8, linen, 0, 0.02, -3, root)
  box(5.5, 1.6, 0.45, wood, 0, 0.9, -11.5, root)
  box(3.2, 1.1, 0.12, bronze, 0, 0.95, -11.2, root)
  box(1.3, 0.5, 1.3, velvet, 7, 0.35, -6, root)
  box(1.3, 0.5, 1.3, velvet, 9, 0.35, -4, root)
}

function addDining(root, woodDark, linen, bronze) {
  box(5.5, 0.12, 1.6, woodDark, 18, 0.78, 2, root)
  box(5, 0.1, 0.18, bronze, 18, 0.4, 2, root)
  for (let i = -3; i <= 3; i++) {
    box(0.5, 0.55, 0.5, linen, 18 + i * 0.75, 0.4, 0.9, root)
    box(0.5, 0.55, 0.5, linen, 18 + i * 0.75, 0.4, 3.1, root)
  }
  box(3.5, 1.0, 0.55, woodDark, 18, 0.55, -2.5, root)
}

function addKitchen(root, marble, wood, bronze, stone) {
  box(6.5, 0.95, 1.6, marble, 26, 0.55, -6, root)
  box(6.5, 0.08, 1.65, bronze, 26, 1.05, -6, root)
  for (const z of [-5.2, -6, -6.8]) {
    cyl(0.24, 0.24, 0.08, wood, 23.2, 0.72, z, root)
    cyl(0.05, 0.05, 0.65, bronze, 23.2, 0.35, z, root)
  }
  box(12, 0.95, 0.75, stone, 28, 0.55, -14, root)
  box(0.75, 0.95, 10, stone, 33, 0.55, -9, root)
  box(12, 1.0, 0.5, wood, 28, 2.9, -14.1, root)
  box(1.4, 2.3, 0.9, stone, 32.8, 1.25, -3.5, root)
  // Butler pantry hint
  box(4, 0.9, 0.7, stone, 22, 0.5, -14, root)
}

function addMedia(root, velvet, woodDark) {
  box(6, 0.5, 3, velvet, 26, 0.35, 14, root)
  box(7, 0.05, 3.5, woodDark, 26, 0.05, 14.2, root)
  box(5.5, 2.6, 0.15, woodDark, 26, 1.7, 20, root)
  box(5, 2.2, 0.06, mat(0x151820, { roughness: 0.35, metalness: 0.25 }), 26, 1.7, 19.9, root)
}

function addLibrary(root, wood, woodDark, linen) {
  box(3.0, 0.1, 1.1, woodDark, -26, 0.78, 14, root)
  box(0.75, 0.55, 0.75, linen, -26, 0.4, 12.5, root)
  box(0.45, 3.2, 8, wood, -33.5, 1.7, 14, root)
  for (let i = 0; i < 6; i++) {
    box(0.4, 0.05, 7.6, woodDark, -33.45, 0.45 + i * 0.5, 14, root)
  }
  // Reading chairs
  box(1.1, 0.5, 1.1, linen, -22, 0.35, 16, root)
  box(1.1, 0.5, 1.1, linen, -24.5, 0.35, 17.5, root)
}

function addGuestWing(root, linen, wood, velvet, wallMat, H) {
  const rooms = [
    [-20, -16],
    [-14, -16],
    [-8, -16],
  ]
  for (const [x, z] of rooms) {
    box(2.0, 0.42, 2.3, wood, x, 0.35, z, root)
    box(1.9, 0.32, 2.15, linen, x, 0.68, z, root)
    box(2.0, 0.8, 0.22, velvet, x, 0.85, z + 1.2, root)
    box(0.22, H - 0.4, 5, wallMat, x + 3, (H - 0.4) / 2, z, root)
  }
}

function addSpa(root, marble, stone, bronze, water) {
  cyl(1.35, 1.25, 0.6, marble, -30, 0.38, -20, root, 36)
  const pool = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.14, 36), water)
  pool.position.set(-30, 0.58, -20)
  root.add(pool)
  box(4, 0.9, 0.65, stone, -33, 0.5, -23.5, root)
  box(4, 0.06, 0.65, marble, -33, 0.98, -23.5, root)
  box(2.4, 2.8, 2.4, stone, -26, 1.5, -23, root)
  box(0.1, 0.55, 0.1, bronze, -26, 2.7, -23, root)
  // Sauna block
  box(3.2, 2.4, 2.8, woodMatSafe(), -34, 1.3, -16, root)
}

function woodMatSafe() {
  return mat(COLORS.wood, { roughness: 0.6 })
}

function addPoolTerrace(root, stone, wood, bronze, water, linen, green) {
  box(24, 1.0, 7, stone, 0, -0.1, -36, root)
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 5.5), water)
  waterMesh.position.set(0, 0.28, -36)
  root.add(waterMesh)
  for (const x of [-14, -8, 8, 14]) {
    box(0.9, 0.28, 2.3, linen, x, 0.28, -28.5, root)
    box(0.9, 0.6, 0.4, linen, x, 0.55, -27.5, root)
  }
  cyl(1.4, 1.4, 0.4, stone, 20, 0.28, -30, root, 28)
  cyl(0.6, 0.6, 0.28, bronze, 20, 0.55, -30, root, 18)
  for (let a = 0; a < Math.PI * 2; a += 1.05) {
    box(1.0, 0.42, 0.75, linen, 20 + Math.cos(a) * 2.8, 0.32, -30 + Math.sin(a) * 2.8, root)
  }
  box(3.4, 0.1, 1.3, wood, -20, 0.78, -30, root)
  for (let i = -1; i <= 1; i++) {
    box(0.5, 0.5, 0.5, linen, -20 + i, 0.35, -29.1, root)
    box(0.5, 0.5, 0.5, linen, -20 + i, 0.35, -30.9, root)
  }
  for (const x of [-30, -26, 26, 30]) {
    box(1.4, 0.75, 1.4, stone, x, 0.42, -42, root)
    cyl(0.4, 0.5, 1.6, green, x, 1.4, -42, root, 8)
  }
}

function addSkyLounge(root, velvet, linen, wood, bronze, L2) {
  const y = L2
  box(5, 0.5, 2.4, velvet, -2, y + 0.35, 10, root)
  box(2.4, 0.5, 4, velvet, 2, y + 0.35, 8, root)
  box(2.4, 0.1, 1.2, wood, 0, y + 0.42, 6.5, root)
  box(0.1, 0.35, 0.1, bronze, -0.8, y + 0.2, 6.1, root)
  box(0.1, 0.35, 0.1, bronze, 0.8, y + 0.2, 6.1, root)
  box(7, 0.04, 5, linen, 0, y + 0.02, 8, root)
}

function addMasterSuite(root, linen, wood, velvet, bronze, marble, L2) {
  const y = L2
  box(2.6, 0.5, 2.8, wood, -20, y + 0.4, -8, root)
  box(2.5, 0.38, 2.6, linen, -20, y + 0.78, -8, root)
  box(2.6, 1.0, 0.28, velvet, -20, y + 1.0, -6.5, root)
  box(0.65, 0.55, 0.5, wood, -22, y + 0.38, -6.6, root)
  box(0.65, 0.55, 0.5, wood, -18, y + 0.38, -6.6, root)
  cyl(0.14, 0.14, 0.35, bronze, -22, y + 0.8, -6.6, root)
  box(2.0, 0.42, 0.55, velvet, -20, y + 0.32, -10.2, root)
  // Ensuite bath
  cyl(1.15, 1.05, 0.55, marble, -28, y + 0.38, -14, root, 32)
  box(3.2, 0.9, 0.6, marble, -30, y + 0.5, -17, root)
}

function addDressing(root, wood, woodDark, marble, L2) {
  const y = L2
  box(8, 2.6, 0.2, wood, -28, y + 1.4, 2, root)
  box(0.2, 2.6, 6, wood, -32, y + 1.4, 5, root)
  for (let i = 0; i < 4; i++) {
    box(7.5, 0.05, 0.15, woodDark, -28, y + 0.6 + i * 0.55, 2.05, root)
  }
  box(2.2, 0.08, 0.8, marble, -26, y + 0.9, 6, root)
}

function addGym(root, stone, wood, linen, L2) {
  const y = L2
  box(8, 0.05, 6, stone, 24, y + 0.03, -8, root)
  box(2.8, 0.35, 0.9, wood, 22, y + 0.3, -6, root)
  box(1.2, 0.2, 2.2, linen, 27, y + 0.25, -9, root)
  box(0.4, 2.0, 1.8, wood, 29.5, y + 1.1, -10.5, root)
  // Mirror wall
  box(6, 2.4, 0.08, mat(0xc5d0dc, { roughness: 0.15, metalness: 0.4 }), 24, y + 1.4, -12.5, root)
}

function addMorningDeck(root, stone, wood, linen, green, bronze, L2) {
  const y = L2
  for (const x of [-10, -4, 4, 10]) {
    box(0.95, 0.28, 2.2, linen, x, y + 0.28, -28, root)
    box(0.95, 0.55, 0.35, linen, x, y + 0.5, -27.1, root)
  }
  box(2.6, 0.1, 1.1, wood, 0, y + 0.78, -32, root)
  for (const x of [-0.8, 0.8]) {
    box(0.45, 0.5, 0.45, linen, x, y + 0.35, -31.3, root)
    box(0.45, 0.5, 0.45, linen, x, y + 0.35, -32.7, root)
  }
  cyl(0.7, 0.7, 0.35, stone, 14, y + 0.25, -30, root)
  cyl(0.35, 0.35, 0.2, bronze, 14, y + 0.5, -30, root)
  for (const x of [-16, 16]) {
    box(1.3, 0.7, 1.3, stone, x, y + 0.4, -36, root)
    cyl(0.35, 0.45, 1.5, green, x, y + 1.35, -36, root, 8)
  }
}

function addInteriorLights(scene, L2) {
  const spots = [
    [0, 3.8, 18, 0xfff2dc, 28],
    [0, 7.5, 0, 0xfff6e8, 40],
    [0, 3.8, -2, 0xfff0d8, 35],
    [18, 3.6, 2, 0xffefd4, 22],
    [26, 3.6, -6, 0xfff8ec, 26],
    [26, 3.6, 14, 0xe8f0ff, 18],
    [-26, 3.6, 14, 0xffefd4, 18],
    [-22, 3.5, -16, 0xfff0dc, 20],
    [-30, 3.2, -20, 0xeef4ff, 16],
    [0, 3.2, -32, 0xfff4e0, 28],
    [-20, L2 + 3.2, -8, 0xfff0d8, 20],
    [24, L2 + 3.2, -8, 0xf0f4ff, 18],
    [0, L2 + 3.2, 8, 0xfff4e4, 24],
    [0, L2 + 3.0, -28, 0xfff6e8, 22],
  ]
  for (const [x, y, z, color, dist] of spots) {
    const light = new THREE.PointLight(color, 16, dist, 2)
    light.position.set(x, y, z)
    scene.add(light)
  }
}

function addCoveLights(root, H, L2) {
  const glow = new THREE.MeshStandardMaterial({
    color: 0xffe8c8,
    emissive: 0xffd090,
    emissiveIntensity: 0.85,
    roughness: 1,
  })
  box(70, 0.05, 0.1, glow, 0, H - 0.12, 24, root)
  box(70, 0.05, 0.1, glow, 0, H - 0.12, -24, root)
  box(0.1, 0.05, 48, glow, 35.5, H - 0.12, 0, root)
  box(0.1, 0.05, 48, glow, -35.5, H - 0.12, 0, root)
  box(60, 0.05, 0.1, glow, 0, L2 + H - 0.15, 16, root)
  box(60, 0.05, 0.1, glow, 0, L2 + H - 0.15, -20, root)
}
