import { cn } from '@/lib/cn'

/**
 * MARCA SWIFTMET.
 *
 * ⚠️ **Es un logotipo provisional, construido con tipografía.** No existe (o no está
 * publicado) un logotipo vectorial de Swiftmet: su presencia en internet son fichas de
 * directorios B2B sin material de marca. Ver README, «Pendiente de confirmar».
 *
 * Se resuelve con un símbolo geométrico + el nombre en la sans del sistema, en lugar de
 * un SVG con el texto trazado, por una razón concreta: el día que llegue el logotipo
 * real basta con sustituir el `<svg>` del símbolo y este componente sigue encajando en
 * la cabecera y en el pie sin tocar nada más. Un wordmark trazado a mano habría que
 * tirarlo entero.
 *
 * El símbolo **es la propia sección de una bobina** —dos pestañas y el agujero del
 * husillo, la misma vista que dibuja `SpoolDiagram`— porque es lo que Swiftmet vende y
 * porque, a 20 px de alto, tres barras verticales se leen; un dibujo detallado no.
 *
 * Todo va en `currentColor`: la cabecera es transparente sobre el hero oscuro (marca en
 * color papel) y pasa a fondo papel al bajar (marca en tinta). Heredar el color es lo
 * que permite las dos cosas con un solo elemento.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5 text-current', className)}>
      <svg
        viewBox="0 0 24 24"
        className="h-[1.15em] w-auto shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
        focusable="false"
      >
        {/* Pestañas */}
        <path d="M4 2v20M20 2v20" />
        {/* Núcleo */}
        <path d="M4 8h16M4 16h16" />
      </svg>
      <span className="text-[1em] leading-none font-medium tracking-[0.18em] uppercase">
        Swiftmet
      </span>
    </span>
  )
}
