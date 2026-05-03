'use client'

import { useState, useCallback, useEffect } from 'react'
import ToolShell, { ToolCard, ToolRow, ToolDivider, ToolInfoBox, inputWithPrefixCls, inputCls, labelCls, prefixCls } from '@/components/tools/ToolShell'

interface Results {
  excVat: number
  vatAmount: number
  incVat: number
  vatRate: number
}

const VAT_RATES = [
  { label: 'Standard 20%', value: 0.2 },
  { label: 'Reduced 5%', value: 0.05 },
  { label: 'Zero-rated 0%', value: 0 },
  { label: 'Exempt 0%', value: 0 },
]

export default function AmazonVatCalculatorPage() {
  const [price, setPrice] = useState('')
  const [vatRateIndex, setVatRateIndex] = useState(0)
  const [priceType, setPriceType] = useState<'inc' | 'exc'>('inc')

  const [results, setResults] = useState<Results | null>(null)

  const calculate = useCallback(() => {
    const p = parseFloat(price)
    if (!p) return

    const rate = VAT_RATES[vatRateIndex].value
    let excVat: number, vatAmount: number, incVat: number

    if (priceType === 'inc') {
      excVat = p / (1 + rate)
      vatAmount = p - excVat
      incVat = p
    } else {
      excVat = p
      vatAmount = p * rate
      incVat = p + vatAmount
    }

    setResults({ excVat, vatAmount, incVat, vatRate: rate })
  }, [price, vatRateIndex, priceType])

  useEffect(() => { calculate() }, [calculate])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })

  return (
    <ToolShell title="Amazon UK VAT Calculator" description="Calculate VAT on your Amazon sales and understand your true margins">
      <ToolCard heading="Product Details">
        <div className="grid gap-4">
          <label className={labelCls}>
            Selling Price (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>

          <label className={labelCls}>
            VAT Rate
            <select value={vatRateIndex} onChange={(e) => setVatRateIndex(parseInt(e.target.value))} className={inputCls}>
              {VAT_RATES.map((r, i) => (
                <option key={i} value={i}>{r.label}</option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#8b9cc8]">Price entered is</span>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#8b9cc8]">
                <input type="radio" name="priceType" value="inc" checked={priceType === 'inc'} onChange={() => setPriceType('inc')} className="accent-indigo-400" />
                Inc VAT
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#8b9cc8]">
                <input type="radio" name="priceType" value="exc" checked={priceType === 'exc'} onChange={() => setPriceType('exc')} className="accent-indigo-400" />
                Exc VAT
              </label>
            </div>
          </div>
        </div>
      </ToolCard>

      {results && (
        <ToolCard heading="VAT Breakdown">
          <ToolRow label="Price exc VAT" value={fmt(results.excVat)} />
          <ToolRow label={`VAT (${(results.vatRate * 100).toFixed(0)}%)`} value={fmt(results.vatAmount)} />
          <ToolDivider />
          <ToolRow label="Price inc VAT" value={fmt(results.incVat)} />
          {results.vatRate > 0 && (
            <ToolInfoBox variant="amber">
              Note: Amazon referral fees are charged on the full inc-VAT selling price ({fmt(results.incVat)}), not the exc-VAT price.
            </ToolInfoBox>
          )}
        </ToolCard>
      )}

      <p className="text-center text-xs text-[#8b9cc8]">
        Always confirm VAT treatment with an accountant for your specific products.
      </p>
    </ToolShell>
  )
}
