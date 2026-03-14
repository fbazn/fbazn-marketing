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
    description:
      'Enter a buy box price and supplier cost to instantly calculate your referral fee, fulfilment fee, net profit, ROI, and margin.',
    badge: 'UK',
  },
]

export default function FreeToolsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Tools
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Tools for Amazon FBA sellers
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Practical calculators and utilities — no account required.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600">
                    {tool.title}
                  </h2>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                    {tool.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{tool.description}</p>
                <span className="mt-auto text-sm font-medium text-indigo-600 group-hover:underline">
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
