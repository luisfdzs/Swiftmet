import type { Metadata } from 'next'
import { LabNav } from '@/components/lab/LabNav'
import { SpoolLabSceneLoader } from '@/components/three/SpoolLabSceneLoader'

export const metadata: Metadata = {
  title: 'Lab 3D · Escena libre — Swiftmet (interno)',
  robots: { index: false, follow: false },
}

export default function OrbitLabPage() {
  return (
    <main style={{ height: '100dvh', width: '100vw' }}>
      <LabNav active="/lab-3d/orbit" />
      <SpoolLabSceneLoader />
    </main>
  )
}
