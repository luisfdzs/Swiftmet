import type { Metadata } from 'next'
import { LabNav } from '@/components/lab/LabNav'
import { SpoolLabSceneLoader } from '@/components/three/SpoolLabSceneLoader'

export const metadata: Metadata = {
  title: 'Lab 3D · /company — Swiftmet (interno)',
  robots: { index: false, follow: false },
}

export default function CompanyLabPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <LabNav active="/lab-3d/company" />
      <div className="page-gutter pt-32 pb-24 text-center md:pt-40">
        <p className="eyebrow">Opción 4 · maqueta de /company</p>
        <h1 className="text-display mx-auto mt-4 max-w-3xl text-balance">
          Swiftmet Wire &amp; Resin
        </h1>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:mt-24">
          <p className="text-lead text-balance">
            Fabricante indio de hilo y varilla de aluminio de alta pureza para metalizado al vacío.
          </p>
          <p className="text-ink-soft">
            Planta y domicilio social en India, con control de calidad en cada bobina que sale de
            fábrica.
          </p>
        </div>

        <dl className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-16 gap-y-8 border-t border-line pt-8">
          <div>
            <dt className="eyebrow">Constituida</dt>
            <dd className="figure-num mt-1 text-lead text-ink">2010</dd>
          </div>
        </dl>

        <h2 className="eyebrow mt-(--spacing-section) border-b border-line pb-4">
          Planta y domicilio social
        </h2>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-16 gap-y-8">
          <li>
            <p className="eyebrow text-ink-soft">Planta</p>
            <p className="mt-1 text-small text-ink">India</p>
          </li>
          <li>
            <p className="eyebrow text-ink-soft">Domicilio social</p>
            <p className="mt-1 text-small text-ink">India</p>
          </li>
        </ul>

        {/* LA SECCIÓN NUEVA: la vitrina 3D, con las fotos reales de fábrica. No sustituye
            nada — se añade después de las plantas, como prueba de que la fábrica existe,
            sin competir con el argumento técnico de /spools. */}
        <h2 className="eyebrow mt-(--spacing-section) border-b border-line pb-4">
          La planta, en imágenes reales
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-ink-soft">
          Bobinas tal como salen de producción, fotografiadas en fábrica — arrastra para girarlas.
        </p>
        <div className="relative mt-10 h-[28rem] overflow-hidden border border-line bg-inverse">
          <SpoolLabSceneLoader />
        </div>
      </div>
    </div>
  )
}
