'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Stack.module.css'

gsap.registerPlugin(ScrollTrigger)

interface Layer {
  id:    string
  num:   string
  label: string
  techs: string[]
  color: 'gold' | 'lav' | 'peach'
  rot:   number
  off:   number
}

const LAYERS: Layer[] = [
  { id: 'frontend', num: '06', label: 'FRONTEND', techs: ['Next.js', 'React', 'TypeScript', 'GSAP'],     color: 'gold',  rot: -1.2, off:   0 },
  { id: 'styling',  num: '05', label: 'STYLING',  techs: ['CSS Modules', 'Tailwind', 'Figma'],            color: 'lav',   rot:  0.8, off:   8 },
  { id: 'backend',  num: '04', label: 'BACKEND',  techs: ['Node.js', 'tRPC', '.NET'],                     color: 'peach', rot: -0.6, off:  -6 },
  { id: 'database', num: '03', label: 'DATABASE', techs: ['PostgreSQL', 'Prisma', 'Redis'],               color: 'gold',  rot:  1.4, off:  10 },
  { id: 'infra',    num: '02', label: 'INFRA',    techs: ['Vercel', 'CI/CD', 'Docker'],                   color: 'lav',   rot: -1.0, off:  -4 },
  { id: 'tools',    num: '01', label: 'TOOLS',    techs: ['Git', 'VSCode', 'Claude', 'Notion'],           color: 'peach', rot:  0.5, off:   4 },
]

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        ['#st-eyebrow', '#st-title', '#st-hand', '#st-body'],
        {
          opacity: 0, y: 18,
          duration: 0.85, ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.from(`.${styles.card}`, {
        opacity: 0, y: -70,
        duration: 0.7, ease: 'back.out(1.3)',
        stagger: 0.08,
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: `.${styles.cards}`,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      gsap.from(`.${styles.sticker}`, {
        opacity: 0, scale: 0.3, rotation: 30,
        duration: 0.7, ease: 'back.out(1.6)',
        delay: 0.6,
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: `.${styles.stackWrap}`,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="stack">
      <div className={styles.blobBut} />
      <div className={styles.blobLav} />

      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.eyebrow} id="st-eyebrow">STACK / 04_</div>

          <h2 className={styles.title} id="st-title">
            TOOLS<br />
            I REACH<br />
            FOR<em>_</em>
          </h2>

          <div className={styles.hand} id="st-hand">shipping kit ✦</div>

          <p className={styles.body} id="st-body">
            Stack chosen for speed, clarity, and the joy of shipping clean things.
            No magic — just tools I trust, sharpened over time.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.stackWrap}>
            <div className={styles.sticker}>fresh out the box ✦</div>

            <div className={styles.cards}>
              {LAYERS.map((layer) => {
                const accentClass = styles[`accent_${layer.color}`] ?? ''
                return (
                  <article
                    key={layer.id}
                    className={`${styles.card} ${accentClass}`}
                    style={{
                      '--rot': `${layer.rot}deg`,
                      '--off': `${layer.off}px`,
                    } as React.CSSProperties}
                  >
                    <div className={styles.cardNum}>{layer.num}</div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardLabel}>{layer.label}</div>
                      <div className={styles.cardTags}>
                        {layer.techs.map(t => (
                          <span key={t} className={styles.tag}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
