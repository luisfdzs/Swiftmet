# Swiftmet — Web de catálogo

Web de **Swiftmet Wire & Resin Pvt. Ltd.**, fabricante de hilo y varilla de aluminio de alta pureza
para metalizado al vacío, en Baghola (Palwal, Haryana, India).
Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, con **Sanity** como panel de administración,
pensada para desplegarse en Vercel.

Trilingüe: **inglés** (por defecto), **hindi** y **español**, en `/en`, `/hi` y `/es`.

🌐 **Producción:** [swiftmet.vercel.app](https://swiftmet.vercel.app) · **Test:**
[swiftmettest.vercel.app](https://swiftmettest.vercel.app) · **Panel:**
[swiftmet.vercel.app/admin](https://swiftmet.vercel.app/admin)

> ⚠️ **Antes de publicar, leer «Pendiente de confirmar con Swiftmet»** al final de este documento.
> Hay datos de contacto que son marcadores falsos a propósito y especificaciones de producto que están
> por verificar con producción.

## Contra quién compite

La competencia directa de referencia es [electrolead.co.in](https://www.electrolead.co.in/): mismo
producto (hilo de aluminio de alta pureza para metalizado de film BOPP/poliéster, papel y
condensadores), planta en Chakan (Pune), 3.500 MT/año, grados 1080 / 1090 / 1199, cinco páginas
(Home · Products · Quality · About Us · Contact Us).

**Su punto débil, y la tesis de esta web:** resuelven el embalaje con media frase — bobinas
«jointless» de 6,5 a 11 kg «as per customer's request». Swiftmet tiene **catorce formatos medidos, de
2,75 a 14,5 kg**, con las cinco cotas que deciden si la bobina entra en la metalizadora del cliente.
Ese listado (`Swiftmet_Plastic Spool List, as on 31-03-2022`) es el activo más valioso que tenía el
cliente sin publicar, y toda la arquitectura de la web está montada alrededor de enseñarlo:

- **`/spools` es la página central**, no un anexo de embalaje: tabla completa, leyenda de cotas y las
  catorce secciones dibujadas **a escala común** desde los propios números.
- La tabla **también va en la portada**, antes de que el visitante tenga que hacer clic.
- Las cifras del hero (pureza, número de formatos, rango de kilos) se **calculan del contenido**, no se
  escriben: si mañana entra una bobina de 18 kg en el panel, el argumento comercial se actualiza solo.

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script                   | Qué hace                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| `npm run dev`            | Servidor de desarrollo (Turbopack)                                 |
| `npm run build`          | Build de producción (prerrenderiza las 50 rutas)                   |
| `npm run check`          | `tsc --noEmit` + ESLint + Prettier — pasar esto antes de commitear |
| `npm run format`         | Aplica Prettier a todo el proyecto                                 |
| `npm run brand`          | Genera favicon, icono de iOS e imagen de compartir (OG)            |
| `npm run check:mobile`   | Revisión en Chrome real a 390×844 (ver más abajo)                  |
| `npm run migrate:build`  | Prepara el NDJSON de contenido inicial desde el listado maestro    |
| `npm run migrate:import` | Sube ese NDJSON a Sanity                                           |

> **`npm run build` falla sin las variables de Sanity.** Es intencionado (`sanity/env.ts` lanza un
> error explicando qué falta) y no un fallo: el contenido vive en el CMS, así que sin proyecto no hay
> web que construir. `npm run check` sí funciona en un clon limpio.

## Panel de administración (/admin)

El contenido **no está en el código**: vive en Sanity y se edita en **`/admin`**, dentro de la propia
web. Quien edita entra con su cuenta (invitada por email), no con una contraseña compartida: se puede
dar y quitar acceso persona a persona, cada cambio queda con autor y fecha, y hay historial para
deshacer. El panel está en inglés, que es el idioma de trabajo de la empresa.

Desde ahí se puede hacer **todo** sin tocar el repositorio:

- **Products** — crear, editar, borrar y **reordenar arrastrando**. Los marcados como destacados
  forman la portada (los cuatro primeros).
- **Plastic spools** — el programa de bobinas. Añadir una bobina actualiza la tabla, los dibujos a
  escala y las cifras de la portada, todo a la vez. Las cotas son **números**, no texto, precisamente
  porque con ellas se dibuja.
- **Company & contact** — presentación de la empresa, puntos de control de calidad, certificaciones,
  plantas y contactos.
- Los tres idiomas se editan **uno al lado del otro** en el mismo formulario. Sólo el inglés es
  obligatorio: lo que falte se lee en inglés en la web (ver `lib/content.ts`). Es deliberado — exigir
  tres traducciones para poder publicar un producto acaba en traducciones con prisa o en productos sin
  publicar.

Al pulsar **Publish**, Sanity avisa a `/api/revalidate` y la web se actualiza en segundos, **sin
desplegar nada**. Sigue siendo estática y servida desde el CDN.

Lo que **no** se puede tocar desde el panel, a propósito: el diseño. Las familias de producto son una
lista cerrada (la web tiene traducción preparada para cada valor) y las descripciones son párrafos, no
texto con formato libre, para que nadie rompa la estética con un titular gigante.

### Estado del panel: ya montado

Hecho el 2026-07-30, no hay que repetirlo:

- **Proyecto de Sanity `3caofriy`**, dataset `production`
  ([manage](https://www.sanity.io/manage/project/3caofriy)).
- **22 documentos importados**: 14 bobinas, 7 referencias de catálogo y la ficha de empresa.
- **Variables** puestas en los dos proyectos de Vercel, en los tres entornos.
- **Dos webhooks** de revalidación (`production` y `test`), con `rule.on = create/update/delete` y el
  secreto compartido. Verificado de punta a punta: una publicación se ve en la web **en 9 segundos**,
  sin desplegar.

Sólo queda una cosa, que la tiene que hacer una persona: **invitar a quien vaya a editar** en
sanity.io/manage › Members, con rol **Administrator**.

Para reproducirlo en otro entorno desde cero: `npx sanity login`, `npx sanity projects create`,
rellenar `.env.local` a partir de `.env.example`, `npm run migrate:build && npm run migrate:import`,
`vercel env add` y crear los webhooks. **Ojo con el webhook:** si se crea por API hay que enviar
`type: "document"` y luego un PATCH con `rule: {on: ["create","update","delete"]}` — el POST no acepta
`rule`, y sin él el webhook se crea «activo» pero **no se dispara nunca**. Cuesta un rato darse cuenta
porque el registro de entregas simplemente sale vacío.

## Arquitectura

```
app/
  (site)/[locale]/       ← todas las páginas viven bajo idioma (/en, /hi, /es)
    layout.tsx           · fuentes (latina + devanagari), header/footer, metadata y hreflang
    page.tsx             · portada: cifras → productos → TABLA DE BOBINAS → empresa → contacto
    products/            · índice agrupado por familia y ficha de producto [slug]
    spools/              · el programa de bobinas: tabla + leyenda + secciones a escala
    quality/             · puntos de control y certificaciones
  (studio)/admin/        ← PANEL de administración (Sanity), con su propio layout raíz
  api/revalidate/        ← webhook: al publicar en el panel, la web se regenera
  globals.css            ← SISTEMA DE DISEÑO: todos los tokens, y sólo aquí
  sitemap.ts robots.ts   ← generados del contenido real
components/
  layout/                · Header, MobileNav (barra inferior de iconos), NavIcons, Footer, Wordmark
  sections/              · Hero, HeroMontage (el vídeo de portada), ProductCard, SpoolTable,
                           SpoolDiagram, CompanySection, ContactSection
  ui/                    · Figure (toda imagen pasa por aquí), Media, SpecList, Reveal
lib/
  content.ts             ← única puerta de acceso al contenido
  format.ts              ← formato de cifras técnicas por idioma (2.75 vs 2,75)
  i18n/ cn.ts site-env.ts
content/site.ts          ← sólo constantes técnicas; lo editorial vive en el panel
sanity/                  ← esquemas del panel, consultas GROQ, cliente, cargador de imágenes
scripts/
  migration/             · content-snapshot.json (volcado del listado maestro, con procedencia)
  build-sanity-import.mjs
  generate-brand-assets.mjs  ← favicon + OG, dibujados en SVG (no hay logotipo de Swiftmet)
  hero-montage-shots.mjs     ← GUION del montaje de portada: once planos, con su encuadre
  build-hero-montage.mjs     ← lo corta, lo trata y lo codifica (`npm run hero`, pide ffmpeg)
  check-mobile.mjs
proxy.ts                 ← negocia el idioma y redirige / → /en | /hi | /es
                           (en Next 16 `middleware.ts` se llama `proxy.ts`)
```

Seis decisiones que conviene entender antes de tocar código:

1. **Ninguna página consulta Sanity directamente**: todas pasan por `lib/content.ts`. Ahí viven también
   las dos reglas que de otro modo se repetirían por todas partes: el relleno de traducciones que
   faltan y qué hacer con un documento incompleto.
2. **Un documento a medias no tumba la web.** `lib/content.ts` valida cada producto y cada bobina por
   separado y descarta el que no cumple, avisando por consola. La excepción es «Company & contact»,
   que afecta al pie de todas las páginas: ahí sí se lanza error.
3. **Las cotas de las bobinas se validan entre sí**, no sólo una a una: un núcleo mayor que la pestaña
   o un bobinado más ancho que la bobina no son datos raros, son imposibles, y dibujarían una sección
   del revés sin que nada fallara. `npm run migrate:build` hace la misma comprobación antes de
   importar.
4. **Todo es estático.** Las 50 rutas se prerrenderizan en build. Lo único que corre en el servidor es
   `proxy.ts`, que negocia el idioma, y el webhook de revalidación.
5. **Los tokens de diseño están sólo en `app/globals.css`.** Si un color o un espaciado no está en ese
   `@theme`, no se usa. Ahí está también la corrección de interlínea para el devanagari, por el mismo
   motivo: es una decisión del sistema, no de un titular concreto.
6. **Las cifras van en monoespaciada con `tabular-nums`** (utilidad `figure-num`). Es lo que hace que
   una tabla de catorce bobinas se lea como una tabla y no como un párrafo con números dentro.

### Idiomas

Inglés por defecto —es el idioma comercial del sector, y el comprador de una bobina de hilo de
metalizado compra en inglés esté en Pune, en Estambul o en Barcelona—, más hindi para el mercado
interior y español para exportación. Los segmentos de ruta son neutros (`/products`, `/spools`) y se
centralizan en `lib/i18n/routes.ts`; si se quieren slugs localizados (`/es/bobinas`) se resuelve ahí,
sin tocar páginas. Los textos de interfaz están en `lib/i18n/dictionaries.ts`: si añades una clave y no
la traduces, falla el typecheck.

El hindi carga **IBM Plex Sans Devanagari** y una interlínea propia: los signos vocálicos van por
encima y por debajo de la línea base, y con la interlínea apretada de los titulares latinos se
pisaban. Se vio en `/hi` antes de escribir la regla.

## Fotografía: no hay, y se ve que no hay

**La web está construida sin ninguna fotografía.** No hay imágenes de la planta de Baghola, ni del
hilo, ni de las bobinas. La decisión de diseño es **no disimularlo**:

- Los huecos de foto se pintan tramados, con el rótulo de **qué foto falta** y quién la aporta
  (`components/ui/Figure.tsx`). Así la propia web es la lista de la compra.
- En cuanto alguien suba la imagen al panel, el hueco desaparece solo. **No hay nada que borrar en el
  código.**
- Lo que sí hay es **dibujo técnico de verdad**: las secciones de bobina se generan de las cotas, a
  escala común. No es un placeholder — es información que la competencia no publica.
- El favicon y la imagen de compartir se dibujan en SVG desde `npm run brand`, sin depender de ningún
  fichero de imagen que no tenemos.

Un placeholder que imita una foto (un gris liso, una foto de stock de «industria») consigue que la web
parezca terminada y que nadie se acuerde de pedir las fotos. Seis meses después sigue ahí y ya nadie
sabe si es intencionado.

**Fotos que hacen falta, por orden de valor:** la línea de trefilado con el calibre en proceso o la
máquina de tracción (es la prueba visual de toda la página de calidad), un juego de bobinas reales, la
nave, y una foto de producto por referencia de catálogo.

### Por qué no hay foto de archivo gratuita, y qué se hizo en su lugar

Se intentó rellenar los huecos con fotografía libre y **se descartó después de verlo en pantalla**.
Queda escrito aquí porque es la clase de decisión que, sin registro, alguien repite dentro de un año:

1. **Wikimedia Commons no tiene este material.** Buscado por término y por categoría: de hilo de
   aluminio para metalizado, nada; de trefilado en general, grabados del XIX, libros de 1919, archivo
   histórico americano y **una serie de rollos de hilo de acero de un patio** (`Steel wire 01–05`, del
   mismo autor y del mismo montón). Las categorías `Wire drawing`, `Wire mills` y `Wire rod` están
   vacías o casi.
2. **Con ese material, la foto desmiente a la ficha.** Sobre «1199 · 99,99 % de aluminio» salía hilo
   **con óxido** —el aluminio no se oxida—, la varilla «de aluminio» eran rollos de acero en un
   descampado, el hilo para bolsitas de té era hilo dorado de _zari_ de un producto textil, y el
   carrete de welding wire llevaba legible la **etiqueta de Prysmian**, otro fabricante. La apertura de
   `/quality` era una foto de 1985 de la Comunidad Europea del Carbón y del Acero.
3. **La regla que queda:** el archivo puede ambientar, nunca ilustrar una afirmación. Ante un comprador
   que decide por D1, D2, D3, L1 y L2, una foto que contradice el dato cuesta más que un hueco honesto.
4. **Las fotos de internet que sí encajarían no se pueden usar:** están en las webs de la competencia
   —Electrolead incluida—, en catálogos de fabricantes y en agencias de pago. Son material ajeno con
   derechos.
5. **Descartada también la imagen generada por IA.** Inventaría una planta y un producto que nadie ha
   visto, que es justo lo que prohíbe la regla 8 del `CLAUDE.md`; un comprador técnico detecta una
   bobina imposible; y no deja titularidad ni licencia claras.

**Plan acordado con el cliente del proyecto (2026-07-30): fotografía de stock DE PAGO** —Adobe Stock,
iStock o Getty, que sí tienen bobinas de aluminio y líneas de trefilado modernas— como puente hasta que
Swiftmet entregue las suyas. Ambas entran igual, **subiéndolas al panel de Sanity**: no hay que tocar
código ni añadir ficheros al repo, y la comprada se sustituye por la real el día que llegue. Al
comprarlas, guardar la licencia junto a la factura: el stock de pago no exige atribución en la web,
pero sí acreditar la compra si alguien la reclama.

### La excepción que confirma la regla: el montaje de la portada

Todo lo anterior es sobre **las fichas**. La portada, en cambio, **sí** abre con imagen en movimiento:
veinticuatro segundos del proceso del aluminio a cámara rápida —horno, colada, laminación, bobina—, en
bucle detrás del titular. No contradice nada, porque aplica la regla del punto 3 por su otro lado:

- **Ambienta, no ilustra.** Va detrás del texto, tratada hasta la abstracción y sin un solo plano general
  reconocible. No afirma nada. Los huecos tramados de `<Figure>` están donde una foto tendría que
  **demostrar** algo —este calibre, esta bobina, esta máquina— y ahí no vale material ajeno.
- **No es la planta de Swiftmet, y no lo insinúa.** Son planos de dos películas de **dominio público** de
  1956 sobre la producción de aluminio (`Aluminum on the March`, en archive.org). El nombre accesible del
  vídeo dice literalmente _archive footage of aluminium production_. Origen completo de cada plano en
  `public/hero/CREDITS.md`.
- **Se rehace con una orden.** `npm run hero` vuelve a cortar, tratar y codificar los cuatro vídeos y los
  dos pósters desde el guion de `scripts/hero-montage-shots.mjs`. Requiere **ffmpeg** (por `FFMPEG=`, por
  `ffmpeg-static` o en el PATH); no es dependencia del proyecto porque sólo lo necesita quien rehaga el
  montaje. Los másteres (~170 MB) no se versionan: el script los baja si faltan.
- **Se retira sustituyendo ficheros.** Cuando llegue vídeo o fotografía propia de Swiftmet, se reemplaza
  lo que hay en `public/hero/` y no se toca una línea de componente.

Dos cuidados que ya han hecho falta, y que hay que repetir al tocar el guion:

1. **El material tiene marcas de terceros dentro.** El primer montaje arrastró, sin buscarlo, un cartel a
   pantalla completa que decía «SHIP TO REYNOLDS ALUMINUM». Al cambiar cualquier `at`, hay que revisar la
   ventana entera que consume el plano (`out × speed` segundos), no el fotograma de entrada.
2. **El texto manda sobre el vídeo.** El degradado de `<HeroMontage>` está calibrado para que el titular y
   las cifras se lean sobre los planos más claros del ciclo. Si se aclara, hay que volver a mirarlo en el
   segundo 8, que es el plano más brillante.

Quien prefiera no ver animaciones no la descarga: con `prefers-reduced-motion: reduce`, o con ahorro de
datos, o en red 2G, la portada se queda en el póster —un fotograma del propio montaje— y no se piden los
dos megas y medio de vídeo.

## Despliegue

En **Vercel** (cuenta `luis-fernandez`), con dos proyectos que se publican automáticamente al hacer
_push_:

- **Producción:** proyecto `swiftmet`, rama `main` → [swiftmet.vercel.app](https://swiftmet.vercel.app).
- **Test:** proyecto `swiftmettest`, rama `test` →
  [swiftmettest.vercel.app](https://swiftmettest.vercel.app). Emite `noindex` y `robots: disallow`
  automáticamente para no competir en Google con el dominio real.

> La rama de producción de cada proyecto (`main` y `test`) **sólo se puede fijar desde el panel de
> Vercel**: Settings › Environments › Production › Branch Tracking. La API pública no acepta
> `productionBranch` en ningún endpoint ni versión — se probaron `PATCH /v9|v10|v11/projects`, el
> `POST .../link` y varios más, y todos lo rechazan o lo ignoran en silencio. Si se crea un tercer
> entorno, es el único paso manual.

El framework se declara en **`vercel.json`** (`"framework": "nextjs"`), que se versiona y se aplica
igual a los dos entornos, así que no hace falta tocar el panel de Vercel.

Sólo la rama `main` se indexa, y el criterio está en `lib/site-env.ts`: **no** puede basarse en
`VERCEL_ENV`, porque el proyecto de test despliega su rama como su propia «production» y allí
`VERCEL_ENV === 'production'` también. Aquí importa más que en un portfolio: toda la web está pensada
para posicionar por «high purity aluminium wire manufacturer», y dos copias compitiendo se estorban.

> ⚠️ **`vercel build` no funciona en Windows** con esta arquitectura (falla con
> `Unable to find lambda for route: /hi/...`). Es un bug del builder `@vercel/next`: construye las
> claves de las funciones con `path.join` (que en Windows da `[locale]products`) y luego las busca con
> `path.posix.join` (`/[locale]/products`). En los servidores de Vercel (Linux) coinciden. Para validar
> en local usa `npm run build`; para validar el despliegue, un preview real en Vercel.

## Antes de dar por cerrada una tarea

1. `npm run check` — typecheck, ESLint y Prettier.
2. `npm run check:mobile` con el servidor levantado. **Obligatorio si has tocado interfaz.** No es un
   test unitario: es la lista de cosas que ya se han roto. Comprueba 33 cosas, entre ellas tres propias
   de esta web:
   - que **la tabla de bobinas se desplace ella y no la página** — siete columnas de datos en 390 px es
     el caso que lo provoca, y es el contenido más importante del sitio;
   - que todo objetivo pulsable llegue a 24 px (WCAG 2.2). Encontró el enlace del logotipo, de 16 px:
     invisible mirando la pantalla y el enlace más usado de la cabecera;
   - que **la barra de iconos de móvil se vea y no tape el pie** — va fija abajo y sobre el contenido,
     así que el documento tiene que reservarle su alto por debajo del pie (`--spacing-nav-mobile`).

   Se ejecuta por idioma: `LOCALE=hi npm run check:mobile`. Cuando encuentres un fallo nuevo, añade su
   comprobación al script.

## Pendiente de confirmar con Swiftmet

Esta web se ha construido con **una fuente firme** (el listado de bobinas en PDF) y con **fuentes
públicas** para el resto: registro mercantil indio y fichas de directorios B2B. Lo que sigue está
señalado también dentro de `scripts/migration/content-snapshot.json`, con la procedencia de cada dato.

**Bloqueante — no se puede publicar así:**

- **Email y teléfono.** Los sembrados son **marcadores falsos a propósito**: `sales@swiftmet.example`
  (el TLD `.example` está reservado y no resuelve) y `+91 000 000 0000`. `npm run migrate:build` los
  grita en cada ejecución. Se corrigen desde el panel, sin reimportar.
- **Dominio.** `content/site.ts` propone `swiftmet.in`; no consta que Swiftmet tenga dominio propio
  publicado. Confirmarlo antes de apuntar el DNS: cambiarlo después obliga a regenerar el sitemap y los
  alternates de hreflang.

**Por verificar con producción:**

- **Grados de pureza.** 1080, 1090 y 1199 son designaciones estándar de la Aluminium Association para
  hilo de metalizado, y los rangos de tracción (16–18 / 15–16 / 13–14 kg/mm²) son los habituales del
  sector, pero **no consta públicamente que Swiftmet fabrique los tres**. Cotejar antes de publicar.
- **Capacidad instalada.** El campo existe y está vacío: la web simplemente no muestra la cifra. Mejor
  un número ausente que uno inventado. La competencia publica 3.500 MT/año.
- **Certificaciones.** Lista vacía; la página de calidad dice «pendientes de confirmar» en lugar de
  callar. Reclamar una norma que no se tiene es la forma más rápida de perder un cliente.
- **Hilo de soldadura y acero para muelles.** Constan en los perfiles B2B de Swiftmet, así que están en
  el catálogo, pero sus fichas llevan texto marcado como provisional: faltan grados, diámetros y
  tolerancias.

**Por revisar por un hablante nativo:**

- **Todo el hindi.** Los textos de interfaz (`lib/i18n/dictionaries.ts`) y los resúmenes y aplicaciones
  del catálogo están traducidos, pero **son un borrador**. Las descripciones largas de producto se
  dejaron sin traducir a propósito y la web las muestra en inglés: mejor inglés correcto que hindi
  técnico sin revisar.

**Decisiones abiertas:**

- **Fotografía.** Hoy no hay ninguna y los huecos se ven a propósito (ver «Fotografía» más arriba, que
  explica por qué se descartó el archivo gratuito y la imagen generada). El puente acordado es **stock
  de pago**, subido al panel; el destino son las fotos de Swiftmet, que hay que pedirle: planta, hilo y
  un juego de bobinas.
- **Logotipo.** No hay logotipo vectorial de Swiftmet. El de la web es provisional: símbolo geométrico
  (la sección de una bobina, la misma vista que dibuja `SpoolDiagram`) + el nombre en la tipografía del
  sistema. Cuando llegue el real, se sustituye el `<svg>` de `components/layout/Wordmark.tsx` y el de
  `scripts/generate-brand-assets.mjs`, y no hay que tocar nada más.
- **Formulario de contacto.** Hoy hay contacto directo (email con asunto prerrellenado, teléfono). Un
  formulario implica backend de envío, antispam y política de privacidad + aviso legal. Para una
  consulta B2B —«necesito 1,60 mm en 99,90 % sobre SW320»— el email es mejor, porque el comprador se
  queda con copia de lo que pidió.
- **Fichas técnicas descargables.** La competencia ofrece MSDS, hoja de especificaciones y certificado
  de contacto alimentario en PDF. Es un hueco competitivo real y no está cubierto: haría falta que
  Swiftmet aporte los documentos.
- **El vídeo de la portada es material de archivo ajeno.** Funciona y es de dominio público, pero son
  planos de 1956 y quien abra la web verá una fábrica que no es la de Baghola (ver «La excepción: el
  montaje de la portada»). Lo ideal es sustituirlo por **vídeo propio de la planta**: cuarenta segundos
  de móvil bien iluminados de la línea de trefilado y de la bobinadora dan de sobra para once planos, y
  entonces el montaje pasa a decir la verdad además de quedar bien. Si no hay vídeo propio, el mismo
  guion sirve para metraje de stock de pago sin tocar código: se cambian los ficheros de `.hero-src/` y
  los `at` del guion.
