import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'
import Projects from '@/components/Projects/Projects'
import About from '@/components/About/About'
import Stack from '@/components/Stack/Stack'
import Contact from '@/components/Contact/Contact'
import Footer from '@/components/Footer/Footer'
import { fetchProjects } from '@/lib/api'

export default async function Home() {
  const projects = await fetchProjects()
  return (
    <div style={{ position: 'relative' }}>
      <main>
        <Hero />
        <Marquee />
        <Projects projects={projects} />
        <About />
        <Stack />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}
