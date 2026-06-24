import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type ButtonVariant = 'primary-dark' | 'primary-light' | 'link'
// size mantido na API por compatibilidade, mas TODOS os botões têm o mesmo tamanho
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} & Omit<ComponentProps<typeof Link>, 'href' | 'children' | 'className'>

// dimensões ÚNICAS pra todos os botões do site
const BOX = 'h-[52px] w-[250px]'

const variantStyles: Record<Exclude<ButtonVariant, 'link'>, { wrapper: string; icon: string }> = {
  // dark sobre fundo claro
  'primary-dark': {
    wrapper: 'bg-ink text-canvas hover:bg-brand',
    icon: 'bg-brand-accent text-ink',
  },
  // claro sobre fundo escuro
  'primary-light': {
    wrapper: 'bg-canvas text-ink hover:bg-brand-accent',
    icon: 'bg-ink text-brand-accent',
  },
}

export function Button({
  href,
  children,
  variant = 'primary-dark',
  className = '',
  size: _size,
  ...props
}: ButtonProps) {
  void _size

  // link — CTA secundário sublinhado, fora do padrão de caixa
  if (variant === 'link') {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 text-[14px] font-semibold underline underline-offset-[6px] decoration-current/30 decoration-1 hover:decoration-current transition ${className}`}
        {...props}
      >
        {children}
        <span className="text-brand-accent">→</span>
      </Link>
    )
  }

  const v = variantStyles[variant]
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-between gap-2 rounded-full font-semibold text-[14px] pl-6 pr-2 ${BOX} ${v.wrapper} transition ${className}`}
      {...props}
    >
      <span className="truncate">{children}</span>
      <span
        className={`shrink-0 size-9 rounded-full flex items-center justify-center group-hover:translate-x-0.5 transition ${v.icon}`}
      >
        →
      </span>
    </Link>
  )
}
