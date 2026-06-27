import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

// Lê a campanha de camiseta ABERTA direto do banco (Local API do Payload).
// É ela que o formulário público usa pra montar o pedido.

export type CampanhaAberta = {
  id: string
  nome: string
  descricao: string | null
  prazo: string | null
  cores: string[]
}

export async function getCampanhaAberta(): Promise<CampanhaAberta | null> {
  try {
    const db = await getPayload({ config })
    const { docs } = await db.find({
      collection: 'campanhas-camiseta',
      where: { status: { equals: 'aberta' } },
      sort: '-createdAt',
      limit: 1,
      depth: 0,
    })
    const d = docs[0] as unknown as Record<string, unknown> | undefined
    if (!d) return null
    const cores = Array.isArray(d.cores)
      ? (d.cores as { cor?: string }[]).map((c) => c.cor ?? '').filter(Boolean)
      : []
    return {
      id: String(d.id),
      nome: String(d.nome ?? ''),
      descricao: (d.descricao as string) || null,
      prazo: (d.prazo as string) || null,
      cores,
    }
  } catch {
    return null
  }
}
