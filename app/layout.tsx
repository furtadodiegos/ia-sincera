import type { Metadata } from 'next'
import './globals.css'

import { Geist, Geist_Mono } from 'next/font/google'
import { PostHogProvider } from '@/lib/posthog'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Ironizi - Roasts e Conselhos com Humor',
    template: '%s | Ironizi',
  },
  description: 'Conte o drama do seu amigo e receba um roast sincero com um conselho questionavel. Humor garantido!',
  keywords: ['roast', 'humor', 'ia', 'conselho', 'drama', 'amigo', 'ironizi'],
  authors: [{ name: 'Diego Furtado' }],
  creator: 'Diego Furtado',
  metadataBase: new URL('https://ironizi.app'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ironizi',
    title: 'Ironizi - Roasts e Conselhos com Humor',
    description: 'Conte o drama do seu amigo e receba um roast sincero com um conselho questionavel.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ironizi',
    description: 'Roasts e conselhos com humor para o drama do seu amigo.',
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
