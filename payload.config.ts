import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Depoimentos } from './collections/Depoimentos'
import { Galeria } from './collections/Galeria'
import { Videos } from './collections/Videos'
import { HeroSlides } from './collections/HeroSlides'
import { Planos } from './collections/Planos'
import { Conquistas } from './collections/Conquistas'
import { FAQ } from './collections/FAQ'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// sharp é opcional: se a libvips nativa não carregar no runtime (ex.: container
// distroless), seguimos sem ele. O Payload inicializa normalmente — admin, API,
// blog e imagens já geradas funcionam; só o resize de novos uploads fica de fora.
const requireCjs = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharp: any = undefined
try {
  sharp = requireCjs('sharp')
} catch (err) {
  console.warn(
    '[payload] sharp indisponível, seguindo sem processamento de imagem:',
    (err as Error)?.message,
  )
}

// === banco: Postgres em produção (DATABASE_URI postgres://…), SQLite no dev local ===
const dbUri = process.env.DATABASE_URI || 'file:./payload.db'
const db = dbUri.startsWith('postgres')
  ? postgresAdapter({ pool: { connectionString: dbUri } })
  : sqliteAdapter({ client: { url: dbUri } })

// === storage: S3-compatível quando há credenciais; disco local no dev ===
const storagePlugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT || undefined,
          region: process.env.S3_REGION || 'auto',
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true' || undefined,
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
    },
    meta: {
      titleSuffix: '· Guilherme Borges Assessoria',
    },
  },
  collections: [
    Users,
    Media,
    Posts,
    Depoimentos,
    Galeria,
    Videos,
    HeroSlides,
    Planos,
    Conquistas,
    FAQ,
  ],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  plugins: [...storagePlugins],
  sharp,
})
