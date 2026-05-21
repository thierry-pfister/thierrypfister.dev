'use client'

import { useEffect, useRef } from 'react'
import styles from './Projects.module.css'

export default function ProjectsCarousel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let dispose: (() => void) | undefined

    import('three').then((THREE) => {
      if (cancelled || !canvas) return

      const w = canvas.offsetWidth || 600
      const h = canvas.offsetHeight || 600
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h)

      const scene = new THREE.Scene()
      // Telephoto FOV: front card ~80vw, adjacent cards just barely off-screen
      const cam = new THREE.PerspectiveCamera(20, w / h, 0.1, 200)
      cam.position.set(0, 0, 18)

      scene.add(new THREE.AmbientLight(0xffffff, 0.5))
      const light = new THREE.PointLight(0xffffff, 3, 100)
      light.position.set(5, 5, 18)
      scene.add(light)

      const R = 6

      const makeGradient = (c1: string, c2: string) => {
        const cv = document.createElement('canvas')
        cv.width = 512; cv.height = 288
        const ctx = cv.getContext('2d')!
        const g = ctx.createLinearGradient(0, 0, 512, 288)
        g.addColorStop(0, c1)
        g.addColorStop(1, c2)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 512, 288)
        return new THREE.CanvasTexture(cv)
      }

      const numCards = 5
      const cardArc = (60 * Math.PI) / 180
      const cardDefs = [
        makeGradient('#6366F1', '#8B5CF6'),
        makeGradient('#F59E0B', '#EF4444'),
        makeGradient('#10B981', '#06B6D4'),
        makeGradient('#7C3AED', '#EC4899'),
        makeGradient('#3B82F6', '#14B8A6'),
      ]
      const cardMats = cardDefs.map(tex => new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }))
      const cardGeos: import('three').CylinderGeometry[] = []
      const cards = Array.from({ length: numCards }, (_, i) => {
        const geo = new THREE.CylinderGeometry(
          R, R, 3.2,
          64, 1, true,
          -(cardArc / 2) + i * (2 * Math.PI) / numCards,
          cardArc,
        )
        cardGeos.push(geo)
        return new THREE.Mesh(geo, cardMats[i])
      })

      const cylinder = new THREE.Group()
      cylinder.add(...cards)

      const group = new THREE.Group()
      group.rotation.x = THREE.MathUtils.degToRad(-2)
      group.rotation.z = THREE.MathUtils.degToRad(-8)
      group.position.y = -0.3
      group.add(cylinder)
      scene.add(group)

      let animId: number
      let t = 0
      const tick = () => {
        animId = requestAnimationFrame(tick)
        t -= 0.008
        cylinder.rotation.y = t
        renderer.render(scene, cam)
      }
      tick()

      dispose = () => {
        cancelAnimationFrame(animId)
        renderer.dispose()
        cardGeos.forEach(g => g.dispose())
        cardMats.forEach(m => { m.map?.dispose(); m.dispose() })
      }
    })

    return () => { cancelled = true; dispose?.() }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
