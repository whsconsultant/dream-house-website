import * as THREE from 'three'
import { LEVEL, ALL_PLAN_ROOMS } from './floorplan-data.js'

export { LEVEL } from './floorplan-data.js'

/** Build 3D teleport targets from the architectural floor plan. */
export const ROOMS = ALL_PLAN_ROOMS.map((room) => {
  const cx = (room.x0 + room.x1) / 2
  const cz = (room.z0 + room.z1) / 2
  const eyeY = room.level === 2 ? LEVEL.L2 + 1.6 : 1.6
  let lookAt
  if (room.id === 'terrace' || room.id === 'living' || room.id === 'overlook') {
    lookAt = new THREE.Vector3(cx, room.level === 2 ? 1.5 : eyeY, cz - 12)
  } else if (room.id === 'stairs') {
    lookAt = new THREE.Vector3(cx, LEVEL.L2, cz - 6)
  } else {
    lookAt = new THREE.Vector3(cx, eyeY, cz - 4)
  }
  return {
    id: room.id,
    name: room.name,
    level: room.level,
    bounds: room,
    position: new THREE.Vector3(cx, eyeY, cz),
    lookAt,
  }
})
