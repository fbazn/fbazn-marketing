import './globals.css'
import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'

const siteTitle = 'FBAZN — Amazon FBA Dashboard'
const siteDescription =
  'Evaluate products in seconds, save leads, and understand true profit after fees with FBAZN — the Amazon FBA dashboard built for sellers.'

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
}

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-barlow-condensed',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen bg-[#080c18] text-[#f0f4ff] antialiased">
        {children}
      </body>
    </html>
  )
}
