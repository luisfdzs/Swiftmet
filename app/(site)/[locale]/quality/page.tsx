import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { getCompanyInfo } from '@/lib/content'
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
  return { title: t.quality.title, description: t.quality.lead }
}

/**
 * CALIDAD.
 *
 * Tiene página propia —y no es una sección de la portada como «empresa»— porque «high
 * purity aluminium wire quality control» es una búsqueda real de comprador y un ancla no
 * posiciona. El razonamiento completo, en `lib/i18n/routes.ts`.
 *
 * Los puntos de control se numeran en el orden en que Swiftmet los ordene en el panel,
 * que es el orden del proceso: materia prima → trefilado → desengrasado → bobinado →
 * ensayo por lote → embalaje. La numeración la pinta la web (`index + 1`), no se escribe
 * en el contenido: así reordenar arrastrando en el panel no obliga a reescribir los
 * números uno a uno, que es exactamente el trabajo que nadie hace y que deja una lista
 * numerada 1, 2, 2, 4.
 */
export default async function QualityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const company = await getCompanyInfo()
  const certifications = company.certifications ?? []

  return (
    <div className="page-gutter pt-32 text-center md:pt-40">
      <h1 className="text-display mx-auto max-w-3xl text-balance">{t.quality.title}</h1>
      <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">{t.quality.lead}</p>

      <Figure
        /*
         * Se probó a abrir esta página con archivo de Wikimedia y se retiró: lo único que
         * hay de una línea de trefilado es una foto de 1985 de la Comunidad Europea del
         * Carbón y del Acero, y a 21:9 en la cabecera contradecía lo que la página afirma
         * —que aquí se mide cada lote, hoy y en Baghola—. Ver README, «Fotografía».
         */
        image={null}
        locale={locale}
        ratio="21 / 9"
        sizes="100vw"
        priority
        // Este hueco es el más importante de la web: una foto del calibre en proceso o de
        // la máquina de tracción es la prueba visual de todo lo que dice esta página.
        label="Wire drawing line with in-process diameter gauge, or the tensile testing machine"
        className="mt-16 md:mt-24"
      />

      <section className="mt-(--spacing-section)">
        <h2 className="eyebrow border-b border-line pb-4">{t.quality.stepsTitle}</h2>
        <ol className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {company.qualitySteps.map((step, index) => (
            // El número va ENCIMA del título y no a su izquierda: en columna es lo que
            // deja el punto de control centrado sobre el mismo eje que el resto de la
            // página, y de paso el título ya no arranca con una sangría distinta de la del
            // párrafo que lleva debajo.
            <Reveal key={step.title.en} as="li" step={index % 2}>
              <span
                className="figure-num block text-lead text-ink-faint"
                // El número es ornamento de lectura: el orden ya lo aporta el <ol>, y
                // un lector de pantalla que lo leyera diría «uno, uno».
                aria-hidden
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lead text-ink">{step.title[locale]}</h3>
              <p className="mx-auto mt-2 max-w-prose text-ink-soft">{step.body[locale]}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mt-(--spacing-section)">
        <h2 className="eyebrow border-b border-line pb-4">{t.quality.certificationsTitle}</h2>
        {certifications.length === 0 ? (
          // Sin certificaciones publicadas se dice que están pendientes, no se calla:
          // un apartado vacío deja al comprador suponiendo, y suponer no juega a favor.
          // Reclamar una norma que no se tiene es peor todavía.
          <p className="mt-8 text-ink-soft">{t.quality.certificationsEmpty}</p>
        ) : (
          <ul className="mt-8 grid gap-3">
            {certifications.map((certification) => (
              <li key={certification} className="text-small text-ink">
                {certification}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
