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
   * La foto ocupa la altura del contenedor en vez de una proporción fija (ver `Media`).
   * El hueco tramado sí conserva su proporción: un hueco que creciera hasta el fondo de
   * una columna vacía sería una trama de media pantalla.
   */
  stretch?: boolean
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
 * **Hoy los huecos de producto y el de calidad SÍ llevan foto**, de archivo industrial de
 * Pexels (`lib/photos.ts`), así que el recordatorio ya no está en pantalla: vive en el
 * README y en ese fichero. Se llegó ahí en dos pasadas, y la primera es la que enseña algo:
 * con material de Wikimedia —rollos de hilo de ACERO OXIDADO— la foto **desmentía** la
 * ficha, porque el aluminio no se oxida. Se retiró todo y se volvió a buscar con un
 * criterio explícito: nada de óxido, ninguna marca ajena legible, y `alt` que describen lo
 * que se ve y no lo que la ficha afirma.
 *
 * El componente no ha cambiado: sigue pintando el hueco en cuanto se le pasa `image={null}`,
 * y es lo que hay que hacer si un día no hay foto que aguante ese criterio.
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
  stretch = false,
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
        stretch={stretch}
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
