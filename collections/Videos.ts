import type { CollectionConfig } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: {
    singular: 'Vídeo',
    plural: 'Vídeos',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'url', 'destaque', 'ordem'],
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
        description: 'Nome do vídeo (aparece só na lista do painel, pra você se organizar).',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description:
          'Cole o link do YouTube (ex.: https://youtube.com/shorts/XXXXXXXXXXX). A capa é puxada automaticamente do YouTube.',
        components: {
          // na LISTA: mostra a capa do vídeo; clicar toca o vídeo
          Cell: '/components/admin/VideoPreviewCell',
        },
      },
    },
    {
      name: 'destaque',
      type: 'checkbox',
      defaultValue: false,
      label: 'Vídeo em destaque (aparece no quadro grande)',
      admin: {
        description:
          'Marque UM vídeo pra ele virar o destaque (quadro grande, no início da seção). Se você marcar outro depois, este desmarca sozinho — então é impossível errar.',
      },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Ordem de exibição dos demais — número menor aparece primeiro.',
      },
    },
    {
      name: 'tipo',
      type: 'select',
      defaultValue: 'outros',
      admin: {
        description: 'Categoria (opcional).',
      },
      options: [
        { label: 'Depoimento de atleta', value: 'depoimento' },
        { label: 'Bastidor de treino', value: 'bastidor' },
        { label: 'Pódio / Chegada', value: 'podio' },
        { label: 'Entrevista', value: 'entrevista' },
        { label: 'Outros', value: 'outros' },
      ],
    },
    {
      name: 'arquivo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Opcional: subir um arquivo de vídeo em vez do link (use só pra clipes curtos — o normal é usar o YouTube acima).',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Capa customizada (opcional — por padrão usa a do YouTube).',
      },
    },
  ],
  hooks: {
    // Garante só UM vídeo em destaque por vez: ao marcar um, desmarca os outros.
    afterChange: [
      async ({ doc, req }) => {
        if (doc?.destaque) {
          await req.payload.update({
            collection: 'videos',
            where: { id: { not_equals: doc.id }, destaque: { equals: true } },
            data: { destaque: false },
            req,
            overrideAccess: true,
          })
        }
        return doc
      },
    ],
  },
}
