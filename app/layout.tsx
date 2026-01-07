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
  publisher: 'Diego Furtado',
  metadataBase: new URL('https://ironizi.app'),
  alternates: {
    canonical: '/',
  },
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
        alt: 'Ironizi - A IA mais sincera',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ironizi',
    creator: '@diegofurtado',
    title: 'Ironizi - A IA mais sincera que você vai encontrar',
    description: 'Conte o drama e receba uma zoeira sincera com um conselho questionável!',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'entertainment',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

const criticalCSS = `
:root{--radius:0.625rem;--background:oklch(1 0 0);--foreground:oklch(0.145 0 0);--border:oklch(0.922 0 0)}
body{background:oklch(1 0 0);color:oklch(0.145 0 0);margin:0}
.animate-slide-up{opacity:0}
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        <Preconnect />
        <StructuredData />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
