import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Necesario para la directiva `use cache` (ver lib/content.ts): es lo que permite
  // etiquetar los datos del CMS y que el webhook de publicación los invalide.
  cacheComponents: true,
  poweredByHeader: false,
  images: {
    // Las transformaciones las hace la CDN de Sanity, que ya tiene el original: ver
    // sanity/imageLoader.ts. Así no se consume cuota de optimización de Vercel y las
    // fotos que suba Swiftmet desde el panel se optimizan igual que las demás.
    loader: 'custom',
    loaderFile: './sanity/imageLoader.ts',
    deviceSizes: [420, 640, 828, 1200, 1600, 2048, 2560],
    // Next 16 restringe las calidades permitidas a una lista blanca (por defecto sólo
    // 75). Declaramos las dos que usamos: 82 para portadas y hero, 75 para el resto.
    // Una calidad no declarada se redondea a la más cercana, en silencio.
    qualities: [75, 82],
  },
  async redirects() {
    return [
      {
        // La competencia (electrolead.co.in) usa `/products`, `/quality`, `/about` y
        // `/contact-us` sin idioma. Quien llegue aquí tecleando esas rutas de memoria
        // —o siguiendo un enlace mal copiado— cae en el negociador de idioma del
        // proxy, así que no hace falta declararlas. Lo que sí se declara es el
        // singular, que es el error de tecleo más probable en un catálogo.
        source: '/:locale(en|hi|es)/product',
        destination: '/:locale/products',
        permanent: true,
      },
      {
        // Las bobinas son el activo diferencial del catálogo y su nombre en inglés
        // comercial oscila entre «spool» y «bobbin»: se acepta el segundo.
        source: '/:locale(en|hi|es)/bobbins',
        destination: '/:locale/spools',
        permanent: true,
      },
      {
        // `/about` es como se llama esta página en media web industrial —y en la de la
        // competencia—, pero aquí la ruta es `/company`, que es el rótulo del menú.
        //
        // Las redirecciones de `/company` y `/contact` que había aquí **se han borrado, y
        // borrarlas era obligatorio**: llevaban a `/:locale#company`, y desde que esas dos
        // secciones son páginas de verdad una redirección de `/en/company` a la portada
        // habría dejado la página nueva inalcanzable —la ruta existe, pero la redirección
        // se resuelve antes—.
        source: '/:locale(en|hi|es)/about',
        destination: '/:locale/company',
        permanent: true,
      },
      {
        // Mismo caso: «contact-us» es el nombre que usa la competencia y el que alguien
        // teclea de memoria.
        source: '/:locale(en|hi|es)/contact-us',
        destination: '/:locale/contact',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
