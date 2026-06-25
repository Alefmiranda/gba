import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '../../_components/Button'
import { SiteNav } from '../../_components/SiteNav'
import { FAQ } from '../../_components/FAQ'
import { Footer } from '../../_components/Footer'
import { getPostBySlug, getFAQ } from '../../_lib/content'

export const revalidate = 15

const BUCKET = process.env.S3_BUCKET || 'media'
const _ref = (process.env.S3_ENDPOINT || '').match(/https?:\/\/([^.]+)\.storage\.supabase\.co/)?.[1]
const PUBLIC_MEDIA_BASE = _ref
  ? `https://${_ref}.supabase.co/storage/v1/object/public/${BUCKET}`
  : ''

function mediaUrl(m: unknown): string | null {
  if (!m || typeof m !== 'object') return null
  const doc = m as { url?: string | null; filename?: string | null }
  // serve direto do CDN público do Supabase (rápido + cacheado)
  if (doc.filename && PUBLIC_MEDIA_BASE) return `${PUBLIC_MEDIA_BASE}/${encodeURIComponent(doc.filename)}`
  return doc.url ?? null
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, faq] = await Promise.all([getPostBySlug(slug), getFAQ()])
  if (!post) notFound()

  const capa = mediaUrl(post.capa)
  const data = post.publicadoEm
    ? new Date(post.publicadoEm as string).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <>
      <SiteNav />
      <main className="flex-1 bg-canvas">
      <article className="mx-auto max-w-[820px] px-6 lg:px-10 py-16 lg:py-24">
        {/* voltar */}
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 marker text-ink/55 hover:text-ink text-[10px] transition"
        >
          <span className="text-[14px]">←</span> Voltar ao blog
        </Link>

        {/* meta */}
        <div className="mt-10 flex items-center gap-3 marker text-[10px] text-ink/45">
          <span className="text-brand-accent">{String(post.categoria ?? '')}</span>
          {data && (
            <>
              <span className="h-px w-6 bg-ink/20" />
              <span>{data}</span>
            </>
          )}
        </div>

        {/* título */}
        <h1 className="mt-5 display text-ink text-[clamp(30px,4.5vw,56px)] leading-[1.02] tracking-[-0.02em]">
          {String(post.titulo ?? '')}
        </h1>

        {/* resumo */}
        {post.resumo ? (
          <p className="mt-6 text-ink/70 text-[18px] lg:text-[20px] font-normal leading-[1.5]">
            {String(post.resumo)}
          </p>
        ) : null}

        {/* capa */}
        {capa ? (
          <div className="mt-10 relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capa} alt={String(post.titulo ?? '')} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ) : null}

        {/* conteúdo */}
        <div className="post-content mt-12 text-ink/85 text-[17px] lg:text-[18px] leading-[1.7]">
          <RichText data={post.conteudo as SerializedEditorState} />
        </div>

        {/* CTA */}
        <div className="mt-16 pt-10 border-t border-ink/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="display text-ink text-[22px] lg:text-[26px] leading-tight max-w-sm">
            Quer treinar com método?
          </p>
          <Button href="/#contato" variant="primary-dark">Falar com o Guilherme</Button>
        </div>
      </article>

      <FAQ itemsCms={faq} />
      </main>
      <Footer />
    </>
  )
}
