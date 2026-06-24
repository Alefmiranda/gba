'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Button } from './Button'

const ease = [0.22, 1, 0.36, 1] as const

export function CTAFinal() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="contato" className="bg-canvas">
      <div className="px-3 lg:px-4 pt-4 pb-8 lg:pb-12">
        {/* card arredondado (ideia do hero, não idêntico) */}
        <div ref={ref} className="relative rounded-3xl overflow-hidden min-h-[78vh] flex items-center text-canvas">
          {/* foto de fundo: parallax (camada) + Ken Burns (interno) */}
          <motion.div aria-hidden style={{ y: bgY }} className="absolute inset-x-0 -top-[10%] h-[120%]">
            <div className="absolute inset-0 kenburns">
              <Image
                src="/hero-equipe.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </motion.div>

          {/* overlay escuro pra leitura */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(14,14,12,0.85) 0%, rgba(14,14,12,0.7) 40%, rgba(5,41,48,0.8) 100%)',
            }}
          />

          {/* glow ciano atrás do título */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[45%] rounded-full bg-brand-accent/20 blur-[130px] pointer-events-none"
          />

          {/* grão analógico */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.22] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: '180px 180px',
            }}
          />

          {/* cantos técnicos (assinatura do hero, discreto) */}
          <div aria-hidden className="absolute inset-0 pointer-events-none z-20">
            <span className="absolute top-5 left-5 lg:top-7 lg:left-7 h-px w-6 bg-canvas/30" />
            <span className="absolute top-5 left-5 lg:top-7 lg:left-7 w-px h-6 bg-canvas/30" />
            <span className="absolute bottom-5 right-5 lg:bottom-7 lg:right-7 h-px w-6 bg-canvas/30" />
            <span className="absolute bottom-5 right-5 lg:bottom-7 lg:right-7 w-px h-6 bg-canvas/30" />
          </div>

          {/* conteúdo */}
          <div className="relative z-10 mx-auto max-w-[1400px] w-full px-6 lg:px-10 py-24 lg:py-28 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease }}
              className="inline-flex items-center gap-3 marker text-[10px] text-canvas/65"
            >
              <span className="size-1.5 rounded-full bg-brand-accent animate-pulse" />
              Última chamada
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, delay: 0.08, ease }}
              className="mt-8 display text-canvas text-[clamp(44px,8vw,140px)] leading-[0.9] tracking-[-0.04em] mx-auto max-w-[13ch]"
            >
              Sua próxima prova começa{' '}
              <em
                className="italic-display text-brand-accent"
                style={{ fontStyle: 'italic' }}
              >
                no próximo treino.
              </em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.18, ease }}
              className="mt-10 mx-auto max-w-2xl text-canvas/80 text-[18px] lg:text-[21px] font-normal leading-[1.5]"
            >
              Chega de planilha genérica. Chega de empacar.
              <span className="text-canvas/50"> Vamos montar o plano que vai te levar até lá.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.26, ease }}
              className="mt-12 flex flex-wrap items-center justify-center gap-5"
            >
              <Button href="#" variant="primary-light" size="lg">Falar com o Guilherme</Button>
              <Button href="#planos" variant="link" className="text-canvas">Ver planos</Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
