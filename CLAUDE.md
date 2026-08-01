# CLAUDE.md — SWIFTMET · Web de catálogo

> Contexto principal del proyecto. Este archivo se mantiene **actualizado en cada cambio relevante**
> (ver _Protocolo de mantenimiento_ al final). Es la fuente de verdad compartida por quien trabaje en
> el proyecto.

La memoria curada vive en `.claude/memory/` (índice en `.claude/memory/MEMORY.md`).

---

## 1. Qué es este proyecto

Web de catálogo para **Swiftmet Wire & Resin Pvt. Ltd.**, fabricante indio de hilo y varilla de
aluminio de alta pureza para **metalizado al vacío** (film BOPP y poliéster, papel, condensadores
electrónicos), con planta en Baghola (Palwal, Haryana) y domicilio social en Nueva Delhi.

Se construye como **competencia directa de [electrolead.co.in](https://www.electrolead.co.in/)**,
replicando el stack, la arquitectura y la metodología del proyecto `C:\Proyectos\sangilstudio`
(rama `test`).

**Estado actual (2026-07-30): DESPLEGADA.**
[swiftmet.vercel.app](https://swiftmet.vercel.app) (producción, rama `main`) y
[swiftmettest.vercel.app](https://swiftmettest.vercel.app) (test, rama `test`), con Sanity `3caofriy`
y los webhooks de revalidación funcionando —publicar se refleja en 9 segundos, sin desplegar—. IDs y
detalles en la memoria `despliegue`.

Lo único que queda es de **cliente, no de código**: confirmar email, teléfono, dominio y grados de
pureza (ver «Pendiente de confirmar con Swiftmet» en el README) e invitar a quien vaya a editar en
sanity.io/manage › Members.

## 2. La tesis competitiva (lo más importante de entender)

Electrolead resuelve el embalaje con media frase: bobinas «jointless» de 6,5 a 11 kg «as per
customer's request». Swiftmet tiene **catorce formatos medidos, de 2,75 a 14,5 kg**, con las cinco
cotas (D1 pestaña, D2 núcleo, D3 agujero, L1 anchura, L2 bobinado) que deciden si la bobina entra en
la metalizadora del cliente. Fuente: `Swiftmet_Plastic Spool List, as on 31-03-2022` (PDF del
cliente, gitignorado; transcrito a `scripts/migration/content-snapshot.json`).

**Toda la arquitectura de la web existe para enseñar esa tabla:** `/spools` es la página central,
la tabla se repite en la portada, y las cifras del hero se calculan del contenido para que el
argumento no envejezca. Cualquier cambio que entierre la tabla de bobinas va contra el objetivo del
proyecto.

## 3. Stack técnico

- **Frontend:** Next.js 16 (App Router, Turbopack) + TypeScript estricto + Tailwind CSS 4, con
  **zod** validando el contenido. **Estático**: 50 rutas prerrenderizadas; en servidor sólo
  `proxy.ts` (negocia idioma) y el webhook de revalidación.
- **Trilingüe:** `en` (por defecto), `hi`, `es`. Sólo el inglés es obligatorio en el CMS; lo que
  falte cae al inglés en `lib/content.ts`.
- **Contenido: Sanity**, editado en `/admin` dentro de la propia web. Tres tipos de documento:
  `product`, `spool` y el singleton `companyInfo`.
- **Despliegue: Vercel**, dos entornos (`main` → producción, `test` → test con `noindex`). Framework
  declarado en `vercel.json`.
- **Calidad:** `npm run check` (typecheck + ESLint + Prettier) y `npm run check:mobile` (33
  comprobaciones en Chrome real a 390×844, por idioma).
- **Fotografía:** Swiftmet no ha entregado ninguna. Los siete productos —**dos fotos cada uno**,
  portada y `second`— y la apertura de `/quality` llevan **archivo industrial de Pexels**
  (`lib/photos.ts`, procedencia en `public/photos/CREDITS.md`), que se retira solo en cuanto el panel
  tiene imagen. La segunda existe **por maquetación, para que no quede medio ancho vacío a la
  derecha**: rellena la media fila que sobra en `/products` —cuatro de las cinco familias tienen un
  solo producto— y el fondo de la columna de especificaciones en la ficha, donde crece hasta el fondo
  de la fila. Las dos, sólo de `md` para arriba. **Tres reglas de
  selección, aprendidas fallando:** nada de óxido —con material de Wikimedia, el hilo herrumbroso
  desmentía la ficha del 99,99 %, porque el aluminio no se oxida—, ninguna marca ajena legible (pasó con
  Prysmian y con «Reynolds Aluminum»), y `alt` que describen lo que se ve, nunca un grado ni una planta.
  Descartada la imagen generada por IA (regla 8). Las bobinas no llevan foto: se dibujan desde sus cotas.
  Si un día ninguna foto aguanta las tres reglas, `<Figure image={null}>` y vuelve el hueco.
- **Navegación:** en escritorio, la cabecera; en móvil (`< lg`), una **barra inferior fija de cinco
  iconos** —inicio, productos, bobinas, contacto y el menú completo— al estilo de bonsaiartesania.com.
  Los textos van **centrados en su sección** en toda la web; el eje central es la decisión de
  maquetación del sitio, no un detalle de una página.
- **Portada:** abre con un **montaje de vídeo en bucle de 24,3 s** —el proceso del aluminio a cámara
  rápida, de caliente a frío— detrás del titular y las cifras. Once planos de dos películas de
  **dominio público** (archive.org), tratados hasta la abstracción. Guion en
  `scripts/hero-montage-shots.mjs`, render con `npm run hero` (pide ffmpeg), salida en `public/hero/`.
  **No es la planta de Swiftmet** y nada en la web dice que lo sea.

Detalle y razonamiento en el **README.md**, que es extenso a propósito, y en `.claude/memory/`.

## 4. Reglas del proyecto

Heredadas de la metodología de `sangilstudio`:

1. **Contexto siempre a nivel de proyecto, nada global** — memorias, skills y reglas viven en
   `.claude/` de este repo. (`.claude/` está gitignorado: es local a la máquina.)
2. **Nunca subir secretos** — credenciales, keys, tokens y `.env` jamás se sincronizan con GitHub; al
   añadir uno nuevo se incluye en `.gitignore` **antes** de subir nada.
3. **Claude nunca hace commit ni push** — modifica ficheros y **propone un mensaje de commit CORTO y
   en inglés**; el usuario revisa y ejecuta. Sólo si lo pide explícitamente en el momento, Claude
   ejecuta el commit.
4. **Sincronizar antes de trabajar** — `fetch`/`pull` antes de empezar una modificación.
5. **Rama por tarea, y la rama se BORRA al mergear** — rama con nombre representativo sacada de
   `develop`; al terminar, `git merge --no-ff` en `develop`, push, y `git branch -d` + `git push
origin --delete`. **Nunca squash** en las promociones `develop` → `test` → `main`: el squash crea
   SHA nuevos, las ramas dejan de compartir historia y cada promoción reabre conflictos ya resueltos.
6. **Una tarea de interfaz no está hecha hasta verla en móvil** — `npm run check:mobile` antes de
   cerrarla.
7. **Los despliegues se validan con un preview real de Vercel**, nunca con `vercel build` en local:
   en Windows falla siempre por un bug del builder, no de la web.
8. **No inventar datos del cliente.** Es una regla propia de este proyecto y no del de referencia:
   Swiftmet es una empresa real y la web habla en su nombre. Lo que no consta se deja vacío (la web
   no pinta el campo) o se siembra con un marcador imposible de confundir con un dato real
   (`.example`, ceros) y se documenta en el README.

   Corolario para las imágenes: **una imagen ajena puede ambientar, nunca ilustrar una afirmación.**
   El montaje de la portada es material de archivo y va detrás del titular, abstraído y sin decir de
   quién es la fábrica: ambienta. Una foto en la ficha del 1199 estaría diciendo «este es nuestro hilo
   de 99,99 %», y ahí no vale material ajeno — por eso los productos siguen con el hueco tramado de
   `<Figure>`. Y en cualquier caso hay que mirar el encuadre: el material de archivo trae **marcas de
   otros fabricantes** dentro (ver `public/hero/CREDITS.md`).

### Modelo de ramas

Cada rama larga corresponde a **un entorno**, y sólo se sube de nivel lo que ya está validado en el
anterior:

| Rama      | Para qué                                                                | Vercel                                               |
| --------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| `develop` | Día a día: desarrollar, depurar, subir al repositorio sin publicar nada | **Nada.** No despliega                               |
| `test`    | Entorno de test                                                         | `swiftmettest` → swiftmettest.vercel.app (`noindex`) |
| `main`    | Producción                                                              | `swiftmet` → swiftmet.vercel.app                     |

Las ramas temporales nacen y **mueren** en `develop`. El sentido único es
`develop` → `test` → `main`, siempre con `git merge --no-ff`.

Que `develop` no toque Vercel no es una convención: está en `vercel.json`
(`git.deploymentEnabled: {"develop": false}`), versionado y aplicado igual a los dos proyectos.

## 5. Protocolo de mantenimiento

En **cada cambio relevante**, sin que se lo pidan:

1. Actualizar las memorias afectadas en `.claude/memory/` y su índice `MEMORY.md`.
2. Actualizar este `CLAUDE.md` si el cambio afecta a la estructura, el stack, el estado o las
   convenciones.
3. Actualizar el `README.md` si el cambio afecta a algo que deba saber quien despliegue o edite
   contenido — en particular la sección «Pendiente de confirmar con Swiftmet».

Regla de oro: **el contexto nunca debe quedar desactualizado respecto al estado real del proyecto.**

---

_Última actualización: 2026-08-01 — **una segunda foto por producto, para que no queden huecos a la
derecha.** Siete imágenes nuevas de Pexels, verticales (800×1000), que tapan dos huecos: la media fila que
sobraba en `/products` —es una rejilla de dos columnas y cuatro de las cinco familias tienen un solo
producto: varilla, bolsitas de té, soldadura y muelles— y el fondo de la columna de especificaciones de
cada ficha, donde la foto crece hasta el fondo de la fila (`stretch` en `<Figure>`, sin altura mínima: si
no sobra nada, no se pinta). Las dos sólo de `md` para arriba, porque en una columna no hay derecha que
cuadrar. Mismas tres reglas de selección de siempre. 21 fichas medidas en los tres idiomas sin un solo
hueco, y 33/33 en `check:mobile` por idioma._

_2026-08-01 — **nuevo modelo de ramas: una rama por entorno.** `develop` pasa a
ser el día a día (desarrollar, depurar y subir al repositorio sin desplegar nada, garantizado por
`git.deploymentEnabled` en `vercel.json`), `test` es el entorno de test y `main` producción; las ramas
temporales nacen y mueren en `develop` y el camino es `develop` → `test` → `main`. Sustituye al modelo
heredado de `sangilstudio`, donde el día a día era `test` y `develop` un escalón sin entorno._

_2026-07-30 — tres cambios el mismo día. (1) Textos centrados en toda la web y
navegación de móvil en una barra inferior de iconos, al estilo de bonsaiartesania.com. (2) La portada
abre con un montaje de vídeo en bucle de 24,3 s —el proceso del aluminio a cámara rápida, once planos de
dominio público tratados—, al estilo de la portada de sanity.io y reproducible con `npm run hero`. (3)
**Todos los huecos de imagen rellenos** con archivo industrial de Pexels, en segundo intento: el primer
set, con hilo de acero oxidado de Wikimedia, se retiró por desmentir las fichas —el aluminio no se
oxida—, y de ahí salieron las tres reglas de selección que ahora están escritas. El montaje y las fichas
no se contradicen: el vídeo **ambienta** detrás del titular y no afirma nada; una foto de ficha va con su
`alt` describiendo lo que se ve, nunca el grado ni la pureza (ver el corolario de la regla 8). Todo
verificado en los tres idiomas (33/33 en `check:mobile`) y a ojo en escritorio y móvil, con el titular
legible sobre los planos más claros del ciclo._
