import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Amazon FBA Break-Even Price Calculator | FBAZN',
  description: 'Find the minimum selling price you need to break even or hit a target ROI on Amazon FBA. Accounts for referral fees and fulfilment costs.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
