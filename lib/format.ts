import { localeHtmlLang, type Locale } from '@/lib/i18n/config'

/**
 * FORMATO DE CIFRAS TÉCNICAS
 *
 * Existe por un motivo concreto: **2.75 y 2,75 son el mismo peso escrito de dos formas,
 * y en una tabla de compra confundirlas cuesta dinero.** El listado maestro está en
 * notación inglesa (punto decimal); un comprador español lee coma. Dejar los números
 * como texto en el CMS obligaría a mantener tres tablas, así que se guardan como
 * números (ver `sanity/schemas/spool.ts`) y se formatean aquí, en un solo sitio.
 *
 * `Intl` es determinista y no depende del reloj, así que se puede usar dentro de
 * componentes prerrenderizados con Cache Components sin romper el build.
 */

/**
 * Cifra con decimales sólo si los tiene. 38.5 → «38,5» en español, «38.5» en inglés;
 * 120 → «120» en los dos, no «120,0». Es lo que hace que una columna de cotas se lea
 * limpia en vez de llena de ceros decorativos.
 */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeHtmlLang[locale], {
    maximumFractionDigits: 2,
  }).format(value)
}

/** Milímetros. La unidad va aparte para poder pintarla en gris más pequeño. */
export function formatMm(value: number, locale: Locale): string {
  return `${formatNumber(value, locale)} mm`
}

/** Kilogramos. */
export function formatKg(value: number, locale: Locale): string {
  return `${formatNumber(value, locale)} kg`
}

/**
 * Rango de una lista de valores: «2,75 – 14,5 kg». Se calcula de los datos reales, no
 * se escribe a mano, porque es la cifra que la portada usa como argumento de venta
 * frente a la competencia — y si alguien añade una bobina de 18 kg en el panel, el
 * argumento debe actualizarse solo.
 */
export function formatRange(values: number[], locale: Locale, unit: string): string | null {
  if (values.length === 0) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return `${formatNumber(min, locale)} ${unit}`
  // Guion largo con espacios finos: es el rango tipográfico correcto y no se parte de
  // línea a mitad como lo haría un guion normal.
  return `${formatNumber(min, locale)} – ${formatNumber(max, locale)} ${unit}`
}
