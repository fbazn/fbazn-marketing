'use client'

import { useState, useCallback, useEffect } from 'react'
import ToolShell, { ToolCard, ToolRow, ToolStatCard, ToolDivider, inputWithPrefixCls, labelCls, prefixCls } from '@/components/tools/ToolShell'
import RelatedTools from '@/components/tools/RelatedTools'

interface Results {
  grossProfit: number
  netProfit: number
  roi: number
  margin: number
}

export default function RoiCalculatorPage() {
  const [costPrice, setCostPrice] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [totalFees, setTotalFees] = useState('')

  const [results, setResults] = useState<Results | null>(null)

  const calculate = useCallback(() => {
    const cost = parseFloat(costPrice)
    const price = parseFloat(sellingPrice)
    const fees = parseFloat(totalFees) || 0
    if (!cost || !price) return

    const grossProfit = price - cost
    const netProfit = price - cost - fees
    const roi = cost > 0 ? (netProfit / cost) * 100 : 0
    const margin = price > 0 ? (netProfit / price) * 100 : 0

    setResults({ grossProfit, netProfit, roi, margin })
  }, [costPrice, sellingPrice, totalFees])

  useEffect(() => { calculate() }, [calculate])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })
  const pct = (n: number) => `${n.toFixed(1)}%`

  return (
    <ToolShell title="Amazon FBA ROI Calculator" description="UK marketplace · Calculate return on investment for any product">
      <ToolCard heading="Product Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            Cost Price (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>

          <label className={labelCls}>
            Selling Price (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>

          <label className={`${labelCls} sm:col-span-2`}>
            Total Amazon Fees (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={totalFees} onChange={(e) => setTotalFees(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>
        </div>
      </ToolCard>

      {results && (
        <ToolCard heading="Breakdown">
          <ToolRow label="Selling Price" value={fmt(parseFloat(sellingPrice))} />
          <ToolRow label="Cost Price" value={`− ${fmt(parseFloat(costPrice))}`} muted />
          <ToolRow label="Total Fees" value={`− ${fmt(parseFloat(totalFees) || 0)}`} muted />
          <ToolDivider />
          <ToolRow label="Gross Profit" value={fmt(results.grossProfit)} />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <ToolStatCard label="Net Profit" value={fmt(results.netProfit)} colorClass={results.netProfit > 0 ? 'text-emerald-400' : 'text-rose-400'} />
            <ToolStatCard label="ROI" value={pct(results.roi)} colorClass={results.roi >= 30 ? 'text-emerald-400' : results.roi >= 0 ? 'text-amber-400' : 'text-rose-400'} />
            <ToolStatCard label="Margin" value={pct(results.margin)} colorClass={results.margin >= 20 ? 'text-emerald-400' : results.margin >= 0 ? 'text-amber-400' : 'text-rose-400'} />
          </div>
        </ToolCard>
      )}

      <p className="text-center text-xs text-[#8b9cc8]">
        Enter your total Amazon fees manually or use the FBA Fee Calculator to get an exact figure.
      </p>
      <RelatedTools currentSlug="roi-calculator" />
    </ToolShell>
  )
}
