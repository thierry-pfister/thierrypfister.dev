import type { Project } from '@/types/project'

const BASE = process.env.PFSTR_API_URL ?? 'http://localhost:5199'

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${BASE}/api/projects`)
  if (!res.ok) throw new Error(`pfstr-core /api/projects → ${res.status}`)
  const data: Project[] = await res.json()
  return data
    .filter(p => p.status !== 'Draft' && p.status !== 'Archived')
    .sort((a, b) => a.displayOrder - b.displayOrder)
}
