'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './SwitzerlandLabel.module.css'

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger)

export default function SwitzerlandLabel() {
  const labelRef = useRef<HTMLDivElement>(null)
  const pathRef  = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el   = labelRef.current
    const path = pathRef.current
    if (!el || !path) return

    const vw = window.innerWidth
    const vh = window.innerHeight

    // ── Key points in document coordinates ──────────────────────────────────
    // Start: centre of the rotated "Based in Switzerland" element.
    // right:18px positions the element's right edge; after rotate(90deg) the
    // visual centre shifts left by half the element's unrotated width.
    const startX = vw - 18 - el.offsetWidth / 2
    const startY = vh / 2

    // "Let's work together" button — centre of bottom row, near hero bottom
    const btnX = vw * 0.49
    const btnY = vh - 42

    // Far-left of projects section — halfway into the section vertically
    const endX = 44
    const endY = vh + 48 + vh * 0.5   // hero + marquee + half projects height

    // ── Control points (proportional offsets from reference geometry) ────────
    const d = [
      `M ${startX} ${startY}`,
      `C ${startX - vw * 0.059} ${startY + vh * 0.189},`,
      `  ${btnX   + vw * 0.146} ${btnY   - vh * 0.087},`,
      `  ${btnX} ${btnY}`,
      `C ${btnX - vw * 0.174} ${btnY + vh * 0.080},`,
      `  ${endX  + vw * 0.053} ${endY  - vh * 0.322},`,
      `  ${endX} ${endY}`,
    ].join(' ')

    path.setAttribute('d', d)

    // ── GSAP — all transforms managed here, no CSS transform on the element ──
    gsap.set(el, { rotate: 90, xPercent: -50, yPercent: -50 })

    const ctx = gsap.context(() => {
      gsap.from(el, { opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.85 })

      // Animation ends when element reaches left of projects section.
      // scroll_end ≈ endY - vh/2 keeps the endpoint centred in the viewport.
      const scrollEnd = endY - vh / 2

      gsap.to(el, {
        motionPath: { path: '#swz-path', autoRotate: false },
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end:   `+=${scrollEnd}`,
          scrub: 1.5,
        },
      })
    })

    return () => ctx.revert()
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
        <path ref={pathRef} id="swz-path" d="" fill="none" />
      </svg>

      <div ref={labelRef} className={styles.label}>
        <div className={styles.vtLine} />
        <div className={styles.vtDot} />
        <div className={styles.vtText}>Based in Switzerland</div>
        <div className={styles.vtDot} />
        <div className={styles.vtLine} />
      </div>
    </>
  )
}
