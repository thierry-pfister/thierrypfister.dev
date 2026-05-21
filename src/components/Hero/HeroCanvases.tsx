'use client'

import { useEffect, useRef } from 'react'
import TorusKnotCanvas from './TorusKnotCanvas'
import BlobCanvas from './BlobCanvas'

export default function HeroCanvases() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  return (
    <>
      <TorusKnotCanvas mouseRef={mouseRef} />
      <BlobCanvas mouseRef={mouseRef} />
    </>
  )
}
