/**
 * Layer 2 — flat plan debug draw (no solid house).
 * Reads plan wall centerlines and paints them on the ground plane.
 */
import * as THREE from 'three'
import {
  ALL_WALLS,
  ALL_PLAN_ROOMS,
  PLAN_META,
  WATER,
  validateWallJoins,
} from './plan.js'

const KIND_COLOR = {
  exterior: 0x1a2430,
  glass: 0x3a7ca5,
  interior: 0xb8925a,
  railing: 0x6a7a88,
}

/** Flat plan label: name + W×D m + area */
function makeRoomLabel(room, y, l2 = false) {
  const w = room.x1 - room.x0
  const d = room.z1 - room.z0
  const m2 = Math.round(w * d)
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = l2 ? 'rgba(45, 70, 50, 0.82)' : 'rgba(26, 36, 48, 0.78)'
  ctx.beginPath()
  ctx.roundRect(16, 24, 480, 112, 16)
  ctx.fill()
  ctx.fillStyle = '#f4f0e8'
  ctx.font = '600 44px "DM Sans", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(room.name, 256, 64)
  ctx.font = '500 28px "DM Sans", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(244, 240, 232, 0.78)'
  ctx.fillText(`${w.toFixed(0)}×${d.toFixed(0)} m · ${m2} m²`, 256, 108)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }),
  )
  // Scale sprite so small rooms stay readable without covering neighbors
  const span = Math.min(w, d, 6)
  const scale = Math.max(2.2, Math.min(span * 0.85, 5.5))
  sprite.scale.set(scale, scale * (160 / 512), 1)
  sprite.position.set((room.x0 + room.x1) / 2, y, (room.z0 + room.z1) / 2)
  sprite.renderOrder = 10
  return sprite
}

export function createPlanDebug() {
  const root = new THREE.Group()
  root.name = 'plan-debug'

  const report = validateWallJoins()
  console.info('[plan] wall join check', report)

  // Floor plate outline
  const env = PLAN_META.envelope
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(env.x1 - env.x0, env.z1 - env.z0),
    new THREE.MeshBasicMaterial({
      color: 0xd8d2c6,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    }),
  )
  plate.rotation.x = -Math.PI / 2
  plate.position.set((env.x0 + env.x1) / 2, 0.001, (env.z0 + env.z1) / 2)
  root.add(plate)

  // Room fills (L1 only, very faint) + name labels
  for (const room of ALL_PLAN_ROOMS.filter((r) => r.level === 1)) {
    const w = room.x1 - room.x0
    const d = room.z1 - room.z0
    if (w <= 0 || d <= 0) continue
    if (!room.outdoor) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({
          color: room.corridor ? 0xcfc8bc : room.stair ? 0xc4b8a8 : 0xe8e2d6,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        }),
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set((room.x0 + room.x1) / 2, 0.002, (room.z0 + room.z1) / 2)
      root.add(mesh)
    }
    root.add(makeRoomLabel(room, 0.06))
  }

  // L2 room labels (slightly higher so they don't collide with L1)
  for (const room of ALL_PLAN_ROOMS.filter((r) => r.level === 2)) {
    root.add(makeRoomLabel(room, 0.18, true))
  }

  // Wall centerlines
  const byKind = new Map()
  for (const wall of ALL_WALLS.filter((w) => w.level === 1 || w.kind === 'railing')) {
    if (!byKind.has(wall.kind)) byKind.set(wall.kind, [])
    byKind.get(wall.kind).push(wall.ax, 0.05, wall.az, wall.bx, 0.05, wall.bz)
  }

  for (const [kind, positions] of byKind) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const line = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({
        color: KIND_COLOR[kind] ?? 0xffffff,
        linewidth: 1,
      }),
    )
    line.name = `walls-${kind}`
    root.add(line)
  }

  // L2 walls elevated slightly so both levels readable in plan view
  {
    const positions = []
    for (const wall of ALL_WALLS.filter((w) => w.level === 2 && w.kind !== 'railing')) {
      positions.push(wall.ax, 0.12, wall.az, wall.bx, 0.12, wall.bz)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    root.add(
      new THREE.LineSegments(
        geo,
        new THREE.LineBasicMaterial({ color: 0x5a6a4a }),
      ),
    )
  }

  // Water footprints
  for (const [key, rect] of Object.entries(WATER)) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(rect.x1 - rect.x0, rect.z1 - rect.z0),
      new THREE.MeshBasicMaterial({
        color: key === 'spa' ? 0x5aa8b8 : 0x3a7ca5,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      }),
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set((rect.x0 + rect.x1) / 2, 0.01, (rect.z0 + rect.z1) / 2)
    root.add(mesh)
  }

  // Pool / spa labels
  for (const [key, rect] of Object.entries(WATER)) {
    root.add(
      makeRoomLabel(
        {
          name: key === 'spa' ? 'Spa' : 'Pool',
          x0: rect.x0,
          x1: rect.x1,
          z0: rect.z0,
          z1: rect.z1,
        },
        0.2,
        true,
      ),
    )
  }

  // Join dots — green if shared, amber if orphan
  const orphanSet = new Set(report.orphans.map((o) => `${o.x.toFixed(4)},${o.z.toFixed(4)}`))
  const seen = new Set()
  for (const wall of ALL_WALLS) {
    for (const [x, z] of [
      [wall.ax, wall.az],
      [wall.bx, wall.bz],
    ]) {
      const k = `${x.toFixed(4)},${z.toFixed(4)}`
      if (seen.has(k)) continue
      seen.add(k)
      const orphan = orphanSet.has(k)
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(orphan ? 0.12 : 0.08, 10, 10),
        new THREE.MeshBasicMaterial({ color: orphan ? 0xc47a3a : 0x3d6b4f }),
      )
      dot.position.set(x, 0.08, z)
      root.add(dot)
    }
  }

  return { root, report }
}
