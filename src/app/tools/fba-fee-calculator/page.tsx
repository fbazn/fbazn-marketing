'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import ToolShell, { ToolCard, ToolRow, ToolStatCard, ToolDivider, inputWithPrefixCls, inputCls, labelCls, prefixCls } from '@/components/tools/ToolShell'

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
  referralFeePct: number
  referralFee: number
  fulfillmentFee: number
  totalFees: number
  feesAsPct: number
}

export default function FbaFeeCalculatorPage() {
  const [referralFees, setReferralFees] = useState<ReferralFee[]>([])
  const [fulfillmentFees, setFulfillmentFees] = useState<FulfillmentFee[]>([])
  const [loading, setLoading] = useState(true)

  const [sellingPrice, setSellingPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSizeTier, setSelectedSizeTier] = useState('')

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
    const price = parseFloat(sellingPrice)
    if (!price || !selectedCategory || !selectedSizeTier) return

    const referralRow = referralFees.find((r) => r.category === selectedCategory)
    const fulfillmentRow = fulfillmentFees.find((f) => f.size_tier === selectedSizeTier)
    if (!referralRow || !fulfillmentRow) return

    const referralFee = Math.max((price * referralRow.referral_fee_pct) / 100, referralRow.min_referral_fee)
    const fulfillmentFee = fulfillmentRow.fee
    const totalFees = referralFee + fulfillmentFee
    const feesAsPct = price > 0 ? (totalFees / price) * 100 : 0

    setResults({ referralFeePct: referralRow.referral_fee_pct, referralFee, fulfillmentFee, totalFees, feesAsPct })
  }, [sellingPrice, selectedCategory, selectedSizeTier, referralFees, fulfillmentFees])

  useEffect(() => { calculate() }, [calculate])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })
  const pct = (n: number) => `${n.toFixed(1)}%`

  return (
    <ToolShell title="Amazon FBA Fee Calculator" description="UK marketplace · See exactly what Amazon charges before you commit">
      {loading ? (
        <p className="text-center text-sm text-[#8b9cc8]">Loading fee data…</p>
      ) : (
        <>
          <ToolCard heading="Product Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`${labelCls} sm:col-span-2`}>
                Selling Price (£)
                <div className="relative">
                  <span className={prefixCls}>£</span>
                  <input type="number" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
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
            </div>
          </ToolCard>

          {results && (
            <ToolCard heading="Fee Breakdown">
              <ToolRow label="Referral Fee Rate" value={pct(results.referralFeePct)} />
              <ToolRow label="Referral Fee (£)" value={fmt(results.referralFee)} />
              <ToolRow label="FBA Fulfilment Fee" value={fmt(results.fulfillmentFee)} />
              <ToolDivider />
              <div className="grid grid-cols-2 gap-3">
                <ToolStatCard label="Total Amazon Fees" value={fmt(results.totalFees)} colorClass="text-white" />
                <ToolStatCard label="Fees as % of Price" value={pct(results.feesAsPct)} colorClass={results.feesAsPct <= 20 ? 'text-emerald-400' : results.feesAsPct <= 35 ? 'text-amber-400' : 'text-rose-400'} />
              </div>
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
