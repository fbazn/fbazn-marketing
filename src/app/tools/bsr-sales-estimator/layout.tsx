import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Amazon BSR to Monthly Sales Estimator | FBAZN',
  description: 'Estimate monthly unit sales from an Amazon Best Seller Rank. Select a category and enter a BSR to see estimated sales volume and revenue.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
