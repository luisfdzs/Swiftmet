'use client'

import { useEffect, useState } from 'react'
import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * AVISO DE CONEXIÓN BLOQUEADA
 *
 * El panel de Sanity necesita una conexión **en tiempo real** (Server-Sent Events) con
 * `api.sanity.io` para funcionar: es como se enteran los formularios de que un documento
 * ha cambiado. Si algo la bloquea, el panel **se queda en blanco o girando para siempre,
 * sin decir nada**, y quien lo usa concluye —con razón— que la web está rota.
 *
 * Le pasó de verdad al proyecto de referencia: en un portátil con un antivirus corporativo
 * que inspecciona el tráfico HTTPS, el navegador no lograba abrir esa conexión mientras
 * las peticiones normales y `curl` funcionaban sin problema. Diagnosticarlo llevó un rato
 * precisamente porque el panel no daba ninguna pista.
 *
 * Este componente hace la comprobación por su cuenta y, si falla, explica qué ocurre y qué
 * probar. No sustituye al panel: se muestra encima, para que el mensaje aparezca aunque el
 * panel no llegue a arrancar.
 */

const TIMEOUT_MS = 9000

type State = 'checking' | 'ok' | 'blocked'

export function ConnectionNotice() {
  const [state, setState] = useState<State>('checking')

  useEffect(() => {
    // Consulta mínima: sólo interesa si el canal se abre, no lo que devuelve.
    const query = encodeURIComponent('*[_id == "__health__"]{_id}')
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/listen/${dataset}?query=${query}&visibility=query`
    const source = new EventSource(url)

    const timer = setTimeout(() => {
      source.close()
      setState('blocked')
    }, TIMEOUT_MS)

    source.onopen = () => {
      clearTimeout(timer)
      source.close()
      setState('ok')
    }
    source.onerror = () => {
      clearTimeout(timer)
      source.close()
      setState('blocked')
    }

    return () => {
      clearTimeout(timer)
      source.close()
    }
  }, [])

  if (state !== 'blocked') return null

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        inset: 'auto 1rem 1rem 1rem',
        zIndex: 9999,
        maxWidth: '46rem',
        margin: '0 auto',
        padding: '1.25rem 1.5rem',
        borderRadius: '0.5rem',
        background: '#0f1316',
        color: '#f2f3f4',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.9rem',
        lineHeight: 1.55,
        boxShadow: '0 10px 40px rgb(0 0 0 / 0.35)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
        Your network is blocking the admin panel
      </strong>
      <p style={{ margin: '0 0 0.75rem' }}>
        The panel needs a permanent connection to Sanity&rsquo;s servers, and this machine or
        network will not let it open. That is why it may stay blank or keep loading forever.{' '}
        <strong>This is not a problem with the website.</strong>
      </p>
      <p style={{ margin: 0, opacity: 0.85 }}>
        It is usually a corporate antivirus or a firewall that inspects traffic (Sophos, McAfee and
        similar), or an office network. To confirm, open this same address{' '}
        <strong>on a phone using mobile data</strong> or from another network: if it works there,
        that is the cause. To use it on this machine, ask for{' '}
        <code style={{ fontSize: '0.85em' }}>{projectId}.api.sanity.io</code> to be allowed.
      </p>
    </div>
  )
}
