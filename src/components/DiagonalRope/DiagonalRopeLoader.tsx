'use client'

import dynamic from 'next/dynamic'

const DiagonalRope = dynamic(() => import('./DiagonalRope'), { ssr: false })

export default function DiagonalRopeLoader() {
  return <DiagonalRope />
}
