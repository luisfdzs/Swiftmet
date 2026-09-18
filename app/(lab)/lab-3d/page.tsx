import type { Metadata } from 'next'
import Link from 'next/link'
import { LabNav } from '@/components/lab/LabNav'

export const metadata: Metadata = {
  title: 'Lab 3D — Swiftmet (interno)',
  robots: { index: false, follow: false },
}

const OPTIONS = [
  {
    href: '/lab-3d/orbit',
    title: '1 · Escena libre',
    body: 'Las cuatro bobinas recortadas, flotando en anillo y orbitables con el ratón. La demo original, sin encajar en ninguna página.',
  },
  {
    href: '/lab-3d/spools',
    title: '2 · Visor en /spools',
    body: 'La página central del sitio. Se elige una fila de la tabla y aparece la foto real flotando junto a sus cotas, en vez del dibujo a escala — o al lado, para las que aún no tienen foto.',
  },
  {
    href: '/lab-3d/product',
    title: '3 · Segunda foto de la ficha de producto',
    body: 'Sin three.js. Sustituye el hueco de archivo de Pexels por la foto real, recortada, en el mismo sitio que ya existe para ella.',
  },
  {
    href: '/lab-3d/company',
    title: '4 · Vitrina en /company',
    body: 'Una sección nueva junto a la planta: las fotos de fábrica reales, en 3D, como prueba de que la fábrica existe.',
  },
  {
    href: '/lab-3d/hero',
    title: '5 · Hero de portada',
    body: 'La escena 3D sustituyendo al montaje de vídeo detrás del titular. La opción más vistosa y la más arriesgada.',
  },
  {
    href: '/lab-3d/css-tilt',
    title: '6 · Alternativa sin 3D',
    body: 'Las mismas fotos recortadas, con un tilt de CSS al pasar el ratón. Cero WebGL, cero react-three-fiber en producción.',
  },
]

export default function LabIndexPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <LabNav active="/lab-3d" />
      <div className="page-gutter mx-auto max-w-3xl pt-32 pb-24 text-center md:pt-40">
        <p className="eyebrow">Sandbox interno</p>
        <h1 className="text-display mt-4 text-balance">Bobinas reales en 3D</h1>
        <p className="mt-8 text-lead text-ink-soft">
          Seis formas de encajar las fotos de fábrica en el sitio, cada una en su propia página para
          verla en contexto antes de decidir.
        </p>

        <ul className="mt-16 grid gap-8 text-left">
          {OPTIONS.map((option) => (
            <li key={option.href} className="border-t border-line pt-6">
              <Link href={option.href} className="link-underline tap text-lead text-ink">
                {option.title}
              </Link>
              <p className="mt-2 text-ink-soft">{option.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
