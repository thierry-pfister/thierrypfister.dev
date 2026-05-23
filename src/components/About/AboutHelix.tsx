'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private R: number,
    private turns: number,
    private height: number,
    private offset: number,
  ) {
    super()
  }

  getPoint(t: number): THREE.Vector3 {
    const angle = t * this.turns * Math.PI * 2 + this.offset
    const y = (t - 0.5) * this.height
    return new THREE.Vector3(
      this.R * Math.cos(angle),
      y,
      this.R * Math.sin(angle),
    )
  }
}

export default function AboutHelix() {
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

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 0, 7)

    const ambient = new THREE.AmbientLight(0xffffff, 0.12)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xfff0d0, 3.2)
    keyLight.position.set(5, 7, 4)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x6366f1, 4.5, 28)
    fillLight.position.set(-5, -4, 2)
    scene.add(fillLight)

    const rimA = new THREE.PointLight(0xe8c547, 2.8, 20)
    scene.add(rimA)

    const rimB = new THREE.PointLight(0xb8a8e8, 2.0, 18)
    scene.add(rimB)

    const mat = new THREE.MeshStandardMaterial({
      color: 0x14120f,
      metalness: 1.0,
      roughness: 0.04,
    })

    const TURNS = 3.5
    const HEIGHT = 5.5
    const RADIUS = 0.85
    const NUM_RUNGS = 18

    const curve1 = new HelixCurve(RADIUS, TURNS, HEIGHT, 0)
    const curve2 = new HelixCurve(RADIUS, TURNS, HEIGHT, Math.PI)

    const tubeGeo1 = new THREE.TubeGeometry(curve1, 220, 0.065, 10, false)
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 220, 0.065, 10, false)

    const group = new THREE.Group()
    group.add(new THREE.Mesh(tubeGeo1, mat))
    group.add(new THREE.Mesh(tubeGeo2, mat))

    const rungGeos: THREE.CylinderGeometry[] = []
    for (let i = 0; i < NUM_RUNGS; i++) {
      const t = i / (NUM_RUNGS - 1)
      const p1 = curve1.getPoint(t)
      const p2 = curve2.getPoint(t)
      const length = p1.distanceTo(p2)
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize()

      const geo = new THREE.CylinderGeometry(0.028, 0.028, length, 6)
      rungGeos.push(geo)
      const rung = new THREE.Mesh(geo, mat)
      rung.position.copy(mid)
      rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
      group.add(rung)
    }

    group.rotation.x = -0.2
    scene.add(group)

    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      group.rotation.y = t * 0.2

      rimA.position.set(
        Math.cos(t * 0.38) * 5,
        Math.sin(t * 0.22) * 3,
        Math.sin(t * 0.38) * -4,
      )
      rimB.position.set(
        Math.cos(t * 0.38 + Math.PI) * 4,
        Math.sin(t * 0.22 + Math.PI) * 2,
        Math.sin(t * 0.38 + Math.PI) * -3,
      )

      group.rotation.x += (-0.2 + mouse.y * 0.12 - group.rotation.x) * 0.05

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
      tubeGeo1.dispose()
      tubeGeo2.dispose()
      rungGeos.forEach(g => g.dispose())
      mat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
