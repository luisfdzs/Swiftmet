import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { isIndexable } from '@/lib/site-env'

/**
 * Sólo la rama `main` se indexa. El entorno de test devuelve `disallow: /` para no
 * competir en Google con el dominio real por las mismas búsquedas.
 * El criterio vive en `lib/site-env.ts`, con el porqué explicado.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = isIndexable()

  return {
    rules: indexable ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    sitemap: indexable ? `${site.url}/sitemap.xml` : undefined,
  }
}
