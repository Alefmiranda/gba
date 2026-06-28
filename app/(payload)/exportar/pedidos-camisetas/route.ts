import config from '@payload-config'
import { getPayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { modeloLabel } from '@/collections/camisetasCatalog'

// Gera a lista de pedidos de camiseta em CSV pra mandar pro fornecedor.
// Protegido: só responde pra quem está logado no admin do Payload.
export const dynamic = 'force-dynamic'

// Escapa um campo pro padrão CSV (aspas duplas + separador ponto-e-vírgula).
function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return `"${s.replace(/"/g, '""')}"`
}

function formatarData(v: unknown): string {
  if (!v) return ''
  const d = new Date(v as string)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export async function GET() {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()

  // exige usuário autenticado
  const { user } = await payload.auth({ headers })
  if (!user) {
    return new Response('Não autorizado. Faça login no admin.', { status: 401 })
  }

  const { docs } = await payload.find({
    collection: 'pedidos-camiseta',
    limit: 100000,
    sort: '-createdAt',
    depth: 0,
  })

  const colunas = ['Data', 'Nome', 'WhatsApp', 'Modelo', 'Tamanho', 'Quantidade', 'Observações']
  const linhas = (docs as Record<string, unknown>[]).map((d) =>
    [
      formatarData(d.createdAt),
      d.nome,
      d.whatsapp,
      modeloLabel(d.modelo as string),
      d.tamanho,
      d.quantidade,
      d.observacoes,
    ]
      .map(csvCell)
      .join(';'),
  )

  // BOM (﻿) faz o Excel abrir UTF-8 com acentos corretos.
  const csv = '﻿' + [colunas.map(csvCell).join(';'), ...linhas].join('\r\n')

  const hoje = new Date().toISOString().slice(0, 10)
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pedidos-camisetas-${hoje}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
