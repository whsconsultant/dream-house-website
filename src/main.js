/**
 * Layer 2 — Plan data
 * Shell + flat plan overlay (no solid house mesh).
 */
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createPlanDebug } from './world/plan-debug.js'
import { PLAN_META, validateWallJoins } from './world/plan.js'

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
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
)
camera.position.set(0, 42, 28)
camera.lookAt(0, 0, -2)

const hemi = new THREE.HemisphereLight(0xd7e8f8, 0xc4b49a, 0.95)
scene.add(hemi)

const sun = new THREE.DirectionalLight(0xffe2b0, 1.0)
sun.position.set(20, 40, 10)
scene.add(sun)

const { root, report } = createPlanDebug()
scene.add(root)

const badge = document.querySelector('.layer-badge')
if (badge) {
  badge.textContent = report.ok
    ? `Layer 2 · Plan · ${report.wallCount} walls · joins OK`
    : `Layer 2 · Plan · ${report.orphanCount} free ends`
}

const meta = document.querySelector('.plan-meta')
if (meta) {
  meta.textContent = `${PLAN_META.title} — ${PLAN_META.subtitle}`
}

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, -1)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI * 0.48
controls.minDistance = 12
controls.maxDistance = 80

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Expose for console inspection
window.__plan = { PLAN_META, validateWallJoins, report }
