'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Header from '@/components/landing/Header'
import { createClient } from '@/lib/supabase-browser'

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
  referralFee: number
  fulfillmentFee: number
  totalFees: number
  netProfit: number
  roi: number
  margin: number
}

export default function FbaCalculatorPage() {
  const [referralFees, setReferralFees] = useState<ReferralFee[]>([])
  const [fulfillmentFees, setFulfillmentFees] = useState<FulfillmentFee[]>([])
  const [loading, setLoading] = useState(true)

  const [buyBoxPrice, setBuyBoxPrice] = useState('')
  const [supplierCost, setSupplierCost] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSizeTier, setSelectedSizeTier] = useState('')

  const [results, setResults] = useState<Results | null>(null)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase
        .from('fba_referral_fees')
        .select('category, referral_fee_pct, min_referral_fee')
        .eq('marketplace', 'UK')
        .order('category'),
      supabase
        .from('fba_fulfillment_fees')
        .select('size_tier, description, fee, sort_order')
        .eq('marketplace', 'UK')
        .order('sort_order'),
    ]).then(([referralRes, fulfillmentRes]) => {
      if (referralRes.data) setReferralFees(referralRes.data)
      if (fulfillmentRes.data) setFulfillmentFees(fulfillmentRes.data)
      setLoading(false)
    })
  }, [])

  const calculate = useCallback(() => {
    const price = parseFloat(buyBoxPrice)
    const cost = parseFloat(supplierCost)
    if (!price || !cost || !selectedCategory || !selectedSizeTier) return

    const referralRow = referralFees.find((r) => r.category === selectedCategory)
    const fulfillmentRow = fulfillmentFees.find((f) => f.size_tier === selectedSizeTier)
    if (!referralRow || !fulfillmentRow) return

    const referralFee = Math.max(
      (price * referralRow.referral_fee_pct) / 100,
      referralRow.min_referral_fee,
    )
    const fulfillmentFee = fulfillmentRow.fee
    const totalFees = referralFee + fulfillmentFee
    const netProfit = price - cost - totalFees
    const roi = cost > 0 ? (netProfit / cost) * 100 : 0
    const margin = price > 0 ? (netProfit / price) * 100 : 0

    setResults({ referralFee, fulfillmentFee, totalFees, netProfit, roi, margin })
  }, [buyBoxPrice, supplierCost, selectedCategory, selectedSizeTier, referralFees, fulfillmentFees])

  useEffect(() => {
    calculate()
  }, [calculate])

  const fmt = (n: number) =>
    n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })

  const pct = (n: number) => `${n.toFixed(1)}%`

  const profitColor =
    results === null
      ? ''
      : results.netProfit > 0
        ? 'text-emerald-600'
        : 'text-rose-500'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Link href="/tools" className="text-sm text-slate-400 hover:text-indigo-600">
            ← Tools
          </Link>

          <div className="mt-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              FBAZN
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">FBA Profit Calculator</h1>
            <p className="mt-2 text-sm text-slate-400">
              UK marketplace · Fees sourced from Amazon&apos;s 2025 schedule
            </p>
          </div>

          {loading ? (
            <div className="mt-12 text-center text-sm text-slate-400">Loading fee data…</div>
          ) : (
            <div className="mt-8 space-y-6">
              {/* Inputs */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Product Details
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                    Buy Box Price (£)
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        £
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={buyBoxPrice}
                        onChange={(e) => setBuyBoxPrice(e.target.value)}
                        placeholder="0.00"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-7 pr-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                    Supplier Cost (£)
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        £
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={supplierCost}
                        onChange={(e) => setSupplierCost(e.target.value)}
                        placeholder="0.00"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-7 pr-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                    Product Category
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select category…</option>
                      {referralFees.map((r) => (
                        <option key={r.category} value={r.category}>
                          {r.category} ({r.referral_fee_pct}%)
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                    Size / Weight Tier
                    <select
                      value={selectedSizeTier}
                      onChange={(e) => setSelectedSizeTier(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select size tier…</option>
                      {fulfillmentFees.map((f) => (
                        <option key={f.size_tier} value={f.size_tier}>
                          {f.size_tier} — {fmt(f.fee)}
                        </option>
                      ))}
                    </select>
                    {selectedSizeTier && (
                      <p className="text-xs text-slate-400">
                        {fulfillmentFees.find((f) => f.size_tier === selectedSizeTier)?.description}
                      </p>
                    )}
                  </label>
                </div>
              </div>

              {/* Results */}
              {results && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Breakdown
                  </h2>

                  <div className="space-y-2 text-sm">
                    <Row label="Buy Box Price" value={fmt(parseFloat(buyBoxPrice))} />
                    <Row label="Supplier Cost" value={`− ${fmt(parseFloat(supplierCost))}`} muted />
                    <Row
                      label={`Referral Fee (${referralFees.find((r) => r.category === selectedCategory)?.referral_fee_pct}%)`}
                      value={`− ${fmt(results.referralFee)}`}
                      muted
                    />
                    <Row label="FBA Fulfilment Fee" value={`− ${fmt(results.fulfillmentFee)}`} muted />

                    <div className="my-3 border-t border-slate-100" />

                    <Row label="Total Fees" value={fmt(results.totalFees)} />

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <StatCard label="Net Profit" value={fmt(results.netProfit)} colorClass={profitColor} />
                      <StatCard
                        label="ROI"
                        value={pct(results.roi)}
                        colorClass={
                          results.roi >= 30
                            ? 'text-emerald-600'
                            : results.roi >= 0
                              ? 'text-amber-500'
                              : 'text-rose-500'
                        }
                      />
                      <StatCard
                        label="Margin"
                        value={pct(results.margin)}
                        colorClass={
                          results.margin >= 20
                            ? 'text-emerald-600'
                            : results.margin >= 0
                              ? 'text-amber-500'
                              : 'text-rose-500'
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-slate-400">
                Fees are approximate and based on Amazon UK&apos;s 2025 schedule. Always verify
                against your Seller Central account before making sourcing decisions.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? 'text-slate-400' : 'font-medium text-slate-700'}>{label}</span>
      <span className={muted ? 'text-slate-400' : 'font-semibold text-slate-900'}>{value}</span>
    </div>
  )
}

function StatCard({
  label,
  value,
  colorClass,
}: {
  label: string
  value: string
  colorClass: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`text-lg font-bold ${colorClass}`}>{value}</span>
    </div>
  )
}
