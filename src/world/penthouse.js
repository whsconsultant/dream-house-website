import * as THREE from 'three'

const COLORS = {
  floor: 0xc9c2b4,
  floorDark: 0x9a9286,
  wall: 0xf2eee6,
  wallAccent: 0xd8d0c4,
  wood: 0x6b4f35,
  woodDark: 0x3d2c1e,
  bronze: 0xb8925a,
  glass: 0x88aacc,
  water: 0x3a7ca5,
  stone: 0x8a8680,
  velvet: 0x2a3340,
  linen: 0xe8e0d4,
  marble: 0xe8e4dc,
  ceiling: 0xf7f4ef,
  night: 0x0a1018,
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

/** Room hotspots for teleport / labels */
export const ROOMS = [
  { id: 'foyer', name: 'Foyer', position: new THREE.Vector3(0, 1.65, 14), lookAt: new THREE.Vector3(0, 1.5, 0) },
  { id: 'living', name: 'Great Room', position: new THREE.Vector3(0, 1.65, 2), lookAt: new THREE.Vector3(0, 1.5, -8) },
  { id: 'dining', name: 'Dining', position: new THREE.Vector3(10, 1.65, 2), lookAt: new THREE.Vector3(14, 1.5, 2) },
  { id: 'kitchen', name: 'Kitchen', position: new THREE.Vector3(16, 1.65, -6), lookAt: new THREE.Vector3(18, 1.5, -10) },
  { id: 'media', name: 'Media Lounge', position: new THREE.Vector3(16, 1.65, 10), lookAt: new THREE.Vector3(18, 1.5, 12) },
  { id: 'office', name: 'Library', position: new THREE.Vector3(-16, 1.65, 10), lookAt: new THREE.Vector3(-18, 1.5, 12) },
  { id: 'master', name: 'Master Suite', position: new THREE.Vector3(-14, 1.65, -4), lookAt: new THREE.Vector3(-18, 1.5, -8) },
  { id: 'spa', name: 'Spa Bath', position: new THREE.Vector3(-18, 1.65, -12), lookAt: new THREE.Vector3(-20, 1.5, -14) },
  { id: 'guest', name: 'Guest Wing', position: new THREE.Vector3(-8, 1.65, -12), lookAt: new THREE.Vector3(-6, 1.5, -14) },
  { id: 'terrace', name: 'Infinity Terrace', position: new THREE.Vector3(0, 1.65, -20), lookAt: new THREE.Vector3(0, 1.5, -28) },
]

/**
 * Full-floor penthouse ~48m × 36m plate, 4.2m ceilings.
 * Coordinate origin at plan center; +Z toward entrance, −Z toward terrace.
 */
export function createPenthouse(scene) {
  const root = new THREE.Group()
  root.name = 'penthouse'
  scene.add(root)

  const floorMat = mat(COLORS.floor, { roughness: 0.35, metalness: 0.08 })
  const wallMat = mat(COLORS.wall, { roughness: 0.85 })
  const woodMat = mat(COLORS.wood, { roughness: 0.55 })
  const woodDarkMat = mat(COLORS.woodDark, { roughness: 0.5 })
  const bronzeMat = mat(COLORS.bronze, { roughness: 0.35, metalness: 0.65 })
  const velvetMat = mat(COLORS.velvet, { roughness: 0.9 })
  const linenMat = mat(COLORS.linen, { roughness: 0.8 })
  const stoneMat = mat(COLORS.stone, { roughness: 0.6 })
  const marbleMat = mat(COLORS.marble, { roughness: 0.25, metalness: 0.1 })
  const ceilingMat = mat(COLORS.ceiling, { roughness: 0.9 })
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: COLORS.glass,
    transmission: 0.85,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    metalness: 0.05,
    thickness: 0.4,
    ior: 1.45,
    side: THREE.DoubleSide,
  })
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: COLORS.water,
    transmission: 0.55,
    transparent: true,
    opacity: 0.75,
    roughness: 0.15,
    metalness: 0.1,
    thickness: 0.8,
  })

  const H = 4.2
  const slabY = 0
  const W = 48
  const D = 36

  // Main floor slab
  box(W, 0.35, D, floorMat, 0, slabY - 0.175, 0, root)

  // Terrace extension (north)
  box(44, 0.3, 14, stoneMat, 0, slabY - 0.2, -25, root)

  // Ceiling
  box(W - 0.4, 0.2, D - 0.4, ceilingMat, 0, H, 0, root)

  // Exterior glass curtain (openings on terrace side)
  addGlassWalls(root, glassMat, bronzeMat, W, D, H)

  // Interior partitions
  addPartitions(root, wallMat, woodMat, H)

  // Rooms furniture
  addFoyer(root, marbleMat, bronzeMat, woodMat, H)
  addLiving(root, velvetMat, linenMat, woodMat, woodDarkMat, bronzeMat)
  addDining(root, woodDarkMat, linenMat, bronzeMat)
  addKitchen(root, marbleMat, woodMat, bronzeMat, stoneMat)
  addMedia(root, velvetMat, woodDarkMat)
  addOffice(root, woodMat, woodDarkMat, linenMat)
  addMaster(root, linenMat, woodMat, velvetMat, bronzeMat)
  addSpa(root, marbleMat, stoneMat, bronzeMat, waterMat)
  addGuest(root, linenMat, woodMat, velvetMat)
  addTerrace(root, stoneMat, woodMat, bronzeMat, waterMat, linenMat)

  // Ambient interior lights (point lights per zone)
  addInteriorLights(scene)

  // Soft ceiling cove glow strips
  addCoveLights(root, H)

  return { root, rooms: ROOMS }
}

function addGlassWalls(root, glassMat, frameMat, W, D, H) {
  const t = 0.12
  // South (entrance) — mostly glass with bronze mullions
  const south = new THREE.Mesh(new THREE.BoxGeometry(W - 4, H - 0.4, t), glassMat)
  south.position.set(0, H / 2, D / 2)
  root.add(south)

  // North open to terrace — partial glass with large openings
  for (const x of [-16, -5.5, 5.5, 16]) {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(8, H - 0.4, t), glassMat)
    pane.position.set(x, H / 2, -D / 2)
    root.add(pane)
  }

  // East / West full glass
  const east = new THREE.Mesh(new THREE.BoxGeometry(t, H - 0.4, D), glassMat)
  east.position.set(W / 2, H / 2, 0)
  root.add(east)
  const west = new THREE.Mesh(new THREE.BoxGeometry(t, H - 0.4, D), glassMat)
  west.position.set(-W / 2, H / 2, 0)
  root.add(west)

  // Mullion columns
  for (let i = -3; i <= 3; i++) {
    box(0.18, H, 0.18, frameMat, i * 6.5, H / 2, D / 2, root)
    box(0.18, H, 0.18, frameMat, i * 6.5, H / 2, -D / 2, root)
  }
  for (let i = -2; i <= 2; i++) {
    box(0.18, H, 0.18, frameMat, W / 2, H / 2, i * 7, root)
    box(0.18, H, 0.18, frameMat, -W / 2, H / 2, i * 7, root)
  }
}

function addPartitions(root, wallMat, woodMat, H) {
  const h = H - 0.3
  // Master wing wall (west)
  box(0.25, h, 20, wallMat, -10, h / 2, -4, root)
  // Kitchen / dining divider
  box(0.25, h, 14, wallMat, 12, h / 2, -2, root)
  // Media vs kitchen
  box(10, h, 0.25, wallMat, 17, h / 2, 4, root)
  // Office wall
  box(10, h, 0.25, wallMat, -17, h / 2, 4, root)
  // Guest corridor
  box(12, h, 0.25, wallMat, -4, h / 2, -8, root)
  // Spa divider
  box(0.25, h, 8, wallMat, -16, h / 2, -12, root)
  // Soft wood feature wall in living
  box(8, h * 0.85, 0.2, woodMat, -6, (h * 0.85) / 2, -6, root)
}

function addFoyer(root, marble, bronze, wood, H) {
  // Marble inlay
  box(6, 0.05, 5, marble, 0, 0.02, 14, root)
  // Console
  box(2.4, 0.08, 0.55, wood, 0, 0.9, 16.5, root)
  box(2.4, 0.7, 0.5, wood, 0, 0.45, 16.5, root)
  // Sculptural pendant stand-in
  cyl(0.08, 0.08, 1.2, bronze, 0, H - 0.8, 14, root)
  cyl(0.55, 0.35, 0.15, bronze, 0, H - 1.5, 14, root)
}

function addLiving(root, velvet, linen, wood, woodDark, bronze) {
  // Large sectional
  box(5.5, 0.55, 2.2, velvet, -2, 0.4, 0, root)
  box(2.2, 0.55, 4.5, velvet, 1.5, 0.4, -1.2, root)
  // Cushions
  box(1.2, 0.25, 0.5, linen, -3.2, 0.75, 0.4, root)
  box(1.2, 0.25, 0.5, linen, -1.2, 0.75, 0.4, root)
  // Coffee table
  box(2.2, 0.08, 1.2, woodDark, -1, 0.42, -2.2, root)
  box(0.08, 0.35, 0.08, bronze, -1.8, 0.2, -2.6, root)
  box(0.08, 0.35, 0.08, bronze, -0.2, 0.2, -2.6, root)
  box(0.08, 0.35, 0.08, bronze, -1.8, 0.2, -1.8, root)
  box(0.08, 0.35, 0.08, bronze, -0.2, 0.2, -1.8, root)
  // Lounge chairs
  box(1.1, 0.5, 1.1, velvet, 4, 0.35, -3, root)
  box(1.1, 0.5, 1.1, velvet, 5.5, 0.35, -1.5, root)
  // Area rug suggestion
  box(7, 0.03, 5.5, linen, 0, 0.02, -1, root)
  // Media console / fireplace feature
  box(4, 1.4, 0.4, wood, 0, 0.8, -6.8, root)
  box(2.2, 0.9, 0.15, bronze, 0, 0.85, -6.55, root)
}

function addDining(root, woodDark, linen, bronze) {
  // Table for 10
  box(4.2, 0.1, 1.4, woodDark, 10, 0.78, 1, root)
  box(3.8, 0.08, 0.15, bronze, 10, 0.4, 1, root)
  for (let i = -2; i <= 2; i++) {
    box(0.5, 0.55, 0.5, linen, 10 + i * 0.85, 0.4, 0.05, root)
    box(0.5, 0.55, 0.5, linen, 10 + i * 0.85, 0.4, 1.95, root)
  }
  // Sideboard
  box(2.8, 0.9, 0.5, woodDark, 10, 0.5, -2.5, root)
}

function addKitchen(root, marble, wood, bronze, stone) {
  // Island
  box(4.5, 0.95, 1.4, marble, 17, 0.55, -6, root)
  box(4.5, 0.08, 1.45, bronze, 17, 1.05, -6, root)
  // Bar stools
  for (const z of [-5.4, -6, -6.6]) {
    cyl(0.22, 0.22, 0.08, wood, 15.2, 0.72, z, root)
    cyl(0.05, 0.05, 0.65, bronze, 15.2, 0.35, z, root)
  }
  // Perimeter counters
  box(8, 0.95, 0.7, stone, 18.5, 0.55, -11.5, root)
  box(0.7, 0.95, 6, stone, 21.5, 0.55, -8, root)
  // Upper cabinets
  box(8, 0.9, 0.45, wood, 18.5, 2.8, -11.6, root)
  // Fridge block
  box(1.2, 2.2, 0.8, stone, 21.3, 1.2, -4.5, root)
}

function addMedia(root, velvet, woodDark) {
  box(4.5, 0.45, 2.2, velvet, 17, 0.35, 10, root)
  box(5, 0.05, 2.5, woodDark, 17, 0.05, 10.2, root)
  // Screen wall
  box(4, 2.2, 0.12, woodDark, 17, 1.6, 14.5, root)
  box(3.6, 1.9, 0.05, mat(0x111418, { roughness: 0.4, metalness: 0.3 }), 17, 1.6, 14.4, root)
}

function addOffice(root, wood, woodDark, linen) {
  // Desk
  box(2.4, 0.08, 0.9, woodDark, -18, 0.78, 10, root)
  box(2.2, 0.65, 0.08, wood, -18, 0.4, 10.4, root)
  // Chair
  box(0.7, 0.5, 0.7, linen, -18, 0.4, 8.8, root)
  // Bookshelves
  box(0.4, 2.8, 4, wood, -22.5, 1.5, 10, root)
  for (let i = 0; i < 5; i++) {
    box(0.35, 0.04, 3.8, woodDark, -22.45, 0.4 + i * 0.55, 10, root)
  }
}

function addMaster(root, linen, wood, velvet, bronze) {
  // Bed
  box(2.2, 0.45, 2.4, wood, -16, 0.35, -4, root)
  box(2.1, 0.35, 2.2, linen, -16, 0.7, -4, root)
  box(2.2, 0.9, 0.25, velvet, -16, 0.9, -2.7, root)
  // Nightstands
  box(0.55, 0.5, 0.45, wood, -17.5, 0.35, -2.9, root)
  box(0.55, 0.5, 0.45, wood, -14.5, 0.35, -2.9, root)
  cyl(0.12, 0.12, 0.35, bronze, -17.5, 0.75, -2.9, root)
  // Bench
  box(1.6, 0.4, 0.45, velvet, -16, 0.3, -5.8, root)
  // Walk-in suggestion
  box(3.5, 2.4, 0.15, wood, -12.5, 1.3, -2, root)
}

function addSpa(root, marble, stone, bronze, water) {
  // Soaking tub
  cyl(1.1, 1.05, 0.55, marble, -19.5, 0.35, -13, root, 32)
  const waterMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.12, 32), water)
  waterMesh.position.set(-19.5, 0.55, -13)
  root.add(waterMesh)
  // Vanity
  box(2.8, 0.85, 0.55, stone, -21.5, 0.5, -15.5, root)
  box(2.8, 0.05, 0.55, marble, -21.5, 0.95, -15.5, root)
  // Rain shower niche
  box(1.8, 2.6, 1.8, stone, -17, 1.4, -15.5, root)
  box(0.08, 0.5, 0.08, bronze, -17, 2.5, -15.5, root)
}

function addGuest(root, linen, wood, velvet) {
  box(1.8, 0.4, 2.1, wood, -6, 0.35, -12, root)
  box(1.7, 0.3, 2, linen, -6, 0.65, -12, root)
  box(1.8, 0.75, 0.2, velvet, -6, 0.8, -10.9, root)
  box(1.8, 0.4, 2.1, wood, -2, 0.35, -12, root)
  box(1.7, 0.3, 2, linen, -2, 0.65, -12, root)
}

function addTerrace(root, stone, wood, bronze, water, linen) {
  // Infinity pool
  box(18, 0.9, 5.5, stone, 0, -0.15, -27, root)
  const pool = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.35, 4.2), water)
  pool.position.set(0, 0.25, -27)
  root.add(pool)

  // Deck loungers
  for (const x of [-10, -6, 6, 10]) {
    box(0.8, 0.25, 2.1, linen, x, 0.25, -21.5, root)
    box(0.8, 0.55, 0.35, linen, x, 0.5, -20.6, root)
  }
  // Fire pit lounge
  cyl(1.2, 1.2, 0.35, stone, 14, 0.25, -22, root, 28)
  cyl(0.55, 0.55, 0.25, bronze, 14, 0.5, -22, root, 20)
  for (const a of [0, 1.2, 2.4, 3.6, 4.8]) {
    const lx = 14 + Math.cos(a) * 2.4
    const lz = -22 + Math.sin(a) * 2.4
    box(0.9, 0.4, 0.7, linen, lx, 0.3, lz, root)
  }
  // Outdoor dining
  box(2.8, 0.08, 1.2, wood, -14, 0.78, -22, root)
  for (let i = -1; i <= 1; i++) {
    box(0.45, 0.5, 0.45, linen, -14 + i, 0.35, -21.2, root)
    box(0.45, 0.5, 0.45, linen, -14 + i, 0.35, -22.8, root)
  }
  // Planters
  for (const x of [-20, -18, 18, 20]) {
    box(1.2, 0.7, 1.2, stone, x, 0.4, -30, root)
    cyl(0.35, 0.45, 1.4, mat(0x2d4a35, { roughness: 0.9 }), x, 1.2, -30, root, 8)
  }
}

function addInteriorLights(scene) {
  const spots = [
    [0, 3.6, 14, 0xffe2b8, 18],
    [0, 3.6, 0, 0xffe8c8, 28],
    [10, 3.6, 1, 0xffe2b8, 16],
    [17, 3.6, -6, 0xfff0dc, 22],
    [17, 3.6, 10, 0xdde8ff, 14],
    [-18, 3.6, 10, 0xffe2b8, 14],
    [-16, 3.6, -4, 0xffd9a8, 16],
    [-19, 3.2, -13, 0xe8f0ff, 12],
    [0, 3.2, -22, 0xffc878, 20],
  ]
  for (const [x, y, z, color, dist] of spots) {
    const light = new THREE.PointLight(color, 22, dist, 2)
    light.position.set(x, y, z)
    light.castShadow = false
    scene.add(light)
  }
}

function addCoveLights(root, H) {
  const glow = new THREE.MeshStandardMaterial({
    color: 0xffe4b8,
    emissive: 0xffc878,
    emissiveIntensity: 1.4,
    roughness: 1,
  })
  // Perimeter cove strips
  box(46, 0.06, 0.12, glow, 0, H - 0.15, 17.5, root)
  box(46, 0.06, 0.12, glow, 0, H - 0.15, -17.5, root)
  box(0.12, 0.06, 34, glow, 23.5, H - 0.15, 0, root)
  box(0.12, 0.06, 34, glow, -23.5, H - 0.15, 0, root)
}
