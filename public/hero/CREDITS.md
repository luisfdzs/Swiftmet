# Origen del montaje de portada

Los vídeos y los pósters de esta carpeta **no son material de Swiftmet**. Son planos cortados
de dos películas industriales de **dominio público** sobre la producción de aluminio, tratados
hasta la abstracción (ver `scripts/build-hero-montage.mjs`).

Esto está escrito por dos razones, y ninguna es legal:

1. **Para que nadie afirme lo que la imagen no dice.** La web habla en nombre de una empresa
   real (regla 8 del `CLAUDE.md`: no se inventan datos del cliente). Un montaje industrial
   detrás del titular invita a leerse como «la planta de Baghola», y no lo es. Por eso el
   nombre accesible del vídeo dice _archive footage of aluminium production_ y nunca «nuestra
   planta», y por eso el tratamiento evita cualquier plano general reconocible.
2. **Para poder sustituirlo sin repetir la búsqueda.** Encontrar material libre y utilizable
   de esta industria costó bastante; saber exactamente de dónde salió cada plano es lo que
   permite volver a la fuente y recortar otro.

## Fuentes

| Película                                  | Identificador en archive.org | Uso                                                     |
| ----------------------------------------- | ---------------------------- | ------------------------------------------------------- |
| _Aluminum on the March_, parte I (1956)   | `Aluminum1956`               | Diez de los once planos: horno, colada, laminación, bobinado. |
| _Aluminum on the March_, parte II (1956)  | `Aluminum1956_2`             | Un plano: el tren de cilindros pulidos.                 |

Ambas figuran en archive.org marcadas como dominio público
(`http://creativecommons.org/licenses/publicdomain/`), así que no hay obligación de
atribución ni restricción de uso comercial. Se citan igualmente.

Descarga directa (lo hace el script solo si faltan los másteres):

- https://archive.org/download/Aluminum1956/Aluminum1956.mp4
- https://archive.org/download/Aluminum1956_2/Aluminum1956_2.mp4

## Un aviso para quien toque el guion

El material es publicidad industrial estadounidense de 1956 y **tiene rótulos y marcas de
otras empresas dentro**. El primer montaje incluía, sin que nadie lo buscara, un cartel a
pantalla completa que decía «SHIP TO REYNOLDS ALUMINUM» — la marca de un tercero en la
portada de Swiftmet. Estaba a doce segundos del punto de entrada de un plano que parecía
limpio.

Al cambiar cualquier `at` de `scripts/hero-montage-shots.mjs`, hay que revisar **la ventana
completa que consume el plano** (`out × speed` segundos desde `at`), no sólo el fotograma de
entrada.

## Qué hay en esta carpeta

| Fichero                        | Qué es                                                  |
| ------------------------------ | ------------------------------------------------------- |
| `montage-wide.webm` / `.mp4`   | 1600×900, escritorio y tableta.                         |
| `montage-tall.webm` / `.mp4`   | 720×1280, móvil en vertical.                            |
| `poster-wide.jpg`              | Primer fotograma del montaje apaisado.                  |
| `poster-tall.jpg`              | Primer fotograma del montaje vertical.                  |

Todo se regenera con `npm run hero` (requiere ffmpeg). Cuando Swiftmet entregue vídeo propio,
se sustituyen estos ficheros y no hay que tocar ni una línea de componente.
