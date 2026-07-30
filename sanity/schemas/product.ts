import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

/**
 * PRODUCTO
 *
 * Un producto es una referencia de catálogo: «1080 Metallising Wire», «Aluminium Rod».
 * Es el tipo de documento central del sitio.
 *
 * Decisiones pensadas para quien edita:
 *
 * - La **familia** es una lista cerrada: la web tiene una traducción preparada para cada
 *   valor en los tres idiomas, así que no se pueden inventar familias nuevas sin tocar
 *   `lib/i18n/dictionaries.ts` (y el typecheck avisa).
 * - Las **especificaciones son cadenas ya formateadas**, no números. Es deliberado:
 *   «1.50 mm and above», «16–18 kg/mm²» y «≥ 99.80 %» no son cifras, son rangos con
 *   unidad y con matiz. Modelarlos como números obligaría a inventar un campo por cada
 *   forma de expresarlos (mínimo, máximo, unidad, ¿abierto por arriba?) y quien edita
 *   tendría que rellenar cinco casillas para escribir lo que ya sabe decir en una. Las
 *   que sí son números de verdad —las de las bobinas— están en el tipo `spool`, porque
 *   allí se usan para dibujar.
 * - El orden en la web se cambia **arrastrando** en el listado (Products › Order), no
 *   escribiendo números.
 * - Las **imágenes son opcionales**: hoy no hay ninguna y la web funciona igual. Ver
 *   `productImage`.
 */
export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'card', title: 'Identity', default: true },
    { name: 'specs', title: 'Specifications' },
    { name: 'texts', title: 'Texts' },
    { name: 'images', title: 'Images' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Product name',
      type: 'string',
      group: 'card',
      validation: (rule) => rule.required(),
      description: 'Not translated: it is the commercial designation. Example: «1199 Wire».',
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'card',
      options: { source: 'name', maxLength: 60 },
      validation: (rule) => rule.required(),
      description:
        'Generated from the name with «Generate». It appears in the URL ' +
        '(swiftmet.in/en/products/…). Changing it breaks existing links.',
    }),
    defineField({
      name: 'family',
      title: 'Family',
      type: 'string',
      group: 'card',
      options: {
        list: [
          { title: 'Metallising wire', value: 'metallising-wire' },
          { title: 'Aluminium rod', value: 'aluminium-rod' },
          { title: 'Tea bag wire', value: 'tea-bag-wire' },
          { title: 'Welding wire', value: 'welding-wire' },
          { title: 'Spring steel wire', value: 'spring-steel-wire' },
        ],
        layout: 'radio',
      },
      initialValue: 'metallising-wire',
      validation: (rule) => rule.required(),
      description: 'Groups the product in the index. Closed list: the web translates each value.',
    }),
    defineField({
      name: 'featured',
      title: 'Show on the homepage',
      type: 'boolean',
      group: 'card',
      initialValue: false,
      description:
        'The homepage shows the first four flagged products, in list order. ' +
        'If none are flagged it falls back to the first four of the list.',
    }),

    defineField({
      name: 'grade',
      title: 'Grade',
      type: 'string',
      group: 'specs',
      description: 'Optional. Example: «EN AW-1080A» or «1080».',
    }),
    defineField({
      name: 'purity',
      title: 'Aluminium purity',
      type: 'string',
      group: 'specs',
      description: 'Optional, already formatted. Example: «99.80 % min».',
    }),
    defineField({
      name: 'diameter',
      title: 'Diameter',
      type: 'string',
      group: 'specs',
      description: 'Optional, already formatted. Example: «1.50 mm and above».',
    }),
    defineField({
      name: 'tensile',
      title: 'Tensile strength',
      type: 'string',
      group: 'specs',
      description: 'Optional, already formatted. Example: «16–18 kg/mm²».',
    }),
    defineField({
      name: 'elongation',
      title: 'Elongation',
      type: 'string',
      group: 'specs',
      description: 'Optional, already formatted. Example: «above 1 %».',
    }),
    defineField({
      name: 'spoolWound',
      title: 'Supplied on the plastic spool programme',
      type: 'boolean',
      group: 'specs',
      initialValue: true,
      description:
        'If ticked, the product page links to the Spools page with every dimension. ' +
        'Untick it for rod or for anything shipped in coils.',
    }),
    defineField({
      name: 'packing',
      title: 'Packing',
      type: 'localizedString',
      group: 'specs',
      description:
        'Optional, one line. Example: «Jointless spools packed in corrugated boxes, ' +
        'shipped by road or sea».',
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'localizedString',
      group: 'texts',
      validation: (rule) => rule.required(),
      description: 'One sentence. Shown in the product index next to the name.',
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'localizedParagraphs',
      group: 'texts',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'applications',
      title: 'Applications',
      type: 'array',
      of: [{ type: 'localizedString' }],
      group: 'texts',
      description:
        'One entry per application. Example: «BOPP and polyester film metallising». ' +
        'These are what a buyer scans for, so keep them short and concrete.',
    }),

    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'productImage' }],
      group: 'images',
      description:
        'Optional. The FIRST image is the one used in the index. While there are none, ' +
        'the web shows a marked placeholder instead — it will not break.',
    }),

    // Campo oculto que sostiene el orden por arrastre del listado.
    orderRankField({ type: 'product' }),
  ],
  preview: {
    select: { title: 'name', family: 'family', purity: 'purity', media: 'images.0.asset' },
    prepare: ({ title, family, purity, media }) => ({
      title,
      subtitle: [family, purity].filter(Boolean).join(' · '),
      media,
    }),
  },
})
