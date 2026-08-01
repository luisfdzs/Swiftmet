import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/ui/Reveal'
import { getCompanyInfo } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    title: t.company.title,
    description: t.company.lead,
    alternates: {
      canonical: href(locale, 'company'),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'company')])),
    },
  }
}

/**
 * LA EMPRESA, COMO PÁGINA.
 *
 * Era una sección de la portada a la que se llegaba por `/en#company`, y cambió por lo
 * que costaba el ancla, no por lo que ganaba la página: mezclar `#` con `/` dejaba a la
 * navegación sin forma de saber qué se estaba leyendo, porque el fragmento no llega ni al
 * servidor ni a `usePathname()`. El razonamiento entero está en `lib/i18n/routes.ts`.
 *
 * Lo que se gana de propina sí es de esta página: título y descripción propios, una
 * entrada en el sitemap, y una URL que un comprador puede mandar a su jefe sabiendo que
 * al abrirla verá esto y no la portada por el principio.
 *
 * Todo el contenido —el relato, las cifras y las plantas— sale del panel de Sanity y se
 * pinta sólo lo que Swiftmet haya confirmado: si mañana hay tres cifras en vez de una,
 * aparecen las tres sin tocar código (regla 8, nada de datos inventados).
 */
export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const company = await getCompanyInfo()

  const facts = [
    company.incorporated
      ? { label: t.company.incorporatedLabel, value: company.incorporated }
      : null,
    company.capacity ? { label: t.company.capacityLabel, value: company.capacity } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null)

  return (
    <div className="page-gutter pt-32 text-center md:pt-40">
      <h1 className="text-display mx-auto max-w-3xl text-balance">{t.company.title}</h1>
      <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">{t.company.lead}</p>

      {/* Un solo eje, no dos columnas. La sección tenía la prosa a la izquierda y los
          datos a la derecha; centrada, el relato baja por el mismo eje que el resto de
          la página y las cifras y las plantas se leen debajo, como su pie. En una web de
          catálogo eso además ordena la lectura: primero quién es, luego dónde está. */}
      <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:mt-24">
        {company.statement[locale].map((paragraph, index) => (
          <Reveal key={paragraph.slice(0, 24)} step={index}>
            <p className={index === 0 ? 'text-lead text-balance' : 'text-ink-soft'}>{paragraph}</p>
          </Reveal>
        ))}
      </div>

      {/* Fila centrada y no rejilla de dos columnas: los datos de empresa son los que
          Swiftmet haya confirmado —hoy uno, mañana puede que tres—, y en una rejilla de
          columnas fijas un solo dato se queda plantado en la primera, fuera del eje de
          la página. Una fila que se centra sola vale para cualquier número. */}
      {facts.length > 0 && (
        <dl className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-16 gap-y-8 border-t border-line pt-8">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="eyebrow">{fact.label}</dt>
              <dd className="figure-num mt-1 text-lead text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <h2 className="eyebrow mt-(--spacing-section) border-b border-line pb-4">
        {t.company.plantsTitle}
      </h2>
      {/* Igual que las cifras: hoy son planta y domicilio social, pero el panel admite
          las que haga falta. */}
      <ul className="mt-10 flex flex-wrap justify-center gap-x-16 gap-y-8">
        {company.plants.map((plant) => (
          <li key={`${plant.kind}-${plant.city}`}>
            <p className="eyebrow text-ink-soft">
              {plant.kind === 'works' ? t.company.worksLabel : t.company.officeLabel}
            </p>
            <p className="mt-1 text-small text-ink">
              {plant.address}
              <br />
              {plant.city}, {plant.region}
              {plant.postalCode && <span className="figure-num"> {plant.postalCode}</span>}
              <br />
              {plant.country}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
