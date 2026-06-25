import type { CollectionConfig } from 'payload'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  labels: {
    singular: 'Slide do Hero',
    plural: 'Slides do Hero',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'foto', 'ordem'],
    group: 'Conteúdo',
    description: 'Fotos do carrossel da primeira dobra (Hero).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      admin: { description: 'Identificação interna (ex: "Equipe na rua")' },
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        components: {
          Cell: '/components/admin/GaleriaFotoCell',
        },
      },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
