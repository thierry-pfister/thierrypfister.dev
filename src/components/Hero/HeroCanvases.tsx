'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import TorusKnotCanvas from './TorusKnotCanvas'
import BlobCanvas from './BlobCanvas'

export default function HeroCanvases() {
  const mouseRef = useRef({ x: 0, y: 0 })

  /* ── Load animations + float loops ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('#canvas-left',  { opacity: 0, x: -80, y: 80,  duration: 1.4, ease: 'power3.out', delay: .4 })
      gsap.from('#canvas-right', { opacity: 0, x: 80,  y: -80, duration: 1.4, ease: 'power3.out', delay: .5 })
      gsap.to('#canvas-left',  { y: 18,  duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 })
      gsap.to('#canvas-right', { y: -14, duration: 5,   ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 })
    })
    return () => ctx.revert()
  }, [])

  /* ── Mouse parallax + scroll ── */
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth  - 0.5
      const my = e.clientY / window.innerHeight - 0.5
      mouseRef.current.x =  mx * 2
      mouseRef.current.y = -my * 2
      gsap.to('#canvas-left',  { x: mx * -18, y: my * 12,  duration: 2.5, ease: 'power1.out' })
      gsap.to('#canvas-right', { x: mx * 14,  y: my * -10, duration: 2.5, ease: 'power1.out' })
    }
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 1)
      gsap.to('#canvas-left',  { x: -180 * p, y: 200 * p,  rotation: -180 * p, opacity: .88 - p, duration: .1, ease: 'none' })
      gsap.to('#canvas-right', { x: 180 * p,  y: -180 * p, rotation: 180 * p,  opacity: .82 - p, duration: .1, ease: 'none' })
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('scroll',    onScroll)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll',    onScroll)
    }
  }, [])

  return (
    <>
      <TorusKnotCanvas mouseRef={mouseRef} />
      <BlobCanvas mouseRef={mouseRef} />
    </>
  )
}
