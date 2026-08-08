/**
 * Layer 2 — Combined full-floor house (UPH A+B as one)
 * Three separate floor-plan sheets.
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
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  400,
)

scene.add(new THREE.HemisphereLight(0xd7e8f8, 0xc4b49a, 0.95))
const sun = new THREE.DirectionalLight(0xffe2b0, 1.0)
sun.position.set(30, 50, 20)
scene.add(sun)

const { root, report, sheets, frame } = createPlanDebug()
scene.add(root)

camera.position.set(frame.position.x, frame.position.y, frame.position.z)
camera.lookAt(frame.target.x, frame.target.y, frame.target.z)

const badge = document.querySelector('.layer-badge')
if (badge) {
  badge.textContent = report.ok
    ? `Layer 2 · A+B one house · ${report.wallCount} walls · joins OK`
    : `Layer 2 · ${report.orphanCount} free ends`
}

const meta = document.querySelector('.plan-meta')
if (meta) {
  meta.textContent = `${PLAN_META.title} — ${PLAN_META.subtitle}`
}

const controls = new OrbitControls(camera, canvas)
controls.target.set(frame.target.x, frame.target.y, frame.target.z)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI * 0.48
controls.minDistance = 20
controls.maxDistance = 160

function focusSheet(which) {
  sheets.l1.visible = which === 'both' || which === 'l1'
  sheets.l2.visible = which === 'both' || which === 'l2'
  sheets.l3.visible = which === 'both' || which === 'l3'
  const env = PLAN_META.envelope
  const cz = (env.z0 + env.z1) / 2
  if (which === 'l1') {
    controls.target.set(sheets.l1.position.x, 0, cz)
    camera.position.set(sheets.l1.position.x, 55, 36)
  } else if (which === 'l2') {
    controls.target.set(sheets.l2.position.x, 0, cz)
    camera.position.set(sheets.l2.position.x, 55, 36)
  } else if (which === 'l3') {
    controls.target.set(sheets.l3.position.x, 0, cz)
    camera.position.set(sheets.l3.position.x, 55, 36)
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
