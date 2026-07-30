import { Media } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import type { DescribedImage } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

type Props = {
  /** `null` mientras Swiftmet no haya subido la foto: es el caso normal hoy. */
  image: DescribedImage | null
  locale: Locale
  sizes: string
  /** Proporción de la fotografía real. */
  ratio: string
  /**
   * Proporción del HUECO cuando no hay foto. Por defecto es más plana que la de la foto
   * real, y a propósito: ver la explicación abajo.
   */
  placeholderRatio?: string
  priority?: boolean
  /** Qué debería verse aquí. Se muestra dentro del hueco. */
  label: string
  className?: string
}

/**
 * UN HUECO DE FOTOGRAFÍA, CON O SIN FOTOGRAFÍA.
 *
 * La web se ha construido **sin ninguna fotografía**: no hay imágenes de la planta de
 * Palwal, ni del hilo, ni de las bobinas. La decisión de diseño fue no disimularlo.
 *
 * Un placeholder que imita una foto (un gris liso, una silueta genérica, una foto de
 * stock de «industria») consigue que la web parezca terminada y que nadie se acuerde de
 * pedir las fotos: seis meses después sigue ahí, y ya nadie sabe si es intencionado. Un
 * hueco tramado que dice **qué foto falta** hace lo contrario: se ve al primer repaso,
 * se puede enseñar al cliente señalándolo, y desaparece solo en cuanto alguien sube la
 * imagen al panel — sin que haya que buscar y borrar nada en el código.
 *
 * Por eso el hueco lleva el rótulo de lo que debería verse (`label`) y no un texto
 * genérico. Es a la vez el placeholder y la lista de la compra.
 *
 * **El hueco es más plano que la foto que lo sustituirá** (`placeholderRatio`), y esto se
 * decidió viendo el resultado: con la proporción 4:3 de la foto real, siete productos sin
 * fotografía convertían el catálogo en un muro de tramas de dos pantallas de alto, con más
 * superficie dedicada a lo que falta que a lo que hay. Un hueco reconocible no necesita
 * reservar el tamaño exacto del futuro; sólo necesita verse. Cuando la foto llegue, ocupará
 * su 4:3 completo.
 */
export function Figure({
  image,
  locale,
  sizes,
  ratio,
  placeholderRatio = '16 / 6',
  priority = false,
  label,
  className,
}: Props) {
  const t = getDictionary(locale)

  if (image) {
    return (
      <Media
        image={image}
        alt={image.alt[locale]}
        sizes={sizes}
        ratio={ratio}
        priority={priority}
        className={className}
      />
    )
  }

  return (
    <div
      // `role="img"` con `aria-label`: para un lector de pantalla esto es «hueco de
      // fotografía pendiente», no un div decorativo mudo ni —peor— el texto del rótulo
      // leído como si fuera contenido de la página.
      role="img"
      aria-label={`${t.figure.photoPending}: ${label}`}
      style={{ aspectRatio: placeholderRatio }}
      className={cn(
        'placeholder-grid relative flex w-full flex-col items-center justify-end gap-1 border border-line p-4 text-center',
        className,
      )}
    >
      <p className="eyebrow text-ink-soft">{t.figure.photoPending}</p>
      <p className="text-small text-ink">{label}</p>
      <p className="text-micro text-ink-faint">{t.figure.photoPendingHint}</p>
    </div>
  )
}
