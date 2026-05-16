'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function AffiliateLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [noAffiliate, setNoAffiliate] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Check if this user has an affiliate account
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (!affiliate) {
      // Valid FBAZN account but no affiliate profile — show a prompt to join
      setNoAffiliate(true)
      setLoading(false)
      return
    }

    router.push('/affiliate/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#080c18] text-[#f0f4ff] flex flex-col">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/6 blur-3xl" />
        <div className="absolute top-1/2 -right-60 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-amber-500/15 bg-[#080c18]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="font-black text-xl tracking-[0.08em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
            FBAZN
          </Link>
          <Link href="/affiliate" className="text-xs font-bold uppercase tracking-[0.1em] text-[#8b9cc8] hover:text-white transition" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
            ← Affiliate home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500 mb-3" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Affiliate Portal
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[#f0f4ff]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Sign in
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded border border-[#1e2d4a] bg-[#0e1425] px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4a5a80] outline-none focus:border-amber-500/50 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded border border-[#1e2d4a] bg-[#0e1425] px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4a5a80] outline-none focus:border-amber-500/50 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full px-5 py-3 font-black uppercase tracking-[0.14em] text-white disabled:opacity-60 transition hover:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-barlow-condensed)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {noAffiliate && (
            <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/8 px-4 py-4 text-sm">
              <p className="font-semibold text-amber-300">You have an FBAZN account but haven't joined the affiliate programme yet.</p>
              <p className="mt-1 text-amber-500/70 text-xs">Head to the register page — enter the same email and pick a referral code. We'll link both accounts automatically.</p>
              <Link
                href="/affiliate/register"
                className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.1em] text-amber-400 hover:text-amber-300 transition"
                style={{ fontFamily: 'var(--font-barlow-condensed)' }}
              >
                Set up affiliate account →
              </Link>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-[#4a5a80]">
            Don't have an account?{' '}
            <Link href="/affiliate/register" className="text-[#8b9cc8] hover:text-white transition">
              Register as an affiliate →
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
