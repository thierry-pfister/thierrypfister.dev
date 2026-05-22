import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'
import Projects from '@/components/Projects/Projects'
import SwitzerlandLabel from '@/components/SwitzerlandLabel/SwitzerlandLabel'
import { fetchProjects } from '@/lib/api'

export default async function Home() {
  const projects = await fetchProjects()
  return (
    <div style={{ position: 'relative' }}>
      <SwitzerlandLabel />
      <main>
        <Hero />
        <Marquee />
        <Projects projects={projects} />
      </main>
    </div>
  )
}
