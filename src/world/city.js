import * as THREE from 'three'

/** City sits far below so the penthouse crowns the tallest tower. */
export const CITY = {
  groundY: -180,
  towerHeight: 180,
}

/** Morning skyline — every neighbor peaks below the penthouse floor (y = 0). */
export function createCity(scene) {
  const city = new THREE.Group()
  city.name = 'city'
  scene.add(city)

  const { groundY, towerHeight } = CITY
  const maxNeighbor = towerHeight - 28 // always shorter than our crown

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(420, 64),
    new THREE.MeshStandardMaterial({ color: 0x7f9178, roughness: 0.95, metalness: 0.02 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = groundY
  ground.receiveShadow = true
  city.add(ground)

  const park = new THREE.Mesh(
    new THREE.CircleGeometry(55, 32),
    new THREE.MeshStandardMaterial({ color: 0x5f8258, roughness: 0.92 }),
  )
  park.rotation.x = -Math.PI / 2
  park.position.set(90, groundY + 0.05, 55)
  city.add(park)

  // Our tower shaft — top meets penthouse slab at y ≈ 0
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(100, towerHeight, 95),
    new THREE.MeshStandardMaterial({ color: 0xd8d2c8, roughness: 0.85, metalness: 0.08 }),
  )
  plinth.position.set(0, groundY + towerHeight / 2, -8)
  city.add(plinth)

  const shaftGlass = new THREE.Mesh(
    new THREE.BoxGeometry(98, towerHeight - 2, 93),
    new THREE.MeshStandardMaterial({
      color: 0x9eb8cc,
      roughness: 0.25,
      metalness: 0.35,
      transparent: true,
      opacity: 0.5,
    }),
  )
  shaftGlass.position.set(0, groundY + towerHeight / 2, -8)
  city.add(shaftGlass)

  const crown = new THREE.Mesh(
    new THREE.BoxGeometry(102, 2.4, 97),
    new THREE.MeshStandardMaterial({ color: 0xb8925a, roughness: 0.4, metalness: 0.55 }),
  )
  crown.position.set(0, -1.1, -8)
  city.add(crown)

  const facadeMat = new THREE.MeshStandardMaterial({ color: 0xc4cdd6, roughness: 0.7, metalness: 0.15 })
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x7a94a8,
    emissive: 0xffe0b0,
    emissiveIntensity: 0.06,
    roughness: 0.35,
    metalness: 0.2,
  })

  const rng = mulberry32(47)
  for (let i = 0; i < 85; i++) {
    const angle = rng() * Math.PI * 2
    const dist = 85 + rng() * 220
    const x = Math.cos(angle) * dist
    const z = Math.sin(angle) * dist
    if (Math.hypot(x, z) < 95) continue

    const w = 6 + rng() * 14
    const d = 6 + rng() * 14
    const h = 35 + rng() * (maxNeighbor - 35)
    const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), facadeMat)
    tower.position.set(x, groundY + h / 2, z)
    city.add(tower)

    const lit = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, h * 0.88, d * 0.9), windowMat.clone())
    lit.material.emissiveIntensity = 0.03 + rng() * 0.1
    lit.position.copy(tower.position)
    city.add(lit)
  }

  const haze = new THREE.Mesh(
    new THREE.RingGeometry(100, 320, 64),
    new THREE.MeshBasicMaterial({
      color: 0xc8d6e4,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    }),
  )
  haze.rotation.x = -Math.PI / 2
  haze.position.y = groundY + 8
  city.add(haze)

  return city
}

export function createSky(scene) {
  const skyGeo = new THREE.SphereGeometry(520, 32, 16)
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0x6eb0e0) },
      midColor: { value: new THREE.Color(0xb7d4ee) },
      bottomColor: { value: new THREE.Color(0xf2d2a8) },
      offset: { value: 28 },
      exponent: { value: 0.65 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
        vec3 col = mix(bottomColor, midColor, max(pow(max(h, 0.0), exponent), 0.0));
        col = mix(col, topColor, max(pow(max(h + 0.05, 0.0), exponent * 1.35), 0.0));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })
  const sky = new THREE.Mesh(skyGeo, skyMat)
  scene.add(sky)
  return sky
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
