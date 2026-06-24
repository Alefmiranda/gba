import { Hero } from './_components/Hero'
import { Preloader } from './_components/Preloader'
import { StickyHeader } from './_components/StickyHeader'
import { ParaQuemE } from './_components/ParaQuemE'
import { Problema } from './_components/Problema'
import { Solucao } from './_components/Solucao'
import { Incluso } from './_components/Incluso'
import { ComoFunciona } from './_components/ComoFunciona'
import { Videos } from './_components/Videos'
import { Galeria } from './_components/Galeria'
import { Depoimentos } from './_components/Depoimentos'
import { Planos } from './_components/Planos'
import { Sobre } from './_components/Sobre'
import { Blog } from './_components/Blog'
import { FAQ } from './_components/FAQ'
import { CTAFinal } from './_components/CTAFinal'
import { Footer } from './_components/Footer'
import { getGaleria, getVideos, getPosts, getPlanos, getHeroSlides } from './_lib/content'

// revalida o conteúdo do admin a cada 15s
export const revalidate = 15

export default async function Home() {
  const [galeria, videos, posts, planos, heroSlides] = await Promise.all([
    getGaleria(),
    getVideos(),
    getPosts(),
    getPlanos(),
    getHeroSlides(),
  ])

  return (
    <>
      <Preloader />
      <StickyHeader />
      <main className="flex-1">
        <Hero slidesCms={heroSlides} />
        <ParaQuemE />
        <Problema />
        <Solucao />
        <Incluso />
        <ComoFunciona />
        <Videos videosCms={videos} />
        <Galeria fotosCms={galeria.map((g) => g.src)} />
        <Depoimentos />
        <Planos planosCms={planos} />
        <Sobre />
        <Blog postsCms={posts} />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
