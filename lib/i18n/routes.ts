import type { Locale } from './config'

/**
 * Rutas del sitio en un único sitio. Los segmentos son neutros (`/products`,
 * `/spools`) para que los tres idiomas compartan estructura de ficheros; si algún día
 * queremos slugs localizados (`/es/bobinas`), se hace con un mapa aquí sin tocar
 * ninguna página.
 */
export const routes = {
  home: '',
  products: 'products',
  spools: 'spools',
  quality: 'quality',
} as const

/**
 * Secciones de la portada. **No son páginas**: empresa y contacto se leen sin salir
 * del inicio, así que su destino es un ancla (`/en#company`). Se declaran aquí, junto
 * a las rutas, porque desde fuera se enlazan igual —con `href()`— y así el día que
 * una sección vuelva a ser página basta con moverla de mapa.
 *
 * El identificador es también el `id` del `<section>` correspondiente.
 *
 * Por qué **calidad sí es página** y empresa no: «high purity aluminium wire quality
 * control» es una búsqueda real de comprador, y un ancla no posiciona. La competencia
 * también le da página propia. La historia de la empresa, en cambio, se lee de paso.
 */
export const sections = {
  company: 'company',
  contact: 'contact',
} as const

export type RouteKey = keyof typeof routes
export type SectionKey = keyof typeof sections
export type LinkKey = RouteKey | SectionKey

/** Distingue las anclas de la portada de las páginas de verdad. */
export function isSection(key: LinkKey): key is SectionKey {
  return key in sections
}

/**
 * Construye una URL **absoluta dentro del sitio**: href('en', 'products') →
 * `/en/products`, href('en', 'company') → `/en#company`.
 *
 * La barra inicial se añade aparte a propósito. Si se mete como cadena vacía al
 * principio del array, `filter(Boolean)` se la come y devuelve `en/products`
 * (relativa): desde la portada cuela por casualidad, pero desde cualquier página
 * interior el navegador la encadena → `/en/products/en/products` → 404. Pasó en el
 * proyecto de referencia y `npm run check:mobile` lo comprueba desde una ficha.
 */
export function href(locale: Locale, key: LinkKey, ...segments: string[]): string {
  if (isSection(key)) return `/${locale}#${sections[key]}`
  const parts = [locale, routes[key], ...segments].filter(Boolean)
  return `/${parts.join('/')}`
}

/** Entradas del menú. `as const` para que el tipo sea la unión exacta de claves
 *  (sin `home`) y el diccionario pueda indexarse sin comprobaciones extra. */
export const navigation = [
  'products',
  'spools',
  'quality',
  'company',
  'contact',
] as const satisfies readonly LinkKey[]

export type NavKey = (typeof navigation)[number]
