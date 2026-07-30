#!/usr/bin/env node
/**
 * ASSETS DE MARCA · `npm run brand`
 *
 * Genera los tres ficheros que Next sirve por convención de nombre:
 *
 *   app/icon.png             favicon 512×512
 *   app/apple-icon.png       icono 180×180 para iOS
 *   app/opengraph-image.jpg  1200×630 para compartir en WhatsApp, LinkedIn, X…
 *
 * **No parte de ningún archivo de imagen**, y ahí está la diferencia con el proyecto de
 * referencia: allí el favicon se recortaba del logotipo real del estudio. Swiftmet no
 * tiene (o no publica) logotipo vectorial, así que el símbolo se dibuja aquí en SVG —la
 * misma sección de bobina que usa `components/layout/Wordmark.tsx`— y se rasteriza. El
 * script no depende de ficheros que no tenemos y se puede ejecutar en un clon limpio.
 *
 * Cuando llegue el logotipo real: se sustituye `MARK_SVG` por el trazo de verdad y todo
 * lo demás sigue funcionando.
 *
 * Los resultados SÍ se versionan (son tres ficheros pequeños). Sólo hay que volver a
 * ejecutarlo si cambia la marca.
 */

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const APP = path.join(ROOT, 'app')

// Los mismos valores que `app/globals.css`. Están duplicados a propósito: este script
// corre en Node, sin PostCSS, y no puede leer tokens de CSS. Si cambian allí, cambiar aquí.
const PAPER = '#f2f3f4'
const INK = '#0f1316'

/**
 * Símbolo: sección de bobina. Dos pestañas verticales y las dos líneas del núcleo. A
 * 16 px —el tamaño que de verdad importa en un favicon— tres barras verticales se leen;
 * un dibujo con detalle se convierte en una mancha gris.
 */
const MARK_SVG = (size, color) => `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g stroke="${color}" stroke-width="2.6" stroke-linecap="square" fill="none">
      <path d="M5 3v18M19 3v18"/>
      <path d="M5 9h14M5 15h14"/>
    </g>
  </svg>`

async function main() {
  await mkdir(APP, { recursive: true })

  // --- Favicon e icono de iOS -----------------------------------------------------------
  // El símbolo se dibuja al 62 % del lienzo y se centra sobre fondo papel: siempre con
  // aire y nunca deformado.
  const icon = async (size) => {
    const inner = Math.round(size * 0.62)
    const mark = Buffer.from(MARK_SVG(inner, INK))
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: PAPER,
      },
    })
      .composite([{ input: await sharp(mark).png().toBuffer(), gravity: 'centre' }])
      .png({ compressionLevel: 9 })
  }

  await (await icon(512)).toFile(path.join(APP, 'icon.png'))
  await (await icon(180)).toFile(path.join(APP, 'apple-icon.png'))

  // --- Imagen para compartir ------------------------------------------------------------
  // Fondo oscuro, el símbolo y el rótulo. Todo se rasteriza aquí y se versiona como JPG,
  // así que no hay dependencia de fuentes en tiempo de ejecución.
  //
  // El rótulo es **neutro de idioma**: la convención de ficheros de Next sirve una sola
  // imagen para todo el sitio, así que un subtítulo en inglés aparecería igualmente al
  // compartir /hi y /es. Se queda en nombre + ciudad + producto en su forma más neutra.
  const card = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="${INK}"/>
      <g stroke="${PAPER}" stroke-width="7" stroke-linecap="square" fill="none"
         transform="translate(72,64) scale(2.6)">
        <path d="M5 3v18M19 3v18"/>
        <path d="M5 9h14M5 15h14"/>
      </g>
      <text x="176" y="118" fill="${PAPER}" font-family="Segoe UI, Helvetica, Arial, sans-serif"
            font-size="34" letter-spacing="7">SWIFTMET</text>
      <text x="72" y="430" fill="${PAPER}" font-family="Segoe UI, Helvetica, Arial, sans-serif"
            font-size="54">High purity aluminium wire</text>
      <text x="72" y="500" fill="${PAPER}" fill-opacity="0.66"
            font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34">
        for vacuum metallising
      </text>
      <line x1="72" y1="540" x2="1128" y2="540" stroke="${PAPER}" stroke-opacity="0.25"/>
      <text x="72" y="578" fill="${PAPER}" fill-opacity="0.66"
            font-family="Consolas, monospace" font-size="26" letter-spacing="2">
        Palwal, Haryana, India
      </text>
    </svg>`)

  await sharp(card)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(APP, 'opengraph-image.jpg'))

  console.log('✓ app/icon.png · app/apple-icon.png · app/opengraph-image.jpg')
  console.log('  Marca provisional dibujada en SVG (no hay logotipo de Swiftmet). Ver README.')
}

await main()
