'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { SectionLabel } from './SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

const INITIAL = 16

// fallback: fotos locais quando o admin ainda não tem nada cadastrado
const fotosFallback = Array.from(
  { length: 56 },
  (_, i) => `/photos/foto-${String(i + 1).padStart(2, '0')}.jpg`,
)

export function Galeria({ fotosCms }: { fotosCms?: string[] }) {
  const [expanded, setExpanded] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const fotos = fotosCms && fotosCms.length > 0 ? fotosCms : fotosFallback
  const TOTAL = fotos.length

  const visible = expanded ? fotos : fotos.slice(0, INITIAL)
  const hidden = TOTAL - INITIAL
  const isOpen = lightbox !== null

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight')
        setLightbox((i) => (i === null ? null : (i + 1) % TOTAL))
      if (e.key === 'ArrowLeft')
        setLightbox((i) =>
          i === null ? null : (i - 1 + TOTAL) % TOTAL,
        )
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  return (
    <section id="galeria" className="py-20 lg:py-28 bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="08" label="Galeria" />

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-4 lg:gap-y-0 items-end">
          <h2 className="col-span-12 lg:col-span-8 display text-ink text-[clamp(34px,5vw,72px)] leading-[0.95]">
            A equipe na rua, na pista,{' '}
            <em
              className="italic-display text-brand-accent"
              style={{ fontStyle: 'italic' }}
            >
              no pódio.
            </em>
          </h2>
          <p className="col-span-12 lg:col-span-4 text-ink/75 text-[18px] lg:text-[20px] font-normal leading-[1.4] lg:pb-2">
            Cada foto é um treino, uma prova, uma conquista.
          </p>
        </div>

        {/* contador + hint */}
        <div className="mt-12 lg:mt-16 flex items-end justify-between border-t border-ink/15 pt-4">
          <span className="marker text-ink/55 text-[10px] flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-accent" />
            {TOTAL} fotos
          </span>
          <span className="marker text-ink/55 text-[10px]">
            Click pra ampliar
          </span>
        </div>

        {/* MASONRY — CSS columns, natural aspect ratios.
            UMA animação só (a grade inteira) em vez de uma por foto — scroll leve. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mt-6 columns-2 sm:columns-3 lg:columns-4 gap-3 lg:gap-4 [column-fill:balance]"
        >
          {visible.map((src, i) => (
            <button
              key={src}
              onClick={() => setLightbox(i)}
              aria-label={`Abrir foto ${i + 1}`}
              className="group relative block w-full mb-3 lg:mb-4 break-inside-avoid overflow-hidden bg-ink rounded-md cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Foto ${String(i + 1).padStart(2, '0')}`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-500" />
              <span className="absolute bottom-2 left-2 marker text-canvas/95 text-[10px] opacity-0 group-hover:opacity-100 transition">
                {String(i + 1).padStart(2, '0')}
              </span>
              {/* zoom icon on hover */}
              <span className="absolute top-2 right-2 size-7 rounded-full bg-canvas/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <svg viewBox="0 0 24 24" fill="none" className="size-3 text-ink">
                  <path
                    d="M15 3h6m0 0v6m0-6L13 11M9 21H3m0 0v-6m0 6l8-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          ))}
        </motion.div>

        {/* expand control */}
        {hidden > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="group inline-flex items-center gap-3 marker text-ink/70 hover:text-ink text-[11px] transition"
            >
              {expanded ? 'Ver menos' : `Ver mais ${hidden} fotos`}
              <span className="size-8 rounded-full border border-ink/20 group-hover:bg-ink group-hover:text-canvas group-hover:border-ink transition flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`size-3 transition-transform ${
                    expanded ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* === LIGHTBOX === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-12 cursor-zoom-out"
          >
            {/* close */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(null)
              }}
              aria-label="Fechar"
              className="absolute top-4 right-4 lg:top-6 lg:right-6 size-11 rounded-full bg-canvas/10 backdrop-blur-sm border border-canvas/20 hover:bg-canvas hover:text-ink transition flex items-center justify-center text-canvas z-10"
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-4">
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* prev */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightbox((i) =>
                  i === null ? null : (i - 1 + TOTAL) % TOTAL,
                )
              }}
              aria-label="Anterior"
              className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 size-12 lg:size-14 rounded-full bg-canvas/10 backdrop-blur-sm border border-canvas/20 hover:bg-canvas hover:text-ink transition flex items-center justify-center text-canvas z-10"
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-5">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* next */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightbox((i) =>
                  i === null ? null : (i + 1) % TOTAL,
                )
              }}
              aria-label="Próxima"
              className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 size-12 lg:size-14 rounded-full bg-canvas/10 backdrop-blur-sm border border-canvas/20 hover:bg-canvas hover:text-ink transition flex items-center justify-center text-canvas z-10"
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-5">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* counter top-left */}
            <div className="absolute top-4 left-4 lg:top-6 lg:left-6 marker text-canvas/80 text-[10px] tabular-nums">
              {String((lightbox ?? 0) + 1).padStart(2, '0')} /{' '}
              <span className="text-canvas/45">
                {String(TOTAL).padStart(2, '0')}
              </span>
            </div>

            {/* main image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotos[lightbox ?? 0]}
                alt={`Foto ${(lightbox ?? 0) + 1}`}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-md shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
