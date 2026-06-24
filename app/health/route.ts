import { NextResponse } from 'next/server'

// Rota de diagnóstico temporária: testa DB, sharp e init do Payload isoladamente.
export const dynamic = 'force-dynamic'

export async function GET() {
  const out: Record<string, unknown> = {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    env: {
      hasDbUri: !!process.env.DATABASE_URI,
      hasSecret: !!process.env.PAYLOAD_SECRET,
      hasS3Bucket: !!process.env.S3_BUCKET,
      hasS3Endpoint: !!process.env.S3_ENDPOINT,
      hasS3Key: !!process.env.S3_ACCESS_KEY_ID,
    },
  }

  // 1) conexão crua com o Postgres (Supabase)
  try {
    const pg: any = await import('pg')
    const Pool = pg.default?.Pool || pg.Pool
    const pool = new Pool({ connectionString: process.env.DATABASE_URI, connectionTimeoutMillis: 8000 })
    const r = await pool.query('select 1 as ok')
    out.db = 'OK ' + JSON.stringify(r.rows)
    await pool.end()
  } catch (e: any) {
    out.db = 'FAIL: ' + (e?.message || String(e)) + ' [code=' + (e?.code || '') + ']'
  }

  // 2) sharp (binário nativo)
  try {
    const sharp: any = (await import('sharp')).default
    out.sharp = 'OK vips=' + (sharp.versions?.vips || '?')
  } catch (e: any) {
    out.sharp = 'FAIL: ' + (e?.message || String(e))
  }

  // 3) init do Payload + 1 query
  try {
    const config = (await import('@payload-config')).default
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })
    const r = await payload.find({ collection: 'media', limit: 1 })
    out.payload = 'OK totalDocs=' + r.totalDocs
  } catch (e: any) {
    out.payload =
      'FAIL: ' +
      (e?.message || String(e)) +
      ' ||STACK|| ' +
      String(e?.stack || '')
        .split('\n')
        .slice(0, 10)
        .join(' >> ')
  }

  return NextResponse.json(out)
}
