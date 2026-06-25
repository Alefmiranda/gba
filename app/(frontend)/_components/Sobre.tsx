'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { SectionLabel } from './SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

export function Sobre() {
  const photoRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ['start end', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  return (
    <section id="historia" className="py-20 lg:py-28 bg-canvas overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="12" label="Sobre o Guilherme" />

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-14 items-stretch">
          {/* FOTO — esquerda, altura cheia acompanhando o texto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease }}
            className="col-span-12 lg:col-span-5 mb-8 lg:mb-0"
          >
            <div ref={photoRef} className="relative h-[420px] lg:h-full min-h-[480px] rounded-2xl overflow-hidden bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src="/photos/foto-20.jpg"
                alt="Guilherme Borges em prova"
                style={{ y: photoY }}
                className="absolute inset-x-0 -top-[10%] w-full h-[120%] object-cover object-[50%_25%]"
              />
              {/* legenda dentro, canto inferior — discreta */}
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5 bg-gradient-to-t from-ink/70 to-transparent">
                <div className="flex items-center justify-between marker text-canvas/85 text-[10px]">
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-brand-accent" />
                    Em prova
                  </span>
                  <span className="text-canvas/55">GBA</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TEXTO — direita */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease }}
              className="display text-ink text-[clamp(30px,3.4vw,46px)] leading-[1.04] tracking-[-0.02em]"
            >
              Começou no esporte.
              <br />
              Continua no esporte.
              <br />
              <em
                className="italic-display text-brand-accent"
                style={{ fontStyle: 'italic' }}
              >
                Hoje leva mais gente junto.
              </em>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.14, ease }}
              className="mt-8 lg:mt-10 max-w-xl"
            >
              <p className="text-ink/80 text-[17px] lg:text-[18px] font-normal leading-[1.6]">
                Entrei na corrida com um objetivo claro: chegar ao alto nível. No caminho, vieram
                os resultados, a experiência e, junto com isso, as pessoas querendo entender como eu
                treinava. A assessoria nasceu de forma natural, da pista, das ruas, das provas e da
                vivência diária no esporte.
              </p>
              <p className="mt-5 text-ink/60 text-[16px] lg:text-[17px] font-normal leading-[1.6]">
                Hoje é um trabalho que cresce porque o resultado fala mais alto que a propaganda.
                Cada atleta tem um planejamento individual. Cada treino tem um propósito. E todo
                mundo aqui está em evolução constante.{' '}
                <em className="italic-display text-brand" style={{ fontStyle: 'italic' }}>
                  Eu inclusive.
                </em>
              </p>
              <p className="mt-5 text-ink/60 text-[16px] lg:text-[17px] font-normal leading-[1.6]">
                Aqui, eu não ensino corrida de fora. Eu continuo vivendo o esporte todos os dias.
              </p>
            </motion.div>

            {/* assinatura */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.24, ease }}
              className="mt-10 pt-6 border-t border-ink/15 flex items-center gap-4"
            >
              <div>
                <div className="display text-ink text-[18px] leading-tight">Guilherme Borges</div>
                <div className="marker text-ink/45 text-[10px] mt-1.5">Treinador · Atleta</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
