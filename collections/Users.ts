import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Sistema',
  },
  auth: true,
  // Só usuários logados podem criar/gerenciar outros usuários.
  access: {
    create: ({ req }) => Boolean(req?.user),
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
    },
  ],
}
