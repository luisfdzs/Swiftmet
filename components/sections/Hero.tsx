import Link from 'next/link'
import { HeroMontage } from '@/components/sections/HeroMontage'
import type { SpoolEntry } from '@/lib/content'
import { formatRange } from '@/lib/format'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * PORTADA: UN MONTAJE EN BUCLE DETRÁS DE LAS CIFRAS.
 *
 * Abre con veinticuatro segundos del proceso del aluminio a cámara rápida —horno, colada,
 * laminación, bobina—, en bucle. El montaje lo pone `<HeroMontage>`, y de dónde sale y cómo
 * está tratado se explica allí y en `scripts/build-hero-montage.mjs`.
 *
 * **Esto sustituye al hero limpio que había antes**, y conviene saber qué argumento tenía.
 * Era: no hay fotografía de Swiftmet y, aunque la hubiera, una foto de nave industrial no
 * vende hilo de aluminio porque todas las naves se parecen. El argumento sigue en pie **para
 * una foto fija de una nave**, y por eso el montaje no es eso: es material de archivo tratado
 * hasta la abstracción, sin un plano general reconocible, ordenado de caliente a frío para
 * que se lea como un proceso en tres segundos. No enseña una fábrica; enseña de qué va esto.
 *
 * Lo que **no** ha cambiado es quién manda en la portada. Lo que distingue a Swiftmet de su
 * competencia directa son las cifras, y siguen donde estaban: en grande y sacadas del
 * contenido real, no de un texto fijo. El montaje va detrás, con un degradado que lo apaga
 * justo donde empieza el texto (ver `<HeroMontage>`). Si alguna vez hay que elegir entre que
 * el vídeo luzca y que las cifras se lean, ganan las cifras.
 *
 * `formatRange` calcula el rango de pesos de las bobinas publicadas en el panel. Si
 * mañana alguien añade una bobina de 18 kg, el argumento de la portada se actualiza
 * solo; escrito a mano, se habría quedado obsoleto en la primera ampliación de catálogo.
 * Y si todavía no hay bobinas, la cifra no se pinta en lugar de mostrar «null – null».
 *
 * `data-hero` es lo que hace que la cabecera se ponga en color papel mientras está
 * arriba (ver `globals.css`): el hero no le avisa, el CSS lo detecta con `:has()`.
 *
 * **Aquí hubo una marca de agua y se quitó.** El hero llevaba la sección de la bobina
 * mayor dibujada al fondo, muy tenue, como ornamento. En pantalla no funcionaba: a baja
 * opacidad sólo se veían las dos pestañas —que van rellenas— y el núcleo, que son líneas
 * finas, desaparecía. El resultado eran dos rectángulos grises pegados al borde derecho,
 * que no se leen como una bobina sino como un fallo de maquetación. Subir la opacidad lo
 * hacía competir con el titular, y agrandarlo no arreglaba el trazo fino.
 *
 * Se probaron las dos variantes y se decidió por el hero limpio: el dibujo de la bobina
 * tiene su sitio en `/spools`, a tamaño y con su cota al lado, donde informa. En el hero
 * sólo decoraba, y encima mal.
 */
export function Hero({
  locale,
  spools,
  purity,
}: {
  locale: Locale
  spools: SpoolEntry[]
  /** Pureza máxima publicada, ya formateada. `null` si no consta. */
  purity: string | null
}) {
  const t = getDictionary(locale)

  const weightRange = formatRange(
    spools.map((spool) => spool.netWeight),
    locale,
    'kg',
  )

  const figures = [
    purity ? { label: t.home.purityLabel, value: purity } : null,
    spools.length > 0 ? { label: t.home.spoolTypesLabel, value: String(spools.length) } : null,
    weightRange ? { label: t.home.spoolRangeLabel, value: weightRange } : null,
    { label: t.home.jointsLabel, value: t.home.jointsValue },
  ].filter((figure): figure is { label: string; value: string } => figure !== null)

  return (
    <section
      data-hero
      className="relative -mt-20 flex min-h-[100svh] flex-col justify-end overflow-hidden bg-inverse pt-32 text-paper md:-mt-24"
    >
      <HeroMontage label={t.home.heroMontageLabel} />

      <div className="page-gutter relative flex flex-col items-center gap-8 pb-12 text-center md:pb-16">
        <p className="eyebrow text-paper/60">{t.home.heroLead}</p>
        <h1 className="text-display max-w-4xl text-balance">{t.home.heroTitle}</h1>
        <p className="max-w-xl text-lead text-paper/75">{t.home.heroSubtitle}</p>

        <Link
          href={href(locale, 'products')}
          className="link-underline tap text-small text-paper/85"
        >
          {t.home.viewAllProducts}
        </Link>

        {/* Las cifras cierran el hero sobre un filete: es lo primero que un comprador
            compara entre proveedores, así que no espera al scroll. El filete va a todo el
            ancho —`w-full`— aunque las cifras estén centradas: es lo que sostiene el
            bloque contra el borde de la pantalla y le da la escala de tabla que tiene. */}
        <dl className="mt-6 grid w-full grid-cols-2 gap-x-8 gap-y-8 border-t border-paper/20 pt-8 md:grid-cols-4">
          {figures.map((figure) => (
            <div key={figure.label}>
              <dt className="eyebrow text-paper/50">{figure.label}</dt>
              <dd className="figure-num text-figure mt-2 text-paper">{figure.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* El hueco de la barra de iconos de móvil, que va fija sobre el contenido: sin él,
          las cifras del hero —lo primero que se compara entre proveedores— quedan medio
          tapadas por ella justo en la primera pantalla. Desaparece en `lg`, donde la barra
          ya no existe. */}
      <div aria-hidden className="h-(--spacing-nav-mobile) shrink-0 lg:hidden" />
    </section>
  )
}
