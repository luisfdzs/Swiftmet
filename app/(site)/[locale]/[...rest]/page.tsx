import { notFound } from 'next/navigation'

/**
 * CUALQUIER RUTA QUE NO EXISTA DENTRO DE UN IDIOMA.
 *
 * Sin esto, `/en/nope` no casa con ningún segmento y Next se cae al `not-found` de la
 * raíz de `app/`. Como aquí no hay layout raíz —cada grupo de rutas, `(site)` y
 * `(studio)`, trae el suyo—, lo que se sirve entonces es el 404 negro por defecto de
 * Next: sin marca, sin menú, sin pie y siempre en inglés. El 404 propio sólo salía en
 * `/en/products/<slug-que-no-existe>`, porque ahí sí hay una página que llama a
 * `notFound()`.
 *
 * Este comodín cierra el hueco: captura lo que no haya casado antes —los segmentos
 * fijos y los dinámicos tienen prioridad sobre él, así que no le quita nada a
 * `/products/[slug]`— y llama a `notFound()`, con lo que se pinta
 * `[locale]/not-found.tsx` **dentro del layout del idioma**: cabecera, pie, barra de
 * iconos y la vuelta al inicio.
 *
 * El precio es que esta ruta no se puede prerrenderizar (los caminos posibles son
 * infinitos), así que es la única del sitio que se resuelve en servidor. Sólo se ejecuta
 * cuando alguien llega a un enlace roto, y devuelve 404 igual que antes.
 */
export default function CatchAllNotFound() {
  notFound()
}
