/**
 * IDIOMAS
 *
 * `en` es el idioma por defecto y no es una elección de comodidad: el inglés es el
 * idioma comercial del sector (el cliente de una bobina de hilo de aluminio para
 * metalizado es un convertidor de film, y compra en inglés esté en Pune, en Estambul
 * o en Barcelona). El hindi cubre el mercado interior indio y el español, la
 * exportación a España y Latinoamérica.
 */
export const locales = ['en', 'hi', 'es'] as const
export const defaultLocale = 'en' satisfies Locale

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Etiquetas del selector de idioma. */
export const localeNames: Record<Locale, string> = {
  en: 'EN',
  hi: 'हि',
  es: 'ES',
}

/**
 * `hreflang` para los alternates de SEO. `en-IN` sería más preciso para la sede,
 * pero el catálogo se dirige a compradores de cualquier país: `en` genérico evita
 * que Google sirva la versión inglesa sólo a India.
 */
export const localeHtmlLang: Record<Locale, string> = {
  en: 'en',
  hi: 'hi-IN',
  es: 'es',
}

/**
 * Un texto que existe en los tres idiomas. Todo el contenido usa esta forma, de modo
 * que añadir un idioma nuevo sea ampliar el tipo y que TypeScript señale exactamente
 * qué falta traducir.
 */
export type Localized<T = string> = Record<Locale, T>

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale]
}
