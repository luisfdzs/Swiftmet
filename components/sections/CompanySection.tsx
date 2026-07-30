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
      <section id={sections.company} className="page-gutter scroll-mt-8 text-center">
        <h2 className="eyebrow border-b border-line pb-4">{t.company.title}</h2>

        {/* Un solo eje, no dos columnas. La sección tenía la prosa a la izquierda y los
            datos a la derecha; centrada, el relato baja por el mismo eje que el resto de
            la página y las cifras y las plantas se leen debajo, como su pie. En una web de
            catálogo eso además ordena la lectura: primero quién es, luego dónde está. */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:mt-16">
          {company.statement[locale].map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} step={index}>
              <p className={index === 0 ? 'text-lead text-balance' : 'text-ink-soft'}>
                {paragraph}
              </p>
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

        <h3 className="eyebrow mt-14 border-b border-line pb-4">{t.company.plantsTitle}</h3>
        {/* Igual que las cifras: hoy son planta y domicilio social, pero el panel admite
            las que haga falta. */}
        <ul className="mt-8 flex flex-wrap justify-center gap-x-16 gap-y-8">
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
      </section>
    </div>
  )
}
