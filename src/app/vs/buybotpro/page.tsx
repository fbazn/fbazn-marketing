import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/landing/Header'

export const metadata: Metadata = {
  title: 'FBAZN vs BuyBotPro — More Features. A Third of the Price.',
  description:
    'Thinking about BuyBotPro? See how FBAZN compares on features and pricing. Full sourcing dashboard, Keepa on Pro, and 10 free tools — starting at £10/mo vs £32/mo for BuyBotPro.',
  openGraph: {
    title: 'FBAZN vs BuyBotPro — More Features. A Third of the Price.',
    description:
      'Full sourcing dashboard, Keepa on Pro plan, and 10 free tools — FBAZN starts at £10/mo while BuyBotPro costs ~£32/mo.',
    type: 'website',
  },
}

const APP_URL = 'https://app.fbazn.com/login?mode=signup&plan=starter&source=vs-buybotpro'

type RowValue = boolean | string

const rows: { feature: string; fbazn: RowValue; bbp: RowValue; note?: string }[] = [
  {
    feature: 'Entry price per month',
    fbazn: '£10 / mo',
    bbp: '~£32 / mo',
    note: 'BuyBotPro charges in USD ($39.95) — UK sellers pay extra on top via FX fees',
  },
  { feature: 'Chrome extension for deal analysis', fbazn: true, bbp: true },
  { feature: 'Profit & FBA fee calculator', fbazn: true, bbp: true },
  {
    feature: 'Keepa price history — built in',
    fbazn: 'Pro — £25',
    bbp: false,
    note: 'BuyBotPro shows basic BSR trend but no full Keepa chart integration',
  },
  {
    feature: 'Full sourcing dashboard',
    fbazn: true,
    bbp: false,
    note: 'BuyBotPro is an extension + mobile app. No web dashboard for managing your pipeline',
  },
  { feature: 'Lead pipeline & review queue', fbazn: true, bbp: false },
  { feature: 'Supplier directory', fbazn: true, bbp: false },
  {
    feature: '10 free standalone tools (VAT, BSR, landed cost…)',
    fbazn: true,
    bbp: false,
  },
  {
    feature: 'Deal scoring (100-point system)',
    fbazn: 'Coming soon',
    bbp: true,
    note: "BuyBotPro's scoring is useful — though users report it only works ~50% of the time",
  },
  {
    feature: 'IP / hazmat / eligibility checks',
    fbazn: 'Coming soon',
    bbp: true,
    note: 'BBP does check these — but provides limited detail on IP warning dates or severity',
  },
  {
    feature: 'Mobile app included in subscription',
    fbazn: false,
    bbp: true,
    note: 'BuyBot Go included — though some users report it was charged separately in the past',
  },
  { feature: 'Inventory management dashboard', fbazn: 'Pro — £25', bbp: false },
  { feature: 'Inbound order tracking', fbazn: 'Pro — £25', bbp: false },
  { feature: 'Team seats', fbazn: 'Business — £49', bbp: 'Enterprise — ~£102' },
  {
    feature: 'GBP pricing (no FX conversion)',
    fbazn: true,
    bbp: false,
    note: 'BuyBotPro bills in USD — every payment costs UK sellers extra',
  },
  { feature: 'Free trial', fbazn: '7 days', bbp: '14 days' },
  { feature: 'Cancel anytime', fbazn: true, bbp: true },
]

function Cell({ value }: { value: RowValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
        </svg>
        Yes
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-rose-400">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
        </svg>
        No
      </span>
    )
  }
  return <span className="font-semibold text-amber-300">{value}</span>
}

export default function VsBuyBotProPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-[#080c18] text-[#f0f4ff]">
        {/* Background grid + glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,158,11,0.12),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.16),transparent_32%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.035)_1px,transparent_1px)] bg-[size:58px_58px]" />
        </div>

        {/* ── HERO ── */}
        <section className="relative border-b border-white/8 px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">
              FBAZN vs BuyBotPro
            </p>
            <h1 className="mt-5 font-[var(--font-barlow-condensed)] text-6xl font-black uppercase leading-[0.92] tracking-[0.02em] text-white sm:text-7xl lg:text-8xl">
              More features.<br />
              A&nbsp;third&nbsp;of<br />
              the&nbsp;price.
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-slate-300">
              If you searched for BuyBotPro, you deserve the full picture. FBAZN gives you
              A complete sourcing dashboard, Keepa on Pro, and 10 free tools — starting at{' '}
              <span className="font-bold text-amber-300">£10&thinsp;/&thinsp;mo</span>.
              BuyBotPro starts at <span className="font-bold text-rose-400">~£32&thinsp;/&thinsp;mo</span> — billed in USD.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={APP_URL}
                className="border border-amber-400/50 bg-amber-400 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#080c18] shadow-[0_0_28px_rgba(245,158,11,0.28)] transition hover:-translate-y-0.5 hover:bg-amber-300"
              >
                Start free — 7-day trial
              </Link>
              <a
                href="#comparison"
                className="border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-300 transition hover:border-white/40 hover:text-white"
              >
                See full comparison ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── PRICE PUNCH ── */}
        <section className="relative border-b border-white/8 px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="mb-8 text-xs font-black uppercase tracking-[0.28em] text-slate-500">
              Pricing at a glance
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'FBAZN Starter',
                  price: '£10',
                  sub: 'per month',
                  note: 'Full dashboard + Chrome extension + Keepa on Pro (£25)',
                  highlight: true,
                },
                {
                  label: 'BuyBotPro Basic',
                  price: '~£32',
                  sub: 'per month (billed in USD)',
                  note: 'Chrome extension + mobile app',
                  highlight: false,
                },
                {
                  label: 'BuyBotPro Pro',
                  price: '~£43',
                  sub: 'per month (billed in USD)',
                  note: 'Adds suspension safeguard',
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className={`border p-6 ${
                    tier.highlight
                      ? 'border-amber-400/50 bg-amber-400/8 shadow-[0_0_32px_rgba(245,158,11,0.10)]'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                    {tier.label}
                  </p>
                  <p
                    className={`mt-3 font-[var(--font-barlow-condensed)] text-5xl font-black ${
                      tier.highlight ? 'text-amber-300' : 'text-rose-400'
                    }`}
                  >
                    {tier.price}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{tier.sub}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{tier.note}</p>
                  {tier.highlight && (
                    <Link
                      href={APP_URL}
                      className="mt-6 inline-block border border-amber-400/50 bg-amber-400 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#080c18] transition hover:bg-amber-300"
                    >
                      Start free trial
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-slate-600">
              BuyBotPro USD prices converted at ~£1 = $1.27. Actual cost may be higher depending
              on your bank&apos;s FX rate. FBAZN is priced in GBP — no surprises.
            </p>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section id="comparison" className="relative border-b border-white/8 px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
              Feature comparison
            </p>
            <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-4xl font-black uppercase tracking-[0.03em] text-white sm:text-5xl">
              What you actually get
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Green = included. Red = not available. Honest where BuyBotPro wins too.
            </p>

            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 pr-6 text-left text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Feature
                    </th>
                    <th className="w-28 py-4 pr-6 text-center text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                      FBAZN
                    </th>
                    <th className="w-28 py-4 text-center text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                      BuyBotPro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className="group border-b border-white/[0.05] transition hover:bg-white/[0.025]"
                    >
                      <td className="py-4 pr-6 text-slate-300">
                        <span>{row.feature}</span>
                        {row.note && (
                          <span className="mt-1 block text-xs text-slate-600 group-hover:text-slate-500">
                            {row.note}
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-6 text-center">
                        <Cell value={row.fbazn} />
                      </td>
                      <td className="py-4 text-center">
                        <Cell value={row.bbp} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── BBP PAIN POINTS ── */}
        <section className="relative border-b border-white/8 px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-400">
              What sellers are saying about BuyBotPro
            </p>
            <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-4xl font-black uppercase tracking-[0.03em] text-white sm:text-5xl">
              The problems people<br />don&apos;t mention
            </h2>
            <p className="mt-4 text-base text-slate-400">
              These are documented complaints from real BuyBotPro users — not our opinion.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: 'Works roughly half the time',
                  body: 'Multiple users report BuyBotPro fails to process or deliver accurate results on a significant portion of their scans. For a tool you\'re paying £32+/mo for, that\'s a serious problem when you\'re mid-sourcing.',
                },
                {
                  title: 'You\'re paying in USD as a UK seller',
                  body: 'BuyBotPro charges in US dollars. Every month your bank converts the payment and takes a cut. Over a year that hidden FX cost adds up — and it\'s never factored into their "starting from" price.',
                },
                {
                  title: 'The Suspension Safeguard doesn\'t work as advertised',
                  body: 'Sellers who paid for the Pro tier specifically for suspension protection report being redirected to third-party services rather than receiving any real help. Several users consider this the biggest disappointment.',
                },
                {
                  title: 'It\'s an analysis tool — not a sourcing system',
                  body: 'BuyBotPro will tell you whether a deal is good. But it won\'t help you find deals, manage your supplier pipeline, or track what you\'ve bought. Most users still need Tactical Arbitrage on top of it.',
                },
                {
                  title: 'No Keepa integration',
                  body: 'BuyBotPro shows a basic BSR trend but doesn\'t include full Keepa price history charts. Sourcing without proper Keepa data means flying blind on price history — especially critical for UK wholesale.',
                },
                {
                  title: 'Barcode recognition rarely works',
                  body: 'The barcode scanning feature — a key selling point of the mobile app — is frequently cited as broken or inaccurate. You\'re paying for a feature that doesn\'t reliably function.',
                },
              ].map((point) => (
                <div
                  key={point.title}
                  className="border border-rose-500/15 bg-rose-500/5 p-6"
                >
                  <p className="font-[var(--font-barlow-condensed)] text-xl font-black uppercase tracking-[0.03em] text-rose-300">
                    {point.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FBAZN ADVANTAGES ── */}
        <section className="relative border-b border-white/8 px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
              Why FBAZN is different
            </p>
            <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-4xl font-black uppercase tracking-[0.03em] text-white sm:text-5xl">
              A complete sourcing<br />operating system
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-400">
              BuyBotPro analyses deals. FBAZN manages your entire sourcing workflow — from first
              scan to buying decision — with everything built into one platform.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Keepa built in on Pro',
                  body: 'Upgrade to Pro (£25/mo) and every product page shows full Keepa price history charts — no separate Keepa subscription needed. See 90 and 365-day price trends instantly.',
                },
                {
                  title: 'Your sourcing pipeline, organised',
                  body: 'Save products to a review queue, archive losers, track suppliers. Your sourcing history is always searchable — not buried in browser tabs.',
                },
                {
                  title: '10 free tools, no login required',
                  body: 'FBA profit calculator, VAT calculator, BSR estimator, landed cost tool, and 6 more — free, forever, at fbazn.com/tools.',
                },
                {
                  title: 'Supplier directory built in',
                  body: 'Log your wholesale suppliers, link them to products, and track performance over time. No more spreadsheets.',
                },
                {
                  title: 'GBP pricing — no FX surprises',
                  body: 'Starter is £10/mo, Pro is £25/mo. That\'s what you pay. No USD conversion, no surprise bank charges.',
                },
                {
                  title: 'UK-first from the ground up',
                  body: 'Built specifically for UK FBA sellers. VAT, fees, and tools are all calculated the way UK sellers think — not retrofitted from a US product.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-amber-400/15 bg-amber-400/5 p-6 transition hover:border-amber-400/30"
                >
                  <p className="font-[var(--font-barlow-condensed)] text-xl font-black uppercase tracking-[0.03em] text-amber-200">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-4xl border border-amber-400/20 bg-amber-400/5 p-12 text-center shadow-[0_0_60px_rgba(245,158,11,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">
              Ready to switch?
            </p>
            <h2 className="mt-5 font-[var(--font-barlow-condensed)] text-5xl font-black uppercase leading-[0.95] tracking-[0.02em] text-white sm:text-6xl">
              Three months of FBAZN<br />costs less than one month<br />of BuyBotPro.
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Start your free 7-day trial today. Full access to the dashboard and Chrome
              extension from day one. Upgrade to Pro for Keepa.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={APP_URL}
                className="border border-amber-400/50 bg-amber-400 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#080c18] shadow-[0_0_32px_rgba(245,158,11,0.3)] transition hover:-translate-y-0.5 hover:bg-amber-300"
              >
                Start free trial
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-600">
              Cancel anytime · Starter plan included
            </p>
          </div>
        </section>

        {/* Simple footer */}
        <footer className="border-t border-white/8 px-5 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-slate-600 sm:flex-row">
            <p>© {new Date().getFullYear()} FBAZN. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="transition hover:text-slate-400">Privacy</Link>
              <Link href="/terms" className="transition hover:text-slate-400">Terms</Link>
              <Link href="/" className="transition hover:text-slate-400">Home</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
