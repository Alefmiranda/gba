import Image from 'next/image'
import Link from 'next/link'
import { Button } from './Button'
import { MobileMenu } from './MobileMenu'

const nav = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '/#historia' },
  { label: 'Planos', href: '/#planos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/#contato' },
]

/** Header estático pra páginas internas (blog, post). */
export function SiteNav() {
  return (
    <header className="bg-canvas border-b border-ink/10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-gb.svg"
            alt="Guilherme Borges Assessoria"
            width={150}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-9 text-[14px] font-medium text-ink/70">
          {nav.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="hover:text-ink transition">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/#contato" variant="primary-dark">
            Começar agora
          </Button>
        </div>
        <MobileMenu items={nav} ctaHref="/#contato" />
      </div>
    </header>
  )
}
