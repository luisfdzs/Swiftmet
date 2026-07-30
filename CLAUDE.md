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
- **Calidad:** `npm run check` (typecheck + ESLint + Prettier) y `npm run check:mobile` (30
  comprobaciones en Chrome real a 390×844, por idioma).

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
   `test`; al terminar, `git merge --no-ff` en `test`, push, y `git branch -d` + `git push origin
--delete`. **Nunca squash** en las promociones `test` → `develop` → `main`: el squash crea SHA
   nuevos, las ramas dejan de compartir historia y cada promoción reabre conflictos ya resueltos.
6. **Una tarea de interfaz no está hecha hasta verla en móvil** — `npm run check:mobile` antes de
   cerrarla.
7. **Los despliegues se validan con un preview real de Vercel**, nunca con `vercel build` en local:
   en Windows falla siempre por un bug del builder, no de la web.
8. **No inventar datos del cliente.** Es una regla propia de este proyecto y no del de referencia:
   Swiftmet es una empresa real y la web habla en su nombre. Lo que no consta se deja vacío (la web
   no pinta el campo) o se siembra con un marcador imposible de confundir con un dato real
   (`.example`, ceros) y se documenta en el README.

### Modelo de ramas

`main` (producción) · `develop` (lo que va a producción) · `test` (día a día) · ramas temporales que
nacen y **mueren** en `test`.

## 5. Protocolo de mantenimiento

En **cada cambio relevante**, sin que se lo pidan:

1. Actualizar las memorias afectadas en `.claude/memory/` y su índice `MEMORY.md`.
2. Actualizar este `CLAUDE.md` si el cambio afecta a la estructura, el stack, el estado o las
   convenciones.
3. Actualizar el `README.md` si el cambio afecta a algo que deba saber quien despliegue o edite
   contenido — en particular la sección «Pendiente de confirmar con Swiftmet».

Regla de oro: **el contexto nunca debe quedar desactualizado respecto al estado real del proyecto.**

---

_Última actualización: 2026-07-30 — primera versión completa de la web: trilingüe, con Sanity, el
programa de catorce bobinas como pieza central y verificada en los tres idiomas (30/30 en
`check:mobile`, build de 50 rutas)._
