import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

// Lê o conteúdo publicado DIRETO do banco (Local API do Payload) — sem HTTP,
// sem depender de domínio/SSL. Roda em milissegundos em qualquer ambiente.
async function getDb() {
  return getPayload({ config })
}

type MediaDoc = {
  url?: string | null
  sizes?: Record<string, { url?: string | null } | undefined>
}

function mediaUrl(m: unknown, size?: string): string | null {
  if (!m || typeof m !== 'object') return null
  const doc = m as MediaDoc
  let u: string | null = null
  if (size && doc.sizes?.[size]?.url) u = doc.sizes[size]!.url ?? null
  if (!u) u = doc.url ?? null
  if (!u) return null
  // mantém relativo (same-origin) — funciona no next/image e em qualquer ambiente
  return u
}

export type HeroSlide = { id: string; src: string; alt: string }
export type GaleriaItem = { id: string; src: string; alt: string }
export type VideoItem = { id: string; src: string; label: string }
export type PostCard = {
  id: string
  slug: string
  titulo: string
  resumo: string
  categoria: string
  capa: string | null
}
export type PlanoItem = {
  id: string
  nome: string
  preco: number
  mensalEquiv: number | null
  tagline: string
  recursos: string[]
  destaque: boolean
}

/** Slides do carrossel do Hero (ordenados). */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const db = await getDb()
    const { docs } = await db.find({
      collection: 'hero-slides',
      sort: 'ordem',
      limit: 12,
      depth: 1,
    })
    return (docs as unknown as Record<string, unknown>[])
      .map((d) => {
        const src = mediaUrl(d.foto, 'hero')
        if (!src) return null
        return { id: String(d.id), src, alt: (d.titulo as string) ?? 'Hero' }
      })
      .filter((x): x is HeroSlide => x !== null)
  } catch {
    return []
  }
}

/** Fotos da galeria (ordenadas). [] se vazio/erro → frontend usa fallback. */
export async function getGaleria(): Promise<GaleriaItem[]> {
  try {
    const db = await getDb()
    const { docs } = await db.find({
      collection: 'galeria',
      sort: 'ordem',
      limit: 100,
      depth: 1,
    })
    return (docs as unknown as Record<string, unknown>[])
      .map((d) => {
        const src = mediaUrl(d.foto)
        if (!src) return null
        return { id: String(d.id), src, alt: (d.titulo as string) ?? 'Foto' }
      })
      .filter((x): x is GaleriaItem => x !== null)
  } catch {
    return []
  }
}

/** Vídeos (ordenados). Usa o arquivo subido; senão o link YouTube/Vimeo. */
export async function getVideos(): Promise<VideoItem[]> {
  try {
    const db = await getDb()
    const { docs } = await db.find({
      collection: 'videos',
      // destaque primeiro (vira o quadro grande), depois pela ordem
      sort: '-destaque,ordem',
      limit: 100,
      depth: 1,
    })
    return (docs as unknown as Record<string, unknown>[])
      .map((d, i) => {
        const src = mediaUrl(d.arquivo) ?? ((d.url as string) || '')
        if (!src) return null
        return {
          id: String(d.id),
          src,
          label: i === 0 ? 'Principal' : String(i + 1).padStart(2, '0'),
        }
      })
      .filter((x): x is VideoItem => x !== null)
  } catch {
    return []
  }
}

/** Posts publicados (cards). */
export async function getPosts(): Promise<PostCard[]> {
  try {
    const db = await getDb()
    const { docs } = await db.find({
      collection: 'posts',
      where: { status: { equals: 'publicado' } },
      sort: '-publicadoEm',
      limit: 50,
      depth: 1,
    })
    return (docs as unknown as Record<string, unknown>[]).map((d) => ({
      id: String(d.id),
      slug: (d.slug as string) ?? '',
      titulo: (d.titulo as string) ?? '',
      resumo: (d.resumo as string) ?? '',
      categoria: (d.categoria as string) ?? '',
      capa: mediaUrl(d.capa, 'card'),
    }))
  } catch {
    return []
  }
}

/** Planos (ordenados). */
export async function getPlanos(): Promise<PlanoItem[]> {
  try {
    const db = await getDb()
    const { docs } = await db.find({
      collection: 'planos',
      sort: 'ordem',
      limit: 20,
      depth: 0,
    })
    return (docs as unknown as Record<string, unknown>[]).map((d) => ({
      id: String(d.id),
      nome: (d.nome as string) ?? '',
      preco: Number(d.preco ?? 0),
      mensalEquiv:
        d.precoMensalEquivalente != null ? Number(d.precoMensalEquivalente) : null,
      tagline: (d.tagline as string) ?? '',
      recursos: Array.isArray(d.recursos)
        ? (d.recursos as { texto?: string }[]).map((r) => r.texto ?? '').filter(Boolean)
        : [],
      destaque: Boolean(d.destaque),
    }))
  } catch {
    return []
  }
}

/** Um post pelo slug (pra página individual). */
export async function getPostBySlug(slug: string): Promise<Record<string, unknown> | null> {
  try {
    const db = await getDb()
    const { docs } = await db.find({
      collection: 'posts',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'publicado' } }],
      },
      limit: 1,
      depth: 1,
    })
    return (docs[0] as unknown as Record<string, unknown>) ?? null
  } catch {
    return null
  }
}
