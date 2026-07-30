import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SpoolDiagram } from '@/components/sections/SpoolDiagram'
import { SpoolTable } from '@/components/sections/SpoolTable'
import { Reveal } from '@/components/ui/Reveal'
import { getSpools } from '@/lib/content'
import { formatKg, formatMm } from '@/lib/format'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return { title: t.spools.title, description: t.spools.lead }
}

/**
 * EL PROGRAMA DE BOBINAS.
 *
 * Esta es la página que la competencia no tiene. Electrolead resuelve el embalaje con
 * «6.5 to 11 kg as per customer's request»; aquí están las catorce referencias con sus
 * cinco cotas y su sección dibujada a escala. Para un comprador es la diferencia entre
 * escribir un correo para preguntar si la bobina entra en su máquina y saberlo en diez
 * segundos.
 *
 * Va en tres bloques y en este orden: tabla (el dato), leyenda (qué significa cada cota)
 * y dibujos (la comprobación visual). La tabla primero porque quien ya sabe lo que busca
 * no debería tener que pasar por una explicación.
 */
export default async function SpoolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const spools = await getSpools()

  /**
   * Escala compartida por los catorce dibujos. Se calcula UNA vez aquí y se pasa a cada
   * `SpoolDiagram`: es lo único que hace las siluetas comparables entre sí. Si cada
   * dibujo se ajustara a su propia pieza, la bobina de 200 mm y la de 360 mm saldrían
   * del mismo tamaño en pantalla y el dibujo mentiría justo en lo que quiere mostrar.
   */
  const scale = {
    maxDiameter: Math.max(...spools.map((spool) => spool.flangeDiameter), 1),
    maxWidth: Math.max(...spools.map((spool) => spool.spoolWidth), 1),
  }

  const legend = [
    { cote: 'D1', label: t.spools.flangeDiameter },
    { cote: 'D2', label: t.spools.coreDiameter },
    { cote: 'D3', label: t.spools.boreHole },
    { cote: 'L1', label: t.spools.spoolWidth },
    { cote: 'L2', label: t.spools.windingWidth },
  ]

  return (
    <div className="pt-32 text-center md:pt-40">
      <div className="page-gutter">
        <h1 className="text-display mx-auto max-w-3xl text-balance">{t.spools.title}</h1>
        <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">{t.spools.lead}</p>
      </div>

      <div className="page-gutter mt-16 md:mt-24">
        <SpoolTable spools={spools} locale={locale} />
        <p className="eyebrow mt-4">{t.spools.unitsNote}</p>
      </div>

      <section className="page-gutter mt-(--spacing-section)">
        <h2 className="eyebrow border-b border-line pb-4">{t.spools.legendTitle}</h2>
        <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
          {legend.map((entry) => (
            <div key={entry.cote}>
              <dt className="figure-num text-lead text-signal">{entry.cote}</dt>
              <dd className="mt-1 text-small text-ink-soft">{entry.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {spools.length > 0 && (
        <section className="page-gutter mt-(--spacing-section)">
          <h2 className="eyebrow border-b border-line pb-4">{t.spools.drawingTitle}</h2>
          <p className="mx-auto mt-8 max-w-2xl text-ink-soft">{t.spools.drawingLead}</p>

          {/* Cuatro columnas en pantalla ancha, no tres. La silueta de una bobina es
              estrecha y alta, así que en una celda de un tercio de página queda un dibujo
              pequeño rodeado de vacío; en celdas más estrechas el dibujo llena su sitio y
              las catorce se abarcan de una vez, que es para lo que está esta rejilla. */}
          <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {spools.map((spool, index) => (
              <Reveal key={spool.code} as="li" step={index % 4}>
                {/* Altura fija en la celda del dibujo: es la otra mitad de la escala
                    compartida. El `viewBox` es común, pero si cada celda midiera lo que
                    le apeteciera, dos siluetas iguales se verían de distinto tamaño. */}
                <div className="flex h-56 items-center justify-center border-b border-line pb-6">
                  <SpoolDiagram spool={spool} scale={scale} className="h-full w-auto text-ink" />
                </div>
                <p className="figure-num mt-4 text-lead text-ink">{spool.code}</p>
                <p className="figure-num mt-1 text-small text-ink-soft">
                  {formatKg(spool.netWeight, locale)} · Ø {formatMm(spool.flangeDiameter, locale)}
                </p>
                {spool.note && (
                  <p className="mt-1 text-small text-ink-faint">{spool.note[locale]}</p>
                )}
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
