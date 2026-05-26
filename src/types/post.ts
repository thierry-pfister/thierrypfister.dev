export type PostTag = string

export type Post = {
  id:              string
  slug:            string
  title:           string
  summary:         string
  subtitle?:       string | null
  content:         string        // raw markdown — rendered downstream
  coverImage?:     string | null
  canonicalUrl?:   string | null
  publishedAt:     string        // ISO 8601
  tags:            PostTag[]
  status:          'Draft' | 'Published' | 'Archived'
  readingMinutes?: number | null
}
