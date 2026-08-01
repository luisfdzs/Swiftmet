import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
    title: t.contact.title,
    description: t.contact.lead,
    alternates: {
      canonical: href(locale, 'contact'),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'contact')])),
    },
  }
}

/**
 * CONTACTO, COMO PÁGINA.
 *
 * Era el cierre de la portada, enlazado por `/en#contact`. Pasa a ruta por el motivo
 * general —ninguna sección se enlaza con `#`, ver `lib/i18n/routes.ts`—, y aquí el cambio
 * se nota más que en ninguna otra: contacto es el destino del icono central de la barra de
 * móvil, y con un ancla ese icono no podía marcarse nunca como activo. Ahora sí.
 *
 * Sigue sin formulario: implica backend de envío, antispam y política de privacidad, y
 * para una consulta B2B —«necesito 1,60 mm en 99,90 % sobre SW320»— el email y el teléfono
 * son mejores, porque el comprador se queda con copia de lo que pidió. Se añadirá si
 * Swiftmet lo pide (ver README).
 *
 * El asunto del `mailto:` va prerrellenado con lo que hay que decirnos. Es un detalle
 * pequeño con efecto real: la mayoría de las consultas llegan sin diámetro ni pureza y eso
 * obliga a un correo de ida y vuelta antes de poder dar precio.
 */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const company = await getCompanyInfo()

  const enquiry = `?subject=${encodeURIComponent(t.contact.lead)}`

  return (
    <div className="page-gutter pt-32 text-center md:pt-40">
      <h1 className="text-display mx-auto max-w-3xl text-balance">{t.contact.title}</h1>
      <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">{t.contact.lead}</p>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3">
        <div>
          <h2 className="eyebrow border-b border-line pb-4">{t.contact.email}</h2>
          <a
            className="link-underline tap mt-6 inline-block text-lead break-all"
            href={`mailto:${company.email}${enquiry}`}
          >
            {company.email}
          </a>
        </div>

        <div>
          <h2 className="eyebrow border-b border-line pb-4">{t.contact.phone}</h2>
          <a
            className="figure-num link-underline tap mt-6 inline-block text-lead"
            href={`tel:${company.phone.replaceAll(' ', '')}`}
          >
            {company.phone}
          </a>
        </div>

        <div>
          <h2 className="eyebrow border-b border-line pb-4">{t.contact.peopleTitle}</h2>
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
    </div>
  )
}
