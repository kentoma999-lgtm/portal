import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { FooterSection } from '@/components/footer-section'
import './globals.css'

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://lumitera.ru'),
  title: 'Lumitera — Автоматизация продаж',
  description: 'AI-сервис автоматизации продаж, записей и общения с клиентами для бизнеса.',
  openGraph: {
    title: 'Lumitera — Автоматизация продаж',
    description: 'AI-сервис автоматизации продаж, записей и общения с клиентами для бизнеса.',
    siteName: 'Lumitera',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lumitera — Автоматизация продаж',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumitera — Автоматизация продаж',
    description: 'AI-сервис автоматизации продаж, записей и общения с клиентами для бизнеса.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-background">
      <body className={`${geist.className} font-sans antialiased`}>
        <Providers>
          <Navigation />
          {children}
          <FooterSection />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
