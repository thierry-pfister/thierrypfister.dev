'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'

const CICDPipeline3D = dynamic(() => import('./CICDPipeline3D'), { ssr: false })
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        ['#ab-eyebrow', '#ab-title', '#ab-hand', '#ab-body', '#ab-badge'],
        {
          opacity: 0,
          y: 18,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.about} id="about">
      <div className={styles.blobBut} />
      <div className={styles.blobLav} />
      <div className={styles.grid} />

      <div className={styles.knotWrap}>
        <CICDPipeline3D />
      </div>

      <div className={styles.inner}>
        <div className={styles.eyebrow} id="ab-eyebrow">ABOUT_</div>

        <h2 className={styles.title} id="ab-title">
          BUILDING<br />
          THINGS<em>_</em>
        </h2>

        <div className={styles.hand} id="ab-hand">
          freelance dev in progress ✦
        </div>

        <p className={styles.body} id="ab-body">
          I&apos;m Thierry — a full-stack developer based in Switzerland.
          I build fast, clean products for the web.
          Freelancing on the side, always shipping something new.
        </p>

        <div className={styles.badge} id="ab-badge">
          <div className={styles.dot} />
          Available for freelance
        </div>
      </div>
    </section>
  )
}
