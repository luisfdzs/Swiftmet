import Image from 'next/image'
import type { DescribedImage } from '@/lib/content'
import { cn } from '@/lib/cn'

type Props = {
  image: DescribedImage
  alt: string
  /** Anchos que la imagen ocupará según viewport. Obligatorio: sin esto el
   *  navegador descarga siempre la variante más grande. */
  sizes: string
  /** Sólo para la imagen que hace de LCP (una por página, ni una más). */
  priority?: boolean
  /** Recorte a una proporción fija (rejilla). Si se omite, respeta la del original. */
  ratio?: string
  className?: string
}

/**
 * Única forma de poner una fotografía en esta web.
 *
 * Centralizarlo garantiza tres cosas que a mano se olvidan siempre: dimensiones reales
 * (CLS = 0), placeholder difuminado y un `sizes` explícito.
 *
 * No se usa directamente desde las páginas: se usa a través de `<Figure>`, que decide
 * si hay foto o si toca pintar el hueco marcado.
 */
export function Media({ image, alt, sizes, priority = false, ratio, className }: Props) {
  return (
    <div
      className={cn('relative w-full overflow-hidden bg-paper-deep', className)}
      style={ratio ? { aspectRatio: ratio } : { aspectRatio: `${image.width} / ${image.height}` }}
    >
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        placeholder="blur"
        blurDataURL={image.blur}
        quality={75}
        className="object-cover"
      />
    </div>
  )
}
