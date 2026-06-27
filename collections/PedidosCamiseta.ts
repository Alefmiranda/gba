import type { CollectionConfig } from 'payload'
import { MODELO_OPTIONS, TODOS_TAMANHOS } from './camisetaOpcoes'

// Pedidos recebidos pelo formulário público (/camiseta). Criados apenas via
// server action (overrideAccess) — a API pública NÃO cria nem lê pedidos.
// O admin filtra por campanha/modelo/status pra gerenciar cada lote.
export const PedidosCamiseta: CollectionConfig = {
  slug: 'pedidos-camiseta',
  labels: {
    singular: 'Pedido de Camiseta',
    plural: 'Pedidos de Camiseta',
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'modelo', 'tamanho', 'quantidade', 'campanha', 'status', 'createdAt'],
    group: 'Pedidos',
    description: 'Pedidos recebidos pelo formulário público /camiseta.',
  },
  // pedidos são privados: só usuário logado lê/gerencia. Criação só pelo server action.
  access: {
    read: ({ req }) => Boolean(req?.user),
    create: ({ req }) => Boolean(req?.user),
    update: ({ req }) => Boolean(req?.user),
    delete: ({ req }) => Boolean(req?.user),
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'whatsapp',
      type: 'text',
      required: true,
      label: 'WhatsApp',
    },
    {
      name: 'modelo',
      type: 'select',
      required: true,
      options: MODELO_OPTIONS,
    },
    {
      name: 'tamanho',
      type: 'select',
      required: true,
      options: TODOS_TAMANHOS.map((t) => ({ label: t, value: t })),
    },
    {
      name: 'cor',
      type: 'text',
      admin: { description: 'Cor escolhida (quando a campanha oferece cores).' },
    },
    {
      name: 'quantidade',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
    },
    {
      name: 'campanha',
      type: 'relationship',
      relationTo: 'campanhas-camiseta',
      label: 'Campanha (lote)',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'novo',
      options: [
        { label: 'Novo', value: 'novo' },
        { label: 'Confirmado', value: 'confirmado' },
        { label: 'Pago', value: 'pago' },
        { label: 'Produção', value: 'producao' },
        { label: 'Entregue', value: 'entregue' },
      ],
      admin: {
        description: 'Controle interno do andamento do pedido.',
        position: 'sidebar',
      },
    },
    {
      name: 'observacaoInterna',
      type: 'textarea',
      label: 'Observação interna',
      admin: {
        description: 'Anotações suas sobre o pedido (não aparece pro cliente).',
      },
    },
  ],
  defaultSort: '-createdAt',
}
