'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { localeNames, locales, type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href, isSection, navigation, type RouteKey } from '@/lib/i18n/routes'
import { CloseIcon, ContactIcon, HomeIcon, MenuIcon, ProductsIcon, SpoolsIcon } from './NavIcons'

/**
 * LA NAVEGACIÓN DE MÓVIL: una barra fija abajo, siempre a la vista, en cualquier página y
 * a cualquier altura del scroll.
 *
 * Sustituye al botón «Menu» que había en la esquina de la cabecera. El motivo es el
 * pulgar: en un teléfono en la mano, el borde inferior se alcanza sin recolocar el aparato
 * y la esquina superior derecha no. Arriba se queda sólo la marca, centrada.
 *
 * Cinco huecos: inicio, productos, bobinas, contacto y el menú completo. Los cuatro
 * primeros son los destinos que un comprador usa —y bobinas es el contenido por el que
 * existe esta web, así que va en la barra y no detrás de un botón—; el quinto abre el
 * índice entero del sitio, calidad y empresa incluidas.
 *
 * Sólo iconos, sin rótulo: cinco palabras en versalitas a lo ancho de un móvil de 390 px
 * o se cortan o se aprietan hasta ser ilegibles, y en hindi son más largas todavía. El
 * nombre accesible va en el `aria-label` de cada hueco, traducido.
 */
export function MobileNav({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const pathname = usePathname()

  /**
   * El menú guarda la ruta en la que se abrió, no un booleano. Así, en cuanto se navega a
   * otra ruta deja de estar abierto por derivación —sin un efecto que llame a setState,
   * que es un antipatrón y que el lint de React ya avisa— y también se cierra al usar
   * atrás/adelante del navegador.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const open = openedAt === pathname
  const close = () => setOpenedAt(null)

  // Con el menú a pantalla completa, la página de detrás no debe moverse.
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

  const home = href(locale, 'home')
  /** ¿Estamos en esta página (o en una ficha dentro de ella)? Sólo para rutas reales. */
  const onRoute = (key: RouteKey) => {
    const target = href(locale, key)
    return pathname === target || pathname.startsWith(`${target}/`)
  }

  /**
   * Estando en Calidad, ninguno de los cuatro destinos de la barra diría dónde está: esa
   * página vive detrás del menú. Así que el botón que la guarda se marca como activo y la
   * barra nunca queda sin señalar la página en la que se está.
   */
  const inPanel = onRoute('quality')

  return (
    <>
      {/* El panel va antes que la barra en el DOM y ambos comparten `z-index`: así la
          barra queda por encima y su botón sigue pulsable para cerrar. Cubre la cabecera a
          propósito —es un menú a pantalla completa— y por eso lleva fondo papel OPACO: con
          un fondo translúcido se leería el hero oscuro por debajo del texto en tinta.

          `hidden` y no un `return` condicional: así el botón conserva `aria-controls`
          apuntando a un nodo que siempre existe. Y sin utilidad de `display` propia: un
          `flex` aquí discutiría con el atributo, que es quien apaga el panel cerrado. El
          centrado lo pone el <nav> de dentro. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="page-gutter fixed inset-x-0 top-0 bottom-(--spacing-nav-mobile) z-50 overflow-y-auto bg-paper lg:hidden"
      >
        <nav
          // `min-h-full` y no `h-full`: con el menú centrado basta para llenar el panel, y
          // si algún día las entradas no caben en una pantalla baja, crece y el
          // `overflow-y-auto` de arriba las deja alcanzables.
          className="flex min-h-full flex-col items-center justify-center gap-6 py-12 text-center"
          aria-label="Main"
        >
          {navigation.map((key) => {
            const active = !isSection(key) && onRoute(key)
            return (
              <Link
                key={key}
                href={href(locale, key)}
                aria-current={active ? 'page' : undefined}
                onClick={close}
                className={cn('text-title', active ? 'text-signal' : 'text-ink')}
              >
                {dictionary.nav[key]}
              </Link>
            )
          })}

          <div className="mt-6 flex items-center justify-center gap-5 border-t border-line pt-6">
            {locales.map((option) => (
              <Link
                key={option}
                href={swapLocale(pathname, option)}
                hrefLang={option}
                aria-current={option === locale ? 'true' : undefined}
                className={cn('eyebrow tap', option === locale && 'text-ink')}
                onClick={close}
              >
                {localeNames[option]}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-50 flex h-(--spacing-nav-mobile) items-stretch border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <NavSlot
          href={home}
          label={dictionary.nav.home}
          active={pathname === home}
          // Estando ya en la portada, Next no navega y el toque no haría nada. Igual que
          // la marca de la cabecera: la casa lleva siempre al principio.
          onClick={(event) => {
            close()
            if (pathname === home) {
              event.preventDefault()
              window.scrollTo({ top: 0 })
            }
          }}
        >
          <HomeIcon className="h-6 w-6" />
        </NavSlot>

        <NavSlot
          href={href(locale, 'products')}
          label={dictionary.nav.products}
          active={onRoute('products')}
          onClick={close}
        >
          <ProductsIcon className="h-6 w-6" />
        </NavSlot>

        <NavSlot
          href={href(locale, 'spools')}
          label={dictionary.nav.spools}
          active={onRoute('spools')}
          onClick={close}
        >
          <SpoolsIcon className="h-6 w-6" />
        </NavSlot>

        {/* Contacto es un ancla de la portada, no una página, así que nunca se marca como
            activo: saber si se está viendo esa sección pediría un observador de scroll, y
            marcarla a la vez que «inicio» sería peor que no marcar ninguna. */}
        <NavSlot
          href={href(locale, 'contact')}
          label={dictionary.nav.contact}
          active={false}
          onClick={close}
        >
          <ContactIcon className="h-6 w-6" />
        </NavSlot>

        <button
          type="button"
          onClick={() => setOpenedAt(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? dictionary.nav.close : dictionary.nav.menu}
          className={cn(slotClass, slotState(open || inPanel))}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>
    </>
  )
}

/** La misma página en otro idioma: se sustituye sólo el primer segmento. */
function swapLocale(pathname: string, target: Locale) {
  const segments = pathname.split('/')
  segments[1] = target
  return segments.join('/') || `/${target}`
}

/**
 * El hueco de cada icono. Reparte el ancho a partes iguales y estira a todo el alto de la
 * barra —gracias al `items-stretch` del `<nav>`—, así que el propio hueco ya mide la celda
 * entera: no hace falta una pastilla aparte de tamaño fijo, y de paso el área pulsable
 * pasa de sobra los 24 px de WCAG 2.2.
 *
 * El activo va en el acento del sistema, y no sólo en el color: a 24 px y con trazo de
 * 1,5 px, un azul acero contra un gris hay que buscarlo. Así que el estado se dice también
 * en el fondo, con un cuadrado del mismo acento muy rebajado que ocupa la celda entera
 * —cuadrado y no redondo a propósito, para que se lea como un hueco de la barra y no como
 * un botón suelto—.
 */
const slotClass =
  'relative flex flex-1 flex-col items-center justify-center transition-colors duration-500'

const slotState = (active: boolean) => (active ? 'bg-signal/12 text-signal' : 'text-ink opacity-55')

function NavSlot({
  href: target,
  label,
  active,
  onClick,
  children,
}: {
  href: string
  label: string
  active: boolean
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={target}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(slotClass, slotState(active))}
    >
      {children}
    </Link>
  )
}
