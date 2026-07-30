#!/usr/bin/env node
/**
 * PREPARA LA MIGRACIÓN AL PANEL · `npm run migrate:build`
 *
 * Convierte `scripts/migration/content-snapshot.json` en un fichero NDJSON que el CLI de
 * Sanity importa de un tirón: los catorce tipos de bobina del listado maestro, las
 * referencias de catálogo y la ficha de empresa, en los tres idiomas que estén escritos.
 *
 * **Por qué NDJSON y no la API con un token:** el CLI usa la sesión de quien ha hecho
 * `sanity login`, así que no hay que crear, pegar ni guardar ninguna credencial en ningún
 * sitio. Menos secretos dando vueltas, menos que se pueda filtrar.
 *
 * Es idempotente: los `_id` son deterministas (`spool-sw320-1`, `product-1080-…`), así que
 * repetir la importación con `--replace` actualiza en lugar de duplicar.
 *
 * Después de generarlo:
 *   npm run migrate:import      (requiere `npx sanity login` una vez)
 */

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { LexoRank } from 'lexorank'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SNAPSHOT = path.join(ROOT, 'scripts', 'migration', 'content-snapshot.json')
const OUTPUT = path.join(ROOT, 'scripts', 'migration', 'import.ndjson')

const snapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf8'))

/**
 * Orden para el plugin de arrastre. **No vale cualquier cadena**: usa LexoRank
 * (`0|hzzzzz:`), un formato que permite insertar algo entre dos elementos sin renumerar el
 * resto. El proyecto de referencia escribió primero `a000`, `a001`… y el plugin, al no
 * reconocer el bucket, lanzaba una excepción que dejaba **los listados del panel sin
 * cargar nunca** (spinner infinito y «There was an error»). Cuesta un rato averiguarlo,
 * así que aquí se hace bien desde el principio.
 *
 * Cada tipo de documento lleva su propia secuencia: los rangos de `product` y de `spool`
 * son independientes.
 */
function ranker() {
  let next = LexoRank.middle()
  return () => {
    const current = next.toString()
    next = next.genNext()
    return current
  }
}

/**
 * Un bloque de texto traducido. Los idiomas vacíos **no se escriben**: dejar
 * `"hi": null` en el documento haría que el panel mostrara el campo como rellenado con
 * nada, y `lib/content.ts` distingue entre «sin traducir» (cae al inglés) y «traducido a
 * cadena vacía» (que sería un hueco de verdad en la web).
 */
function localized(value, type = 'localizedString') {
  if (!value) return undefined
  const block = { _type: type }
  for (const locale of ['en', 'hi', 'es']) {
    const text = value[locale]
    if (text === null || text === undefined) continue
    if (Array.isArray(text) ? text.length > 0 : String(text).trim() !== '') {
      block[locale] = text
    }
  }
  // Sin inglés no hay bloque: es el único idioma obligatorio en todo el esquema, así que
  // un objeto que sólo trajera hindi sería un documento que el panel rechaza al guardar.
  return block.en ? block : undefined
}

/** Quita las claves `undefined`, que en NDJSON se serializarían como ausentes o como null. */
function compact(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined))
}

const documents = []
const warnings = []

// --- Bobinas ---------------------------------------------------------------------------
const spoolRank = ranker()
for (const spool of snapshot.spools) {
  // Las mismas comprobaciones que hace zod al leer (ver lib/content.ts). Se repiten aquí
  // porque es mucho mejor enterarse ANTES de importar que ver la bobina desaparecer de la
  // tabla después: el aviso en consola del build es fácil de pasar por alto.
  if (spool.coreDiameter >= spool.flangeDiameter) {
    warnings.push(
      `${spool.code}: D2 (${spool.coreDiameter}) no es menor que D1 (${spool.flangeDiameter})`,
    )
  }
  if (spool.boreHole >= spool.coreDiameter) {
    warnings.push(
      `${spool.code}: D3 (${spool.boreHole}) no es menor que D2 (${spool.coreDiameter})`,
    )
  }
  if (spool.windingWidth > spool.spoolWidth) {
    warnings.push(`${spool.code}: L2 (${spool.windingWidth}) supera L1 (${spool.spoolWidth})`)
  }

  documents.push(
    compact({
      // El código lleva paréntesis y espacios («SW360-3 (HW)»), que no valen en un _id.
      _id: `spool-${spool.code
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`,
      _type: 'spool',
      code: spool.code,
      netWeight: spool.netWeight,
      flangeDiameter: spool.flangeDiameter,
      coreDiameter: spool.coreDiameter,
      boreHole: spool.boreHole,
      spoolWidth: spool.spoolWidth,
      windingWidth: spool.windingWidth,
      note: localized(spool.note),
      orderRank: spoolRank(),
    }),
  )
}

// --- Productos -------------------------------------------------------------------------
const productRank = ranker()
for (const product of snapshot.products) {
  documents.push(
    compact({
      _id: `product-${product.slug}`,
      _type: 'product',
      name: product.name,
      slug: { _type: 'slug', current: product.slug },
      family: product.family,
      featured: Boolean(product.featured),
      grade: product.grade ?? undefined,
      purity: product.purity ?? undefined,
      diameter: product.diameter ?? undefined,
      tensile: product.tensile ?? undefined,
      elongation: product.elongation ?? undefined,
      spoolWound: Boolean(product.spoolWound),
      packing: localized(product.packing),
      summary: localized(product.summary),
      body: localized(product.body, 'localizedParagraphs'),
      applications: (product.applications ?? []).map((application, index) => ({
        _key: `app-${index}`,
        ...localized(application),
      })),
      // Sin imágenes: la web pinta huecos marcados hasta que Swiftmet suba fotos al panel.
      orderRank: productRank(),
    }),
  )
}

// --- Ficha de empresa ------------------------------------------------------------------
const company = snapshot.company
documents.push(
  compact({
    _id: 'companyInfo',
    _type: 'companyInfo',
    statement: localized(company.statement, 'localizedParagraphs'),
    capacity: company.capacity ?? undefined,
    incorporated: company.incorporated ?? undefined,
    qualitySteps: company.qualitySteps.map((step, index) => ({
      _key: `step-${index}`,
      title: localized(step.title),
      body: localized(step.body, 'localizedText'),
    })),
    certifications: company.certifications ?? [],
    plants: company.plants.map((plant, index) =>
      compact({
        _key: `plant-${index}`,
        kind: plant.kind,
        address: plant.address,
        city: plant.city,
        region: plant.region,
        postalCode: plant.postalCode ?? undefined,
        country: plant.country,
      }),
    ),
    email: company.email,
    phone: company.phone,
    people: (company.people ?? []).map((person, index) =>
      compact({
        _key: `person-${index}`,
        name: person.name,
        role: localized(person.role),
        phone: person.phone ?? undefined,
        email: person.email ?? undefined,
      }),
    ),
    linkedin: company.linkedin ?? undefined,
  }),
)

writeFileSync(OUTPUT, documents.map((document) => JSON.stringify(document)).join('\n') + '\n')

const counts = documents.reduce((tally, document) => {
  tally[document._type] = (tally[document._type] ?? 0) + 1
  return tally
}, {})

console.log(`\n✓ ${documents.length} documentos preparados en ${path.relative(ROOT, OUTPUT)}`)
console.log(
  `  ${Object.entries(counts)
    .map(([type, count]) => `${count} × ${type}`)
    .join(' · ')}`,
)

if (warnings.length > 0) {
  console.error(`\n✗ Cotas incoherentes — estas bobinas se descartarían al leerlas:`)
  for (const warning of warnings) console.error(`    ${warning}`)
  console.error('')
  process.exit(1)
}

// Los marcadores existen para que nadie publique datos falsos por descuido, así que el
// script los grita en cada ejecución en vez de dejarlos pasar en silencio.
const placeholders = []
if (String(company.email).endsWith('.example')) placeholders.push(`email: ${company.email}`)
if (/^\+91 0+ 0+ 0+$/.test(String(company.phone))) placeholders.push(`phone: ${company.phone}`)
if (placeholders.length > 0) {
  console.warn(
    `\n⚠ Datos de contacto de relleno, PENDIENTES de confirmar con Swiftmet:\n` +
      placeholders.map((line) => `    ${line}`).join('\n') +
      `\n  Se pueden corregir en el panel sin volver a importar. Ver README.\n`,
  )
}

console.log('  Siguiente paso: npm run migrate:import\n')
