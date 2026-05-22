export type ProjectLink = {
  label: string
  url: string
}

export type Project = {
  id: string
  title: string
  slug: string
  summary: string
  content: string | null
  status: 'Active' | 'Archived'
  techStack: string[]
  links: ProjectLink[]
  displayOrder: number
  createdAt: string
}
