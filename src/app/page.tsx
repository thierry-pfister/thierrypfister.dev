import Hero from '@/components/Hero/Hero'
import Projects from '@/components/Projects/Projects'
import { fetchProjects } from '@/lib/api'

export default async function Home() {
  const projects = await fetchProjects()
  return (
    <main>
      <Hero />
      <Projects projects={projects} />
    </main>
  )
}
