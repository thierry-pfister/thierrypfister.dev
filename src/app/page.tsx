import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'
import Projects from '@/components/Projects/Projects'
import About from '@/components/About/About'
import SwitzerlandLabel from '@/components/SwitzerlandLabel/SwitzerlandLabel'
import dynamic from 'next/dynamic'
import { fetchProjects } from '@/lib/api'

const DiagonalRope = dynamic(() => import('@/components/DiagonalRope/DiagonalRope'), { ssr: false })

export default async function Home() {
  const projects = await fetchProjects()
  return (
    <div style={{ position: 'relative' }}>
      <DiagonalRope />
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
