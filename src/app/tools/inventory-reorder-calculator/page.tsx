'use client'

import { useState, useCallback, useEffect } from 'react'
import ToolShell, { ToolCard, ToolRow, ToolStatCard, ToolDivider, inputCls, labelCls } from '@/components/tools/ToolShell'

interface Results {
  reorderPoint: number
  daysRemaining: number
  shouldOrderNow: boolean
  recommendedQty: number
  stockOutDate: Date
}

export default function InventoryReorderCalculatorPage() {
  const [dailySales, setDailySales] = useState('')
  const [leadTime, setLeadTime] = useState('')
  const [safetyStock, setSafetyStock] = useState('14')
  const [currentStock, setCurrentStock] = useState('')
  const [moq, setMoq] = useState('1')

  const [results, setResults] = useState<Results | null>(null)

  const calculate = useCallback(() => {
    const sales = parseFloat(dailySales)
    const lead = parseFloat(leadTime)
    const safety = parseFloat(safetyStock) || 14
    const stock = parseFloat(currentStock)
    const minOrder = parseFloat(moq) || 1

    if (!sales || !lead || !stock) return

    const reorderPoint = sales * lead + sales * safety
    const daysRemaining = stock / sales
    const shouldOrderNow = stock <= reorderPoint
    const reviewPeriod = 30
    const rawQty = sales * (lead + safety + reviewPeriod)
    const recommendedQty = Math.ceil(rawQty / minOrder) * minOrder

    const stockOutDate = new Date()
    stockOutDate.setDate(stockOutDate.getDate() + Math.floor(daysRemaining))

    setResults({ reorderPoint, daysRemaining, shouldOrderNow, recommendedQty, stockOutDate })
  }, [dailySales, leadTime, safetyStock, currentStock, moq])

  useEffect(() => { calculate() }, [calculate])

  const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <ToolShell title="Amazon FBA Inventory Reorder Calculator" description="Know exactly when to reorder and how many units to send">
      <ToolCard heading="Inventory Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            Average Daily Sales (units)
            <input type="number" min="0" step="0.1" value={dailySales} onChange={(e) => setDailySales(e.target.value)} placeholder="e.g. 5" className={inputCls} />
          </label>

          <label className={labelCls}>
            Current Stock on Hand (units)
            <input type="number" min="0" step="1" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} placeholder="e.g. 200" className={inputCls} />
          </label>

          <label className={labelCls}>
            Supplier Lead Time (days)
            <input type="number" min="1" step="1" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="e.g. 30" className={inputCls} />
            <p className="text-xs text-[#8b9cc8]">Time from order to stock arriving at Amazon</p>
          </label>

          <label className={labelCls}>
            Safety Stock (days)
            <input type="number" min="0" step="1" value={safetyStock} onChange={(e) => setSafetyStock(e.target.value)} placeholder="14" className={inputCls} />
            <p className="text-xs text-[#8b9cc8]">Buffer days to protect against delays</p>
          </label>

          <label className={`${labelCls} sm:col-span-2`}>
            Units per Order / MOQ — optional
            <input type="number" min="1" step="1" value={moq} onChange={(e) => setMoq(e.target.value)} placeholder="1" className={inputCls} />
          </label>
        </div>
      </ToolCard>

      {results && (
        <ToolCard heading="Reorder Analysis">
          <ToolRow label="Reorder Point" value={`${Math.round(results.reorderPoint)} units`} />
          <ToolRow label="Days of Stock Remaining" value={`${Math.floor(results.daysRemaining)} days`} />
          <ToolRow label="Stock-Out Date" value={fmtDate(results.stockOutDate)} />
          <ToolDivider />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center gap-1 border border-[#1e2d4a] bg-[#141c32] p-3 text-center">
              <span className="text-xs text-[#8b9cc8]">Order Now?</span>
              <span className={`px-3 py-1 text-sm font-bold ${results.shouldOrderNow ? 'text-rose-400' : 'text-emerald-400'}`}>
                {results.shouldOrderNow ? 'Yes — Order Now' : 'Not Yet'}
              </span>
            </div>
            <ToolStatCard label="Recommended Order Qty" value={`${results.recommendedQty} units`} colorClass="text-indigo-400" />
          </div>
        </ToolCard>
      )}

      <p className="text-center text-xs text-[#8b9cc8]">
        Recommended order quantity covers lead time + safety stock + 30-day review period.
      </p>
    </ToolShell>
  )
}
