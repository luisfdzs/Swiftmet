'use client'

import { useState } from 'react'
import { SpoolDiagram } from '@/components/sections/SpoolDiagram'
import { SpoolCardScene } from '@/components/three/SpoolCardScene'
import { DEMO_SPOOLS, DEMO_SPOOL_PHOTOS } from '@/components/lab/demo-spools'
import { formatKg, formatMm } from '@/lib/format'

const LOCALE = 'es'

const LEGEND = [
  { cote: 'D1', label: 'Diámetro de pestaña', key: 'flangeDiameter' },
  { cote: 'D2', label: 'Diámetro de núcleo', key: 'coreDiameter' },
  { cote: 'D3', label: 'Agujero central', key: 'boreHole' },
  { cote: 'L1', label: 'Anchura de bobina', key: 'spoolWidth' },
  { cote: 'L2', label: 'Anchura de bobinado', key: 'windingWidth' },
] as const

export function SpoolsLabView() {
  const [selected, setSelected] = useState(DEMO_SPOOLS[0].code)
  const spool = DEMO_SPOOLS.find((entry) => entry.code === selected) ?? DEMO_SPOOLS[0]
  const photo = DEMO_SPOOL_PHOTOS[spool.code]

  const scale = {
    maxDiameter: Math.max(...DEMO_SPOOLS.map((entry) => entry.flangeDiameter)),
    maxWidth: Math.max(...DEMO_SPOOLS.map((entry) => entry.spoolWidth)),
  }

  return (
    <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-16">
      <div className="md:col-span-7">
        <div className="relative flex h-80 items-center justify-center border border-line bg-paper-deep/40 md:h-[26rem]">
          {photo ? (
            <SpoolCardScene src={photo} />
          ) : (
            <SpoolDiagram spool={spool} scale={scale} className="h-3/4 w-auto text-ink" />
          )}
          <span className="eyebrow absolute top-4 left-4 text-ink-faint">
            {photo ? 'Foto ilustrativa, recorte real sin fondo' : 'Dibujado desde sus cotas'}
          </span>
        </div>
        <p className="figure-num mt-6 text-lead text-ink">{spool.code}</p>
        <p className="figure-num mt-1 text-small text-ink-soft">
          {formatKg(spool.netWeight, LOCALE)} · Ø {formatMm(spool.flangeDiameter, LOCALE)}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-5">
          {LEGEND.map((entry) => (
            <div key={entry.cote}>
              <dt className="eyebrow text-signal">{entry.cote}</dt>
              <dd className="figure-num mt-1 text-small text-ink">
                {formatMm(spool[entry.key], LOCALE)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="md:col-span-5">
        <h2 className="eyebrow border-b border-line pb-4">Las catorce referencias</h2>
        <ul className="mt-4">
          {DEMO_SPOOLS.map((entry) => {
            const hasPhoto = Boolean(DEMO_SPOOL_PHOTOS[entry.code])
            const isActive = entry.code === spool.code
            return (
              <li key={entry.code}>
                <button
                  type="button"
                  onClick={() => setSelected(entry.code)}
                  className={`tap flex w-full items-center justify-between border-b border-line py-3 text-left transition-colors ${
                    isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <span className="figure-num text-small">{entry.code}</span>
                  <span className="flex items-center gap-3">
                    <span className="figure-num text-small text-ink-faint">
                      {formatKg(entry.netWeight, LOCALE)}
                    </span>
                    <span className={`eyebrow ${hasPhoto ? 'text-signal' : 'text-ink-faint'}`}>
                      {hasPhoto ? 'con foto' : 'dibujo'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
