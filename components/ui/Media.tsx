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
  /**
   * No fija ninguna proporción: la foto ocupa la altura que le dé el contenedor y se
   * recorta con `object-cover`. Es lo que permite que la segunda foto de una ficha
   * rellene un hueco cuya altura no se sabe hasta que el navegador maqueta la columna.
   * Quien lo active tiene que darle altura por `className` —si no, la foto mide cero—.
   */
  stretch?: boolean
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
export function Media({
  image,
  alt,
  sizes,
  priority = false,
  ratio,
  stretch = false,
  className,
}: Props) {
  /**
   * Las imágenes que NO vienen de Sanity —hoy, las fotos de archivo de `public/photos`—
   * se sirven tal cual. El cargador de la web es el de la CDN de Sanity
   * (`sanity/imageLoader.ts`) y para una ruta local devuelve el `src` sin tocar, así que
   * `next/image` avisa por consola de que el cargador «no implementa width» y con razón:
   * pediría siete anchos distintos del mismo fichero. Declararlo aquí es la solución que
   * documenta Next, y no cuesta nada porque esos ficheros **ya vienen recortados al
   * tamaño de su hueco** (1280 px las fichas, 2048 el panorámico) y pesan 80–200 kB.
   *
   * Lo que sube Swiftmet al panel sigue pasando por la CDN de Sanity, que es donde una
   * foto de 25 MB tiene que adelgazar.
   */
  const unoptimized = !image.src.startsWith('https://cdn.sanity.io/')

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-paper-deep', className)}
      style={
        stretch
          ? undefined
          : ratio
            ? { aspectRatio: ratio }
            : { aspectRatio: `${image.width} / ${image.height}` }
      }
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
        unoptimized={unoptimized}
        className="object-cover"
      />
    </div>
  )
}
