'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import ToolShell, { ToolCard, ToolRow, ToolStatCard, ToolDivider, inputWithPrefixCls, inputCls, labelCls, prefixCls } from '@/components/tools/ToolShell'

interface ReferralFee {
  category: string
  referral_fee_pct: number
  min_referral_fee: number
}

interface Results {
  referralFeePct: number
  referralFee: number
  minReferralFee: number
  remaining: number
}

export default function ReferralFeeCalculatorPage() {
  const [referralFees, setReferralFees] = useState<ReferralFee[]>([])
  const [loading, setLoading] = useState(true)

  const [sellingPrice, setSellingPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const [results, setResults] = useState<Results | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('fba_referral_fees').select('category, referral_fee_pct, min_referral_fee').eq('marketplace', 'UK').order('category')
      .then(({ data }) => {
        if (data) setReferralFees(data)
        setLoading(false)
      })
  }, [])

  const calculate = useCallback(() => {
    const price = parseFloat(sellingPrice)
    if (!price || !selectedCategory) return

    const referralRow = referralFees.find((r) => r.category === selectedCategory)
    if (!referralRow) return

    const rawFee = (price * referralRow.referral_fee_pct) / 100
    const referralFee = Math.max(rawFee, referralRow.min_referral_fee)
    const remaining = price - referralFee

    setResults({ referralFeePct: referralRow.referral_fee_pct, referralFee, minReferralFee: referralRow.min_referral_fee, remaining })
  }, [sellingPrice, selectedCategory, referralFees])

  useEffect(() => { calculate() }, [calculate])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })
  const pct = (n: number) => `${n.toFixed(1)}%`

  return (
    <ToolShell title="Amazon Referral Fee Calculator" description="UK marketplace · See exactly what referral fee Amazon charges per category">
      {loading ? (
        <p className="text-center text-sm text-[#8b9cc8]">Loading fee data…</p>
      ) : (
        <>
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
                Product Category
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputCls}>
                  <option value="">Select category…</option>
                  {referralFees.map((r) => (
                    <option key={r.category} value={r.category}>{r.category} ({r.referral_fee_pct}%)</option>
                  ))}
                </select>
              </label>
            </div>
          </ToolCard>

          {results && (
            <ToolCard heading="Referral Fee Breakdown">
              <ToolRow label="Referral Fee %" value={pct(results.referralFeePct)} />
              <ToolRow label="Minimum Referral Fee" value={fmt(results.minReferralFee)} muted />
              <ToolDivider />
              <div className="grid grid-cols-2 gap-3">
                <ToolStatCard label="Referral Fee (£)" value={fmt(results.referralFee)} colorClass="text-rose-400" />
                <ToolStatCard label="Remaining After Fee" value={fmt(results.remaining)} colorClass="text-emerald-400" />
              </div>
            </ToolCard>
          )}

          <ToolCard heading="All UK Referral Fee Rates">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2d4a]">
                    <th className="pb-2 text-left font-medium text-[#8b9cc8]">Category</th>
                    <th className="pb-2 text-right font-medium text-[#8b9cc8]">Rate</th>
                    <th className="pb-2 text-right font-medium text-[#8b9cc8]">Min Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {referralFees.map((r) => (
                    <tr key={r.category} className={`border-b border-[#1e2d4a]/50 ${r.category === selectedCategory ? 'bg-indigo-500/10' : ''}`}>
                      <td className="py-2 text-white">{r.category}</td>
                      <td className="py-2 text-right font-medium text-white">{r.referral_fee_pct}%</td>
                      <td className="py-2 text-right text-[#8b9cc8]">{fmt(r.min_referral_fee)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ToolCard>

          <p className="text-center text-xs text-[#8b9cc8]">
            Fees are approximate and based on Amazon UK&apos;s 2025 schedule. Always verify against your Seller Central account before making sourcing decisions.
          </p>
        </>
      )}
    </ToolShell>
  )
}
