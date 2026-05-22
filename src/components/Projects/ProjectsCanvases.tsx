'use client'

import { useEffect, useRef } from 'react'
import type { Project } from '@/types/project'
import styles from './Projects.module.css'

interface Props {
  projects: readonly Project[]
  onActiveChange: (index: number) => void
}

export default function ProjectsCarousel({ projects, onActiveChange }: Props) {
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
      const cam = new THREE.PerspectiveCamera(20, w / h, 0.1, 200)
      cam.position.set(0, 0, 18)

      scene.add(new THREE.AmbientLight(0xffffff, 0.5))
      const light = new THREE.PointLight(0xffffff, 3, 100)
      light.position.set(5, 5, 18)
      scene.add(light)

      const R = 6
      const numCards = projects.length
      const cardArc = (60 * Math.PI) / 180
      const cardSpacing = (2 * Math.PI) / numCards

      const GRADIENTS: [string, string][] = [
        ['#6366F1', '#8B5CF6'],
        ['#F59E0B', '#EF4444'],
        ['#10B981', '#06B6D4'],
        ['#7C3AED', '#EC4899'],
        ['#3B82F6', '#14B8A6'],
      ]

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

      const cardMats = projects.map((_, i) => {
        const [c1, c2] = GRADIENTS[i % GRADIENTS.length]!
        return new THREE.MeshBasicMaterial({
          map: makeGradient(c1, c2),
          side: THREE.DoubleSide,
        })
      })
      const cardGeos: import('three').CylinderGeometry[] = []
      const cards = Array.from({ length: numCards }, (_, i) => {
        const geo = new THREE.CylinderGeometry(
          R, R, 3.2,
          64, 1, true,
          -(cardArc / 2) + i * cardSpacing,
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

      // cos(t * numCards) = 1 when a card faces front, -1 halfway between cards
      const slowSpeed = 0.001
      const fastSpeed = 0.022

      let animId: number
      let t = 0
      let lastActive = -1

      const tick = () => {
        animId = requestAnimationFrame(tick)
        const centeredness = (Math.cos(t * numCards) + 1) / 2
        const speed = slowSpeed + (fastSpeed - slowSpeed) * Math.pow(1 - centeredness, 2)
        t -= speed
        cylinder.rotation.y = t

        // Emit active card index only when it changes
        const active = Math.round(-t / cardSpacing) % numCards
        if (active !== lastActive) {
          lastActive = active
          onActiveChange(active)
        }

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={styles.canvas} />
}
