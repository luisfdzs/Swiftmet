import type { CompanyInfo } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { sections } from '@/lib/i18n/routes'

/**
 * Contacto como SECCIÓN de la portada (`/en#contact`), cerrando la página.
 *
 * Directo, sin formulario: un formulario implica backend de envío, antispam y política
 * de privacidad, y para una consulta B2B —«necesito 1,60 mm en 99,90 % sobre SW320»— el
 * email y el teléfono son mejores que un formulario, porque el comprador se queda con
 * copia de lo que pidió. Se añadirá si Swiftmet lo pide (ver README).
 *
 * El asunto del `mailto:` va prerrellenado con lo que hay que decirnos. Es un detalle
 * pequeño con efecto real: la mayoría de las consultas llegan sin diámetro ni pureza y
 * eso obliga a un correo de ida y vuelta antes de poder dar precio.
 */
export function ContactSection({ locale, company }: { locale: Locale; company: CompanyInfo }) {
  const t = getDictionary(locale)

  const enquiry = `?subject=${encodeURIComponent(t.contact.lead)}`

  return (
    <div className="pt-(--spacing-section)">
      {/* Ver `CompanySection`: el `scroll-mt` despega el encabezado de la barra. */}
      <section id={sections.contact} className="page-gutter scroll-mt-8 text-center">
        <h2 className="eyebrow border-b border-line pb-4">{t.contact.title}</h2>
        <p className="mx-auto mt-10 max-w-3xl text-lead text-balance md:mt-16">{t.contact.lead}</p>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3">
          <div>
            <h3 className="eyebrow border-b border-line pb-4">{t.contact.email}</h3>
            <a
              className="link-underline tap mt-6 inline-block text-lead break-all"
              href={`mailto:${company.email}${enquiry}`}
            >
              {company.email}
            </a>
          </div>

          <div>
            <h3 className="eyebrow border-b border-line pb-4">{t.contact.phone}</h3>
            <a
              className="figure-num link-underline tap mt-6 inline-block text-lead"
              href={`tel:${company.phone.replaceAll(' ', '')}`}
            >
              {company.phone}
            </a>
          </div>

          <div>
            <h3 className="eyebrow border-b border-line pb-4">{t.contact.peopleTitle}</h3>
            <ul className="mt-6 grid gap-5">
              {(company.people ?? []).map((person) => (
                <li key={person.name}>
                  <p className="text-small text-ink">{person.name}</p>
                  <p className="text-small text-ink-soft">{person.role[locale]}</p>
                  {person.phone && (
                    <a
                      className="figure-num link-underline tap mt-1 inline-block text-small text-ink-soft hover:text-ink"
                      href={`tel:${person.phone.replaceAll(' ', '')}`}
                    >
                      {person.phone}
                    </a>
                  )}
                  {person.email && (
                    <a
                      className="link-underline tap mt-1 block text-small text-ink-soft hover:text-ink"
                      href={`mailto:${person.email}`}
                    >
                      {person.email}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
