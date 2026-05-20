import Link from 'next/link'
import styles from './Nav.module.css'

const links = [
  { label: 'Work',     href: '#work' },
  { label: 'About',    href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Stack',    href: '#stack' },
  { label: 'Contact',  href: '#contact' },
]

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        PFSTR<em className={styles.underscore}>_</em>
      </Link>

      <ul className={styles.links}>
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link href={href} className={styles.link}>{label}</Link>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        <div className={styles.ofw}>
          <span className={styles.ofwDot} />
          Open for work
        </div>
        <button className={styles.menu} aria-label="Open menu">
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
