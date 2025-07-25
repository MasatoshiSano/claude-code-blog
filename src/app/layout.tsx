import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { SimpleHeader } from '@/components/layout/SimpleHeader'
import { SimpleFooter } from '@/components/layout/SimpleFooter'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'モノトーンブログ',
    template: '%s | モノトーンブログ',
  },
  description: '限界を超えたスタイリッシュでクールなモノトーン基調のブログサイト',
  keywords: ['ブログ', 'モノトーン', 'デザイン', 'テクノロジー', 'Next.js'],
  authors: [{ name: 'Claude Code' }],
  creator: 'Claude Code',
  publisher: 'モノトーンブログ',
  metadataBase: new URL('https://monochrome-blog.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://monochrome-blog.vercel.app',
    siteName: 'モノトーンブログ',
    title: 'モノトーンブログ',
    description: '限界を超えたスタイリッシュでクールなモノトーン基調のブログサイト',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'モノトーンブログ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'モノトーンブログ',
    description: '限界を超えたスタイリッシュでクールなモノトーン基調のブログサイト',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-primary)', fontFamily: 'var(--font-inter)' }}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <SimpleHeader />
            <main className="flex-1">
              {children}
            </main>
            <SimpleFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}