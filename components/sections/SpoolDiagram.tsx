import type { SpoolEntry } from '@/lib/content'

/**
 * SECCIÓN AXIAL DE UNA BOBINA, DIBUJADA A ESCALA DESDE LAS COTAS.
 *
 * Esto es el sustituto honesto de una fotografía de producto: no tenemos foto de las
 * bobinas, pero sí tenemos sus cinco cotas, y con cinco cotas se puede dibujar la pieza
 * de verdad en vez de insinuarla. El resultado le dice a un comprador lo que una foto no
 * le diría nunca: si la bobina entra en su máquina.
 *
 * El dibujo es la **media sección axial**, que es la vista con la que se elige una
 * bobina: se ven las dos pestañas, el núcleo sobre el que se bobina y el agujero del
 * husillo, todo con las proporciones reales.
 *
 *      │◄────────── L1 ──────────►│
 *      ┌───┐                  ┌───┐   ▲
 *      │   │                  │   │   │ D1  (pestaña)
 *      │   ├──────────────────┤   │   │
 *      │   │                  │   │   │ D2  (núcleo)
 *      │   ├─ ─ ─ eje ─ ─ ─ ─ ┤   │   │ D3  (agujero)
 *      └───┘                  └───┘   ▼
 *          │◄────── L2 ──────►│
 *
 * **La escala la impone quien llama, no cada dibujo.** `scale` trae el mayor diámetro y
 * la mayor anchura de TODA la tabla, y con ellos se construye un `viewBox` idéntico para
 * las catorce siluetas. Es lo único que hace el conjunto comparable: si cada SVG se
 * ajustara a su propia pieza, la bobina de 200 mm y la de 360 mm se dibujarían del mismo
 * tamaño en pantalla y el dibujo mentiría precisamente en lo que se quiere mostrar.
 *
 * No se dibuja el hilo bobinado a propósito: la cota que importa es la de la bobina
 * vacía, y un carrete de hilo insinuado sólo taparía el núcleo.
 */
export function SpoolDiagram({
  spool,
  scale,
  className,
}: {
  spool: SpoolEntry
  /** Máximos de la tabla completa: fijan el `viewBox` común. */
  scale: { maxDiameter: number; maxWidth: number }
  className?: string
}) {
  const { flangeDiameter: d1, coreDiameter: d2, boreHole: d3, spoolWidth: l1 } = spool

  /** Grueso de cada pestaña: lo que sobra de la anchura total tras el bobinado. */
  const flange = Math.max((l1 - spool.windingWidth) / 2, 0.5)

  // Aire alrededor, en milímetros del propio dibujo, para que el trazo no se coma el borde
  // del `viewBox` ni las siluetas se toquen entre celdas. Ajustado a la baja tras verlo
  // renderizado: el `viewBox` se escala por la dimensión mayor (el diámetro), así que cada
  // milímetro de margen se paga dos veces en el ancho aparente del dibujo, que es la
  // dimensión pequeña y por tanto la que se queda sin sitio.
  const pad = 6
  const viewBox = [
    -pad,
    -(scale.maxDiameter / 2 + pad),
    scale.maxWidth + pad * 2,
    scale.maxDiameter + pad * 2,
  ].join(' ')

  return (
    <svg
      viewBox={viewBox}
      className={className}
      // El dibujo es decorativo respecto a la tabla: las mismas cotas están en la fila
      // correspondiente, en texto, así que un lector de pantalla no debe leerlas dos
      // veces. La accesibilidad de este bloque la sostiene la tabla.
      aria-hidden="true"
      focusable="false"
    >
      {/* Eje de giro. Se dibuja primero para que quede por debajo de la pieza. */}
      <line
        x1={-pad / 2}
        y1={0}
        x2={l1 + pad / 2}
        y2={0}
        stroke="var(--color-ink-faint)"
        strokeWidth={1}
        strokeDasharray="10 5 2 5"
        vectorEffect="non-scaling-stroke"
      />

      {/* Núcleo: de agujero a núcleo, arriba y abajo del eje. Dos rectángulos en vez de
          uno con el agujero recortado — más simple y no necesita máscara. */}
      {[-1, 1].map((side) => (
        <rect
          key={`core-${side}`}
          x={0}
          y={side === 1 ? d3 / 2 : -d2 / 2}
          width={l1}
          height={(d2 - d3) / 2}
          fill="var(--color-paper-deep)"
          stroke="var(--color-ink)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Pestañas: de agujero a pestaña, en los dos extremos y a los dos lados del eje. */}
      {[0, l1 - flange].map((x) =>
        [-1, 1].map((side) => (
          <rect
            key={`flange-${x}-${side}`}
            x={x}
            y={side === 1 ? d3 / 2 : -d1 / 2}
            width={flange}
            height={(d1 - d3) / 2}
            fill="var(--color-ink)"
            stroke="var(--color-ink)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        )),
      )}
    </svg>
  )
}
