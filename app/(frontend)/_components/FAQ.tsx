'use client'

import { useState } from 'react'
import { SectionLabel } from './SectionLabel'

const faqs = [
  {
    q: 'Sou iniciante. Vou conseguir acompanhar?',
    a: 'Sim. O plano é montado a partir do seu ponto de partida. Iniciante começa como iniciante, com volume seguro e progressão respeitada.',
  },
  {
    q: 'Já corro há anos. Vale a pena?',
    a: 'Vale ainda mais. Atleta experiente costuma travar exatamente por treinar sempre igual. O ajuste fino de carga e periodização é o que destrava o próximo nível.',
  },
  {
    q: 'Como é o acompanhamento sendo online?',
    a: 'Você recebe a planilha, executa e reporta. Suporte direto pra dúvidas, ajustes na rotina e mudanças no plano. Próximo, sem ser invasivo.',
  },
  {
    q: 'Preciso de academia ou equipamento?',
    a: 'Não. O essencial é o tênis e a disposição. Qualquer reforço extra entra como complemento, não como obrigação.',
  },
  {
    q: 'Em quanto tempo vejo resultado?',
    a: 'Os primeiros sinais (disposição, ritmo, recuperação) aparecem em semanas. Resultado de prova depende do ciclo. Por isso o trimestral e o semestral entregam mais.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 lg:py-28 bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="14" label="Perguntas frequentes" />

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 items-start">
          <h2 className="col-span-12 lg:col-span-5 display text-ink text-[clamp(32px,4.5vw,60px)] leading-[0.95] lg:sticky lg:top-10">
            Perguntas{' '}
            <em
              className="italic-display text-brand-accent"
              style={{ fontStyle: 'italic' }}
            >
              frequentes.
            </em>
          </h2>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6 mt-6 lg:mt-0">
            <div className="border-t border-ink/15">
              {faqs.map((item, i) => {
                const isOpen = open === i
                return (
                  <div key={i} className="border-b border-ink/15">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                    >
                      <div className="flex items-center gap-5">
                        <span className="marker text-ink/40 text-[10px] w-6">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`display text-[18px] lg:text-[20px] leading-tight ${
                            isOpen ? 'text-ink' : 'text-ink/85 group-hover:text-ink'
                          }`}
                        >
                          {item.q}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 marker text-[14px] ${
                          isOpen ? 'text-brand-accent rotate-45' : 'text-ink/50'
                        } transition`}
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-6 pl-11 pr-8">
                        <p className="text-ink/75 text-[16px] lg:text-[18px] font-normal leading-[1.5]">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
