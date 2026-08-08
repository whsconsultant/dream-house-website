import * as THREE from 'three'

/** City far below — tower crown matches the residential duplex plate (~32×26 m). */
export const CITY = {
  groundY: -140,
  towerHeight: 140,
}

export function createCity(scene) {
  const city = new THREE.Group()
  city.name = 'city'
  scene.add(city)

  const { groundY, towerHeight } = CITY
  const maxNeighbor = towerHeight - 25

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(320, 64),
    new THREE.MeshStandardMaterial({ color: 0x7f9178, roughness: 0.95 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = groundY
  ground.receiveShadow = true
  city.add(ground)

  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(34, towerHeight, 28),
    new THREE.MeshStandardMaterial({ color: 0xd8d2c8, roughness: 0.85, metalness: 0.08 }),
  )
  plinth.position.set(0, groundY + towerHeight / 2, -1)
  city.add(plinth)

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(33, towerHeight - 2, 27),
    new THREE.MeshStandardMaterial({
      color: 0x9eb8cc,
      roughness: 0.25,
      metalness: 0.35,
      transparent: true,
      opacity: 0.45,
    }),
  )
  glass.position.set(0, groundY + towerHeight / 2, -1)
  city.add(glass)

  const crown = new THREE.Mesh(
    new THREE.BoxGeometry(35, 1.6, 29),
    new THREE.MeshStandardMaterial({ color: 0xb8925a, roughness: 0.4, metalness: 0.55 }),
  )
  crown.position.set(0, -0.7, -1)
  city.add(crown)

  const facade = new THREE.MeshStandardMaterial({ color: 0xc4cdd6, roughness: 0.7, metalness: 0.12 })
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x7a94a8,
    emissive: 0xffe0b0,
    emissiveIntensity: 0.05,
    roughness: 0.35,
    metalness: 0.2,
  })

  const rng = mulberry32(47)
  for (let i = 0; i < 70; i++) {
    const angle = rng() * Math.PI * 2
    const dist = 45 + rng() * 180
    const x = Math.cos(angle) * dist
    const z = Math.sin(angle) * dist
    if (Math.hypot(x, z) < 40) continue
    const w = 5 + rng() * 12
    const d = 5 + rng() * 12
    const h = 30 + rng() * (maxNeighbor - 30)
    const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), facade)
    tower.position.set(x, groundY + h / 2, z)
    city.add(tower)
    const lit = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, h * 0.88, d * 0.9), windowMat.clone())
    lit.material.emissiveIntensity = 0.03 + rng() * 0.08
    lit.position.copy(tower.position)
    city.add(lit)
  }

  return city
}

export function createSky(scene) {
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(400, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x6eb0e0) },
        midColor: { value: new THREE.Color(0xb7d4ee) },
        bottomColor: { value: new THREE.Color(0xf2d2a8) },
        offset: { value: 24 },
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
    }),
  )
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
