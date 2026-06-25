'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { SectionLabel } from './SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

const items = [
  {
    n: '01',
    titulo: 'Primeira prova',
    desc: 'Fechar seu primeiro 5K, 10K, meia ou maratona com plano de verdade.',
  },
  {
    n: '02',
    titulo: 'Pace travado',
    desc: 'Já corre, mas empacou no mesmo tempo há meses.',
  },
  {
    n: '03',
    titulo: 'Voltando a treinar',
    desc: 'Retome os treinos com segurança, consistência e progressão adequada.',
  },
  {
    n: '04',
    titulo: 'Pódio',
    desc: 'Buscar resultado real e precisar de carga sob medida.',
  },
]

// headline frases - quebradas em "tokens" pra animar
const headlineTokens = [
  { text: 'Para quem corre ou quer começar a correr', italic: false },
  { text: 'levando a sério.', italic: true },
]

export function ParaQuemE() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  // barra vertical de progresso à esquerda da lista
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 70%', 'end 30%'],
  })
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      id="pra-quem-e"
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-canvas overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="02" label="Para quem é" />

        {/* Headline em 2 tokens com animação por palavra */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="display text-ink text-[clamp(34px,5vw,72px)] max-w-3xl leading-[1.05]"
        >
          {headlineTokens.map((token, ti) => (
            <span
              key={ti}
              className={`inline-block ${ti > 0 ? 'ml-3' : ''}`}
            >
              {token.text.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  variants={{
                    hidden: { opacity: 0, y: '0.45em' },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.7,
                        delay: ti * 0.4 + wi * 0.06,
                        ease,
                      },
                    },
                  }}
                  className={`inline-block mr-[0.25em] ${
                    token.italic
                      ? 'italic-display text-brand-accent relative'
                      : ''
                  }`}
                  style={token.italic ? { fontStyle: 'italic' } : undefined}
                >
                  {word}
                  {/* underline desenhando após a palavra italic */}
                  {token.italic && wi === token.text.split(' ').length - 1 && (
                    <motion.span
                      aria-hidden
                      variants={{
                        hidden: { scaleX: 0 },
                        show: {
                          scaleX: 1,
                          transition: {
                            duration: 0.9,
                            delay: 1.4,
                            ease,
                          },
                        },
                      }}
                      className="absolute left-0 right-0 -bottom-1 h-[3px] bg-brand-accent/60 origin-left"
                    />
                  )}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h2>

        {/* === LISTA com animações dramáticas === */}
        <div
          ref={listRef}
          className="relative mt-14 lg:mt-20"
          onMouseLeave={() => setHovered(null)}
        >
          {/* barra vertical de progresso à esquerda — sutil */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-ink/8 block">
            <motion.div
              style={{ height: progressHeight }}
              className="w-px bg-brand-accent origin-top"
            />
          </div>

          {/* divider topo desenhando */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="h-px w-full bg-ink/15 origin-left"
          />

          {items.map((item, i) => {
            const isHovered = hovered === i
            const isOtherHovered = hovered !== null && hovered !== i
            return (
              <motion.article
                key={item.n}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                onMouseEnter={() => setHovered(i)}
                className="relative group"
              >
                {/* faixa ciano deslizando no hover */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={{
                    scaleX: isHovered ? 1 : 0,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute inset-0 origin-left bg-gradient-to-r from-brand-accent/15 via-brand-accent/8 to-transparent pointer-events-none"
                />

                {/* border-left ciano no hover */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={{
                    scaleY: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease }}
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-accent origin-top pointer-events-none"
                />

                <motion.div
                  animate={{
                    opacity: isOtherHovered ? 0.35 : 1,
                  }}
                  transition={{ duration: 0.5, ease }}
                  className="relative grid grid-cols-12 gap-x-4 lg:gap-x-6 py-8 lg:py-10 items-center pl-5 lg:pl-0"
                >
                  {/* número 01-04 */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.7, delay: i * 0.12 + 0.1, ease },
                      },
                    }}
                    className="col-span-2 lg:col-span-1 lg:pl-6"
                  >
                    <motion.span
                      animate={{
                        color: isHovered
                          ? 'rgb(119, 205, 222)'
                          : 'rgba(14, 14, 12, 0.45)',
                        scale: isHovered ? 1.4 : 1,
                      }}
                      transition={{ duration: 0.5, ease }}
                      className="inline-block marker text-[11px] tabular-nums origin-left"
                    >
                      {item.n}
                    </motion.span>
                  </motion.div>

                  {/* título com mask reveal */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { duration: 0.7, delay: i * 0.12 + 0.2, ease },
                      },
                    }}
                    className="col-span-10 lg:col-span-5 overflow-hidden"
                  >
                    <motion.h3
                      variants={{
                        hidden: { y: '100%' },
                        show: {
                          y: 0,
                          transition: { duration: 0.9, delay: i * 0.12 + 0.2, ease },
                        },
                      }}
                      animate={{
                        x: isHovered ? 8 : 0,
                      }}
                      transition={{ duration: 0.5, ease }}
                      className="display text-ink text-[clamp(24px,3vw,40px)] leading-tight"
                    >
                      {item.titulo}
                    </motion.h3>
                  </motion.div>

                  {/* descrição com fade */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.7, delay: i * 0.12 + 0.35, ease },
                      },
                    }}
                    className="col-span-12 lg:col-span-5 lg:col-start-7 mt-3 lg:mt-0"
                  >
                    <p className="text-ink/75 text-[18px] lg:text-[20px] font-normal leading-[1.4]">
                      {item.desc}
                    </p>
                  </motion.div>

                  {/* seta */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, scale: 0.5, rotate: -45 },
                      show: {
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        transition: { duration: 0.6, delay: i * 0.12 + 0.5, ease },
                      },
                    }}
                    animate={{
                      x: isHovered ? -8 : 0,
                      rotate: isHovered ? 45 : 0,
                      scale: isHovered ? 1.3 : 1,
                      color: isHovered
                        ? 'rgb(119, 205, 222)'
                        : 'rgba(14, 14, 12, 0.3)',
                    }}
                    transition={{ duration: 0.5, ease }}
                    className="flex col-span-12 lg:col-span-1 justify-end mt-2 lg:mt-0 lg:pr-6"
                  >
                    <span className="marker text-[16px] lg:text-[14px] inline-block text-brand-accent lg:text-current">↗</span>
                  </motion.div>
                </motion.div>

                {/* divider entre itens */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.1 + 0.2, ease }}
                  className="h-px w-full bg-ink/15 origin-left"
                />
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
