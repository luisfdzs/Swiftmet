import type { DescribedImage } from '@/lib/content'

/**
 * FOTOGRAFÍAS PROVISIONALES DE ARCHIVO
 *
 * Swiftmet todavía no ha entregado fotos de la planta de Baghola, del hilo ni de las
 * bobinas (ver README, «Pendiente de confirmar con Swiftmet»). Hasta que lleguen, la web
 * enseña **fotografía genérica de archivo con licencia libre** —rollos de hilo trefilado,
 * carretes, una línea de trefilado—, descargada de Wikimedia Commons y recortada aquí a
 * la proporción exacta de cada hueco.
 *
 * **Son un sustituto, no el destino.** El diseño original prefería un hueco tramado que
 * dijera qué foto falta (ver `<Figure>`) precisamente para que nadie se olvidara de
 * pedirlas; con foto de archivo ese recordatorio desaparece de la pantalla, así que vive
 * aquí y en el README. Ninguna de estas imágenes es de Swiftmet, y ni los pies ni los
 * `alt` afirman que lo sean: describen lo que se ve —«rollos de varilla», «carrete de
 * hilo trefilado»— y nunca un grado, una pureza ni una planta concretos. Ese es el
 * límite de la regla 8 del CLAUDE.md: la foto ambienta, el dato lo pone el PDF.
 *
 * **Nada de esto toca al programa de bobinas.** Las catorce bobinas y sus cinco cotas
 * salen del PDF del cliente y se pintan a escala en `/spools`; ahí no entra fotografía de
 * archivo, porque una bobina de stock que no midiera lo que dice la tabla convertiría el
 * único dato fidedigno de la web en decoración.
 *
 * **En cuanto Swiftmet suba una foto al panel, esta desaparece sola**: el respaldo sólo
 * actúa cuando el producto no tiene imagen en Sanity (ver `getProducts` en
 * `lib/content.ts`). No hay que borrar nada de código para retirarlas, sólo los ficheros.
 *
 * Autoría y licencia de cada archivo, en `public/photos/CREDITS.md`. Todas son CC BY-SA:
 * exigen citar autor y licencia, y por eso ese fichero viaja con las imágenes.
 *
 * Las medidas (`width`/`height`) son las reales del fichero ya recortado, y el `blur` es
 * el propio fichero reducido a 16 px: es lo que `<Media>` necesita para no provocar
 * saltos de maquetación mientras carga.
 */
const stockPhotos = {
  'quality-drawing-line': {
    id: 'stock:quality-drawing-line',
    src: '/photos/quality-drawing-line.webp',
    width: 1960,
    height: 840,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAHABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDLW8gkVmFoFYuDkMflHcAU2TaJm8o4j7fTvRRWclqbU+p//9k=',
    alt: {
      en: 'Wire drawing line inside a wire mill',
      hi: 'तार मिल के अंदर वायर ड्रॉइंग लाइन',
      es: 'Línea de trefilado en el interior de una planta de hilo',
    },
  },
  'product-1080-metallising-wire': {
    id: 'stock:product-1080-metallising-wire',
    src: '/photos/product-1080-metallising-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDMa2Y3T7hnqRnuakgtGNwFByBycdq21RZXZXUEU/ykhDeWoHFVygf/2Q==',
    alt: {
      en: 'Coil of drawn wire seen through its bore',
      hi: 'बोर से देखा गया ट्रेफिल्ड तार का कुंडल',
      es: 'Bobina de hilo trefilado vista por su hueco central',
    },
  },
  'product-1090-metallising-wire': {
    id: 'stock:product-1090-metallising-wire',
    src: '/photos/product-1090-metallising-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBqzXpU5t39+lSf8TAgDy8DHXIp4uHKnp0p5nfaOe1UB//Z',
    alt: {
      en: 'Wire rod coils stacked and strapped for dispatch',
      hi: 'प्रेषण के लिए बंधे और खड़े किए गए वायर रॉड कुंडल',
      es: 'Rollos de varilla apilados y flejados para expedición',
    },
  },
  'product-1199-metallising-wire': {
    id: 'stock:product-1199-metallising-wire',
    src: '/photos/product-1199-metallising-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwAWXcBk44/WnSz8kZ61lCV9nXsKHlfJ57CqA//Z',
    alt: {
      en: 'Close-up of the wound strands of a wire coil',
      hi: 'तार कुंडल की लिपटी हुई लड़ियों का नज़दीकी दृश्य',
      es: 'Detalle de los hilos bobinados de un rollo',
    },
  },
  'product-aluminium-rod': {
    id: 'stock:product-aluminium-rod',
    src: '/photos/product-aluminium-rod.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCjbMF3bZVXcPlJPJpZHwPmmTKqC+OCa3ZtOt5HVypVhwCKjXSLbOMuc8k55P1qbIZ//9k=',
    alt: {
      en: 'Rod coils stored in the mill yard',
      hi: 'मिल यार्ड में रखे गए रॉड कुंडल',
      es: 'Rollos de varilla almacenados en el patio de la planta',
    },
  },
  'product-tea-bag-wire': {
    id: 'stock:product-tea-bag-wire',
    src: '/photos/product-tea-bag-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCtAJlvJI5UVYQOGx+p9qt+TkYcKCT8oBzkVp2+HQqwBUjBFRywxwZMaAEjGcVhOEnNNPQtNWP/2Q==',
    alt: {
      en: 'Fine metallic thread wound on plastic spools',
      hi: 'प्लास्टिक बॉबिन पर लिपटा महीन धात्विक धागा',
      es: 'Hilo metálico fino bobinado en carretes de plástico',
    },
  },
  'product-welding-wire': {
    id: 'stock:product-welding-wire',
    src: '/photos/product-welding-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBqXZbyovMZFJI6Dj/Oao6zZwK/7txI/wDEc02bhgw65qvNwpbuTzU2SWg22z//2Q==',
    alt: {
      en: 'Reel of drawn wire ready for dispatch',
      hi: 'प्रेषण के लिए तैयार ट्रेफिल्ड तार की रील',
      es: 'Carrete de hilo trefilado listo para expedición',
    },
  },
  'product-spring-steel-wire': {
    id: 'stock:product-spring-steel-wire',
    src: '/photos/product-spring-steel-wire.webp',
    width: 1280,
    height: 960,
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCsmoxi4E7ws+H2AqMlRjk+/b9asG+QTMyQmNGYDcRgsMdce1bEGmWqRKix4C9Dnmlm0y1kUb492OmT0+lIZ//Z',
    alt: {
      en: 'Coils of high carbon steel wire',
      hi: 'उच्च कार्बन स्टील तार के कुंडल',
      es: 'Rollos de hilo de acero de alto carbono',
    },
  },
} satisfies Record<string, DescribedImage>

/** Apertura de `/quality`: la línea de trefilado, que es de lo que habla esa página. */
export const stockQualityPhoto: DescribedImage = stockPhotos['quality-drawing-line']

/**
 * Portada de archivo de un producto, por slug. Devuelve `null` para un producto nuevo
 * que todavía no tenga foto asignada aquí: en ese caso vuelve a salir el hueco tramado,
 * que es la respuesta correcta —mejor un hueco que decir con una foto ajena que existe
 * algo que no hemos visto.
 */
export function stockPhotoForProduct(slug: string): DescribedImage | null {
  return stockPhotos[`product-${slug}` as keyof typeof stockPhotos] ?? null
}
