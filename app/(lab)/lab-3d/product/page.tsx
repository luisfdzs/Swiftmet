import type { Metadata } from 'next'
import Image from 'next/image'
import { LabNav } from '@/components/lab/LabNav'

export const metadata: Metadata = {
  title: 'Lab 3D · ficha de producto — Swiftmet (interno)',
  robots: { index: false, follow: false },
}

const SPECS = [
  { label: 'Grado', value: '1090' },
  { label: 'Pureza', value: '99.90 % min' },
  { label: 'Diámetro', value: '1.50 mm and above' },
  { label: 'Resistencia a tracción', value: '15–16 kg/mm²' },
  { label: 'Alargamiento', value: 'above 1 %' },
  {
    label: 'Embalaje',
    value: 'Bobinas sin empalmes en cajas de cartón ondulado, envío por carretera o por barco',
  },
]

export default function ProductLabPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <LabNav active="/lab-3d/product" />
      <article className="page-gutter pt-32 pb-24 text-center md:pt-40">
        <p className="eyebrow">Opción 3 · maqueta de una ficha de producto (sin 3D)</p>
        <p className="eyebrow mt-6 text-ink-faint">Hilo de metalizado</p>
        <h1 className="text-display mx-auto mt-4 max-w-3xl text-balance">1090 Metallising Wire</h1>
        <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">
          Una décima por encima del 1080, para trabajos en los que la densidad óptica del depósito
          se especifica y se audita.
        </p>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-16">
          <div className="md:order-2 md:col-span-5 md:flex md:flex-col">
            <h2 className="eyebrow border-b border-line pb-4">Especificaciones</h2>
            <dl className="mt-6 grid gap-4">
              {SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between gap-6 border-b border-line pb-3"
                >
                  <dt className="text-small text-ink-soft">{spec.label}</dt>
                  <dd className="figure-num text-right text-small text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 border-t-2 border-signal pt-4 text-small text-ink-soft">
              Se sirve bobinado. Ver el programa de bobinas →
            </p>

            <p className="mt-12 border-t border-line pt-8">
              <span className="link-underline tap text-lead text-ink">Consultar precio</span>
            </p>

            {/* AQUÍ va hoy el hueco de archivo de Pexels — ver product.second en
                app/(site)/[locale]/products/[slug]/page.tsx. Esta es la foto real
                recortada en el mismo sitio, con el mismo pie de cuatro líneas. */}
            <figure className="mt-12 hidden min-h-64 grow flex-col overflow-hidden md:flex">
              <div className="flex grow items-center justify-center bg-paper-deep/50 p-6">
                <Image
                  src="/lab/spools/spool-trio.webp"
                  alt=""
                  width={1280}
                  height={960}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="max-h-64 w-auto object-contain"
                />
              </div>
              <figcaption className="mt-4 border-t border-line pt-3 text-center">
                <p className="text-lead leading-tight">1090 Metallising Wire</p>
                <p className="figure-num mt-1 text-small text-signal">99.90 % min</p>
                <p className="eyebrow mt-2">Hilo de metalizado</p>
                <p className="mt-2 text-small text-ink-soft">
                  Tres bobinas reales de fábrica, foto de Swiftmet — no archivo de Pexels.
                </p>
              </figcaption>
            </figure>
          </div>

          <div className="md:order-1 md:col-span-7">
            <div
              role="img"
              aria-label="Foto pendiente: portada de producto"
              style={{ aspectRatio: '4 / 3' }}
              className="placeholder-grid relative flex w-full flex-col items-center justify-end gap-1 border border-line p-4 text-center"
            >
              <p className="eyebrow text-ink-soft">Foto pendiente</p>
              <p className="text-small text-ink">1090 Metallising Wire</p>
            </div>

            <div className="mt-10 grid gap-6 text-left">
              <p className="text-ink-soft">
                El mismo trazo de hilo y el mismo bobinado sin empalmes que el 1080, desde bobina de
                99,90 %. El temple más blando que trae la mayor pureza es lo que hace que el rango
                de tracción sea algo más bajo, y conviene saberlo antes de ajustar la alimentación
                de hilo.
              </p>
              <p className="text-ink-soft">
                Se elige cuando el film metalizado tiene que sostener una especificación de barrera
                u óptica en toda la bobina, no de media.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
