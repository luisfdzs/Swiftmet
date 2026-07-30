import { defineField, defineType } from 'sanity'

/**
 * COMPANY & CONTACT (documento único)
 *
 * Todo lo que no es un producto ni una bobina: la presentación de la empresa, los
 * puntos de control de calidad, las certificaciones, las plantas y los contactos. Es un
 * documento único (singleton): no se puede crear un segundo, para que no haya dudas de
 * cuál manda.
 *
 * Nota sobre los datos de contacto: los que están sembrados en la migración salen de
 * fuentes públicas (registro y directorios B2B) y **varios están pendientes de
 * confirmar** — el email en particular es un marcador con dominio `.example`, elegido
 * a propósito para que sea imposible publicarlo por descuido creyendo que es real.
 * Ver README, «Pendiente de confirmar con Swiftmet».
 */
export const companyInfo = defineType({
  name: 'companyInfo',
  title: 'Company & contact',
  type: 'document',
  groups: [
    { name: 'texts', title: 'Texts', default: true },
    { name: 'quality', title: 'Quality' },
    { name: 'places', title: 'Places' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    defineField({
      name: 'statement',
      title: 'About the company',
      type: 'localizedParagraphs',
      group: 'texts',
      validation: (rule) => rule.required(),
      description:
        'The paragraphs that describe Swiftmet. The FIRST one is also used large on the ' +
        'homepage; the rest follow underneath.',
    }),
    defineField({
      name: 'capacity',
      title: 'Installed capacity',
      type: 'string',
      group: 'texts',
      description:
        'Optional, already formatted. Example: «3,500 MT per annum». Leave empty and the ' +
        'web simply does not show the figure — better an absent number than a wrong one.',
    }),
    defineField({
      name: 'incorporated',
      title: 'Incorporated',
      type: 'string',
      group: 'texts',
      description: 'Optional. Example: «2010».',
    }),

    defineField({
      name: 'qualitySteps',
      title: 'Quality checkpoints',
      type: 'array',
      group: 'quality',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Checkpoint',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'What is measured',
              type: 'localizedText',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'title.en', subtitle: 'body.en' } },
        },
      ],
      validation: (rule) => rule.required().min(1),
      description:
        'In production order: raw material, drawing, degreasing, spooling, batch testing, ' +
        'packing. Drag to reorder — the web shows them numbered in this order.',
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'quality',
      description:
        'One per line, exactly as on the certificate. Leave empty if there are none to ' +
        'publish: claiming a standard you do not hold is the fastest way to lose a customer.',
    }),

    defineField({
      name: 'plants',
      title: 'Offices and works',
      type: 'array',
      group: 'places',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'kind',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Registered office', value: 'office' },
                  { title: 'Works', value: 'works' },
                ],
                layout: 'radio',
              },
              initialValue: 'works',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'address',
              title: 'Address',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Street and area, without city or country.',
            }),
            defineField({
              name: 'city',
              title: 'City / district',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'region',
              title: 'State',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'postalCode',
              title: 'PIN code',
              type: 'string',
            }),
            defineField({
              name: 'country',
              title: 'Country',
              type: 'string',
              initialValue: 'India',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'city', subtitle: 'address' } },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
      description: 'Appears in the footer and in Contact, on every page.',
    }),
    defineField({
      name: 'phone',
      title: 'Main phone',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required(),
      description: 'With country code. Example: «+91 98765 43210».',
    }),
    defineField({
      name: 'people',
      title: 'Who to ask for',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'phone', title: 'Phone', type: 'string' }),
            defineField({ name: 'email', title: 'Email', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role.en' } },
        },
      ],
      description: 'List order is the order on the web. Drag to change it.',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      group: 'contact',
    }),
  ],
  preview: { prepare: () => ({ title: 'Company & contact' }) },
})
