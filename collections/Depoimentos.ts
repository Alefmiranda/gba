import type { CollectionConfig } from 'payload'

export const Depoimentos: CollectionConfig = {
  slug: 'depoimentos',
  labels: {
    singular: 'Depoimento',
    plural: 'Depoimentos',
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'tipo', 'ordem', 'destaque'],
    group: 'Conteúdo',
    description: 'Depoimentos em vídeo (YouTube) e em texto.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'tipo',
      type: 'select',
      required: true,
      defaultValue: 'texto',
      options: [
        { label: 'Vídeo (YouTube)', value: 'video' },
        { label: 'Texto', value: 'texto' },
      ],
      admin: {
        description: 'Vídeo aparece no carrossel; texto aparece na rotação de citações.',
      },
    },
    {
      name: 'nome',
      type: 'text',
      required: true,
      admin: { description: 'Nome de quem deu o depoimento.' },
    },

    // ===== VÍDEO =====
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Link do YouTube',
      admin: {
        condition: (data) => data?.tipo === 'video',
        description: 'Cole o link do YouTube do depoimento (a capa vem automática).',
        components: {
          Cell: '/components/admin/VideoPreviewCell',
        },
      },
    },

    // ===== TEXTO =====
    {
      name: 'citacao',
      type: 'textarea',
      label: 'Citação (frase de destaque)',
      admin: {
        condition: (data) => data?.tipo === 'texto',
        description: 'Frase curta que aparece em destaque na rotação.',
      },
    },
    {
      name: 'paragrafos',
      type: 'array',
      label: 'Texto completo (parágrafos)',
      admin: {
        condition: (data) => data?.tipo === 'texto',
        description: 'Texto completo mostrado ao clicar em "Ler completo".',
      },
      fields: [{ name: 'texto', type: 'textarea', required: true }],
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.tipo === 'texto',
        components: {
          Cell: '/components/admin/GaleriaFotoCell',
        },
      },
    },
    {
      name: 'resultado',
      type: 'text',
      admin: {
        condition: (data) => data?.tipo === 'texto',
        description: 'Opcional. Ex: 5K em 22min · PR na maratona',
      },
    },

    // ===== COMUNS =====
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Ordem de exibição (menor aparece primeiro).' },
    },
    {
      name: 'destaque',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destaque (no vídeo, aparece primeiro no carrossel)',
    },
  ],
}
