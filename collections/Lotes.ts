import type { CollectionConfig } from 'payload'

export const Lotes: CollectionConfig = {
  slug: 'lotes',
  labels: {
    singular: 'Lote de pedidos',
    plural: 'Lotes de pedidos',
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'ativo', 'createdAt'],
    group: 'Pedidos',
    // gerenciado pelo painel dentro de "Pedidos de camiseta" — oculto do nav/dashboard
    hidden: true,
    description:
      'Cada lote é uma rodada de pedidos. Marque UM como Ativo — os pedidos novos entram nele. Pra abrir uma nova rodada, crie um lote e marque como ativo (o anterior desativa sozinho). Os pedidos antigos ficam guardados no lote deles.',
  },
  access: {
    read: () => true, // o formulário público precisa saber qual é o lote ativo
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      label: 'Nome do lote',
      admin: { description: 'Ex: Lote 1 — Junho/2026' },
    },
    {
      name: 'ativo',
      type: 'checkbox',
      defaultValue: false,
      label: 'Lote ativo (recebe os pedidos novos)',
    },
  ],
  hooks: {
    // garante só UM lote ativo por vez (ao ativar um, desativa os outros)
    afterChange: [
      async ({ doc, req }) => {
        if (doc?.ativo) {
          await req.payload.update({
            collection: 'lotes',
            where: { id: { not_equals: doc.id }, ativo: { equals: true } },
            data: { ativo: false },
            req,
            overrideAccess: true,
          })
        }
        return doc
      },
    ],
  },
}
