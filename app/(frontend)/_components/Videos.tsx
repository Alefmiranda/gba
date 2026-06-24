'use client'

import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { SectionLabel } from './SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

type Video = {
  src: string
  label: string
}

// extrai o ID e gera embed do YouTube/Vimeo; null se for arquivo
function getEmbed(src: string): string | null {
  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${yt[1]}`
  const vimeo = src.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`
  return null
}
function ytThumb(src: string): string | null {
  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  return yt ? `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg` : null
}

const videosFallback: Video[] = [
  { src: 'https://youtube.com/shorts/kRPMw9PgTzY', label: 'Principal' },
  { src: 'https://youtube.com/shorts/YzQxqXUDtiA', label: '02' },
  { src: 'https://youtube.com/shorts/SuhfIV9rbxs', label: '03' },
  { src: 'https://youtube.com/shorts/JNQYkVgT6gI', label: '04' },
  { src: 'https://youtube.com/shorts/mLc_CnumBIc', label: '05' },
  { src: 'https://youtube.com/shorts/hslgNVJZxEU', label: '06' },
  { src: 'https://youtube.com/shorts/6bbg__9DN7w', label: '07' },
  { src: 'https://youtube.com/shorts/BhvVIty1Fjc', label: '08' },
  { src: 'https://youtube.com/shorts/NaOd-Ufvbos', label: '09' },
  { src: 'https://youtube.com/shorts/uD4bazLhgx4', label: '10' },
  { src: 'https://youtube.com/shorts/FrKsk3Iidfw', label: '11' },
  { src: 'https://youtube.com/shorts/_TdFHbolcJg', label: '12' },
  { src: 'https://youtube.com/shorts/ywDA511HKpM', label: '13' },
  { src: 'https://youtube.com/shorts/kXz9isxakng', label: '14' },
  { src: 'https://youtube.com/shorts/D4nk538UbCI', label: '15' },
]

function Tile({
  video,
  index,
  bigOnDesktop = false,
}: {
  video: Video
  index: number
  bigOnDesktop?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovering, setHovering] = useState(false)
  const [started, setStarted] = useState(false)

  const embed = getEmbed(video.src)
  const thumb = ytThumb(video.src)

  const handleEnter = () => {
    if (embed) return
    setHovering(true)
    const el = videoRef.current
    if (el) {
      el.currentTime = 0
      el.play().catch(() => {})
    }
  }

  const handleLeave = () => {
    if (embed) return
    setHovering(false)
    const el = videoRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
  }

  return (
    <button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => {
        if (embed) {
          setStarted(true)
          return
        }
        const el = videoRef.current
        if (!el) return
        if (el.paused) {
          el.muted = false
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      }}
      aria-label={`Vídeo ${video.label}`}
      className={`relative bg-ink overflow-hidden group cursor-pointer aspect-[9/16] ${
        bigOnDesktop
          ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2'
          : 'col-span-1 row-span-1'
      }`}
    >
      {embed ? (
        started ? (
          <iframe
            src={embed}
            title={`Vídeo ${video.label}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb ?? ''}
            alt={`Vídeo ${video.label}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ) : (
        <video
          ref={videoRef}
          src={video.src}
          muted
          playsInline
          preload="metadata"
          loop
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* overlays escondidos quando o embed está tocando */}
      {!(embed && started) && (
        <>
      {/* gradient sutil sempre */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-b from-ink/15 via-transparent to-ink/85 transition-opacity duration-500 ${
          hovering ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* hover indicator — barra ciano superior */}
      <div
        aria-hidden
        className={`absolute top-0 left-0 right-0 h-[2px] bg-brand-accent origin-left transition-transform duration-500 ${
          hovering ? 'scale-x-100' : 'scale-x-0'
        }`}
      />

      {/* play icon — só quando NOT hovering */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          hovering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        <span
          className={`rounded-full bg-canvas/95 backdrop-blur-sm flex items-center justify-center text-ink ${
            bigOnDesktop
              ? 'size-12 sm:size-14 lg:size-20'
              : 'size-9 lg:size-11'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`translate-x-0.5 ${
              bigOnDesktop ? 'size-5 lg:size-8' : 'size-4 lg:size-5'
            }`}
          >
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </span>
      </span>

      {/* bottom-left marker */}
      <span
        className={`absolute bottom-2 left-2 lg:bottom-3 lg:left-3 marker text-canvas/90 ${
          bigOnDesktop ? 'text-[11px]' : 'text-[9px]'
        }`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* destaque badge — automático no 1º vídeo */}
      {index === 0 && (
        <span
          className={`absolute top-2 right-2 lg:top-3 lg:right-3 marker text-brand-accent flex items-center gap-1.5 ${
            bigOnDesktop ? 'text-[10px]' : 'text-[9px]'
          }`}
        >
          <span className="size-1.5 rounded-full bg-brand-accent animate-pulse" />
          Destaque
        </span>
      )}
        </>
      )}
    </button>
  )
}

const INITIAL_COUNT = 9

export function Videos({ videosCms }: { videosCms?: Video[] }) {
  const [expanded, setExpanded] = useState(false)
  const videos = videosCms && videosCms.length > 0 ? videosCms : videosFallback
  const visible = expanded ? videos : videos.slice(0, INITIAL_COUNT)
  const hidden = videos.length - INITIAL_COUNT

  return (
    <section id="videos" className="bg-canvas overflow-hidden">
      {/* HEADER — dentro do container */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-20 lg:pt-28 pb-10 lg:pb-14">
        <SectionLabel num="07" label="Vídeos" />

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-4 lg:gap-y-0 items-end">
          <h2 className="col-span-12 lg:col-span-8 display text-ink text-[clamp(34px,5vw,72px)] leading-[0.95]">
            Veja a assessoria{' '}
            <em
              className="italic-display text-brand-accent"
              style={{ fontStyle: 'italic' }}
            >
              em movimento
            </em>
          </h2>
          <p className="col-span-12 lg:col-span-4 text-ink/75 text-[18px] lg:text-[20px] font-normal leading-[1.4] lg:pb-2">
            Treinos, bastidor e a equipe nas provas que importam. Passe o mouse pra ver, clique pra ouvir.
          </p>
        </div>

        {/* marcadores topo da galeria */}
        <div className="mt-12 lg:mt-16 flex items-end justify-between border-t border-ink/15 pt-4">
          <span className="marker text-ink/55 text-[10px] flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-accent animate-pulse" />
            {videos.length} sequências
          </span>
          <span className="marker text-ink/55 text-[10px]">
            ↓ Hover · Click ↓
          </span>
        </div>
      </div>

      {/* WALL — full bleed edge to edge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease }}
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-[2px] bg-ink/15"
      >
        {visible.map((v, i) => (
          <Tile
            key={v.src}
            video={v}
            index={i}
            bigOnDesktop={i === 0}
          />
        ))}
      </motion.div>

      {/* EXPAND CONTROL */}
      {hidden > 0 && (
        <div className="bg-canvas border-t border-ink/15 py-6 lg:py-8 flex justify-center">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="group inline-flex items-center gap-3 marker text-ink/70 hover:text-ink text-[11px] transition"
          >
            {expanded ? 'Ver menos' : `Ver mais ${hidden} vídeos`}
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

      {/* FOOTER — call to action */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 lg:py-20 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-ink/15">
        <p className="display text-ink text-[24px] lg:text-[32px] leading-tight max-w-md">
          A história não cabe em texto.{' '}
          <em
            className="italic-display text-brand-accent"
            style={{ fontStyle: 'italic' }}
          >
            Aperta play.
          </em>
        </p>

        <a
          href="#contato"
          className="group inline-flex items-center gap-3 marker text-ink/60 hover:text-ink text-[11px] transition"
        >
          Faça parte
          <span className="size-9 rounded-full bg-ink text-canvas flex items-center justify-center group-hover:bg-brand transition">
            <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
  )
}
