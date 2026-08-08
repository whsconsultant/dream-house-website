import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createPenthouse, ROOMS, LEVEL } from './world/penthouse.js'
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
renderer.toneMappingExposure = 1.15
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xb8cce0, 0.0028)

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 550)
camera.position.set(0, 1.65, 22)

createSky(scene)
createCity(scene)
createPenthouse(scene)

// Morning light: soft sky fill + warm sun from the east
const hemi = new THREE.HemisphereLight(0xd7e8f8, 0xc4b49a, 0.85)
scene.add(hemi)

const sun = new THREE.DirectionalLight(0xffe2b0, 1.35)
sun.position.set(55, 48, 20)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.camera.near = 10
sun.shadow.camera.far = 200
sun.shadow.camera.left = -80
sun.shadow.camera.right = 80
sun.shadow.camera.top = 80
sun.shadow.camera.bottom = -80
scene.add(sun)

const bounce = new THREE.DirectionalLight(0xb8d0ea, 0.35)
bounce.position.set(-40, 25, -30)
scene.add(bounce)

const walkControls = new PointerLockControls(camera, canvas)
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true
orbitControls.dampingFactor = 0.06
orbitControls.maxPolarAngle = Math.PI * 0.49
orbitControls.minDistance = 12
orbitControls.maxDistance = 140
orbitControls.target.set(0, 3, -2)
orbitControls.enabled = false

let mode = 'orbit'
let started = false
let currentRoom = 0
let eyeFloor = 0 // 0 = L1, 1 = L2

const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
const keys = { forward: false, back: false, left: false, right: false }
const clock = new THREE.Clock()

const bounds = {
  minX: -34,
  maxX: 34,
  minZ: -42,
  maxZ: 24,
}

function eyeHeight() {
  return eyeFloor === 0 ? 1.65 : LEVEL.L2 + 1.65
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
  eyeFloor = room.position.y > LEVEL.L2 ? 1 : 0
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

/** Walk height follows stair band near x≈8, z 7..14 */
function updateFloorFromStairs() {
  const onStair =
    camera.position.x > 5.5 &&
    camera.position.x < 10.5 &&
    camera.position.z < 15 &&
    camera.position.z > 6.5

  if (onStair) {
    const t = THREE.MathUtils.clamp((14 - camera.position.z) / 6.2, 0, 1)
    camera.position.y = 1.65 + t * LEVEL.L2
    eyeFloor = t > 0.55 ? 1 : 0
    return true
  }

  // Snap when stepping onto upper bridge near stair top
  if (
    eyeFloor === 0 &&
    camera.position.y > LEVEL.L2 * 0.55 &&
    camera.position.z < 8.5 &&
    camera.position.x > 5 &&
    camera.position.x < 11
  ) {
    eyeFloor = 1
  }
  if (eyeFloor === 1 && camera.position.z > 13.5 && camera.position.x > 5 && camera.position.x < 11) {
    eyeFloor = 0
  }
  return false
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
    if (camera.position.y < 4) {
      camera.position.set(38, 22, 48)
      orbitControls.target.set(0, 4, -4)
    }
  }
}

enterBtn.addEventListener('click', () => enterExperience('walk'))
orbitBtn.addEventListener('click', () => enterExperience('orbit'))
modeBtn.addEventListener('click', () => {
  setMode(mode === 'walk' ? 'orbit' : 'walk')
})

walkControls.addEventListener('lock', () => {
  canvas.classList.add('is-locked')
})
walkControls.addEventListener('unlock', () => {
  canvas.classList.remove('is-locked')
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
  const speed = 14
  velocity.x -= velocity.x * 8.0 * delta
  velocity.z -= velocity.z * 8.0 * delta

  direction.z = Number(keys.forward) - Number(keys.back)
  direction.x = Number(keys.right) - Number(keys.left)
  direction.normalize()

  if (keys.forward || keys.back) velocity.z -= direction.z * speed * delta
  if (keys.left || keys.right) velocity.x -= direction.x * speed * delta

  walkControls.moveRight(-velocity.x * delta)
  walkControls.moveForward(-velocity.z * delta)

  camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.minX, bounds.maxX)
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, bounds.minZ, bounds.maxZ)

  const onStairs = updateFloorFromStairs()
  if (!onStairs) {
    camera.position.y = eyeHeight()
  }

  const near = nearestRoomIndex()
  if (near !== currentRoom && camera.position.distanceTo(ROOMS[near].position) < 7) {
    currentRoom = near
    setRoomLabel(ROOMS[currentRoom].name)
    ;[...roomNav.children].forEach((el, i) => {
      el.classList.toggle('is-active', i === currentRoom)
    })
  }
}

camera.position.set(42, 18, 52)
camera.lookAt(0, 4, -4)
orbitControls.target.set(0, 4, -4)
orbitControls.enabled = true
mode = 'orbit'

let idleAngle = 0.4

function animate() {
  requestAnimationFrame(animate)
  const delta = Math.min(clock.getDelta(), 0.05)

  if (!started) {
    idleAngle += delta * 0.07
    camera.position.x = Math.cos(idleAngle) * 52
    camera.position.z = Math.sin(idleAngle) * 52
    camera.position.y = 16 + Math.sin(idleAngle * 0.65) * 2
    orbitControls.target.set(0, 4, -4)
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
