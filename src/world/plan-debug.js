/**
 * Layer 2 — two separate floor-plan sheets (L1 + L2), never overlaid.
 * Laid out side-by-side like a sales brochure.
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

/** Gap between the two plan sheets (meters) */
export const SHEET_GAP = 8

function sheetOffsetX(level) {
  const env = PLAN_META.envelope
  const plateW = env.x1 - env.x0
  if (level === 1) return 0
  return plateW + SHEET_GAP
}

/** Flat plan label: name + W×D m + area */
function makeRoomLabel(room, y, tone = 'l1') {
  const w = room.x1 - room.x0
  const d = room.z1 - room.z0
  const m2 = Math.round(w * d)
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = tone === 'l2' ? 'rgba(45, 70, 50, 0.82)' : 'rgba(26, 36, 48, 0.78)'
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
  const span = Math.min(w, d, 6)
  const scale = Math.max(2.2, Math.min(span * 0.85, 5.5))
  sprite.scale.set(scale, scale * (160 / 512), 1)
  sprite.position.set((room.x0 + room.x1) / 2, y, (room.z0 + room.z1) / 2)
  sprite.renderOrder = 10
  return sprite
}

function makeTitle(text, sub, x, z) {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#1a2430'
  ctx.font = '600 52px Fraunces, Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 384, 58)
  ctx.font = '500 28px "DM Sans", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(26, 36, 48, 0.7)'
  ctx.fillText(sub, 384, 112)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }),
  )
  sprite.scale.set(14, 14 * (160 / 768), 1)
  sprite.position.set(x, 0.3, z)
  sprite.renderOrder = 12
  return sprite
}

function addPlate(parent, color) {
  const env = PLAN_META.envelope
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(env.x1 - env.x0, env.z1 - env.z0),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    }),
  )
  plate.rotation.x = -Math.PI / 2
  plate.position.set((env.x0 + env.x1) / 2, 0.001, (env.z0 + env.z1) / 2)
  parent.add(plate)
}

function addWalls(parent, walls, y = 0.05) {
  const byKind = new Map()
  for (const wall of walls) {
    if (!byKind.has(wall.kind)) byKind.set(wall.kind, [])
    byKind.get(wall.kind).push(wall.ax, y, wall.az, wall.bx, y, wall.bz)
  }
  for (const [kind, positions] of byKind) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    parent.add(
      new THREE.LineSegments(
        geo,
        new THREE.LineBasicMaterial({ color: KIND_COLOR[kind] ?? 0xffffff }),
      ),
    )
  }
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
        new THREE.SphereGeometry(orphan ? 0.12 : 0.08, 10, 10),
        new THREE.MeshBasicMaterial({ color: orphan ? 0xc47a3a : 0x3d6b4f }),
      )
      dot.position.set(x, 0.08, z)
      parent.add(dot)
    }
  }
}

function buildL1Sheet(report) {
  const sheet = new THREE.Group()
  sheet.name = 'plan-l1'
  sheet.position.x = sheetOffsetX(1)

  const env = PLAN_META.envelope
  addPlate(sheet, 0xd8d2c6)

  // L1 terrace strip north of glass
  const t = PLAN_META.terrace
  const terrace = new THREE.Mesh(
    new THREE.PlaneGeometry(t.x1 - t.x0, t.z1 - t.z0),
    new THREE.MeshBasicMaterial({
      color: 0xc5d0b8,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    }),
  )
  terrace.rotation.x = -Math.PI / 2
  terrace.position.set((t.x0 + t.x1) / 2, 0.0015, (t.z0 + t.z1) / 2)
  sheet.add(terrace)

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
          opacity: 0.4,
          side: THREE.DoubleSide,
        }),
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set((room.x0 + room.x1) / 2, 0.002, (room.z0 + room.z1) / 2)
      sheet.add(mesh)
    }
    sheet.add(makeRoomLabel(room, 0.06, 'l1'))
  }

  const walls = ALL_WALLS.filter((w) => w.level === 1)
  addWalls(sheet, walls)
  addJoinDots(sheet, walls, report)

  sheet.add(
    makeTitle(
      'Level 1 — Main living',
      `${PLAN_META.plateW} × ${PLAN_META.plateD} m plate`,
      (env.x0 + env.x1) / 2,
      env.z1 + 3.5,
    ),
  )

  return sheet
}

function buildL2Sheet(report) {
  const sheet = new THREE.Group()
  sheet.name = 'plan-l2'
  sheet.position.x = sheetOffsetX(2)

  const env = PLAN_META.envelope
  addPlate(sheet, 0xd2d8cc)

  for (const room of ALL_PLAN_ROOMS.filter((r) => r.level === 2)) {
    const w = room.x1 - room.x0
    const d = room.z1 - room.z0
    if (w <= 0 || d <= 0) continue
    if (!room.outdoor) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({
          color: room.stair ? 0xb8c4b0 : 0xe4ebe0,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        }),
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set((room.x0 + room.x1) / 2, 0.002, (room.z0 + room.z1) / 2)
      sheet.add(mesh)
    } else if (room.id !== 'rooftop') {
      // sundeck / summer as tinted zones on the deck
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
      sheet.add(mesh)
    }
    sheet.add(makeRoomLabel(room, 0.06, 'l2'))
  }

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
    mesh.position.set((rect.x0 + rect.x1) / 2, 0.01, (rect.z0 + rect.z1) / 2)
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
        0.08,
        'l2',
      ),
    )
  }

  const walls = ALL_WALLS.filter((w) => w.level === 2)
  addWalls(sheet, walls)
  addJoinDots(sheet, walls, report)

  sheet.add(
    makeTitle(
      'Level 2 — Roof terrace',
      'Pavilion · pool · spa · summer kitchen',
      (env.x0 + env.x1) / 2,
      env.z1 + 3.5,
    ),
  )

  return sheet
}

export function createPlanDebug() {
  const root = new THREE.Group()
  root.name = 'plan-debug'

  const report = validateWallJoins()
  console.info('[plan] wall join check', report)

  const l1 = buildL1Sheet(report)
  const l2 = buildL2Sheet(report)
  root.add(l1)
  root.add(l2)

  const env = PLAN_META.envelope
  const plateW = env.x1 - env.x0
  const midX = (plateW + SHEET_GAP) / 2

  return {
    root,
    report,
    sheets: { l1, l2 },
    /** Camera framing for both sheets */
    frame: {
      target: { x: midX, y: 0, z: (env.z0 + env.z1) / 2 },
      position: { x: midX, y: 55, z: 36 },
    },
  }
}
