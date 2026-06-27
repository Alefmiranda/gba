'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { tamanhoValido } from '@/collections/camisetaOpcoes'
import { getCampanhaAberta } from '../_lib/camiseta'

export type PedidoState = { ok: boolean; error?: string }

// Cria um pedido de camiseta a partir do formulário público.
// A campanha é resolvida no servidor (nunca confia no client) e a criação usa
// overrideAccess — a API pública não cria pedidos diretamente.
export async function criarPedido(
  _prev: PedidoState,
  formData: FormData,
): Promise<PedidoState> {
  const nome = String(formData.get('nome') ?? '').trim()
  const whatsapp = String(formData.get('whatsapp') ?? '').trim()
  const modelo = String(formData.get('modelo') ?? '').trim()
  const tamanho = String(formData.get('tamanho') ?? '').trim()
  const cor = String(formData.get('cor') ?? '').trim()
  const quantidade = Math.max(1, Math.floor(Number(formData.get('quantidade') ?? 1)) || 1)

  if (!nome || !whatsapp || !modelo || !tamanho) {
    return { ok: false, error: 'Preencha nome, WhatsApp, modelo e tamanho.' }
  }
  if (!tamanhoValido(modelo, tamanho)) {
    return { ok: false, error: 'Tamanho inválido para o modelo escolhido.' }
  }

  const campanha = await getCampanhaAberta()
  if (!campanha) {
    return { ok: false, error: 'Os pedidos estão encerrados no momento.' }
  }

  try {
    const db = await getPayload({ config })
    await db.create({
      collection: 'pedidos-camiseta',
      data: {
        nome,
        whatsapp,
        modelo,
        tamanho,
        cor: cor || undefined,
        quantidade,
        campanha: campanha.id,
        status: 'novo',
      },
      overrideAccess: true,
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'Não foi possível enviar o pedido. Tente novamente.' }
  }
}
