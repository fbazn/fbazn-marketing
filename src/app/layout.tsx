// app/layout.tsx

import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FBAZN — Amazon FBA Tools',
  description: 'A smart toolkit for Amazon FBA sellers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white shadow-md px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">FBAZN</span>
            <nav className="space-x-4 text-sm text-gray-600">
              <a href="/" className="hover:text-black">Home</a>
              <a href="/blog" className="hover:text-black">Blog</a>
              <a href="https://app.fbazn.com" className="hover:text-black">App</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-100 text-sm text-center text-gray-500 py-4">
          © {new Date().getFullYear()} FBAZN. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
