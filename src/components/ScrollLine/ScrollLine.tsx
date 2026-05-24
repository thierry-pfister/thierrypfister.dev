'use client'

import { useEffect, useRef } from 'react'
import styles from './ScrollLine.module.css'

export default function ScrollLine() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const path = pathRef.current
    if (!wrap || !path) return

    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      path.style.strokeDashoffset = '0'
      wrap.style.height = `${document.documentElement.scrollHeight}px`
      return
    }

    path.style.strokeDashoffset = `${len}`

    const updateHeight = () => {
      wrap.style.height = `${document.documentElement.scrollHeight}px`
    }
    updateHeight()

    const ro = new ResizeObserver(updateHeight)
    ro.observe(document.body)

    let raf = 0
    const tick = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0
      path.style.strokeDashoffset = `${len * (1 - progress)}`
      raf = 0
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden>
      <svg
        className={styles.svg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 50 0 Q 88 14 50 28 Q 12 44 50 60 Q 88 78 50 100"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.7"
        />
      </svg>
    </div>
  )
}
