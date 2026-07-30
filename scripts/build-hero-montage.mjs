/**
 * RENDER DEL MONTAJE DE PORTADA.
 *
 *   node scripts/build-hero-montage.mjs
 *
 * Corta, trata y codifica el montaje que se ve al abrir la web, a partir de las dos
 * películas de dominio público que describe `hero-montage-shots.mjs`. Escribe en
 * `public/hero/` cuatro vídeos y dos pósters, y **eso** es lo que se sube al repositorio:
 * los másteres originales (≈150 MB) no se versionan, se vuelven a descargar si hace falta.
 *
 * POR QUÉ ESTO ES UN SCRIPT Y NO «un vídeo que alguien hizo una vez». El montaje son
 * once planos con su encuadre, su velocidad y su viraje. Ajustar «el tercer plano dura
 * demasiado» sin script significa reabrir un editor, reencontrar el segundo 428 de una
 * película de catorce minutos y reexportar a mano cuatro ficheros con los mismos ajustes.
 * Con script es cambiar un número en el guion y volver a lanzarlo. La primera vez cuesta
 * más; la segunda ya no.
 *
 * REQUISITOS: **ffmpeg**. Se busca, por orden: la variable de entorno `FFMPEG`, el paquete
 * `ffmpeg-static` si estuviera instalado, y `ffmpeg` en el PATH. No es dependencia del
 * proyecto a propósito: es un binario de ~80 MB que sólo necesita quien vaya a rehacer el
 * montaje, no quien despliegue la web ni quien edite contenido en el panel.
 *
 * LO QUE SALE (`public/hero/`):
 * - `montage-wide.webm` / `.mp4`  — 1600×900, para escritorio y tableta.
 * - `montage-tall.webm` / `.mp4`  — 720×1280, para móvil en vertical.
 * - `poster-wide.jpg` / `poster-tall.jpg` — primer fotograma ya tratado.
 *
 * Dos proporciones y no una: recortar 16:9 a la pantalla de un móvil en vertical deja el
 * plano en una franja de la altura de un dedo, y es justo donde más gente ve la portada.
 * sanity.io sirve tres proporciones por el mismo motivo. Dos cubren el caso a la mitad de
 * peso.
 *
 * Dos formatos por proporción: **webm/VP9** pesa la mitad, **mp4/H.264** lo reproduce todo
 * —incluido Safari, que sigue siendo la mitad del tráfico móvil—. El navegador elige el
 * primero que sabe leer.
 *
 * EL TRATAMIENTO ES LA MITAD DEL TRABAJO. El material es de 1956 y en crudo se lee como
 * documental antiguo, que es exactamente lo contrario de lo que debe transmitir un
 * fabricante en activo. Lo que lo cambia:
 *
 * 1. `hqdn3d` — quita el grano de película. El grano es el delator número uno de la edad
 *    del material; sin él, la imagen ya no dice «esto es viejo».
 * 2. `eq` + `curves` — negros a fondo (el hero es `--color-inverse`, casi negro: los negros
 *     del vídeo tienen que fundirse con él) y muchísimo contraste. Convierte planos
 *     documentales en formas sobre negro.
 * 3. Desaturar y **virar**: el color original de los cincuenta —cian lavado, ocres— es otro
 *    delator. Cada plano se lleva a uno de los tres pasos del arco (`hot`/`steel`/`cold`).
 * 4. `gblur` + `blend=screen` — un halo suave en las luces. Es lo que hace que el metal
 *    incandescente parezca emitir luz en lugar de estar sobreexpuesto.
 * 5. Aceleración por plano (`setpts`) — la «cámara rápida» del encargo.
 * 6. Rejilla de líneas y viñeta al final, sobre el montaje ya unido: la capa que lo pone
 *    en el terreno de la interfaz y no del vídeo de stock.
 *
 * El resultado no pretende ser fiel al proceso real de Swiftmet —el encargo dice
 * explícitamente que no hace falta— sino legible en tres segundos: fuego, laminación,
 * bobina.
 */

import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { cycleSeconds, shots, stills } from './hero-montage-shots.mjs'

const run = promisify(execFile)
const require = createRequire(import.meta.url)

const ROOT = path.resolve(import.meta.dirname, '..')
/** Másteres descargados. Gitignorado: son 150 MB que se reconstruyen con una orden. */
const SRC_DIR = path.join(ROOT, '.hero-src')
const OUT_DIR = path.join(ROOT, 'public', 'hero')

/** Las dos películas, con el identificador de archive.org que las localiza. */
const FILMS = {
  1: { id: 'Aluminum1956', file: 'aluminum-1956-part1.mp4' },
  2: { id: 'Aluminum1956_2', file: 'aluminum-1956-part2.mp4' },
}

/** Proporciones de salida. `label` es lo que acaba en el nombre del fichero. */
const FORMATS = [
  { label: 'wide', width: 1600, height: 900 },
  { label: 'tall', width: 720, height: 1280 },
]

const FPS = 24
/** El original es 4:3 a 640×480. Se declara aquí porque todos los recortes parten de ahí. */
const SOURCE = { width: 640, height: 480 }

/**
 * Los tres pasos del arco de color. Cada uno es un `colorbalance` (dónde van sombras,
 * medios y luces) más cuánta saturación original se conserva y cuánto halo se añade.
 *
 * `keep` no es un capricho: los planos calientes necesitan algo de color propio —el naranja
 * del metal es la única cosa cálida del montaje— mientras que los fríos funcionan mejor
 * casi monocromos, virados a la mano.
 */
const GRADES = {
  hot: {
    keep: 0.5,
    balance: 'rs=0.06:gs=-0.02:bs=-0.08:rm=0.10:gm=0.02:bm=-0.10:rh=0.16:gh=0.06:bh=-0.14',
    bloom: 0.42,
    curve: '0/0 0.22/0.10 0.62/0.72 1/1',
  },
  steel: {
    keep: 0.22,
    balance: 'rs=-0.04:gs=0.00:bs=0.07:rm=-0.02:gm=0.01:bm=0.06:rh=0.02:gh=0.04:bh=0.06',
    bloom: 0.3,
    curve: '0/0 0.24/0.12 0.68/0.78 1/1',
  },
  cold: {
    keep: 0.14,
    balance: 'rs=-0.08:gs=-0.01:bs=0.12:rm=-0.07:gm=0.01:bm=0.12:rh=-0.05:gh=0.04:bh=0.14',
    bloom: 0.24,
    curve: '0/0 0.26/0.13 0.70/0.80 1/1',
  },
}

/** ffmpeg: variable de entorno, `ffmpeg-static` si está, o el PATH. */
function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG
  try {
    return require('ffmpeg-static')
  } catch {
    return 'ffmpeg'
  }
}

const FFMPEG = findFfmpeg()

async function ffmpeg(args) {
  // `maxBuffer` alto: ffmpeg escribe mucho en stderr y con el valor por omisión (1 MB)
  // los renders largos mueren con ENOBUFS en lugar de con un error real.
  return run(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    maxBuffer: 64 * 1024 * 1024,
  })
}

async function exists(file) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

/** Descarga un máster de archive.org si todavía no está en `.hero-src/`. */
async function ensureFilm(key) {
  const film = FILMS[key]
  const target = path.join(SRC_DIR, film.file)
  if (await exists(target)) return target

  const url = `https://archive.org/download/${film.id}/${film.id}.mp4`
  process.stdout.write(`  descargando ${film.id} (una vez, ~85 MB)… `)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`archive.org devolvió ${response.status} para ${url}`)
  await fs.writeFile(target, Buffer.from(await response.arrayBuffer()))
  process.stdout.write('hecho\n')
  return target
}

/**
 * Filtro de un plano: encuadre → velocidad → limpieza → contraste → viraje → halo.
 *
 * El orden importa. Escalar antes de recortar tira resolución que luego se echa en falta;
 * desaturar antes de subir el contraste apaga el metal incandescente, que es lo único que
 * aporta color al montaje.
 */
function shotFilter(shot, format, { frozen = false } = {}) {
  const grade = GRADES[shot.grade]
  const target = format.width / format.height

  // Recorte de encuadre sobre el 4:3 original: primero el `zoom` (apretar el plano y
  // perder el borde sucio de la película), después la proporción de salida.
  const zoomWidth = Math.round(SOURCE.width / shot.zoom)
  const zoomHeight = Math.round(SOURCE.height / shot.zoom)
  const zoomX = Math.round((SOURCE.width - zoomWidth) * shot.xOff)
  const zoomY = Math.round((SOURCE.height - zoomHeight) * shot.yOff)

  let cropWidth = zoomWidth
  let cropHeight = Math.round(zoomWidth / target)
  if (cropHeight > zoomHeight) {
    cropHeight = zoomHeight
    cropWidth = Math.round(zoomHeight * target)
  }
  const cropX = Math.round((zoomWidth - cropWidth) * shot.xOff)
  const cropY = Math.round((zoomHeight - cropHeight) * shot.yOff)

  const steps = [
    `crop=${zoomWidth}:${zoomHeight}:${zoomX}:${zoomY}`,
    `crop=${cropWidth}:${cropHeight}:${cropX}:${cropY}`,
    `scale=${format.width}:${format.height}:flags=lanczos`,
    `fps=${FPS}`,
  ]

  // Un congelado ya llega como imagen fija: acelerarlo no significa nada.
  if (!frozen) steps.push(`setpts=PTS/${shot.speed}`)

  steps.push(
    'hqdn3d=3:2:4:4',
    // `lift` compensa por plano. El contraste general está puesto para los planos con
    // luces —colada, agua, plancha reflectante—, y a los que ya venían oscuros de origen
    // les come el motivo entero: el rollo entre vapor se quedaba en un rectángulo negro.
    `eq=contrast=1.28:brightness=${(-0.05 + (shot.lift ?? 0)).toFixed(3)}:saturation=${grade.keep}`,
    `curves=all='${grade.curve}'`,
    `colorbalance=${grade.balance}`,
    'unsharp=5:5:0.7:5:5:0.0',
  )

  const chain = steps.join(',')
  // Halo: copia desenfocada sumada en `screen`. `blend` necesita dos entradas, así que el
  // plano se parte en dos ramas y se vuelve a unir.
  return (
    `${chain},split=2[base][glow];` +
    `[glow]gblur=sigma=18,eq=brightness=-0.10[soft];` +
    `[base][soft]blend=all_mode=screen:all_opacity=${grade.bloom},setsar=1`
  )
}

/** Corta y trata un plano de vídeo a un fichero intermedio sin pérdida apreciable. */
async function renderShot(shot, format, index, workDir) {
  const source = await ensureFilm(shot.src)
  const out = path.join(workDir, `${format.label}-${String(index).padStart(2, '0')}.mp4`)
  // `-ss` antes de `-i` busca por keyframe (rápido); el corte fino lo hace `-t` sobre la
  // duración de origen, que es la de salida multiplicada por la aceleración.
  await ffmpeg([
    '-ss',
    String(shot.at),
    '-t',
    String(shot.out * shot.speed + 0.4),
    '-i',
    source,
    '-an',
    '-filter_complex',
    shotFilter(shot, format),
    '-t',
    String(shot.out),
    '-c:v',
    'libx264',
    '-crf',
    '16',
    '-preset',
    'veryfast',
    '-pix_fmt',
    'yuv420p',
    out,
  ])
  return out
}

/** Igual, pero congelando un solo fotograma durante `out` segundos. */
async function renderStill(still, format, index, workDir) {
  const source = await ensureFilm(still.src)
  const out = path.join(workDir, `${format.label}-still-${index}.mp4`)
  await ffmpeg([
    '-ss',
    String(still.at),
    '-i',
    source,
    '-frames:v',
    '1',
    '-an',
    '-filter_complex',
    shotFilter({ ...still, speed: 1 }, format, { frozen: true }),
    path.join(workDir, `${format.label}-still-${index}.png`),
  ])
  // Un PNG no es un vídeo: se bucea el fotograma el tiempo que toque.
  await ffmpeg([
    '-loop',
    '1',
    '-framerate',
    String(FPS),
    '-t',
    String(still.out),
    '-i',
    path.join(workDir, `${format.label}-still-${index}.png`),
    '-an',
    '-vf',
    `fps=${FPS},setsar=1`,
    '-c:v',
    'libx264',
    '-crf',
    '16',
    '-preset',
    'veryfast',
    '-pix_fmt',
    'yuv420p',
    out,
  ])
  return out
}

/**
 * Capa de interfaz sobre el montaje ya unido: rejilla de líneas horizontales muy tenue,
 * viñeta y un pequeño oscurecido general.
 *
 * Va aquí y no en el componente porque tiene que quedar *dentro* de la imagen: una rejilla
 * en CSS encima del vídeo se ve como una rejilla encima de un vídeo; grabada, se lee como
 * la textura de la propia imagen. Las cifras y los rótulos, al contrario, van en el DOM
 * —texto nítido y traducible— y no aquí.
 */
function overlayFilter(format) {
  const line = Math.max(2, Math.round(format.height / 300))
  return [
    // Rejilla: una franja de una línea oscura cada `line*2` píxeles, sumada en `multiply`.
    `[0:v]format=yuv420p,split=2[body][grid]`,
    // Dos detalles de sintaxis que cuestan una tarde si no están escritos:
    //
    // 1. Sin comillas alrededor de la expresión. Los argumentos van a ffmpeg por
    //    `execFile`, sin shell, así que unas comillas aquí llegan al evaluador como parte
    //    de la expresión, no como delimitador. Las comas sí se escapan: dentro de un
    //    filtergraph, una coma suelta separa filtros.
    // 2. **`geq` no tiene `if()`.** La forma legible —`if(mod(Y,6)<3, 232, 255)`— falla con
    //    «Missing ')' or too many args», que no ayuda nada. De ahí la versión aritmética:
    //    `mod(floor(Y/line), 2)` vale 0 o 1 y elige entre 232 y 255 multiplicando.
    `[grid]geq=lum=232+23*mod(floor(Y/${line})\\,2):cb=128:cr=128[lines]`,
    `[body][lines]blend=all_mode=multiply:all_opacity=0.30[gridded]`,
    // Viñeta: centra la mirada y, sobre todo, apaga las esquinas donde va el texto.
    `[gridded]vignette=angle=PI/5:mode=forward,eq=brightness=-0.02[out]`,
  ].join(';')
}

/** Une los planos, aplica la capa de interfaz y codifica webm + mp4 + póster. */
async function renderFormat(format, workDir) {
  console.log(`\n${format.label} (${format.width}×${format.height})`)

  // Guion completo: los congelados se insertan antes del plano que indica `before`.
  const timeline = []
  for (let i = 0; i < shots.length; i++) {
    const still = stills.find((s) => s.before === i)
    if (still) timeline.push({ kind: 'still', data: still, key: stills.indexOf(still) })
    timeline.push({ kind: 'shot', data: shots[i], key: i })
  }

  const parts = []
  for (const item of timeline) {
    process.stdout.write(`  ${item.kind === 'shot' ? 'plano' : 'congelado'} ${item.key}… `)
    parts.push(
      item.kind === 'shot'
        ? await renderShot(item.data, format, item.key, workDir)
        : await renderStill(item.data, format, item.key, workDir),
    )
    process.stdout.write('ok\n')
  }

  // `concat` por demuxer y no por filtro: todos los trozos salen del mismo filtro con el
  // mismo tamaño, fps y pix_fmt, así que se pueden pegar sin recodificar.
  const listFile = path.join(workDir, `${format.label}-list.txt`)
  await fs.writeFile(listFile, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'))
  const joined = path.join(workDir, `${format.label}-joined.mp4`)
  await ffmpeg(['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', joined])

  const graded = path.join(workDir, `${format.label}-graded.mp4`)
  process.stdout.write('  capa de interfaz… ')
  await ffmpeg([
    '-i',
    joined,
    '-filter_complex',
    overlayFilter(format),
    '-map',
    '[out]',
    '-an',
    '-c:v',
    'libx264',
    '-crf',
    '16',
    '-preset',
    'veryfast',
    '-pix_fmt',
    'yuv420p',
    graded,
  ])
  process.stdout.write('ok\n')

  // VP9: `-b:v 0` es obligatorio para que `-crf` funcione como calidad constante; sin él,
  // ffmpeg usa un bitrate por omisión ridículo y el vídeo sale hecho papilla.
  process.stdout.write('  webm (VP9)… ')
  await ffmpeg([
    '-i',
    graded,
    '-an',
    '-c:v',
    'libvpx-vp9',
    '-crf',
    '38',
    '-b:v',
    '0',
    '-row-mt',
    '1',
    '-cpu-used',
    '2',
    '-g',
    String(FPS * 5),
    path.join(OUT_DIR, `montage-${format.label}.webm`),
  ])
  process.stdout.write('ok\n')

  process.stdout.write('  mp4 (H.264)… ')
  await ffmpeg([
    '-i',
    graded,
    '-an',
    '-c:v',
    'libx264',
    '-crf',
    '30',
    '-preset',
    'slow',
    '-profile:v',
    'main',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    path.join(OUT_DIR, `montage-${format.label}.mp4`),
  ])
  process.stdout.write('ok\n')

  // Póster: el primer fotograma. Es lo que se ve mientras el vídeo carga y lo que ven
  // quienes han pedido no ver animaciones, así que sale del mismo tratamiento y no de una
  // captura aparte que se quedaría desincronizada al cambiar el guion.
  process.stdout.write('  póster… ')
  await ffmpeg([
    '-i',
    graded,
    '-frames:v',
    '1',
    '-q:v',
    '4',
    path.join(OUT_DIR, `poster-${format.label}.jpg`),
  ])
  process.stdout.write('ok\n')
}

async function main() {
  console.log(`Montaje de portada — ${cycleSeconds.toFixed(1)} s, ${shots.length} planos`)
  console.log(`ffmpeg: ${FFMPEG}`)

  await fs.mkdir(SRC_DIR, { recursive: true })
  await fs.mkdir(OUT_DIR, { recursive: true })
  const workDir = path.join(SRC_DIR, 'work')
  await fs.rm(workDir, { recursive: true, force: true })
  await fs.mkdir(workDir, { recursive: true })

  for (const format of FORMATS) await renderFormat(format, workDir)

  await fs.rm(workDir, { recursive: true, force: true })

  console.log('\nEn public/hero/:')
  for (const name of (await fs.readdir(OUT_DIR)).sort()) {
    const { size } = await fs.stat(path.join(OUT_DIR, name))
    console.log(`  ${name.padEnd(24)} ${(size / 1024).toFixed(0)} kB`)
  }
}

await main()
