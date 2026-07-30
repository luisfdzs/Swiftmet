import type { SchemaTypeDefinition } from 'sanity'
import { companyInfo } from './companyInfo'
import { localizedParagraphs, localizedString, localizedText } from './localized'
import { product } from './product'
import { productImage } from './productImage'
import { spool } from './spool'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documentos
  product,
  spool,
  companyInfo,
  // Piezas reutilizables
  productImage,
  localizedString,
  localizedText,
  localizedParagraphs,
]
