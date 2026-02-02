import './globals.css'
import type { Metadata } from 'next'

const siteTitle = 'FBAZN — Amazon FBA Dashboard'
const siteDescription =
  'Evaluate products in seconds, save leads, and understand true profit after fees with FBAZN — the Amazon FBA dashboard built for sellers.'

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: '/favicon.svg',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
