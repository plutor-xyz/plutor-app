import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils/cn'
import { WalletContextProvider } from '@/components/wallet/wallet-context'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Plutor - Create Wealth From Invoices',
  description:
    'Transform invoices into instant liquidity using TIPS Protocol on Solana. The wealth creator for your business.',
  keywords: [
    'invoice finance',
    'DeFi',
    'Solana',
    'TIPS Protocol',
    'liquidity',
    'wealth creation',
  ],
  authors: [{ name: 'Plutor Team' }],
  creator: 'Plutor',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://plutor.xyz',
    title: 'Plutor - Create Wealth From Invoices',
    description:
      'Transform invoices into instant liquidity using TIPS Protocol on Solana',
    siteName: 'Plutor',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Plutor - Create Wealth From Invoices',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plutor - Create Wealth From Invoices',
    description:
      'Transform invoices into instant liquidity using TIPS Protocol on Solana',
    images: ['/images/og-image.png'],
    creator: '@plutor',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  icons: {
    icon: [
      { url: '/icons/plutor-svg-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable
        )}
        suppressHydrationWarning
      >
        <WalletContextProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </WalletContextProvider>

        {/* Cosmic background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-plutor-purple/5 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-plutor-gold/5 rounded-full blur-3xl animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-plutor-purple/3 rounded-full blur-3xl animate-orbital" />
        </div>
      </body>
    </html>
  )
}
