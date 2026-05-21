'use client'

import dynamic from 'next/dynamic'
import styles from './Projects.module.css'

const ProjectsCanvases = dynamic(() => import('./ProjectsCanvases'), { ssr: false })

export default function Projects() {
  return (
    <section className={styles.section}>
      <ProjectsCanvases />
      <span className={styles.label}>PROJECTS_</span>
    </section>
  )
}
