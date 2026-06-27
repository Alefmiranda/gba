import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '../_components/SiteNav'
import { Footer } from '../_components/Footer'
import { getCampanhaAberta } from '../_lib/camiseta'
import { PedidoForm } from './PedidoForm'

export const revalidate = 15

export const metadata: Metadata = {
  title: 'Camiseta da Equipe · Guilherme Borges Assessoria',
  description: 'Peça a camiseta oficial da equipe. Escolha modelo, tamanho e quantidade.',
}

function formatarPrazo(iso: string | null): string | null {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return null
  }
}

export default async function CamisetaPage() {
  const campanha = await getCampanhaAberta()
  const prazo = formatarPrazo(campanha?.prazo ?? null)

  return (
    <>
      <SiteNav />
      <main className="flex-1 bg-canvas">
        <div className="mx-auto max-w-[760px] px-6 lg:px-10 py-16 lg:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 marker text-ink/55 hover:text-ink text-[10px] transition"
          >
            <span className="text-[14px]">←</span> Início
          </Link>

          <span className="mt-8 block marker text-brand text-[11px]">Camiseta oficial</span>
          <h1 className="mt-3 display text-ink text-[clamp(34px,6vw,68px)] leading-[0.95] tracking-[-0.03em]">
            Camiseta da Equipe
          </h1>

          {campanha ? (
            <>
              <p className="mt-5 text-ink/70 text-[17px] lg:text-[19px] font-normal max-w-xl">
                Faça seu pedido da camiseta da equipe. Escolha o modelo, o tamanho e a quantidade —
                a gente confirma os detalhes pelo WhatsApp.
              </p>

              {(campanha.descricao || prazo) && (
                <div className="mt-8 rounded-xl border border-ink/12 bg-paper/60 px-5 py-4">
                  <div className="marker text-ink/45 text-[10px]">Lote atual · {campanha.nome}</div>
                  {campanha.descricao && (
                    <p className="mt-2 text-ink/75 text-[15px] whitespace-pre-line">
                      {campanha.descricao}
                    </p>
                  )}
                  {prazo && (
                    <p className="mt-2 text-ink text-[15px] font-semibold">
                      Prazo para pedir: {prazo}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-10">
                <PedidoForm cores={campanha.cores} />
              </div>
            </>
          ) : (
            <div className="mt-10 rounded-2xl border border-ink/12 bg-surface p-8 lg:p-10">
              <h2 className="display text-ink text-[24px] tracking-[-0.02em]">
                Pedidos encerrados no momento
              </h2>
              <p className="mt-3 text-ink/65 text-[15px] max-w-md">
                Ainda não há um lote aberto para pedidos de camiseta. Fique de olho — em breve
                abriremos um novo lote. Qualquer dúvida, fale com a gente.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-ink underline underline-offset-[6px] decoration-ink/30 hover:decoration-ink transition"
              >
                Voltar ao site <span className="text-brand-accent">→</span>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
