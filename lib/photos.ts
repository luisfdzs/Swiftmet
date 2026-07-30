import type { DescribedImage } from '@/lib/content'

/**
 * FOTOGRAFÍAS PROVISIONALES DE ARCHIVO
 *
 * Swiftmet todavía no ha entregado fotos de la planta de Baghola, del hilo ni de las
 * bobinas (ver README, «Pendiente de confirmar con Swiftmet»). Hasta que lleguen, la web
 * enseña **fotografía industrial de archivo de Pexels**, recortada aquí a la proporción
 * exacta de cada hueco. Los ficheros están en `public/photos` y la procedencia de cada uno,
 * en `public/photos/CREDITS.md`.
 *
 * **Licencia Pexels:** uso comercial permitido, se puede modificar (aquí se recorta y se
 * convierte a WebP) y **no exige atribución**. El fichero de créditos existe igualmente,
 * porque saber de dónde salió cada imagen es lo que permite retirarla o sustituirla sin
 * arqueología.
 *
 * **El criterio de selección no fue estético, fue de veracidad.** Un primer intento con
 * material de Wikimedia se descartó porque eran rollos de hilo de ACERO OXIDADO: sobre una
 * ficha que dice «99,99 % de aluminio», el óxido no ambienta, desmiente —el aluminio no se
 * oxida así—. La regla que quedó, y que hay que respetar al tocar esto:
 *
 *   1. **Nada de óxido.** Descalifica la foto, por buena que sea.
 *   2. **Ninguna marca ni etiqueta legible de otro fabricante.** Ya pasó dos veces: un
 *      carrete de Prysmian y un cartel de Reynolds Aluminum en el montaje de portada.
 *   3. **Los `alt` describen lo que se ve** —«rollos de varilla», «carretes de hilo fino»— y
 *      nunca un grado, una pureza ni una planta concretos.
 *
 * **Nada de esto toca al programa de bobinas.** Las catorce bobinas y sus cinco cotas salen
 * del PDF del cliente y se dibujan a escala en `/spools`; ahí no entra fotografía de
 * archivo, porque una bobina de stock que no midiera lo que dice la tabla convertiría el
 * único dato firme de la web en decoración.
 *
 * **En cuanto Swiftmet suba una foto al panel, esta desaparece sola**: el respaldo sólo
 * actúa cuando el producto no tiene imagen en Sanity (ver `getProducts` en
 * `lib/content.ts`). No hay que borrar código para retirarlas, sólo los ficheros.
 *
 * Las medidas (`width`/`height`) son las reales del fichero ya recortado, y el `blur` es el
 * propio fichero reducido a 16 px: es lo que `<Media>` necesita para no provocar saltos de
 * maquetación mientras carga.
 *
 * El hindi de los `alt` es un borrador, como el resto del hindi del proyecto: pendiente de
 * revisión por un hablante nativo (ver README).
 */
const stockPhotos = {
  'quality-drawing-line': {
    id: 'stock:quality-drawing-line',
    src: '/photos/quality-drawing-line.webp',
    width: 2048,
    height: 878,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAHABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDObUYAiBV/ebQSdvUd6mhW3vrW5mj3xMoOzHf6/nRRU2E3of/Z',
    alt: {
      en: 'Coils of drawn wire on reels inside a wire mill',
      hi: 'तार मिल के अंदर रीलों पर लिपटे तार के कुंडल',
      es: 'Bobinas de hilo trefilado en carretes, en el interior de una planta de hilo',
    },
  },
  'product-1080-metallising-wire': {
    id: 'stock:product-1080-metallising-wire',
    src: '/photos/product-1080-metallising-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDLWORsB/sU2ec52n8xip0jkKhRGwU9kuFZfyarD6RZKOIj8vH325/WoJLa2i4W3Q8gZYk/1rQk/9k=',
    alt: {
      en: 'Rows of drawn wire coils stacked in a mill yard',
      hi: 'मिल यार्ड में पंक्तियों में रखे तार के कुंडल',
      es: 'Filas de rollos de hilo trefilado apilados en el patio de una planta',
    },
  },
  'product-1090-metallising-wire': {
    id: 'stock:product-1090-metallising-wire',
    src: '/photos/product-1090-metallising-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwClC/7pcHuefeh3xatg8k4H8qrW7Hy4x7f0o3k26/7/APjVCP/Z',
    alt: {
      en: 'Close-up of the wound strands of a wire coil',
      hi: 'तार कुंडल की लिपटी लड़ियों का नज़दीकी दृश्य',
      es: 'Detalle de las hebras bobinadas de un rollo de hilo',
    },
  },
  'product-1199-metallising-wire': {
    id: 'stock:product-1199-metallising-wire',
    src: '/photos/product-1199-metallising-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCpIGkEpCFlODlcelVJYS5JZuFXA8wcVcum86wmlYBTwAFGAOOtY0V5OFKs+9Qejjd/OgD/2Q==',
    alt: {
      en: 'Coiled fine wire on a workshop rack',
      hi: 'कार्यशाला के रैक पर लिपटा महीन तार',
      es: 'Hilo fino enrollado en una estantería de taller',
    },
  },
  'product-aluminium-rod': {
    id: 'stock:product-aluminium-rod',
    src: '/photos/product-aluminium-rod.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBq6wJJpl27IePKkHU44P502bU5UuFjzlQpZ2I6D8KpW97NHZSYbLEcMxJI7cVLqFzIkcgjYoFCKME9ycnnvxWm+5Ox/9k=',
    alt: {
      en: 'Wire rod coils stacked in a mill yard under a gantry crane',
      hi: 'गैंट्री क्रेन के नीचे मिल यार्ड में रखे वायर रॉड के कुंडल',
      es: 'Rollos de varilla apilados en el patio de una planta, bajo un pórtico',
    },
  },
  'product-tea-bag-wire': {
    id: 'stock:product-tea-bag-wire',
    src: '/photos/product-tea-bag-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCL+y43JEKDAUsSxJ/AVJ9it/Mx9mL4GWJfGOcdxUdo73WpXUUjsEijJUKcc+tQXF7cidljmaILkfL3/PNLUZ//2Q==',
    alt: {
      en: 'Spools of fine drawn wire',
      hi: 'महीन ट्रेफिल्ड तार के स्पूल',
      es: 'Carretes de hilo fino trefilado',
    },
  },
  'product-stainless-steel-mig-welding-wire': {
    id: 'stock:product-stainless-steel-mig-welding-wire',
    src: '/photos/product-stainless-steel-mig-welding-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDIispbe4iaBLhmChm+ULg+n0q+rvLLIJ7QoV+6TCXz+uKvaLuutMWWaR2cnGc46YFRX0ksWo2lsk0gjlyWOeeK0RJ//9k=',
    alt: {
      en: 'Wire coils in a mill yard, with an operator checking a bundle',
      hi: 'मिल यार्ड में तार के कुंडल, बंडल की जाँच करता एक कर्मचारी',
      es: 'Rollos de hilo en el patio de una planta, con un operario revisando un atado',
    },
  },
  'product-high-carbon-spring-steel-wire': {
    id: 'stock:product-high-carbon-spring-steel-wire',
    src: '/photos/product-high-carbon-spring-steel-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCpDq851FpSpNrJmNc/dGO4/wA9KsuY3y8aJgHGUBIz+RqGyEUokzbQjyj8uE+lI7xoxVbaAAru4XvmtST/2Q==',
    alt: {
      en: 'Stacked wire coils beside a mill gantry',
      hi: 'मिल गैंट्री के पास रखे तार के कुंडल',
      es: 'Rollos de hilo apilados junto al pórtico de una planta',
    },
  },
} satisfies Record<string, DescribedImage>

/** Apertura de `/quality`: hilo bobinado en carretes dentro de una nave. */
export const stockQualityPhoto: DescribedImage = stockPhotos['quality-drawing-line']

/**
 * Portada de archivo de un producto, por slug. Devuelve `null` para un producto nuevo que
 * todavía no tenga foto asignada aquí: en ese caso vuelve a salir el hueco tramado, que es
 * la respuesta correcta —mejor un hueco que decir con una foto ajena que existe algo que no
 * hemos visto—.
 */
export function stockPhotoForProduct(slug: string): DescribedImage | null {
  return stockPhotos[`product-${slug}` as keyof typeof stockPhotos] ?? null
}

/**
 * Claves `product-*` de aquí que no corresponden a ningún producto del panel.
 *
 * Existe por un fallo real: dos fotos se declararon como `product-welding-wire` y
 * `product-spring-steel-wire`, pero los slugs de verdad son
 * `stainless-steel-mig-welding-wire` y `high-carbon-spring-steel-wire`. El resultado fue
 * **silencioso** —esas dos fichas se quedaron con el hueco tramado, la web compilaba, el
 * typecheck pasaba y `check:mobile` daba 33/33—; se descubrió mirando la pantalla. Una clave
 * que no encaja no rompe nada, y eso es justo lo que la hace peligrosa.
 *
 * `getProducts` lo avisa por consola en cada build, igual que hace con los documentos
 * incompletos: es donde alguien lo va a leer.
 */
export function unusedStockProductKeys(slugs: readonly string[]): string[] {
  const known = new Set(slugs.map((slug) => `product-${slug}`))
  return Object.keys(stockPhotos).filter((key) => key.startsWith('product-') && !known.has(key))
}
