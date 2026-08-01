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
  /**
   * Pie de foto VISIBLE. Se pasa cuando la fotografía está sola, sin ningún texto que
   * diga qué es (ver la explicación abajo). Con pie, la imagen se marca como decorativa
   * (`alt=""`): el pie ya dice lo mismo y un lector de pantalla lo leería dos veces.
   */
  caption?: string
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
 * **EL PIE DE FOTO (`caption`) EXISTE POR UNA REGLA QUE LA WEB YA CUMPLÍA SIN ESCRIBIRLA:**
 * en todo el sitio, al lado de cada imagen hay un texto que dice qué es. La portada de una
 * tarjeta lleva debajo nombre, pureza, familia y resumen; la portada de una ficha lleva los
 * párrafos del producto; la apertura de `/quality` va entre el titular y los puntos de
 * control; y el hueco tramado, cuando no hay foto, escribe él mismo qué falta. Las dos
 * fotografías que se añadieron después —la segunda de la ficha y la que rellena la media
 * fila del catálogo— eran las únicas mudas: puestas justamente donde no hay texto, y por
 * eso se notaba. Con pie vuelven a la norma de la casa.
 *
 * El pie es **el mismo texto del `alt`**, no uno nuevo. Dos descripciones de la misma foto
 * se separan con el primer retoque y acaban diciendo cosas distintas; y esa descripción ya
 * está escrita en los tres idiomas y bajo la regla 3 —lo que se ve, nunca un grado ni una
 * planta—, que es exactamente lo que un pie puede afirmar de una foto de archivo.
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
  caption,
  className,
}: Props) {
  const t = getDictionary(locale)
  const text = caption?.trim()

  if (image) {
    const media = (
      <Media
        image={image}
        alt={text ? '' : image.alt[locale]}
        sizes={sizes}
        ratio={ratio}
        stretch={stretch}
        priority={priority}
        // Sin pie, `className` es de la imagen y manda quien la coloca. Con pie, lo
        // recibe el `<figure>` y la imagen pasa a ser la parte que crece dentro de él
        // (`min-h-0`, para que también pueda encoger hasta cero).
        className={text ? 'grow min-h-0' : className}
      />
    )

    if (!text) return media

    /**
     * EL PIE DE UNA FOTO QUE RELLENA UN HUECO VA **DENTRO** DE LA FOTO, y no debajo.
     *
     * Con `stretch` la altura de la imagen es la que sobre en la columna, y a veces no
     * sobra nada: medido a 1440 px, el hueco de las tres fichas de hilo de metalizado es
     * exactamente cero en los tres idiomas —la columna de datos es la más larga de las
     * dos— y la foto no se pinta, que es la respuesta correcta. Un pie en el flujo, con
     * su altura propia, sobrevivía a esa foto: quedaba una línea suelta describiendo una
     * fotografía que no estaba. Absoluto y sobre la imagen, ocupa cero y lo recorta el
     * mismo `overflow-hidden` que recorta la foto: si no hay foto, no hay pie.
     *
     * El degradado no es adorno: el pie cae sobre fotografía que no controlamos —un
     * rollo de hilo puede ser casi blanco— y sin él la línea desaparece en las claras.
     */
    if (stretch) {
      return (
        <figure className={cn('relative flex flex-col overflow-hidden', className)}>
          {media}
          <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pt-10 pb-3 text-center text-micro text-white">
            {text}
          </figcaption>
        </figure>
      )
    }

    // Con proporción fija la altura se sabe de antemano, así que el pie va debajo, en el
    // flujo: una línea bajo la foto, como el nombre y el resumen bajo la portada de una
    // tarjeta de producto.
    return (
      <figure className={cn('flex flex-col', className)}>
        {media}
        <figcaption className="mt-3 text-small text-ink-faint">{text}</figcaption>
      </figure>
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
