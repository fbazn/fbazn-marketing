'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

type AdminData = {
  affiliates: Array<{
    id: string
    full_name: string
    email: string
    code: string
    status: string
    stripe_connect_onboarded: boolean
    total_earned: number
    balance_approved: number
    balance_pending: number
    created_at: string
  }>
  recentReferrals: Array<{
    id: string
    affiliate_id: string
    referred_email: string | null
    plan: string | null
    plan_amount: number | null
    status: string
    first_payment_at: string | null
    hold_until: string | null
    created_at: string
  }>
  upcomingPayouts: Array<{
    id: string
    total_amount: number
    status: string
    period_month: string
    scheduled_for: string
    affiliates: { full_name: string; code: string }
  }>
  summary: {
    totalAffiliates: number
    activeAffiliates: number
    pendingCommissions: number
    approvedCommissions: number
  }
}

const statusColour: Record<string, string> = {
  pending: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  approved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  paid: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  cancelled: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  suspended: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  scheduled: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n)
}

export default function AffiliateAdminPage() {
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'affiliates' | 'referrals' | 'payouts'>('overview')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/affiliate'); return }
      fetch('/api/affiliate/admin?view=overview')
        .then(r => r.json())
        .then(json => {
          if (json.error) { router.replace('/affiliate'); return }
          setData(json)
        })
        .finally(() => setLoading(false))
    })
  }, [router])

  async function toggleAffiliate(id: string, currentStatus: string) {
    setActionLoading(id)
    await fetch('/api/affiliate/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ affiliateId: id, action: currentStatus === 'active' ? 'suspend' : 'activate' }),
    })
    setData(prev => prev ? {
      ...prev,
      affiliates: prev.affiliates.map(a => a.id === id ? { ...a, status: currentStatus === 'active' ? 'suspended' : 'active' } : a)
    } : prev)
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center">
        <div className="text-sm text-[#4a5a80]">Loading admin panel…</div>
      </div>
    )
  }

  if (!data) return null

  const { affiliates, recentReferrals, upcomingPayouts, summary } = data
  const nextPayoutDate = upcomingPayouts[0]?.scheduled_for
    ? new Date(upcomingPayouts[0].scheduled_for).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    : '—'
  const nextPayoutTotal = upcomingPayouts.reduce((s, p) => s + p.total_amount, 0)

  return (
    <div className="min-h-screen bg-[#080c18] text-[#f0f4ff]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/6 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-amber-500/15 bg-[#080c18]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-[0.08em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>FBAZN</span>
            <span className="text-[#1e2d4a]">|</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-400" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Affiliate Admin
            </span>
          </div>
          <a href="/affiliate/dashboard" className="text-xs font-bold uppercase tracking-[0.1em] text-[#4a5a80] hover:text-white transition" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
            Your dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total affiliates', value: String(summary.totalAffiliates) },
            { label: 'Active affiliates', value: String(summary.activeAffiliates) },
            { label: 'Pending commissions', value: fmt(summary.pendingCommissions) },
            { label: 'Approved (next payout)', value: fmt(summary.approvedCommissions) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded border border-[#1e2d4a] bg-[#0e1425] px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{label}</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-[#f0f4ff]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Next payout summary */}
        {upcomingPayouts.length > 0 && (
          <div className="mb-8 rounded border border-indigo-500/30 bg-indigo-500/5 px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-400 mb-2" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Next payout batch — {nextPayoutDate}
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-2xl font-black text-[#f0f4ff]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{fmt(nextPayoutTotal)}</p>
                <p className="text-xs text-[#8b9cc8]">across {upcomingPayouts.length} affiliates</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {upcomingPayouts.slice(0, 8).map(p => (
                <span key={p.id} className="text-xs text-[#8b9cc8] border border-[#1e2d4a] rounded px-2 py-1">
                  {p.affiliates?.full_name ?? 'Unknown'} — {fmt(p.total_amount)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4 flex gap-1 border-b border-[#1e2d4a]">
          {(['affiliates', 'referrals', 'payouts'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-[0.12em] transition capitalize ${
                tab === t ? 'border-b-2 border-amber-500 text-amber-400' : 'text-[#4a5a80] hover:text-[#8b9cc8]'
              }`}
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Affiliates tab */}
        {tab === 'affiliates' && (
          <div className="overflow-x-auto rounded border border-[#1e2d4a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#080c18]/60">
                  {['Name', 'Code', 'Status', 'Stripe', 'Pending', 'Approved', 'Total earned', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {affiliates.map(a => (
                  <tr key={a.id} className="border-t border-[#1e2d4a] hover:bg-amber-500/3 transition">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#f0f4ff]">{a.full_name}</p>
                      <p className="text-xs text-[#4a5a80]">{a.email}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-amber-400 text-xs">{a.code}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusColour[a.status] ?? ''}`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold uppercase ${a.stripe_connect_onboarded ? 'text-emerald-400' : 'text-[#4a5a80]'}`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                        {a.stripe_connect_onboarded ? '✓ Connected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#8b9cc8]">{fmt(a.balance_pending)}</td>
                    <td className="px-4 py-3 text-[#f0f4ff]">{fmt(a.balance_approved)}</td>
                    <td className="px-4 py-3 font-semibold text-[#f0f4ff]">{fmt(a.total_earned)}</td>
                    <td className="px-4 py-3 text-[#8b9cc8] text-xs">{new Date(a.created_at).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAffiliate(a.id, a.status)}
                        disabled={actionLoading === a.id}
                        className={`text-xs font-bold uppercase tracking-[0.1em] transition ${
                          a.status === 'active'
                            ? 'text-rose-400 hover:text-rose-300'
                            : 'text-emerald-400 hover:text-emerald-300'
                        } disabled:opacity-50`}
                        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                      >
                        {actionLoading === a.id ? '…' : a.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Referrals tab */}
        {tab === 'referrals' && (
          <div className="overflow-x-auto rounded border border-[#1e2d4a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#080c18]/60">
                  {['Plan', 'Amount', 'Status', 'First payment', 'Hold until', 'Created'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentReferrals.map(r => (
                  <tr key={r.id} className="border-t border-[#1e2d4a] hover:bg-amber-500/3 transition">
                    <td className="px-4 py-3 font-semibold capitalize text-[#f0f4ff]">{r.plan ?? '—'}</td>
                    <td className="px-4 py-3 text-[#8b9cc8]">{r.plan_amount ? fmt(r.plan_amount) : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusColour[r.status] ?? ''}`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#8b9cc8] text-xs">{r.first_payment_at ? new Date(r.first_payment_at).toLocaleDateString('en-GB') : '—'}</td>
                    <td className="px-4 py-3 text-[#8b9cc8] text-xs">{r.hold_until ? new Date(r.hold_until).toLocaleDateString('en-GB') : '—'}</td>
                    <td className="px-4 py-3 text-[#8b9cc8] text-xs">{new Date(r.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payouts tab */}
        {tab === 'payouts' && (
          <div className="overflow-x-auto rounded border border-[#1e2d4a]">
            {upcomingPayouts.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[#4a5a80]">No upcoming payouts scheduled.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#080c18]/60">
                    {['Affiliate', 'Amount', 'Period', 'Status', 'Scheduled for'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcomingPayouts.map(p => (
                    <tr key={p.id} className="border-t border-[#1e2d4a] hover:bg-amber-500/3 transition">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#f0f4ff]">{p.affiliates?.full_name}</p>
                        <p className="text-xs font-mono text-amber-400">{p.affiliates?.code}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#f0f4ff]">{fmt(p.total_amount)}</td>
                      <td className="px-4 py-3 text-[#8b9cc8] text-xs">
                        {new Date(p.period_month ?? p.scheduled_for).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusColour[p.status] ?? ''}`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8b9cc8] text-xs">{new Date(p.scheduled_for).toLocaleDateString('en-GB')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
