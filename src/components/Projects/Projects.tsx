'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/projects'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

const ProjectsCanvases = dynamic(() => import('./ProjectsCanvases'), { ssr: false })

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

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

  const activeProject = projects[activeIndex]

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* Background blobs — same language as hero, more muted */}
      <div className={styles.blobLav} />
      <div className={styles.blobBut} />
      <div className={styles.blobCoral} />

      <ProjectsCanvases projects={projects} onActiveChange={handleActiveChange} />

      <div className={styles.grid} />
      <div className={styles.topGradient} />
      <div className={styles.bottomGradient} />

      {/* Header — top-left */}
      <div className={styles.header}>
        <span className={styles.label} data-proj-header>Selected projects</span>
        <h2 className={styles.title} data-proj-header>
          PROJECTS<em className={styles.underscore}>_</em>
        </h2>
        <span className={styles.hand} data-proj-header>some of my favourite builds</span>
      </div>

      {/* Active project — bottom-left, remounts on change to trigger fade-in */}
      {activeProject && (
        <div key={activeIndex} className={styles.activeProject}>
          <span className={styles.activeCount}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <h3 className={styles.activeTitle}>{activeProject.title}</h3>
          <div className={styles.activeTags}>
            {activeProject.tags.map(tag => (
              <span key={tag} className={styles.activeTag}>{tag}</span>
            ))}
          </div>
          <p className={styles.activeDesc}>{activeProject.description}</p>
        </div>
      )}

    </section>
  )
}
