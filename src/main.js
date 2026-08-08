/**
 * Layer 1 — Shell only
 * Empty scene + camera + lights + render loop.
 * No house geometry yet.
 */
import './style.css'
import * as THREE from 'three'

const canvas = document.querySelector('#scene')

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.1

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xb8cce0)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
)
camera.position.set(12, 8, 16)
camera.lookAt(0, 0, 0)

// Minimal daylight so later layers are visible as they appear
const hemi = new THREE.HemisphereLight(0xd7e8f8, 0xc4b49a, 0.9)
scene.add(hemi)

const sun = new THREE.DirectionalLight(0xffe2b0, 1.1)
sun.position.set(20, 30, 10)
scene.add(sun)

// Origin marker — removed in later layers; proves the shell runs
const marker = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.4, 0.4),
  new THREE.MeshStandardMaterial({ color: 0xb8925a }),
)
marker.position.y = 0.2
scene.add(marker)

function animate() {
  requestAnimationFrame(animate)
  marker.rotation.y += 0.01
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
