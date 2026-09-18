import type { Metadata } from 'next'
import { LabNav } from '@/components/lab/LabNav'
import { SpoolLabSceneLoader } from '@/components/three/SpoolLabSceneLoader'

export const metadata: Metadata = {
  title: 'Lab 3D · hero de portada — Swiftmet (interno)',
  robots: { index: false, follow: false },
}

const FIGURES = [
  { label: 'Pureza', value: '99.99 %' },
  { label: 'Formatos de bobina', value: '14' },
  { label: 'Rango de peso', value: '2,75 – 14,5 kg' },
  { label: 'Bobinado', value: 'Sin empalmes' },
]

export default function HeroLabPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <LabNav active="/lab-3d/hero" />
      <section className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-inverse pt-32 text-paper">
        <div className="absolute inset-0">
          <SpoolLabSceneLoader />
        </div>

        <div className="page-gutter pointer-events-none relative flex flex-col items-center gap-8 pb-16 text-center">
          <p className="eyebrow text-paper/60">Opción 5 · maqueta del hero de portada</p>
          <h1 className="text-display max-w-4xl text-balance">
            Hilo y varilla de aluminio de alta pureza para metalizado al vacío
          </h1>
          <p className="max-w-xl text-lead text-paper/75">
            Catorce formatos de bobina medidos, no «según lo que pida el cliente».
          </p>

          <dl className="mt-6 grid w-full grid-cols-2 gap-x-8 gap-y-8 border-t border-paper/20 pt-8 md:grid-cols-4">
            {FIGURES.map((figure) => (
              <div key={figure.label}>
                <dt className="eyebrow text-paper/50">{figure.label}</dt>
                <dd className="figure-num text-figure mt-2 text-paper">{figure.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  )
}
