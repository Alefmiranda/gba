import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Configurações Gerais',
  admin: {
    group: 'Configurações',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroHeadline',
              type: 'text',
              required: true,
              defaultValue: 'Treino feito pra você. Resultado que aparece na prova.',
              label: 'Headline do Hero',
            },
            {
              name: 'heroSubheadline',
              type: 'textarea',
              required: true,
              defaultValue:
                'Assessoria de corrida online com método de atleta de alto rendimento. Do seu primeiro 5K ao próximo PR. Sem planilha genérica, sem achismo.',
              label: 'Subheadline do Hero',
            },
            {
              name: 'heroImagem',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto do Hero',
            },
            {
              name: 'heroCtaPrimario',
              type: 'text',
              defaultValue: 'Quero meu treino',
            },
            {
              name: 'heroCtaSecundario',
              type: 'text',
              defaultValue: 'Ver planos',
            },
            {
              name: 'heroSelo',
              type: 'text',
              defaultValue: 'Equipe presente nos pódios das principais provas do calendário',
              label: 'Selo de credibilidade',
            },
          ],
        },
        {
          label: 'Contato',
          fields: [
            {
              name: 'whatsapp',
              type: 'text',
              admin: {
                description: 'Número com DDD (ex: 5511999999999)',
              },
            },
            {
              name: 'email',
              type: 'text',
            },
            {
              name: 'instagram',
              type: 'text',
              admin: {
                description: 'URL completa do perfil',
              },
            },
            {
              name: 'youtube',
              type: 'text',
            },
            {
              name: 'strava',
              type: 'text',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitulo',
              type: 'text',
              defaultValue: 'Guilherme Borges Assessoria · Treino individual, resultado real',
            },
            {
              name: 'seoDescricao',
              type: 'textarea',
              defaultValue:
                'Assessoria de corrida online com método de atleta de alto rendimento. Do primeiro 5K ao próximo PR.',
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem de compartilhamento (1200×630)',
            },
          ],
        },
      ],
    },
  ],
}
