import { cacheLife } from 'next/cache'
import Link from 'next/link'
import { site } from '@/content/site'
import { getCompanyInfo } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * El año del copyright, en una función cacheada por días.
 *
 * Con Cache Components, leer la hora actual en un componente de servidor está prohibido
 * (rompería el prerenderizado: ¿de qué momento sería el HTML?). Encerrarlo aquí lo
 * resuelve sin congelarlo para siempre: la caché caduca a diario, así que el 1 de enero
 * el pie se actualiza solo.
 */
async function currentYear(): Promise<number> {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  // Direcciones, teléfono y email salen del panel: Swiftmet los cambia sin nosotros.
  const [company, year] = await Promise.all([getCompanyInfo(), currentYear()])

  const works = company.plants.find((plant) => plant.kind === 'works') ?? company.plants[0]

  return (
    <footer className="mt-(--spacing-section) border-t border-line bg-paper">
      <div className="page-gutter py-16 text-center md:py-20">
        {/* Tres bloques iguales y centrados, no cuatro columnas con la última al doble de
            ancho: con el texto centrado, una columna que ocupa la mitad del pie deja su
            contenido flotando en medio de un hueco enorme. */}
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <p className="text-small text-ink">{site.legalName}</p>
            {works && (
              <p className="mt-3 text-small text-ink-soft">
                {works.city}, {works.region}
                <br />
                {works.country}
              </p>
            )}
          </div>

          <div>
            <h2 className="eyebrow">{t.contact.title}</h2>
            <a
              className="link-underline tap mt-3 inline-block text-small text-ink-soft hover:text-ink"
              href={`mailto:${company.email}`}
            >
              {company.email}
            </a>
            <a
              // `tel:` no admite espacios: se quitan aquí y el texto visible los conserva,
              // porque un teléfono indio sin agrupar no se lee.
              className="figure-num link-underline tap mt-2 block text-small text-ink-soft hover:text-ink"
              href={`tel:${company.phone.replaceAll(' ', '')}`}
            >
              {company.phone}
            </a>
          </div>

          <div>
            <h2 className="eyebrow">{t.nav.products}</h2>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-small">
              <li>
                <Link
                  className="link-underline tap text-ink-soft hover:text-ink"
                  href={href(locale, 'products')}
                >
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  className="link-underline tap text-ink-soft hover:text-ink"
                  href={href(locale, 'spools')}
                >
                  {t.nav.spools}
                </Link>
              </li>
              <li>
                <Link
                  className="link-underline tap text-ink-soft hover:text-ink"
                  href={href(locale, 'quality')}
                >
                  {t.nav.quality}
                </Link>
              </li>
              {/* Empresa y contacto entran aquí desde que son páginas. Como anclas no
                  tenían sitio en esta lista: el pie ya está al final de la página, y un
                  enlace que sube el scroll a un bloque de la misma portada no es
                  navegación, es un ascensor. */}
              <li>
                <Link
                  className="link-underline tap text-ink-soft hover:text-ink"
                  href={href(locale, 'company')}
                >
                  {t.nav.company}
                </Link>
              </li>
              <li>
                <Link
                  className="link-underline tap text-ink-soft hover:text-ink"
                  href={href(locale, 'contact')}
                >
                  {t.nav.contact}
                </Link>
              </li>
              {company.linkedin && (
                <li>
                  <a
                    className="link-underline tap text-ink-soft hover:text-ink"
                    href={company.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* La razón social acaba en «Ltd.», así que el punto NO se añade aquí: escribir
            «{legalName}. {rights}» daba «Pvt. Ltd.. All rights reserved.» */}
        <p className="mt-14 border-t border-line pt-8 text-micro text-ink-faint md:mt-20">
          © {year} {site.legalName} {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
