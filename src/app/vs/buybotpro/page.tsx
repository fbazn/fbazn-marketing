import type { Metadata } from 'next'
import ComparisonPage from './ComparisonPage'

export const metadata: Metadata = {
  title: 'FBAZN vs BuyBotPro — More Features. A Third of the Price.',
  description:
    'Thinking about BuyBotPro? See how FBAZN compares on features and pricing. Full sourcing dashboard, Keepa on Pro, and 10 free tools — starting at £10/mo vs £32/mo for BuyBotPro.',
  openGraph: {
    title: 'FBAZN vs BuyBotPro — More Features. A Third of the Price.',
    description:
      'Full sourcing dashboard, Keepa on Pro plan, and 10 free tools — FBAZN starts at £10/mo while BuyBotPro costs ~£32/mo.',
    type: 'website',
  },
}

export default function Page() {
  return <ComparisonPage />
}

