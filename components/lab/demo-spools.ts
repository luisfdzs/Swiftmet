import type { SpoolEntry } from '@/lib/content'

/**
 * Las catorce bobinas reales del listado maestro (`scripts/migration/content-snapshot.json`,
 * ya importado en Sanity), copiadas aquí a mano para que estas páginas de prueba no
 * dependan de un proyecto de Sanity conectado. No son datos inventados.
 */
export const DEMO_SPOOLS: [SpoolEntry, ...SpoolEntry[]] = [
  {
    code: 'SW200',
    netWeight: 2.75,
    flangeDiameter: 200,
    coreDiameter: 120,
    boreHole: 38.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW265',
    netWeight: 6.0,
    flangeDiameter: 265,
    coreDiameter: 120,
    boreHole: 38.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW265-1',
    netWeight: 6.0,
    flangeDiameter: 265,
    coreDiameter: 120,
    boreHole: 51.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW280',
    netWeight: 7.0,
    flangeDiameter: 280,
    coreDiameter: 120,
    boreHole: 38.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW285',
    netWeight: 7.5,
    flangeDiameter: 285,
    coreDiameter: 120,
    boreHole: 38.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW295',
    netWeight: 8.0,
    flangeDiameter: 295,
    coreDiameter: 120,
    boreHole: 38.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW300',
    netWeight: 8.5,
    flangeDiameter: 300,
    coreDiameter: 120,
    boreHole: 38.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW305',
    netWeight: 8.5,
    flangeDiameter: 305,
    coreDiameter: 120,
    boreHole: 38.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW320',
    netWeight: 9.5,
    flangeDiameter: 320,
    coreDiameter: 120,
    boreHole: 38.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW320-1',
    netWeight: 9.5,
    flangeDiameter: 320,
    coreDiameter: 120,
    boreHole: 51.5,
    spoolWidth: 80,
    windingWidth: 67,
  },
  {
    code: 'SW320-2',
    netWeight: 8.5,
    flangeDiameter: 320,
    coreDiameter: 100,
    boreHole: 51.5,
    spoolWidth: 71,
    windingWidth: 59,
  },
  {
    code: 'SW360',
    netWeight: 11.75,
    flangeDiameter: 360,
    coreDiameter: 100,
    boreHole: 38.5,
    spoolWidth: 71,
    windingWidth: 59,
  },
  {
    code: 'SW360-1',
    netWeight: 11.75,
    flangeDiameter: 360,
    coreDiameter: 100,
    boreHole: 51.5,
    spoolWidth: 71,
    windingWidth: 59,
  },
  {
    code: 'SW360-3 (HW)',
    netWeight: 14.5,
    flangeDiameter: 360,
    coreDiameter: 100,
    boreHole: 51.5,
    spoolWidth: 85,
    windingWidth: 71,
  },
]

/**
 * Qué código de la tabla real se enseña con cada foto recortada. La correspondencia es
 * arbitraria —no hay forma de saber a qué cota exacta corresponde cada foto sin medirla
 * en fábrica—, así que en la interfaz se marca como ilustrativa, nunca como la cota
 * verificada de esa unidad.
 */
export const DEMO_SPOOL_PHOTOS: Record<string, string> = {
  SW200: '/lab/spools/spool-pair-tarp.webp',
  SW285: '/lab/spools/spool-trio.webp',
  SW320: '/lab/spools/spool-three-floor.webp',
  'SW360-3 (HW)': '/lab/spools/spool-stack.webp',
}
