import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '../_components/SiteNav'
import { Footer } from '../_components/Footer'
import { PedidoForm } from './PedidoForm'

export const metadata: Metadata = {
  title: 'Pedidos de Camiseta · Guilherme Borges Assessoria',
  description: 'Faça seu pedido de camiseta da equipe.',
  robots: { index: false, follow: false },
}

export default function PedidosCamisetasPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1 bg-canvas">
        <div className="mx-auto max-w-[720px] px-6 lg:px-10 py-16 lg:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 marker text-ink/55 hover:text-ink text-[10px] transition"
          >
            <span className="text-[14px]">←</span> Início
          </Link>

          <h1 className="mt-8 display text-ink text-[clamp(34px,6vw,68px)] leading-[0.95] tracking-[-0.03em]">
            Pedidos de Camiseta
          </h1>
          <p className="mt-5 text-ink/70 text-[17px] lg:text-[19px] font-normal leading-[1.5] max-w-xl">
            Escolha o modelo e o tamanho da sua camiseta da equipe e envie o pedido.
            A gente junta tudo e manda pra produção.
          </p>

          <div className="mt-12 lg:mt-14">
            <PedidoForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
