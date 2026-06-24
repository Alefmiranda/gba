import Image from 'next/image'
import Link from 'next/link'
import { INSTAGRAM_URL, STRAVA_URL, whatsappLink, WHATSAPP_MSG_GERAL } from '../_lib/contato'

const nav = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '/#historia' },
  { label: 'Planos', href: '/#planos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Galeria', href: '/#galeria' },
]

const social = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'Strava', href: STRAVA_URL },
]

export function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="relative bg-paper text-ink overflow-hidden border-t border-ink/10">
      {/* watermark do nome no fundo — marquee animado */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-0 pointer-events-none select-none leading-[0.8] overflow-hidden -mb-[0.12em]"
      >
        <div className="marquee-track flex w-max">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="display text-ink/[0.05] text-[19vw] whitespace-nowrap tracking-tighter pr-[0.35em]"
            >
              Guilherme Borges
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 pt-16 lg:pt-24 pb-28 lg:pb-36">
        {/* topo: logo + tagline + contato em destaque */}
        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <Image
              src="/logo-gb.svg"
              alt="Guilherme Borges Assessoria"
              width={220}
              height={47}
              className="hidden lg:block h-12 w-auto"
            />
            <p className="lg:mt-7 display text-ink text-[clamp(26px,3.4vw,44px)] leading-[1.05] tracking-[-0.02em] max-w-xl">
              Treino individual.{' '}
              <em className="italic-display text-brand-accent" style={{ fontStyle: 'italic' }}>
                Resultado real.
              </em>
            </p>
          </div>

          {/* contato direto — grande e clicável */}
          <div className="col-span-12 lg:col-span-5 lg:pl-8 flex flex-col justify-end gap-3">
            <span className="marker text-ink/45 text-[10px]">Fale direto</span>
            <a
              href={whatsappLink(WHATSAPP_MSG_GERAL)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between border-b border-ink/15 pb-3 text-ink hover:text-brand transition"
            >
              <span className="display text-[20px] lg:text-[24px]">WhatsApp</span>
              <span className="text-brand-accent transition-transform group-hover:translate-x-1">↗</span>
            </a>
            <a
              href="#contato"
              className="group inline-flex items-center justify-between border-b border-ink/15 pb-3 text-ink hover:text-brand transition"
            >
              <span className="display text-[20px] lg:text-[24px]">E-mail</span>
              <span className="text-brand-accent transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </div>

        {/* linha de links: navegação + redes */}
        <div className="mt-16 lg:mt-24 pt-8 border-t border-ink/12 grid grid-cols-12 gap-x-4 lg:gap-x-8 gap-y-10">
          <nav className="col-span-6 lg:col-span-6">
            <div className="marker text-ink/40 text-[10px] mb-4">Navegação</div>
            <ul className="flex flex-col gap-y-2.5 lg:flex-row lg:flex-wrap lg:gap-x-8 lg:gap-y-2">
              {nav.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="display text-ink/75 text-[17px] lg:text-[18px] hover:text-brand transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 lg:col-span-6 lg:text-right">
            <div className="marker text-ink/40 text-[10px] mb-4">Redes</div>
            <ul className="flex flex-col gap-y-2.5 lg:flex-row lg:flex-wrap lg:justify-end lg:gap-x-8 lg:gap-y-2">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="display text-ink/75 text-[17px] lg:text-[18px] hover:text-brand transition"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* logo — só mobile, no fim acima do copyright */}
        <div className="lg:hidden mt-16">
          <Image
            src="/logo-gb.svg"
            alt="Guilherme Borges Assessoria"
            width={220}
            height={47}
            className="h-10 w-auto"
          />
        </div>

        {/* bottom bar */}
        <div className="mt-8 lg:mt-20 flex flex-wrap items-center justify-between gap-3 marker text-ink/45 text-[10px]">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-accent" />
            © {ano} Guilherme Borges Assessoria
          </span>
          <a href="#" className="hover:text-ink transition">Política de Privacidade</a>
        </div>
      </div>
    </footer>
  )
}
