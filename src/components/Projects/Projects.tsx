'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

const ProjectsCanvases = dynamic(() => import('./ProjectsCanvases'), { ssr: false })

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-proj-header]', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* Full-bleed carousel canvas */}
      <ProjectsCanvases />

      {/* Dark gradient so header text is readable over the 3D */}
      <div className={styles.topGradient} />

      {/* Header overlay */}
      <div className={styles.header}>
        <span className={styles.label} data-proj-header>Selected projects</span>
        <h2 className={styles.title} data-proj-header>
          PROJECTS<em className={styles.underscore}>_</em>
        </h2>
        <span className={styles.hand} data-proj-header>some of my favourite builds</span>
      </div>

    </section>
  )
}
