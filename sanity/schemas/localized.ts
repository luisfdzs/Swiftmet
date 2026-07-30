import { defineField, defineType } from 'sanity'

/**
 * BLOQUES TRILINGÜES
 *
 * En lugar de un sistema de traducción con documentos paralelos, cada campo de texto es
 * un objeto con "English", "हिन्दी" y "Español" al lado. Para tres idiomas sigue siendo
 * lo más claro para quien edita: se ve de un golpe qué falta traducir, sin cambiar de
 * documento ni de pestaña.
 *
 * **Sólo el inglés es obligatorio.** Es una diferencia deliberada respecto al proyecto
 * de referencia, donde los dos idiomas lo eran. Aquí el inglés es el idioma comercial
 * del sector y el que sostiene la web; exigir hindi y español para poder publicar un
 * producto nuevo significaría que Swiftmet no puede publicar nada hasta tener las tres
 * traducciones — y en la práctica eso acaba en traducciones hechas con prisa o en
 * productos sin publicar. `lib/content.ts` rellena los huecos con el inglés.
 */

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Text',
  type: 'object',
  options: { columns: 3 },
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'hi', title: 'हिन्दी (Hindi)', type: 'string' }),
    defineField({ name: 'es', title: 'Español', type: 'string' }),
  ],
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Long text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({ name: 'hi', title: 'हिन्दी (Hindi)', type: 'text', rows: 3 }),
    defineField({ name: 'es', title: 'Español', type: 'text', rows: 3 }),
  ],
})

/**
 * Texto de varios párrafos. Se guarda como lista de párrafos (no como texto rico)
 * porque el diseño de la web sólo admite párrafos: así nadie puede meter un titular
 * gigante, una tabla improvisada o un color que rompa la estética del catálogo.
 */
export const localizedParagraphs = defineType({
  name: 'localizedParagraphs',
  title: 'Paragraphs',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (r) => r.required().min(1),
      description: 'One entry per paragraph. Shown in this order.',
    }),
    defineField({
      name: 'hi',
      title: 'हिन्दी (Hindi)',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      description: 'One entry per paragraph, same order as English. Optional.',
    }),
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      description: 'One entry per paragraph, same order as English. Optional.',
    }),
  ],
})
