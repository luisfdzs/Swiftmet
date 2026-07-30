import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { getProductSlugs } from '@/lib/content'
import { locales } from '@/lib/i18n/config'
import { href, isSection, navigation } from '@/lib/i18n/routes'

/**
 * Sitemap generado del contenido real: no hay lista de URLs que mantener a mano y por
 * tanto no puede quedar desactualizado.
 *
 * `changeFrequency` refleja lo que de verdad cambia: el programa de bobinas y la lista de
 * productos se amplían de vez en cuando (`monthly`), y una ficha de producto concreta casi
 * nunca (`yearly`). Es una pista para el rastreador, no una promesa.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const slugs = await getProductSlugs()

  for (const locale of locales) {
    entries.push({ url: `${site.url}/${locale}`, changeFrequency: 'monthly', priority: 1 })

    // Del menú sólo entran las páginas: empresa y contacto son anclas de la portada, que
    // ya está listada arriba. Un `#` en el sitemap no es una URL distinta.
    for (const key of navigation.filter((entry) => !isSection(entry))) {
      entries.push({
        url: `${site.url}${href(locale, key)}`,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    for (const slug of slugs) {
      entries.push({
        url: `${site.url}${href(locale, 'products', slug)}`,
        changeFrequency: 'yearly',
        priority: 0.7,
      })
    }
  }

  return entries
}
