import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

// Lê o conteúdo publicado DIRETO do banco (Local API do Payload) — sem HTTP,
// sem depender de domínio/SSL. Roda em milissegundos em qualquer ambiente.
async function getDb() {
  return getPayload({ config })
}

const BUCKET = process.env.S3_BUCKET || 'media'
// base público do Supabase Storage (CDN — rápido e cacheado), derivado do endpoint S3.
const _ref = (process.env.S3_ENDPOINT || '').match(/https?:\/\/([^.]+)\.storage\.supabase\.co/)?.[1]
const PUBLIC_MEDIA_BASE = _ref
  ? `https://${_ref}.supabase.co/storage/v1/object/public/${BUCKET}`
  : ''

type MediaDoc = {
  url?: string | null
  filename?: string | null
  sizes?: Record<string, { url?: string | null; filename?: string | null } | undefined>
}

function mediaUrl(m: unknown, size?: string): string | null {
  if (!m || typeof m !== 'object') return null
  const doc = m as MediaDoc
  // nome do arquivo (variante redimensionada quando pedida)
  let filename: string | null = null
  if (size && doc.sizes?.[size]?.filename) filename = doc.sizes[size]!.filename ?? null
  if (!filename) filename = doc.filename ?? null
  // serve DIRETO do CDN público do Supabase — sem passar pelo proxy serverless (muito mais rápido)
  if (filename && PUBLIC_MEDIA_BASE) return `${PUBLIC_MEDIA_BASE}/${encodeURIComponent(filename)}`
  // fallback: url do proxy do Payload
  let u: string | null = null
  if (size && doc.sizes?.[size]?.url) u = doc.sizes[size]!.url ?? null
  if (!u) u = doc.url ?? null
  return u ?? null
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
        // thumb leve (card ~168KB) pra grade; a lightbox amplia pro full
        const src = mediaUrl(d.foto, 'card')
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

export type FAQItem = { pergunta: string; resposta: string }

/** Perguntas frequentes (ordenadas). [] se vazio → frontend usa o fallback fixo. */
export async function getFAQ(): Promise<FAQItem[]> {
  try {
    const db = await getDb()
    const { docs } = await db.find({
      collection: 'faq',
      sort: 'ordem',
      limit: 100,
      depth: 0,
    })
    return (docs as unknown as Record<string, unknown>[])
      .map((d) => ({
        pergunta: String(d.pergunta ?? ''),
        resposta: String(d.resposta ?? ''),
      }))
      .filter((x) => x.pergunta && x.resposta)
  } catch {
    return []
  }
}

export type DepoimentoVideo = { id: string }
export type DepoimentoTexto = { nome: string; destaque: string; paragrafos: string[] }
export type DepoimentosData = { videos: DepoimentoVideo[]; textos: DepoimentoTexto[] }

function ytId(url: string): string | null {
  const m = String(url).match(
    /(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  return m ? m[1] : null
}

/** Depoimentos (vídeo + texto). { videos:[], textos:[] } se vazio → fallback fixo. */
export async function getDepoimentos(): Promise<DepoimentosData> {
  try {
    const db = await getDb()
    const { docs } = await db.find({
      collection: 'depoimentos',
      limit: 100,
      depth: 0,
      sort: 'ordem',
    })
    const rows = docs as unknown as Record<string, unknown>[]
    const videos = rows
      .filter((d) => d.tipo === 'video')
      .sort(
        (a, b) =>
          (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0) ||
          (Number(a.ordem) || 0) - (Number(b.ordem) || 0),
      )
      .map((d) => {
        const id = ytId(String(d.videoUrl || ''))
        return id ? { id } : null
      })
      .filter((x): x is DepoimentoVideo => x !== null)
    const textos = rows
      .filter((d) => d.tipo === 'texto')
      .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0))
      .map((d) => ({
        nome: String(d.nome || ''),
        destaque: String(d.citacao || ''),
        paragrafos: Array.isArray(d.paragrafos)
          ? (d.paragrafos as Record<string, unknown>[])
              .map((p) => String(p.texto || ''))
              .filter(Boolean)
          : [],
      }))
      .filter((t) => t.nome && t.destaque)
    return { videos, textos }
  } catch {
    return { videos: [], textos: [] }
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
