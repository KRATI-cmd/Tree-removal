import * as THREE from 'three'
import { applyWind, createPineGeometry, createRenderer, disposeScene, mulberry32 } from './shared'

const FOG_COLOR = 0x0f380f // matches the hero background so distant trees dissolve into it
const SKY_HEIGHT = 22
const STRIKE_Z = -22
const STRIKE_COOLDOWN = 0.7 // seconds; keeps flashes well under 3 per second (WCAG 2.3.1)

// Midpoint displacement: a straight segment becomes a jagged bolt.
function jagged(from, to, roughness, rand) {
  let points = [from.clone(), to.clone()]
  let offset = from.distanceTo(to) * roughness
  for (let pass = 0; pass < 5; pass++) {
    const next = [points[0]]
    for (let i = 1; i < points.length; i++) {
      const mid = points[i - 1].clone().lerp(points[i], 0.5)
      mid.x += (rand() - 0.5) * offset
      mid.z += (rand() - 0.5) * offset * 0.4
      next.push(mid, points[i])
    }
    points = next
    offset *= 0.5
  }
  return points
}

function tube(points, radius, material) {
  const path = new THREE.CurvePath()
  for (let i = 1; i < points.length; i++) path.add(new THREE.LineCurve3(points[i - 1], points[i]))
  return new THREE.Mesh(new THREE.TubeGeometry(path, points.length * 3, radius, 5, false), material)
}

export default function createStormScene(container, { reducedMotion = false } = {}) {
  const small = container.clientWidth < 768
  const rand = mulberry32(7)
  const renderer = createRenderer(container, { antialias: !small })
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(FOG_COLOR, 0.042)

  // Low camera looking up: the treeline sits in the lower third, storm sky above.
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 150)
  const camBase = new THREE.Vector3(0, 1.8, 12)
  const lookAt = new THREE.Vector3(0, 4.2, 0)
  camera.position.copy(camBase)

  const hemi = new THREE.HemisphereLight(0x9fb8cc, FOG_COLOR, 0.8)
  const moon = new THREE.DirectionalLight(0xcad8ff, 0.8)
  moon.position.set(-10, 16, 4)
  const strikeLight = new THREE.PointLight(0xdce7ff, 0, 80, 1.5)
  scene.add(hemi, moon, strikeLight)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 240),
    new THREE.MeshStandardMaterial({ color: 0x0b2f0b, roughness: 1 }),
  )
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  // Backdrop behind the forest that lights up on a strike, silhouetting the trees.
  const skyFlash = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 120),
    new THREE.MeshBasicMaterial({ color: 0xd6e4ff, transparent: true, opacity: 0, fog: false, depthWrite: false }),
  )
  skyFlash.position.set(0, 40, -70)
  scene.add(skyFlash)

  // ---- Forest (one instanced draw call) ----
  const wind = {
    uTime: { value: 0 },
    uWind: { value: 0.4 },
    uWindDir: { value: new THREE.Vector2(1, 0) },
  }
  const treeMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 })
  applyWind(treeMaterial, wind)

  const treeCount = small ? 150 : 340
  const forest = new THREE.InstancedMesh(createPineGeometry(), treeMaterial, treeCount)
  forest.frustumCulled = false
  const matrix = new THREE.Matrix4()
  const quat = new THREE.Quaternion()
  const pos = new THREE.Vector3()
  const scale = new THREE.Vector3()
  const color = new THREE.Color()
  const up = new THREE.Vector3(0, 1, 0)
  for (let i = 0; i < treeCount; i++) {
    const z = -48 + rand() * 50
    let x = (rand() * 2 - 1) * (14 + -z * 0.9)
    // Keep the foreground center open so the view isn't blocked by one giant trunk.
    if (z > -6 && Math.abs(x) < 6) x = Math.sign(x || 1) * (6 + rand() * 6)
    const s = 0.7 + rand()
    pos.set(x, 0, z)
    quat.setFromAxisAngle(up, rand() * Math.PI * 2)
    scale.set(s, s * (0.85 + rand() * 0.4), s)
    forest.setMatrixAt(i, matrix.compose(pos, quat, scale))
    forest.setColorAt(i, color.setHSL(0.29 + rand() * 0.07, 0.35 + rand() * 0.2, 0.1 + rand() * 0.1))
  }
  scene.add(forest)

  // ---- Rain (line streaks updated on the CPU) ----
  const rainCount = small ? 800 : 2000
  const rainPos = new Float32Array(rainCount * 6)
  const rainSpeed = new Float32Array(rainCount)
  const resetDrop = (i, y) => {
    const o = i * 6
    rainPos[o] = (rand() * 2 - 1) * 30
    rainPos[o + 1] = y
    rainPos[o + 2] = -30 + rand() * 40
    rainSpeed[i] = 14 + rand() * 8
  }
  for (let i = 0; i < rainCount; i++) resetDrop(i, rand() * SKY_HEIGHT)
  const rainGeometry = new THREE.BufferGeometry()
  const rainAttr = new THREE.BufferAttribute(rainPos, 3).setUsage(THREE.DynamicDrawUsage)
  rainGeometry.setAttribute('position', rainAttr)
  const rain = new THREE.LineSegments(
    rainGeometry,
    new THREE.LineBasicMaterial({ color: 0xbcd4e6, transparent: true, opacity: 0.3, depthWrite: false }),
  )
  rain.frustumCulled = false
  scene.add(rain)

  function updateRain(dt) {
    const slant = wind.uWindDir.value.x * wind.uWind.value * 5
    for (let i = 0; i < rainCount; i++) {
      const o = i * 6
      rainPos[o + 1] -= rainSpeed[i] * dt
      rainPos[o] += slant * dt
      if (rainPos[o + 1] < 0) resetDrop(i, SKY_HEIGHT + rand() * 4)
      rainPos[o + 3] = rainPos[o] - slant * 0.035
      rainPos[o + 4] = rainPos[o + 1] + 0.45
      rainPos[o + 5] = rainPos[o + 2]
    }
    rainAttr.needsUpdate = true
  }
  updateRain(0)

  // ---- Lightning ----
  const boltCore = new THREE.MeshBasicMaterial({
    color: 0xfffbea,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  })
  const boltGlow = boltCore.clone()
  boltGlow.color.set(0x8fb4ff)
  let bolt = null

  function clearBolt() {
    if (!bolt) return
    scene.remove(bolt)
    bolt.traverse((o) => o.geometry?.dispose())
    bolt = null
  }

  function buildBolt(target) {
    clearBolt()
    const top = new THREE.Vector3(target.x + (rand() - 0.5) * 8, SKY_HEIGHT + 6, target.z - 4)
    const main = jagged(top, target, 0.2, rand)
    bolt = new THREE.Group()
    bolt.add(tube(main, 0.09, boltCore), tube(main, 0.4, boltGlow))
    for (let b = 0; b < 2; b++) {
      const start = main[Math.floor(main.length * (0.2 + rand() * 0.4))]
      const end = start.clone().add(new THREE.Vector3((rand() - 0.5) * 10, -(4 + rand() * 6), (rand() - 0.5) * 3))
      bolt.add(tube(jagged(start, end, 0.25, rand), 0.045, boltCore))
    }
    scene.add(bolt)
  }

  // ---- Interaction state ----
  const pointer = new THREE.Vector2()
  const smoothPointer = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()
  const strikePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -STRIKE_Z)
  const hit = new THREE.Vector3()
  let t = 0
  let lastStrike = -10
  let nextAutoStrike = 2.5
  let flash = 0
  let boltLife = 0
  let gust = 0
  let gustDir = 1
  let shake = 0

  function strike(ndcX, ndcY) {
    if (reducedMotion || t - lastStrike < STRIKE_COOLDOWN) return
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)
    if (!raycaster.ray.intersectPlane(strikePlane, hit)) return
    lastStrike = t
    const target = new THREE.Vector3(THREE.MathUtils.clamp(hit.x, -40, 40), 0, STRIKE_Z)
    buildBolt(target)
    strikeLight.position.set(target.x, 10, target.z + 6)
    gustDir = target.x < camera.position.x ? 1 : -1 // trees lean away from the strike
    flash = boltLife = gust = shake = 1
  }

  function update(dt) {
    t += dt
    smoothPointer.lerp(pointer, 1 - Math.exp(-dt * 3))

    const wx = 0.35 + smoothPointer.x * 0.9 + gust * gustDir * 1.6
    const strength = Math.hypot(wx, 0.15)
    wind.uWindDir.value.set(wx / strength, -0.15 / strength)
    wind.uWind.value = 0.2 + strength * 0.45
    wind.uTime.value = t
    gust *= Math.exp(-dt * 1.6)

    updateRain(dt)

    flash *= Math.exp(-dt * 4.5)
    strikeLight.intensity = flash * 140
    hemi.intensity = 0.8 + flash * 1.6
    skyFlash.material.opacity = flash * 0.25

    if (bolt) {
      boltLife *= Math.exp(-dt * 5)
      boltCore.opacity = boltLife
      boltGlow.opacity = boltLife * 0.3
      if (boltLife < 0.02) clearBolt()
    }

    camera.position.set(camBase.x + smoothPointer.x * 1.4, camBase.y + smoothPointer.y * 0.6, camBase.z)
    if (shake > 0.002) {
      camera.position.x += (rand() - 0.5) * shake * 0.25
      camera.position.y += (rand() - 0.5) * shake * 0.25
      shake *= Math.exp(-dt * 6)
    }
    camera.lookAt(lookAt)

    if (t > nextAutoStrike) {
      strike(rand() * 1.6 - 0.8, 0.7)
      nextAutoStrike = t + 7 + rand() * 7
    }
  }

  // ---- Loop & lifecycle ----
  let running = false
  let raf = 0
  let lastFrame = 0
  const render = () => renderer.render(scene, camera)

  function frame(now) {
    raf = requestAnimationFrame(frame)
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0
    lastFrame = now
    update(dt)
    render()
  }

  function resize() {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w < 640 ? 62 : 50
    camera.updateProjectionMatrix()
    if (!running) {
      camera.lookAt(lookAt)
      render()
    }
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  return {
    // ndc: -1..1 across the canvas
    setPointer(x, y) {
      pointer.set(x, y)
    },
    strike,
    setActive(active) {
      // Reduced motion: a single still frame, no animation loop.
      const shouldRun = active && !reducedMotion
      if (shouldRun === running) return
      running = shouldRun
      if (running) {
        lastFrame = 0
        raf = requestAnimationFrame(frame)
      } else {
        cancelAnimationFrame(raf)
      }
    },
    dispose() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      clearBolt()
      boltCore.dispose()
      boltGlow.dispose()
      disposeScene(scene, renderer)
    },
  }
}
