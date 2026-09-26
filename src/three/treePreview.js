import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { applyWind, createPineGeometry, createRenderer, disposeScene, PINE_HEIGHT } from './shared'

// 1 scene unit ≈ 5 ft (the arborist figure is ~6 ft tall for scale).
const TREE_UNITS = { small: 3, medium: 7, large: 12 }
const HOUSE_X = 3.4
const POLE_X = 2.2

function createHouse() {
  const house = new THREE.Group()
  const wall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 3), new THREE.MeshStandardMaterial({ color: 0xe7e5e4 }))
  wall.position.y = 1.1

  const shape = new THREE.Shape()
  shape.moveTo(-1.85, 0)
  shape.lineTo(1.85, 0)
  shape.lineTo(0, 1.5)
  shape.closePath()
  const roofGeometry = new THREE.ExtrudeGeometry(shape, { depth: 3.4, bevelEnabled: false }).translate(0, 0, -1.7)
  const roof = new THREE.Mesh(roofGeometry, new THREE.MeshStandardMaterial({ color: 0x7c2d12, flatShading: true }))
  roof.position.y = 2.2

  const door = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.05), new THREE.MeshStandardMaterial({ color: 0x7c2d12 }))
  door.position.set(0, 0.55, 1.51)
  const glass = new THREE.MeshStandardMaterial({ color: 0xbae6fd, emissive: 0xfde68a, emissiveIntensity: 0.25 })
  house.add(wall, roof, door)
  for (const x of [-0.95, 0.95]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.05), glass)
    win.position.set(x, 1.35, 1.51)
    house.add(win)
  }
  house.position.x = HOUSE_X
  return house
}

function createPowerLines() {
  const group = new THREE.Group()
  const wood = new THREE.MeshStandardMaterial({ color: 0x5b4636 })
  const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
  const ends = [-4.5, 4.5]
  for (const z of ends) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 6.4, 8), wood)
    pole.position.set(0, 3.2, z)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.12), wood)
    arm.position.set(0, 6, z)
    group.add(pole, arm)
  }
  for (const x of [-0.7, 0, 0.7]) {
    const points = []
    for (let i = 0; i <= 12; i++) {
      const z = -4.5 + (9 * i) / 12
      points.push(new THREE.Vector3(x, 6.05 - 0.6 * (1 - (z / 4.5) ** 2), z))
    }
    group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 24, 0.025, 4), wireMaterial))
  }
  group.position.x = POLE_X
  return group
}

function createArborist() {
  const person = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.6, 4, 8), new THREE.MeshStandardMaterial({ color: 0xea580c }))
  body.position.y = 0.5
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), new THREE.MeshStandardMaterial({ color: 0xf2c9a0 }))
  head.position.y = 1.12
  const hat = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b }),
  )
  hat.position.y = 1.16
  person.add(body, head, hat)
  person.position.set(-2.2, 0, 1.8)
  return person
}

function flatRing(inner, outer, color) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(inner, outer, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.03
  return ring
}

function setPresence(object, amount) {
  object.visible = amount > 0.01
  object.scale.setScalar(Math.max(amount, 0.001))
}

export default function createTreePreview(container, { reducedMotion = false } = {}) {
  const renderer = createRenderer(container)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200)
  camera.position.set(9, 5, 14)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enablePan = false
  controls.enableDamping = true
  controls.minPolarAngle = 0.95
  controls.maxPolarAngle = 1.4
  controls.autoRotate = !reducedMotion
  controls.autoRotateSpeed = 0.8
  // Let vertical swipes scroll the page on touch devices; horizontal drags still rotate.
  renderer.domElement.style.touchAction = 'pan-y'
  renderer.domElement.style.cursor = 'grab'

  let resumeTimer
  controls.addEventListener('start', () => {
    clearTimeout(resumeTimer)
    controls.autoRotate = false
    renderer.domElement.style.cursor = 'grabbing'
  })
  controls.addEventListener('end', () => {
    renderer.domElement.style.cursor = 'grab'
    if (!reducedMotion) resumeTimer = setTimeout(() => (controls.autoRotate = true), 3000)
  })

  scene.add(new THREE.HemisphereLight(0xe6f2e6, 0x0f380f, 1.3))
  const sun = new THREE.DirectionalLight(0xffffff, 1.8)
  sun.position.set(6, 10, 8)
  const hazardLight = new THREE.PointLight(0xf97316, 0, 14, 1.5)
  scene.add(sun, hazardLight)

  const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 48), new THREE.MeshStandardMaterial({ color: 0x1a521a }))
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  const wind = {
    uTime: { value: 0 },
    uWind: { value: 0.15 },
    uWindDir: { value: new THREE.Vector2(1, 0.25).normalize() },
  }
  const treeMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.9 })
  applyWind(treeMaterial, wind)
  const tree = new THREE.Mesh(createPineGeometry({ foliage: 0x2f8a3a, trunk: 0x7a5236 }), treeMaterial)
  const treePivot = new THREE.Group() // rotates at the base so the tree can lean or fall
  treePivot.add(tree)

  const house = createHouse()
  const power = createPowerLines()
  const stumpRing = flatRing(0.5, 0.72, 0xfb923c)
  const hazardRing = flatRing(0.9, 1.1, 0xea580c)
  scene.add(treePivot, house, power, createArborist(), stumpRing, hazardRing)

  // Every visual property eases from `current` toward `target`.
  const target = { scale: 7 / PINE_HEIGHT, lean: 0, house: 0, power: 0, stump: 0, hazard: 0, wind: 0.15, focusX: 0, focusY: 3, dist: 17 }
  const current = { ...target }
  setPresence(house, 0)
  setPresence(power, 0)

  let t = 0
  let running = false
  let raf = 0
  let lastFrame = 0

  function apply(dt) {
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 5)
    for (const key in target) current[key] += (target[key] - current[key]) * k

    tree.scale.setScalar(current.scale)
    treePivot.rotation.z = current.lean
    setPresence(house, current.house)
    setPresence(power, current.power)

    stumpRing.visible = current.stump > 0.01
    stumpRing.material.opacity = current.stump * (0.6 + 0.3 * Math.sin(t * 3))
    stumpRing.scale.setScalar(current.scale * 1.1)

    const pulse = (t % 1.6) / 1.6
    hazardRing.visible = current.hazard > 0.01
    hazardRing.scale.setScalar(1 + pulse * 2.2)
    hazardRing.material.opacity = current.hazard * (1 - pulse)
    hazardLight.intensity = current.hazard * (8 + 6 * Math.sin(t * 4))

    wind.uTime.value = t
    wind.uWind.value = current.wind

    // Reframe as the tree grows while preserving the user's orbit angle.
    const dir = camera.position.clone().sub(controls.target).normalize()
    controls.target.set(current.focusX, current.focusY, 0)
    camera.position.copy(controls.target).addScaledVector(dir, current.dist)
    controls.update()
  }

  function render() {
    renderer.render(scene, camera)
  }

  function frame(now) {
    raf = requestAnimationFrame(frame)
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0
    lastFrame = now
    t += dt
    apply(dt)
    render()
  }

  function resize() {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (!running) render()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  apply(0)
  resize()

  return {
    update({ height, location, stump }) {
      const units = TREE_UNITS[height]
      const fallen = location === 'fallen'
      const withHouse = fallen || location === 'roof'
      Object.assign(target, {
        scale: units / PINE_HEIGHT,
        lean: fallen ? -0.85 : location === 'roof' ? -0.12 : 0,
        house: withHouse ? 1 : 0,
        power: location === 'power' ? 1 : 0,
        hazard: fallen || location === 'power' ? 1 : 0,
        stump: stump === 'yes' ? 1 : 0,
        wind: fallen ? 0 : 0.12 + units * 0.01,
        // A fallen tree spreads sideways (~0.75 × its height), so frame its full length instead of its height.
        focusX: fallen ? 1.5 + units * 0.3 : withHouse ? 1.6 : location === 'power' ? 1 : 0,
        focusY: fallen ? 1.5 + units * 0.22 : Math.max(1.8, units * 0.45),
        dist: fallen ? 10 + units * 1.3 : 9 + units * 1.25,
      })
      hazardRing.position.x = fallen ? HOUSE_X : POLE_X
      hazardLight.position.set(fallen ? HOUSE_X : POLE_X, 3, 1.5)
      if (!running) {
        apply(1)
        render()
      }
    },
    setActive(active) {
      if (active === running) return
      running = active
      if (running) {
        lastFrame = 0
        raf = requestAnimationFrame(frame)
      } else {
        cancelAnimationFrame(raf)
      }
    },
    dispose() {
      cancelAnimationFrame(raf)
      clearTimeout(resumeTimer)
      ro.disconnect()
      controls.dispose()
      disposeScene(scene, renderer)
    },
  }
}
