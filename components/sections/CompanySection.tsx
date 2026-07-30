import { Reveal } from '@/components/ui/Reveal'
import type { CompanyInfo } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { sections } from '@/lib/i18n/routes'

/**
 * La empresa, como SECCIÓN de la portada (`/en#company`), no como página aparte.
 *
 * Calidad sí tiene página propia y esto no, y la diferencia no es de importancia sino de
 * intención de búsqueda: nadie busca en Google la historia de un proveedor de hilo, pero
 * sí busca cómo controla la calidad. Ver el razonamiento en `lib/i18n/routes.ts`.
 *
 * El hueco de separación va en el envoltorio y no en el relleno de la sección: si lo
 * llevara dentro, al entrar por `/en#company` el navegador dejaría ese hueco arriba y con
 * él la última línea de la sección anterior, asomando bajo la barra.
 */
export function CompanySection({ locale, company }: { locale: Locale; company: CompanyInfo }) {
  const t = getDictionary(locale)

  const facts = [
    company.incorporated
      ? { label: t.company.incorporatedLabel, value: company.incorporated }
      : null,
    company.capacity ? { label: t.company.capacityLabel, value: company.capacity } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null)

  return (
    <div className="pt-(--spacing-section)">
      {/* `scroll-mt` suma al `scroll-padding-top` global: al llegar por el ancla, el
          encabezado no queda pegado al borde inferior de la barra. */}
      <section id={sections.company} className="page-gutter scroll-mt-8">
        <h2 className="eyebrow border-b border-line pb-4">{t.company.title}</h2>

        <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-16">
          <div className="grid gap-6 md:col-span-7">
            {company.statement[locale].map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} step={index}>
                <p className={index === 0 ? 'text-lead text-balance' : 'text-ink-soft'}>
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="md:col-span-5">
            {facts.length > 0 && (
              <dl className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="eyebrow">{fact.label}</dt>
                    <dd className="figure-num mt-1 text-lead text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <h3 className="eyebrow mt-10 border-b border-line pb-4">{t.company.plantsTitle}</h3>
            <ul className="mt-6 grid gap-6">
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
        </div>
      </section>
    </div>
  )
}
