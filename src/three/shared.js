import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

export const PINE_HEIGHT = 3.8

export function createRenderer(container, { antialias = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false)
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'
  container.appendChild(renderer.domElement)
  return renderer
}

// Small deterministic PRNG so the forest layout is identical on every load.
export function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function paint(geometry, hex) {
  const color = new THREE.Color(hex)
  const count = geometry.attributes.position.count
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) colors.set([color.r, color.g, color.b], i * 3)
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

// Low-poly pine, base at y=0, ~PINE_HEIGHT tall. Foliage defaults to white so instance colors tint it.
export function createPineGeometry({ foliage = 0xffffff, trunk = 0x6b4a33 } = {}) {
  const parts = [paint(new THREE.CylinderGeometry(0.12, 0.18, 1.2, 6).translate(0, 0.6, 0), trunk)]
  const tiers = [
    [1.3, 1.6, 1.0],
    [1.05, 1.4, 1.9],
    [0.8, 1.2, 2.7],
    [0.5, 0.9, 3.35],
  ]
  for (const [radius, height, y] of tiers) {
    parts.push(paint(new THREE.ConeGeometry(radius, height, 7).translate(0, y, 0), foliage))
  }
  const geometry = mergeGeometries(parts)
  parts.forEach((p) => p.dispose())
  return geometry
}

// Bends vertices in world space, more toward the treetop. Works for plain and instanced meshes.
export function applyWind(material, uniforms, height = PINE_HEIGHT) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uTime;
        uniform float uWind;
        uniform vec2 uWindDir;`,
      )
      .replace(
        '#include <project_vertex>',
        `vec4 mvPosition = vec4(transformed, 1.0);
        float treeScale = 1.0;
        vec2 seed = vec2(0.0);
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
          treeScale = length(instanceMatrix[1].xyz);
          seed = instanceMatrix[3].xz;
        #endif
        float bend = pow(clamp(transformed.y / ${height.toFixed(2)}, 0.0, 1.0), 2.0);
        float phase = uTime * 1.6 + seed.x * 0.37 + seed.y * 0.23;
        float sway = 0.65 + sin(phase) * 0.3 + sin(phase * 2.7 + 1.3) * 0.12;
        float push = uWind * sway * bend * treeScale;
        mvPosition.xz += uWindDir * push;
        mvPosition.y -= push * push * 0.08;
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;`,
      )
  }
}

export function disposeScene(scene, renderer) {
  scene.traverse((obj) => {
    obj.geometry?.dispose()
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
    materials.forEach((m) => m?.dispose())
  })
  renderer.dispose()
  renderer.domElement.remove()
}
