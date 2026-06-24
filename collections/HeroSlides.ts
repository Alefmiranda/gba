import type { CollectionConfig } from 'payload'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  labels: {
    singular: 'Slide do Hero',
    plural: 'Slides do Hero',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ordem'],
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
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
