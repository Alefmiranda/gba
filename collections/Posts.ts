import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts do Blog',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'categoria', 'publicadoEm', 'status'],
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL do post (ex: como-montar-treino)',
      },
    },
    {
      name: 'capa',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'resumo',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: {
        description: 'Texto curto que aparece no card do post (max 200 caracteres)',
      },
    },
    {
      name: 'conteudo',
      type: 'richText',
      required: true,
    },
    {
      name: 'categoria',
      type: 'select',
      required: true,
      options: [
        { label: 'Treino', value: 'treino' },
        { label: 'Provas', value: 'provas' },
        { label: 'Lesões e Prevenção', value: 'lesoes' },
        { label: 'Nutrição', value: 'nutricao' },
        { label: 'Iniciantes', value: 'iniciantes' },
        { label: 'Performance', value: 'performance' },
      ],
    },
    {
      name: 'publicadoEm',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'rascunho',
      options: [
        { label: 'Rascunho', value: 'rascunho' },
        { label: 'Publicado', value: 'publicado' },
      ],
    },
  ],
}
