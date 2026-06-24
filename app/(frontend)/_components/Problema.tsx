'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Button } from './Button'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay: i * 0.08, ease },
})
const fromLeft = (i: number) => ({
  initial: { opacity: 0, x: -44 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay: i * 0.08, ease },
})
const fromRight = (i: number) => ({
  initial: { opacity: 0, x: 44 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay: i * 0.08, ease },
})
const scaleIn = (i: number) => ({
  initial: { opacity: 0, scale: 0.93 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, delay: i * 0.08, ease },
})
const hoverLift = { y: -6, transition: { duration: 0.3, ease } }

// ícones discretos (Lucide) — herdam a cor via currentColor
const IconCopia = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)
const IconRisco = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)
const IconCego = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
)

// gráfico de "platô": sobe, bate no teto e cai (representa "no começo evolui, depois empaca")
function PlateauChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const a = <T,>(w: T): T => (inView ? w : ({} as T))

  const baseline = 132
  const ceilingY = 37
  // sobe forte, plateia no teto e cai no fim
  const curve =
    'M 8 124 C 45 120, 82 92, 120 60 C 152 42, 184 40, 214 44 C 248 47, 270 54, 292 64'
  const area = `${curve} L 292 ${baseline} L 8 ${baseline} Z`

  // checkpoints na subida — param de aparecer quando empaca
  const checkpoints = [
    { x: 80, y: 92, d: 1.5 },
    { x: 134, y: 55, d: 1.8 },
    { x: 190, y: 40, d: 2.1 },
  ]

  return (
    <div ref={ref} className="w-full">
      <svg viewBox="0 0 300 150" className="w-full h-auto" aria-hidden>
        <defs>
          <linearGradient id="plateau-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(245,242,236)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="rgb(245,242,236)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="plateau-shimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(245,242,236)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(245,242,236)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(245,242,236)" stopOpacity="0" />
          </linearGradient>
          <mask id="plateau-mask">
            <rect width="300" height="150" fill="black" />
            <path d={curve} stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" />
          </mask>
        </defs>

        {/* grid */}
        {[52, 87, 122].map((y, i) => (
          <motion.line
            key={i}
            x1="8"
            x2="292"
            y1={y}
            y2={y}
            stroke="rgb(245,242,236)"
            strokeOpacity="0.05"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={a({ opacity: 1 })}
            transition={{ duration: 0.4, delay: i * 0.05, ease }}
          />
        ))}

        {/* linha do teto (tracejada) */}
        <motion.line
          x1="8"
          x2="292"
          y1={ceilingY}
          y2={ceilingY}
          stroke="rgb(245,242,236)"
          strokeOpacity="0.28"
          strokeWidth="1.2"
          strokeDasharray="4 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={a({ pathLength: 1, opacity: 1 })}
          transition={{ duration: 0.8, delay: 0.4, ease }}
        />

        {/* área preenchida sob a curva */}
        <motion.path
          d={area}
          fill="url(#plateau-fill)"
          initial={{ opacity: 0 }}
          animate={a({ opacity: 1 })}
          transition={{ duration: 1, delay: 1.0, ease }}
        />

        {/* glow sob a curva */}
        <motion.path
          d={curve}
          fill="none"
          stroke="rgb(245,242,236)"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.12"
          style={{ filter: 'blur(7px)' }}
          initial={{ pathLength: 0 }}
          animate={a({ pathLength: 1 })}
          transition={{ duration: 1.8, delay: 0.3, ease }}
        />

        {/* curva principal */}
        <motion.path
          d={curve}
          fill="none"
          stroke="rgb(245,242,236)"
          strokeOpacity="0.55"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={a({ pathLength: 1 })}
          transition={{ duration: 1.8, delay: 0.3, ease }}
        />

        {/* shimmer percorrendo a curva (contínuo) */}
        {inView && (
          <motion.rect
            y="0"
            width="120"
            height="150"
            fill="url(#plateau-shimmer)"
            mask="url(#plateau-mask)"
            opacity="0.5"
            initial={{ x: -120 }}
            animate={{ x: [-120, 300] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay: 2.4 }}
          />
        )}

        {/* checkpoints na subida (somem quando empaca) */}
        {checkpoints.map((cp, i) => (
          <motion.circle
            key={i}
            cx={cp.x}
            cy={cp.y}
            r="3.5"
            fill="rgb(245,242,236)"
            fillOpacity="0.7"
            initial={{ opacity: 0, scale: 0 }}
            animate={a({ opacity: 1, scale: 1 })}
            transition={{ duration: 0.4, delay: cp.d, ease }}
            style={{ transformOrigin: `${cp.x}px ${cp.y}px` }}
          />
        ))}

        {/* marcador no teto + pulso infinito */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={a({ opacity: 1, scale: 1 })}
          transition={{ duration: 0.5, delay: 2.3, ease }}
          style={{ transformOrigin: '214px 44px' }}
        >
          {inView && (
            <motion.circle
              cx="214"
              cy="44"
              r="6"
              fill="none"
              stroke="rgb(245,242,236)"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 2.6 }}
              style={{ transformOrigin: '214px 44px' }}
            />
          )}
          <circle cx="214" cy="44" r="4" fill="rgb(245,242,236)" fillOpacity="0.92" />
        </motion.g>
      </svg>
    </div>
  )
}

export function Problema() {
  return (
    <section
      id="problema"
      className="relative bg-ink text-canvas overflow-hidden py-20 lg:py-28"
    >
      {/* registros horizontais finíssimos — sugestão de papel pautado, NÃO literal */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, currentColor 0, currentColor 1px, transparent 1px, transparent 56px)',
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* ===== topo: headline (esq) + parágrafo de intro (dir) ===== */}
        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-8 items-end">
          <motion.h2
            {...fadeUp(2)}
            className="col-span-12 lg:col-span-7 display text-canvas text-[clamp(40px,5.4vw,92px)] leading-[0.96] tracking-[-0.03em]"
          >
            Treinar sozinho{' '}
            <em
              className="italic-display text-brand-accent"
              style={{ fontStyle: 'italic' }}
            >
              tem um teto.
            </em>
            <br />
            E ele chega rápido.
          </motion.h2>

          <motion.div
            {...fadeUp(3)}
            className="col-span-12 lg:col-span-4 lg:col-start-9 mt-8 lg:mt-0"
          >
            <p className="text-canvas/70 text-[16px] lg:text-[17px] font-normal leading-[1.55]">
              Você baixa uma planilha, segue uns vídeos, copia o treino de alguém mais rápido. No
              começo evolui.{' '}
              <span className="text-canvas">Depois empaca.</span> O pace não cai, a perna dói no
              mesmo lugar, a motivação some. E a próxima prova chega sem você estar pronto.
            </p>
          </motion.div>
        </div>

        {/* ===== 3 na linha: card 01 · FOTO (maior) · card 02/03 ===== */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 lg:items-stretch">
          {/* CARD 01 — escuro, entra da esquerda */}
          <motion.div
            {...fromLeft(4)}
            whileHover={hoverLift}
            className="relative lg:col-span-3 rounded-[22px] p-7 lg:p-8 bg-white/[0.05] border border-white/10 overflow-hidden flex flex-col min-h-[300px] lg:h-[460px]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 right-3 display text-[140px] leading-none tracking-[-0.05em] text-white/[0.05] select-none"
            >
              01
            </span>
            <span className="relative inline-flex text-brand-accent">{IconCopia}</span>
            <div className="relative flex-1 flex items-center py-6">
              <PlateauChart />
            </div>
            <p className="relative text-canvas text-[20px] lg:text-[24px] font-normal leading-[1.28] tracking-[-0.015em]">
              Treino genérico ignora sua rotina, histórico e nível.
            </p>
          </motion.div>

          {/* FOTO — central, maior, com Ken Burns */}
          <motion.div
            {...scaleIn(5)}
            whileHover={hoverLift}
            className="group relative lg:col-span-6 rounded-[22px] overflow-hidden border border-white/10 h-[380px] lg:h-[460px]"
          >
            <Image
              src="/hero-equipe.jpg"
              alt="Equipe GBA em treino na rua"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="kenburns object-cover object-[50%_72%]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
            />
            <motion.div
              {...fadeUp(7)}
              className="absolute bottom-6 left-6 inline-flex items-center gap-2.5 rounded-full bg-white/12 backdrop-blur-md border border-white/20 pl-3.5 pr-5 py-2.5"
            >
              <span className="relative inline-flex size-2">
                <span
                  aria-hidden
                  className="tech-pulse absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-70"
                />
                <span className="relative inline-flex rounded-full size-2 bg-brand-accent" />
              </span>
              <span className="display text-canvas text-[17px] tracking-[-0.01em]">
                Treinar sozinho
              </span>
            </motion.div>
          </motion.div>

          {/* CARD 02/03 — claro, entra da direita */}
          <motion.div
            {...fromRight(6)}
            whileHover={hoverLift}
            className="lg:col-span-3 rounded-[22px] p-7 lg:p-8 bg-canvas text-ink overflow-hidden flex flex-col min-h-[260px] lg:h-[460px]"
          >
            <div className="flex-1 flex flex-col justify-center">
              <span className="relative inline-flex text-brand">{IconRisco}</span>
              <span className="marker text-[10px] text-brand/70 tabular-nums mt-4">02</span>
              <p className="mt-1.5 text-ink/85 text-[16px] lg:text-[17px] font-normal leading-[1.35]">
                Volume errado leva a lesão. Volume de menos não te tira do lugar.
              </p>
            </div>

            <div className="h-px w-full bg-ink/10" />

            <div className="flex-1 flex flex-col justify-center">
              <span className="relative inline-flex text-brand">{IconCego}</span>
              <span className="marker text-[10px] text-brand/70 tabular-nums mt-4">03</span>
              <p className="mt-1.5 text-ink/85 text-[16px] lg:text-[17px] font-normal leading-[1.35]">
                Sem alguém olhando, você não sabe se evolui ou só repete.
              </p>
            </div>
          </motion.div>
        </div>

        {/* divisor fino antes do fecho */}
        <motion.div
          {...fadeUp(8)}
          className="mt-20 lg:mt-28 h-px w-full bg-canvas/10"
        />

        {/* ===== fecho + CTA ===== */}
        <div className="mt-12 lg:mt-16 grid grid-cols-12 gap-x-4 lg:gap-x-8 items-end">
          <motion.div
            {...fadeUp(9)}
            className="col-span-12 lg:col-span-8"
          >
            <p className="text-[clamp(28px,3.5vw,52px)] font-medium leading-[1.05] tracking-[-0.02em] max-w-3xl">
              <span className="text-canvas">Não é falta de esforço.</span>
              <br />
              <span className="text-canvas/55">É falta de direcionamento.</span>
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(10)}
            className="col-span-12 lg:col-span-3 lg:text-right mt-8 lg:mt-0"
          >
            <Button href="#contato" variant="primary-light" size="md">
              Falar com o Guilherme
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
