import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Amazon FBA ROI Calculator | FBAZN',
  description: 'Calculate return on investment for any Amazon FBA product. Enter cost price, selling price and fees to get ROI %, net profit and margin instantly.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
