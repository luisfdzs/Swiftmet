import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/sections/ProductCard'
import { Reveal } from '@/components/ui/Reveal'
import { getProducts, productFamilies } from '@/lib/content'
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
  return { title: t.products.title, description: t.products.lead }
}

/**
 * Índice de catálogo, **agrupado por familia**.
 *
 * Sin filtros de JavaScript: hay una decena de referencias, no doscientas. Un selector
 * de familia obligaría a hidratar la página entera para ahorrarle al visitante un gesto
 * de scroll, y de paso rompería el enlace directo a un grupo. Con encabezados de
 * familia, el navegador busca con Ctrl+F y Google indexa cada grupo.
 *
 * El orden de las familias es el de `productFamilies` (metalizado primero), no el
 * alfabético: el hilo para metalizado es el producto principal y las familias que
 * comparten planta van después.
 */
export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const products = await getProducts()

  const groups = productFamilies
    .map((family) => ({
      family,
      items: products.filter((product) => product.family === family),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="page-gutter pt-32 text-center md:pt-40">
      <h1 className="text-display mx-auto max-w-3xl text-balance">{t.products.title}</h1>
      <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">{t.products.lead}</p>

      {groups.length === 0 ? (
        <p className="mt-16 text-ink-soft">{t.products.empty}</p>
      ) : (
        groups.map((group, groupIndex) => (
          <section key={group.family} className="mt-(--spacing-section)">
            <h2 className="eyebrow border-b border-line pb-4">{t.family[group.family]}</h2>
            <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
              {group.items.map((product, index) => (
                <Reveal key={product.slug} step={index % 2}>
                  <ProductCard
                    product={product}
                    locale={locale}
                    // Una sola imagen con `priority` en toda la página: la primera de la
                    // primera familia, que es la candidata a LCP.
                    priority={groupIndex === 0 && index === 0}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
