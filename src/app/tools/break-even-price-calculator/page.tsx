'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import ToolShell, { ToolCard, ToolRow, ToolStatCard, ToolDivider, inputWithPrefixCls, inputCls, labelCls, prefixCls, suffixCls } from '@/components/tools/ToolShell'

interface ReferralFee {
  category: string
  referral_fee_pct: number
  min_referral_fee: number
}

interface FulfillmentFee {
  size_tier: string
  description: string
  fee: number
  sort_order: number
}

interface Results {
  breakEvenPrice: number
  targetPrice: number
  buyBoxHeadroom: number | null
}

export default function BreakEvenPriceCalculatorPage() {
  const [referralFees, setReferralFees] = useState<ReferralFee[]>([])
  const [fulfillmentFees, setFulfillmentFees] = useState<FulfillmentFee[]>([])
  const [loading, setLoading] = useState(true)

  const [supplierCost, setSupplierCost] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSizeTier, setSelectedSizeTier] = useState('')
  const [targetRoi, setTargetRoi] = useState('30')
  const [buyBoxPrice, setBuyBoxPrice] = useState('')

  const [results, setResults] = useState<Results | null>(null)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('fba_referral_fees').select('category, referral_fee_pct, min_referral_fee').eq('marketplace', 'UK').order('category'),
      supabase.from('fba_fulfillment_fees').select('size_tier, description, fee, sort_order').eq('marketplace', 'UK').order('sort_order'),
    ]).then(([referralRes, fulfillmentRes]) => {
      if (referralRes.data) setReferralFees(referralRes.data)
      if (fulfillmentRes.data) setFulfillmentFees(fulfillmentRes.data)
      setLoading(false)
    })
  }, [])

  const calculate = useCallback(() => {
    const cost = parseFloat(supplierCost)
    const roi = parseFloat(targetRoi) || 0
    if (!cost || !selectedCategory || !selectedSizeTier) return

    const referralRow = referralFees.find((r) => r.category === selectedCategory)
    const fulfillmentRow = fulfillmentFees.find((f) => f.size_tier === selectedSizeTier)
    if (!referralRow || !fulfillmentRow) return

    const refPct = referralRow.referral_fee_pct / 100
    const fulfil = fulfillmentRow.fee
    const breakEvenPrice = (cost + fulfil) / (1 - refPct)
    const targetPrice = (cost + fulfil + cost * (roi / 100)) / (1 - refPct)

    let buyBoxHeadroom: number | null = null
    const bbp = parseFloat(buyBoxPrice)
    if (bbp) buyBoxHeadroom = bbp - targetPrice

    setResults({ breakEvenPrice, targetPrice, buyBoxHeadroom })
  }, [supplierCost, selectedCategory, selectedSizeTier, targetRoi, buyBoxPrice, referralFees, fulfillmentFees])

  useEffect(() => { calculate() }, [calculate])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })

  return (
    <ToolShell title="Amazon FBA Break-Even Price Calculator" description="UK marketplace · Find your minimum viable selling price">
      {loading ? (
        <p className="text-center text-sm text-[#8b9cc8]">Loading fee data…</p>
      ) : (
        <>
          <ToolCard heading="Product Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>
                Supplier Cost (£)
                <div className="relative">
                  <span className={prefixCls}>£</span>
                  <input type="number" min="0" step="0.01" value={supplierCost} onChange={(e) => setSupplierCost(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
                </div>
              </label>

              <label className={labelCls}>
                Target ROI (%)
                <div className="relative">
                  <input type="number" min="0" step="1" value={targetRoi} onChange={(e) => setTargetRoi(e.target.value)} placeholder="30" className={`${inputCls} pr-8`} />
                  <span className={suffixCls}>%</span>
                </div>
              </label>

              <label className={labelCls}>
                Product Category
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputCls}>
                  <option value="">Select category…</option>
                  {referralFees.map((r) => (
                    <option key={r.category} value={r.category}>{r.category} ({r.referral_fee_pct}%)</option>
                  ))}
                </select>
              </label>

              <label className={labelCls}>
                Size / Weight Tier
                <select value={selectedSizeTier} onChange={(e) => setSelectedSizeTier(e.target.value)} className={inputCls}>
                  <option value="">Select size tier…</option>
                  {fulfillmentFees.map((f) => (
                    <option key={f.size_tier} value={f.size_tier}>{f.size_tier} — {fmt(f.fee)}</option>
                  ))}
                </select>
                {selectedSizeTier && (
                  <p className="text-xs text-[#8b9cc8]">{fulfillmentFees.find((f) => f.size_tier === selectedSizeTier)?.description}</p>
                )}
              </label>

              <label className={`${labelCls} sm:col-span-2`}>
                Buy Box Price (£) — optional
                <div className="relative">
                  <span className={prefixCls}>£</span>
                  <input type="number" min="0" step="0.01" value={buyBoxPrice} onChange={(e) => setBuyBoxPrice(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
                </div>
              </label>
            </div>
          </ToolCard>

          {results && (
            <ToolCard heading="Pricing Analysis">
              <div className="grid grid-cols-2 gap-3">
                <ToolStatCard label="Break-Even Price" value={fmt(results.breakEvenPrice)} colorClass="text-white" />
                <ToolStatCard label={`Price for ${targetRoi}% ROI`} value={fmt(results.targetPrice)} colorClass="text-indigo-400" />
              </div>
              {results.buyBoxHeadroom !== null && (
                <>
                  <ToolDivider />
                  <ToolRow
                    label="Headroom vs Buy Box"
                    value={results.buyBoxHeadroom >= 0 ? `+${fmt(results.buyBoxHeadroom)}` : fmt(results.buyBoxHeadroom)}
                  />
                  <p className="mt-2 text-xs text-[#8b9cc8]">
                    {results.buyBoxHeadroom >= 0
                      ? 'The buy box price supports your target ROI.'
                      : 'The buy box price is below your target price — this product may not be viable at your ROI target.'}
                  </p>
                </>
              )}
            </ToolCard>
          )}

          <p className="text-center text-xs text-[#8b9cc8]">
            Fees are approximate and based on Amazon UK&apos;s 2025 schedule. Always verify against your Seller Central account before making sourcing decisions.
          </p>
        </>
      )}
    </ToolShell>
  )
}
