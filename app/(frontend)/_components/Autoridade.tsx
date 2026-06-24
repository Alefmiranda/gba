import { SectionLabel } from './SectionLabel'

const conquistas = [
  '[Conquista 1: Guilherme preenche]',
  '[Conquista 2: Guilherme preenche]',
  '[Conquista 3: Guilherme preenche]',
]

export function Autoridade() {
  return (
    <section id="sobre" className="py-20 lg:py-28 bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="10" label="Por que com o Guilherme" />

        <div className="mt-10 grid grid-cols-12 gap-x-4 lg:gap-x-6 items-stretch">
          {/* foto vertical 4 cols */}
          <div className="col-span-12 lg:col-span-4">
            <div className="relative h-full min-h-[420px] lg:min-h-[560px] rounded-2xl overflow-hidden bg-ink grain">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(160deg, #032930 0%, #053A44 45%, #0e0e0c 100%)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, rgba(119,205,222,0.3), transparent 55%)',
                }}
              />
            </div>
          </div>

          {/* texto 8 cols */}
          <div className="col-span-12 lg:col-span-8 lg:pl-6 mt-6 lg:mt-0">
            <h2 className="display text-ink text-[clamp(34px,4.8vw,68px)] leading-[0.95]">
              Treinador que treina{' '}
              <em
                className="italic-display text-brand-accent"
                style={{ fontStyle: 'italic' }}
              >
                como atleta.
              </em>{' '}
              E te treina como um.
            </h2>

            <div className="mt-8 grid grid-cols-12 gap-x-4 lg:gap-x-6">
              <div className="col-span-12 lg:col-span-7">
                <p className="text-ink/80 text-[17px] lg:text-[18px] font-normal leading-[1.5]">
                  Não vim do escritório pra prancheta. Vim da pista. Compito em alto nível e levo
                  pra dentro da assessoria os mesmos princípios que uso na minha preparação:
                  periodização, controle de carga, leitura de corpo, estratégia de prova.
                </p>
                <p className="mt-5 text-ink/65 text-[17px] lg:text-[18px] font-normal leading-[1.5]">
                  Você não recebe um treino baseado em teoria. Recebe um plano testado em quem
                  precisa entregar resultado no dia da prova.
                </p>
              </div>

              <div className="col-span-12 lg:col-span-5 mt-6 lg:mt-0">
                <div className="border-t border-ink/15 pt-4">
                  <div className="marker text-ink/45 text-[10px] mb-4">Conquistas</div>
                  <ul className="space-y-3">
                    {conquistas.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 marker text-ink/55 text-[11px] italic"
                      >
                        <span className="text-brand-accent not-italic">★</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
