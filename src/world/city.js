import * as THREE from 'three'

/** Night skyline + ground plane around the tower. */
export function createCity(scene) {
  const city = new THREE.Group()
  city.name = 'city'
  scene.add(city)

  // Distant ground
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(220, 64),
    new THREE.MeshStandardMaterial({ color: 0x0b1016, roughness: 0.95, metalness: 0.05 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.4
  ground.receiveShadow = true
  city.add(ground)

  // Tower plinth under penthouse
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(50, 40, 38),
    new THREE.MeshStandardMaterial({ color: 0x1a222c, roughness: 0.85, metalness: 0.15 }),
  )
  plinth.position.set(0, -20.2, 0)
  city.add(plinth)

  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x1c2838,
    emissive: 0xffb56a,
    emissiveIntensity: 0.55,
    roughness: 0.4,
  })
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x121820, roughness: 0.9 })

  // Surrounding towers
  const rng = mulberry32(47)
  for (let i = 0; i < 55; i++) {
    const angle = rng() * Math.PI * 2
    const dist = 55 + rng() * 140
    const x = Math.cos(angle) * dist
    const z = Math.sin(angle) * dist
    if (Math.hypot(x, z) < 48) continue

    const w = 4 + rng() * 10
    const d = 4 + rng() * 10
    const h = 18 + rng() * 70
    const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), darkMat)
    tower.position.set(x, h / 2 - 0.4, z)
    city.add(tower)

    // Lit window strips
    const lit = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.92, h * 0.9, d * 0.92),
      windowMat.clone(),
    )
    lit.material.emissiveIntensity = 0.25 + rng() * 0.7
    lit.position.copy(tower.position)
    city.add(lit)
  }

  // Horizon haze ring
  const haze = new THREE.Mesh(
    new THREE.RingGeometry(80, 200, 64),
    new THREE.MeshBasicMaterial({
      color: 0x1a2840,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    }),
  )
  haze.rotation.x = -Math.PI / 2
  haze.position.y = 0.5
  city.add(haze)

  return city
}

export function createSky(scene) {
  const skyGeo = new THREE.SphereGeometry(400, 32, 16)
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0x050814) },
      midColor: { value: new THREE.Color(0x1a2238) },
      bottomColor: { value: new THREE.Color(0x3a2a22) },
      offset: { value: 40 },
      exponent: { value: 0.55 },
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
        col = mix(col, topColor, max(pow(max(h + 0.15, 0.0), exponent * 1.4), 0.0));
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
