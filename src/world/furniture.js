import { box, cyl } from './materials.js'

/** Detailed furniture pieces — multi-part, residential proportions. */

export function sofa(parent, M, x, y, z, opts = {}) {
  const w = opts.w ?? 2.8
  const d = opts.d ?? 1.05
  const rot = opts.rot ?? 0
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = rot

  // Base plinth
  box(w, 0.12, d, M.woodDark, 0, 0.08, 0, g)
  // Seat cushion
  box(w - 0.08, 0.28, d - 0.12, M.velvet, 0, 0.3, 0.02, g)
  // Back
  box(w - 0.06, 0.55, 0.22, M.velvet, 0, 0.58, -d / 2 + 0.14, g)
  // Arms
  box(0.18, 0.42, d - 0.15, M.velvet, -w / 2 + 0.12, 0.42, 0.02, g)
  box(0.18, 0.42, d - 0.15, M.velvet, w / 2 - 0.12, 0.42, 0.02, g)
  // Throw pillows
  box(0.38, 0.38, 0.18, M.cushion, -w * 0.28, 0.55, -d / 2 + 0.32, g)
  box(0.38, 0.38, 0.18, M.linen, w * 0.28, 0.55, -d / 2 + 0.32, g)
  // Legs
  for (const lx of [-w / 2 + 0.2, w / 2 - 0.2]) {
    for (const lz of [-d / 2 + 0.15, d / 2 - 0.15]) {
      cyl(0.03, 0.03, 0.08, M.bronze, lx, 0.04, lz, g, 8)
    }
  }
  parent.add(g)
  return g
}

export function loungeChair(parent, M, x, y, z, rot = 0) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = rot
  box(0.75, 0.12, 0.75, M.woodDark, 0, 0.08, 0, g)
  box(0.7, 0.22, 0.7, M.leather, 0, 0.28, 0, g)
  box(0.7, 0.5, 0.14, M.leather, 0, 0.55, -0.28, g)
  parent.add(g)
  return g
}

export function coffeeTable(parent, M, x, y, z) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(1.2, 0.05, 0.7, M.marble, 0, 0.38, 0, g)
  box(0.9, 0.04, 0.08, M.bronze, 0, 0.2, 0, g)
  box(0.08, 0.04, 0.5, M.bronze, 0, 0.2, 0, g)
  cyl(0.12, 0.14, 0.06, M.bronze, 0, 0.05, 0, g, 16)
  parent.add(g)
  return g
}

export function diningTable(parent, M, x, y, z, seats = 6) {
  const len = Math.max(1.8, seats * 0.55)
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(len, 0.06, 1.0, M.woodDark, 0, 0.74, 0, g)
  // Trestle
  box(len * 0.7, 0.08, 0.08, M.bronze, 0, 0.38, 0, g)
  box(0.08, 0.65, 0.08, M.bronze, -len * 0.28, 0.35, 0, g)
  box(0.08, 0.65, 0.08, M.bronze, len * 0.28, 0.35, 0, g)
  box(0.5, 0.04, 0.5, M.bronze, -len * 0.28, 0.04, 0, g)
  box(0.5, 0.04, 0.5, M.bronze, len * 0.28, 0.04, 0, g)

  const n = Math.floor(seats / 2)
  for (let i = 0; i < n; i++) {
    const ox = -((n - 1) * 0.55) / 2 + i * 0.55
    diningChair(g, M, ox, 0, -0.72, 0)
    diningChair(g, M, ox, 0, 0.72, Math.PI)
  }
  parent.add(g)
  return g
}

function diningChair(parent, M, x, y, z, rot) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = rot
  box(0.42, 0.05, 0.42, M.wood, 0, 0.42, 0, g)
  box(0.4, 0.08, 0.4, M.linen, 0, 0.48, 0, g)
  box(0.4, 0.42, 0.06, M.wood, 0, 0.7, -0.18, g)
  for (const lx of [-0.15, 0.15]) {
    for (const lz of [-0.15, 0.15]) {
      cyl(0.015, 0.015, 0.4, M.bronze, lx, 0.2, lz, g, 6)
    }
  }
  parent.add(g)
}

export function kitchenIsland(parent, M, x, y, z) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  // Base cabinets
  box(3.2, 0.85, 1.1, M.wood, 0, 0.45, 0, g)
  // Waterfall marble top
  box(3.35, 0.06, 1.2, M.marble, 0, 0.9, 0, g)
  box(0.06, 0.9, 1.2, M.marble, -1.645, 0.45, 0, g)
  box(0.06, 0.9, 1.2, M.marble, 1.645, 0.45, 0, g)
  // Sink hint
  box(0.55, 0.04, 0.4, M.chrome, -0.7, 0.94, 0.15, g)
  // Faucet
  cyl(0.02, 0.02, 0.28, M.chrome, -0.7, 1.1, 0.35, g, 8)
  box(0.02, 0.02, 0.2, M.chrome, -0.7, 1.22, 0.25, g)
  // Bar stools
  for (const sx of [-0.9, 0, 0.9]) {
    barStool(g, M, sx, 0, -0.95)
  }
  parent.add(g)
  return g
}

function barStool(parent, M, x, y, z) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  cyl(0.18, 0.18, 0.06, M.leather, 0, 0.7, 0, g, 16)
  cyl(0.025, 0.025, 0.65, M.bronze, 0, 0.35, 0, g, 8)
  cyl(0.2, 0.2, 0.03, M.bronze, 0, 0.04, 0, g, 16)
  parent.add(g)
}

export function kitchenRun(parent, M, x, y, z, len = 4) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(len, 0.85, 0.6, M.woodLight, 0, 0.45, 0, g)
  box(len + 0.05, 0.05, 0.65, M.marble, 0, 0.9, 0, g)
  // Upper cabinets
  box(len * 0.7, 0.7, 0.35, M.woodLight, len * 0.1, 2.4, -0.05, g)
  // Fridge block
  box(0.75, 2.1, 0.7, M.wallFeature, -len / 2 + 0.4, 1.1, 0.05, g)
  parent.add(g)
  return g
}

export function bed(parent, M, x, y, z, rot = 0) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = rot
  // Platform
  box(1.9, 0.28, 2.15, M.wood, 0, 0.2, 0, g)
  // Mattress
  box(1.8, 0.25, 2.05, M.linen, 0, 0.48, 0, g)
  // Duvet fold
  box(1.75, 0.12, 1.2, M.linen, 0, 0.65, -0.2, g)
  // Headboard upholstered
  box(1.95, 1.05, 0.12, M.velvet, 0, 0.9, 1.05, g)
  // Nightstands
  nightstand(g, M, -1.2, 0, 0.85)
  nightstand(g, M, 1.2, 0, 0.85)
  // Pillows
  box(0.55, 0.18, 0.4, M.cushion, -0.4, 0.72, 0.75, g)
  box(0.55, 0.18, 0.4, M.cushion, 0.4, 0.72, 0.75, g)
  parent.add(g)
  return g
}

function nightstand(parent, M, x, y, z) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(0.45, 0.45, 0.4, M.wood, 0, 0.3, 0, g)
  box(0.48, 0.03, 0.42, M.marble, 0, 0.54, 0, g)
  cyl(0.06, 0.08, 0.22, M.bronze, 0, 0.7, 0, g, 12) // lamp base
  cyl(0.14, 0.16, 0.18, M.linen, 0, 0.9, 0, g, 16) // shade
  parent.add(g)
}

export function desk(parent, M, x, y, z, rot = 0) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = rot
  box(1.6, 0.05, 0.7, M.woodDark, 0, 0.74, 0, g)
  box(1.5, 0.55, 0.05, M.wood, 0, 0.4, 0.3, g)
  box(0.05, 0.7, 0.6, M.wood, -0.75, 0.35, 0, g)
  box(0.05, 0.7, 0.6, M.wood, 0.75, 0.35, 0, g)
  loungeChair(g, M, 0, 0, -0.7, 0)
  parent.add(g)
  return g
}

export function bookshelf(parent, M, x, y, z, w = 2.4, h = 2.6) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(w, h, 0.35, M.wood, 0, h / 2, 0, g)
  const shelves = 5
  for (let i = 1; i < shelves; i++) {
    box(w - 0.08, 0.03, 0.32, M.woodDark, 0, (h / shelves) * i, 0.01, g)
  }
  // Book blocks
  for (let i = 0; i < 12; i++) {
    const bx = -w / 2 + 0.2 + (i % 6) * (w / 6.5)
    const by = 0.35 + Math.floor(i / 6) * 0.9
    box(0.12, 0.28 + (i % 3) * 0.05, 0.22, M.velvet, bx, by, 0.02, g)
  }
  parent.add(g)
  return g
}

export function fireplace(parent, M, x, y, z) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(2.8, 2.2, 0.35, M.wallFeature, 0, 1.15, 0, g)
  box(1.4, 0.7, 0.15, M.marbleDark, 0, 0.7, 0.12, g)
  box(1.3, 0.08, 0.4, M.marbleDark, 0, 0.35, 0.15, g) // hearth
  // Warm glow
  const flame = box(1.1, 0.35, 0.05, M.glow, 0, 0.65, 0.2, g, false)
  flame.material = M.glow
  parent.add(g)
  return g
}

export function tvConsole(parent, M, x, y, z) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(2.2, 0.45, 0.45, M.woodDark, 0, 0.3, 0, g)
  box(1.8, 1.0, 0.06, M.screen, 0, 1.3, -0.15, g)
  box(1.9, 1.1, 0.04, M.wallFeature, 0, 1.3, -0.18, g)
  parent.add(g)
  return g
}

export function lounger(parent, M, x, y, z, rot = 0) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = rot
  box(0.7, 0.12, 1.9, M.wood, 0, 0.2, 0, g)
  box(0.65, 0.08, 1.2, M.linen, 0, 0.3, -0.15, g)
  box(0.65, 0.45, 0.5, M.linen, 0, 0.5, 0.7, g) // backrest angled as block
  parent.add(g)
  return g
}

export function planter(parent, M, x, y, z) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(0.7, 0.55, 0.7, M.floorStone, 0, 0.3, 0, g)
  cyl(0.22, 0.28, 0.9, M.green, 0, 1.0, 0, g, 8)
  parent.add(g)
  return g
}

export function outdoorKitchen(parent, M, x, y, z) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  box(2.8, 0.9, 0.7, M.floorStone, 0, 0.5, 0, g)
  box(2.9, 0.05, 0.75, M.marble, 0, 0.95, 0, g)
  box(0.6, 0.08, 0.5, M.chrome, -0.6, 1.0, 0, g) // grill
  parent.add(g)
  return g
}

export function glassRail(parent, M, x0, z0, x1, z1, y) {
  const dx = x1 - x0
  const dz = z1 - z0
  const len = Math.hypot(dx, dz)
  const cx = (x0 + x1) / 2
  const cz = (z0 + z1) / 2
  const g = new THREE.Group()
  const panel = box(len, 1.05, 0.04, M.glass, 0, 0.55, 0, g, false)
  panel.material = M.glass
  box(len, 0.04, 0.06, M.bronze, 0, 1.08, 0, g)
  g.position.set(cx, y, cz)
  g.rotation.y = Math.atan2(dx, dz)
  parent.add(g)
  return g
}
