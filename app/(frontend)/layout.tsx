import type { Metadata } from 'next'
import { Archivo, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from './_components/SmoothScroll'
import { ScrollProgress } from './_components/ScrollProgress'

// Archivo variable — inclui eixo de largura (wdth) pra usar a versão Expanded nas headlines
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  axes: ['wdth'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Guilherme Borges Assessoria · Treino individual, resultado real',
  description:
    'Assessoria de corrida online com método de atleta de alto rendimento. Do primeiro 5K ao próximo PR.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <SmoothScroll>
          <ScrollProgress />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
