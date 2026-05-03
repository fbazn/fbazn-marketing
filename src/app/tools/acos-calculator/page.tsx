'use client'

import { useState, useCallback, useEffect } from 'react'
import ToolShell, { ToolCard, ToolRow, ToolStatCard, ToolDivider, ToolInfoBox, inputWithPrefixCls, inputCls, labelCls, prefixCls, suffixCls } from '@/components/tools/ToolShell'

interface Results {
  profitPerUnit: number
  breakEvenAcos: number
  targetAcos: number
}

export default function AcosCalculatorPage() {
  const [sellingPrice, setSellingPrice] = useState('')
  const [totalCosts, setTotalCosts] = useState('')
  const [targetMargin, setTargetMargin] = useState('0')

  const [results, setResults] = useState<Results | null>(null)

  const calculate = useCallback(() => {
    const price = parseFloat(sellingPrice)
    const costs = parseFloat(totalCosts)
    const margin = parseFloat(targetMargin) || 0
    if (!price || !costs) return

    const profitPerUnit = price - costs
    const breakEvenAcos = (profitPerUnit / price) * 100
    const targetAcos = ((profitPerUnit - price * (margin / 100)) / price) * 100

    setResults({ profitPerUnit, breakEvenAcos, targetAcos })
  }, [sellingPrice, totalCosts, targetMargin])

  useEffect(() => { calculate() }, [calculate])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })
  const pct = (n: number) => `${n.toFixed(1)}%`

  return (
    <ToolShell title="Amazon PPC Break-Even ACoS Calculator" description="Find your maximum ACoS before your ads become unprofitable">
      <ToolCard heading="Product Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            Selling Price (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>

          <label className={labelCls}>
            Total Costs (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={totalCosts} onChange={(e) => setTotalCosts(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
            <p className="text-xs text-[#8b9cc8]">Cost price + Amazon fees combined</p>
          </label>

          <label className={`${labelCls} sm:col-span-2`}>
            Target Profit Margin (%) — optional
            <div className="relative">
              <input type="number" min="0" step="1" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} placeholder="0" className={`${inputCls} pr-8`} />
              <span className={suffixCls}>%</span>
            </div>
            <p className="text-xs text-[#8b9cc8]">Set to 0 to calculate pure break-even ACoS</p>
          </label>
        </div>
      </ToolCard>

      {results && (
        <ToolCard heading="ACoS Analysis">
          <ToolRow label="Profit per Unit (before ads)" value={fmt(results.profitPerUnit)} />
          <ToolDivider />
          <div className="grid grid-cols-2 gap-3">
            <ToolStatCard label="Break-Even ACoS" value={pct(Math.max(0, results.breakEvenAcos))} colorClass="text-white" />
            <ToolStatCard label={`Target ACoS (${targetMargin}% margin)`} value={pct(Math.max(0, results.targetAcos))} colorClass={results.targetAcos > 0 ? 'text-emerald-400' : 'text-rose-400'} />
          </div>
          {results.breakEvenAcos > 0 && (
            <ToolInfoBox variant="indigo">
              If your actual ACoS is above <strong>{pct(results.breakEvenAcos)}</strong>, your ads are losing money on this product.
            </ToolInfoBox>
          )}
          {results.breakEvenAcos <= 0 && (
            <ToolInfoBox variant="rose">
              Your costs exceed your selling price — this product is unprofitable before ads.
            </ToolInfoBox>
          )}
        </ToolCard>
      )}

      <p className="text-center text-xs text-[#8b9cc8]">
        ACoS = Ad Spend / Sales Revenue × 100. Lower is better. Use the FBA Fee Calculator to get your accurate total fees.
      </p>
    </ToolShell>
  )
}
