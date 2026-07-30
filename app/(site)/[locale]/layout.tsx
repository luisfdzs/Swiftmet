import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Devanagari } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { site } from '@/content/site'
import { isLocale, localeHtmlLang, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isIndexable } from '@/lib/site-env'
import '../../globals.css'

/**
 * Fuentes autoalojadas por Next: se sirven desde nuestro dominio, con `swap` y sin
 * petición a Google. Es la diferencia entre texto que aparece al instante y texto que
 * salta cuando la fuente llega.
 */
const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-sans',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

/**
 * Devanagari para el hindi. Se declara aquí y se encadena en `--font-sans` (ver
 * `globals.css`), de modo que el navegador coge el glifo de la familia que lo tenga: la
 * latina para el texto en inglés o español, esta para el hindi. Sin ella, `/hi` caería
 * en la fuente por defecto del sistema y el sitio se vería peor precisamente en el único
 * idioma que el cliente no puede revisar.
 */
const devanagari = IBM_Plex_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-devanagari',
})

export const viewport: Viewport = {
  themeColor: '#0b0e10',
}

/** Las tres versiones de idioma se generan en build; no hay renderizado dinámico. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * Sólo existen /en, /hi y /es: cualquier otro valor de `[locale]` es un 404. Esto se
 * declararía con `export const dynamicParams = false`, pero **Cache Components no lo
 * admite** (ver `cacheComponents` en next.config.ts). El `notFound()` del layout, más
 * abajo, cumple la misma función.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const t = getDictionary(locale)
  const title = `${site.name} · ${t.home.heroLead}`

  const descriptions: Record<Locale, string> = {
    en: 'Manufacturer of high-purity aluminium wire and rod for vacuum metallising of BOPP, polyester and paper film, and for electronic capacitors. Fourteen jointless plastic spool types from 2.75 to 14.5 kg. Palwal, Haryana, India.',
    hi: 'BOPP, पॉलिएस्टर और पेपर फ़िल्म के वैक्यूम मेटलाइज़िंग तथा इलेक्ट्रॉनिक कैपेसिटर के लिए उच्च शुद्धता वाले एल्युमिनियम तार और रॉड के निर्माता। 2.75 से 14.5 किग्रा तक चौदह बिना जोड़ वाले प्लास्टिक स्पूल प्रकार। पलवल, हरियाणा, भारत।',
    es: 'Fabricante de hilo y varilla de aluminio de alta pureza para metalizado al vacío de film BOPP, poliéster y papel, y para condensadores electrónicos. Catorce formatos de bobina de plástico sin empalmes, de 2,75 a 14,5 kg. Palwal, Haryana, India.',
  }
  const description = descriptions[locale]

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s · ${site.name}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [localeHtmlLang[l], `/${l}`])),
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: localeHtmlLang[locale],
      title,
      description,
      url: `/${locale}`,
    },
    // La imagen la aporta app/opengraph-image.jpg (convención de ficheros de Next),
    // generada por `npm run brand`. Aquí sólo se declara el formato de tarjeta.
    twitter: { card: 'summary_large_image', title, description },
    // Sólo la rama main se indexa; test y previews van con noindex. El criterio y el
    // motivo (test es "production" en su propio proyecto) en lib/site-env.ts.
    robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const typedLocale: Locale = locale
  const dictionary = getDictionary(typedLocale)

  return (
    <html
      lang={localeHtmlLang[typedLocale]}
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable} ${devanagari.variable}`}
    >
      <body className="flex min-h-svh flex-col">
        <Header locale={typedLocale} dictionary={dictionary} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={typedLocale} />
        {/* La barra de iconos de móvil va FUERA del <header> y al final del documento: la
            cabecera usa `backdrop-blur`, y un filtro convierte al elemento en bloque
            contenedor de sus descendientes `fixed` — dentro, el panel del menú calcularía
            su alto contra una barra de 80 px y se abriría vacío. Es un fallo real del
            proyecto de referencia y `npm run check:mobile` mide la altura para que no
            vuelva. */}
        <MobileNav locale={typedLocale} dictionary={dictionary} />
      </body>
    </html>
  )
}
