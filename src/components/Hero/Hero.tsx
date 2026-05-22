'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import HeroDoodles from './HeroDoodles'
import styles from './Hero.module.css'

const HeroCanvases = dynamic(() => import('./HeroCanvases'), { ssr: false })

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Load animations ── */
      gsap.from('#bred',   { opacity: 0, scale: .5, duration: 2,   ease: 'power3.out', delay: .05 })
      gsap.from('#blav',   { opacity: 0, scale: .5, duration: 2,   ease: 'power3.out', delay: .15 })
      gsap.from('#bbut',   { opacity: 0, scale: .5, duration: 1.8, ease: 'power3.out', delay: .1 })
      gsap.from('#bblush', { opacity: 0, scale: .5, duration: 1.8, ease: 'power3.out', delay: .2 })
      gsap.from('#tp',     { opacity: 0, y: 80,  duration: 1.1, ease: 'power4.out', delay: .4 })
      gsap.from('#tbdr',   { opacity: 0, y: 60,  duration: 1,   ease: 'power4.out', delay: .54 })
      gsap.from('#hand-layer', { opacity: 0, y: -40, duration: 1.1, ease: 'back.out(1.5)', delay: .72 })
      // #vtxt lifted to page level — animated by SwitzerlandLabel
      gsap.from('#bottom-row', { opacity: 0, y: 20, duration: .7, ease: 'power3.out', delay: .78 })
      /* doodles fade in staggered */
      const doodles = ['#d1','#d2','#d3','#d4','#d5','#d6','#d7','#d8','#d9']
      doodles.forEach((sel, i) => {
        gsap.to(sel, { opacity: 1, duration: .6, ease: 'power2.out', delay: .9 + i * 0.08 })
      })

      /* ── Float loops ── */
      gsap.to('#hand-layer',   { y: 5,  duration: 4,   ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 })
      gsap.to('#d1',           { y: -5, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 })
      gsap.to('#d4',           { y: 4,  duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 })
      gsap.to('#d9',           { y: -4, x: 3, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.0 })
    }, heroRef)

    /* ── Mouse parallax ── */
    const onMouse = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth  - 0.5
      const my = e.clientY / window.innerHeight - 0.5
      gsap.to('#bred',         { x: mx * -25, y: my * -18, duration: 2.2, ease: 'power1.out' })
      gsap.to('#blav',         { x: mx * 20,  y: my * 14,  duration: 2,   ease: 'power1.out' })
      gsap.to('#tp',           { x: mx * 8,   y: my * 5,   duration: 1.5, ease: 'power2.out' })
      gsap.to('#tbdr',         { x: mx * -5,  y: my * -3,  duration: 1.8, ease: 'power2.out' })
      gsap.to('#hand-layer',   { x: mx * 15,  y: my * 9,   duration: 1.2, ease: 'power2.out' })
      gsap.to('#d3',           { x: mx * 6,               duration: 2,   ease: 'power1.out' })
      gsap.to('#d5',           { x: mx * 10,  y: my * 6,   duration: 1.8, ease: 'power1.out' })
    }

    /* ── Scroll ── */
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 1)
      gsap.to('#tp',           { y: -p * 50, opacity: 1 - p * .7, duration: .1, ease: 'none' })
      gsap.to('#tbdr',         { y: -p * 30, opacity: 1 - p * .7, duration: .1, ease: 'none' })
      gsap.to('#hand-layer',   { y: 5 - p * 40, opacity: 1 - p * .8, duration: .1, ease: 'none' })
      gsap.to('#bred',         { y: -p * 35, opacity: .58 - p * .58, duration: .1, ease: 'none' })
      gsap.to('#blav',         { y: -p * 25, opacity: .62 - p * .62, duration: .1, ease: 'none' })
      gsap.to('[data-doodle]', { opacity: p > 0.1 ? 0 : 1, duration: .2, ease: 'none' })
      // vtxt scroll handled by SwitzerlandLabel
    }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('scroll', onScroll)

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero}>

      {/* Blobs */}
      <div className={styles.blobRed}   id="bred" />
      <div className={styles.blobLav}   id="blav" />
      <div className={styles.blobBut}   id="bbut" />
      <div className={styles.blobBlush} id="bblush" />

      {/* Editorial grid */}
      <div className={styles.grid} />

      {/* 3D — client-side only, no SSR */}
      <HeroCanvases />

      {/* Editorial marks */}
      <div className={`${styles.plus} ${styles.plus1}`}>+</div>
      <div className={`${styles.plus} ${styles.plus2}`}>+</div>
      <div className={`${styles.plus} ${styles.plus3}`}>+</div>
      <div className={`${styles.plus} ${styles.plus4}`}>+</div>

      {/* Doodles */}
      <HeroDoodles />

      {/* Type block */}
      <div className={styles.typeBlock}>
        <div className={styles.handLayer} id="hand-layer">
          <span className={styles.hand1}>freelance dev &amp; creator ✦</span>
        </div>
        <span className={styles.titlePfstr} id="tp">
          PFSTR<em>_</em>
        </span>
        <div className={styles.titleBdr} id="tbdr">
          <span className={styles.wBuild}>BUILD</span>
          <span className={styles.wDeploy}>DEPLOY</span>
          <span className={styles.wRepeat}>REPEAT.</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className={styles.bottomRow} id="bottom-row">
        <div className={styles.infoBlock}>
          <div className={styles.infoName}>I&apos;m Thierry Pfister</div>
          <div className={styles.infoSub}>Dev · designer · builder · Switzerland</div>
        </div>
        <div className={styles.btns}>
          <button className={styles.btnMain}>
            Let&apos;s work together
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className={styles.btnSec}>
            <div className={styles.playBtn}>
              <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
                <path d="M1 1L8 5L1 9V1Z" fill="currentColor"/>
              </svg>
            </div>
            View my work
          </button>
        </div>
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          Scroll to explore
          <div className={styles.scrollCircle}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
              <path d="M4.5 1V10M1 6.5L4.5 10L8 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

    </section>
  )
}
