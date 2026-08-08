/**
 * Layer 3 — Build kit
 *
 * Extrudes plan centerlines into joined wall meshes and axis-aligned slabs.
 * Corners / T-junctions meet by extending each segment by half thickness
 * at shared endpoints (no corner gaps).
 */
import * as THREE from 'three'
import { LEVEL } from './plan.js'

const EPS = 1e-4

function key(x, z) {
  return `${x.toFixed(4)},${z.toFixed(4)}`
}

/**
 * Map each endpoint → wall ids that meet there (for join extension).
 */
export function buildJointIndex(walls) {
  const joints = new Map()
  for (const w of walls) {
    for (const [x, z] of [
      [w.ax, w.az],
      [w.bx, w.bz],
    ]) {
      const k = key(x, z)
      if (!joints.has(k)) joints.set(k, [])
      joints.get(k).push(w.id)
    }
  }
  return joints
}

/**
 * Wall mesh from centerline A→B.
 * Extends half-thickness past joined ends so boxes meet cleanly.
 */
export function createWallMesh(seg, height, material, joints = null) {
  const dx = seg.bx - seg.ax
  const dz = seg.bz - seg.az
  const len = Math.hypot(dx, dz)
  if (len < EPS) return null

  const thickness = seg.thickness ?? LEVEL.wallT
  const ux = dx / len
  const uz = dz / len

  const joinA = joints ? (joints.get(key(seg.ax, seg.az))?.length ?? 1) >= 2 : true
  const joinB = joints ? (joints.get(key(seg.bx, seg.bz))?.length ?? 1) >= 2 : true
  // Free ends (railings, stubs) — do not over-extend
  const freeA = seg.freeEnd === 'a' || seg.freeEnd === 'both'
  const freeB = seg.freeEnd === 'b' || seg.freeEnd === 'both'
  const extA = joinA && !freeA ? thickness / 2 : 0
  const extB = joinB && !freeB ? thickness / 2 : 0

  const total = len + extA + extB
  const cx = (seg.ax + seg.bx) / 2 + ((extB - extA) / 2) * ux
  const cz = (seg.az + seg.bz) / 2 + ((extB - extA) / 2) * uz

  // Length along local X; yaw so +X follows plan direction (dx, dz)
  const geo = new THREE.BoxGeometry(total, height, thickness)
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.set(cx, height / 2, cz)
  mesh.rotation.y = Math.atan2(-dz, dx)

  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.userData.wallId = seg.id
  mesh.userData.kind = seg.kind
  return mesh
}

/**
 * Axis-aligned slab (floor / ceiling / terrace).
 * x0..x1, z0..z1 in plan; yTop = top surface elevation.
 */
export function createSlab(x0, z0, x1, z1, yTop, thickness, material) {
  const w = x1 - x0
  const d = z1 - z0
  if (w <= EPS || d <= EPS) return null
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, thickness, d), material)
  mesh.position.set((x0 + x1) / 2, yTop - thickness / 2, (z0 + z1) / 2)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

/**
 * Build all wall meshes for a list of plan segments.
 */
export function buildWallGroup(walls, height, materialFor, y0 = 0) {
  const group = new THREE.Group()
  group.name = 'walls'
  const joints = buildJointIndex(walls)

  for (const seg of walls) {
    const mat = materialFor(seg)
    const mesh = createWallMesh(seg, height, mat, joints)
    if (!mesh) continue
    mesh.position.y += y0
    group.add(mesh)
  }
  return group
}

/**
 * Cut wall length for door/opening placeholders (simple gap).
 * Returns array of sub-segments with no openings, for later layers.
 */
export function subtractOpenings(seg) {
  if (!seg.openings?.length) return [seg]
  const dx = seg.bx - seg.ax
  const dz = seg.bz - seg.az
  const len = Math.hypot(dx, dz)
  if (len < EPS) return [seg]
  const ux = dx / len
  const uz = dz / len

  const cuts = [...seg.openings]
    .map((o) => ({
      a: Math.max(0, o.t - o.width / 2),
      b: Math.min(len, o.t + o.width / 2),
    }))
    .filter((c) => c.b > c.a + EPS)
    .sort((a, b) => a.a - b.a)

  const parts = []
  let cursor = 0
  let i = 0
  for (const c of cuts) {
    if (c.a > cursor + EPS) {
      parts.push({
        ...seg,
        id: `${seg.id}_p${i++}`,
        ax: seg.ax + ux * cursor,
        az: seg.az + uz * cursor,
        bx: seg.ax + ux * c.a,
        bz: seg.az + uz * c.a,
        openings: undefined,
      })
    }
    cursor = Math.max(cursor, c.b)
  }
  if (cursor < len - EPS) {
    parts.push({
      ...seg,
      id: `${seg.id}_p${i++}`,
      ax: seg.ax + ux * cursor,
      az: seg.az + uz * cursor,
      bx: seg.bx,
      bz: seg.bz,
      openings: undefined,
    })
  }
  return parts.length ? parts : [seg]
}

export function buildWallsWithOpenings(walls, height, materialFor, y0 = 0) {
  const solid = walls.flatMap(subtractOpenings)
  return buildWallGroup(solid, height, materialFor, y0)
}

/** Smoke-test: L-corner that must share a vertex with no gap. */
export function createJoinDemo(materials) {
  const g = new THREE.Group()
  g.name = 'kit-join-demo'
  const segs = [
    { id: 'demo-a', ax: 0, az: 0, bx: 3, bz: 0, thickness: 0.25, kind: 'exterior' },
    { id: 'demo-b', ax: 3, az: 0, bx: 3, bz: 3, thickness: 0.25, kind: 'exterior' },
    { id: 'demo-t', ax: 1.5, az: 0, bx: 1.5, bz: 2, thickness: 0.2, kind: 'interior' },
  ]
  const slab = createSlab(-0.4, -0.4, 3.4, 3.4, 0, LEVEL.slab, materials.slab)
  if (slab) g.add(slab)
  g.add(
    buildWallGroup(segs, 1.2, (s) => (s.kind === 'interior' ? materials.wall : materials.wallExt)),
  )
  g.position.set(0, 0, 0)
  g.visible = false // available for debug; plan sheets use the kit instead
  return g
}
