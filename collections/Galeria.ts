import type { CollectionConfig } from 'payload'

export const Galeria: CollectionConfig = {
  slug: 'galeria',
  labels: {
    singular: 'Foto da Galeria',
    plural: 'Galeria',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['foto', 'titulo', 'categoria', 'ordem'],
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
        description: 'Título curto (ex: "Pódio Maratona SP 2025")',
      },
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'categoria',
      type: 'select',
      required: true,
      options: [
        { label: 'Treinos', value: 'treinos' },
        { label: 'Provas', value: 'provas' },
        { label: 'Pódios', value: 'podios' },
        { label: 'Bastidor', value: 'bastidor' },
        { label: 'Antes/Depois', value: 'antes-depois' },
      ],
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
