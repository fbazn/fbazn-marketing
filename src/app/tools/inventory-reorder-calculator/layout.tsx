import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Amazon FBA Inventory Reorder Calculator | FBAZN',
  description: 'Know exactly when to reorder FBA stock and how many units to send. Calculate reorder point, days of stock remaining and recommended order quantity.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
