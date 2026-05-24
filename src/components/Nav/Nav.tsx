'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './Nav.module.css'

const links = [
  { label: 'Work',    href: '/#work' },
  { label: 'About',   href: '/#about' },
  { label: 'Stack',   href: '/#stack' },
  { label: 'Writing', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  // Lock body scroll when drawer is open + close on Escape
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            PFSTR<em className={styles.underscore}>_</em>
          </Link>
          <span className={styles.location}>based in switzerland</span>
        </div>

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
          <button
            className={`${styles.menu} ${open ? styles.menuOpen ?? '' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        className={`${styles.drawer} ${open ? styles.drawerOpen ?? '' : ''}`}
        aria-hidden={!open}
      >
        <ul className={styles.drawerLinks}>
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={styles.drawerLink}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Backdrop */}
      {open && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
