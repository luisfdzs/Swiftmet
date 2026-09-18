import type { Metadata } from 'next'
import { LabNav } from '@/components/lab/LabNav'
import { TiltCard } from '@/components/lab/TiltCard'

export const metadata: Metadata = {
  title: 'Lab 3D · alternativa sin 3D — Swiftmet (interno)',
  robots: { index: false, follow: false },
}

const CARDS = [
  { src: '/lab/spools/spool-stack.webp', width: 960, height: 1280, label: 'Bobinas apiladas' },
  { src: '/lab/spools/spool-trio.webp', width: 1280, height: 960, label: 'Trío en ángulo' },
  {
    src: '/lab/spools/spool-three-floor.webp',
    width: 960,
    height: 1280,
    label: 'Tres en el suelo',
  },
  { src: '/lab/spools/spool-pair-tarp.webp', width: 960, height: 1280, label: 'Par sobre lona' },
]

export default function CssTiltLabPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <LabNav active="/lab-3d/css-tilt" />
      <div className="page-gutter pt-32 pb-24 text-center md:pt-40">
        <p className="eyebrow">Opción 6 · alternativa sin three.js</p>
        <h1 className="text-display mx-auto mt-4 max-w-3xl text-balance">Tilt de CSS</h1>
        <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">
          Las mismas fotos recortadas, con un giro 3D calculado en CSS al mover el ratón. Cero
          WebGL, cero react-three-fiber, cero peso de bundle en producción — funciona igual en
          cualquier móvil.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {CARDS.map((card) => (
            <TiltCard key={card.src} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}
