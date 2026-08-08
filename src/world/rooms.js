import * as THREE from 'three'
import { LEVEL, ALL_PLAN_ROOMS } from './floorplan-data.js'

export { LEVEL }

/** Teleport targets from plan — skip tiny service rooms in the HUD list. */
const SKIP = new Set(['powder', 'powder2', 'pantry', 'gallery', 'stairs2', 'dressing', 'mbath'])

export const ROOMS = ALL_PLAN_ROOMS.filter((r) => !SKIP.has(r.id)).map((room) => {
  const cx = (room.x0 + room.x1) / 2
  const cz = (room.z0 + room.z1) / 2
  const eyeY = room.level === 2 ? LEVEL.L2 + 1.55 : 1.55
  let lookAt
  if (room.id === 'living' || room.id === 'terrace-l1' || room.id === 'rooftop' || room.id === 'sundeck') {
    lookAt = new THREE.Vector3(cx, eyeY, cz - 6)
  } else if (room.id === 'stairs') {
    lookAt = new THREE.Vector3(cx, LEVEL.L2, cz - 3)
  } else if (room.id === 'pavilion') {
    lookAt = new THREE.Vector3(cx, eyeY, cz - 4)
  } else {
    lookAt = new THREE.Vector3(cx + (cx < 0 ? 2 : -2), eyeY, cz)
  }
  return {
    id: room.id,
    name: room.name,
    level: room.level,
    bounds: room,
    position: new THREE.Vector3(
      THREE.MathUtils.clamp(cx, room.x0 + 0.8, room.x1 - 0.8),
      eyeY,
      THREE.MathUtils.clamp(cz, room.z0 + 0.8, room.z1 - 0.8),
    ),
    lookAt,
  }
})
