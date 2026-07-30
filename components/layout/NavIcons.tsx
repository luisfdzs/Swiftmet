/**
 * Los iconos de navegación: los cinco huecos de la barra inferior de móvil, el botón de
 * menú y el globo que encabeza el selector de idioma en escritorio.
 *
 * Trazados de Lucide (ISC), salvo el de bobinas —ver abajo—. Van embebidos y no como
 * `<img>` por una razón concreta: dentro de la barra el icono tiene que heredar el color
 * del texto (`stroke: currentColor`), y la cabecera pasa de papel sobre el hero oscuro a
 * tinta sobre fondo claro al hacer scroll. Una imagen externa se quedaría de un color.
 *
 * Trazo a 1.5 en vez del 2 de Lucide: a 20-24 px el original pesa más que la tipografía
 * que tiene al lado, y esta web es una sans de documentación técnica, no un icono grueso.
 *
 * Sin `title` ni `role`: el nombre accesible lo pone el enlace o el botón que los envuelve.
 */
type IconProps = { className?: string }

const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Inicio. En escritorio ese papel lo hace la marca; en la barra de móvil, esto. */
export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  )
}

/** Productos: el bulto de hilo embalado. */
export function ProductsIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <path d="M3.29 7 12 12l8.71-5" />
      <path d="m7.5 4.27 9 5.15" />
    </svg>
  )
}

/**
 * Bobinas. Éste NO es de Lucide: es la sección axial de una bobina —dos pestañas y el
 * núcleo—, el mismo símbolo que dibuja el `Wordmark` y que a tamaño grande dibuja
 * `SpoolDiagram`. En un catálogo cuyo argumento son catorce medidas de bobina, el icono
 * de la sección central tiene que ser la pieza y no una metáfora prestada.
 */
export function SpoolsIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M5 3v18M19 3v18" />
      <path d="M5 8h14M5 16h14" />
    </svg>
  )
}

/** Calidad: el sello de lote comprobado. */
export function QualityIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

/**
 * Contacto. Un sobre y no un bocadillo: aquí la consulta se resuelve por correo o por
 * teléfono —no hay formulario ni chat— y el sobre promete exactamente eso.
 */
export function ContactIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

/** El globo del selector de idioma. Tres idiomas, y el sitio no bandera ninguno. */
export function GlobeIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
