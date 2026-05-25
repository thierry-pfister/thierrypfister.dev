import type { Project } from '@/types/project'
import type { Post }    from '@/types/post'

const BASE = process.env.PFSTR_API_URL ?? 'http://localhost:5199'

export async function fetchProjects(): Promise<Project[]> {
  let res: Response
  try {
    res = await fetch(`${BASE}/api/projects`, { next: { revalidate: 60 } })
  } catch {
    return []
  }
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`pfstr-core /api/projects → ${res.status}`)
  const data: Project[] = await res.json()
  return data
    .filter(p => p.status !== 'Draft' && p.status !== 'Archived')
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

// ── Posts ────────────────────────────────────────────────────────────────────
// Backend endpoint (`/api/posts`) does not exist yet — scaffolding phase.
// Network errors and 404s return empty so builds/dev keep working; once the
// endpoint ships, content will flow in automatically.

export async function fetchPosts(): Promise<Post[]> {
  let res: Response
  try {
    res = await fetch(`${BASE}/api/posts`, { next: { revalidate: 60 } })
  } catch {
    return []
  }
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`pfstr-core /api/posts → ${res.status}`)
  const data: Post[] = await res.json()
  return data
    .filter(p => p.status === 'Published')
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
}

export async function fetchPost(slug: string): Promise<Post | null> {
  let res: Response
  try {
    res = await fetch(`${BASE}/api/posts/${slug}`, { next: { revalidate: 60 } })
  } catch {
    return null
  }
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`pfstr-core /api/posts/${slug} → ${res.status}`)
  const data: Post = await res.json()
  if (data.status !== 'Published') return null
  return data
}
