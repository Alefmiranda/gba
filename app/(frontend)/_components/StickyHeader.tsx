'use client'

import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from './Button'
import { MobileMenu } from './MobileMenu'

const ease = [0.22, 1, 0.36, 1] as const

const nav = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '#historia' },
  { label: 'Planos', href: '#planos' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contato', href: '#contato' },
]

export function StickyHeader() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShow(y > 640)
  })

  return (
    <motion.header
      initial={{ y: '-120%', opacity: 0 }}
      animate={{ y: show ? '0%' : '-120%', opacity: show ? 1 : 0 }}
      transition={{ duration: 0.4, ease }}
      className={`fixed top-0 inset-x-0 z-50 bg-canvas border-b border-ink/10 shadow-[0_8px_30px_-12px_rgba(14,14,12,0.18)] ${
        show ? '' : 'pointer-events-none'
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-gb.svg"
            alt="Guilherme Borges Assessoria"
            width={140}
            height={30}
            className="h-7 w-auto"
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
          <Button href="#contato" variant="primary-dark">
            Começar agora
          </Button>
        </div>
        <MobileMenu items={nav} />
      </div>
    </motion.header>
  )
}
