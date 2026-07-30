/**
 * GUION DEL MONTAJE DE PORTADA — un plano por entrada, en orden de emisión.
 *
 * Este fichero es sólo datos: lo lee `build-hero-montage.mjs` para cortar el vídeo y
 * `components/sections/HeroMontage.tsx` **no** lo lee (el montaje viaja ya renderizado en
 * `public/hero/`). Está separado del script de render porque es lo único que se toca al
 * ajustar el montaje: cambiar un plano es cambiar cuatro números aquí, no tocar
 * filtergraphs de ffmpeg.
 *
 * ORIGEN DEL MATERIAL. Los planos salen de dos películas industriales de **dominio
 * público** sobre la producción de aluminio, alojadas en archive.org:
 *
 * - `Aluminum1956`   — «Aluminum on the March», parte I (1956). Bauxita, electrólisis,
 *                      colada, laminación, bobinado. Es la fuente de todos los planos
 *                      menos uno.
 * - `Aluminum1956_2` — «Aluminum on the March», parte II (1956). Sólo se usa el tren de
 *                      cilindros pulidos del principio.
 *
 * Ambas están marcadas como dominio público (`creativecommons.org/licenses/publicdomain/`)
 * en los metadatos de archive.org, así que no hay obligación de atribución ni límite de
 * uso comercial. Se citan igualmente en `public/hero/CREDITS.md`: saber de dónde viene un
 * fotograma es lo que permite sustituirlo sin repetir la búsqueda.
 *
 * NO ES LA PLANTA DE SWIFTMET, Y ESO IMPORTA. Es material de archivo genérico de la
 * industria del aluminio, no la fábrica de Baghola (ver regla 8 del CLAUDE.md: no se
 * inventan datos del cliente). Por eso el montaje va tratado hasta la abstracción —muy
 * contrastado, virado, sin un solo plano general reconocible— y por eso el `aria-label`
 * del vídeo dice «material de archivo del proceso del aluminio» y nunca «nuestra planta».
 * En cuanto Swiftmet entregue vídeo propio, se sustituyen los ficheros de `public/hero/`
 * y no hay que tocar ni una línea de componente.
 *
 * EL ARCO DE COLOR ES EL PROCESO. Los planos van ordenados de caliente a frío: horno y
 * colada en ámbar, laminación en acero neutro, bobina acabada en azul frío. No es
 * decoración: es la única forma de que veinticuatro segundos de cortes rápidos se lean
 * como *un proceso* y no como una carpeta de clips. `grade` es lo que fija cada plano en
 * ese arco.
 *
 * Campos de cada plano:
 * - `src`     — `1` = parte I, `2` = parte II.
 * - `at`      — segundo de entrada en la película original.
 * - `out`     — duración **en el montaje final**, ya acelerada (lo que se ve en pantalla).
 * - `speed`   — factor de aceleración. La «cámara rápida» del encargo; también es lo que
 *               convierte un plano documental de los cincuenta en un plano de energía.
 * - `grade`   — `hot` | `steel` | `cold`, el arco anterior.
 * - `yOff`    — 0..1, encuadre vertical al recortar 4:3 → 16:9 (0 = arriba).
 * - `xOff`    — 0..1, encuadre horizontal al recortar 4:3 → 9:16 (0 = izquierda).
 * - `zoom`    — recorte extra antes de escalar, para apretar el plano y perder el borde
 *               de la película. 1 = sin recorte.
 * - `lift`    — corrección de brillo de este plano (opcional, por omisión 0). El contraste
 *               general está puesto para los planos con luces; los que venían oscuros de
 *               origen necesitan recuperarse o se quedan en negro.
 * - `note`    — qué se ve. Para quien vuelva a esto en seis meses.
 *
 * UNA COSA QUE HAY QUE MIRAR AL CAMBIAR UN `at`. El material es publicidad industrial de
 * 1956 y **tiene rótulos y marcas de otras empresas** dentro. En el primer montaje, el
 * plano del almacén de bobinas derivaba a un cartel enorme que decía «SHIP TO REYNOLDS
 * ALUMINUM» — la marca de un tercero, a pantalla completa, en la portada de Swiftmet. Está
 * a doce segundos del punto de entrada que parecía seguro. Al tocar cualquier `at`, hay que
 * revisar la ventana completa que consume el plano (`out × speed`), no sólo el fotograma de
 * entrada.
 */

/** @typedef {{src:1|2, at:number, out:number, speed:number, grade:'hot'|'steel'|'cold', yOff:number, xOff:number, zoom:number, lift?:number, note:string}} Shot */

/** @type {Shot[]} */
export const shots = [
  {
    src: 1,
    at: 418.6,
    out: 2.5,
    speed: 1.35,
    grade: 'hot',
    yOff: 0.45,
    xOff: 0.62,
    zoom: 1.25,
    note: 'Horno basculando: la carga incandescente asoma por la boca. Abre en ámbar.',
  },
  {
    src: 1,
    at: 400.3,
    out: 2.0,
    speed: 1.6,
    grade: 'hot',
    yOff: 0.5,
    xOff: 0.5,
    zoom: 1.2,
    lift: 0.05,
    note: 'Cuchara de colada suspendida, humeando. Silueta redonda sobre negro.',
  },
  {
    src: 1,
    at: 428.4,
    out: 1.9,
    speed: 1.55,
    grade: 'hot',
    yOff: 0.55,
    xOff: 0.45,
    zoom: 1.3,
    note: 'Colada en las lingoteras: el metal cae blanco. El plano más brillante del ciclo.',
  },
  {
    src: 1,
    at: 502.4,
    out: 2.5,
    speed: 1.45,
    grade: 'steel',
    yOff: 0.5,
    xOff: 0.5,
    zoom: 1.15,
    note: 'Cortina de agua sobre el desbaste al salir del tren. Corta el calor de golpe.',
  },
  {
    src: 1,
    at: 512.8,
    out: 2.0,
    speed: 1.6,
    grade: 'steel',
    yOff: 0.52,
    xOff: 0.5,
    zoom: 1.2,
    note: 'La plancha sale entre cilindros, con la superficie ya reflectante.',
  },
  {
    src: 2,
    at: 161.5,
    out: 1.9,
    speed: 1.6,
    grade: 'steel',
    yOff: 0.5,
    xOff: 0.42,
    zoom: 1.25,
    note: 'Tren de cilindros pulidos girando: metal contra metal, casi un espejo.',
  },
  {
    src: 1,
    at: 526.6,
    out: 2.1,
    speed: 1.55,
    grade: 'steel',
    yOff: 0.5,
    xOff: 0.5,
    zoom: 1.2,
    note: 'Laminación en marcha, agua y vapor a contraluz.',
  },
  {
    src: 1,
    at: 536.8,
    out: 1.8,
    speed: 1.6,
    grade: 'cold',
    yOff: 0.48,
    xOff: 0.5,
    zoom: 1.3,
    lift: 0.07,
    note: 'El rollo girando en la bobinadora, envuelto en vapor.',
  },
  {
    src: 1,
    at: 544.8,
    out: 2.5,
    speed: 1.4,
    grade: 'cold',
    yOff: 0.5,
    xOff: 0.55,
    zoom: 1.15,
    lift: 0.06,
    note: 'Bobina formada en la máquina: el cilindro de aluminio ya es un producto.',
  },
  {
    src: 1,
    // 553,6 y no 558: a partir de 566 entra en cuadro un cartel de otro fabricante
    // («SHIP TO REYNOLDS ALUMINUM»). Esta ventana —553,6 a 556,6— es la parte limpia.
    at: 553.6,
    out: 2.0,
    speed: 1.5,
    grade: 'cold',
    yOff: 0.42,
    xOff: 0.3,
    zoom: 1.15,
    lift: 0.02,
    note: 'Bobinas acabadas cargándose, alineadas por el hueco central. El plano de catálogo.',
  },
  {
    src: 1,
    at: 632.4,
    // 2,35 y no 2,8: en el original hay un corte de plano en 635,5 y la ventana más larga
    // lo cruzaba, así que el ciclo acababa con un fotograma de otra escena.
    out: 2.35,
    speed: 1.3,
    grade: 'cold',
    yOff: 0.5,
    xOff: 0.58,
    zoom: 1.2,
    note: 'Primer plano del carrete en la devanadora. Cierra donde empieza el catálogo.',
  },
]

/**
 * Congelados. Un fotograma quieto, muy corto, insertado **antes** del plano cuyo índice
 * se indica. Es el recurso de sanity.io que hace que el montaje no se lea como un vídeo
 * continuo sino como algo que salta: dos parpadeos de imagen fija entre planos de vídeo.
 * Es, literalmente, la mezcla de imágenes y vídeo que pedía el encargo.
 */
export const stills = [
  { before: 3, src: 1, at: 440.2, out: 0.34, grade: 'hot', yOff: 0.55, xOff: 0.5, zoom: 1.35 },
  { before: 9, src: 1, at: 552.6, out: 0.34, grade: 'cold', yOff: 0.5, xOff: 0.52, zoom: 1.4 },
]

/** Duración total del montaje, en segundos. sanity.io usa 24,8 s; este ciclo se le acerca. */
export const cycleSeconds =
  shots.reduce((total, shot) => total + shot.out, 0) +
  stills.reduce((total, still) => total + still.out, 0)
