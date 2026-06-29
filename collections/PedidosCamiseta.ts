import type { CollectionConfig } from 'payload'

export const PedidosCamiseta: CollectionConfig = {
  slug: 'pedidos-camiseta',
  labels: {
    singular: 'Pedido de camiseta',
    plural: 'Pedidos de camiseta',
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['lote', 'nome', 'camiseta', 'modelo', 'tamanho', 'quantidade', 'whatsapp', 'createdAt'],
    group: 'Pedidos',
    description:
      'Pedidos enviados pelos membros pelo formulário público (/pedidos-camisetas). Use o botão "Baixar CSV" pra mandar a lista pro fornecedor.',
    components: {
      // botão de baixar a lista em CSV no topo da lista
      beforeListTable: ['/components/admin/ExportPedidosButton'],
    },
  },
  access: {
    create: () => true, // qualquer membro com o link pode enviar
    read: ({ req }) => Boolean(req.user), // só o admin logado vê os pedidos
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      label: 'Nome completo',
    },
    {
      name: 'whatsapp',
      type: 'text',
      required: true,
      label: 'WhatsApp',
    },
    {
      name: 'camiseta',
      type: 'text',
      required: true,
      label: 'Camiseta (estampa)',
    },
    {
      name: 'modelo',
      type: 'text',
      required: true,
      label: 'Modelo (corte)',
    },
    {
      name: 'tamanho',
      type: 'text',
      required: true,
      label: 'Tamanho',
    },
    {
      name: 'quantidade',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      label: 'Quantidade',
    },
    {
      name: 'observacao',
      type: 'textarea',
      label: 'Observações',
    },
    {
      name: 'lote',
      type: 'relationship',
      relationTo: 'lotes',
      label: 'Lote',
      admin: { description: 'Rodada de pedidos a que este pertence (vinculado automaticamente ao lote ativo).' },
    },
  ],
  hooks: {
    // ao criar (pelo formulário público), vincula automaticamente ao lote ativo
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data && data.lote == null) {
          const { docs } = await req.payload.find({
            collection: 'lotes',
            where: { ativo: { equals: true } },
            limit: 1,
            depth: 0,
          })
          if (docs[0]) data.lote = docs[0].id
        }
        return data
      },
    ],
  },
}
