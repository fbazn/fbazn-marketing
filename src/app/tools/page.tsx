import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/landing/Header'

export const metadata: Metadata = {
  title: 'Tools – FBAZN',
  description:
    'Free Amazon FBA tools to help you find profitable products and calculate your margins.',
}

const tools = [
  {
    href: '/tools/fba-calculator',
    title: 'FBA Profit Calculator',
    description: 'Enter a buy box price and supplier cost to instantly calculate referral fee, fulfilment fee, net profit, ROI, and margin.',
    badge: 'UK',
  },
  {
    href: '/tools/roi-calculator',
    title: 'ROI Calculator',
    description: 'Return on investment for any product. Enter cost, selling price, and fees.',
    badge: 'UK',
  },
  {
    href: '/tools/fba-fee-calculator',
    title: 'FBA Fee Calculator',
    description: 'Exact Amazon fulfilment and referral fees broken down by category and size tier.',
    badge: 'UK',
  },
  {
    href: '/tools/break-even-price-calculator',
    title: 'Break-Even Price Calculator',
    description: 'Find the minimum selling price before you lose money, and the price needed for your target ROI.',
    badge: 'UK',
  },
  {
    href: '/tools/amazon-vat-calculator',
    title: 'Amazon VAT Calculator',
    description: 'Calculate VAT on your Amazon sales and understand your true margins.',
    badge: 'UK',
  },
  {
    href: '/tools/landed-cost-calculator',
    title: 'Landed Cost Calculator',
    description: 'True cost per unit including freight, customs duty, import VAT, and prep.',
    badge: 'UK',
  },
  {
    href: '/tools/acos-calculator',
    title: 'PPC ACoS Calculator',
    description: 'Find your maximum ACoS before your ads become unprofitable.',
    badge: 'PPC',
  },
  {
    href: '/tools/inventory-reorder-calculator',
    title: 'Inventory Reorder Calculator',
    description: 'Know exactly when to reorder and how many units to send to Amazon.',
    badge: 'FBA',
  },
  {
    href: '/tools/referral-fee-calculator',
    title: 'Referral Fee Calculator',
    description: 'Amazon referral fees by category with a full UK rate reference table.',
    badge: 'UK',
  },
  {
    href: '/tools/bsr-sales-estimator',
    title: 'BSR Sales Estimator',
    description: 'Estimate monthly sales from a product\'s Best Seller Rank.',
    badge: 'UK',
  },
]

export default function FreeToolsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#080c18] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-400">
            FBAZN
          </p>
          <h1 className="mt-2 font-[var(--font-barlow-condensed)] text-4xl font-black uppercase tracking-[0.04em] text-white">
            Free tools for Amazon FBA sellers
          </h1>
          <p className="mt-3 text-[#8b9cc8]">
            Practical calculators and utilities — no account required.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col gap-3 border border-[#1e2d4a] bg-[#0e1425] p-6 transition hover:border-indigo-500/50"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-base font-semibold text-white group-hover:text-indigo-400">
                    {tool.title}
                  </h2>
                  <span className="border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
                    {tool.badge}
                  </span>
                </div>
                <p className="text-sm text-[#8b9cc8]">{tool.description}</p>
                <span className="mt-auto text-sm font-medium text-indigo-400 group-hover:underline">
                  Open tool →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
