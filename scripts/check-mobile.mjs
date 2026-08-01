#!/usr/bin/env node
/**
 * VERIFICACIÓN EN MÓVIL · `npm run check:mobile`
 *
 * Abre el sitio en un Chrome real a 390×844 (tamaño de iPhone) y comprueba lo que en
 * escritorio no se ve. No es un test unitario: es la lista de cosas que ya se han roto
 * alguna vez —en este proyecto o en el de referencia, del que hereda la arquitectura.
 *
 * Fallos que este script existe para impedir:
 *  1. El menú abriéndose con el texto en color papel sobre fondo papel — ilegible.
 *  2. El panel del menú midiendo 0 px de alto: el `backdrop-blur` de la barra convierte
 *     al elemento que lo contiene en bloque contenedor de sus descendientes `fixed`.
 *  3. Enlaces con menos de 24 px de área pulsable (WCAG 2.2).
 *  4. `href()` devolviendo rutas relativas, que encadenan y dan 404 desde una ficha.
 *  5. **Propio de esta web:** la tabla de bobinas desbordando la PÁGINA en vez de
 *     desplazarse dentro de su caja. Siete columnas en 390 px es el caso que lo provoca,
 *     y es justo el contenido más importante del sitio.
 *  6. La barra de iconos de móvil —que va fija sobre el contenido— tapando el final del
 *     documento. Sin el hueco que el <body> se reserva debajo, el copyright y los enlaces
 *     del pie quedan detrás de ella justo donde más se nota.
 *
 * Usa `playwright-core` con el Chrome ya instalado: no descarga navegadores.
 * Requiere el servidor levantado (`npm run dev`) o un despliegue:
 *
 *   npm run check:mobile                            → http://localhost:3000
 *   BASE=https://swiftmettest.vercel.app npm run check:mobile
 *   LOCALE=hi npm run check:mobile                  → comprueba el hindi (Devanagari)
 */

import process from 'node:process'
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://localhost:3000'
const LOCALE = process.env.LOCALE ?? 'en'

/** Chrome instalado en el sistema. Se puede sobreescribir con CHROME_PATH. */
const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === 'win32'
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/usr/bin/google-chrome')

const results = []
const check = (ok, label) => {
  results.push({ ok, label })
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}`)
}

/** Ningún sitio debe desbordar horizontalmente en móvil. */
async function horizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()

  const errors = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))

  console.log(`\nRevisión móvil (390×844) sobre ${BASE}/${LOCALE}\n`)

  // --- Portada -------------------------------------------------------------------------
  await page.goto(`${BASE}/${LOCALE}`, { waitUntil: 'networkidle' })
  check((await horizontalOverflow(page)) <= 1, 'la portada no desborda en horizontal')

  // La navegación de móvil es una barra fija ABAJO, al alcance del pulgar, y no un botón
  // en la esquina de la cabecera. Arriba sólo queda la marca, centrada.
  const bar = page.locator('nav[aria-label="Mobile"]')
  const menuButton = bar.locator('button[aria-controls="mobile-nav"]')
  check(await bar.isVisible(), 'la barra de iconos de móvil se ve')
  check(await menuButton.isVisible(), 'el botón de menú se ve en móvil')
  check(
    !(await page.locator('header button, header nav[aria-label="Main"]').first().isVisible()),
    'la cabecera de móvil no lleva navegación: sólo la marca',
  )
  check(
    Math.abs(
      (await page.evaluate(() => {
        const mark = document.querySelector('.header-bar a[aria-label] svg')?.parentElement
        if (!mark) return null
        const rect = mark.getBoundingClientRect()
        return rect.left + rect.width / 2 - window.innerWidth / 2
      })) ?? 999,
    ) < 12,
    'la marca va centrada en la barra de móvil',
  )

  // --- Menú: abrir, bloquear scroll, cerrar, navegar ------------------------------------
  await menuButton.click()
  const panel = page.locator('#mobile-nav')
  const opened = await panel
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false)
  check(opened, 'el panel del menú se abre y ocupa la pantalla')

  const panelBox = await panel.boundingBox()
  check(
    (panelBox?.height ?? 0) > 400,
    `el panel tiene altura real (${Math.round(panelBox?.height ?? 0)} px)`,
  )
  check(
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden',
    'el scroll de la página se bloquea con el menú abierto',
  )

  // El fallo original: el panel hereda el color papel que la cabecera usa sobre el hero
  // oscuro y pinta papel sobre papel — un menú invisible. Ahora el panel vive fuera de la
  // cabecera, pero la comprobación sigue: lo que importa es que sus entradas se lean.
  await page.waitForTimeout(700)
  const panelStyle = await page.evaluate(() => {
    const link = document.querySelector('#mobile-nav nav a')
    if (!link) return null
    return {
      color: getComputedStyle(link).color,
      background: getComputedStyle(document.querySelector('#mobile-nav')).backgroundColor,
    }
  })
  check(
    panelStyle?.color === 'rgb(15, 19, 22)' && panelStyle?.background === 'rgb(242, 243, 244)',
    `el menú abierto va en tinta sobre papel opaco (${panelStyle?.color} sobre ${panelStyle?.background})`,
  )

  await page.keyboard.press('Escape')
  check(!(await panel.isVisible()), 'Escape cierra el menú')
  check(
    (await page.evaluate(() => document.body.style.overflow)) === '',
    'el scroll se restaura al cerrar',
  )

  await menuButton.click()
  await panel.locator('a').first().click()
  await page.waitForURL(`**/${LOCALE}/**`)
  check(!(await panel.isVisible()), 'el menú se cierra al navegar')
  check(
    (await page.evaluate(() => document.body.style.overflow)) === '',
    'el scroll queda desbloqueado tras navegar',
  )

  // --- La tabla de bobinas: se desplaza ELLA, no la página -------------------------------
  // Es la comprobación propia de esta web. Siete columnas de datos no caben en 390 px, y
  // la solución correcta es un contenedor con scroll horizontal; la incorrecta —y la que
  // pasa sola si alguien quita el `overflow-x-auto`— es que desborde el documento entero
  // y toda la web se pueda arrastrar de lado.
  for (const route of ['spools', '']) {
    const url = `${BASE}/${LOCALE}${route ? `/${route}` : ''}`
    await page.goto(url, { waitUntil: 'networkidle' })
    check((await horizontalOverflow(page)) <= 1, `${url} no desborda la página en horizontal`)

    const table = page.locator('table').first()
    if (await table.count()) {
      const scrolls = await page.evaluate(() => {
        const element = document.querySelector('table')?.parentElement
        if (!element) return null
        const style = getComputedStyle(element)
        return {
          overflowX: style.overflowX,
          scrollable: element.scrollWidth > element.clientWidth,
        }
      })
      check(
        scrolls?.overflowX === 'auto' || scrolls?.overflowX === 'scroll',
        `la tabla de bobinas está en un contenedor con scroll (${scrolls?.overflowX})`,
      )
      check(
        scrolls?.scrollable === true,
        'la tabla es más ancha que su caja, así que el scroll hace falta de verdad',
      )
    }
  }

  // --- Resto de plantillas --------------------------------------------------------------
  // Las cinco secciones del sitio son páginas. Empresa y contacto llegaron aquí desde las
  // anclas de la portada: lo que antes se comprobaba era que `#company` quedara bajo la
  // barra fija; ahora, que la página existe, tiene su titular y la barra la señala.
  for (const route of ['products', 'quality', 'company', 'contact']) {
    await page.goto(`${BASE}/${LOCALE}/${route}`, { waitUntil: 'networkidle' })
    check((await horizontalOverflow(page)) <= 1, `/${route} no desborda en horizontal`)
    check(
      (await page.locator('main h1').count()) === 1,
      `/${route} tiene un solo <h1> (es una página, no un trozo de otra)`,
    )
  }

  // --- NI UN SOLO `#` EN LA NAVEGACIÓN ----------------------------------------------------
  // El fallo que motivó todo esto: mezclar `/en/products` con `/en#company` dejaba a las
  // barras sin forma de saber qué se estaba leyendo, porque el fragmento no llega a
  // `usePathname()`. La regla es que toda sección es una ruta; esto lo vigila.
  await page.goto(`${BASE}/${LOCALE}/contact`, { waitUntil: 'networkidle' })
  const hashed = await page.evaluate(() =>
    [...document.querySelectorAll('header a, footer a, nav a')]
      .map((a) => a.getAttribute('href') ?? '')
      // `#main` es el salto al contenido, que es un salto dentro de la página y lo que
      // pide WCAG: ese sí puede llevar almohadilla.
      .filter((href) => href.includes('#') && href !== '#main'),
  )
  check(
    hashed.length === 0,
    hashed.length === 0
      ? 'ningún enlace de navegación usa una almohadilla'
      : `enlaces con # (deberían ser rutas): ${hashed.join(', ')}`,
  )

  // Y la consecuencia buscada: estando en una sección, la barra marca ESA y sólo esa.
  const current = await page.evaluate(() =>
    [...document.querySelectorAll('nav a[aria-current="page"]')].map(
      (a) => a.getAttribute('href') ?? '',
    ),
  )
  check(
    current.length > 0 && current.every((href) => href.endsWith('/contact')),
    `en /contact la navegación marca contacto y nada más (${current.join(', ') || 'nada marcado'})`,
  )

  // --- Enlaces absolutos, comprobado desde una página PROFUNDA ---------------------------
  // `href()` devolvía rutas relativas en el proyecto de referencia (`en/products`): desde
  // la portada funcionaban por casualidad y desde una ficha encadenaban →
  // /en/products/en/products → 404. Se comprueba desde el nivel más profundo del sitio.
  await page.goto(`${BASE}/${LOCALE}/products`, { waitUntil: 'networkidle' })
  const deep = await page.evaluate(
    () => document.querySelector('main a[href*="/products/"]')?.getAttribute('href') ?? null,
  )
  check(Boolean(deep), `hay fichas de producto enlazadas desde /products (${deep ?? 'ninguna'})`)
  if (deep) {
    await page.goto(`${BASE}${deep}`, { waitUntil: 'networkidle' })
    const relatives = await page.evaluate(() =>
      [...document.querySelectorAll('header a, footer a')]
        .map((a) => a.getAttribute('href') ?? '')
        .filter((href) => href && !/^(\/|#|https?:|mailto:|tel:)/.test(href)),
    )
    check(
      relatives.length === 0,
      relatives.length === 0
        ? 'los enlaces de cabecera y pie son absolutos'
        : `enlaces relativos (encadenarán y darán 404): ${relatives.join(', ')}`,
    )
  }

  // --- Áreas pulsables (WCAG 2.2: mínimo 24×24) ------------------------------------------
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('a, button')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        const before = getComputedStyle(element, '::before')
        // La utilidad `tap` agranda el área con un pseudo-elemento invisible.
        const grow =
          before.content !== 'none' && before.position === 'absolute'
            ? Math.abs(Number.parseFloat(before.top) || 0) * 2
            : 0
        return {
          text: element.textContent.trim().slice(0, 30),
          height: rect.height + grow,
          width: rect.width,
        }
      })
      // El enlace «saltar al contenido» mide 1×1 mientras está oculto y crece al recibir
      // foco: es el patrón correcto, no un objetivo pequeño.
      .filter((element) => element.height > 2 && element.width > 2 && element.height < 24),
  )
  check(
    small.length === 0,
    small.length === 0
      ? 'todas las áreas pulsables llegan a 24 px'
      : `áreas pulsables por debajo de 24 px: ${JSON.stringify(small.slice(0, 5))}`,
  )

  // --- El pie, con la barra de iconos delante ---------------------------------------------
  // La barra va fija sobre el contenido, así que el <body> se reserva su alto por debajo
  // (`--spacing-nav-mobile` en globals.css). Sin ese hueco, el copyright y los enlaces del
  // pie quedan detrás de la barra justo al final de la página, que es donde más se nota.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(400)
  const clearance = await page.evaluate(() => {
    const footer = document.querySelector('footer')
    const navBar = document.querySelector('nav[aria-label="Mobile"]')
    if (!footer || !navBar) return null
    return Math.round(navBar.getBoundingClientRect().top - footer.getBoundingClientRect().bottom)
  })
  check(
    clearance !== null && clearance >= -1,
    `el pie no queda debajo de la barra de iconos (${clearance} px de holgura)`,
  )

  // --- Indexación: sólo el dominio real puede aparecer en Google -------------------------
  // El proyecto de test despliega su rama como «production» de ese proyecto, así que sin
  // el criterio de `lib/site-env.ts` se anunciaría como indexable y competiría en Google
  // con el dominio real por las mismas búsquedas.
  if (!BASE.includes('swiftmet.in')) {
    const robotsMeta = await page.evaluate(
      () => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '(ninguna)',
    )
    check(
      robotsMeta.includes('noindex'),
      `este entorno no es indexable (meta robots: ${robotsMeta})`,
    )
  }

  check(errors.length === 0, `sin errores de consola${errors.length ? `: ${errors[0]}` : ''}`)

  await browser.close()

  const failed = results.filter((result) => !result.ok)
  console.log(
    `\n${results.length - failed.length}/${results.length} comprobaciones correctas` +
      (failed.length ? ` — ${failed.length} fallo(s)\n` : '\n'),
  )
  process.exit(failed.length ? 1 : 0)
}

await main()
