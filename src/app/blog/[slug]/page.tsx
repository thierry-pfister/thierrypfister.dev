import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPost } from '@/lib/api'
import styles from './page.module.css'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) return { title: 'Not found — PFSTR_' }
  return {
    title:       `${post.title} — PFSTR_`,
    description: post.summary,
  }
}

export default async function BlogPost(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) notFound()

  return (
    <main className={styles.page}>
      <div className={styles.blobBut} />

      <article className={styles.article}>
        <Link href="/blog" className={styles.back}>
          <span aria-hidden>←</span> back to writing
        </Link>

        <div className={styles.eyebrow}>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.readingMinutes && (
            <>
              <span className={styles.sep}>·</span>
              <span>{post.readingMinutes} min read</span>
            </>
          )}
        </div>

        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.summary}>{post.summary}</p>

        {post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        )}

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className={styles.cover}
          />
        )}

        {/* TODO: render markdown — drop in `react-markdown` (or similar)
             when the first post arrives. For scaffolding, raw content shows
             with whitespace preserved. */}
        <div className={styles.content}>{post.content}</div>

        <footer className={styles.footer}>
          <Link href="/blog" className={styles.back}>
            <span aria-hidden>←</span> back to writing
          </Link>
        </footer>
      </article>
    </main>
  )
}
