const ITEMS = [
  'BUILD', 'DEPLOY', 'REPEAT',
  'thierrypfister.dev',
  'React', 'Next.js', 'TypeScript',
  'Three.js', 'GSAP', 'F#',
  'PostgreSQL', 'Docker', 'ASP.NET Core',
]

import styles from './Marquee.module.css'

function Strip() {
  return (
    <div className={styles.strip} aria-hidden>
      {ITEMS.map((item, i) => (
        <span key={i} className={styles.item}>
          {item}
          <span className={styles.dot} />
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className={styles.wrapper} aria-label="BUILD · DEPLOY · REPEAT">
      <div className={styles.track}>
        <Strip />
        <Strip />
      </div>
    </div>
  )
}
