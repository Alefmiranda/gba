import Link from 'next/link'
import { Button } from './Button'
import { SectionLabel } from './SectionLabel'

type PostCard = {
  id: string
  slug: string
  titulo: string
  resumo: string
  categoria: string
  capa: string | null
}

// fallback quando o admin ainda não tem posts publicados
const postsFallback: PostCard[] = [
  {
    id: 'f1',
    slug: '',
    categoria: 'Treino',
    titulo: 'Como montar uma semana de treino sem se lesionar',
    resumo: 'Os 4 erros que toda planilha gratuita comete. E como ajustar.',
    capa: null,
  },
  {
    id: 'f2',
    slug: '',
    categoria: 'Performance',
    titulo: 'Pace, FC e PSE: o tripé que muda sua corrida',
    resumo: 'Entenda os três indicadores que todo atleta sério monitora.',
    capa: null,
  },
  {
    id: 'f3',
    slug: '',
    categoria: 'Iniciantes',
    titulo: 'Do sofá ao primeiro 5K em 8 semanas',
    resumo: 'Guia honesto pra iniciante que quer começar do jeito certo.',
    capa: null,
  },
]

const gradientes = [
  'linear-gradient(160deg, #053A44, #032930)',
  'linear-gradient(160deg, #77CDDE, #053A44)',
  'linear-gradient(160deg, #0e0e0c, #032930)',
]

export function Blog({ postsCms }: { postsCms?: PostCard[] }) {
  const posts = postsCms && postsCms.length > 0 ? postsCms : postsFallback

  return (
    <section id="blog" className="py-20 lg:py-28 bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="13" label="Blog" />

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-4 lg:gap-y-0 items-end">
          <h2 className="col-span-12 lg:col-span-8 display text-ink text-[clamp(34px,5vw,72px)] leading-[0.95]">
            Conhecimento que faz você{' '}
            <em
              className="italic-display text-brand-accent"
              style={{ fontStyle: 'italic' }}
            >
              correr melhor.
            </em>
          </h2>
          <p className="col-span-12 lg:col-span-4 text-ink/75 text-[18px] lg:text-[20px] font-normal leading-[1.4] lg:pb-2">
            Artigos, dicas e análises pra quem leva o treino a sério.
          </p>
        </div>

        <div className="mt-14 lg:mt-16 grid grid-cols-12 gap-x-4 lg:gap-x-6 gap-y-10 border-t border-ink/15 pt-8">
          {posts.map((p, i) => {
            return (
              <Link
                key={p.id}
                href={p.slug ? `/blog/${p.slug}` : '#'}
                className="col-span-12 sm:col-span-6 lg:col-span-4 group cursor-pointer block"
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
                  <div className="absolute top-4 left-4">
                    <span className="marker text-canvas text-[9px] bg-ink/30 backdrop-blur-sm border border-canvas/20 px-2 py-1 rounded-full">
                      {p.categoria}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="display text-ink text-[22px] lg:text-[24px] leading-tight group-hover:text-brand transition">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 text-ink/65 text-[15px] lg:text-[16px] font-normal leading-[1.45]">
                    {p.resumo}
                  </p>
                  <div className="mt-4 marker text-brand text-[10px] group-hover:translate-x-0.5 transition inline-flex items-center gap-1">
                    Ler mais <span>→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/blog" variant="primary-dark">Ver todos os posts</Button>
        </div>
      </div>
    </section>
  )
}
