import Link from 'next/link'
import type { Metadata } from 'next'
import { fetchPosts } from '@/lib/api'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Writing — PFSTR_',
  description: 'Working notes on building, shipping, and the tools I reach for.',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default async function BlogIndex() {
  const posts = await fetchPosts()

  return (
    <main className={styles.page}>
      <div className={styles.blobBut} />
      <div className={styles.blobLav} />

      <div className={styles.inner}>
        {/* ── Intro ── */}
        <header className={styles.intro}>
          <div className={styles.eyebrow}>WRITING_</div>
          <h1 className={styles.title}>NOTES<em>_</em></h1>
          <div className={styles.hand}>thoughts in progress ✦</div>
          <p className={styles.body}>
            Working notes on building, shipping, and the tools I reach for.
            No SEO games, no influencer takes — just what I&apos;d tell a friend
            in a coffee shop.
          </p>
        </header>

        {/* ── Feed ── */}
        <section className={styles.feed}>
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyHand}>first post landing soon ✦</div>
              <p className={styles.emptyText}>
                Nothing published yet — the ink is still wet. Check back, or just
                <Link href="/#contact" className={styles.emptyLink}> drop a line</Link>.
              </p>
            </div>
          ) : (
            <ul className={styles.list}>
              {posts.map(post => (
                <li key={post.id} className={styles.row}>
                  <Link href={`/blog/${post.slug}`} className={styles.card}>
                    <div className={styles.cardMeta}>
                      <time dateTime={post.publishedAt} className={styles.date}>
                        {formatDate(post.publishedAt)}
                      </time>
                      {post.readingMinutes && (
                        <span className={styles.read}>· {post.readingMinutes} min read</span>
                      )}
                    </div>

                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    {post.subtitle && (
                      <p className={styles.cardSubtitle}>{post.subtitle}</p>
                    )}
                    <p className={styles.cardSummary}>{post.summary}</p>

                    {post.tags.length > 0 && (
                      <div className={styles.tags}>
                        {post.tags.map(t => (
                          <span key={t} className={styles.tag}>{t}</span>
                        ))}
                      </div>
                    )}

                    <span className={styles.arrow} aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
