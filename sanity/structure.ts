import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

/**
 * MENÚ DEL PANEL
 *
 * Se define a mano en vez de dejar el listado automático de Sanity por dos razones:
 *
 * 1. **Ordenar arrastrando.** `orderableDocumentListDeskItem` da un listado donde el
 *    orden de la web se cambia arrastrando las fichas, sin números de por medio. Importa
 *    especialmente en las bobinas: la tabla se lee de la más pequeña a la más grande, y
 *    ese criterio se mantiene arrastrando la nueva a su sitio.
 * 2. **Ajustes como documento único.** «Company & contact» se abre directamente en su
 *    formulario, sin un listado con un solo elemento ni la opción de crear un segundo.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'product',
        title: 'Products',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'spool',
        title: 'Plastic spools',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('Company & contact')
        .id('companyInfo')
        .child(S.document().schemaType('companyInfo').documentId('companyInfo')),
    ])
