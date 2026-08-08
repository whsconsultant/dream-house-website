/**
 * Layer 3 — Build kit
 * Materials + joined wall/slab helpers; low wall preview on each floor plan.
 */
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createPlanDebug } from './world/plan-debug.js'
import { PLAN_META, validateWallJoins } from './world/plan.js'
import * as Build from './world/build.js'
import { createMaterials } from './world/materials.js'

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
renderer.shadowMap.enabled = true

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xb8cce0)

const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  400,
)

scene.add(new THREE.HemisphereLight(0xd7e8f8, 0xc4b49a, 0.95))
const sun = new THREE.DirectionalLight(0xffe2b0, 1.15)
sun.position.set(30, 50, 20)
sun.castShadow = true
scene.add(sun)

const { root, report, sheets, titles, frame, mats } = createPlanDebug()
scene.add(root)

const badge = document.querySelector('.layer-badge')
if (badge) {
  badge.textContent = report.ok
    ? `Layer 3 · Build kit · joined walls`
    : `Layer 3 · ${report.orphanCount} free ends`
}

const meta = document.querySelector('.plan-meta')

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI * 0.48
controls.minDistance = 18
controls.maxDistance = 100

function showFloor(which) {
  sheets.l1.visible = which === 'l1'
  sheets.l2.visible = which === 'l2'
  sheets.l3.visible = which === 'l3'

  controls.target.set(frame.target.x, frame.target.y, frame.target.z)
  camera.position.set(frame.position.x, frame.position.y, frame.position.z)
  controls.update()

  if (meta) {
    meta.textContent = `${PLAN_META.title} — ${titles[which]}`
  }
}

showFloor('l1')

document.querySelectorAll('[data-plan]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-plan]').forEach((b) => b.classList.remove('is-active'))
    btn.classList.add('is-active')
    showFloor(btn.dataset.plan)
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

window.__plan = { PLAN_META, validateWallJoins, report, showFloor, Build, mats, createMaterials }
