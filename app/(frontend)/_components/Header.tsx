import Link from 'next/link'

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="display text-2xl tracking-tight text-ink">
            GBA
          </Link>

          <ul className="hidden md:flex items-center gap-1 text-sm text-ink/70 bg-white/60 backdrop-blur-md rounded-full border border-ink/5 px-2 py-1">
            {[
              { label: 'Início', href: '/' },
              { label: 'Sobre', href: '#sobre' },
              { label: 'Planos', href: '#planos' },
              { label: 'Blog', href: '#blog' },
              { label: 'Contato', href: '#contato' },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="px-4 py-1.5 rounded-full hover:bg-ink/5 hover:text-ink transition"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="#contato"
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand transition"
          >
            Começar agora
            <svg viewBox="0 0 24 24" fill="none" className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}
