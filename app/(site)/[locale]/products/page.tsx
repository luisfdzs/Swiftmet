import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/sections/ProductCard'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { getProducts, productFamilies, type ProductEntry } from '@/lib/content'
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
/**
 * La segunda foto del último producto de una familia, que es con lo que se rellena la
 * media fila que sobra. Devuelve `null` si ese producto no tiene ninguna, y entonces no se
 * pinta nada: mejor media fila vacía que un hueco tramado pidiendo una foto que no falta
 * —el hueco marcado es para las fotos de producto, y aquí no hay ningún producto—.
 */
function lastSecondPhoto(items: ProductEntry[]) {
  return items[items.length - 1]?.second ?? null
}

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

              {/* LA MITAD QUE SOBRA DE LA ÚLTIMA FILA.
                  Este catálogo es de dos columnas y cuatro de las cinco familias tienen
                  **un solo producto** —varilla, bolsitas de té, soldadura, muelles—, así
                  que la fila se quedaba medio vacía y la sección parecía una tarjeta que
                  no había cargado. En metalizado pasa igual con la tercera.

                  Se rellena con la segunda foto del último producto de la familia, la
                  misma que lleva su ficha (`product.second`). Va sin rótulo y sin enlace a
                  propósito: es la fotografía de esa familia, no una tarjeta más, y una
                  tarjeta falsa a la que se puede hacer clic sería peor que el hueco.

                  Sólo de `md` para arriba: en una columna no hay media fila que rellenar. */}
              {group.items.length % 2 === 1 && lastSecondPhoto(group.items) && (
                // El `hidden` va en la celda de la rejilla, no en la foto: si lo llevara
                // la foto, en móvil quedaría una celda vacía con su hueco de 56 px.
                <Reveal step={1} className="hidden md:block">
                  <Figure
                    image={lastSecondPhoto(group.items)}
                    locale={locale}
                    ratio="4 / 3"
                    sizes="(max-width: 768px) 100vw, 46vw"
                    label={group.items[group.items.length - 1]?.name ?? ''}
                    // El pie es lo que la distingue de la tarjeta que tiene al lado sin
                    // fingir ser una: la tarjeta lleva nombre, pureza, familia y resumen
                    // bajo un filete; esto lleva una línea suelta que describe la foto. Y
                    // sigue sin enlace, que era la decisión de fondo.
                    caption={lastSecondPhoto(group.items)?.alt[locale]}
                  />
                </Reveal>
              )}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
