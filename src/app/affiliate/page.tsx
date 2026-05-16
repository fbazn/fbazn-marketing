import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Programme — FBAZN',
  description: 'Earn 20% commission for every Amazon FBA seller you refer to FBAZN. Monthly payouts, 12-month lifetime commissions, leaderboard bonuses.',
}

const plans = [
  { name: 'Starter', price: 10, earn: 2 },
  { name: 'Pro', price: 25, earn: 5 },
  { name: 'Business', price: 49, earn: 9.80 },
]

const tiers = [
  { rank: 'Top 3', rate: '25%', boost: '+5%', colour: 'border-amber-500/50 bg-amber-500/8' },
  { rank: 'Top 5', rate: '22.5%', boost: '+2.5%', colour: 'border-indigo-500/40 bg-indigo-500/6' },
  { rank: 'Top 10', rate: '21%', boost: '+1%', colour: 'border-[#1e2d4a] bg-[#0e1425]' },
  { rank: 'Everyone', rate: '20%', boost: 'Base', colour: 'border-[#1e2d4a] bg-[#080c18]/40' },
]

const steps = [
  { n: '01', title: 'Join for free', body: 'Create your affiliate account and choose a custom referral code in under 2 minutes.' },
  { n: '02', title: 'Share your link', body: 'Post fbazn.com/r/YOURCODE anywhere — YouTube, Twitter, newsletters, communities.' },
  { n: '03', title: 'Earn every month', body: 'Get paid 20% of every subscription for 12 months. Payouts land on the 15th via Stripe.' },
]

const faqs = [
  {
    q: 'When do I get paid?',
    a: 'Referrals from a given month are paid on the 15th of the following month. There\'s a 7-day hold after a subscriber\'s trial ends to cover any cancellations.',
  },
  {
    q: 'How long does a referral last?',
    a: 'You earn commission for 12 months per referred customer. After that the commission ends, though the customer stays on FBAZN.',
  },
  {
    q: 'What counts as a valid referral?',
    a: 'A referred user must click your link within 30 days of signing up, complete the 7-day trial, and make their first payment. Cancelled subscriptions within the hold period do not qualify.',
  },
  {
    q: 'How do leaderboard bonuses work?',
    a: 'Rankings are calculated monthly by total revenue generated. Top 3 earn 25%, top 5 earn 22.5%, top 10 earn 21%. Only the highest tier applies — boosts don\'t stack.',
  },
  {
    q: 'Is there a minimum payout?',
    a: 'Yes — £20. If your balance is under £20 on payout day, it rolls to the following month.',
  },
]

export default function AffiliateLandingPage() {
  return (
    <div className="min-h-screen bg-[#080c18] text-[#f0f4ff]">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 -left-60 h-[500px] w-[500px] rounded-full bg-amber-500/8 blur-3xl" />
        <div className="absolute top-1/3 -right-60 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-indigo-500/6 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-amber-500/15 bg-[#080c18]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-black text-2xl tracking-[0.08em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
            FBAZN
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {[
              { label: 'How it works', href: '#how' },
              { label: 'Commission', href: '#commission' },
              { label: 'FAQ', href: '#faq' },
            ].map(item => (
              <a key={item.href} href={item.href} className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b9cc8] transition hover:text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/affiliate/login" className="text-xs font-bold uppercase tracking-[0.1em] text-[#8b9cc8] transition hover:text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Sign in
            </Link>
            <Link
              href="/affiliate/register"
              className="px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-barlow-condensed)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}
            >
              Join free
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="flex min-h-screen items-center px-5 pb-16 pt-32 sm:px-8 lg:px-20">
          <div className="mx-auto max-w-5xl w-full">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/8 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                Affiliate Programme — Now Open
              </span>
            </div>

            <h1
              className="text-5xl font-black uppercase leading-[0.95] tracking-[0.02em] text-white sm:text-7xl lg:text-8xl"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              Earn 20%
              <br />
              <span className="text-amber-400">every month</span>
              <br />
              for 12 months.
            </h1>

            <p className="mt-6 max-w-xl text-base text-[#8b9cc8] sm:text-lg">
              Refer Amazon FBA sellers to FBAZN and earn 20% of their subscription — every single month for a full year. Top affiliates earn up to 25%.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/affiliate/register"
                className="px-8 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5"
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  background: 'linear-gradient(135deg, #6366f1, #4f52c9)',
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                  boxShadow: '0 14px 32px rgba(99, 102, 241, 0.22)',
                }}
              >
                Start earning — it's free
              </Link>
              <a href="#how" className="text-sm font-bold uppercase tracking-[0.1em] text-[#8b9cc8] transition hover:text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                How it works →
              </a>
            </div>

            {/* Hero stats */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: '20%', label: 'Base commission' },
                { value: '12', label: 'Months per referral' },
                { value: '£0', label: 'To join' },
                { value: '15th', label: 'Payout every month' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded border border-[#1e2d4a] bg-[#0e1425]/80 px-4 py-5">
                  <p className="text-3xl font-black text-amber-400" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{value}</p>
                  <p className="mt-1 text-xs text-[#8b9cc8]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="px-5 py-24 sm:px-8 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-500" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>How it works</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-[0.02em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Three steps to your first payout.
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {steps.map(step => (
                <div key={step.n} className="rounded border border-[#1e2d4a] bg-[#0e1425] px-6 py-7">
                  <p className="text-4xl font-black text-[#1e2d4a]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{step.n}</p>
                  <h3 className="mt-3 text-xl font-black uppercase tracking-[0.04em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{step.title}</h3>
                  <p className="mt-2 text-sm text-[#8b9cc8]">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission structure */}
        <section id="commission" className="px-5 py-24 sm:px-8 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-500" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>Commission</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-[0.02em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              The more you refer, the more you earn.
            </h2>
            <p className="mt-3 text-sm text-[#8b9cc8]">
              Monthly leaderboard ranked by total revenue generated. Your rank is locked at the end of each month and the boost applies to that month's commissions.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {tiers.map(tier => (
                <div key={tier.rank} className={`rounded border px-5 py-5 ${tier.colour}`}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{tier.rank}</p>
                  <p className="mt-2 text-4xl font-black text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{tier.rate}</p>
                  <p className="mt-1 text-xs text-amber-400">{tier.boost}</p>
                </div>
              ))}
            </div>

            {/* Per-plan earnings */}
            <div className="mt-8">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                Monthly earnings at 20% base
              </p>
              <div className="overflow-x-auto rounded border border-[#1e2d4a]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#080c18]/60">
                      {['Plan', 'Price/mo', '20% base', 'Top 3 (25%)', 'Over 12 months'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b9cc8]" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(plan => (
                      <tr key={plan.name} className="border-t border-[#1e2d4a] hover:bg-amber-500/3 transition">
                        <td className="px-5 py-3 font-semibold text-[#f0f4ff]">{plan.name}</td>
                        <td className="px-5 py-3 text-[#8b9cc8]">£{plan.price}/mo</td>
                        <td className="px-5 py-3 font-semibold text-amber-400">£{plan.earn.toFixed(2)}/mo</td>
                        <td className="px-5 py-3 text-indigo-400">£{(plan.price * 0.25).toFixed(2)}/mo</td>
                        <td className="px-5 py-3 font-bold text-[#f0f4ff]">up to £{(plan.price * 0.25 * 12).toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Payout rules */}
        <section className="px-5 py-16 sm:px-8 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'Payout schedule',
                  body: 'Commissions from May are paid on June 15th. June commissions are paid on July 15th — always the 15th of the following month.',
                },
                {
                  title: 'Hold period',
                  body: 'After a subscriber\'s trial ends and their first payment goes through, there\'s a 7-day hold. If they cancel within that window, the referral is voided.',
                },
                {
                  title: 'Stripe payouts',
                  body: 'Payouts go direct to your bank via Stripe Connect. Set up once in your dashboard — no invoicing needed.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="rounded border border-[#1e2d4a] bg-[#0e1425] px-5 py-6">
                  <h3 className="text-base font-black uppercase tracking-[0.04em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>{title}</h3>
                  <p className="mt-2 text-sm text-[#8b9cc8]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 py-24 sm:px-8 lg:px-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-500" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>FAQ</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-[0.02em] text-white mb-8" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Common questions.
            </h2>
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <div key={q} className="rounded border border-[#1e2d4a] bg-[#0e1425] px-5 py-5">
                  <p className="font-bold text-[#f0f4ff]">{q}</p>
                  <p className="mt-2 text-sm text-[#8b9cc8]">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-24 sm:px-8 lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-5xl font-black uppercase tracking-[0.02em] text-white" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
              Start earning today.
            </h2>
            <p className="mt-4 text-[#8b9cc8]">Free to join. No approval needed. First payout on the 15th.</p>
            <Link
              href="/affiliate/register"
              className="mt-8 inline-block px-10 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-barlow-condensed)',
                background: 'linear-gradient(135deg, #6366f1, #4f52c9)',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                boxShadow: '0 14px 32px rgba(99, 102, 241, 0.22)',
              }}
            >
              Create your affiliate account
            </Link>
            <p className="mt-4 text-xs text-[#4a5a80]">Already have an account? <Link href="/affiliate/login" className="text-[#8b9cc8] hover:text-white transition">Sign in →</Link></p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2d4a] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-[#4a5a80]">
          <span style={{ fontFamily: 'var(--font-barlow-condensed)' }} className="font-bold uppercase tracking-[0.1em]">FBAZN</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-[#8b9cc8] transition">Terms</Link>
            <Link href="/privacy" className="hover:text-[#8b9cc8] transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
