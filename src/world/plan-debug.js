/**
 * Layer 2/3 — floor-plan sheets + Layer 3 kit wall preview (joined extrusions).
 */
import * as THREE from 'three'
import {
  ALL_WALLS,
  ALL_PLAN_ROOMS,
  PLAN_META,
  WATER,
  validateWallJoins,
} from './plan.js'
import { createMaterials } from './materials.js'
import { buildWallsWithOpenings, createSlab } from './build.js'

/** Preview wall height — full storey comes in later layers */
const PREVIEW_H = 0.55

export const SHEET_GAP = 0

function sheetOffsetX(_level) {
  return 0
}

function makeRoomLabel(room, y, tone = 'l1') {
  const w = room.x1 - room.x0
  const d = room.z1 - room.z0
  const m2 = Math.round(w * d)
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const fill =
    tone === 'l3'
      ? 'rgba(40, 70, 90, 0.85)'
      : tone === 'l2'
        ? 'rgba(45, 70, 50, 0.82)'
        : 'rgba(26, 36, 48, 0.78)'
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.roundRect(16, 24, 480, 112, 16)
  ctx.fill()
  ctx.fillStyle = '#f4f0e8'
  ctx.font = '600 40px "DM Sans", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(room.name, 256, 64)
  ctx.font = '500 26px "DM Sans", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(244, 240, 232, 0.78)'
  ctx.fillText(`${w.toFixed(0)}×${d.toFixed(0)} m · ${m2} m²`, 256, 108)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }),
  )
  const span = Math.min(w, d, 6)
  const scale = Math.max(2.4, Math.min(span * 0.9, 6))
  sprite.scale.set(scale, scale * (160 / 512), 1)
  sprite.position.set((room.x0 + room.x1) / 2, PREVIEW_H + 0.2, (room.z0 + room.z1) / 2)
  sprite.renderOrder = 10
  return sprite
}

function makeTitle(text, sub, x, z) {
  const canvas = document.createElement('canvas')
  canvas.width = 900
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#1a2430'
  ctx.font = '600 48px Fraunces, Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 450, 55)
  ctx.font = '500 26px "DM Sans", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(26, 36, 48, 0.7)'
  ctx.fillText(sub, 450, 110)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }),
  )
  sprite.scale.set(18, 18 * (160 / 900), 1)
  sprite.position.set(x, 0.35, z)
  sprite.renderOrder = 12
  return sprite
}

function addPlate(parent, mats, z0 = PLAN_META.envelope.z0, z1 = PLAN_META.envelope.z1) {
  const env = PLAN_META.envelope
  const slab = createSlab(env.x0, z0, env.x1, z1, 0, 0.08, mats.slab)
  if (slab) {
    slab.receiveShadow = true
    parent.add(slab)
  }
}

function addKitWalls(parent, walls, mats) {
  const group = buildWallsWithOpenings(walls, PREVIEW_H, (seg) => {
    if (seg.kind === 'glass') return mats.glass
    if (seg.kind === 'railing') return mats.railing
    if (seg.kind === 'exterior') return mats.wallExt
    return mats.wall
  })
  parent.add(group)
}

function addJoinDots(parent, walls, report) {
  const orphanSet = new Set(report.orphans.map((o) => `${o.x.toFixed(4)},${o.z.toFixed(4)}`))
  const seen = new Set()
  for (const wall of walls) {
    for (const [x, z] of [
      [wall.ax, wall.az],
      [wall.bx, wall.bz],
    ]) {
      const k = `${x.toFixed(4)},${z.toFixed(4)}`
      if (seen.has(k)) continue
      seen.add(k)
      const orphan = orphanSet.has(k)
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(orphan ? 0.12 : 0.07, 8, 8),
        new THREE.MeshBasicMaterial({ color: orphan ? 0xc47a3a : 0x3d6b4f }),
      )
      dot.position.set(x, PREVIEW_H + 0.05, z)
      parent.add(dot)
    }
  }
}

function addRooms(parent, level, tone) {
  for (const room of ALL_PLAN_ROOMS.filter((r) => r.level === level)) {
    const w = room.x1 - room.x0
    const d = room.z1 - room.z0
    if (w <= 0 || d <= 0) continue
    if (!room.outdoor) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({
          color: room.corridor ? 0xcfc8bc : room.stair ? 0xc4b8a8 : 0xe8e2d6,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        }),
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set((room.x0 + room.x1) / 2, 0.002, (room.z0 + room.z1) / 2)
      parent.add(mesh)
    } else if (!['rooftop', 'terrace', 'terrace2', 'sundeck', 'summer'].includes(room.id)) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({
          color: 0xc8d4bc,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        }),
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set((room.x0 + room.x1) / 2, 0.003, (room.z0 + room.z1) / 2)
      parent.add(mesh)
    }
    parent.add(makeRoomLabel(room, 0.06, tone))
  }
}

function buildSheet(level, title, sub, tone, mats, report) {
  const sheet = new THREE.Group()
  sheet.name = `plan-l${level}`
  sheet.position.x = sheetOffsetX(level)

  const env = PLAN_META.envelope
  if (level === 3) {
    addPlate(sheet, mats, -12, 12)
  } else {
    addPlate(sheet, mats)
    const t = PLAN_META.terrace
    const terrace = createSlab(t.x0, t.z0, t.x1, t.z1, 0, 0.06, mats.slab)
    if (terrace) {
      terrace.material = mats.slab.clone()
      terrace.material.color = new THREE.Color(0xc5d0b8)
      sheet.add(terrace)
    }
  }

  addRooms(sheet, level, tone)

  if (level === 3) {
    for (const [key, rect] of Object.entries(WATER)) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(rect.x1 - rect.x0, rect.z1 - rect.z0),
        new THREE.MeshBasicMaterial({
          color: key === 'spa' ? 0x5aa8b8 : 0x3a7ca5,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        }),
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set((rect.x0 + rect.x1) / 2, 0.05, (rect.z0 + rect.z1) / 2)
      sheet.add(mesh)
      sheet.add(
        makeRoomLabel(
          {
            name: key === 'spa' ? 'Spa' : 'Pool',
            x0: rect.x0,
            x1: rect.x1,
            z0: rect.z0,
            z1: rect.z1,
          },
          PREVIEW_H + 0.15,
          'l3',
        ),
      )
    }
  }

  const walls = ALL_WALLS.filter((w) => w.level === level)
  addKitWalls(sheet, walls, mats)
  // Join dots hidden — they made the plan read like a maze

  sheet.add(makeTitle(title, sub, (env.x0 + env.x1) / 2, env.z1 + 4))
  return sheet
}

export function createPlanDebug() {
  const root = new THREE.Group()
  root.name = 'plan-debug'
  const report = validateWallJoins()
  const mats = createMaterials()
  console.info('[plan] wall join check', report)

  const l1 = buildSheet(
    1,
    'Level 1 — Live',
    'Living · dining · kitchen open · coat · service core',
    'l1',
    mats,
    report,
  )
  const l2 = buildSheet(
    2,
    'Level 2 — Sleep',
    'Primary + sitting · 2 guests · short landing',
    'l2',
    mats,
    report,
  )
  const l3 = buildSheet(
    3,
    'Roof — Outdoors',
    'Open deck · pool · spa · summer kitchen',
    'l3',
    mats,
    report,
  )

  root.add(l1, l2, l3)

  l1.visible = true
  l2.visible = false
  l3.visible = false

  const env = PLAN_META.envelope

  return {
    root,
    report,
    mats,
    sheets: { l1, l2, l3 },
    titles: {
      l1: 'Level 1 — Living · dining · kitchen (tighter plate)',
      l2: 'Level 2 — Primary + sitting · 2 guests',
      l3: 'Roof — Pool terrace',
    },
    frame: {
      target: { x: 0, y: 0, z: (env.z0 + env.z1) / 2 },
      position: { x: 0, y: 48, z: 32 },
    },
  }
}
