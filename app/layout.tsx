import type { Metadata } from 'next'
import './globals.css'

import { Geist, Geist_Mono } from 'next/font/google'
import { PostHogProvider } from '@/lib/posthog'
import { Preconnect } from './preconnect'
import { StructuredData } from './structured-data'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ironizi - A IA mais sincera que você vai encontrar',
    template: '%s | Ironizi',
  },
  description:
    'Conte o drama do seu amigo e receba uma zoeira sincera com um conselho questionável. A IA de humor que fala o que todo mundo pensa!',
  keywords: ['zoeira', 'humor', 'ia', 'conselho', 'drama', 'amigo', 'ironizi', 'zueira', 'sarcasmo', 'roast', 'gpt'],
  authors: [{ name: 'Diego Furtado' }],
  creator: 'Diego Furtado',
  metadataBase: new URL('https://ironizi.app'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://ironizi.app',
    siteName: 'Ironizi',
    title: 'Ironizi - A IA mais sincera que você vai encontrar',
    description:
      'Conte o drama do seu amigo e receba uma zoeira sincera com um conselho questionável. Humor garantido!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ironizi - Zoeiras e Conselhos com IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ironizi',
    title: 'Ironizi - A IA mais sincera que você vai encontrar',
    description: 'Conte o drama e receba uma zoeira sincera com um conselho questionável!',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Preconnect />
        <StructuredData />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
