/**
 * Layer 2 — Plan data
 * Two separate floor-plan sheets (L1 + L2), side by side.
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
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  300,
)

const hemi = new THREE.HemisphereLight(0xd7e8f8, 0xc4b49a, 0.95)
scene.add(hemi)

const sun = new THREE.DirectionalLight(0xffe2b0, 1.0)
sun.position.set(20, 40, 10)
scene.add(sun)

const { root, report, sheets, frame } = createPlanDebug()
scene.add(root)

camera.position.set(frame.position.x, frame.position.y, frame.position.z)
camera.lookAt(frame.target.x, frame.target.y, frame.target.z)

const badge = document.querySelector('.layer-badge')
if (badge) {
  badge.textContent = report.ok
    ? `Layer 2 · Two plans · ${report.wallCount} walls · joins OK`
    : `Layer 2 · Two plans · ${report.orphanCount} free ends`
}

const meta = document.querySelector('.plan-meta')
if (meta) {
  meta.textContent = `${PLAN_META.title} — Level 1 (left) · Level 2 roof (right)`
}

const controls = new OrbitControls(camera, canvas)
controls.target.set(frame.target.x, frame.target.y, frame.target.z)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI * 0.48
controls.minDistance = 18
controls.maxDistance = 120

/** Focus one sheet or both */
function focusSheet(which) {
  sheets.l1.visible = which === 'both' || which === 'l1'
  sheets.l2.visible = which === 'both' || which === 'l2'
  const env = PLAN_META.envelope
  if (which === 'l1') {
    controls.target.set(0, 0, (env.z0 + env.z1) / 2)
    camera.position.set(0, 42, 28)
  } else if (which === 'l2') {
    const x = sheets.l2.position.x
    controls.target.set(x, 0, (env.z0 + env.z1) / 2)
    camera.position.set(x, 42, 28)
  } else {
    controls.target.set(frame.target.x, frame.target.y, frame.target.z)
    camera.position.set(frame.position.x, frame.position.y, frame.position.z)
  }
  controls.update()
}

document.querySelectorAll('[data-plan]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-plan]').forEach((b) => b.classList.remove('is-active'))
    btn.classList.add('is-active')
    focusSheet(btn.dataset.plan)
  })
})

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

window.__plan = { PLAN_META, validateWallJoins, report, focusSheet }
