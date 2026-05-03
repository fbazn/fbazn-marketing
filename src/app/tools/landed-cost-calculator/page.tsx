'use client'

import { useState, useCallback, useEffect } from 'react'
import ToolShell, { ToolCard, ToolRow, ToolStatCard, ToolDivider, inputWithPrefixCls, inputCls, labelCls, prefixCls, suffixCls } from '@/components/tools/ToolShell'

interface Results {
  freightPerUnit: number
  dutyPerUnit: number
  importVatPerUnit: number
  prepPerUnit: number
  landedCostPerUnit: number
  totalOrderCost: number
}

export default function LandedCostCalculatorPage() {
  const [unitCost, setUnitCost] = useState('')
  const [units, setUnits] = useState('')
  const [freightCost, setFreightCost] = useState('')
  const [dutyRate, setDutyRate] = useState('0')
  const [importVatRate, setImportVatRate] = useState('20')
  const [prepCost, setPrepCost] = useState('0')

  const [results, setResults] = useState<Results | null>(null)

  const calculate = useCallback(() => {
    const u = parseFloat(unitCost)
    const qty = parseFloat(units)
    const freight = parseFloat(freightCost) || 0
    const duty = parseFloat(dutyRate) || 0
    const vat = parseFloat(importVatRate) || 0
    const prep = parseFloat(prepCost) || 0

    if (!u || !qty) return

    const freightPerUnit = freight / qty
    const dutyPerUnit = (u + freightPerUnit) * (duty / 100)
    const importVatPerUnit = (u + freightPerUnit + dutyPerUnit) * (vat / 100)
    const landedCostPerUnit = u + freightPerUnit + dutyPerUnit + importVatPerUnit + prep
    const totalOrderCost = landedCostPerUnit * qty

    setResults({ freightPerUnit, dutyPerUnit, importVatPerUnit, prepPerUnit: prep, landedCostPerUnit, totalOrderCost })
  }, [unitCost, units, freightCost, dutyRate, importVatRate, prepCost])

  useEffect(() => { calculate() }, [calculate])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })

  return (
    <ToolShell title="Amazon FBA Landed Cost Calculator" description="Calculate your true cost per unit including freight, duty, and prep">
      <ToolCard heading="Product Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            Product Unit Cost (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>

          <label className={labelCls}>
            Units Ordered
            <input type="number" min="1" step="1" value={units} onChange={(e) => setUnits(e.target.value)} placeholder="500" className={inputCls} />
          </label>

          <label className={labelCls}>
            Total Freight Cost (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={freightCost} onChange={(e) => setFreightCost(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>

          <label className={labelCls}>
            Customs Duty Rate (%)
            <div className="relative">
              <input type="number" min="0" step="0.1" value={dutyRate} onChange={(e) => setDutyRate(e.target.value)} placeholder="0" className={`${inputCls} pr-8`} />
              <span className={suffixCls}>%</span>
            </div>
          </label>

          <label className={labelCls}>
            Import VAT (%)
            <div className="relative">
              <input type="number" min="0" step="0.1" value={importVatRate} onChange={(e) => setImportVatRate(e.target.value)} placeholder="20" className={`${inputCls} pr-8`} />
              <span className={suffixCls}>%</span>
            </div>
            <p className="text-xs text-[#8b9cc8]">Usually reclaimable for VAT-registered businesses</p>
          </label>

          <label className={labelCls}>
            Prep / Labelling Cost per Unit (£)
            <div className="relative">
              <span className={prefixCls}>£</span>
              <input type="number" min="0" step="0.01" value={prepCost} onChange={(e) => setPrepCost(e.target.value)} placeholder="0.00" className={inputWithPrefixCls} />
            </div>
          </label>
        </div>
      </ToolCard>

      {results && (
        <ToolCard heading="Cost Breakdown (per unit)">
          <ToolRow label="Unit Cost" value={fmt(parseFloat(unitCost))} />
          <ToolRow label="Freight per Unit" value={fmt(results.freightPerUnit)} muted />
          <ToolRow label="Duty per Unit" value={fmt(results.dutyPerUnit)} muted />
          <ToolRow label="Import VAT per Unit" value={fmt(results.importVatPerUnit)} muted />
          <ToolRow label="Prep / Labelling per Unit" value={fmt(results.prepPerUnit)} muted />
          <ToolDivider />
          <div className="grid grid-cols-2 gap-3">
            <ToolStatCard label="Landed Cost / Unit" value={fmt(results.landedCostPerUnit)} colorClass="text-indigo-400" />
            <ToolStatCard label="Total Order Cost" value={fmt(results.totalOrderCost)} colorClass="text-white" />
          </div>
        </ToolCard>
      )}

      <p className="text-center text-xs text-[#8b9cc8]">
        Import VAT shown is the amount paid at the border. If you are VAT-registered you can typically reclaim this on your VAT return.
      </p>
    </ToolShell>
  )
}
