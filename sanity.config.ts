'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

/**
 * PANEL DE ADMINISTRACIÓN — se sirve dentro de la propia web, en /admin.
 *
 * Quien edita entra con su cuenta (invitada por email desde sanity.io/manage): no hay
 * contraseñas compartidas y se puede quitar el acceso a una persona sin afectar al resto.
 * Cada cambio queda con autor y fecha, y hay historial para deshacer.
 *
 * El panel está **en inglés**, no traducido a los tres idiomas del sitio público: lo usa
 * el equipo de Swiftmet, no los visitantes, y el inglés es el idioma de trabajo de la
 * empresa. Traducir la interfaz de administración a tres idiomas sería mantenimiento
 * permanente para que nadie lo agradezca.
 */
export default defineConfig({
  name: 'swiftmet',
  title: 'Swiftmet',
  basePath: '/admin',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision permite lanzar consultas GROQ a mano: útil para desarrollo, invisible para
    // quien sólo edita contenido.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // «Company & contact» es único: no se ofrece crear otro.
    newDocumentOptions: (prev) => prev.filter((template) => template.templateId !== 'companyInfo'),
  },
})
