'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { MobileMenu } from './MobileMenu'

type Slide = { src: string; alt: string }

const mobileNav = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Planos', href: '#planos' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contato', href: '#contato' },
]

const slidesFallback: Slide[] = [
  {
    src: '/hero-equipe.jpg',
    alt: 'Equipe Guilherme Borges em treino na rua',
  },
  {
    src: '/hero-equipe-casa41.jpg',
    alt: 'Equipe Guilherme Borges em evento Hammer Time Run',
  },
]

// transição base pra cascata
const ease = [0.22, 1, 0.36, 1] as const
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease },
  }),
}

// mini-depoimentos (trechos reais, verbatim) que giram no card da Hero
const heroQuotes = [
  {
    nome: 'Morganna Salazar',
    destaque:
      'Vivi um processo leve, saudável e constante, aprendendo que evolução não acontece da noite para o dia.',
  },
  {
    nome: 'Gabriela Martins',
    destaque:
      'De uma mente ansiosa e de um físico sedentário para uma atleta de pódio geral em poucos meses.',
  },
  {
    nome: 'Adriane Lima',
    destaque: 'Meu 5 km atual é 24min37s (pace 4:55). Comecei correndo 5 km em 37min25s.',
  },
  {
    nome: 'Alessandra Franco',
    destaque:
      'Em apenas 3 meses de acompanhamento, conquistei recordes pessoais em todas as distâncias que disputei.',
  },
]

// card de prova social (glow girando + mini-depoimento) — preenche o wrapper relative
function QuoteCard({ idx }: { idx: number }) {
  return (
    <>
      {/* anel de brilho girando */}
      <div aria-hidden className="absolute inset-0 rounded-2xl overflow-hidden">
        <div
          className="hero-glow-spin absolute left-1/2 top-1/2 aspect-square w-[170%]"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(255,255,255,0.06) 0deg, rgba(255,255,255,0.06) 285deg, rgba(119,205,222,0.9) 330deg, rgba(255,255,255,0.06) 360deg)',
          }}
        />
      </div>

      {/* card */}
      <div className="absolute inset-[1.5px] rounded-[14px] bg-ink/70 backdrop-blur-md p-5 flex flex-col">
        <div className="flex items-center gap-2 marker text-[9px] text-canvas/55">
          <span className="text-brand-accent">★</span> Quem treina
        </div>
        <div key={idx} className="hero-quote-in flex-1 flex flex-col justify-center">
          <p className="text-canvas text-[15px] leading-[1.45] font-normal">
            “{heroQuotes[idx].destaque}”
          </p>
          <p className="mt-3 marker text-[10px] text-brand-accent">— {heroQuotes[idx].nome}</p>
        </div>
      </div>
    </>
  )
}

export function Hero({ slidesCms }: { slidesCms?: Slide[] }) {
  const slides = slidesCms && slidesCms.length > 0 ? slidesCms : slidesFallback
  const [active, setActive] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  // === scroll parallax: foto desce mais lenta + texto sobe levemente ===
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0])

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(id)
  }, [])

  // rotação do mini-depoimento (box do desktop)
  const [quoteIdx, setQuoteIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((i) => (i + 1) % heroQuotes.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative bg-canvas overflow-hidden pt-4 pb-6 lg:pb-8"
    >
      {/* === header limpo === */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={0}
        variants={fadeUp}
        className="relative z-30 mb-4"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-gb.svg"
              alt="Guilherme Borges Assessoria"
              width={160}
              height={34}
              priority
              className="h-8 lg:h-9 w-auto"
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-ink/80">
            <li><Link href="/" className="hover:text-ink transition">Início</Link></li>
            <li><Link href="#sobre" className="hover:text-ink transition">Sobre</Link></li>
            <li><Link href="#planos" className="hover:text-ink transition">Planos</Link></li>
            <li><Link href="#blog" className="hover:text-ink transition">Blog</Link></li>
            <li><Link href="#contato" className="hover:text-ink transition">Contato</Link></li>
          </ul>

          <div className="hidden lg:block">
            <Button href="#contato" variant="primary-dark" size="md">Começar agora</Button>
          </div>
          <MobileMenu items={mobileNav} />
        </div>
      </motion.div>

      {/* === hero card === */}
      <div className="relative px-3 lg:px-4">
        <div className="relative rounded-2xl overflow-hidden min-h-[88vh] lg:min-h-[calc(100vh-100px)]">
          {/* slides com fade + Ken Burns + parallax */}
          {slides.map((slide, i) => (
            <motion.div
              key={slide.src}
              className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
              style={{ opacity: active === i ? 1 : 0, y: photoY }}
              aria-hidden={active !== i}
            >
              <div className="absolute inset-0 kenburns">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1600px) 100vw, 1600px"
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}

          {/* overlay direcional pra leitura */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(14,14,12,0.78) 0%, rgba(14,14,12,0.65) 35%, rgba(5,58,68,0.35) 60%, rgba(5,58,68,0.2) 100%)',
            }}
          />

          {/* grain analógico */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: '180px 180px',
            }}
          />

          {/* crop marks */}
          <div aria-hidden className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-5 left-5 lg:top-7 lg:left-7">
              <div className="relative size-6">
                <span className="absolute top-0 left-0 h-px w-6 bg-canvas/40" />
                <span className="absolute top-0 left-0 w-px h-6 bg-canvas/40" />
              </div>
            </div>
            <div className="absolute top-5 right-5 lg:top-7 lg:right-7">
              <div className="relative size-6">
                <span className="absolute top-0 right-0 h-px w-6 bg-canvas/40" />
                <span className="absolute top-0 right-0 w-px h-6 bg-canvas/40" />
              </div>
            </div>
            <div className="absolute bottom-5 left-5 lg:bottom-7 lg:left-7">
              <div className="relative size-6">
                <span className="absolute bottom-0 left-0 h-px w-6 bg-canvas/40" />
                <span className="absolute bottom-0 left-0 w-px h-6 bg-canvas/40" />
              </div>
            </div>
            <div className="absolute bottom-5 right-5 lg:bottom-7 lg:right-7">
              <div className="relative size-6">
                <span className="absolute bottom-0 right-0 h-px w-6 bg-canvas/40" />
                <span className="absolute bottom-0 right-0 w-px h-6 bg-canvas/40" />
              </div>
            </div>
          </div>

          {/* conteúdo com parallax + scroll fade — alinhado ao grid 1400 */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="relative z-10 min-h-[88vh] lg:min-h-[calc(100vh-100px)] flex -mx-3 lg:-mx-4"
          >
            <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10 py-10 lg:py-14 grid grid-cols-12 gap-6 lg:gap-8">
            <div className="col-span-12 lg:col-span-7 flex flex-col">
              {/* eyebrow */}
              <motion.div
                initial="hidden"
                animate="show"
                custom={1}
                variants={fadeUp}
                className="flex items-center gap-3 marker text-canvas/70 text-[10px] lg:mb-auto"
              >
                <span className="h-px w-10 bg-brand-accent" />
                <span>Assessoria de corrida online</span>
              </motion.div>

              {/* headline */}
              <motion.div
                initial="hidden"
                animate="show"
                custom={2}
                variants={fadeUp}
                className="mt-6 lg:mt-0"
              >
                <h1 className="display text-canvas text-[clamp(40px,5.2vw,80px)] leading-[1.02] tracking-tight">
                  <span className="block lg:whitespace-nowrap">
                    Treino feito{' '}
                    <span className="whitespace-nowrap">
                      pra{' '}
                      <em
                        className="italic-display hi-marker"
                        style={{ fontStyle: 'italic' }}
                      >
                        você.
                      </em>
                    </span>
                  </span>
                  <span className="block text-canvas/90 lg:whitespace-nowrap">
                    Resultado que aparece na prova.
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial="hidden"
                animate="show"
                custom={3}
                variants={fadeUp}
                className="mt-8 max-w-xl text-canvas/85 text-[18px] lg:text-[20px] leading-[1.4] font-normal"
              >
                Assessoria de corrida online com método de atleta de alto rendimento. Do seu
                primeiro 5K ao próximo PR. Sem planilha genérica, sem achismo.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="show"
                custom={4}
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-5"
              >
                <Button href="#contato" variant="primary-light" size="lg">Quero meu treino</Button>
                <Button href="#planos" variant="link" size="md" className="text-canvas">Ver planos</Button>
              </motion.div>

              {/* selo + indicadores */}
              <motion.div
                initial="hidden"
                animate="show"
                custom={5}
                variants={fadeUp}
                className="lg:mt-auto pt-10 lg:pt-12 flex items-end justify-between gap-4"
              >
                <div className="flex items-start gap-3 marker text-canvas/55 text-[10px] max-w-[15rem] lg:max-w-none leading-relaxed">
                  <span className="text-brand-accent mt-0.5">★</span>
                  <span>
                    <span className="text-canvas/85">Equipe presente nos pódios</span>{' '}
                    <span className="text-canvas/45">das principais provas do calendário</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Slide ${i + 1}`}
                      className="group relative flex items-center justify-center p-1"
                    >
                      <span
                        className={`block rounded-full transition-all duration-300 ${
                          active === i
                            ? 'size-2.5 bg-brand-accent ring-2 ring-brand-accent/30 ring-offset-2 ring-offset-transparent'
                            : 'size-2 bg-canvas/40 group-hover:bg-canvas/70'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* card de prova social — só desktop (canto inferior direito) */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <motion.div
                initial="hidden"
                animate="show"
                custom={6}
                variants={fadeUp}
                className="absolute bottom-0 right-0 w-[19rem] h-[184px]"
              >
                <QuoteCard idx={quoteIdx} />
              </motion.div>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
