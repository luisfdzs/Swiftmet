import type { SpoolEntry } from '@/lib/content'
import { formatNumber } from '@/lib/format'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

/**
 * LA TABLA DE BOBINAS.
 *
 * Es el contenido más valioso del sitio, así que se publica como **tabla de verdad**
 * —`<table>`, con `<caption>`, `<th scope>` y unidades en el encabezado— y no como una
 * rejilla de `div`s que lo parezca. Tres razones prácticas:
 *
 * 1. Un lector de pantalla anuncia «SW320-1, diámetro de pestaña 320 milímetros»
 *    porque puede relacionar cada celda con su encabezado. En una rejilla de `div`s lee
 *    catorce filas de números sueltos.
 * 2. Se puede seleccionar y pegar en Excel, que es literalmente lo que va a hacer el
 *    comprador que compare proveedores.
 * 3. Google la entiende como datos y puede mostrarla como tal.
 *
 * En móvil la tabla **se desplaza en horizontal dentro de su caja**, no se reordena en
 * tarjetas. Siete cotas convertidas en catorce tarjetas de siete líneas son 98 líneas
 * que ya no se pueden comparar en vertical, que es justo para lo que sirve una tabla.
 * Lo que sí se hace es fijar la columna del código, para no perder de vista de qué
 * bobina se está leyendo la cota. El desbordamiento queda contenido en el `div`, así
 * que la página no desborda (lo comprueba `npm run check:mobile`).
 */
export function SpoolTable({ spools, locale }: { spools: SpoolEntry[]; locale: Locale }) {
  const t = getDictionary(locale)

  if (spools.length === 0) {
    return <p className="text-ink-soft">{t.spools.empty}</p>
  }

  const columns = [
    { key: 'netWeight', label: t.spools.netWeight, unit: 'kg' },
    { key: 'flangeDiameter', label: t.spools.flangeDiameter, unit: 'mm', cote: 'D1' },
    { key: 'coreDiameter', label: t.spools.coreDiameter, unit: 'mm', cote: 'D2' },
    { key: 'boreHole', label: t.spools.boreHole, unit: 'mm', cote: 'D3' },
    { key: 'spoolWidth', label: t.spools.spoolWidth, unit: 'mm', cote: 'L1' },
    { key: 'windingWidth', label: t.spools.windingWidth, unit: 'mm', cote: 'L2' },
  ] as const

  return (
    <div className="-mx-(--spacing-gutter) overflow-x-auto px-(--spacing-gutter)">
      {/* Cifras CENTRADAS en su columna, no alineadas a la izquierda. Se puede hacer sin
          perder nada porque toda la tabla va en monoespaciada con `tabular-nums`: los
          dígitos miden lo mismo, los valores de una misma cota tienen el mismo número de
          cifras y la columna sigue leyéndose en vertical, que es para lo que está. */}
      <table className="w-full min-w-[44rem] border-collapse text-center">
        {/* La leyenda de la tabla es su título accesible. Va oculta a la vista porque
            el encabezado de la sección ya dice lo mismo en grande, pero un lector de
            pantalla la necesita para anunciar de qué es esta tabla. */}
        <caption className="sr-only">{t.spools.tableCaption}</caption>

        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="eyebrow sticky left-0 bg-paper py-3 pr-4 align-bottom">
              {t.spools.code}
            </th>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="py-3 pl-4 align-bottom">
                {/* Cota y unidad viven en el encabezado, no en cada celda: repetir
                    «mm» catorce veces por columna es ruido que impide leer la cifra. */}
                <span className="eyebrow block text-ink">{column.label}</span>
                <span className="eyebrow block">
                  {'cote' in column ? `${column.cote} · ${column.unit}` : column.unit}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="figure-num">
          {spools.map((spool) => (
            // `group` en la fila y `group-hover` en la celda fija: sin esto, la columna
            // del código —que necesita fondo opaco para poder quedarse pegada— sería la
            // única que no se resalta al pasar por encima, y el subrayado de la fila
            // aparecería cortado justo donde empieza a leerse.
            <tr key={spool.code} className="group border-b border-line hover:bg-paper-deep">
              <th
                scope="row"
                className="sticky left-0 bg-paper py-3 pr-4 text-small font-normal text-ink group-hover:bg-paper-deep"
              >
                {spool.code}
                {spool.note && (
                  // `max-w` para que la nota ENVUELVA. Sin él, la nota más larga
                  // («Heavy wound: the largest spool in the programme…») fija el ancho de
                  // esta columna y, con `table-layout: auto`, se lleva 700 de los 1440 px
                  // disponibles: las seis columnas de cifras —que son el contenido— quedan
                  // apretadas a la derecha por culpa de un pie de nota.
                  <span className="mx-auto block max-w-[15rem] font-sans text-micro text-ink-faint">
                    {spool.note[locale]}
                  </span>
                )}
              </th>
              {columns.map((column) => (
                <td key={column.key} className="py-3 pl-4 text-small text-ink">
                  {formatNumber(spool[column.key], locale)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
