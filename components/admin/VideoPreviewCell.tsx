'use client'

/**
 * Célula custom da lista de Vídeos no admin.
 * Mostra a capa (YouTube / thumbnail custom / 1º frame do arquivo) e, ao clicar,
 * abre o vídeo tocando num player (fecha com ESC ou clique fora).
 */
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Upload =
  | number
  | string
  | { url?: string | null; mimeType?: string | null }
  | null
  | undefined

function ytId(url?: string | null): string | null {
  if (!url) return null
  const s = String(url)
  const m = s.match(
    /(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  if (m) return m[1]
  const bare = s.trim().match(/^[A-Za-z0-9_-]{11}$/)
  return bare ? bare[0] : null
}

async function resolveUpload(u: Upload): Promise<{ url?: string | null; mimeType?: string | null } | null> {
  if (!u) return null
  if (typeof u === 'object') return u
  try {
    const r = await fetch(`/api/media/${u}?depth=0`, { credentials: 'include' })
    return r.ok ? await r.json() : null
  } catch {
    return null
  }
}

export default function VideoPreviewCell(props: { cellData?: unknown; rowData?: Record<string, unknown> }) {
  const row = props.rowData || {}
  const url = typeof props.cellData === 'string' ? props.cellData : (row.url as string | undefined)
  const id = ytId(url)
  const isShort = /shorts\//.test(String(url || '')) || !!id // shorts/portrait por padrão (caso GBA)

  const [customThumb, setCustomThumb] = useState<string | null>(null)
  const [arquivo, setArquivo] = useState<{ url?: string | null; mimeType?: string | null } | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (row.thumbnail) {
        const m = await resolveUpload(row.thumbnail as Upload)
        if (!cancelled && m?.url) setCustomThumb(m.url)
      }
      if (row.arquivo) {
        const m = await resolveUpload(row.arquivo as Upload)
        if (!cancelled && m?.url) setArquivo(m)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [row.thumbnail, row.arquivo])

  // ESC fecha
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const thumbSrc = customThumb || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null)
  const playable = !!(id || arquivo?.url)

  if (!thumbSrc && !arquivo?.url) return <span style={{ opacity: 0.35 }}>—</span>

  // miniatura retrato (9:16) pros shorts; quadrada-ish pro resto
  const tW = isShort ? 34 : 64
  const tH = 48

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        title={playable ? 'Clique para ver o vídeo' : 'Clique para ampliar'}
        style={{ border: 0, background: 'none', padding: 0, margin: 0, cursor: 'pointer', lineHeight: 0 }}
      >
        <span style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
          {thumbSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbSrc}
              alt=""
              style={{
                width: tW,
                height: tH,
                objectFit: 'cover',
                borderRadius: 4,
                display: 'block',
                background: '#000',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
              }}
            />
          ) : (
            <video
              src={arquivo?.url || undefined}
              muted
              preload="metadata"
              style={{ width: tW, height: tH, objectFit: 'cover', borderRadius: 4, display: 'block', background: '#000' }}
            />
          )}
          {/* play badge */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" fill="#fff" width="10" height="10" style={{ marginLeft: 1 }}>
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </span>
        </span>
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(8,8,10,0.9)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              cursor: 'zoom-out',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {id ? (
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: isShort ? '9 / 16' : '16 / 9',
                    height: isShort ? 'min(88vh, 760px)' : undefined,
                    width: isShort ? undefined : 'min(92vw, 960px)',
                    background: '#000',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 24px 70px rgba(0,0,0,0.6)',
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title="Vídeo"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
              ) : arquivo?.url ? (
                <video
                  src={arquivo.url}
                  controls
                  autoPlay
                  style={{ maxWidth: '92vw', maxHeight: '88vh', borderRadius: 12, background: '#000' }}
                />
              ) : thumbSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbSrc} alt="" style={{ maxWidth: '92vw', maxHeight: '88vh', borderRadius: 12 }} />
              ) : null}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
