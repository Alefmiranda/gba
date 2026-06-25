'use client'

/**
 * Célula custom da lista da Galeria no admin.
 * Mostra a miniatura da foto e, ao clicar, abre a imagem em tamanho grande (lightbox).
 */
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type MediaDoc = {
  id: number | string
  url?: string | null
  thumbnailURL?: string | null
  alt?: string | null
  filename?: string | null
  sizes?: Record<string, { url?: string | null } | null> | null
}

function pickThumb(doc: MediaDoc): string {
  return doc.sizes?.thumbnail?.url || doc.thumbnailURL || doc.url || ''
}
function pickLarge(doc: MediaDoc): string {
  return doc.sizes?.hero?.url || doc.sizes?.card?.url || doc.url || pickThumb(doc)
}

export default function GaleriaFotoCell(props: { cellData?: unknown }) {
  const { cellData } = props
  const initial = cellData && typeof cellData === 'object' ? (cellData as MediaDoc) : null
  const [doc, setDoc] = useState<MediaDoc | null>(initial)
  const [open, setOpen] = useState(false)

  // se vier só o ID, busca o doc da mídia (read é público)
  useEffect(() => {
    if (doc) return
    const id =
      cellData && typeof cellData === 'object'
        ? (cellData as MediaDoc).id
        : (cellData as number | string | undefined)
    if (id === undefined || id === null || id === '') return
    let cancelled = false
    fetch(`/api/media/${id}?depth=0`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: MediaDoc | null) => {
        if (!cancelled && d) setDoc(d)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [cellData, doc])

  // ESC fecha o lightbox
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!doc) return <span style={{ opacity: 0.35 }}>—</span>

  const thumb = pickThumb(doc)
  const big = pickLarge(doc)
  const alt = doc.alt || doc.filename || 'Foto da galeria'

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        title="Clique para ampliar"
        style={{
          border: 0,
          background: 'none',
          padding: 0,
          margin: 0,
          cursor: 'zoom-in',
          lineHeight: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={alt}
          style={{
            width: 64,
            height: 46,
            objectFit: 'cover',
            borderRadius: 4,
            display: 'block',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
          }}
        />
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
              background: 'rgba(8,8,10,0.85)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              cursor: 'zoom-out',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={big}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '92vw',
                maxHeight: '92vh',
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
                cursor: 'default',
              }}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
