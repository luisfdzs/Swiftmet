import Link from 'next/link'
import { Figure } from '@/components/ui/Figure'
import { cn } from '@/lib/cn'
import type { ProductEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

type Props = {
  product: ProductEntry
  locale: Locale
  /** La primera tarjeta de la página carga con prioridad (candidata a LCP). */
  priority?: boolean
  span?: 'half' | 'wide'
}

export function ProductCard({ product, locale, priority = false, span = 'half' }: Props) {
  const t = getDictionary(locale)

  return (
    <article className={cn('group', span === 'wide' && 'md:col-span-2')}>
      <Link href={href(locale, 'products', product.slug)} className="block">
        <Figure
          image={product.cover}
          locale={locale}
          ratio={span === 'wide' ? '16 / 9' : '4 / 3'}
          sizes={
            span === 'wide' ? '(max-width: 768px) 100vw, 92vw' : '(max-width: 768px) 100vw, 46vw'
          }
          priority={priority}
          // El rótulo del hueco dice qué foto falta, en concreto. Así la propia web es la
          // lista de fotos que hay que pedirle a Swiftmet.
          label={product.name}
          className="transition-opacity duration-500 group-hover:opacity-90"
        />

        {/* Nombre y pureza, apilados y centrados bajo el filete. Antes iban en los dos
            extremos de la misma línea; con el resto de la web centrada, esa fila era lo
            único que seguía tirando la mirada a las esquinas. La pureza debajo del nombre
            se sigue leyendo como el dato de la tarjeta, y en hindi ya no se aprieta contra
            un nombre de producto largo. */}
        <div className="mt-4 border-t border-line pt-3 text-center">
          <h3 className="text-lead leading-tight">{product.name}</h3>
          {/* La pureza es el dato por el que se elige entre dos hilos: va en la tarjeta,
              no escondida en la ficha. En mono para que se lea como cifra. */}
          {product.purity && (
            <p className="figure-num mt-1 text-small text-signal">{product.purity}</p>
          )}
          <p className="eyebrow mt-2">{t.family[product.family]}</p>
          <p className="mt-2 text-small text-ink-soft">{product.summary[locale]}</p>
        </div>
      </Link>
    </article>
  )
}
