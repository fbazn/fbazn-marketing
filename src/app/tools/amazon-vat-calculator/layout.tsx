import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Amazon UK VAT Calculator for FBA Sellers | FBAZN',
  description: 'Calculate VAT on your Amazon UK sales. Convert between inc and ex VAT prices, and understand how VAT affects your FBA margins.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
