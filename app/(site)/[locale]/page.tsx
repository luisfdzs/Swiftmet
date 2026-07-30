import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanySection } from '@/components/sections/CompanySection'
import { ContactSection } from '@/components/sections/ContactSection'
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

      <section className="page-gutter pt-(--spacing-section)">
        <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
          <h2 className="eyebrow">{t.home.productsTitle}</h2>
          <Link href={href(locale, 'products')} className="link-underline tap text-small">
            {t.home.viewAllProducts}
          </Link>
        </div>

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
      </section>

      {/* El programa de bobinas, completo y en la portada. Es una decisión comercial
          disfrazada de decisión de diseño: la competencia directa resuelve el embalaje
          con media frase, así que enseñar las catorce medidas antes de que el visitante
          tenga que hacer clic es la ventaja más barata que tiene esta web. */}
      <section className="page-gutter pt-(--spacing-section)">
        <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
          <h2 className="eyebrow">{t.home.spoolsTitle}</h2>
          <Link href={href(locale, 'spools')} className="link-underline tap text-small">
            {t.home.viewSpools}
          </Link>
        </div>
        <p className="mt-10 max-w-3xl text-lead text-balance md:mt-14">{t.home.spoolsLead}</p>
        <div className="mt-10">
          <SpoolTable spools={spools} locale={locale} />
        </div>
      </section>

      <CompanySection locale={locale} company={company} />
      <ContactSection locale={locale} company={company} />
    </>
  )
}
