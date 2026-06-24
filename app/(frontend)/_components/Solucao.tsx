'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Button } from './Button'
import { SectionLabel } from './SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

export function Solucao() {
  return (
    <section id="metodo" className="py-20 lg:py-28 bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="04" label="A solução" />

        <h2 className="display text-ink text-[clamp(34px,5.5vw,80px)] leading-[0.95] max-w-5xl">
          Um treinador.
          <br />
          Um plano{' '}
          <em
            className="italic-display text-brand-accent"
            style={{ fontStyle: 'italic' }}
          >
            só seu.
          </em>
          <br />
          Evolução que dá pra medir.
        </h2>

        <div className="mt-16 lg:mt-24 grid grid-cols-12 gap-x-4 lg:gap-x-12 items-center">
          <div className="col-span-12 lg:col-span-7">
            <EvolucaoChart />
          </div>

          <div className="col-span-12 lg:col-span-5 mt-10 lg:mt-0">
            {/* bloco superior — parágrafos */}
            <div>
              <p className="text-ink/85 text-[17px] lg:text-[18px] font-normal leading-[1.55]">
                Aqui não tem planilha pronta. Cada treino é montado a partir do{' '}
                <em className="text-ink">seu</em> objetivo, do{' '}
                <em className="text-ink">seu</em> condicionamento atual, da{' '}
                <em className="text-ink">sua</em> rotina e do{' '}
                <em className="text-ink">seu</em> histórico no esporte.
              </p>
              <p className="mt-5 text-ink/70 text-[17px] lg:text-[18px] font-normal leading-[1.55]">
                A carga é ajustada na medida certa, o suficiente pra te tirar da zona de conforto,
                sem te quebrar.
              </p>
            </div>

            {/* comparação visual — barras horizontais com brilho deslizante */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease }}
              className="mt-9 space-y-5"
            >
              <div>
                <span className="marker text-[10px] text-ink/45 mb-2 inline-block">Sozinho</span>
                <div className="h-2.5 w-full rounded-full bg-ink/10 overflow-hidden">
                  <div
                    className="relative h-full rounded-full bg-ink/30 overflow-hidden"
                    style={{ width: '38%' }}
                  >
                    <span aria-hidden className="bar-sheen absolute inset-0 opacity-40" />
                  </div>
                </div>
              </div>
              <div>
                <span className="marker text-[10px] text-brand-accent mb-2 inline-block">Com método</span>
                <div className="h-2.5 w-full rounded-full bg-ink/10 overflow-hidden">
                  <div className="relative h-full rounded-full bg-brand-accent overflow-hidden">
                    <span aria-hidden className="bar-sheen absolute inset-0" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* marker quote */}
            <p className="mt-9 marker text-brand text-[11px] border-t border-ink/15 pt-5">
              Você corre com método. E com alguém acompanhando cada passo.
            </p>

            {/* CTA */}
            <div className="mt-7">
              <Button href="#contato" variant="primary-dark" size="md">
                Quero meu treino
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EvolucaoChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  const PAD_L = 48
  const PAD_R = 80
  const PAD_T = 50
  const PAD_B = 60
  const W = 700
  const H = 420

  const antesPath = `M ${PAD_L} ${H - PAD_B - 30} C ${PAD_L + 120} ${H - PAD_B - 70}, ${PAD_L + 240} ${H - PAD_B - 100}, ${PAD_L + 320} ${H - PAD_B - 95} S ${PAD_L + 500} ${H - PAD_B - 70}, ${W - PAD_R} ${H - PAD_B - 60}`

  const gbPath = `M ${PAD_L} ${H - PAD_B - 30} C ${PAD_L + 100} ${H - PAD_B - 80}, ${PAD_L + 200} ${H - PAD_B - 150}, ${PAD_L + 300} ${H - PAD_B - 200} S ${PAD_L + 500} ${H - PAD_B - 280}, ${W - PAD_R} ${H - PAD_B - 330}`

  const gbAreaPath = `${gbPath} L ${W - PAD_R} ${H - PAD_B} L ${PAD_L} ${H - PAD_B} Z`

  const antesEnd = { x: W - PAD_R, y: H - PAD_B - 60 }
  const gbEnd = { x: W - PAD_R, y: H - PAD_B - 330 }

  const gridLines = [PAD_T + 40, PAD_T + 110, PAD_T + 180, PAD_T + 250]

  const checkpoints = [
    { x: PAD_L + 165, y: H - PAD_B - 110, delay: 1.6 },
    { x: PAD_L + 325, y: H - PAD_B - 210, delay: 2.0 },
    { x: PAD_L + 485, y: H - PAD_B - 275, delay: 2.4 },
  ]

  // helper pra construir animate prop baseado em inView
  const a = <T,>(when: T): T => (inView ? when : ({} as T))

  return (
    <div ref={ref} className="relative">
      <div className="relative rounded-2xl border border-ink/8 bg-paper/30 p-4 lg:p-6 overflow-hidden">
        {/* status row acima do gráfico */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={a({ opacity: 1, y: 0 })}
          transition={{ duration: 0.6, ease }}
          className="flex items-center justify-between mb-3 px-2"
        >
          <span className="marker text-[10px] text-ink/55">Evolução</span>
          <span className="flex items-center gap-2 marker text-[10px] text-ink/55">
            <span className="size-1.5 rounded-full bg-brand-accent animate-pulse" />
            Comparativo
          </span>
        </motion.div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          aria-label="Gráfico de evolução: sozinho vs com método"
        >
          <defs>
            <linearGradient id="gb-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(119, 205, 222)" stopOpacity="0.35" />
              <stop offset="60%" stopColor="rgb(119, 205, 222)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="rgb(119, 205, 222)" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="shimmer-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(245, 242, 236)" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(245, 242, 236)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="rgb(245, 242, 236)" stopOpacity="0" />
            </linearGradient>

            <mask id="shimmer-mask">
              <rect width={W} height={H} fill="black" />
              <path d={gbPath} stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
            </mask>
          </defs>

          {/* grid horizontal */}
          {gridLines.map((y, i) => (
            <motion.line
              key={i}
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 8"
              className="text-ink/15"
              initial={{ opacity: 0 }}
              animate={a({ opacity: 1 })}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease }}
            />
          ))}

          {/* eixo X */}
          <motion.line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={H - PAD_B}
            y2={H - PAD_B}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ink/30"
            initial={{ pathLength: 0 }}
            animate={a({ pathLength: 1 })}
            transition={{ duration: 1.0, ease }}
          />

          {/* eixo Y */}
          <motion.line
            x1={PAD_L}
            x2={PAD_L}
            y1={PAD_T}
            y2={H - PAD_B}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ink/30"
            initial={{ pathLength: 0 }}
            animate={a({ pathLength: 1 })}
            transition={{ duration: 0.9, ease }}
          />

          {/* labels eixos */}
          <motion.text
            x={PAD_L}
            y={PAD_T - 14}
            textAnchor="start"
            className="fill-ink/45"
            style={{ font: '500 10px var(--font-mono), monospace', letterSpacing: '0.1em' }}
            initial={{ opacity: 0 }}
            animate={a({ opacity: 1 })}
            transition={{ duration: 0.5, delay: 1.0, ease }}
          >
            PERFORMANCE
          </motion.text>
          <motion.text
            x={W - PAD_R}
            y={H - PAD_B + 24}
            textAnchor="end"
            className="fill-ink/45"
            style={{ font: '500 10px var(--font-mono), monospace', letterSpacing: '0.1em' }}
            initial={{ opacity: 0 }}
            animate={a({ opacity: 1 })}
            transition={{ duration: 0.5, delay: 1.1, ease }}
          >
            TEMPO →
          </motion.text>

          {/* área preenchida sob curva GB */}
          <motion.path
            d={gbAreaPath}
            fill="url(#gb-area-gradient)"
            initial={{ opacity: 0 }}
            animate={a({ opacity: 1 })}
            transition={{ duration: 1.2, delay: 1.8, ease }}
          />

          {/* curva "Sozinho" tracejada */}
          <motion.path
            d={antesPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 5"
            className="text-ink/40"
            initial={{ pathLength: 0 }}
            animate={a({ pathLength: 1 })}
            transition={{ duration: 1.6, delay: 0.3, ease }}
          />

          {/* marcador final "Sozinho" */}
          <motion.circle
            cx={antesEnd.x}
            cy={antesEnd.y}
            r="5"
            fill="rgb(245, 242, 236)"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ink/50"
            initial={{ opacity: 0, scale: 0 }}
            animate={a({ opacity: 1, scale: 1 })}
            transition={{ duration: 0.5, delay: 1.7, ease }}
          />

          {/* label "SOZINHO" */}
          <motion.text
            x={antesEnd.x - 14}
            y={antesEnd.y - 12}
            textAnchor="end"
            className="fill-ink/55"
            style={{ font: '500 11px var(--font-mono), monospace', letterSpacing: '0.1em' }}
            initial={{ opacity: 0, y: 4 }}
            animate={a({ opacity: 1, y: 0 })}
            transition={{ duration: 0.6, delay: 1.85, ease }}
          >
            SOZINHO
          </motion.text>

          {/* glow camada inferior curva GB */}
          <motion.path
            d={gbPath}
            fill="none"
            stroke="rgb(119, 205, 222)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.25"
            style={{ filter: 'blur(8px)' }}
            initial={{ pathLength: 0 }}
            animate={a({ pathLength: 1 })}
            transition={{ duration: 2.0, delay: 0.9, ease }}
          />
          {/* curva GB principal */}
          <motion.path
            d={gbPath}
            fill="none"
            stroke="rgb(119, 205, 222)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={a({ pathLength: 1 })}
            transition={{ duration: 2.0, delay: 0.9, ease }}
          />

          {/* shimmer movendo ao longo da curva */}
          {inView && (
            <motion.rect
              x={-200}
              y={0}
              width={200}
              height={H}
              fill="url(#shimmer-gradient)"
              mask="url(#shimmer-mask)"
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: [-200, W + 200], opacity: 1 }}
              transition={{
                x: { duration: 3.5, repeat: Infinity, ease: 'linear', delay: 3.0 },
                opacity: { duration: 0.4, delay: 3.0, ease },
              }}
            />
          )}

          {/* checkpoints */}
          {checkpoints.map((cp, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={a({ opacity: 1, scale: 1 })}
              transition={{ duration: 0.5, delay: cp.delay, ease }}
              style={{ transformOrigin: `${cp.x}px ${cp.y}px` }}
            >
              <circle cx={cp.x} cy={cp.y} r="6" fill="rgb(245, 242, 236)" />
              <circle cx={cp.x} cy={cp.y} r="3.5" fill="rgb(119, 205, 222)" />
            </motion.g>
          ))}

          {/* marcador final "Com método" com pulso infinito */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={a({ opacity: 1, scale: 1 })}
            transition={{ duration: 0.6, delay: 2.7, ease }}
            style={{ transformOrigin: `${gbEnd.x}px ${gbEnd.y}px` }}
          >
            {inView && (
              <motion.circle
                cx={gbEnd.x}
                cy={gbEnd.y}
                r="16"
                fill="none"
                stroke="rgb(119, 205, 222)"
                strokeWidth="1.5"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: [1, 2.6, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 3.2 }}
                style={{ transformOrigin: `${gbEnd.x}px ${gbEnd.y}px` }}
              />
            )}
            <circle cx={gbEnd.x} cy={gbEnd.y} r="9" fill="rgb(119, 205, 222)" />
            <circle cx={gbEnd.x} cy={gbEnd.y} r="3.5" fill="rgb(245, 242, 236)" />
          </motion.g>

          {/* label "COM MÉTODO" */}
          <motion.text
            x={gbEnd.x - 22}
            y={gbEnd.y - 14}
            textAnchor="end"
            className="fill-brand font-semibold"
            style={{ font: '600 12px var(--font-mono), monospace', letterSpacing: '0.1em' }}
            initial={{ opacity: 0, y: 4 }}
            animate={a({ opacity: 1, y: 0 })}
            transition={{ duration: 0.6, delay: 2.9, ease }}
          >
            COM MÉTODO
          </motion.text>

          {/* delta vertical entre pontos finais */}
          <motion.line
            x1={W - PAD_R - 35}
            x2={W - PAD_R - 35}
            y1={gbEnd.y + 14}
            y2={antesEnd.y - 8}
            stroke="rgb(119, 205, 222)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={a({ pathLength: 1, opacity: 0.6 })}
            transition={{ duration: 0.8, delay: 3.0, ease }}
          />

          {/* setinhas no delta */}
          <motion.g
            stroke="rgb(119, 205, 222)"
            strokeWidth="1.5"
            fill="none"
            initial={{ opacity: 0 }}
            animate={a({ opacity: 0.6 })}
            transition={{ duration: 0.4, delay: 3.4, ease }}
          >
            <path
              d={`M ${W - PAD_R - 39} ${gbEnd.y + 19} L ${W - PAD_R - 35} ${gbEnd.y + 14} L ${W - PAD_R - 31} ${gbEnd.y + 19}`}
            />
          </motion.g>
        </svg>

        {/* legenda inferior */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={a({ opacity: 1, y: 0 })}
          transition={{ duration: 0.7, delay: 3.6, ease }}
          className="mt-3 flex items-center gap-8 marker text-[10px] text-ink/55 px-2"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block w-7 h-px border-t-2 border-dashed border-ink/45" />
            Treino sozinho
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-7 h-[3px] bg-brand-accent rounded-full" />
            Com acompanhamento
          </span>
        </motion.div>
      </div>
    </div>
  )
}
