/**
 * Layer 3 — Shared materials for later mesh layers.
 */
import * as THREE from 'three'

function std(color, roughness = 0.7, metalness = 0.04, extras = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    ...extras,
  })
}

/** Create the material set used by the build kit. */
export function createMaterials() {
  return {
    slab: std(0xd6d0c4, 0.45, 0.05),
    slabEdge: std(0xb8b0a4, 0.55, 0.04),
    wall: std(0xf2eee6, 0.78, 0.02),
    wallExt: std(0xe8e2d6, 0.72, 0.03),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xa8c4d8,
      roughness: 0.08,
      metalness: 0.05,
      transmission: 0.55,
      thickness: 0.12,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    }),
    railing: std(0x6a7a88, 0.35, 0.4),
    trim: std(0xb8925a, 0.4, 0.35),
    water: new THREE.MeshPhysicalMaterial({
      color: 0x3a7ca5,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.35,
      transparent: true,
      opacity: 0.7,
    }),
  }
}
