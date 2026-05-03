import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Amazon Referral Fee Calculator by Category UK | FBAZN',
  description: 'See Amazon UK referral fees for every product category. Enter your selling price to calculate the exact referral fee Amazon will charge.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
