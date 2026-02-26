import React from "react"
import type { Metadata } from 'next'
import localFont from "next/font/local"
import dynamic from 'next/dynamic'
import { WalletProvider } from '@/contexts/wallet-context'
import './globals.css'

// Load Privy client-side only — prevents SSR crash during static generation
const PrivyWrapper = dynamic(
  () => import('@/components/providers/privy-provider').then(mod => mod.PrivyWrapper),
  { ssr: false }
);

const geistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Quiflix - Film Distribution Platform',
  description: 'Distribute your films globally. Connect with filmmakers, manage campaigns, and track earnings in one platform.',
  generator: 'Quiflix',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <PrivyWrapper>
          <WalletProvider>
            {children}
          </WalletProvider>
        </PrivyWrapper>
      </body>
    </html>
  )
}
