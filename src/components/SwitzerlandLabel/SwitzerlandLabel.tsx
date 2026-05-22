'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './SwitzerlandLabel.module.css'

gsap.registerPlugin(ScrollTrigger)

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

function tangentAngle(pathEl: SVGPathElement, dist: number, len: number) {
  const p1 = pathEl.getPointAtLength(Math.max(0, dist - 1))
  const p2 = pathEl.getPointAtLength(Math.min(len, dist + 1))
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI)
}

export default function SwitzerlandLabel() {
  const line1Ref   = useRef<HTMLDivElement>(null)
  const dot1Ref    = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const dot2Ref    = useRef<HTMLDivElement>(null)
  const line2Ref   = useRef<HTMLDivElement>(null)
  const ghostBtnRef = useRef<HTMLButtonElement>(null)
  const pathRef    = useRef<SVGPathElement>(null)

  useEffect(() => {
    const pathEl   = pathRef.current
    const text     = textRef.current
    const ghostBtn = ghostBtnRef.current
    const all      = [line1Ref, dot1Ref, textRef, dot2Ref, line2Ref].map(r => r.current)
    if (!pathEl || !text || !ghostBtn || all.some(e => !e)) return

    const pieces  = all as HTMLDivElement[]
    const realBtn = document.getElementById('btn-work') as HTMLElement | null

    const vw = window.innerWidth
    const vh = window.innerHeight

    const GAP   = 14
    const LINE  = 40
    const DOT   = 4
    const textW = text.offsetWidth
    const total = LINE + GAP + DOT + GAP + textW + GAP + DOT + GAP + LINE
    const half  = total / 2

    const startX = vw - 18 - half
    const startY = vh / 2
    const btnX   = vw * 0.49
    const btnY   = vh - 42
    const endX   = 44
    const endY   = vh + 48 + vh * 0.5

    pathEl.setAttribute('d', [
      `M ${startX} ${startY}`,
      `C ${startX - vw * 0.059} ${startY + vh * 0.189},`,
      `  ${btnX   + vw * 0.146} ${btnY   - vh * 0.087},`,
      `  ${btnX} ${btnY}`,
      `C ${btnX - vw * 0.174} ${btnY + vh * 0.080},`,
      `  ${endX  + vw * 0.053} ${endY  - vh * 0.322},`,
      `  ${endX} ${endY}`,
    ].join(' '))

    const pathLen = pathEl.getTotalLength()

    const offsets = [
      LINE / 2 - half,
      LINE + GAP + DOT / 2 - half,
      LINE + GAP + DOT + GAP + textW / 2 - half,
      LINE + GAP + DOT + GAP + textW + GAP + DOT / 2 - half,
      LINE + GAP + DOT + GAP + textW + GAP + DOT + GAP + LINE / 2 - half,
    ]

    pieces.forEach(el => gsap.set(el, { xPercent: -50, yPercent: -50 }))
    gsap.set(ghostBtn, { xPercent: -50, yPercent: -50, opacity: 0 })

    // Find progress at which path center reaches the button (y = btnY)
    let lo = 0, hi = 0.75
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2
      if (pathEl.getPointAtLength(mid * pathLen).y < btnY) lo = mid
      else hi = mid
    }
    const crossProgress = (lo + hi) / 2
    const FADE = 0.05

    const place = (progress: number) => {
      const dist  = progress * pathLen
      const pt    = pathEl.getPointAtLength(dist)
      const blend = smoothstep(0, 0.12, progress) * smoothstep(1, 0.88, progress)

      // Label pieces → path-following
      pieces.forEach((el, i) => {
        const off = offsets[i] ?? 0
        const od  = Math.max(0, Math.min(pathLen, dist + off))
        const ePt = pathEl.getPointAtLength(od)
        const ang = tangentAngle(pathEl, od, pathLen)

        gsap.set(el, {
          x:        lerp(pt.x,       ePt.x, blend),
          y:        lerp(pt.y + off, ePt.y, blend),
          rotation: lerp(90,         ang,   blend),
        })
      })

      // Crossfade between label and button
      const t = smoothstep(crossProgress - FADE, crossProgress + FADE, progress)

      // Label pieces fade out as button fades in
      pieces.forEach(el => gsap.set(el, { opacity: 1 - t }))

      // Ghost button follows path center, slides in from where label was
      gsap.set(ghostBtn, { opacity: t, x: pt.x, y: pt.y, rotation: 0 })

      // Real button fades out in sync
      if (realBtn) gsap.set(realBtn, { opacity: 1 - t })
    }

    place(0)

    const ctx = gsap.context(() => {
      pieces.forEach(el =>
        gsap.from(el, { opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.85 })
      )

      ScrollTrigger.create({
        trigger: document.body,
        start:   'top top',
        end:     `+=${endY - vh / 2}`,
        scrub:   1.5,
        onUpdate: self => place(self.progress),
      })
    })

    return () => {
      ctx.revert()
      if (realBtn) gsap.set(realBtn, { opacity: 1 })
    }
  }, [])

  return (
    <>
      <svg
        aria-hidden
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: 0,
          pointerEvents: 'none', overflow: 'visible', opacity: 0,
        }}
      >
        <path ref={pathRef} d="" fill="none" />
      </svg>

      <div ref={line1Ref} className={styles.vtLine} />
      <div ref={dot1Ref}  className={styles.vtDot} />
      <div ref={textRef}  className={styles.vtText}>Based in Switzerland</div>
      <div ref={dot2Ref}  className={styles.vtDot} />
      <div ref={line2Ref} className={styles.vtLine} />

      <button ref={ghostBtnRef} className={styles.ghostBtn} aria-hidden tabIndex={-1}>
        Let&apos;s work together
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </>
  )
}
