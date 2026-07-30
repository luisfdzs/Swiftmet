'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { localeNames, locales, type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href, isSection, navigation } from '@/lib/i18n/routes'
import { Wordmark } from './Wordmark'

type Props = {
  locale: Locale
  dictionary: Dictionary
}

/**
 * El único componente de cliente del sitio público. Necesita JS por tres cosas y
 * ninguna más: menú móvil, estado de scroll y saber en qué ruta estamos para el cambio
 * de idioma.
 */
export function Header({ locale, dictionary }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  /**
   * El menú guarda la ruta en la que se abrió, no un booleano. Así, en cuanto se navega
   * a otra ruta deja de estar abierto por derivación —sin un efecto que llame a
   * setState, que es un antipatrón y que el lint de React ya avisa— y también se cierra
   * al usar atrás/adelante del navegador.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const open = openedAt === pathname
  const setOpen = (value: boolean) => setOpenedAt(value ? pathname : null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquear el scroll de la página mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenedAt(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /** La misma página en otro idioma: se sustituye sólo el primer segmento. */
  const swapLocale = (target: Locale) => {
    const segments = pathname.split('/')
    segments[1] = target
    return segments.join('/') || `/${target}`
  }

  return (
    <>
      <header
        // Con el menú abierto la barra deja de estar «sobre el hero»: pasa a fondo papel
        // y tinta, para que se lea junto al panel desplegado.
        data-top={!scrolled && !open}
        className={cn(
          'sticky top-0 z-50 transition-colors duration-500',
          scrolled || open ? 'bg-paper/95 text-ink backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          {dictionary.nav.skipToContent}
        </a>

        <div className="header-bar page-gutter flex h-20 items-center justify-between gap-6 md:h-24">
          {/* `tap`: el wordmark mide 16 px de alto, por debajo del mínimo de 24 px que
              exige WCAG 2.2 para un objetivo pulsable. Lo detectó `npm run check:mobile`
              (nadie lo ve mirando la pantalla, y es el enlace más usado de la cabecera).
              La utilidad agranda el área con un pseudo-elemento invisible, así que la
              marca sigue midiendo lo que mide. */}
          <Link href={href(locale, 'home')} aria-label={dictionary.nav.home} className="tap">
            <Wordmark className="text-[0.9rem] md:text-[1.05rem]" />
          </Link>

          {/* `lg` y no `md` para el salto: son cinco entradas más el selector de tres
              idiomas, y en una tablet de 768 px eso se apelotona contra la marca. */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {navigation.map((key) => {
              const target = href(locale, key)
              // Empresa y contacto son anclas de la portada, no páginas: `aria-current`
              // marcaría las dos a la vez estando en el inicio, que es peor que no
              // marcar ninguna. Saber cuál se está viendo pediría un observador de
              // scroll, y esta barra ya carga con todo el JS que se le permite.
              const active =
                !isSection(key) && (pathname === target || pathname.startsWith(`${target}/`))
              return (
                <Link
                  key={key}
                  href={target}
                  aria-current={active ? 'page' : undefined}
                  // El color lo hereda del header (ver globals.css): sobre el hero es
                  // papel, sobre fondo claro es tinta. La jerarquía se marca con opacidad.
                  className={cn(
                    'link-underline tap text-small tracking-wide transition-opacity',
                    active ? 'opacity-100' : 'opacity-65 hover:opacity-100',
                  )}
                >
                  {dictionary.nav[key]}
                </Link>
              )
            })}

            <span aria-hidden className="h-3 w-px bg-current opacity-30" />

            <div className="flex items-center gap-3">
              {locales.map((option) => (
                <Link
                  key={option}
                  href={swapLocale(option)}
                  hrefLang={option}
                  aria-current={option === locale ? 'true' : undefined}
                  className={cn(
                    'text-micro tap transition-opacity',
                    option === locale ? 'opacity-100' : 'opacity-50 hover:opacity-100',
                  )}
                >
                  {localeNames[option]}
                </Link>
              ))}
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="eyebrow tap text-current lg:hidden"
          >
            {open ? dictionary.nav.close : dictionary.nav.menu}
          </button>
        </div>
      </header>

      {/* Menú móvil: pantalla completa, tipografía grande, sin adornos.
          Va FUERA del <header> a propósito: la barra usa `backdrop-blur`, y un filtro
          convierte al elemento en bloque contenedor de sus descendientes `fixed`.
          Dentro del header, este panel calcularía su alto contra una barra de 80 px y se
          quedaría en 0 px — el menú se abriría vacío. Es un fallo real del proyecto de
          referencia y `npm run check:mobile` mide la altura para que no vuelva. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="page-gutter fixed inset-0 top-20 z-40 overflow-y-auto bg-paper lg:hidden"
      >
        <nav className="flex flex-col gap-5 pt-10 pb-16" aria-label="Main">
          {navigation.map((key) => (
            <Link
              key={key}
              href={href(locale, key)}
              className="text-title"
              onClick={() => setOpen(false)}
            >
              {dictionary.nav[key]}
            </Link>
          ))}
          <div className="mt-6 flex items-center gap-5 border-t border-line pt-6">
            {locales.map((option) => (
              <Link
                key={option}
                href={swapLocale(option)}
                hrefLang={option}
                className={cn('eyebrow tap', option === locale && 'text-ink')}
                onClick={() => setOpen(false)}
              >
                {localeNames[option]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}
