'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
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
      gsap.from('#vtxt',   { opacity: 0, x: 20,  duration: .8,  ease: 'power3.out', delay: .85 })
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
      gsap.to('#vtxt',         { opacity: 1 - p * 2, duration: .1, ease: 'none' })
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
      <div className={`${styles.doodle} ${styles.d1}`} id="d1" data-doodle>
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <path d="M35 8 C52 6,64 18,63 34 C62 52,48 64,32 63 C16 62,5 49,7 33 C9 17,22 7,35 8 Z" stroke="rgba(0,0,0,0.18)" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeDasharray="3 4"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d2}`} id="d2" data-doodle>
        <svg width="56" height="28" viewBox="0 0 56 28" fill="none">
          <path d="M4 14 C12 8,28 6,44 14" stroke="rgba(0,0,0,0.2)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
          <path d="M38 8 L44 14 L38 20" stroke="rgba(0,0,0,0.2)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d3}`} id="d3" data-doodle>
        <svg width="320" height="18" viewBox="0 0 320 18" fill="none">
          <path d="M4 10 C30 3,60 16,90 9 C120 2,150 15,180 9 C210 3,240 14,270 8 C290 4,310 11,316 9" stroke="rgba(91,78,170,0.35)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d4}`} id="d4" data-doodle>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M22 22 C22 18,26 15,30 18 C34 21,33 28,28 31 C22 34,15 31,13 25 C11 18,15 11,22 9 C30 7,38 12,40 20" stroke="rgba(0,0,0,0.16)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d5}`} id="d5" data-doodle>
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
          <path d="M4 8 C20 4,50 20,80 30 C100 38,114 44,116 52" stroke="rgba(232,96,74,0.3)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M110 50 L116 52 L112 58" stroke="rgba(232,96,74,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d6}`} id="d6" data-doodle>
        <svg width="22" height="160" viewBox="0 0 22 160" fill="none">
          <path d="M18 4 C8 12,4 36,6 80 C4 124,8 148,18 156" stroke="rgba(0,0,0,0.12)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d7}`} id="d7" data-doodle>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line x1="10" y1="2" x2="10" y2="18" stroke="rgba(0,0,0,0.18)" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="2" y1="10" x2="18" y2="10" stroke="rgba(0,0,0,0.18)" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="4" y1="4" x2="16" y2="16" stroke="rgba(0,0,0,0.12)" strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="16" y1="4" x2="4" y2="16" stroke="rgba(0,0,0,0.12)" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d8}`} id="d8" data-doodle>
        <svg width="200" height="12" viewBox="0 0 200 12" fill="none">
          <path d="M2 6 C30 2,70 10,110 5 C150 0,180 8,198 5" stroke="rgba(200,168,48,0.4)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={`${styles.doodle} ${styles.d9}`} id="d9" data-doodle>
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path d="M19 4 C28 3,35 10,34 19 C33 28,26 35,17 34 C8 33,2 26,3 17 C4 8,11 3,19 4" stroke="rgba(91,78,170,0.22)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

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

      {/* Vertical text */}
      <div className={styles.verticalText} id="vtxt">
        <div className={styles.vtLine} />
        <div className={styles.vtDot} />
        <div className={styles.vtText}>Based in Switzerland</div>
        <div className={styles.vtDot} />
        <div className={styles.vtLine} />
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
