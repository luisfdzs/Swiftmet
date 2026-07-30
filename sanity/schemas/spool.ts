import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

/**
 * BOBINA DE PLÁSTICO
 *
 * Es el activo diferencial del catálogo. La competencia directa (electrolead.co.in)
 * resuelve el embalaje con una frase — «6.5 to 11 kg as per customer's request» — y
 * Swiftmet tiene catorce formatos medidos, de 2,75 kg a 14,5 kg, con las cinco cotas
 * que un comprador necesita para saber si la bobina entra en su metalizadora. Publicar
 * esa tabla es la ventaja competitiva más barata que tiene esta web.
 *
 * **Aquí las medidas SÍ son números**, al contrario que en `product`, donde las
 * especificaciones son cadenas ya formateadas. La razón es concreta: con estos valores
 * se DIBUJA. `components/sections/SpoolDiagram.tsx` calcula la sección a escala real
 * desde `flangeDiameter`, `coreDiameter`, `boreHole` y `spoolWidth`. Una cadena
 * («265 mm») no se puede escalar, y guardar el número dos veces —uno para leer y otro
 * para dibujar— es garantizar que algún día no coincidan.
 *
 * Los rangos vienen del listado maestro «Swiftmet Plastic Spool List, as on
 * 31-03-2022», que es la fuente de `scripts/migration/content-snapshot.json`.
 */
export const spool = defineType({
  name: 'spool',
  title: 'Plastic spool',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Spool type',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'As in the spool list. Example: «SW320-1», «SW360-3 (HW)».',
    }),
    defineField({
      name: 'netWeight',
      title: 'Wire net weight (kg)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      description: 'Kilograms of wire the spool holds. Example: 9.5.',
    }),
    defineField({
      name: 'flangeDiameter',
      title: 'D1 · Flange diameter (mm)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      description: 'Outer diameter of the spool. Used to draw the section to scale.',
    }),
    defineField({
      name: 'coreDiameter',
      title: 'D2 · Core diameter (mm)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      // Un núcleo mayor que la pestaña no es un dato raro: es imposible, y dejaría el
      // dibujo del revés. Se valida contra el otro campo en vez de confiar en la vista.
      description: 'Barrel the wire is wound on. Must be smaller than the flange diameter.',
    }),
    defineField({
      name: 'boreHole',
      title: 'D3 · Bore hole (mm)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      description: 'Centre hole that fits the metalliser spindle. Example: 38.5 or 51.5.',
    }),
    defineField({
      name: 'spoolWidth',
      title: 'L1 · Width of spool (mm)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'windingWidth',
      title: 'L2 · Winding width (mm)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      description: 'Must be smaller than the overall width: the flanges take the difference.',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'localizedString',
      description:
        'Optional, one short line. Use it for what the code alone does not say — ' +
        'for example that «(HW)» is the heavy-wound version.',
    }),

    // Campo oculto que sostiene el orden por arrastre del listado.
    orderRankField({ type: 'spool' }),
  ],
  preview: {
    select: {
      title: 'code',
      netWeight: 'netWeight',
      flange: 'flangeDiameter',
      bore: 'boreHole',
    },
    prepare: ({ title, netWeight, flange, bore }) => ({
      title,
      subtitle: `${netWeight ?? '?'} kg · Ø${flange ?? '?'} · bore ${bore ?? '?'}`,
    }),
  },
})
