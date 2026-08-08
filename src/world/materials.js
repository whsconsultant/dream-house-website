import * as THREE from 'three'

/** Shared materials for the residence. */
export function createMaterials() {
  const std = (color, roughness = 0.7, metalness = 0.04) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness })

  return {
    floor: std(0xd6d0c4, 0.32, 0.06),
    floorStone: std(0x9a968e, 0.55, 0.05),
    floorTile: std(0xd0dce4, 0.28, 0.05),
    wall: std(0xf3efe7, 0.9, 0.02),
    ceiling: std(0xfaf7f2, 0.95, 0.01),
    wood: std(0x6a4e36, 0.55, 0.05),
    woodDark: std(0x3a2a1c, 0.5, 0.06),
    bronze: std(0xa88858, 0.3, 0.65),
    marble: std(0xeeeae2, 0.22, 0.1),
    velvet: std(0x2c3542, 0.92, 0.02),
    linen: std(0xebe4d8, 0.85, 0.02),
    cushion: std(0xc2b094, 0.88, 0.02),
    leather: std(0x4a3428, 0.7, 0.08),
    green: std(0x3a5640, 0.9, 0.02),
    screen: std(0x101418, 0.35, 0.25),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xa8c4d8,
      transmission: 0.9,
      transparent: true,
      opacity: 0.18,
      roughness: 0.04,
      metalness: 0.02,
      thickness: 0.2,
      ior: 1.45,
      side: THREE.DoubleSide,
    }),
    water: new THREE.MeshPhysicalMaterial({
      color: 0x2f6f88,
      transmission: 0.48,
      transparent: true,
      opacity: 0.78,
      roughness: 0.06,
      metalness: 0.08,
      thickness: 1.1,
    }),
    waterOutdoor: new THREE.MeshPhysicalMaterial({
      color: 0x3d8599,
      transmission: 0.52,
      transparent: true,
      opacity: 0.75,
      roughness: 0.08,
      metalness: 0.06,
      thickness: 1.0,
    }),
    glow: new THREE.MeshStandardMaterial({
      color: 0xfff0d8,
      emissive: 0xffd090,
      emissiveIntensity: 0.75,
      roughness: 1,
    }),
  }
}

export function box(w, h, d, material, x, y, z, parent, opts = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = opts.cast !== false
  mesh.receiveShadow = opts.receive !== false
  parent.add(mesh)
  return mesh
}

export function cyl(rTop, rBot, h, material, x, y, z, parent, segments = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segments), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}
