import type { Locale } from './config'

/**
 * Rutas del sitio en un único sitio. Los segmentos son neutros (`/products`,
 * `/spools`) para que los tres idiomas compartan estructura de ficheros; si algún día
 * queremos slugs localizados (`/es/bobinas`), se hace con un mapa aquí sin tocar
 * ninguna página.
 *
 * **TODA SECCIÓN DEL SITIO ES UNA RUTA. NUNCA UN ANCLA.** Es la regla que gobierna este
 * fichero y hay que mantenerla al añadir cualquier destino nuevo.
 *
 * Hasta ahora había dos clases de destino: páginas de verdad (`/en/products`) y dos
 * secciones de la portada que se enlazaban por ancla (`/en#company`, `/en#contact`). La
 * mezcla se pagaba en la navegación: `usePathname()` no ve el fragmento —el navegador no
 * lo manda al servidor y Next no lo expone—, así que estando en el inicio la barra o no
 * marcaba nada, o marcaba «inicio» mientras se estaba leyendo contacto. Saber qué ancla
 * se está viendo pedía un observador de scroll: JavaScript y un estado más en cada barra
 * para acabar adivinando lo que una ruta dice sin ambigüedad.
 *
 * Con empresa y contacto como páginas, el resaltado vuelve a ser una sola regla
 * (`isCurrent`) y vale igual para las cinco entradas. De paso, cada sección gana lo que un
 * ancla no puede tener: título propio, descripción propia, entrada en el sitemap y una URL
 * que se comparte sin depender de dónde estuviera el scroll.
 *
 * Lo único que sigue usando `#` en toda la web es el enlace «saltar al contenido» de la
 * cabecera (`#main`), que es un salto DENTRO de la página abierta y el patrón que exige
 * WCAG para poder saltarse la navegación. No es un destino del sitio y no pasa por aquí.
 */
export const routes = {
  home: '',
  products: 'products',
  spools: 'spools',
  quality: 'quality',
  company: 'company',
  contact: 'contact',
} as const

export type RouteKey = keyof typeof routes

/**
 * Construye una URL **absoluta dentro del sitio**: href('en', 'products') →
 * `/en/products`, href('en', 'company') → `/en/company`.
 *
 * La barra inicial se añade aparte a propósito. Si se mete como cadena vacía al
 * principio del array, `filter(Boolean)` se la come y devuelve `en/products`
 * (relativa): desde la portada cuela por casualidad, pero desde cualquier página
 * interior el navegador la encadena → `/en/products/en/products` → 404. Pasó en el
 * proyecto de referencia y `npm run check:mobile` lo comprueba desde una ficha.
 */
export function href(locale: Locale, key: RouteKey, ...segments: string[]): string {
  const parts = [locale, routes[key], ...segments].filter(Boolean)
  return `/${parts.join('/')}`
}

/**
 * ¿Es esta la página en la que estamos? Una sola regla para las cinco entradas del menú,
 * que es lo que se ganó al convertir las anclas en rutas. Vive aquí y no en cada barra
 * porque cabecera y barra de móvil tienen que marcar exactamente lo mismo.
 *
 * El prefijo cuenta —`/en/products/1080…` marca «productos»— pero comparando el segmento
 * entero: sin la barra, `/en/contact` marcaría también un hipotético `/en/contacts`. El
 * inicio se compara exacto, o marcaría el sitio entero.
 */
export function isCurrent(pathname: string, locale: Locale, key: RouteKey): boolean {
  const target = href(locale, key)
  if (key === 'home') return pathname === target
  return pathname === target || pathname.startsWith(`${target}/`)
}

/** Entradas del menú. `as const` para que el tipo sea la unión exacta de claves
 *  (sin `home`) y el diccionario pueda indexarse sin comprobaciones extra. */
export const navigation = [
  'products',
  'spools',
  'quality',
  'company',
  'contact',
] as const satisfies readonly RouteKey[]

export type NavKey = (typeof navigation)[number]
