import type { CollectionConfig } from 'payload'

export const Planos: CollectionConfig = {
  slug: 'planos',
  labels: {
    singular: 'Plano',
    plural: 'Planos',
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'preco', 'ordem', 'destaque'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      admin: {
        description: 'Ex: Mensal, Trimestral, Semestral',
      },
    },
    {
      name: 'preco',
      type: 'number',
      required: true,
      admin: {
        description: 'Valor total do plano em R$ (ex: 140, 380, 720)',
      },
    },
    {
      name: 'precoMensalEquivalente',
      type: 'number',
      admin: {
        description: 'Valor mensal equivalente para mostrar (ex: 126.67 pro trimestral)',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Frase curta abaixo do preço (ex: "Pra experimentar o método")',
      },
    },
    {
      name: 'recursos',
      type: 'array',
      label: 'Recursos inclusos',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'texto',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'ctaTexto',
      type: 'text',
      defaultValue: 'Começar',
      label: 'Texto do botão',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'Link do botão (WhatsApp / checkout)',
    },
    {
      name: 'destaque',
      type: 'checkbox',
      defaultValue: false,
      label: 'Marcar como "Mais escolhido"',
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
