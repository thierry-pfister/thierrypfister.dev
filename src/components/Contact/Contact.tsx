'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'thierrypfister@protonmail.com'

const SOCIALS = [
  { id: 'github',   label: 'GitHub',   href: 'https://github.com/thierry-pfister' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/thierry-pfister-44abb9218/' },
  { id: 'readcv',   label: 'Read.cv',  href: 'https://read.cv/'                   },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [typed,  setTyped]  = useState('')
  const [done,   setDone]   = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(EMAIL)
      setDone(true)
      return
    }
    const ctx = gsap.context(() => {
      gsap.from(
        ['#co-eyebrow', '#co-title', '#co-hand'],
        {
          opacity: 0, y: 20,
          duration: 0.85, ease: 'power3.out',
          stagger: 0.09,
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        }
      )

      ScrollTrigger.create({
        trigger: '#co-email',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          let i = 0
          const id = window.setInterval(() => {
            i++
            setTyped(EMAIL.slice(0, i))
            if (i >= EMAIL.length) {
              window.clearInterval(id)
              setDone(true)
            }
          }, 55)
        },
      })

      gsap.from(
        ['#co-copy', '#co-socials', '#co-badge'],
        {
          opacity: 0, y: 14,
          duration: 0.7, ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#co-socials',
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore — fallback would be to select text
    }
  }

  return (
    <section ref={sectionRef} className={styles.section} id="contact">
      <div className={styles.blobBut} />
      <div className={styles.blobLav} />

      <div className={styles.inner}>
        <div className={styles.eyebrow} id="co-eyebrow">CONTACT_</div>

        <h2 className={styles.title} id="co-title">
          LET&apos;S BUILD<br />
          SOMETHING<em>_</em>
        </h2>

        <div className={styles.hand} id="co-hand">your idea, my keyboard ✦</div>

        <button
          type="button"
          className={styles.email}
          id="co-email"
          onClick={handleCopy}
          aria-label={`Copy email ${EMAIL} to clipboard`}
        >
          <span className={styles.emailText}>{typed}</span>
          <span className={`${styles.cursor} ${done ? styles.cursorBlink ?? '' : ''}`} />
        </button>

        <div className={styles.copyHint} id="co-copy">
          {copied ? '✓ copied to clipboard' : 'click to copy'}
        </div>

        <div className={styles.socials} id="co-socials">
          {SOCIALS.map(s => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={styles.social}
            >
              {s.label}
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          ))}
        </div>

        <div className={styles.badge} id="co-badge">
          <div className={styles.dot} />
          open to part-time + freelance · based in switzerland
        </div>
      </div>
    </section>
  )
}
