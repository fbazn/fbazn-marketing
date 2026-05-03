'use client'

import { useState, useCallback, useEffect } from 'react'
import ToolShell, { ToolCard, ToolStatCard, ToolInfoBox, inputWithPrefixCls, inputCls, labelCls, prefixCls } from '@/components/tools/ToolShell'

const CATEGORIES = [
  { name: 'Home & Kitchen', multiplier: 3000 },
  { name: 'Sports & Outdoors', multiplier: 1500 },
  { name: 'Toys & Games', multiplier: 2000 },
  { name: 'Health & Personal Care', multiplier: 2500 },
  { name: 'Electronics', multiplier: 1000 },
  { name: 'Books', multiplier: 5000 },
  { name: 'Clothing & Accessories', multiplier: 1200 },
  { name: 'Pet Supplies', multiplier: 1800 },
  { name: 'Garden & Outdoors', multiplier: 1200 },
  { name: 'Baby Products', multiplier: 2000 },
  { name: 'Kitchen & Home', multiplier: 2500 },
  { name: 'Tools & Home Improvement', multiplier: 1000 },
  { name: 'Arts, Crafts & Sewing', multiplier: 800 },
  { name: 'Automotive', multiplier: 500 },
  { name: 'Musical Instruments', multiplier: 300 },
  { name: 'Office Products', multiplier: 1200 },
  { name: 'Grocery', multiplier: 2000 },
]

interface Results {
  monthlyUnits: number
  monthlyRevenue: number | null
  annualRevenue: number | null
}

export default function BsrSalesEstimatorPage() {
  const [bsr, setBsr] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name)
  const [sellingPrice, setSellingPrice] = useState('')

  const [results, setResults] = useState<Results | null>(null)

  const calculate = useCallback(() => {
    const bsrVal = parseFloat(bsr)
    if (!bsrVal || bsrVal <= 0) return

    const cat = CATEGORIES.find((c) => c.name === selectedCategory)
    if (!cat) return

    const monthlyUnits = Math.max(1, Math.round(cat.multiplier / Math.pow(bsrVal, 0.75)))
    let monthlyRevenue: number | null = null
    let annualRevenue: number | null = null
    const price = parseFloat(sellingPrice)
    if (price) {
      monthlyRevenue = monthlyUnits * price
      annualRevenue = monthlyRevenue * 12
    }

    setResults({ monthlyUnits, monthlyRevenue, annualRevenue })
  }, [bsr, selectedCategory, sellingPrice])

  useEffect(() => { calculate() }, [calculate])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })

  return (
    <ToolShell title="Amazon BSR to Monthly Sales Estimator" description="Estimate monthly sales from a product's Best Seller Rank">
      <ToolCard heading="Product Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            Best Seller Rank (BSR)
            <input type="number" min="1" step="1" value={bsr} onChange={(e) => setBsr(e.target.value)} placeholder="e.g. 5000" className={inputCls} />
          </label>

          <label className={labelCls}>
            Category
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className={`${labelCls} sm:col-span-2`}>
            Selling Price (£) — optional, for revenue estimate
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>
        </div>
      </ToolCard>

      {results && (
        <ToolCard heading="Sales Estimate">
          <div className={`grid gap-3 ${results.monthlyRevenue !== null ? 'grid-cols-3' : 'grid-cols-1'}`}>
            <ToolStatCard label="Est. Monthly Units" value={results.monthlyUnits.toLocaleString('en-GB')} colorClass="text-indigo-400" />
            {results.monthlyRevenue !== null && (
              <ToolStatCard label="Est. Monthly Revenue" value={fmt(results.monthlyRevenue)} colorClass="text-white" />
            )}
            {results.annualRevenue !== null && (
              <ToolStatCard label="Est. Annual Revenue" value={fmt(results.annualRevenue)} colorClass="text-emerald-400" />
            )}
          </div>
          <ToolInfoBox variant="amber">
            Estimates are approximate ±50% — use as a guide only. Sales velocity varies by season, listing quality, and competition.
          </ToolInfoBox>
        </ToolCard>
      )}

      <p className="text-center text-xs text-[#8b9cc8]">
        Formula: estimated sales = multiplier / BSR^0.75. Multipliers are category-specific estimates based on Amazon UK data.
      </p>
    </ToolShell>
  )
}
