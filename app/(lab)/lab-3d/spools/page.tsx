import type { Metadata } from 'next'
import { LabNav } from '@/components/lab/LabNav'
import { SpoolsLabView } from '@/components/lab/SpoolsLabView'

export const metadata: Metadata = {
  title: 'Lab 3D · /spools — Swiftmet (interno)',
  robots: { index: false, follow: false },
}

export default function SpoolsLabPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <LabNav active="/lab-3d/spools" />
      <div className="pt-32 pb-24 text-center md:pt-40">
        <div className="page-gutter">
          <p className="eyebrow">Opción 2 · maqueta de /spools</p>
          <h1 className="text-display mx-auto mt-4 max-w-3xl text-balance">Programa de bobinas</h1>
          <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">
            Se elige una fila y aparece su foto real flotando, en vez del dibujo técnico — que sigue
            ahí para las diez referencias que todavía no tienen fotografía.
          </p>
        </div>

        <div className="page-gutter">
          <SpoolsLabView />
        </div>
      </div>
    </div>
  )
}
