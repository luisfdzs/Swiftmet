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
    <dl className={cn('border-t border-line', className)}>
      {rows.map((spec) => (
        <div
          key={spec.label}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-3"
        >
          <dt className="eyebrow">{spec.label}</dt>
          <dd className={cn('text-small', spec.numeric && 'figure-num text-ink')}>{spec.value}</dd>
        </div>
      ))}
    </dl>
  )
}
