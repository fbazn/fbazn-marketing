'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { sanitiseCode } from '@/lib/affiliate'

type Step = 'account' | 'code' | 'done'

export default function AffiliateRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('account')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [codeStatus, setCodeStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check code availability with debounce
  useEffect(() => {
    const clean = sanitiseCode(code)
    if (clean.length < 2) { setCodeStatus('idle'); return }

    setCodeStatus('checking')
    const t = setTimeout(async () => {
      const res = await fetch(`/api/affiliate/check-code?code=${clean}`)
      const json = await res.json()
      setCodeStatus(json.available ? 'available' : 'taken')
    }, 500)
    return () => clearTimeout(t)
  }, [code])

  async function handleRegister() {
    setError('')
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setStep('code')
  }

  async function handleSubmit() {
    setError('')
    const cleanCode = sanitiseCode(code)
    if (cleanCode.length < 2) { setError('Enter a valid code.'); return }
    if (codeStatus === 'taken') { setError('That code is already taken.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, code: cleanCode }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Something went wrong.')
        return
      }

      // Sign in after registration
      const supabase = createClient()
      await supabase.auth.signInWithPassword({ email, password })

      setStep('done')
      setTimeout(() => router.push('/affiliate/dashboard'), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080c18] flex items-center justify-center px-4 py-16">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/8 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Hazard bar */}
        <div
          className="h-1.5 rounded-t"
          style={{
            background: 'repeating-linear-gradient(90deg, #f59e0b 0px, #f59e0b 12px, transparent 12px, transparent 24px)',
            opacity: 0.6,
          }}
        />

        <div className="border border-[#1e2d4a] border-t-0 bg-[#0e1425] rounded-b p-8">
          <Link href="/affiliate" className="text-xs font-bold uppercase tracking-[0.16em] text-amber-500 hover:text-amber-400 transition">
            ← Back to affiliate programme
          </Link>

          <h1
            className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white"
            style={{ fontFamily: 'var(--font-barlow-condensed)' }}
          >
            {step === 'done' ? 'You\'re in.' : 'Join the programme'}
          </h1>
          <p className="mt-1 text-sm text-[#8b9cc8]">
            {step === 'account' && 'Create your affiliate account.'}
            {step === 'code' && 'Choose your referral code — this is what goes in your link.'}
            {step === 'done' && 'Taking you to your dashboard now…'}
          </p>

          {error && (
            <div className="mt-4 rounded border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          {/* Step 1 — Account details */}
          {step === 'account' && (
            <div className="mt-6 space-y-4">
              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8] mb-1.5"
                  style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Sam Knights"
                  className="w-full rounded bg-[#080c18] border border-[#1e2d4a] px-3.5 py-2.5 text-sm text-[#f0f4ff] placeholder-[#4a5a80] outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition"
                />
              </div>
              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8] mb-1.5"
                  style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded bg-[#080c18] border border-[#1e2d4a] px-3.5 py-2.5 text-sm text-[#f0f4ff] placeholder-[#4a5a80] outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition"
                />
              </div>
              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8] mb-1.5"
                  style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded bg-[#080c18] border border-[#1e2d4a] px-3.5 py-2.5 text-sm text-[#f0f4ff] placeholder-[#4a5a80] outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition"
                />
              </div>
              <button
                onClick={handleRegister}
                className="mt-2 w-full py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5"
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  background: 'linear-gradient(135deg, #6366f1, #4f52c9)',
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                }}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2 — Referral code */}
          {step === 'code' && (
            <div className="mt-6 space-y-4">
              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8] mb-1.5"
                  style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                >
                  Your referral code
                </label>
                <div className="flex items-center gap-0">
                  <span className="flex items-center rounded-l border border-r-0 border-[#1e2d4a] bg-[#080c18]/60 px-3 py-2.5 text-xs text-[#4a5a80] whitespace-nowrap select-none">
                    fbazn.com/r/
                  </span>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                    placeholder="YOURCODE"
                    maxLength={10}
                    className="flex-1 rounded-r bg-[#080c18] border border-[#1e2d4a] px-3.5 py-2.5 text-sm font-bold text-[#f0f4ff] placeholder-[#4a5a80] outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition uppercase"
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-xs text-[#4a5a80]">Max 10 characters, letters and numbers only.</p>
                  {codeStatus === 'checking' && <span className="text-xs text-[#4a5a80]">Checking…</span>}
                  {codeStatus === 'available' && <span className="text-xs text-emerald-400">✓ Available</span>}
                  {codeStatus === 'taken' && <span className="text-xs text-rose-400">✗ Already taken</span>}
                </div>
              </div>

              <div className="rounded border border-[#1e2d4a] bg-[#080c18]/40 px-4 py-3 text-xs text-[#8b9cc8] space-y-1">
                <p className="font-bold uppercase tracking-wider text-[#f0f4ff]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>Your commission</p>
                <p>20% of each referred subscription for 12 months.</p>
                <p>Top affiliates earn up to 25% via leaderboard boosts.</p>
                <p>Payouts on the 15th of each month via Stripe.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('account')}
                  className="flex-1 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#8b9cc8] border border-[#1e2d4a] rounded transition hover:border-amber-500/50 hover:text-white"
                  style={{ fontFamily: 'var(--font-barlow-condensed)' }}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || codeStatus === 'taken' || codeStatus === 'checking' || sanitiseCode(code).length < 2}
                  className="flex-1 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{
                    fontFamily: 'var(--font-barlow-condensed)',
                    background: 'linear-gradient(135deg, #6366f1, #4f52c9)',
                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                  }}
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Done */}
          {step === 'done' && (
            <div className="mt-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-sm text-[#8b9cc8]">Account created. Redirecting to your dashboard…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
