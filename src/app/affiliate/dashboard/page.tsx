'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { getEffectiveRate } from '@/lib/affiliate'

type Stats = {
  affiliate: {
    full_name: string
    code: string
    email: string
    balance_pending: number
    balance_approved: number
    total_earned: number
    stripe_connect_onboarded: boolean
    stripe_connect_account_id: string | null
    created_at: string
  }
  referrals: Array<{
    id: string
    referred_email: string | null
    plan: string | null
    plan_amount: number | null
    status: string
    clicked_at: string
    first_payment_at: string | null
    commissions_remaining: number
  }>
  commissions: Array<{
    id: string
    commission_month: string
    gross_amount: number
    commission_amount: number
    rate_applied: number
    status: string
  }>
  payouts: Array<{
    id: string
    period_month: string
    total_amount: number
    status: string
    scheduled_for: string
    paid_at: string | null
  }>
  leaderboard: { rank: number | null; total_referrals: number; total_revenue: number }
  totalClicks: number
}

const statusColour: Record<string, string> = {
  pending: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  approved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  paid: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  cancelled: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  refunded: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n)
}

function fmtMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function AffiliateDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [connectLoading, setConnectLoading] = useState(false)
  const [tab, setTab] = useState<'referrals' | 'commissions' | 'payouts'>('referrals')

  const connectReturn = searchParams.get('connect')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/affiliate/login'); return }
      fetch('/api/affiliate/stats')
        .then(r => r.json())
        .then(data => {
          if (data.error) { router.replace('/affiliate/login'); return }
          setStats(data)
        })
        .finally(() => setLoading(false))
    })
  }, [router])

  // Mark Stripe Connect onboarded if returning from Stripe
  useEffect(() => {
    if (connectReturn === 'success' && stats?.affiliate.stripe_connect_account_id) {
      // Refresh stats to pick up updated onboarding status
      fetch('/api/affiliate/stats').then(r => r.json()).then(setStats)
    }
  }, [connectReturn, stats?.affiliate.stripe_connect_account_id])

  async function handleConnectStripe() {
    setConnectLoading(true)
    const res = await fetch('/api/affiliate/connect', { method: 'POST' })
    const { url, error } = await res.json()
    if (error) {
      alert(`Stripe Connect error: ${error}`)
      setConnectLoading(false)
      return
    }
    window.location.href = url
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/affiliate')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center">
        <div className="text-sm text-[#4a5a80]">Loading dashboard…</div>
      </div>
    )
  }

  if (!stats) return null

  const { affiliate, referrals, commissions, payouts, leaderboard, totalClicks } = stats
  const effectiveRate = leaderboard.rank ? getEffectiveRate(leaderboard.rank) : 0.20
  const referralLink = `https://fbazn.com/r/${affiliate.code}`

  const activeReferrals = referrals.filter(r => ['pending', 'approved', 'paid'].includes(r.status)).length
  const pendingTotal = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.commission_amount, 0)
  const approvedTotal = commissions.filter(c => c.status === 'approved').reduce((s, c) => s + c.commission_amount, 0)

  const tierLabel = leaderboard.rank
    ? leaderboard.rank <= 3 ? 'Top 3 — 25%'
    : leaderboard.rank <= 5 ? 'Top 5 — 22.5%'
    : leaderboard.rank <= 10 ? 'Top 10 — 21%'
    : `Rank #${leaderboard.rank} — 20%`
    : '20%'

  return (
    <div className="min-h-screen bg-[#080c18] text-[#f0f4ff]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/6 blur-3xl" />
        <div className="absolute top-1/2 -right-60 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-amber-500/15 bg-[#080c18]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <a href="/" className="font-black text-xl tracking-[0.08em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              FBAZN
            </a>
            <span className="text-[#1e2d4a]">|</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-500" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Affiliate Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-[#8b9cc8] sm:block">{affiliate.email}</span>
            <button
              onClick={handleSignOut}
              className="text-xs font-bold uppercase tracking-[0.1em] text-[#4a5a80] hover:text-white transition"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* Stripe Connect alert */}
        {!affiliate.stripe_connect_onboarded && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded border border-amber-500/30 bg-amber-500/8 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-amber-300">Connect your bank account to receive payouts</p>
              <p className="text-xs text-amber-500/70 mt-0.5">You won't receive payments until Stripe Connect is set up.</p>
            </div>
            <button
              onClick={handleConnectStripe}
              disabled={connectLoading}
              className="shrink-0 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.1em] text-white disabled:opacity-60 transition hover:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-barlow-condensed)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              }}
            >
              {connectLoading ? 'Redirecting…' : 'Connect Stripe'}
            </button>
          </div>
        )}

        {connectReturn === 'success' && (
          <div className="mb-6 rounded border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Stripe Connect set up successfully. You're ready to receive payouts.
          </div>
        )}

        {/* Referral link */}
        <div className="mb-6 rounded border border-[#1e2d4a] bg-[#0e1425] px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8] mb-2" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
            Your referral link
          </p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-sm font-mono text-amber-400 truncate">{referralLink}</code>
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#8b9cc8] border border-[#1e2d4a] rounded hover:border-amber-500/50 hover:text-white transition"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Pending earnings', value: fmt(pendingTotal + affiliate.balance_pending) },
            { label: 'Ready to pay out', value: fmt(approvedTotal + affiliate.balance_approved) },
            { label: 'Total earned', value: fmt(affiliate.total_earned) },
            { label: 'Active referrals', value: String(activeReferrals) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded border border-[#1e2d4a] bg-[#0e1425] px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                {label}
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight text-[#f0f4ff]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Leaderboard position + rate */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Leaderboard rank', value: leaderboard.rank ? `#${leaderboard.rank}` : '—' },
            { label: 'Commission rate', value: `${(effectiveRate * 100).toFixed(1)}%`, accent: true },
            { label: 'Total clicks', value: String(totalClicks) },
            { label: 'Revenue referred', value: fmt(leaderboard.total_revenue) },
          ].map(({ label, value, accent }) => (
            <div key={label} className={`rounded border px-4 py-4 ${accent ? 'border-amber-500/30 bg-amber-500/5' : 'border-[#1e2d4a] bg-[#0e1425]'}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                {label}
              </p>
              <p className={`mt-1 text-2xl font-black tracking-tight ${accent ? 'text-amber-400' : 'text-[#f0f4ff]'}`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                {value}
              </p>
              {label === 'Leaderboard rank' && leaderboard.rank && (
                <p className="mt-0.5 text-xs text-[#4a5a80]">{tierLabel}</p>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-1 border-b border-[#1e2d4a]">
          {(['referrals', 'commissions', 'payouts'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-[0.12em] transition ${
                tab === t ? 'border-b-2 border-amber-500 text-amber-400' : 'text-[#4a5a80] hover:text-[#8b9cc8]'
              }`}
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              {t === 'referrals' ? `Referrals (${referrals.length})` : t === 'commissions' ? `Commissions` : `Payouts`}
            </button>
          ))}
        </div>

        {/* Referrals table */}
        {tab === 'referrals' && (
          <div className="overflow-x-auto rounded border border-[#1e2d4a]">
            {referrals.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[#4a5a80]">
                No referrals yet. Share your link to start earning.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#080c18]/60">
                    {['Plan', 'Status', 'Months left', 'Monthly earn', 'First payment'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(r => (
                    <tr key={r.id} className="border-t border-[#1e2d4a] hover:bg-amber-500/3 transition">
                      <td className="px-4 py-3 font-semibold capitalize text-[#f0f4ff]">{r.plan ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusColour[r.status] ?? ''}`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8b9cc8]">{r.commissions_remaining}</td>
                      <td className="px-4 py-3 text-[#f0f4ff]">
                        {r.plan_amount ? fmt(r.plan_amount * effectiveRate) : '—'}
                      </td>
                      <td className="px-4 py-3 text-[#8b9cc8]">
                        {r.first_payment_at ? new Date(r.first_payment_at).toLocaleDateString('en-GB') : 'Awaiting'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Commissions table */}
        {tab === 'commissions' && (
          <div className="overflow-x-auto rounded border border-[#1e2d4a]">
            {commissions.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[#4a5a80]">No commissions yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#080c18]/60">
                    {['Month', 'Gross', 'Rate', 'Commission', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commissions.map(c => (
                    <tr key={c.id} className="border-t border-[#1e2d4a] hover:bg-amber-500/3 transition">
                      <td className="px-4 py-3 text-[#f0f4ff]">{fmtMonth(c.commission_month)}</td>
                      <td className="px-4 py-3 text-[#8b9cc8]">{fmt(c.gross_amount)}</td>
                      <td className="px-4 py-3 text-amber-400">{(c.rate_applied * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 font-semibold text-[#f0f4ff]">{fmt(c.commission_amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusColour[c.status] ?? ''}`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Payouts table */}
        {tab === 'payouts' && (
          <div className="overflow-x-auto rounded border border-[#1e2d4a]">
            {payouts.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[#4a5a80]">No payouts yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#080c18]/60">
                    {['Period', 'Amount', 'Status', 'Scheduled', 'Paid'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payouts.map(p => (
                    <tr key={p.id} className="border-t border-[#1e2d4a] hover:bg-amber-500/3 transition">
                      <td className="px-4 py-3 text-[#f0f4ff]">{fmtMonth(p.period_month)}</td>
                      <td className="px-4 py-3 font-semibold text-[#f0f4ff]">{fmt(p.total_amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusColour[p.status] ?? ''}`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8b9cc8]">{new Date(p.scheduled_for).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-3 text-[#8b9cc8]">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-GB') : '—'}</td>
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

export default function AffiliateDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center">
        <div className="text-sm text-[#4a5a80]">Loading dashboard…</div>
      </div>
    }>
      <AffiliateDashboardContent />
    </Suspense>
  )
}
