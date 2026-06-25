import type { CollectionConfig } from 'payload'

export const Depoimentos: CollectionConfig = {
  slug: 'depoimentos',
  labels: {
    singular: 'Depoimento',
    plural: 'Depoimentos',
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'foto', 'resultado', 'ordem', 'destaque'],
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
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      admin: {
        components: {
          Cell: '/components/admin/GaleriaFotoCell',
        },
      },
    },
    {
      name: 'citacao',
      type: 'textarea',
      required: true,
      label: 'Citação',
    },
    {
      name: 'resultado',
      type: 'text',
      required: true,
      admin: {
        description: 'Ex: 5K em 22min · PR na maratona · Meia sub-2h',
      },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Ordem de exibição (menor aparece primeiro)',
      },
    },
    {
      name: 'destaque',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mostrar em destaque no topo',
    },
  ],
}
