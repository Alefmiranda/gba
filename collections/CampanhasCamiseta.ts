import type { CollectionConfig } from 'payload'

// Cada campanha é um LOTE de pedidos de camiseta (ex: "Camiseta Junho/2026").
// O formulário público (/camiseta) sempre envia pra campanha com status "aberta".
// Ao abrir uma campanha, as outras são fechadas automaticamente — só uma fica
// aberta por vez, então cada lote fica separado no admin.
export const CampanhasCamiseta: CollectionConfig = {
  slug: 'campanhas-camiseta',
  labels: {
    singular: 'Campanha de Camiseta',
    plural: 'Campanhas de Camiseta',
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'status', 'prazo'],
    group: 'Pedidos',
    description:
      'Cada campanha é um lote (ex: "Camiseta Junho/2026"). O formulário público usa a campanha ABERTA.',
  },
  // leitura pública: o formulário precisa saber qual campanha está aberta e suas cores.
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req?.user),
    update: ({ req }) => Boolean(req?.user),
    delete: ({ req }) => Boolean(req?.user),
  },
  hooks: {
    // ao salvar uma campanha como "aberta", fecha todas as outras abertas.
    afterChange: [
      async ({ doc, req }) => {
        if (doc?.status === 'aberta') {
          await req.payload.update({
            collection: 'campanhas-camiseta',
            where: {
              and: [{ id: { not_equals: doc.id } }, { status: { equals: 'aberta' } }],
            },
            data: { status: 'fechada' },
            overrideAccess: true,
            req,
          })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      admin: { description: 'Ex: Camiseta Junho/2026' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'aberta',
      options: [
        { label: 'Aberta (recebendo pedidos)', value: 'aberta' },
        { label: 'Fechada', value: 'fechada' },
      ],
      admin: {
        description: 'Só uma campanha fica aberta por vez — ao abrir esta, as outras fecham.',
        position: 'sidebar',
      },
    },
    {
      name: 'prazo',
      type: 'date',
      label: 'Prazo final',
      admin: {
        description: 'Opcional — data limite pra pedir. Aparece no formulário.',
        position: 'sidebar',
      },
    },
    {
      name: 'descricao',
      type: 'textarea',
      label: 'Descrição / instruções',
      admin: {
        description: 'Texto opcional mostrado no topo do formulário (ex: prazo de entrega, valores).',
      },
    },
    {
      name: 'cores',
      type: 'array',
      label: 'Cores disponíveis',
      admin: {
        description:
          'Cores oferecidas nesta campanha. Se deixar vazio, o formulário não pergunta a cor.',
      },
      fields: [{ name: 'cor', type: 'text', required: true }],
    },
  ],
}
