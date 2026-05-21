'use client'

import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

interface Props {
  mouseRef: React.RefObject<{ x: number; y: number }>
}

export default function TorusKnotCanvas({ mouseRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let dispose: (() => void) | undefined

    import('three').then((THREE) => {
      if (cancelled || !canvas) return

      const w = canvas.offsetWidth || 420
      const h = canvas.offsetHeight || 420
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h)

      const scene = new THREE.Scene()
      const cam = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
      cam.position.set(0, 0, 4.5)

      scene.add(new THREE.AmbientLight(0xC4B8E8, 0.6))
      const l1 = new THREE.PointLight(0x818CF8, 4, 12)
      l1.position.set(2, 2, 3)
      scene.add(l1)
      const l2 = new THREE.PointLight(0x5B4EAA, 2.5, 8)
      l2.position.set(-2, -1, 2)
      scene.add(l2)
      scene.add(Object.assign(new THREE.DirectionalLight(0xffffff, 0.4), { position: { x: 0, y: 4, z: 2 } }))

      const geo = new THREE.TorusKnotGeometry(1.2, 0.42, 160, 20, 2, 3)
      const mat = new THREE.MeshPhongMaterial({
        color: 0x7B6EC4, shininess: 90,
        specular: 0xC4B8E8, transparent: true, opacity: 0.92,
      })
      const knot = new THREE.Mesh(geo, mat)
      knot.position.set(-0.4, -0.3, 0)
      scene.add(knot)

      let animId: number
      let t = 0
      const tick = () => {
        animId = requestAnimationFrame(tick)
        t += 0.008
        const { x, y } = mouseRef.current ?? { x: 0, y: 0 }
        knot.rotation.x = t * 0.3 + y * 0.1
        knot.rotation.y = t * 0.4 + x * 0.12
        knot.rotation.z = t * 0.15
        l1.position.x = Math.sin(t * 0.6) * 3
        l1.position.y = Math.cos(t * 0.4) * 2
        renderer.render(scene, cam)
      }
      tick()

      dispose = () => {
        cancelAnimationFrame(animId)
        renderer.dispose()
        geo.dispose()
        mat.dispose()
      }
    })

    return () => { cancelled = true; dispose?.() }
  }, [mouseRef])

  return <canvas ref={canvasRef} id="canvas-left" className={styles.canvasLeft} />
}
