'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const COLORS = [
  new THREE.Color(0xe8c547), // gold
  new THREE.Color(0xe8c547),
  new THREE.Color(0x9b8dd4), // lavender
  new THREE.Color(0x6366f1), // indigo
]

function makeCircleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

export default function AboutParticles() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const w = el.clientWidth
    const h = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 50)
    camera.position.set(0, 0, 5)

    const COUNT = 2000
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const phases    = new Float32Array(COUNT * 3) // x/y/z phase per particle
    const freqs     = new Float32Array(COUNT * 3) // x/y/z freq per particle
    const basePos   = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 14
      const y = (Math.random() - 0.5) * 8
      const z = (Math.random() - 0.5) * 5 - 1

      basePos[i * 3]     = x
      basePos[i * 3 + 1] = y
      basePos[i * 3 + 2] = z

      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      phases[i * 3]     = Math.random() * Math.PI * 2
      phases[i * 3 + 1] = Math.random() * Math.PI * 2
      phases[i * 3 + 2] = Math.random() * Math.PI * 2

      freqs[i * 3]     = 0.18 + Math.random() * 0.22
      freqs[i * 3 + 1] = 0.14 + Math.random() * 0.18
      freqs[i * 3 + 2] = 0.10 + Math.random() * 0.14

      const col = COLORS[Math.floor(Math.random() * COLORS.length)]!
      colors[i * 3]     = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    const tex = makeCircleTexture()
    const mat = new THREE.PointsMaterial({
      size: 0.09,
      sizeAttenuation: true,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geo, mat)
    const group  = new THREE.Group()
    group.add(points)
    scene.add(group)

    const mouse  = { x: 0, y: 0 }
    const target = { rx: 0, ry: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    let animId: number
    const clock = new THREE.Clock()
    const posAttr = geo.attributes['position'] as THREE.BufferAttribute

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      for (let i = 0; i < COUNT; i++) {
        posAttr.array[i * 3]     = basePos[i * 3]!     + Math.sin(t * freqs[i * 3]!     + phases[i * 3]!)     * 0.28
        posAttr.array[i * 3 + 1] = basePos[i * 3 + 1]! + Math.sin(t * freqs[i * 3 + 1]! + phases[i * 3 + 1]!) * 0.22
        posAttr.array[i * 3 + 2] = basePos[i * 3 + 2]! + Math.sin(t * freqs[i * 3 + 2]! + phases[i * 3 + 2]!) * 0.18
      }
      posAttr.needsUpdate = true

      target.rx = -mouse.y * 0.08
      target.ry =  mouse.x * 0.10
      group.rotation.x += (target.rx - group.rotation.x) * 0.04
      group.rotation.y += (target.ry - group.rotation.y) * 0.04

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = el.clientWidth
      const nh = el.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      geo.dispose()
      mat.dispose()
      tex.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
