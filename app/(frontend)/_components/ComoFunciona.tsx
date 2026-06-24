'use client'

import { motion, useInView, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useRef } from 'react'
import { SectionLabel } from './SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

type IconName = 'chat' | 'doc' | 'chart' | 'flag'

type Step = {
  n: string
  titulo: string
  desc: string
  icon: IconName
}

const steps: Step[] = [
  {
    n: '01',
    titulo: 'Conversa inicial',
    desc: 'Você fala objetivo, rotina e histórico.',
    icon: 'chat',
  },
  {
    n: '02',
    titulo: 'Plano sob medida',
    desc: 'Monto sua planilha personalizada.',
    icon: 'doc',
  },
  {
    n: '03',
    titulo: 'Treine e reporte',
    desc: 'Você executa. Eu acompanho e ajusto.',
    icon: 'chart',
  },
  {
    n: '04',
    titulo: 'Evolua de verdade',
    desc: 'Carga sobe na hora certa. Resultado aparece.',
    icon: 'flag',
  },
]

// threshold de ativação de cada step ao longo do scroll progress (0..1)
const STEP_THRESHOLDS = [0.15, 0.4, 0.65, 0.9]

function StepIcon({ name, color }: { name: IconName; color: string }) {
  const s = {
    stroke: color,
    strokeWidth: 1.4,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'chat':
      return (
        <svg viewBox="0 0 32 32" className="size-7">
          <path
            d="M 5 9 A 2 2 0 0 1 7 7 H 21 A 2 2 0 0 1 23 9 V 17 A 2 2 0 0 1 21 19 H 13 L 9 23 L 9.5 19 H 7 A 2 2 0 0 1 5 17 Z"
            {...s}
          />
          <circle cx="11" cy="13" r="0.9" fill={color} stroke="none" />
          <circle cx="14" cy="13" r="0.9" fill={color} stroke="none" />
          <circle cx="17" cy="13" r="0.9" fill={color} stroke="none" />
        </svg>
      )
    case 'doc':
      return (
        <svg viewBox="0 0 32 32" className="size-7">
          <path
            d="M 8 5 H 21 L 26 10 V 27 A 1 1 0 0 1 25 28 H 8 A 1 1 0 0 1 7 27 V 6 A 1 1 0 0 1 8 5 Z"
            {...s}
          />
          <path d="M 21 5 V 10 H 26" {...s} />
          <line x1="11" y1="16" x2="22" y2="16" {...s} />
          <line x1="11" y1="20" x2="22" y2="20" {...s} />
          <line x1="11" y1="24" x2="18" y2="24" {...s} />
          <path
            d="M 11.5 11 L 13 12.5 L 16 9.5"
            stroke="#77CDDE"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'chart':
      return (
        <svg viewBox="0 0 32 32" className="size-7">
          <polyline points="4,27 4,5" {...s} />
          <polyline points="4,27 28,27" {...s} />
          <polyline points="7,22 13,16 19,19 27,8" {...s} />
          <circle cx="13" cy="16" r="1.5" fill={color} stroke="none" />
          <circle cx="19" cy="19" r="1.5" fill={color} stroke="none" />
          <circle cx="27" cy="8" r="2" fill="#77CDDE" stroke="none" />
        </svg>
      )
    case 'flag':
      return (
        <svg viewBox="0 0 32 32" className="size-7">
          <line x1="8" y1="3" x2="8" y2="29" {...s} />
          <path d="M 8 6 L 26 6 L 23 12 L 26 18 L 8 18 Z" {...s} />
          <rect x="8" y="6" width="4.5" height="3" fill="#77CDDE" stroke="none" />
          <rect x="17" y="6" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
          <rect x="12.5" y="9" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
          <rect x="8" y="12" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
          <rect x="17" y="12" width="4.5" height="3" fill="#77CDDE" stroke="none" />
          <rect x="12.5" y="15" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
        </svg>
      )
  }
}

function StepCard({
  step,
  i,
}: {
  step: Step
  i: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  // ativa quando o card está 40% visível — funciona em mobile e desktop
  const isActive = useInView(cardRef, { once: true, amount: 0.4 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease }}
      className="group relative pl-12 lg:pl-0 pb-10 last:pb-0 lg:pb-0"
    >
      {/* DOT da timeline — só mobile, alinhado à linha vertical */}
      <motion.div
        animate={{
          backgroundColor: isActive ? '#77CDDE' : '#f5f2ec',
          borderColor: isActive ? '#77CDDE' : 'rgba(14,14,12,0.25)',
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ duration: 0.5, ease }}
        className="lg:hidden absolute left-0 top-1 size-[14px] rounded-full border-2 z-10"
      />

      {/* topo: numeral + ícone */}
      <div className="flex items-center gap-3 lg:gap-4">
        <motion.span
          animate={{ color: isActive ? '#77CDDE' : 'rgba(14,14,12,0.18)' }}
          transition={{ duration: 0.6, ease }}
          className="text-[40px] lg:text-[52px] leading-none tabular-nums tracking-tight"
          style={{ fontWeight: 300 }}
        >
          {step.n}
        </motion.span>

        <motion.span
          animate={{ opacity: isActive ? 1 : 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex"
        >
          <StepIcon name={step.icon} color={isActive ? '#053A44' : '#0e0e0c'} />
        </motion.span>
      </div>

      {/* divisor curto horizontal — só desktop */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive ? 1 : 0.18 }}
        transition={{ duration: 0.7, ease, delay: 0.1 }}
        className="hidden lg:block mt-7 h-px w-full bg-ink/20 origin-left relative"
      >
        <motion.span
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="absolute inset-0 bg-brand-accent origin-left"
        />
      </motion.div>

      <h3 className="mt-4 lg:mt-6 display text-ink text-[21px] lg:text-[23px] leading-tight">
        {step.titulo}
      </h3>
      <p className="mt-2 lg:mt-2.5 text-ink/60 text-[15px] lg:text-[16px] font-normal leading-[1.55] max-w-md">
        {step.desc}
      </p>
    </motion.div>
  )
}

export function ComoFunciona() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 65%', 'end 35%'],
  })

  // track fill + runner ao longo do eixo X (desktop)
  const trackFillWidth = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'])
  const runnerX = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'])

  // progresso vertical da timeline (mobile)
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ['start 75%', 'end 65%'],
  })
  const vFillHeight = useTransform(listProgress, [0, 1], ['0%', '100%'])
  const vRunnerTop = useTransform(listProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className="relative py-20 lg:py-28 bg-canvas overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="06" label="Como funciona" />

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-4 lg:gap-y-0 items-end">
          <h2 className="col-span-12 lg:col-span-8 display text-ink text-[clamp(34px,5vw,72px)] leading-[0.95]">
            Começar é simples.{' '}
            <em
              className="italic-display text-brand-accent"
              style={{ fontStyle: 'italic' }}
            >
              O trabalho sério
            </em>{' '}
            vem depois.
          </h2>
          <p className="col-span-12 lg:col-span-4 text-ink/75 text-[18px] lg:text-[20px] font-normal leading-[1.4] lg:pb-2">
            Quatro passos do primeiro contato até a próxima prova.
          </p>
        </div>

        {/* === TRACK + STEPS === */}
        <div className="mt-20 lg:mt-28">
          {/* TRACK horizontal — só desktop (no mobile vira timeline vertical) */}
          <div className="hidden lg:block relative mb-12">
            {/* labels start / finish */}
            <div className="flex items-center justify-between mb-5 marker text-[10px] text-ink/40">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ink/40" />
                Início
              </span>
              <span className="flex items-center gap-2">
                Linha de chegada
                <span className="size-1.5 rounded-full bg-brand-accent" />
              </span>
            </div>

            {/* track base */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.4, ease, delay: 0.2 }}
              className="h-px w-full bg-ink/20 origin-left"
            />

            {/* progress fill */}
            <motion.div
              style={{ width: trackFillWidth }}
              className="absolute left-0 h-[2px] bg-brand-accent"
              // bottom = 0 alinhado com a base track
              // como base track tem h-px, sobrepomos com h-[2px]
            />

            {/* checkpoints — 4 markers nos centros das colunas (12.5%, 37.5%, 62.5%, 87.5%) */}
            {steps.map((s, i) => {
              const pos = 12.5 + i * 25
              const threshold = STEP_THRESHOLDS[i]
              return (
                <Checkpoint
                  key={s.n}
                  pos={pos}
                  i={i}
                  threshold={threshold}
                  scrollYProgress={scrollYProgress}
                />
              )
            })}

            {/* runner — bolinha ciano pulsando que percorre o track */}
            <motion.div
              style={{ left: runnerX }}
              className="absolute top-0 -mt-[7px] -ml-[8px] z-10"
            >
              <div className="relative size-4 rounded-full bg-brand-accent ring-4 ring-brand-accent/30">
                <span className="absolute inset-0 rounded-full bg-brand-accent animate-ping opacity-60" />
              </div>
            </motion.div>
          </div>

          {/* CARDS — timeline vertical no mobile, 4 cols no desktop */}
          <div
            ref={listRef}
            className="relative grid grid-cols-1 lg:grid-cols-4 gap-x-6 lg:gap-x-8 lg:gap-y-16"
          >
            {/* linha vertical da timeline — só mobile, do 1º ao último dot */}
            <div
              aria-hidden
              className="lg:hidden absolute left-[6px] top-2 bottom-12 w-px bg-ink/15"
            >
              {/* fill ciano que desce conforme o scroll */}
              <motion.div
                style={{ height: vFillHeight }}
                className="absolute top-0 left-0 w-px bg-brand-accent origin-top"
              />
            </div>

            {/* runner — bolinha ciano descendo na linha (mobile) */}
            <motion.div
              aria-hidden
              style={{ top: vRunnerTop }}
              className="lg:hidden absolute left-[6px] -translate-x-1/2 -mt-2 z-10"
            >
              <div className="relative size-3.5 rounded-full bg-brand-accent ring-4 ring-brand-accent/25">
                <span className="absolute inset-0 rounded-full bg-brand-accent animate-ping opacity-60" />
              </div>
            </motion.div>
            {steps.map((s, i) => (
              <StepCard key={s.n} step={s} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Checkpoint({
  pos,
  i,
  threshold,
  scrollYProgress,
}: {
  pos: number
  i: number
  threshold: number
  scrollYProgress: MotionValue<number>
}) {
  const activeProg = useTransform(
    scrollYProgress,
    [threshold - 0.06, threshold],
    [0, 1]
  )
  const ringScale = useTransform(activeProg, [0, 1], [1, 2.2])
  const ringOpacity = useTransform(activeProg, [0, 0.4, 1], [0, 0.5, 0])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease }}
      style={{ left: `${pos}%` }}
      className="absolute top-0 -translate-y-1/2 -translate-x-1/2"
    >
      <div className="relative">
        {/* ripple ring quando ativa */}
        <motion.div
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute inset-0 rounded-full bg-brand-accent/40 size-3"
        />
        {/* base dot */}
        <div className="relative size-3 rounded-full bg-canvas border-2 border-ink/35 flex items-center justify-center">
          {/* fill quando ativa */}
          <motion.div
            style={{ opacity: activeProg }}
            className="absolute inset-0 rounded-full bg-brand-accent border-2 border-brand-accent"
          />
        </div>
      </div>
    </motion.div>
  )
}
