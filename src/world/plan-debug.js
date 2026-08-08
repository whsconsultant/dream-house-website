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

  // Room fills (L1 only, very faint)
  for (const room of ALL_PLAN_ROOMS.filter((r) => r.level === 1 && !r.outdoor)) {
    const w = room.x1 - room.x0
    const d = room.z1 - room.z0
    if (w <= 0 || d <= 0) continue
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
