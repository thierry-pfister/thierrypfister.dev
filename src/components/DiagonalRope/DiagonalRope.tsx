'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Strand wraps around a spine using a consistent tangent-space frame
class StrandCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private spine: THREE.CatmullRomCurve3,
    private orbitR: number,
    private turns: number,
    private phase: number,
  ) {
    super()
  }

  getPoint(t: number): THREE.Vector3 {
    const pt  = this.spine.getPoint(t)
    const tan = this.spine.getTangent(t).normalize()

    const ref    = Math.abs(tan.y) < 0.95
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0)
    const normal   = new THREE.Vector3().crossVectors(ref, tan).normalize()
    const binormal = new THREE.Vector3().crossVectors(tan, normal).normalize()

    const angle = t * this.turns * Math.PI * 2 + this.phase

    return new THREE.Vector3(
      pt.x + (normal.x * Math.cos(angle) + binormal.x * Math.sin(angle)) * this.orbitR,
      pt.y + (normal.y * Math.cos(angle) + binormal.y * Math.sin(angle)) * this.orbitR,
      pt.z + (normal.z * Math.cos(angle) + binormal.z * Math.sin(angle)) * this.orbitR,
    )
  }
}

export default function DiagonalRope() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const w = el.clientWidth
    const h = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const fov    = 55
    const camera = new THREE.PerspectiveCamera(fov, w / h, 0.1, 100)
    camera.position.set(0, 0, 5)

    // Compute viewport bounds at z=0
    const halfH = Math.tan((fov / 2) * (Math.PI / 180)) * 5
    const halfW = halfH * (w / h)

    // Spine: top-left → bottom-right with a gentle Z S-curve
    const spine = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-halfW * 1.08,  halfH * 1.08, -0.5),
      new THREE.Vector3(-halfW * 0.45,  halfH * 0.28,  1.2),
      new THREE.Vector3( 0,             0,             -0.4),
      new THREE.Vector3( halfW * 0.45, -halfH * 0.28,  1.2),
      new THREE.Vector3( halfW * 1.08, -halfH * 1.08, -0.5),
    ])

    const TURNS  = 7
    const ORBIT  = 0.17
    const SEGS   = 160
    const RSEG   = 8
    const RADIUS = 0.075

    const mat = new THREE.MeshStandardMaterial({
      color:      0xc8b8e8,
      metalness:  0.55,
      roughness:  0.45,
      transparent: true,
      opacity:    0.42,
      side:       THREE.DoubleSide,
    })

    const geos: THREE.TubeGeometry[] = []
    const group = new THREE.Group()

    for (let i = 0; i < 3; i++) {
      const strand = new StrandCurve(spine, ORBIT, TURNS, (i / 3) * Math.PI * 2)
      const geo    = new THREE.TubeGeometry(strand, SEGS, RADIUS, RSEG, false)
      geos.push(geo)
      group.add(new THREE.Mesh(geo, mat))
    }

    scene.add(group)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambient)

    const key = new THREE.DirectionalLight(0xfff0d0, 2.2)
    key.position.set(4, 6, 5)
    scene.add(key)

    const fill = new THREE.PointLight(0x6366f1, 3.5, 30)
    fill.position.set(-6, -5, 3)
    scene.add(fill)

    const rim = new THREE.PointLight(0xe8c547, 2.0, 25)
    rim.position.set(5, -3, -4)
    scene.add(rim)

    // Diagonal axis for slow rotation
    const diagAxis = new THREE.Vector3(1, -1, 0).normalize()

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      group.quaternion.setFromAxisAngle(diagAxis, t * 0.12)
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
      geos.forEach(g => g.dispose())
      mat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
