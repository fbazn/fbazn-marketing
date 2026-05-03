import Link from 'next/link'

const ALL_TOOLS = [
  { slug: 'fba-calculator', title: 'FBA Profit Calculator', description: 'Net profit, ROI and margin after all fees.' },
  { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment for any product.' },
  { slug: 'fba-fee-calculator', title: 'FBA Fee Calculator', description: 'Exact Amazon fulfilment and referral fees.' },
  { slug: 'break-even-price-calculator', title: 'Break-Even Price Calculator', description: 'Minimum viable selling price before you lose money.' },
  { slug: 'amazon-vat-calculator', title: 'Amazon VAT Calculator', description: 'VAT breakdown for UK Amazon sellers.' },
  { slug: 'landed-cost-calculator', title: 'Landed Cost Calculator', description: 'True cost per unit including freight and duty.' },
  { slug: 'acos-calculator', title: 'PPC ACoS Calculator', description: 'Break-even ACoS for profitable Amazon ads.' },
  { slug: 'inventory-reorder-calculator', title: 'Inventory Reorder Calculator', description: 'When to reorder and how many units to send.' },
  { slug: 'referral-fee-calculator', title: 'Referral Fee Calculator', description: 'Amazon referral fees by category.' },
  { slug: 'bsr-sales-estimator', title: 'BSR Sales Estimator', description: 'Estimate monthly sales from Best Seller Rank.' },
]

const RELATED: Record<string, string[]> = {
  'fba-calculator': ['roi-calculator', 'fba-fee-calculator', 'break-even-price-calculator'],
  'roi-calculator': ['fba-calculator', 'fba-fee-calculator', 'break-even-price-calculator'],
  'fba-fee-calculator': ['fba-calculator', 'referral-fee-calculator', 'break-even-price-calculator'],
  'break-even-price-calculator': ['fba-calculator', 'roi-calculator', 'fba-fee-calculator'],
  'amazon-vat-calculator': ['fba-calculator', 'landed-cost-calculator', 'roi-calculator'],
  'landed-cost-calculator': ['amazon-vat-calculator', 'fba-calculator', 'roi-calculator'],
  'acos-calculator': ['roi-calculator', 'fba-calculator', 'fba-fee-calculator'],
  'inventory-reorder-calculator': ['fba-calculator', 'roi-calculator', 'bsr-sales-estimator'],
  'referral-fee-calculator': ['fba-fee-calculator', 'fba-calculator', 'break-even-price-calculator'],
  'bsr-sales-estimator': ['roi-calculator', 'fba-calculator', 'inventory-reorder-calculator'],
}

export default function RelatedTools({ currentSlug }: { currentSlug: string }) {
  const relatedSlugs = RELATED[currentSlug] ?? []
  const related = relatedSlugs.map((s) => ALL_TOOLS.find((t) => t.slug === s)).filter(Boolean) as typeof ALL_TOOLS

  if (related.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#8b9cc8]">Related Tools</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex flex-col gap-1.5 border border-[#1e2d4a] bg-[#0e1425] p-4 transition hover:border-indigo-500/50"
          >
            <span className="text-sm font-semibold text-white group-hover:text-indigo-400">{tool.title}</span>
            <span className="text-xs text-[#8b9cc8]">{tool.description}</span>
            <span className="mt-1 text-xs font-medium text-indigo-400 group-hover:underline">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
