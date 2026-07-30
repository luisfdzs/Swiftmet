import { cn } from '@/lib/cn'

export type Spec = {
  label: string
  /** `null` o vacío y la fila no se pinta: mejor una ficha corta que un «—». */
  value: string | null | undefined
  /** Cifras en monoespaciada tabular; texto corrido, en la sans. */
  numeric?: boolean
}

/**
 * Ficha de especificaciones: pares etiqueta/valor sobre filetes de 1 px.
 *
 * **Las filas vacías no se pintan.** Es una decisión, no un descuido: en un catálogo
 * industrial, «Tensile strength: —» le dice al comprador que el dato existe y que no se
 * lo damos, lo que invita a preguntárselo a la competencia. Si no hay dato, la fila no
 * existe y la ficha se lee entera y verdadera.
 */
export function SpecList({ specs, className }: { specs: Spec[]; className?: string }) {
  const rows = specs.filter((spec) => spec.value != null && spec.value !== '')
  if (rows.length === 0) return null

  return (
    // Etiqueta ARRIBA y valor debajo, los dos centrados, en vez de a los dos extremos de la
    // misma línea. Con el resto de la ficha centrada, una fila que empuja el nombre de la
    // cota a un borde y la cifra al otro deja un hueco en medio que el ojo tiene que
    // cruzar; apilados, el par se lee de un golpe. La cifra sigue siendo lo que más pesa
    // —en mono y en tinta— y las filas siguen separadas por su filete de 1 px.
    <dl className={cn('border-t border-line text-center', className)}>
      {rows.map((spec) => (
        <div key={spec.label} className="border-b border-line py-3">
          <dt className="eyebrow">{spec.label}</dt>
          <dd className={cn('mt-1 text-small', spec.numeric && 'figure-num text-ink')}>
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
