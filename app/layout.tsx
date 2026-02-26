import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { PrivyWrapper } from '@/components/providers/privy-provider'
import { WalletProvider } from '@/contexts/wallet-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
      <body className={`font-sans antialiased`}>
        <PrivyWrapper>
          <WalletProvider>
            {children}
          </WalletProvider>
        </PrivyWrapper>
      </body>
    </html>
  )
}
