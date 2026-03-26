import Link from 'next/link'

const tiers = [
  {
    name: 'Starter',
    price: '£10',
    period: '/mo',
    description: 'Everything you need to start sourcing profitable products.',
    features: ['Chrome Extension → Review Queue', 'Full profit calculator', 'Sourcing List & Archived Products', 'Supplier directory', 'Up to 250 products'],
    cta: { label: 'Start free trial', href: 'https://app.fbazn.com/login?mode=signup' },
  },
  {
    name: 'Pro',
    price: '£25',
    period: '/mo',
    description: 'Deeper data and inventory tracking for serious sellers.',
    features: ['Everything in Starter', 'Inventory import & dashboard', 'Inbound order tracking', 'Invoice OCR & confirmation', 'Up to 1,000 products'],
    cta: { label: 'Start free trial', href: 'https://app.fbazn.com/login?mode=signup' },
    highlight: true,
  },
  {
    name: 'Business',
    price: '£49',
    period: '/mo',
    description: 'Maximum power for high-volume sellers and small teams.',
    features: ['Everything in Pro', 'Unlimited products', 'Team seats (up to 5 users)', 'Automated lead generation', 'Priority support'],
    cta: { label: 'Coming soon', href: 'mailto:hello@fbazn.com' },
    comingSoon: true,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="flex min-h-screen snap-start snap-always items-start bg-slate-50 pb-12 pt-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-h-[calc(100vh-var(--header-height))] overflow-y-auto pb-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Simple plans that scale with you
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Start light, then upgrade as your sourcing pipeline grows. Cancel anytime.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                  tier.highlight
                    ? 'border-slate-900 shadow-lg shadow-slate-900/10'
                    : 'border-slate-200'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    Most popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{tier.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{tier.description}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-slate-900">{tier.price}</span>
                    <span className="text-sm text-slate-500">{tier.period}</span>
                  </div>
                  {tier.comingSoon && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
                      Coming later
                    </p>
                  )}
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  {tier.comingSoon ? (
                    <a
                      href={tier.cta.href}
                      className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      {tier.cta.label}
                    </a>
                  ) : (
                    <a
                      href={tier.cta.href}
                      className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {tier.cta.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
