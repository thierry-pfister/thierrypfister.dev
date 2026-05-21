'use client'

import { useEffect, useRef } from 'react'
import type { BufferAttribute } from 'three'
import styles from './Hero.module.css'

interface Props {
  mouseRef: React.RefObject<{ x: number; y: number }>
}

export default function BlobCanvas({ mouseRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let dispose: (() => void) | undefined

    import('three').then((THREE) => {
      if (cancelled || !canvas) return

      const w = canvas.offsetWidth || 380
      const h = canvas.offsetHeight || 380
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h)

      const scene = new THREE.Scene()
      const cam = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
      cam.position.set(0, 0, 4.5)

      scene.add(new THREE.AmbientLight(0xF4F0E8, 0.5))
      const l1 = new THREE.PointLight(0xF2B89A, 4, 12)
      l1.position.set(-2, 2, 3)
      scene.add(l1)
      const l2 = new THREE.PointLight(0xE8604A, 2.5, 8)
      l2.position.set(2, -1, 2)
      scene.add(l2)
      scene.add(Object.assign(new THREE.DirectionalLight(0xffffff, 0.5), { position: { x: 0, y: 3, z: 1 } }))

      const geo = new THREE.IcosahedronGeometry(1.4, 4)
      const posAttr = geo.getAttribute('position') as BufferAttribute
      const origPos = new Float32Array(posAttr.array as Float32Array)
      const mat = new THREE.MeshPhongMaterial({
        color: 0xF2B89A, shininess: 110,
        specular: 0xffffff, transparent: true, opacity: 0.9,
      })
      const blob = new THREE.Mesh(geo, mat)
      blob.position.set(0.3, 0.2, 0)
      scene.add(blob)

      let animId: number
      let t = 0
      const tick = () => {
        animId = requestAnimationFrame(tick)
        t += 0.009
        const { x, y } = mouseRef.current ?? { x: 0, y: 0 }

        const pos = posAttr.array as Float32Array
        for (let i = 0; i < pos.length; i += 3) {
          const ox = origPos[i] ?? 0
          const oy = origPos[i + 1] ?? 0
          const oz = origPos[i + 2] ?? 0
          const n =
            Math.sin(ox * 2.2 + t * 0.7) * 0.1 +
            Math.sin(oy * 1.8 + t * 0.5) * 0.08 +
            Math.cos(oz * 2 + t * 0.6) * 0.07
          pos[i]     = ox + (ox / 1.4) * n
          pos[i + 1] = oy + (oy / 1.4) * n
          pos[i + 2] = oz + (oz / 1.4) * n
        }
        posAttr.needsUpdate = true
        geo.computeVertexNormals()

        blob.rotation.y = t * 0.25 + x * 0.1
        blob.rotation.x = t * 0.15 + y * 0.08
        blob.position.y = 0.2 + Math.sin(t * 0.5) * 0.12
        l1.position.x = Math.sin(t * 0.5) * -3
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

  return <canvas ref={canvasRef} id="canvas-right" className={styles.canvasRight} />
}
