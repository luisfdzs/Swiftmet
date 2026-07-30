import { defineField, defineType } from 'sanity'

/**
 * IMAGEN DE PRODUCTO O DE PLANTA
 *
 * Se sube arrastrando el archivo, del tamaño que sea: Sanity guarda el original y su
 * CDN entrega a la web la versión ligera que hace falta en cada pantalla (formato,
 * ancho y recorte).
 *
 * Hoy **no hay ninguna imagen**: la web se ha construido sin fotografía de planta ni de
 * producto, y los huecos se ven como huecos (ver `components/ui/Figure.tsx`). Este
 * esquema existe para que el día que Swiftmet mande fotos no haya que tocar código:
 * se suben aquí y los placeholders desaparecen solos.
 *
 * El texto alternativo es obligatorio: es lo que oyen las personas que navegan con
 * lector de pantalla y lo que lee Google. Sin él, una foto es un hueco vacío.
 */
export const productImage = defineType({
  name: 'productImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: 'File',
      type: 'image',
      options: {
        hotspot: true, // permite elegir el punto que nunca se recorta
      },
      validation: (rule) => rule.required(),
      description:
        'Drag the image in. Any file size: it is optimised automatically. ' +
        'The hotspot marks the part that must never be cropped away.',
    }),
    defineField({
      name: 'alt',
      title: 'Description for accessibility',
      type: 'localizedString',
      validation: (rule) => rule.required(),
      description:
        'Describe what is visible, without repeating the product name. ' +
        'Example: «Wire drawing machine with in-process diameter gauge».',
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt.en' },
    prepare: ({ media, title }) => ({ media, title: title || 'No description' }),
  },
})
