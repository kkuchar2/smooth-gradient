import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import './globals.css'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3003'

export const metadata: Metadata = {
  title: 'Gaussian Gradient Generator',
  description:
    'Generate smooth Gaussian gradients with customizable distribution, dithering, and CSS export',
  metadataBase: new URL(siteUrl),
  applicationName: 'Gaussian Gradient Generator',
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Gaussian Gradient Generator',
    description:
      'Generate smooth Gaussian gradients with customizable distribution, dithering, and CSS export',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Smooth Gaussian gradient preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaussian Gradient Generator',
    description:
      'Generate smooth Gaussian gradients with customizable distribution, dithering, and CSS export',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={jetbrains.variable} suppressHydrationWarning>
        {children}
        <div id="modal-root" />
      </body>
    </html>
  )
}
