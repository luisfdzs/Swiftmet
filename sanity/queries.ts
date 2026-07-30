import { defineQuery } from 'next-sanity'

/**
 * CONSULTAS (GROQ)
 *
 * Todas piden ya resuelto lo que la web necesita para pintar sin pensar: en las
 * imágenes, la URL del original, las dimensiones reales y `lqip` (la miniatura
 * difuminada que Sanity calcula al subir el archivo). Con eso se consigue cero salto de
 * layout y un placeholder suave para fotos que sube cualquiera desde el navegador.
 */

const IMAGE = /* groq */ `{
  "id": asset.asset->_id,
  "src": asset.asset->url,
  "width": asset.asset->metadata.dimensions.width,
  "height": asset.asset->metadata.dimensions.height,
  "blur": asset.asset->metadata.lqip,
  alt
}`

const PRODUCT_FIELDS = /* groq */ `
  "slug": slug.current,
  name,
  family,
  featured,
  grade,
  purity,
  diameter,
  tensile,
  elongation,
  spoolWound,
  packing,
  summary,
  body,
  applications,
  "images": images[] ${IMAGE}
`

/** El orden es el que se fija arrastrando en el panel (orderRank). */
export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && defined(slug.current)] | order(orderRank) {
    ${PRODUCT_FIELDS}
  }
`)

export const PRODUCT_SLUGS_QUERY = defineQuery(`
  *[_type == "product" && defined(slug.current)] | order(orderRank) { "slug": slug.current }
`)

/**
 * Bobinas. El orden es el del panel, no el peso: es intencionado, porque el listado
 * maestro agrupa las variantes de un mismo diámetro (SW320, SW320-1, SW320-2) y romper
 * ese agrupamiento para ordenar estrictamente por kilos separaría bobinas que un
 * comprador compara entre sí.
 */
export const SPOOLS_QUERY = defineQuery(`
  *[_type == "spool"] | order(orderRank) {
    code,
    netWeight,
    flangeDiameter,
    coreDiameter,
    boreHole,
    spoolWidth,
    windingWidth,
    note
  }
`)

export const COMPANY_QUERY = defineQuery(`
  *[_type == "companyInfo"][0] {
    statement,
    capacity,
    incorporated,
    "qualitySteps": qualitySteps[] { title, body },
    certifications,
    "plants": plants[] { kind, address, city, region, postalCode, country },
    email,
    phone,
    "people": people[] { name, role, phone, email },
    linkedin
  }
`)
