'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './Button'

type Item = { label: string; href: string }

export function MobileMenu({
  items,
  ctaHref = '#contato',
  ctaLabel = 'Começar agora',
}: {
  items: Item[]
  ctaHref?: string
  ctaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const overlay = (
    <div className={`lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[100] flex flex-col bg-ink text-canvas transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* topo do overlay */}
        <div className="flex h-[68px] shrink-0 items-center justify-between px-6">
          <Image
            src="/logo-gb.svg"
            alt="Guilherme Borges Assessoria"
            width={140}
            height={30}
            className="h-7 w-auto brightness-0 invert"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-canvas"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="size-6"
            >
              <path d="M6 6L18 18M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* links grandes */}
        <nav className="flex flex-1 flex-col justify-center px-6">
          {items.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${90 + i * 55}ms` : '0ms' }}
              className={`group flex items-center gap-4 border-b border-canvas/10 py-4 transition-all duration-500 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
            >
              <span className="marker w-6 text-[10px] tabular-nums text-brand-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="display text-[clamp(30px,8.5vw,44px)] leading-none tracking-tight text-canvas transition-colors group-hover:text-brand-accent">
                {l.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex shrink-0 justify-center px-6 pb-10 pt-4">
          <Button href={ctaHref} variant="primary-light" size="lg" onClick={() => setOpen(false)}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="lg:hidden">
      {/* hambúrguer assimétrico (minimalista) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="flex h-11 w-11 -mr-2 flex-col items-end justify-center gap-[6px]"
      >
        <span className="block h-[2px] w-7 rounded-full bg-ink" />
        <span className="block h-[2px] w-5 rounded-full bg-ink" />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </div>
  )
}
