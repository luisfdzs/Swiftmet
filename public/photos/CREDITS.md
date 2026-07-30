# Fotografías de archivo: autoría y licencia

Ninguna de las imágenes de esta carpeta es de Swiftmet. Son **fotografías genéricas de archivo con
licencia libre**, descargadas de Wikimedia Commons y recortadas a la proporción de cada hueco de la
web, que sustituyen provisionalmente a las fotos que Swiftmet todavía no ha entregado (ver
`lib/photos.ts` y la sección «Pendiente de confirmar con Swiftmet» del README).

**Todas están bajo licencia CC BY-SA**, que obliga a citar al autor y la licencia allí donde se usa
la obra. Por eso este fichero vive junto a las imágenes y **se publica con la web**: si algún día se
mueven o se sustituyen las fotos, este fichero se actualiza en el mismo cambio.

Ojo con lo que se afirma: son fotos de **hilo y varilla trefilados en general** —en su mayoría de
acero, no de aluminio de alta pureza—, así que los pies y los `alt` describen lo que se ve y nunca un
grado, una pureza ni una planta concretos. Es la línea que marca la regla 8 del `CLAUDE.md`: la foto
ambienta, el dato lo pone el listado del cliente.

| Fichero | Original | Autor | Licencia |
| --- | --- | --- | --- |
| `quality-drawing-line.webp` | [ECSC Financial report 1985 Marnaval tréfileuse.jpg](https://commons.wikimedia.org/wiki/File:ECSC_Financial_report_1985_Marnaval_tr%C3%A9fileuse.jpg) | European Coal and Steel Community | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `product-1080-metallising-wire.webp` | [Steel wire 04 ies.jpg](https://commons.wikimedia.org/wiki/File:Steel_wire_04_ies.jpg) | Frank Vincentz | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) |
| `product-1090-metallising-wire.webp` | [Steel wire 03 ies.jpg](https://commons.wikimedia.org/wiki/File:Steel_wire_03_ies.jpg) | Frank Vincentz | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) |
| `product-1199-metallising-wire.webp` | [Steel wire 05 ies.jpg](https://commons.wikimedia.org/wiki/File:Steel_wire_05_ies.jpg) | Frank Vincentz | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) |
| `product-aluminium-rod.webp` | [Steel wire 01 ies.jpg](https://commons.wikimedia.org/wiki/File:Steel_wire_01_ies.jpg) | Frank Vincentz | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) |
| `product-tea-bag-wire.webp` | [A photo of Jari spools.JPG](https://commons.wikimedia.org/wiki/File:A_photo_of_Jari_spools.JPG) | Thamizhpparithi Maari | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| `product-welding-wire.webp` | [Steel wire reel in Finland.jpg](https://commons.wikimedia.org/wiki/File:Steel_wire_reel_in_Finland.jpg) | Antti Leppänen | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| `product-spring-steel-wire.webp` | [Steel wire 02 ies.jpg](https://commons.wikimedia.org/wiki/File:Steel_wire_02_ies.jpg) | Frank Vincentz | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) |

Los ficheros son recortes centrados de los originales, reescalados y convertidos a WebP; no se ha
alterado su contenido de ninguna otra forma. CC BY-SA permite el recorte siempre que la obra derivada
mantenga la misma licencia, que es lo que este fichero declara.

## Cuando lleguen las fotos de Swiftmet

No hay que tocar código: en cuanto un producto tiene imagen en el panel de Sanity, la suya gana y la
de archivo deja de usarse (ver `getProducts` en `lib/content.ts`). Para retirar una de aquí basta con
borrar su fichero `.webp`, su entrada en `lib/photos.ts` y su fila de esta tabla.
