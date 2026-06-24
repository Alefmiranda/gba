import Link from 'next/link'
import { Button } from '../_components/Button'
import { SiteNav } from '../_components/SiteNav'
import { Footer } from '../_components/Footer'
import { getPosts } from '../_lib/content'

export const revalidate = 15

const gradientes = [
  'linear-gradient(160deg, #053A44, #032930)',
  'linear-gradient(160deg, #77CDDE, #053A44)',
  'linear-gradient(160deg, #0e0e0c, #032930)',
]

export default async function BlogIndex() {
  const posts = await getPosts()

  return (
    <>
      <SiteNav />
      <main className="flex-1 bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 marker text-ink/55 hover:text-ink text-[10px] transition"
        >
          <span className="text-[14px]">←</span> Início
        </Link>

        <h1 className="mt-8 display text-ink text-[clamp(36px,6vw,84px)] leading-[0.95] tracking-[-0.03em]">
          Blog
        </h1>
        <p className="mt-5 text-ink/70 text-[18px] lg:text-[20px] font-normal max-w-xl">
          Artigos, dicas e análises pra quem leva o treino a sério.
        </p>

        {posts.length === 0 ? (
          <div className="mt-16 border-t border-ink/15 pt-12 text-ink/50 marker text-[11px]">
            Em breve novos conteúdos.
          </div>
        ) : (
          <div className="mt-14 lg:mt-16 grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-12 border-t border-ink/15 pt-10">
            {posts.map((p, i) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="col-span-12 sm:col-span-6 lg:col-span-4 group block"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-ink rounded-md"
                  style={p.capa ? undefined : { background: gradientes[i % 3] }}
                >
                  {p.capa ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.capa}
                      alt={p.titulo}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 grain" />
                  )}
                  <span className="absolute top-4 left-4 marker text-canvas text-[9px] bg-ink/30 backdrop-blur-sm border border-canvas/20 px-2 py-1 rounded-full">
                    {p.categoria}
                  </span>
                </div>
                <h2 className="mt-5 display text-ink text-[22px] lg:text-[24px] leading-tight group-hover:text-brand transition">
                  {p.titulo}
                </h2>
                <p className="mt-2 text-ink/65 text-[15px] lg:text-[16px] font-normal leading-[1.45]">
                  {p.resumo}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Button href="/#contato" variant="primary-dark">Falar com o Guilherme</Button>
        </div>
      </div>
      </main>
      <Footer />
    </>
  )
}
