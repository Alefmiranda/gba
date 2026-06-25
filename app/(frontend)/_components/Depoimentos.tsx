'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { SectionLabel } from './SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

// fallbacks — usados só se a collection "depoimentos" estiver vazia
const FALLBACK_VIDEOS = [
  { id: 'lV4yOZOC1m0' }, // Thiago — destaque (primeiro)
  { id: '92InyxyRZxk' },
  { id: '5dXWzraUeGs' },
  { id: 'qf5zK6eZeZE' },
  { id: 'j0kmhfrj2mw' },
]

const FALLBACK_TEXTOS = [
  {
    nome: 'Morganna Salazar',
    destaque:
      'Vivi um processo leve, saudável e constante, aprendendo que evolução não acontece da noite para o dia.',
    paragrafos: [
      'Faço parte da assessoria do Guilherme Borges há 8 meses, e posso dizer, sem dúvidas, que ter o acompanhamento de um profissional experiente de perto faz toda a diferença.',
      'Muito mais do que resultados, vivi um processo leve, saudável e constante, aprendendo que evolução não acontece da noite para o dia. O Guilherme é um profissional excelente e comprometido com a evolução de cada atleta, acompanha tudo de perto, entende nossas dificuldades e sabe extrair o melhor que podemos dar em cada treino.',
      'Hoje, além da melhora na corrida, percebo o quanto ganhei confiança ao longo desse caminho. E olhar para trás, vendo toda a evolução construída com paciência e dedicação, é extremamente gratificante e recompensador! Tenho orgulho de fazer parte desse time!',
    ],
  },
  {
    nome: 'Gabriela Martins',
    destaque:
      'De uma mente ansiosa e de um físico sedentário para uma atleta de pódio geral em poucos meses.',
    paragrafos: [
      'De uma mente ansiosa e de um físico sedentário para uma atleta de pódio geral em poucos meses. Foi isso que o professor Guilherme me proporcionou.',
      'Com paciência, instruções valiosas, treinos e um atendimento personalizado, a assessoria me trouxe a disciplina necessária para alcançar resultados que eu nunca havia sequer sonhado. O professor enxergou em mim um potencial que nem eu mesma acreditava ter.',
      'Além dos resultados, ele me trouxe uma grande lição de vida: acreditar sempre que sou capaz.',
      'Sou grata por fazer parte deste time e por ter o suporte de um profissional ímpar como o Guilherme.',
    ],
  },
  {
    nome: 'Adriane Lima',
    destaque:
      'Meu 5 km atual é 24min37s (pace 4:55). Comecei correndo 5 km em 37min25s.',
    paragrafos: [
      'Comecei na corrida há cerca de um ano, inicialmente para melhorar meu condicionamento no CrossFit. Na época, eu não conseguia correr 2 km sem parar. Meu primeiro desafio foi completar 5 km — e consegui fazer em 37min25s (pace 7:29). Foi ali que percebi que queria evoluir de verdade.',
      'Depois de algumas tentativas, lesões e muitos aprendizados, entendi que precisava de orientação profissional. Foi então que comecei a treinar com o Guilherme, buscando evolução com consistência e estratégia.',
      'Mesmo acima do peso e enfrentando dificuldades no processo, continuei treinando com disciplina. O resultado veio: conquistei meu primeiro pódio e hoje completei uma transformação que parecia impossível no começo. Meu 5 km atual é 24min37s (pace 4:55).',
      'A corrida mudou minha vida. O que começou como uma necessidade virou superação, confiança e a prova de que somos capazes de ir muito além do que imaginamos.',
    ],
  },
  {
    nome: 'Alessandra Franco',
    destaque:
      'Em apenas 3 meses de acompanhamento, conquistei recordes pessoais em todas as distâncias que disputei.',
    paragrafos: [
      'Em apenas 3 meses de acompanhamento, conquistei recordes pessoais em todas as distâncias que disputei. Na meia maratona, evoluí de 1h49min42s para 1h40min34s. Nos 15 km, baixei de 1h16min21s para 1h09min13s. Já nos 10 km, melhorei de 46min20s para 45min27s.',
      'O acompanhamento individualizado, aliado à dedicação e ao conhecimento do professor Guilherme, tem sido fundamental para essa excelente fase que estou vivendo no esporte.',
      'É uma honra fazer parte desta equipe e ver, na prática, que um planejamento bem estruturado faz toda a diferença nos resultados.',
    ],
  },
]

function SingleQuote({
  textos,
  videosCount,
}: {
  textos: { nome: string; destaque: string; paragrafos: string[] }[]
  videosCount: number
}) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const current = textos[active]
  const total = textos.length

  const go = (dir: 1 | -1) => {
    setActive((i) => (i + dir + total) % total)
  }

  // keyboard nav
  useEffect(() => {
    if (open) return // não navega quando modal aberto
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="relative max-w-4xl mx-auto py-2 lg:py-4">
      <div className="flex items-center justify-center gap-3 lg:gap-8">
        {/* PREV */}
        <button
          onClick={() => go(-1)}
          aria-label="Anterior"
          className="shrink-0 size-11 lg:size-12 rounded-full border border-ink/15 bg-canvas hover:bg-ink hover:text-canvas hover:border-ink transition flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-4">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* QUOTE */}
        <div className="flex-1 min-h-[200px] lg:min-h-[180px] flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
            >
              <button
                onClick={() => setOpen(true)}
                className="block text-center group cursor-pointer"
                aria-label={`Ler depoimento completo de ${current.nome}`}
              >
                <p
                  className="italic-display text-ink text-[clamp(20px,3vw,38px)] leading-[1.25] tracking-[-0.015em] group-hover:text-ink/80 transition"
                  style={{ fontStyle: 'italic' }}
                >
                  <span className="text-brand-accent">“</span>
                  {current.destaque}
                  <span className="text-brand-accent">”</span>
                </p>

                <div className="mt-8 marker text-ink/55 text-[11px]">
                  — {current.nome}
                </div>

                <div className="mt-3 marker text-ink/35 group-hover:text-brand-accent text-[10px] transition">
                  Ler completo ↗
                </div>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NEXT */}
        <button
          onClick={() => go(1)}
          aria-label="Próximo"
          className="shrink-0 size-11 lg:size-12 rounded-full border border-ink/15 bg-canvas hover:bg-ink hover:text-canvas hover:border-ink transition flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-4">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* dots + counter */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <span className="marker text-ink/40 text-[10px] tabular-nums">
          {String(active + 1).padStart(2, '0')} /{' '}
          <span className="text-ink/25">{String(total).padStart(2, '0')}</span>
        </span>
        <div className="flex gap-2">
          {textos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Depoimento ${i + 1}`}
              className={`h-[2px] rounded-full transition-all duration-500 ${
                active === i
                  ? 'w-10 bg-brand-accent'
                  : 'w-5 bg-ink/15 hover:bg-ink/35'
              }`}
            />
          ))}
        </div>
      </div>

      {/* MODAL com texto completo */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-ink/85 backdrop-blur-md flex items-center justify-center p-4 lg:p-12 cursor-pointer"
          >
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-canvas rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 lg:p-12 cursor-default text-left"
            >
              {/* close */}
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="absolute top-4 right-4 size-9 rounded-full border border-ink/15 hover:bg-ink hover:text-canvas hover:border-ink transition flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-4">
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="marker text-brand-accent text-[10px] mb-3">
                ✦ Depoimento {String(videosCount + active + 1).padStart(2, '0')}
              </div>
              <h3 className="display text-ink text-[24px] lg:text-[28px] leading-tight">
                {current.nome}
              </h3>

              <div className="mt-8 space-y-4 text-ink/80 text-[15px] lg:text-[16px] font-normal leading-[1.65]">
                {current.paragrafos.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Depoimentos({
  videosCms,
  textosCms,
}: {
  videosCms?: { id: string }[]
  textosCms?: { nome: string; destaque: string; paragrafos: string[] }[]
} = {}) {
  const depoimentos = videosCms && videosCms.length ? videosCms : FALLBACK_VIDEOS
  const textos = textosCms && textosCms.length ? textosCms : FALLBACK_TEXTOS
  const [playing, setPlaying] = useState<string | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLDivElement>('[data-card]')
    const gap = 20
    const step = (card?.offsetWidth ?? 280) + gap
    el.scrollBy({ left: step * dir, behavior: 'smooth' })
  }

  return (
    <section id="depoimentos" className="py-20 lg:py-28 bg-canvas">
      <div className="mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10">
          <SectionLabel num="09" label="Depoimentos" />

          <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-4 lg:gap-y-0 items-end">
            <h2 className="col-span-12 lg:col-span-7 display text-ink text-[clamp(34px,5vw,72px)] leading-[0.95]">
              Resultado não se promete.{' '}
              <em
                className="italic-display text-brand-accent"
                style={{ fontStyle: 'italic' }}
              >
                Se mostra.
              </em>
            </h2>
            <p className="col-span-12 lg:col-span-3 text-ink/75 text-[18px] lg:text-[20px] font-normal leading-[1.4] lg:pb-2">
              A equipe é presença constante nos pódios das principais provas que disputa.
            </p>
            {/* setas de navegação — direita do header */}
            <div className="col-span-12 lg:col-span-2 flex lg:justify-end gap-3 lg:pb-2">
              <button
                onClick={() => scrollByCard(-1)}
                aria-label="Anterior"
                className="size-11 rounded-full border border-ink/20 bg-canvas hover:bg-ink hover:text-canvas hover:border-ink transition flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-4">
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => scrollByCard(1)}
                aria-label="Próximo"
                className="size-11 rounded-full border border-ink/20 bg-canvas hover:bg-ink hover:text-canvas hover:border-ink transition flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-4">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* CARROSSEL HORIZONTAL — formato Stories 9:16 */}
        <div className="mt-14 lg:mt-16 relative">
          <div
            ref={scrollerRef}
            className="flex gap-4 lg:gap-5 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-2 px-6 lg:px-10 scrollbar-hide"
          >
            {depoimentos.map((d, i) => (
              <motion.div
                key={d.id}
                data-card
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                className="relative flex-none w-[86vw] sm:w-[280px] lg:w-[300px] snap-start sm:snap-center"
              >
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-ink">
                  {playing === d.id ? (
                    <>
                      <iframe
                        src={`https://www.youtube.com/embed/${d.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${d.id}`}
                        className="absolute inset-0 w-full h-full"
                        title={`Depoimento ${String(i + 1).padStart(2, '0')}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button
                        aria-label="Fechar vídeo"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPlaying(null)
                        }}
                        className="absolute top-3 right-3 z-10 size-8 rounded-full bg-canvas/90 backdrop-blur-sm flex items-center justify-center hover:bg-canvas transition shadow"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="size-4 text-ink">
                          <path
                            d="M6 6L18 18M6 18L18 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setPlaying(d.id)}
                      className="group absolute inset-0 block"
                      aria-label={`Tocar depoimento ${String(i + 1).padStart(2, '0')}`}
                    >
                      {/* progress bar segments — visual de Stories */}
                      <div className="absolute top-3 left-3 right-3 z-10 flex gap-1">
                        {depoimentos.map((_, j) => (
                          <span
                            key={j}
                            className={`h-[2px] flex-1 rounded-full ${
                              j === i ? 'bg-canvas/85' : 'bg-canvas/25'
                            }`}
                          />
                        ))}
                      </div>

                      <Image
                        src={`https://i.ytimg.com/vi/${d.id}/hqdefault.jpg`}
                        alt={`Depoimento ${String(i + 1).padStart(2, '0')}`}
                        fill
                        sizes="(max-width: 768px) 280px, 300px"
                        className="object-cover scale-[1.6] transition-transform duration-700 group-hover:scale-[1.65]"
                        unoptimized
                      />
                      {/* gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-ink/15 via-transparent to-ink/85" />

                      {/* play button center */}
                      <span className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="size-16 rounded-full bg-canvas/95 backdrop-blur-sm flex items-center justify-center shadow-[0_0_0_8px_rgba(245,242,236,0.15)]"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-7 text-ink translate-x-0.5"
                          >
                            <path d="M8 5v14l11-7L8 5z" />
                          </svg>
                        </motion.span>
                      </span>

                      {/* footer marker */}
                      <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between marker text-canvas text-[10px]">
                        <span className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-brand-accent" />
                          {String(i + 1).padStart(2, '0')} / {String(depoimentos.length).padStart(2, '0')}
                        </span>
                        <span className="text-canvas/70">Tocar</span>
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* === DEPOIMENTOS EM TEXTO — single rotator minimal === */}
        <div className="px-6 lg:px-10 mt-10 lg:mt-12">
          <SingleQuote textos={textos} videosCount={depoimentos.length} />
        </div>

        <div className="px-6 lg:px-10 mt-12 flex justify-center">
          <Button href="#contato" variant="primary-dark" size="md">
            Quero esse resultado
          </Button>
        </div>
      </div>
    </section>
  )
}
