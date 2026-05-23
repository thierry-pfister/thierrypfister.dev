'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AboutTorusKnot() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const w = el.clientWidth
    const h = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100)
    camera.position.set(0, 0, 7)

    const geo = new THREE.TorusKnotGeometry(1.8, 0.52, 220, 24, 2, 3)
    const mat = new THREE.MeshStandardMaterial({
      color:     0xe8c870,
      metalness: 0.55,
      roughness: 0.22,
    })
    const mesh = new THREE.Mesh(geo, mat)

    const group = new THREE.Group()
    group.add(mesh)
    scene.add(group)

    // Lights
    scene.add(new THREE.AmbientLight(0xfff8e8, 1.2))

    const key = new THREE.DirectionalLight(0xffffff, 4.5)
    key.position.set(4, 6, 6)
    scene.add(key)

    const fill = new THREE.PointLight(0x6366f1, 2.8, 28)
    fill.position.set(-5, -4, 2)
    scene.add(fill)

    const rimA = new THREE.PointLight(0xe8c547, 2.2, 22)
    scene.add(rimA)

    const rimB = new THREE.PointLight(0xb8a8e8, 1.6, 20)
    scene.add(rimB)

    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      mesh.rotation.x = t * 0.18
      mesh.rotation.y = t * 0.26

      rimA.position.set(Math.cos(t * 0.4) * 5, Math.sin(t * 0.25) * 3, Math.sin(t * 0.4) * -4)
      rimB.position.set(Math.cos(t * 0.4 + Math.PI) * 4, Math.sin(t * 0.25 + Math.PI) * 2, Math.sin(t * 0.4 + Math.PI) * -3)

      group.rotation.x += (-mouse.y * 0.14 - group.rotation.x) * 0.05
      group.rotation.y += ( mouse.x * 0.18 - group.rotation.y) * 0.05

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
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
