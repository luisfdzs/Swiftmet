import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/Hero'
import { ProductCard } from '@/components/sections/ProductCard'
import { SpoolTable } from '@/components/sections/SpoolTable'
import { Reveal } from '@/components/ui/Reveal'
import { getCompanyInfo, getFeaturedProducts, getProducts, getSpools } from '@/lib/content'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * Portada. El recorrido está pensado para un comprador que llega de una búsqueda y tiene
 * treinta segundos: cifras (hero) → qué se fabrica → **las medidas de las bobinas** →
 * quién lo fabrica → cómo pedir precio. Las bobinas van arriba, no al final, porque son
 * lo que la competencia no publica.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const [featured, products, spools, company] = await Promise.all([
    getFeaturedProducts(4),
    getProducts(),
    getSpools(),
    getCompanyInfo(),
  ])

  /**
   * La pureza que se anuncia en el hero es **la mejor que hay publicada**, leída de los
   * productos en vez de escrita a mano. Se ordena alfabéticamente al revés y se coge la
   * primera: con cadenas del tipo «99.80 % min» / «99.99 % min» eso da la más alta, y
   * evita parsear el número —que en cuanto alguien escriba «99,99 %» o «min 99.99%»
   * dejaría de funcionar en silencio y anunciaría una pureza menor de la real.
   */
  const purity =
    products
      .map((product) => product.purity)
      .filter((value): value is string => Boolean(value))
      .sort()
      .reverse()[0] ?? null

  return (
    <>
      <Hero locale={locale} spools={spools} purity={purity} />

      {/* El enlace a la gama completa va DEBAJO de las tarjetas y centrado, no arriba
          junto al encabezado: al lado del título invitaba a saltarse justo lo que la
          sección venía a enseñar, y centrado bajo la rejilla se ve desde cualquier
          columna. */}
      <section className="page-gutter pt-(--spacing-section) text-center">
        <h2 className="eyebrow border-b border-line pb-4">{t.home.productsTitle}</h2>

        {featured.length === 0 ? (
          <p className="mt-10 text-ink-soft">{t.products.empty}</p>
        ) : (
          <div className="mt-10 grid gap-x-8 gap-y-14 md:mt-14 md:grid-cols-2">
            {featured.map((product, index) => (
              <Reveal key={product.slug} step={index % 2}>
                <ProductCard product={product} locale={locale} priority={index === 0} />
              </Reveal>
            ))}
          </div>
        )}

        <Link
          href={href(locale, 'products')}
          className="link-underline tap mt-14 inline-block text-small"
        >
          {t.home.viewAllProducts}
        </Link>
      </section>

      {/* El programa de bobinas, completo y en la portada. Es una decisión comercial
          disfrazada de decisión de diseño: la competencia directa resuelve el embalaje
          con media frase, así que enseñar las catorce medidas antes de que el visitante
          tenga que hacer clic es la ventaja más barata que tiene esta web. */}
      <section className="page-gutter pt-(--spacing-section) text-center">
        <h2 className="eyebrow border-b border-line pb-4">{t.home.spoolsTitle}</h2>
        <p className="mx-auto mt-10 max-w-3xl text-lead text-balance md:mt-14">
          {t.home.spoolsLead}
        </p>
        <div className="mt-10">
          <SpoolTable spools={spools} locale={locale} />
        </div>
        <Link
          href={href(locale, 'spools')}
          className="link-underline tap mt-10 inline-block text-small"
        >
          {t.home.viewSpools}
        </Link>
      </section>

      {/* CALIDAD. La portada no la enlazaba en absoluto —sólo se llegaba por el menú o
          por el pie—, aunque el titular y el enlace llevaban traducidos a los tres
          idiomas desde el principio. Va después de las bobinas y antes de la empresa,
          que es el orden de la pregunta del comprador: qué me vendes, en qué formato,
          cómo sé que cumple, y quién eres. El párrafo es el de la propia página de
          calidad, para no escribir dos veces lo mismo con otras palabras. */}
      <section className="page-gutter pt-(--spacing-section) text-center">
        <h2 className="eyebrow border-b border-line pb-4">{t.home.qualityTitle}</h2>
        <p className="mx-auto mt-10 max-w-3xl text-lead text-balance md:mt-14">{t.quality.lead}</p>
        <Link
          href={href(locale, 'quality')}
          className="link-underline tap mt-10 inline-block text-small"
        >
          {t.home.viewQuality}
        </Link>
      </section>

      {/* EMPRESA Y CONTACTO, QUE ANTES SE LEÍAN ENTERAS AQUÍ.
          Eran dos secciones de esta página a las que el menú apuntaba con un ancla
          (`/en#company`). Ahora son páginas, y en la portada queda de cada una lo mismo
          que ya quedaba de calidad: encabezado, una entrada y el enlace. El recorrido de
          la portada no cambia —qué vendo, en qué formato, cómo sé que cumple, quién soy,
          cómo pedir precio—, pero cada paso acaba en una URL propia en vez de en un salto
          de scroll, y no hay dos sitios con el mismo texto compitiendo en Google.

          La entrada de empresa es el primer párrafo del panel, no un resumen escrito
          aparte: si Swiftmet reescribe su presentación, esto la sigue. */}
      <section className="page-gutter pt-(--spacing-section) text-center">
        <h2 className="eyebrow border-b border-line pb-4">{t.company.title}</h2>
        <p className="mx-auto mt-10 max-w-3xl text-lead text-balance md:mt-14">
          {company.statement[locale][0] ?? t.company.lead}
        </p>
        <Link
          href={href(locale, 'company')}
          className="link-underline tap mt-10 inline-block text-small"
        >
          {t.home.viewCompany}
        </Link>
      </section>

      <section className="page-gutter pt-(--spacing-section) text-center">
        <h2 className="eyebrow border-b border-line pb-4">{t.contact.title}</h2>
        <p className="mx-auto mt-10 max-w-3xl text-lead text-balance md:mt-14">{t.contact.lead}</p>
        <Link
          href={href(locale, 'contact')}
          className="link-underline tap mt-10 inline-block text-small"
        >
          {t.home.viewContact}
        </Link>
      </section>
    </>
  )
}
