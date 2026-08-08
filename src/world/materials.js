import * as THREE from 'three'

/** Materials for morning residential interiors (stone, oak, linen, glass). */
export function createMaterials() {
  const std = (color, roughness = 0.65, metalness = 0.04) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness })

  return {
    floorOak: std(0xc4a882, 0.45, 0.05),
    floorStone: std(0xd8d2c8, 0.35, 0.06),
    floorRoof: std(0xb0aaa0, 0.55, 0.04),
    wall: std(0xf5f2eb, 0.88, 0.02),
    wallFeature: std(0x2a2e34, 0.55, 0.08),
    ceiling: std(0xfaf8f4, 0.95, 0.01),
    wood: std(0x6b5138, 0.5, 0.05),
    woodLight: std(0xa88860, 0.55, 0.04),
    woodDark: std(0x3a2a1c, 0.48, 0.06),
    marble: std(0xeeeae2, 0.22, 0.12),
    marbleDark: std(0x1a1c20, 0.28, 0.15),
    bronze: std(0x9a7a52, 0.32, 0.62),
    chrome: std(0xc8d0d8, 0.2, 0.85),
    velvet: std(0x3a4554, 0.9, 0.02),
    linen: std(0xe8e0d4, 0.82, 0.02),
    leather: std(0x4a3428, 0.65, 0.08),
    cushion: std(0xbca890, 0.85, 0.02),
    fabric: std(0x8a9098, 0.88, 0.02),
    green: std(0x3d5644, 0.9, 0.02),
    tile: std(0xd4dde4, 0.3, 0.05),
    screen: std(0x0e1216, 0.35, 0.3),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xb8d0e0,
      transmission: 0.92,
      transparent: true,
      opacity: 0.15,
      roughness: 0.03,
      metalness: 0.02,
      thickness: 0.15,
      ior: 1.45,
      side: THREE.DoubleSide,
    }),
    water: new THREE.MeshPhysicalMaterial({
      color: 0x2f6f88,
      transmission: 0.5,
      transparent: true,
      opacity: 0.78,
      roughness: 0.05,
      metalness: 0.08,
      thickness: 1.0,
    }),
    glow: new THREE.MeshStandardMaterial({
      color: 0xfff0d8,
      emissive: 0xffd090,
      emissiveIntensity: 0.9,
      roughness: 1,
    }),
  }
}

export function box(w, h, d, mat, x, y, z, parent, cast = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.castShadow = cast
  m.receiveShadow = true
  parent.add(m)
  return m
}

export function cyl(rt, rb, h, mat, x, y, z, parent, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  parent.add(m)
  return m
}
