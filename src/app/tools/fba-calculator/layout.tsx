import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Amazon FBA Profit Calculator UK | FBAZN',
  description: 'Calculate your true net profit, ROI and margin on any Amazon UK product after referral fees, FBA fulfilment fees and supplier cost. Free tool.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
