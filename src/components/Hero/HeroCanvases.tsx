'use client'

import { useEffect, useRef } from 'react'
import type { BufferAttribute } from 'three'
import styles from './Hero.module.css'

export default function HeroCanvases() {
  const leftRef = useRef<HTMLCanvasElement>(null)
  const rightRef = useRef<HTMLCanvasElement>(null)

  /* ── Left: Torus Knot ── */
  useEffect(() => {
    const canvas = leftRef.current
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
      const l3 = new THREE.DirectionalLight(0xffffff, 0.4)
      l3.position.set(0, 4, 2)
      scene.add(l3)

      const geo = new THREE.TorusKnotGeometry(1.2, 0.42, 160, 20, 2, 3)
      const mat = new THREE.MeshPhongMaterial({
        color: 0x7B6EC4, shininess: 90,
        specular: 0xC4B8E8, transparent: true, opacity: 0.92,
      })
      const knot = new THREE.Mesh(geo, mat)
      knot.position.set(-0.4, -0.3, 0)
      scene.add(knot)

      const mouse = { x: 0, y: 0 }
      const onMouse = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMouse)

      let animId: number
      let t = 0
      const tick = () => {
        animId = requestAnimationFrame(tick)
        t += 0.008
        knot.rotation.x = t * 0.3 + mouse.y * 0.1
        knot.rotation.y = t * 0.4 + mouse.x * 0.12
        knot.rotation.z = t * 0.15
        l1.position.x = Math.sin(t * 0.6) * 3
        l1.position.y = Math.cos(t * 0.4) * 2
        renderer.render(scene, cam)
      }
      tick()

      dispose = () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMouse)
        renderer.dispose()
        geo.dispose()
        mat.dispose()
      }
    })

    return () => { cancelled = true; dispose?.() }
  }, [])

  /* ── Right: Morphing Blob ── */
  useEffect(() => {
    const canvas = rightRef.current
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
      const l3 = new THREE.DirectionalLight(0xffffff, 0.5)
      l3.position.set(0, 3, 1)
      scene.add(l3)

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

      const mouse = { x: 0, y: 0 }
      const onMouse = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMouse)

      let animId: number
      let t = 0
      const tick = () => {
        animId = requestAnimationFrame(tick)
        t += 0.009

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

        blob.rotation.y = t * 0.25 + mouse.x * 0.1
        blob.rotation.x = t * 0.15 + mouse.y * 0.08
        blob.position.y = 0.2 + Math.sin(t * 0.5) * 0.12
        l1.position.x = Math.sin(t * 0.5) * -3
        l1.position.y = Math.cos(t * 0.4) * 2
        renderer.render(scene, cam)
      }
      tick()

      dispose = () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMouse)
        renderer.dispose()
        geo.dispose()
        mat.dispose()
      }
    })

    return () => { cancelled = true; dispose?.() }
  }, [])

  return (
    <>
      <canvas ref={leftRef} id="canvas-left" className={styles.canvasLeft} />
      <canvas ref={rightRef} id="canvas-right" className={styles.canvasRight} />
    </>
  )
}
