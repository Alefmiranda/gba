'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { SectionLabel } from './SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

type IconName =
  | 'target'
  | 'sync'
  | 'chat'
  | 'chart'
  | 'flag'
  | 'gauge'
  | 'laurel'

type Item = {
  n: string
  titulo: string
  desc: string
  icon: IconName
  destaque?: boolean
  span: string
}

// Ordem RENDER (visual bento) — número (item.n) preserva ordem semântica original
const items: Item[] = [
  {
    n: '01',
    titulo: 'Plano 100% individual',
    desc: 'Montado pro seu objetivo, nível e rotina.',
    icon: 'target',
    span: 'lg:col-span-4 lg:row-span-1',
  },
  {
    n: '02',
    titulo: 'Atualização periódica',
    desc: 'Seu treino evolui junto com você.',
    icon: 'sync',
    span: 'lg:col-span-4 lg:row-span-1',
  },
  {
    n: '07',
    titulo: 'Método de alto rendimento',
    desc: 'O mesmo que treinador-atleta usa pra competir.',
    icon: 'laurel',
    destaque: true,
    span: 'lg:col-span-4 lg:row-span-2',
  },
  {
    n: '03',
    titulo: 'Suporte direto',
    desc: 'Dúvidas e ajustes com o treinador.',
    icon: 'chat',
    span: 'lg:col-span-4 lg:row-span-1',
  },
  {
    n: '04',
    titulo: 'Acompanhamento',
    desc: 'Você enxerga onde melhorou.',
    icon: 'chart',
    span: 'lg:col-span-4 lg:row-span-1',
  },
  {
    n: '05',
    titulo: 'Preparação para provas',
    desc: 'Periodização, estratégia e plano de prova.',
    icon: 'flag',
    span: 'lg:col-span-6 lg:row-span-1',
  },
  {
    n: '06',
    titulo: 'Controle de carga',
    desc: 'Volume calibrado pra evitar lesão.',
    icon: 'gauge',
    span: 'lg:col-span-6 lg:row-span-1',
  },
]

function Icon({
  name,
  color,
  size = 'size-8',
}: {
  name: IconName
  color: string
  size?: string
}) {
  const s = {
    stroke: color,
    strokeWidth: 1.4,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'target':
      return (
        <svg viewBox="0 0 32 32" className={size}>
          <circle cx="16" cy="16" r="12" {...s} />
          <circle cx="16" cy="16" r="7" {...s} />
          <circle cx="16" cy="16" r="2.2" fill={color} stroke="none" />
          <line x1="16" y1="2" x2="16" y2="6" {...s} />
          <line x1="16" y1="26" x2="16" y2="30" {...s} />
          <line x1="2" y1="16" x2="6" y2="16" {...s} />
          <line x1="26" y1="16" x2="30" y2="16" {...s} />
        </svg>
      )
    case 'sync':
      return (
        <svg viewBox="0 0 32 32" className={size}>
          <path d="M 27 13 A 11 11 0 1 0 27 20" {...s} />
          <path d="M 21 13 L 27 13 L 27 7" {...s} />
        </svg>
      )
    case 'chat':
      return (
        <svg viewBox="0 0 32 32" className={size}>
          <path
            d="M 5 9 A 2 2 0 0 1 7 7 H 25 A 2 2 0 0 1 27 9 V 21 A 2 2 0 0 1 25 23 H 14 L 8 28 L 9.5 23 H 7 A 2 2 0 0 1 5 21 Z"
            {...s}
          />
          <line x1="10" y1="13" x2="22" y2="13" {...s} />
          <line x1="10" y1="17" x2="19" y2="17" {...s} />
        </svg>
      )
    case 'chart':
      return (
        <svg viewBox="0 0 32 32" className={size}>
          <polyline points="4,27 4,5" {...s} />
          <polyline points="4,27 28,27" {...s} />
          <polyline points="7,22 13,16 19,19 27,8" {...s} />
          <circle cx="13" cy="16" r="1.6" fill={color} stroke="none" />
          <circle cx="19" cy="19" r="1.6" fill={color} stroke="none" />
          <circle cx="27" cy="8" r="2" fill={color} stroke="none" />
        </svg>
      )
    case 'flag':
      return (
        <svg viewBox="0 0 32 32" className={size}>
          <line x1="8" y1="3" x2="8" y2="29" {...s} />
          <path d="M 8 6 L 26 6 L 23 12 L 26 18 L 8 18 Z" {...s} />
          <rect x="8" y="6" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
          <rect x="17" y="6" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
          <rect x="12.5" y="9" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
          <rect x="8" y="12" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
          <rect x="17" y="12" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
          <rect x="12.5" y="15" width="4.5" height="3" fill={color} stroke="none" opacity="0.85" />
        </svg>
      )
    case 'gauge':
      return (
        <svg viewBox="0 0 32 32" className={size}>
          <path d="M 4 24 A 12 12 0 0 1 28 24" {...s} />
          <line x1="5.5" y1="20" x2="7.5" y2="19" {...s} />
          <line x1="10" y1="13.5" x2="11.5" y2="14.5" {...s} />
          <line x1="16" y1="11" x2="16" y2="13" {...s} />
          <line x1="22" y1="13.5" x2="20.5" y2="14.5" {...s} />
          <line x1="26.5" y1="20" x2="24.5" y2="19" {...s} />
          <line x1="16" y1="24" x2="22" y2="14.5" {...s} strokeWidth="2" />
          <circle cx="16" cy="24" r="2.2" fill={color} stroke="none" />
        </svg>
      )
    case 'laurel':
      return (
        <svg viewBox="0 0 32 32" className={size}>
          <path d="M 9 27 C 4.5 22, 4.5 13, 10 7" {...s} />
          <path d="M 6.5 21 C 8.5 21.5, 10.5 20, 11 18" {...s} />
          <path d="M 5.2 16 C 7.5 16.5, 9.5 14.5, 10.2 13" {...s} />
          <path d="M 6.5 10.5 C 8.5 11, 10 9, 10.7 7.5" {...s} />
          <path d="M 23 27 C 27.5 22, 27.5 13, 22 7" {...s} />
          <path d="M 25.5 21 C 23.5 21.5, 21.5 20, 21 18" {...s} />
          <path d="M 26.8 16 C 24.5 16.5, 22.5 14.5, 21.8 13" {...s} />
          <path d="M 25.5 10.5 C 23.5 11, 22 9, 21.3 7.5" {...s} />
          <path
            d="M 16 11 L 17.2 14.2 L 20.5 14.5 L 18 16.8 L 18.8 20 L 16 18.3 L 13.2 20 L 14 16.8 L 11.5 14.5 L 14.8 14.2 Z"
            {...s}
          />
          <line x1="13" y1="27" x2="19" y2="27" {...s} />
        </svg>
      )
  }
}

export function Incluso() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="incluso" className="py-20 lg:py-28 bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="05" label="O que está incluso" />

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-4 lg:gap-y-0 items-end">
          <h2 className="col-span-12 lg:col-span-8 display text-ink text-[clamp(34px,5vw,72px)] leading-[0.95]">
            O que você recebe{' '}
            <em
              className="italic-display text-brand-accent"
              style={{ fontStyle: 'italic' }}
            >
              quando entra
            </em>{' '}
            na assessoria
          </h2>
          <p className="col-span-12 lg:col-span-4 text-ink/75 text-[18px] lg:text-[20px] font-normal leading-[1.4] lg:pb-2">
            Tudo o que está dentro do plano, sem letra miúda.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="mt-14 lg:mt-16 grid grid-cols-12 gap-3 lg:gap-4 lg:auto-rows-[minmax(240px,1fr)]">
          {items.map((item, i) => {
            const isDestaque = item.destaque
            const isHovered = hovered === item.n
            const isOtherHovered = hovered !== null && hovered !== item.n
            const iconColor = isDestaque ? '#77CDDE' : '#053A44'

            return (
              <motion.div
                key={item.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.75,
                  delay: i * 0.08,
                  ease,
                }}
                onMouseEnter={() => setHovered(item.n)}
                onMouseLeave={() => setHovered(null)}
                className={`relative col-span-12 ${item.span} ${
                  isDestaque
                    ? 'bg-ink text-canvas'
                    : 'bg-canvas border border-ink/10'
                } rounded-2xl p-6 lg:p-8 group overflow-hidden cursor-default flex flex-col min-h-[240px]`}
              >
                {/* gradient hover */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.55, ease }}
                  className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-brand-accent/14 via-brand-accent/0 to-transparent"
                />

                {/* barra ciano à esquerda */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={{ scaleY: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-accent origin-top pointer-events-none rounded-l-2xl"
                />

                {/* decoração sutil no destaque — anéis concêntricos no canto */}
                {isDestaque && (
                  <>
                    <div
                      aria-hidden
                      className="absolute -bottom-24 -right-24 size-72 rounded-full border border-brand-accent/15 pointer-events-none"
                    />
                    <div
                      aria-hidden
                      className="absolute -bottom-16 -right-16 size-56 rounded-full border border-brand-accent/10 pointer-events-none"
                    />
                    <div
                      aria-hidden
                      className="absolute -bottom-8 -right-8 size-40 rounded-full border border-brand-accent/8 pointer-events-none"
                    />
                  </>
                )}

                <motion.div
                  animate={{ opacity: isOtherHovered ? 0.4 : 1 }}
                  transition={{ duration: 0.45, ease }}
                  className="relative flex flex-col h-full"
                >
                  {/* top — número + check */}
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`marker text-[11px] ${
                        isDestaque ? 'text-brand-accent' : 'text-ink/45'
                      }`}
                    >
                      {item.n}
                    </span>
                    <span
                      className={`marker text-[10px] ${
                        isDestaque ? 'text-canvas/40' : 'text-ink/25'
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  {/* ícone */}
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                      rotate: isHovered ? -4 : 0,
                    }}
                    transition={{ duration: 0.6, ease }}
                    className={`origin-center ${isDestaque ? 'mt-10' : 'mt-7'}`}
                  >
                    <motion.div
                      animate={{
                        boxShadow: isHovered
                          ? '0 0 0 1px rgba(119, 205, 222, 0.5), 0 12px 32px -12px rgba(119, 205, 222, 0.45)'
                          : isDestaque
                            ? '0 0 0 1px rgba(119, 205, 222, 0.2), 0 0 0 0 rgba(0,0,0,0)'
                            : '0 0 0 1px rgba(14, 14, 12, 0.08), 0 0 0 0 rgba(0,0,0,0)',
                      }}
                      transition={{ duration: 0.5, ease }}
                      className={`inline-flex items-center justify-center rounded-full ${
                        isDestaque
                          ? 'size-16 bg-canvas/[0.04]'
                          : 'size-14 bg-paper/70'
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        color={iconColor}
                        size={isDestaque ? 'size-9' : 'size-8'}
                      />
                    </motion.div>
                  </motion.div>

                  {/* título + desc pinned na base */}
                  <div className="mt-auto pt-8">
                    <motion.h3
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ duration: 0.5, ease }}
                      className={`display leading-tight ${
                        isDestaque
                          ? 'text-canvas text-[26px] lg:text-[32px]'
                          : 'text-ink text-[20px] lg:text-[22px]'
                      }`}
                    >
                      {item.titulo}
                    </motion.h3>
                    <p
                      className={`mt-3 font-normal leading-[1.45] ${
                        isDestaque
                          ? 'text-canvas/70 text-[15px] lg:text-[16px]'
                          : 'text-ink/65 text-[14px] lg:text-[15px]'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
