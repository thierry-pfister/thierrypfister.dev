import Hero from '@/components/Hero/Hero'
import styles from './page.module.css'

export default function Home() {
  return (
    <main>
      <Hero />
      <section className={styles.placeholder}>
        <span className={styles.placeholderLabel}>PROJECTS_</span>
      </section>
    </main>
  )
}
