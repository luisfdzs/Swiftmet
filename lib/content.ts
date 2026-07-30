import { cacheLife, cacheTag } from 'next/cache'
import { z } from 'zod'
import { client } from '@/sanity/client'
import { COMPANY_QUERY, PRODUCTS_QUERY, PRODUCT_SLUGS_QUERY, SPOOLS_QUERY } from '@/sanity/queries'
import type { Localized } from '@/lib/i18n/config'

/**
 * ÚNICA PUERTA DE ACCESO AL CONTENIDO
 *
 * Ninguna página consulta Sanity directamente: todas pasan por aquí. Es lo que permite
 * cambiar de dónde sale el contenido sin tocar una sola vista, y lo que concentra en un
 * fichero las dos decisiones que de otro modo se repetirían por todas partes: el
 * relleno de traducciones que faltan y qué hacer con un documento incompleto.
 *
 * **Criterio con los documentos a medias:** el contenido lo edita una persona desde el
 * navegador, así que un producto sin descripción o una bobina con una cota absurda **no
 * puede tumbar la web**: se descarta ese documento, se avisa por consola y el resto
 * sigue publicándose. La excepción es «Company & contact», que afecta al pie de TODAS
 * las páginas: ahí sí se lanza error, porque una web sin dirección ni teléfono no es
 * una web de un fabricante, es un folleto roto.
 */

/** Etiqueta de caché: el webhook de Sanity la invalida al publicar. */
export const CONTENT_TAG = 'sanity-content'

/**
 * Un texto traducido, con el inglés como única obligación.
 *
 * El `transform` es la pieza importante: rellena hindi y español con el inglés cuando
 * faltan. Sin esto habría que decidir en cada vista qué hacer con un hueco —¿cadena
 * vacía?, ¿ocultar el bloque?— y acabaríamos con tres criterios distintos y con huecos
 * visibles en la web. Con esto, la regla es una y está aquí: **si no está traducido, se
 * lee en inglés**, que es exactamente lo que un comprador prefiere frente a un vacío.
 */
const localizedString = z
  .object({
    en: z.string().min(1),
    hi: z.string().nullish(),
    es: z.string().nullish(),
  })
  .transform((value): Localized => ({
    en: value.en,
    hi: value.hi || value.en,
    es: value.es || value.en,
  }))

const localizedParagraphs = z
  .object({
    en: z.array(z.string().min(1)).min(1),
    hi: z.array(z.string().min(1)).nullish(),
    es: z.array(z.string().min(1)).nullish(),
  })
  .transform((value): Localized<string[]> => ({
    en: value.en,
    hi: value.hi?.length ? value.hi : value.en,
    es: value.es?.length ? value.es : value.en,
  }))

const imageSchema = z.object({
  id: z.string(),
  src: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blur: z.string().startsWith('data:image/'),
  alt: localizedString,
})

export const productFamilies = [
  'metallising-wire',
  'aluminium-rod',
  'tea-bag-wire',
  'welding-wire',
  'spring-steel-wire',
] as const

export type ProductFamily = (typeof productFamilies)[number]

const productSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  family: z.enum(productFamilies),
  featured: z.boolean().nullish(),
  grade: z.string().nullish(),
  purity: z.string().nullish(),
  diameter: z.string().nullish(),
  tensile: z.string().nullish(),
  elongation: z.string().nullish(),
  spoolWound: z.boolean().nullish(),
  packing: localizedString.nullish(),
  summary: localizedString,
  body: localizedParagraphs,
  applications: z.array(localizedString).nullish(),
  images: z.array(imageSchema).nullish(),
})

/**
 * Bobina. Las cotas se validan **entre sí**, no sólo una a una, porque son las que
 * alimentan el dibujo a escala: un núcleo mayor que la pestaña o un bobinado más ancho
 * que la propia bobina no son datos raros, son imposibles, y pintarían una sección del
 * revés sin que nada fallara. Preferimos que la bobina desaparezca de la tabla con un
 * aviso en consola antes que publicar un plano que miente.
 */
const spoolSchema = z
  .object({
    code: z.string().min(1),
    netWeight: z.number().positive(),
    flangeDiameter: z.number().positive(),
    coreDiameter: z.number().positive(),
    boreHole: z.number().positive(),
    spoolWidth: z.number().positive(),
    windingWidth: z.number().positive(),
    note: localizedString.nullish(),
  })
  .superRefine((spool, ctx) => {
    if (spool.coreDiameter >= spool.flangeDiameter) {
      ctx.addIssue({
        code: 'custom',
        path: ['coreDiameter'],
        message: `(${spool.coreDiameter} mm) debe ser menor que la pestaña D1 (${spool.flangeDiameter} mm)`,
      })
    }
    if (spool.boreHole >= spool.coreDiameter) {
      ctx.addIssue({
        code: 'custom',
        path: ['boreHole'],
        message: `(${spool.boreHole} mm) debe ser menor que el núcleo D2 (${spool.coreDiameter} mm)`,
      })
    }
    if (spool.windingWidth > spool.spoolWidth) {
      ctx.addIssue({
        code: 'custom',
        path: ['windingWidth'],
        message: `(${spool.windingWidth} mm) no puede superar la anchura total L1 (${spool.spoolWidth} mm)`,
      })
    }
  })

const plantSchema = z.object({
  kind: z.enum(['office', 'works']),
  address: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().nullish(),
  country: z.string().min(1),
})

const companySchema = z.object({
  statement: localizedParagraphs,
  capacity: z.string().nullish(),
  incorporated: z.string().nullish(),
  qualitySteps: z.array(z.object({ title: localizedString, body: localizedString })).min(1),
  certifications: z.array(z.string()).nullish(),
  plants: z.array(plantSchema).min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  people: z
    .array(
      z.object({
        name: z.string().min(1),
        role: localizedString,
        phone: z.string().nullish(),
        email: z.string().nullish(),
      }),
    )
    .nullish(),
  linkedin: z.string().url().nullish(),
})

export type DescribedImage = z.infer<typeof imageSchema>
export type SpoolEntry = z.infer<typeof spoolSchema>
export type CompanyInfo = z.infer<typeof companySchema>

/**
 * El producto que ven las vistas: las listas opcionales ya normalizadas a array y la
 * imagen de portada resuelta. `cover` puede ser `null` —hoy lo es siempre, porque no
 * hay fotografía— y de eso se encarga `<Figure>`, no cada página.
 */
export type ProductEntry = Omit<z.infer<typeof productSchema>, 'images' | 'applications'> & {
  images: DescribedImage[]
  applications: Localized[]
  cover: DescribedImage | null
}

/**
 * Lee de Sanity y **cachea con etiqueta**: la web se sirve estática hasta que alguien
 * publica, y entonces el webhook invalida esta etiqueta y se regenera.
 *
 * La forma correcta en Next 16 es la directiva `use cache` con `cacheTag`. Pasar
 * `{ next: { tags } }` como tercer argumento de `client.fetch` **no funciona**:
 * `@sanity/client` ignora esa opción porque no usa el `fetch` de Next con sus
 * extensiones. El resultado es un fallo silencioso —los datos quedan horneados en el
 * build sin etiqueta, el webhook responde 200 y la web no se actualiza nunca— que le
 * costó un rato de diagnóstico al proyecto de referencia.
 */
async function fetchContent<T>(query: string): Promise<T> {
  'use cache'
  cacheTag(CONTENT_TAG)
  // 'max': se sirve de caché indefinidamente y sólo cambia cuando se publica algo.
  cacheLife('max')
  return client.fetch<T>(query)
}

/**
 * Valida cada documento por separado y descarta los que no cumplen, en vez de fallar en
 * bloque. Así un producto sin descripción o una bobina mal medida no deja la web fuera
 * de servicio; el aviso queda en el log del build, que es donde alguien lo va a leer.
 */
function keepValid<T>(items: unknown[], schema: z.ZodType<T>, label: string): T[] {
  const valid: T[] = []
  for (const item of items) {
    const result = schema.safeParse(item)
    if (result.success) {
      valid.push(result.data)
    } else {
      const record = item as { name?: string; code?: string; slug?: string } | null
      const name = record?.name ?? record?.code ?? record?.slug ?? '(sin nombre)'
      console.warn(
        `[contenido] Se omite ${label} «${name}»: ${result.error.issues
          .map((issue) => `${issue.path.join('.')} ${issue.message}`)
          .join('; ')}`,
      )
    }
  }
  return valid
}

export async function getProducts(): Promise<ProductEntry[]> {
  const raw = await fetchContent<unknown[]>(PRODUCTS_QUERY)
  return keepValid(raw, productSchema, 'el producto').map((product) => {
    const images = product.images ?? []
    return {
      ...product,
      images,
      applications: product.applications ?? [],
      cover: images[0] ?? null,
    }
  })
}

export async function getFeaturedProducts(limit = 4): Promise<ProductEntry[]> {
  const products = await getProducts()
  const featured = products.filter((product) => product.featured)
  return (featured.length > 0 ? featured : products).slice(0, limit)
}

export async function getProduct(slug: string): Promise<ProductEntry | undefined> {
  const products = await getProducts()
  return products.find((product) => product.slug === slug)
}

export async function getProductSlugs(): Promise<string[]> {
  const raw = await fetchContent<{ slug: string | null }[]>(PRODUCT_SLUGS_QUERY)
  return raw.map((row) => row.slug).filter((slug): slug is string => Boolean(slug))
}

/** Producto anterior y siguiente, en bucle, para recorrer el catálogo sin volver al índice. */
export async function getProductNeighbours(
  slug: string,
): Promise<{ previous: ProductEntry; next: ProductEntry } | null> {
  const products = await getProducts()
  const index = products.findIndex((product) => product.slug === slug)
  if (index === -1 || products.length < 2) return null
  const previous = products[(index - 1 + products.length) % products.length]
  const next = products[(index + 1) % products.length]
  if (!previous || !next) return null
  return { previous, next }
}

export async function getSpools(): Promise<SpoolEntry[]> {
  const raw = await fetchContent<unknown[]>(SPOOLS_QUERY)
  return keepValid(raw, spoolSchema, 'la bobina')
}

/**
 * Ficha de la empresa. Si falta o está incompleta es un fallo grave (afecta al pie de
 * todas las páginas), así que aquí sí se lanza error con un mensaje que dice qué
 * rellenar y dónde.
 */
export async function getCompanyInfo(): Promise<CompanyInfo> {
  const raw = await fetchContent<unknown>(COMPANY_QUERY)
  const result = companySchema.safeParse(raw)
  if (!result.success) {
    throw new Error(
      `[contenido] El documento «Company & contact» del panel está incompleto: ` +
        result.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; '),
    )
  }
  return result.data
}

export type { Localized }
