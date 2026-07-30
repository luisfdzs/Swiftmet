# Fotografías de archivo: procedencia

Ninguna de las imágenes de esta carpeta es de Swiftmet. Son **fotografía industrial de archivo de
[Pexels](https://www.pexels.com)**, recortada a la proporción de cada hueco de la web, que sustituye
provisionalmente a las fotos que Swiftmet todavía no ha entregado (ver `lib/photos.ts` y la sección
«Pendiente de confirmar con Swiftmet» del README).

**Licencia Pexels.** Uso comercial permitido, sin coste y **sin atribución obligatoria**; se puede
modificar (aquí se recorta y se convierte a WebP). Lo que la licencia **no** permite: vender copias sin
alterar, dar a entender que las personas o marcas que aparecen respaldan a Swiftmet, e identificar a las
personas retratadas. Nada de eso se hace aquí. Esta tabla existe de todos modos: saber de dónde salió
cada imagen es lo que permite retirarla o sustituirla sin arqueología.

| Fichero | Original en Pexels | Título |
| --- | --- | --- |
| `quality-drawing-line.webp` | [30367510](https://www.pexels.com/photo/30367510/) | Large industrial cables inside manufacturing facility |
| `product-1080-metallising-wire.webp` | [36397792](https://www.pexels.com/photo/36397792/) | Stacks of industrial steel wire coils outdoors |
| `product-1090-metallising-wire.webp` | [36398151](https://www.pexels.com/photo/36398151/) | Close-up of metal wire texture |
| `product-1199-metallising-wire.webp` | [8113564](https://www.pexels.com/photo/8113564/) | Silver round metal objects on rack |
| `product-aluminium-rod.webp` | [36397790](https://www.pexels.com/photo/36397790/) | Industrial storage of steel wire coils outdoors |
| `product-tea-bag-wire.webp` | [29596327](https://www.pexels.com/photo/29596327/) | Spools of industrial cable outside building |
| `product-stainless-steel-mig-welding-wire.webp` | [36397788](https://www.pexels.com/photo/36397788/) | Industrial worker amongst coiled wire bundles |
| `product-high-carbon-spring-steel-wire.webp` | [36397791](https://www.pexels.com/photo/36397791/) | Industrial worker among stacked steel coils in warehouse |

## El criterio con el que se eligieron, que hay que respetar al cambiarlas

Un primer intento con material de Wikimedia se descartó **después de verlo en pantalla**: eran rollos de
hilo de acero oxidado, y sobre una ficha que dice «99,99 % de aluminio» el óxido no ambienta, desmiente.
De ahí salieron tres reglas:

1. **Nada de óxido.** Descalifica la foto, por buena que sea.
2. **Ninguna marca ni etiqueta legible de otro fabricante.** Ya ha pasado dos veces en este proyecto: un
   carrete con la etiqueta de Prysmian y un cartel de «Reynolds Aluminum» dentro del montaje de portada.
   Se revisa la imagen entera, no el primer golpe de vista.
3. **Los `alt` describen lo que se ve** —«rollos de varilla», «carretes de hilo fino»— y nunca un grado,
   una pureza ni una planta concretos.

Todas son fotografía de hilo y varilla **genéricos**, en su mayoría de acero: ambientan el oficio, no
acreditan el producto de Swiftmet. Las catorce bobinas no llevan foto de archivo: se dibujan a escala
desde sus cotas, que es el único dato firme de la web.

## Cuando lleguen las fotos de Swiftmet

No hay que tocar código: en cuanto un producto tiene imagen en el panel de Sanity, la suya gana y la de
archivo deja de usarse (ver `getProducts` en `lib/content.ts`). Para retirar una de aquí basta con borrar
su fichero `.webp`, su entrada en `lib/photos.ts` y su fila de esta tabla.
