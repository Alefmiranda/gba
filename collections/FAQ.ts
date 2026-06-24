import type { CollectionConfig } from 'payload'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  labels: {
    singular: 'Pergunta',
    plural: 'Perguntas Frequentes',
  },
  admin: {
    useAsTitle: 'pergunta',
    defaultColumns: ['pergunta', 'ordem'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pergunta',
      type: 'text',
      required: true,
    },
    {
      name: 'resposta',
      type: 'textarea',
      required: true,
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
