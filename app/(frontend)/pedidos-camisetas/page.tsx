import type { Metadata } from 'next'
import { PedidoForm } from './PedidoForm'
import { getLoteAtivo } from '../_lib/content'

// reflete a troca de lote ativo em até 15s
export const revalidate = 15

export const metadata: Metadata = {
  title: 'Pedido de camiseta · Guilherme Borges Assessoria',
  description: 'Faça seu pedido de camiseta da equipe.',
  robots: { index: false, follow: false }, // link privado — não indexar
}

export default async function PedidosCamisetasPage() {
  const lote = await getLoteAtivo()

  return (
    <main className="min-h-screen bg-canvas py-12 px-5">
      <div className="mx-auto max-w-[560px]">
        {/* logo */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-gb.svg" alt="Guilherme Borges Assessoria" className="h-12 w-auto" />
        </div>

        {/* título */}
        <div className="text-center mb-9">
          <h1 className="display text-ink text-[clamp(28px,6vw,40px)] leading-[1.05]">
            Pedido de{' '}
            <em className="italic-display text-brand-accent" style={{ fontStyle: 'italic' }}>
              camiseta
            </em>
          </h1>
          <p className="mt-3 text-ink/65 text-[15px] leading-[1.5]">
            {lote
              ? 'Escolha o modelo e o tamanho, preencha seus dados e envie.'
              : 'Pedidos encerrados no momento.'}
          </p>
        </div>

        {lote ? (
          <div className="rounded-2xl border border-ink/10 bg-white/70 backdrop-blur p-6 lg:p-8 shadow-sm">
            <PedidoForm loteId={lote.id} />
          </div>
        ) : (
          <div className="rounded-2xl border border-ink/10 bg-white/70 p-8 text-center">
            <p className="text-ink/70 text-[16px] leading-[1.5]">
              No momento não há pedidos abertos. Assim que a próxima rodada começar, este link
              volta a funcionar. 🙂
            </p>
          </div>
        )}

        <p className="mt-6 text-center marker text-ink/35 text-[10px]">
          Guilherme Borges Assessoria
        </p>
      </div>
    </main>
  )
}
