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
        <div className="md:order-2 md:col-span-5 md:flex md:flex-col">
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

              Va justo detrás de los datos y ANTES de la segunda foto, no al final de la
              columna: la foto de abajo crece para tapar el hueco que sobre, así que si la
              consulta fuera después quedaría empujada al borde inferior de la ficha,
              lejos de las cifras que la provocan. Aquí se lee al terminar de leer
              diámetro, pureza y embalaje, y la foto sigue absorbiendo lo que quede. */}
          <p className="mt-12 border-t border-line pt-8">
            <a className="link-underline tap text-lead text-ink" href={enquiry}>
              {t.product.enquire}
            </a>
          </p>

          {/* LA SEGUNDA FOTO ESTÁ AQUÍ PARA TAPAR UN HUECO, y conviene decirlo.
              Las dos columnas de esta ficha las escribe el cliente y nunca miden lo
              mismo: `tea-bag-wire` no tiene ni una especificación y el `1080` tiene seis,
              así que a la derecha sobraban entre 220 y 860 px según el producto y el
              idioma.

              `grow` + `stretch` —sin proporción fija y sin altura mínima— hace que la
              foto ocupe **exactamente** lo que sobre. Sin mínimo a propósito: si a un
              producto no le sobra nada, la foto mide cero y no se pinta, que es la
              respuesta correcta —no había hueco que tapar— y evita el remedio peor, una
              tira de 20 px o una columna derecha que se pasa de largo y traslada el hueco
              a la izquierda. Hoy eso sólo le ocurre al `1090`, el de la ficha más
              cargada, por debajo de unos 1350 px de ancho.

              Sólo de `md` para arriba: en una sola columna no hay nada a la derecha que
              tapar, y una foto de archivo de más sería sólo scroll. */}
          {product.second && (
            <Figure
              className="mt-12 hidden grow md:flex"
              image={product.second}
              locale={locale}
              ratio="4 / 5"
              stretch
              sizes="(max-width: 768px) 100vw, 40vw"
              label={product.name}
              // Con pie: es la única fotografía de la ficha que no tiene ningún texto
              // cerca —la portada tiene los párrafos del producto al lado, esta cae al
              // fondo de la columna de datos—, así que sin él es una imagen que aparece
              // debajo de una tabla de especificaciones sin decir qué es. El pie dice lo
              // que se ve, que es todo lo que una foto de archivo puede decir.
              caption={product.second.alt[locale]}
            />
          )}
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

          {/* Resto de imágenes, si algún día hay más de dos. Las dos primeras ya están
              puestas —portada aquí arriba y segunda al fondo de la otra columna—, así que
              esta galería empieza en la tercera. Con `images` vacío no pinta nada: no hay
              un hueco por foto que falte, sólo el de la portada. */}
          {product.images.length > 2 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {product.images.slice(2).map((image) => (
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
