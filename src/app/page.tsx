import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'
import Projects from '@/components/Projects/Projects'
import About from '@/components/About/About'
import SwitzerlandLabel from '@/components/SwitzerlandLabel/SwitzerlandLabel'
import DiagonalRopeLoader from '@/components/DiagonalRope/DiagonalRopeLoader'
import { fetchProjects } from '@/lib/api'

export default async function Home() {
  const projects = await fetchProjects()
  return (
    <div style={{ position: 'relative' }}>
      <DiagonalRopeLoader />
      <SwitzerlandLabel />
      <main>
        <Hero />
        <Marquee />
        <Projects projects={projects} />
        <About />
      </main>
    </div>
  )
}
