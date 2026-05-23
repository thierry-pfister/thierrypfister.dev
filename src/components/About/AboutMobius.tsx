'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function createMobiusGeometry(R: number, w: number, uN: number, vN: number) {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let j = 0; j <= vN; j++) {
    for (let i = 0; i <= uN; i++) {
      const u = (i / uN) * Math.PI * 2
      const v = (j / vN - 0.5) * w

      const x = (R + v * Math.cos(u / 2)) * Math.cos(u)
      const y = (R + v * Math.cos(u / 2)) * Math.sin(u)
      const z = v * Math.sin(u / 2)

      positions.push(x, y, z)
      uvs.push(i / uN, j / vN)
    }
  }

  for (let j = 0; j < vN; j++) {
    for (let i = 0; i < uN; i++) {
      const a = j * (uN + 1) + i
      const b = a + 1
      const c = a + (uN + 1)
      const d = c + 1
      indices.push(a, b, d)
      indices.push(a, d, c)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

export default function AboutMobius() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const w = el.clientWidth
    const h = el.clientHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // Scene + camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100)
    camera.position.set(0, 0, 7)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.35)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xfff8e0, 2.4)
    keyLight.position.set(4, 6, 5)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x6366f1, 2.2, 24)
    fillLight.position.set(-4, -3, 2)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xe8c547, 1.4, 18)
    rimLight.position.set(3, -2, -3)
    scene.add(rimLight)

    // Möbius mesh
    const geo = createMobiusGeometry(2.0, 1.1, 300, 30)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xe8c547,
      metalness: 0.88,
      roughness: 0.12,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geo, mat)

    const group = new THREE.Group()
    group.add(mesh)
    group.rotation.x = -0.25
    scene.add(group)

    // Mouse parallax
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // Animation loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      mesh.rotation.y = t * 0.28

      // Orbit rim light for dynamic highlights
      rimLight.position.x = Math.cos(t * 0.4) * 4
      rimLight.position.z = Math.sin(t * 0.4) * -3

      // Smooth parallax
      group.rotation.x += (-0.25 + mouse.y * 0.12 - group.rotation.x) * 0.06
      group.rotation.y += (mouse.x * 0.15 - group.rotation.y) * 0.06

      renderer.render(scene, camera)
    }
    animate()

    // Resize
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
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
