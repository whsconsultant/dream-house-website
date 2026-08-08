import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createPenthouse, ROOMS } from './world/penthouse.js'
import { createCity, createSky } from './world/city.js'

const canvas = document.querySelector('#scene')
const landing = document.querySelector('#landing')
const enterBtn = document.querySelector('#enter-btn')
const orbitBtn = document.querySelector('#orbit-btn')
const hud = document.querySelector('#hud')
const roomLabel = document.querySelector('#room-label')
const roomNav = document.querySelector('#room-nav')
const crosshair = document.querySelector('#crosshair')
const modeBtn = document.querySelector('#mode-btn')

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x0a1018, 0.0045)

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 500)
camera.position.set(0, 1.65, 18)

createSky(scene)
createCity(scene)
createPenthouse(scene)

// Hemisphere + moon key light for dusk city
const hemi = new THREE.HemisphereLight(0x9eb6d8, 0x2a1e14, 0.55)
scene.add(hemi)

const moon = new THREE.DirectionalLight(0xc8d6ff, 0.65)
moon.position.set(-40, 60, 20)
moon.castShadow = true
moon.shadow.mapSize.set(2048, 2048)
moon.shadow.camera.near = 10
moon.shadow.camera.far = 160
moon.shadow.camera.left = -60
moon.shadow.camera.right = 60
moon.shadow.camera.top = 60
moon.shadow.camera.bottom = -60
scene.add(moon)

const sunGlow = new THREE.DirectionalLight(0xffb070, 0.35)
sunGlow.position.set(30, 18, -50)
scene.add(sunGlow)

// Controls
const walkControls = new PointerLockControls(camera, canvas)
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true
orbitControls.dampingFactor = 0.06
orbitControls.maxPolarAngle = Math.PI * 0.49
orbitControls.minDistance = 8
orbitControls.maxDistance = 90
orbitControls.target.set(0, 1.5, -2)
orbitControls.enabled = false

let mode = 'orbit' // 'walk' | 'orbit'
let started = false
let currentRoom = 0

const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
const keys = { forward: false, back: false, left: false, right: false }
const clock = new THREE.Clock()

const bounds = {
  minX: -22.5,
  maxX: 22.5,
  minZ: -31,
  maxZ: 17,
}

function buildRoomNav() {
  roomNav.innerHTML = ''
  ROOMS.forEach((room, i) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = room.name
    btn.dataset.index = String(i)
    if (i === currentRoom) btn.classList.add('is-active')
    btn.addEventListener('click', () => goToRoom(i))
    roomNav.appendChild(btn)
  })
}

function setRoomLabel(name) {
  roomLabel.classList.remove('is-on')
  roomLabel.textContent = name
  requestAnimationFrame(() => roomLabel.classList.add('is-on'))
}

function goToRoom(index) {
  currentRoom = (index + ROOMS.length) % ROOMS.length
  const room = ROOMS[currentRoom]
  camera.position.copy(room.position)
  if (mode === 'orbit') {
    orbitControls.target.copy(room.lookAt)
    orbitControls.update()
  } else {
    camera.lookAt(room.lookAt)
  }
  setRoomLabel(room.name)
  ;[...roomNav.children].forEach((el, i) => {
    el.classList.toggle('is-active', i === currentRoom)
  })
}

function nearestRoomIndex() {
  let best = 0
  let bestDist = Infinity
  ROOMS.forEach((room, i) => {
    const d = camera.position.distanceTo(room.position)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  })
  return best
}

function enterExperience(preferredMode) {
  if (!started) {
    started = true
    landing.classList.add('is-gone')
    setTimeout(() => {
      landing.classList.add('is-hidden')
    }, 1100)
    hud.classList.remove('is-hidden')
    hud.setAttribute('aria-hidden', 'false')
    buildRoomNav()
    setRoomLabel(ROOMS[0].name)
  }
  setMode(preferredMode)
}

function setMode(next) {
  mode = next
  if (mode === 'walk') {
    orbitControls.enabled = false
    modeBtn.textContent = 'Orbit'
    crosshair.classList.remove('is-hidden')
    walkControls.lock()
  } else {
    walkControls.unlock()
    orbitControls.enabled = true
    modeBtn.textContent = 'Walk'
    crosshair.classList.add('is-hidden')
    canvas.classList.remove('is-locked')
    // Pull camera out for a cinematic orbit if too close
    if (camera.position.y < 3) {
      camera.position.set(22, 14, 28)
      orbitControls.target.set(0, 1.2, -4)
    }
  }
}

enterBtn.addEventListener('click', () => enterExperience('walk'))
orbitBtn.addEventListener('click', () => enterExperience('orbit'))
modeBtn.addEventListener('click', () => {
  setMode(mode === 'walk' ? 'orbit' : 'walk')
})

landing.addEventListener('click', (e) => {
  if (e.target.closest('button')) return
})

walkControls.addEventListener('lock', () => {
  canvas.classList.add('is-locked')
})
walkControls.addEventListener('unlock', () => {
  canvas.classList.remove('is-locked')
  if (mode === 'walk' && started) {
    // Stay in walk mode but unlocked until click
  }
})

canvas.addEventListener('click', () => {
  if (!started) {
    enterExperience('orbit')
    return
  }
  if (mode === 'walk' && !walkControls.isLocked) {
    walkControls.lock()
  }
})

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp':
      keys.forward = true
      break
    case 'KeyS':
    case 'ArrowDown':
      keys.back = true
      break
    case 'KeyA':
    case 'ArrowLeft':
      keys.left = true
      break
    case 'KeyD':
    case 'ArrowRight':
      keys.right = true
      break
    case 'KeyE':
      if (started) goToRoom(currentRoom + 1)
      break
    case 'KeyQ':
      if (started) goToRoom(currentRoom - 1)
      break
  }
})

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp':
      keys.forward = false
      break
    case 'KeyS':
    case 'ArrowDown':
      keys.back = false
      break
    case 'KeyA':
    case 'ArrowLeft':
      keys.left = false
      break
    case 'KeyD':
    case 'ArrowRight':
      keys.right = false
      break
  }
})

function updateWalk(delta) {
  const speed = 12
  velocity.x -= velocity.x * 8.0 * delta
  velocity.z -= velocity.z * 8.0 * delta

  direction.z = Number(keys.forward) - Number(keys.back)
  direction.x = Number(keys.right) - Number(keys.left)
  direction.normalize()

  if (keys.forward || keys.back) velocity.z -= direction.z * speed * delta
  if (keys.left || keys.right) velocity.x -= direction.x * speed * delta

  walkControls.moveRight(-velocity.x * delta)
  walkControls.moveForward(-velocity.z * delta)

  camera.position.y = 1.65
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.minX, bounds.maxX)
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, bounds.minZ, bounds.maxZ)

  const near = nearestRoomIndex()
  if (near !== currentRoom && camera.position.distanceTo(ROOMS[near].position) < 5.5) {
    currentRoom = near
    setRoomLabel(ROOMS[currentRoom].name)
    ;[...roomNav.children].forEach((el, i) => {
      el.classList.toggle('is-active', i === currentRoom)
    })
  }
}

// Idle cinematic before enter
camera.position.set(26, 12, 32)
camera.lookAt(0, 2, -4)
orbitControls.target.set(0, 2, -4)
orbitControls.enabled = true
mode = 'orbit'

let idleAngle = 0.35

function animate() {
  requestAnimationFrame(animate)
  const delta = Math.min(clock.getDelta(), 0.05)

  if (!started) {
    idleAngle += delta * 0.08
    camera.position.x = Math.cos(idleAngle) * 34
    camera.position.z = Math.sin(idleAngle) * 34
    camera.position.y = 11 + Math.sin(idleAngle * 0.7) * 1.5
    orbitControls.target.set(0, 2, -4)
    orbitControls.update()
  } else if (mode === 'walk' && walkControls.isLocked) {
    updateWalk(delta)
  } else if (mode === 'orbit') {
    orbitControls.update()
  }

  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
