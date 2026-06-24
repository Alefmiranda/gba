'use client'

import { motion } from 'motion/react'
import { Button } from './Button'
import { SectionLabel } from './SectionLabel'
import { whatsappLink, whatsappMsgPlano } from '../_lib/contato'

const ease = [0.22, 1, 0.36, 1] as const

type Plano = {
  nome: string
  preco: number
  mensalEquiv: number | null
  economiaMes: number
  tagline: string
  recursos: string[]
  destaque: boolean
}

type PlanoCms = {
  nome: string
  preco: number
  mensalEquiv: number | null
  tagline: string
  recursos: string[]
  destaque: boolean
}

const planosFallback: Plano[] = [
  {
    nome: 'Mensal',
    preco: 189.9,
    mensalEquiv: 189.9,
    economiaMes: 0,
    tagline: 'Pra experimentar o método.',
    recursos: ['Plano individual', 'Suporte direto', 'Atualização da planilha'],
    destaque: false,
  },
  {
    nome: 'Trimestral',
    preco: 519.9,
    mensalEquiv: 173.3,
    economiaMes: 17,
    tagline: 'Pra ver resultado de verdade.',
    recursos: ['Tudo do mensal', 'Ciclo completo de evolução', 'Periodização estruturada'],
    destaque: true,
  },
  {
    nome: 'Semestral',
    preco: 949.9,
    mensalEquiv: 158.32,
    economiaMes: 32,
    tagline: 'Pra transformação real.',
    recursos: ['Tudo dos anteriores', 'Preparação completa pra prova', 'Acompanhamento de ciclo longo'],
    destaque: false,
  },
]

export function Planos({ planosCms }: { planosCms?: PlanoCms[] }) {
  const planos: Plano[] =
    planosCms && planosCms.length > 0
      ? planosCms.map((p) => ({
          ...p,
          // economia/mês vs mensalidade do 1º plano (cálculo, não inventado)
          economiaMes:
            p.mensalEquiv != null && planosCms[0]?.preco
              ? Math.round(planosCms[0].preco - p.mensalEquiv)
              : 0,
        }))
      : planosFallback
  return (
    <section id="planos" className="py-20 lg:py-28 bg-paper overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="11" label="Planos" />

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-4 lg:gap-y-0 items-end">
          <h2 className="col-span-12 lg:col-span-8 display text-ink text-[clamp(34px,5vw,72px)] leading-[0.95]">
            Escolha o plano que combina com{' '}
            <em
              className="italic-display text-brand-accent"
              style={{ fontStyle: 'italic' }}
            >
              seu compromisso.
            </em>
          </h2>
          <p className="col-span-12 lg:col-span-4 text-ink/75 text-[18px] lg:text-[20px] font-normal leading-[1.4] lg:pb-2">
            Mesma metodologia em todos. A duração muda a profundidade do trabalho.
          </p>
        </div>

        {/* CARDS */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {planos.map((p, i) => {
            const isDestaque = p.destaque
            const reais = Math.floor(p.preco)
            const centavos = Math.round((p.preco - reais) * 100)
              .toString()
              .padStart(2, '0')
            const mensalBase = planos[0]?.preco ?? p.preco
            const meses = p.mensalEquiv ? Math.round(p.preco / p.mensalEquiv) : 1
            return (
              <motion.div
                key={p.nome}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.75, delay: i * 0.1, ease }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl p-7 lg:p-9 flex flex-col transition-shadow duration-500 ${
                  isDestaque
                    ? 'bg-ink text-canvas shadow-[0_40px_90px_-30px_rgba(5,58,68,0.55)] lg:-mt-6 lg:mb-0 z-10'
                    : 'bg-canvas border border-ink/10 hover:shadow-[0_30px_70px_-35px_rgba(14,14,12,0.35)]'
                }`}
              >
                {/* badge flutuante no destaque */}
                {isDestaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent text-ink px-4 py-1.5 marker text-[10px] shadow-lg">
                      <span className="size-1.5 rounded-full bg-ink animate-pulse" />
                      Mais escolhido
                    </span>
                  </div>
                )}

                {/* topo: nome */}
                <div className={`flex items-center justify-between ${isDestaque ? 'mt-2' : ''}`}>
                  <span
                    className={`marker text-[11px] ${
                      isDestaque ? 'text-brand-accent' : 'text-ink/45'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')} · {p.nome}
                  </span>
                  {/* pill de economia */}
                  {p.economiaMes > 0 && (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 marker text-[9px] ${
                        isDestaque
                          ? 'bg-brand-accent/15 text-brand-accent'
                          : 'bg-brand/8 text-brand'
                      }`}
                    >
                      Economize ~R$ {p.economiaMes}/mês
                    </span>
                  )}
                </div>

                {/* preço grande */}
                <div className="mt-7 flex items-end gap-1.5">
                  <span
                    className={`marker text-[14px] mb-3 ${
                      isDestaque ? 'text-canvas/55' : 'text-ink/45'
                    }`}
                  >
                    R$
                  </span>
                  <span
                    className={`display text-[64px] lg:text-[80px] leading-[0.8] tracking-tight tabular-nums ${
                      isDestaque ? 'text-canvas' : 'text-ink'
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {reais}
                  </span>
                  <span
                    className={`display text-[28px] lg:text-[34px] leading-none mb-1.5 tabular-nums ${
                      isDestaque ? 'text-canvas' : 'text-ink'
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    ,{centavos}
                  </span>
                </div>

                {/* cobrança */}
                {p.economiaMes > 0 ? (
                  <div className="mt-3">
                    <div
                      className={`marker text-[11px] ${
                        isDestaque ? 'text-brand-accent' : 'text-brand'
                      }`}
                    >
                      À vista · {meses} meses
                    </div>
                    <div
                      className={`mt-1.5 flex items-center gap-2 marker text-[10px] ${
                        isDestaque ? 'text-canvas/50' : 'text-ink/45'
                      }`}
                    >
                      <span
                        className={`line-through ${
                          isDestaque ? 'text-canvas/35' : 'text-ink/30'
                        }`}
                      >
                        R$ {mensalBase.toFixed(2).replace('.', ',')}/mês
                      </span>
                      <span>≈ R$ {(p.mensalEquiv ?? 0).toFixed(2).replace('.', ',')} / mês</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`mt-3 marker text-[11px] ${
                      isDestaque ? 'text-canvas/55' : 'text-ink/50'
                    }`}
                  >
                    por mês
                  </div>
                )}

                {/* divisor */}
                <div
                  className={`mt-7 h-px w-full ${
                    isDestaque ? 'bg-canvas/15' : 'bg-ink/10'
                  }`}
                />

                {/* recursos */}
                <ul className="mt-7 space-y-3.5 flex-1">
                  {p.recursos.map((r) => (
                    <li
                      key={r}
                      className={`flex items-start gap-3 text-[15px] lg:text-[16px] font-normal leading-[1.45] ${
                        isDestaque ? 'text-canvas/85' : 'text-ink/75'
                      }`}
                    >
                      <span
                        className={`shrink-0 mt-0.5 inline-flex items-center justify-center size-4 rounded-full ${
                          isDestaque ? 'bg-brand-accent text-ink' : 'bg-brand/10 text-brand'
                        }`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="size-2.5">
                          <path
                            d="M5 12l5 5L19 7"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                <p
                  className={`mt-8 italic text-[15px] lg:text-[16px] font-normal ${
                    isDestaque ? 'text-canvas/60' : 'text-ink/55'
                  }`}
                >
                  {p.tagline}
                </p>

                <div className="mt-6">
                  <Button
                    href={whatsappLink(whatsappMsgPlano(p.nome, `${reais},${centavos}`))}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant={isDestaque ? 'primary-light' : 'primary-dark'}
                  >
                    Começar {p.nome.toLowerCase()}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        <p className="mt-12 marker text-ink/50 text-[11px] text-center">
          Sem fidelidade engessada. Você fica porque está evoluindo.
        </p>
      </div>
    </section>
  )
}
