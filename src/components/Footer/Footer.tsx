'use client'

import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* ── Status bar ── */}
        <div className={styles.statusBar}>
          <span className={styles.statusItem}>
            <span className={styles.statusDot} />
            live
          </span>
          <span className={styles.sep}>/</span>
          <span className={styles.statusItem}>main</span>
          <span className={styles.sep}>/</span>
          <span className={styles.statusItem}>#a3f8c1d</span>
          <span className={styles.sep}>/</span>
          <span className={styles.statusItem}>build 0:23s</span>
          <span className={styles.spacer} />
          <span className={styles.statusItem}>v1.0.0</span>
        </div>

        {/* ── Brand wordmark ── */}
        <h2 className={styles.brand}>
          PFSTR<em>_</em>
        </h2>

        <div className={styles.tagline}>
          BUILD <span className={styles.bullet}>·</span> DEPLOY <span className={styles.bullet}>·</span> REPEAT
        </div>

        {/* ── Divider ── */}
        <div className={styles.divider} />

        {/* ── Meta row ── */}
        <div className={styles.meta}>
          <div className={styles.metaLeft}>
            <div className={styles.copyright}>© {year} Thierry Pfister</div>
            <div className={styles.subline}>made with care in switzerland ✦</div>
          </div>

          <button
            type="button"
            className={styles.topBtn}
            onClick={handleTop}
            aria-label="Back to top"
          >
            <span>back to top</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M6 11V1M2 5L6 1L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
