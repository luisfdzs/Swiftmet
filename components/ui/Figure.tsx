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
   * Pie de foto VISIBLE, con la misma forma que el texto de una tarjeta de producto:
   * título, subtítulo y descripción bajo un filete. Se pasa cuando la fotografía está
   * sola, sin ningún texto alrededor que diga qué es (ver la explicación abajo).
   *
   * Con pie, la imagen se marca como decorativa (`alt=""`): la descripción del pie es la
   * misma frase, y un lector de pantalla la leería dos veces.
   */
  caption?: {
    /** Nombre del producto. */
    title: string
    /** La pureza, en mono: es la cifra por la que se elige entre dos hilos. Se omite si
     *  no hay —`null` es lo que trae el contenido cuando el cliente no la ha rellenado—. */
    purity?: string | null
    /** Subtítulo: la familia, en versalitas, como en la tarjeta. */
    subtitle?: string
    /** Qué se ve en la fotografía. Es el `alt`, no un texto nuevo. */
    description: string
  }
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
 * Y vuelven **con la forma de la casa**, que es lo segundo que hubo que corregir: el primer
 * intento fue una línea pequeña suelta, y el patrón de esta web es un bloque de tres —
 * título, subtítulo y descripción bajo un filete, exactamente el de `ProductCard`—. Aquí el
 * título es el nombre del producto, el subtítulo su pureza y la descripción, la foto.
 *
 * La descripción es **el mismo texto del `alt`**, no uno nuevo. Dos descripciones de la
 * misma foto se separan con el primer retoque y acaban diciendo cosas distintas; y esa ya
 * está escrita en los tres idiomas y bajo la regla 3 —lo que se ve, nunca un grado ni una
 * planta—, que es exactamente lo que se puede afirmar de una foto de archivo. El título y
 * la pureza los pone el sitio alrededor, como en cualquier tarjeta: es lo que Luis pidió,
 * sabiendo que acerca la foto de archivo al producto (regla 8, corolario de imágenes).
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

  if (image) {
    const media = (
      <Media
        image={image}
        alt={caption ? '' : image.alt[locale]}
        sizes={sizes}
        ratio={ratio}
        stretch={stretch}
        priority={priority}
        // Sin pie, `className` es de la imagen y manda quien la coloca. Con pie, lo
        // recibe el `<figure>` y la imagen pasa a ser la parte que crece dentro de él.
        //
        // `min-h-48` sólo importa con `stretch`, y es el cambio que trajo el pie: la foto
        // crecía hasta llenar el hueco que sobrara y, si no sobraba, medía cero y no se
        // pintaba —correcto mientras no llevaba texto—. Con un bloque de texto debajo,
        // que sí ocupa altura y no puede encogerse solo, esa foto de cero px dejaba un
        // nombre de producto y una descripción bajo una imagen invisible. Con mínimo, o
        // hay bloque entero o no hay nada; el precio es que en las fichas sin hueco la
        // columna de datos se pasa de largo, y eso se ve y se acepta.
        className={caption ? cn('grow', stretch && 'min-h-48') : className}
      />
    )

    if (!caption) return media

    return (
      /**
       * `min-h-0` + `overflow-hidden` NO SON DECORACIÓN, y sólo importan con `stretch`.
       *
       * Ahí la altura de este bloque es la que sobre en la columna, y a veces no sobra
       * nada: medido a 1280 y a 1440 px, las tres fichas de hilo de metalizado no dejan
       * hueco en los tres idiomas —la columna de datos es la larga— y la foto no se
       * pinta, que es la respuesta correcta. Sin `min-h-0`, el pie, que sí tiene altura
       * propia, impediría al bloque encoger y **alargaría la columna** justo en las
       * fichas donde no había hueco que tapar; sin `overflow-hidden`, sobreviviría a su
       * fotografía y quedaría un nombre de producto suelto bajo una imagen que no está.
       * Con los dos, foto y texto aparecen y desaparecen juntos.
       */
      <figure className={cn('flex min-h-0 flex-col overflow-hidden', className)}>
        {media}
        {/* Mismo bloque que bajo la portada de una tarjeta, y con las mismas CUATRO
            líneas: filete, nombre, la pureza en mono, la familia en versalitas y la
            descripción. Las clases salen de `ProductCard` y hay que mantenerlas a la par:
            con tres líneas, la descripción de una foto de relleno quedaba 20 px más alta
            que la de la tarjeta de al lado, y en una rejilla de dos columnas eso se ve. */}
        <figcaption className="mt-4 border-t border-line pt-3 text-center">
          <p className="text-lead leading-tight">{caption.title}</p>
          {caption.purity && (
            <p className="figure-num mt-1 text-small text-signal">{caption.purity}</p>
          )}
          {caption.subtitle && <p className="eyebrow mt-2">{caption.subtitle}</p>}
          <p className="mt-2 text-small text-ink-soft">{caption.description}</p>
        </figcaption>
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
