import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'FBA Landed Cost Calculator — Freight, Duty & Prep | FBAZN',
  description: 'Calculate your true landed cost per unit for Amazon FBA including freight, customs duty, import VAT and prep fees. Essential for overseas sourcing.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
