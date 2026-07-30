import Link from 'next/link'
import { defaultLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * 404 dentro del layout de idioma. No puede leer `params` (Next la renderiza sin ellos),
 * así que usa el idioma por defecto: es la única página del sitio que no está traducida
 * por ruta. Con `en` por defecto, además, es el idioma que más probablemente entienda
 * quien haya llegado aquí por un enlace roto.
 */
export default function NotFound() {
  const t = getDictionary(defaultLocale)

  return (
    <div className="page-gutter flex min-h-[60svh] flex-col justify-center py-24">
      <p className="figure-num eyebrow">404</p>
      <h1 className="text-display mt-6 max-w-2xl text-balance">{t.notFound.title}</h1>
      <p className="mt-6 max-w-md text-ink-soft">{t.notFound.lead}</p>
      <Link
        href={href(defaultLocale, 'home')}
        className="link-underline tap mt-10 w-fit text-small"
      >
        {t.notFound.cta}
      </Link>
    </div>
  )
}
