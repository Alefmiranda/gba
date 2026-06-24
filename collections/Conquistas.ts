import type { CollectionConfig } from 'payload'

export const Conquistas: CollectionConfig = {
  slug: 'conquistas',
  labels: {
    singular: 'Conquista',
    plural: 'Conquistas do Guilherme',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ano', 'ordem'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      admin: {
        description: 'Ex: 2º lugar na Maratona de São Paulo',
      },
    },
    {
      name: 'ano',
      type: 'text',
      admin: {
        description: 'Ex: 2024',
      },
    },
    {
      name: 'descricao',
      type: 'textarea',
      admin: {
        description: 'Descrição opcional adicional',
      },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
