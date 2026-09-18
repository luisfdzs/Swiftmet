'use client'

import dynamic from 'next/dynamic'

const SpoolLabScene = dynamic(
  () => import('@/components/three/SpoolLabScene').then((mod) => mod.SpoolLabScene),
  { ssr: false },
)

export function SpoolLabSceneLoader() {
  return <SpoolLabScene />
}
