import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Figure } from '@/components/ui/Figure'
import { SpecList } from '@/components/ui/SpecList'
import { getCompanyInfo, getProduct, getProductNeighbours, getProductSlugs } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * Las fichas de producto se prerrenderizan en build, una por idioma y slug. Es el
 * producto cartesiano de los tres idiomas por los slugs publicados: para una decena de
 * referencias son unas treinta páginas estáticas, todas servidas desde el CDN.
 */
export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const product = await getProduct(slug)
  if (!product) return {}

  return {
    title: product.name,
    description: product.summary[locale],
    alternates: {
      canonical: href(locale, 'products', slug),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'products', slug)])),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const product = await getProduct(slug)
  if (!product) notFound()

  const t = getDictionary(locale)
  const [neighbours, company] = await Promise.all([getProductNeighbours(slug), getCompanyInfo()])

  /**
   * El asunto del correo trae ya el producto por su nombre. Es el mismo truco que la
   * sección de contacto de la portada —allí el asunto es lo que hay que contarnos—, y
   * aquí ahorra la pregunta que abre todas las consultas: de cuál de los siete estamos
   * hablando.
   */
  const enquiry = `mailto:${company.email}?subject=${encodeURIComponent(product.name)}`

  return (
    <article className="page-gutter pt-32 text-center md:pt-40">
      <p className="eyebrow">{t.family[product.family]}</p>
      <h1 className="text-display mx-auto mt-4 max-w-3xl text-balance">{product.name}</h1>
      <p className="mx-auto mt-8 max-w-2xl text-lead text-ink-soft">{product.summary[locale]}</p>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-16">
        {/* La ficha técnica va PRIMERO en el orden del documento y a la derecha en
            pantalla ancha: en móvil, quien abre una ficha de producto industrial busca
            las cifras, no la prosa, y hacerle recorrer tres párrafos antes es hacerle
            volver a la página de la competencia. */}
        <div className="md:order-2 md:col-span-5">
          <h2 className="eyebrow border-b border-line pb-4">{t.products.specifications}</h2>
          <SpecList
            className="mt-6"
            specs={[
              { label: t.product.grade, value: product.grade, numeric: true },
              { label: t.product.purity, value: product.purity, numeric: true },
              { label: t.product.diameter, value: product.diameter, numeric: true },
              { label: t.product.tensile, value: product.tensile, numeric: true },
              { label: t.product.elongation, value: product.elongation, numeric: true },
              { label: t.product.packing, value: product.packing?.[locale] },
            ]}
          />

          {product.spoolWound && (
            // El filete del aviso pasa de la izquierda a ARRIBA: una barra vertical junto a
            // un texto centrado señala un margen que ya no existe.
            <p className="mt-8 border-t-2 border-signal pt-4 text-small text-ink-soft">
              {t.product.spoolWound}{' '}
              <Link href={href(locale, 'spools')} className="link-underline tap text-ink">
                {t.product.viewSpools}
              </Link>
            </p>
          )}

          {product.applications.length > 0 && (
            <>
              <h2 className="eyebrow mt-12 border-b border-line pb-4">{t.product.applications}</h2>
              <ul className="mt-6 grid gap-3">
                {product.applications.map((application) => (
                  <li key={application.en} className="text-small text-ink-soft">
                    {application[locale]}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* LA CONSULTA, EN LA FICHA. Estaba traducida a los tres idiomas desde el
              principio y no se había llegado a poner: se salía de una ficha por «volver
              a productos» o por el menú, y la consulta —que es lo que esta página
              existe para provocar— quedaba a dos pantallas de scroll, en la portada.
              Va al final de la columna de datos porque es donde termina de decidirse:
              el comprador acaba de leer diámetro, pureza y embalaje. */}
          <p className="mt-12 border-t border-line pt-8">
            <a className="link-underline tap text-lead text-ink" href={enquiry}>
              {t.product.enquire}
            </a>
          </p>
        </div>

        <div className="md:order-1 md:col-span-7">
          <Figure
            image={product.cover}
            locale={locale}
            ratio="4 / 3"
            sizes="(max-width: 768px) 100vw, 56vw"
            priority
            label={product.name}
          />

          <div className="mt-10 grid gap-6">
            {product.body[locale].map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Resto de imágenes, si algún día hay más de una. Con `images` vacío esto no
              pinta nada: no hay un hueco por foto que falte, sólo el de la portada. */}
          {product.images.length > 1 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {product.images.slice(1).map((image) => (
                <Figure
                  key={image.id}
                  image={image}
                  locale={locale}
                  ratio="4 / 3"
                  sizes="(max-width: 640px) 100vw, 28vw"
                  label={product.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-(--spacing-section) flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-line pt-8">
        <Link href={href(locale, 'products')} className="link-underline tap text-small">
          {t.product.backToProducts}
        </Link>
        {neighbours && (
          <div className="flex flex-wrap gap-6 text-small">
            <Link
              href={href(locale, 'products', neighbours.previous.slug)}
              className="link-underline tap text-ink-soft hover:text-ink"
            >
              {t.product.previous}
            </Link>
            <Link
              href={href(locale, 'products', neighbours.next.slug)}
              className="link-underline tap text-ink-soft hover:text-ink"
            >
              {t.product.next}
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
