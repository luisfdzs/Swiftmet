/**
 * Constantes técnicas del sitio, las únicas que NO se editan desde el panel.
 *
 * Todo lo editorial —presentación de la empresa, productos, bobinas, calidad,
 * direcciones y contactos— vive en el panel de administración, para que Swiftmet
 * pueda cambiarlo sin pasar por desarrollo. Aquí queda sólo lo que define el
 * despliegue: el nombre de la marca y el dominio canónico, que se usan para las URLs
 * absolutas, el sitemap y los metadatos.
 */
export const site = {
  name: 'Swiftmet',
  /** Razón social completa; se usa en el pie y en los datos estructurados. */
  legalName: 'Swiftmet Wire & Resin Pvt. Ltd.',
  /**
   * Dominio canónico de producción.
   *
   * ⚠️ PENDIENTE: no consta que Swiftmet tenga dominio propio publicado (su presencia
   * en internet son perfiles de directorios B2B). Este valor es una propuesta y hay
   * que confirmarlo antes de apuntar el DNS: cambiarlo después obliga a regenerar el
   * sitemap y a rehacer los alternates de hreflang. Ver README.
   */
  url: 'https://swiftmet.in',
} as const
