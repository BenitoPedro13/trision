import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Colecoes } from './collections/Colecoes'
import { Media } from './collections/Media'
import { Mostruario } from './collections/Mostruario'
import { Produtos } from './collections/Produtos'
import { Revendedores } from './collections/Revendedores'
import { Usuarios } from './collections/Usuarios'
import { Config } from './globals/Config'
import type { TrisionUser } from '@/payload/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Usuarios.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Usuarios, Media, Colecoes, Produtos, Revendedores, Mostruario],
  globals: [Config],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    multiTenantPlugin({
      tenantsSlug: 'revendedores',
      tenantField: { name: 'revendedor' },
      collections: { mostruario: {} },
      tenantsArrayField: { includeDefaultField: true },
      userHasAccessToAllTenants: (user) =>
        (user as TrisionUser | null)?.role === 'admin',
      i18n: {
        translations: {
          pt: { 'nav-tenantSelector-label': 'Filtrar por revenda' },
        },
      },
    }),
  ],
})
