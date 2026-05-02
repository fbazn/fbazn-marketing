'use client'

import type { FormEvent, PointerEvent, ReactNode } from 'react'
import { useRef, useState } from 'react'
import Link from 'next/link'

type ActivePlanId = 'starter' | 'pro'
type PlanId = ActivePlanId | 'business'

type ModalState = {
  open: boolean
  plan: ActivePlanId | ''
  email: string
}

const APP_SIGNUP_URL = 'https://app.fbazn.com/login'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const stats = [
  { value: '4x', label: 'Faster product review workflow' },
  { value: '24/7', label: 'Sourcing pipeline visibility' },
  { value: '£0', label: 'Guesswork in landed-profit calls' },
]

const featureCards = [
  {
    id: 'profit',
    title: 'Profit Calculator',
    description:
      'See landed cost, referral fees, FBA fees, VAT, net profit, ROI and margin in one clean view before adding a product to your review queue.',
    media: 'Profit calculator module preview',
  },
  {
    id: 'queue',
    title: 'Review Queue',
    description:
      'Save ASINs from Amazon, review the numbers later, and keep weak leads out of your buying list before they waste time.',
    media: 'Review queue workflow preview',
  },
  {
    id: 'suppliers',
    title: 'Supplier Records',
    description:
      'Attach supplier details, costs, lead times, notes and reorder context directly to each product opportunity.',
    media: 'Supplier management preview',
  },
  {
    id: 'history',
    title: 'Product History',
    description:
      'Track product notes, decisions and performance context so the same opportunity never gets evaluated from zero twice.',
    media: 'Historical data preview',
  },
  {
    id: 'alerts',
    title: 'Seller Alerts',
    description:
      'Keep important sourcing signals visible, from product changes to lead follow-ups and review queue movement.',
    media: 'Alert center preview',
  },
  {
    id: 'competitors',
    title: 'Competitor Tracking',
    description:
      'Watch pricing, BSR movement and competitor stock signals so you know when to act, hold back, or reorder.',
    media: 'Competitor tracking preview',
  },
]

const steps = [
  {
    title: 'Install the extension',
    media: 'Chrome extension install preview',
    description:
      'Add the FBAZN browser extension and it works quietly as you browse Amazon, with no tab-switching or manual data entry.',
  },
  {
    title: 'Add to review queue',
    media: 'Save ASIN to review queue preview',
    description:
      'Spot a potential product and send it to FBAZN. Fees, BSR notes, competition data and estimated profit move into your queue.',
  },
  {
    title: 'Build your sourcing list',
    media: 'Review queue to sourcing list preview',
    description:
      'Approve winners, reject weak leads and keep your sourcing list scored, organised and ready to act on.',
  },
  {
    title: 'Log your supplier',
    media: 'Supplier details screen preview',
    description:
      'Add supplier details, costs, lead times and notes against each product so reordering is simple when it is time to buy.',
  },
]

const plans: Array<{
  id: PlanId
  name: string
  price: number
  period: string
  featured?: boolean
  comingSoon?: boolean
  features: string[]
}> = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    period: 'per month, billed monthly',
    features: [
      'Up to 200 product lookups/day',
      '1 linked Seller account',
      'Profit calculator',
      'Supplier and product management',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 25,
    period: 'per month, billed monthly',
    featured: true,
    features: [
      'Unlimited product lookups',
      '1 linked Seller account',
      'Historical product data',
      'Predicted product data',
      'Everything in Starter',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 49,
    period: 'per month, billed monthly',
    comingSoon: true,
    features: [
      'Everything in Pro',
      'Amazon inventory management',
      'Team access',
      'Repricer',
      'Product suggestions',
      'Daily reporting to your email',
    ],
  },
]

const faqs = [
  {
    question: 'Is FBAZN UK-only?',
    answer:
      'FBAZN is built first for UK sellers on Amazon.co.uk, with UK fees, VAT and sourcing workflows at the centre.',
  },
  {
    question: 'Do I need to switch between tools?',
    answer:
      'No. The goal is to replace separate spreadsheets, profit calculators and supplier trackers with one focused workflow.',
  },
  {
    question: 'What happens after my free trial?',
    answer:
      'You choose a plan, complete checkout and keep access through your billing cycle. You can manage billing from the app.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. Plans are month-to-month, and billing is managed through Stripe so cancellation and payment updates are straightforward.',
  },
  {
    question: 'Does FBAZN violate Amazon Terms of Service?',
    answer:
      'No. The workflow is designed around seller-controlled data and official integrations, without unsafe marketplace automation.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Account, seller and billing data are handled through Supabase and Stripe, with the marketing site only passing plan intent.',
  },
]

function buildSignupUrl(plan: ActivePlanId, email: string) {
  const url = new URL(APP_SIGNUP_URL)
  url.searchParams.set('mode', 'signup')
  url.searchParams.set('plan', plan)
  url.searchParams.set('source', 'marketing-home')
  if (email.trim()) {
    url.searchParams.set('email', email.trim())
  }
  return url.toString()
}

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(featureCards[0])
  const [activeStepIndex, setActiveStepIndex] = useState(1)
  const [modal, setModal] = useState<ModalState>({ open: false, plan: '', email: '' })
  const [heroEmail, setHeroEmail] = useState('')
  const [ctaEmail, setCtaEmail] = useState('')
  const [modalError, setModalError] = useState(false)
  const heroGridRef = useRef<HTMLDivElement>(null)

  const activeStep = steps[activeStepIndex]

  const openSignup = ({ plan = '', email = '' }: Partial<ModalState> = {}) => {
    setModal({ open: true, plan, email })
    setModalError(false)
  }

  const closeSignup = () => {
    setModal((current) => ({ ...current, open: false }))
    setModalError(false)
  }

  const handleHeroSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    openSignup({ email: heroEmail })
  }

  const handleCtaSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    openSignup({ email: ctaEmail })
  }

  const handleModalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!modal.plan) {
      setModalError(true)
      return
    }
    window.location.href = buildSignupUrl(modal.plan, modal.email)
  }

  const handleHeroPointerMove = (event: PointerEvent<HTMLElement>) => {
    const heroGrid = heroGridRef.current
    if (!heroGrid) {
      return
    }

    const rect = heroGrid.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    heroGrid.style.setProperty('--mx', `${Math.max(0, Math.min(100, x))}%`)
    heroGrid.style.setProperty('--my', `${Math.max(0, Math.min(100, y))}%`)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#080c18] font-[var(--font-barlow)] text-[#f0f4ff]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(99,102,241,0.11),transparent_34%),radial-gradient(circle_at_80%_16%,rgba(245,158,11,0.07),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.035)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-amber-500/15 bg-[#080c18]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-[var(--font-barlow-condensed)] text-2xl font-black tracking-[0.08em] text-white"
          >
            FB<span className="text-indigo-400">AZN</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b9cc8] transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/blog"
              className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b9cc8] transition hover:text-white"
            >
              Blog
            </Link>
          </nav>
          <button
            type="button"
            onClick={() => openSignup()}
            className="bg-indigo-500 px-5 py-2.5 font-[var(--font-barlow-condensed)] text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-indigo-600"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            Get started
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <section
          className="group/hero relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 lg:px-20"
          onPointerMove={handleHeroPointerMove}
        >
          <div ref={heroGridRef} className="hero-cursor-grid absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-72 flex-col justify-evenly py-20 opacity-20 lg:flex">
            {[0, 1, 2, 3, 4].map((line) => (
              <div key={line} className="h-px w-full bg-gradient-to-r from-transparent to-amber-500" />
            ))}
            <div className="absolute bottom-0 right-20 top-0 w-px bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
          </div>

          <div className="relative max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 border border-amber-500/35 px-4 py-2 font-[var(--font-barlow-condensed)] text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.8)]" />
              Amazon FBA command centre
            </div>
            <h1 className="max-w-3xl font-[var(--font-barlow-condensed)] text-[clamp(4rem,10vw,8rem)] font-black uppercase leading-[0.9] tracking-normal text-white">
              Source smarter.
              <span className="block text-indigo-400">Ship faster.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#8b9cc8]">
              FBAZN helps Amazon sellers move from product browse to confident buying decision
              with fee-aware profit checks, review queues, supplier records and seller workflows
              in one place.
            </p>

            <form onSubmit={handleHeroSubmit} className="mt-10 flex max-w-xl flex-col sm:flex-row">
              <input
                type="email"
                value={heroEmail}
                onChange={(event) => setHeroEmail(event.target.value)}
                placeholder="Enter your email"
                className="min-h-12 flex-1 border border-[#1e2d4a] bg-[#141c32] px-5 text-sm text-white outline-none placeholder:text-[#4a5a80] focus:border-indigo-400"
              />
              <button
                type="submit"
                className="min-h-12 bg-indigo-500 px-8 font-[var(--font-barlow-condensed)] text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-indigo-600"
              >
                Start free trial
              </button>
            </form>
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#4a5a80]">
              7-day trial. Card entered securely in Stripe checkout.
            </p>

            <div className="mt-16 flex flex-wrap gap-3">
              {['UK-first', 'Fee-aware', 'Extension-ready', 'Supplier tracked'].map((tag) => (
                <span
                  key={tag}
                  className="border border-[#1e2d4a] bg-[#141c32]/70 px-4 py-2 font-[var(--font-barlow-condensed)] text-xs font-bold uppercase tracking-[0.14em] text-[#8b9cc8]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <HazardDivider />

        <section className="grid border-y border-[#1e2d4a] bg-[#0e1425] px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-20">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`py-5 md:px-10 ${index > 0 ? 'border-t border-[#1e2d4a] md:border-l md:border-t-0' : ''}`}
            >
              <div className="font-[var(--font-barlow-condensed)] text-6xl font-black leading-none text-white">
                {stat.value}
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8b9cc8]">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        <section id="features" className="px-5 py-24 sm:px-8 lg:px-20">
          <SectionHeading label="Core modules" title={<>Everything sellers need<br />before they buy.</>} />
          <div className="mt-14 grid border border-[#1e2d4a] bg-[#1e2d4a] md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => setActiveFeature(feature)}
                className={`group relative min-h-64 bg-[#0e1425] p-8 text-left transition hover:bg-[#141c32] ${
                  activeFeature.id === feature.id ? 'bg-[#141c32]' : ''
                }`}
              >
                <span className="absolute right-6 top-5 font-[var(--font-barlow-condensed)] text-5xl font-black text-white/[0.04]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mb-6 flex h-11 w-11 items-center justify-center border border-indigo-400/30 bg-indigo-500/15 font-[var(--font-barlow-condensed)] text-sm font-black text-indigo-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-[var(--font-barlow-condensed)] text-2xl font-bold uppercase tracking-[0.05em] text-white">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#8b9cc8]">{feature.description}</p>
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-indigo-400 transition group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          <div className="mt-px grid border border-[#1e2d4a] bg-[#0e1425] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 lg:p-10">
              <p className="font-[var(--font-barlow-condensed)] text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                Selected module
              </p>
              <h3 className="mt-4 font-[var(--font-barlow-condensed)] text-4xl font-black uppercase text-white">
                {activeFeature.title}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#8b9cc8]">
                {activeFeature.description}
              </p>
            </div>
            <BrowserPreview title="app.fbazn.com / module preview">
              <div className="flex h-full min-h-72 items-center justify-center border border-dashed border-indigo-400/25 bg-[#080c18] p-6 text-center font-[var(--font-barlow-condensed)] text-2xl font-black uppercase tracking-[0.08em] text-[#8b9cc8]">
                {activeFeature.media}
              </div>
            </BrowserPreview>
          </div>
        </section>

        <section id="how" className="border-t border-[#1e2d4a] bg-[#0e1425] px-5 py-24 sm:px-8 lg:px-20">
          <SectionHeading label="The process" title={<>From browse to buy<br />in four steps.</>} />
          <div className="mt-14 grid gap-6 lg:grid-cols-4">
            {steps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStepIndex(index)}
                className={`border p-6 text-left transition ${
                  activeStepIndex === index
                    ? 'border-indigo-400 bg-[#141c32]'
                    : 'border-[#1e2d4a] bg-[#0e1425] hover:bg-[#141c32]'
                }`}
              >
                <p className="font-[var(--font-barlow-condensed)] text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">
                  Step {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-6 font-[var(--font-barlow-condensed)] text-xl font-bold uppercase tracking-[0.05em] text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#8b9cc8]">{step.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-12">
            <BrowserPreview title="fbazn workflow preview">
              <div className="grid min-h-80 gap-8 bg-[#080c18] p-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="flex min-h-64 items-center justify-center border border-dashed border-amber-400/25 bg-[#0e1425] p-6 text-center font-[var(--font-barlow-condensed)] text-2xl font-black uppercase tracking-[0.08em] text-[#8b9cc8]">
                  {activeStep.media}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-[var(--font-barlow-condensed)] text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                    Step {String(activeStepIndex + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-4 font-[var(--font-barlow-condensed)] text-4xl font-black uppercase text-white">
                    {activeStep.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-[#8b9cc8]">{activeStep.description}</p>
                </div>
              </div>
            </BrowserPreview>
          </div>
        </section>

        <HazardDivider />

        <section id="pricing" className="px-5 py-24 sm:px-8 lg:px-20">
          <SectionHeading label="Pricing" title={<>Simple,<br />transparent pricing.</>} />
          <div className="mt-14 grid border border-[#1e2d4a] bg-[#1e2d4a] lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-[#0e1425] p-8 lg:p-10 ${
                  plan.featured ? 'border-t-2 border-indigo-400 bg-[#141c32]' : ''
                } ${plan.comingSoon ? 'opacity-65' : ''}`}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-5 border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 font-[var(--font-barlow-condensed)] text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">
                    Most popular
                  </span>
                )}
                <p className="font-[var(--font-barlow-condensed)] text-xs font-bold uppercase tracking-[0.18em] text-[#8b9cc8]">
                  {plan.name}
                </p>
                <div className="mt-5 font-[var(--font-barlow-condensed)] text-7xl font-black leading-none text-white">
                  <sup className="mr-1 align-super text-3xl font-semibold text-[#8b9cc8]">£</sup>
                  {plan.price}
                </div>
                <p className="mt-2 text-sm text-[#8b9cc8]">{plan.period}</p>
                <ul className="mt-8 min-h-48 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-6 text-[#8b9cc8]">
                      <span className="mt-0.5 text-indigo-300">-</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.comingSoon ? (
                  <button
                    type="button"
                    disabled
                    className="mt-8 w-full border border-[#1e2d4a] px-5 py-3 font-[var(--font-barlow-condensed)] text-sm font-extrabold uppercase tracking-[0.12em] text-[#8b9cc8]"
                  >
                    Coming soon
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openSignup({ plan: plan.id as ActivePlanId })}
                    className={`mt-8 w-full px-5 py-3 font-[var(--font-barlow-condensed)] text-sm font-extrabold uppercase tracking-[0.12em] transition ${
                      plan.featured
                        ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                        : 'border border-[#1e2d4a] text-[#8b9cc8] hover:border-indigo-400 hover:text-white'
                    }`}
                    style={
                      plan.featured
                        ? { clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }
                        : undefined
                    }
                  >
                    {plan.featured ? 'Start free trial' : 'Get started'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="border-t border-[#1e2d4a] bg-[#0e1425] px-5 py-24 sm:px-8 lg:px-20">
          <SectionHeading label="Common questions" title={<>Got questions?<br />We have answers.</>} />
          <div className="mt-14 grid border border-[#1e2d4a] bg-[#1e2d4a] md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-[#0e1425] p-8 transition hover:bg-[#141c32]">
                <h3 className="font-[var(--font-barlow-condensed)] text-xl font-bold uppercase tracking-[0.04em] text-white">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#8b9cc8]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-24 text-center sm:px-8 lg:px-20">
          <h2 className="font-[var(--font-barlow-condensed)] text-[clamp(3.2rem,7vw,6rem)] font-black uppercase leading-[0.94] text-white">
            Ready to <span className="text-indigo-400">ship</span>
            <br />
            more, stress less?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#8b9cc8]">
            Join UK Amazon sellers using FBAZN to move faster from product research to confident purchasing.
          </p>
          <form onSubmit={handleCtaSubmit} className="mx-auto mt-10 flex max-w-lg flex-col sm:flex-row">
            <input
              type="email"
              value={ctaEmail}
              onChange={(event) => setCtaEmail(event.target.value)}
              placeholder="Enter your email"
              className="min-h-12 flex-1 border border-[#1e2d4a] bg-[#141c32] px-5 text-sm text-white outline-none placeholder:text-[#4a5a80] focus:border-indigo-400"
            />
            <button
              type="submit"
              className="min-h-12 bg-indigo-500 px-8 font-[var(--font-barlow-condensed)] text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-indigo-600"
              style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
            >
              Start free
            </button>
          </form>
        </section>
      </main>

      <HazardDivider />

      <footer className="relative z-10 grid gap-8 border-t border-[#1e2d4a] bg-[#080c18] px-5 py-10 text-center sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-20 lg:text-left">
        <div className="font-[var(--font-barlow-condensed)] text-2xl font-black tracking-[0.08em] text-white">
          FB<span className="text-indigo-400">AZN</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.14em] text-[#4a5a80] transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/blog"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#4a5a80] transition hover:text-white"
          >
            Blog
          </Link>
          <Link
            href="/privacy"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#4a5a80] transition hover:text-white"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#4a5a80] transition hover:text-white"
          >
            Terms
          </Link>
        </nav>
        <p className="text-sm text-[#4a5a80] lg:text-right">© 2026 FBAZN Ltd. Built for UK Amazon sellers.</p>
      </footer>

      {modal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeSignup}
            aria-label="Close signup modal"
          />
          <div className="relative grid max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-[#1e2d4a] bg-[#0e1425] shadow-2xl shadow-black/50 lg:grid-cols-[0.9fr_1.1fr]">
            <button
              type="button"
              onClick={closeSignup}
              className="absolute right-4 top-4 z-10 h-9 w-9 border border-[#1e2d4a] text-xl text-[#8b9cc8] transition hover:text-white"
              aria-label="Close signup modal"
            >
              x
            </button>
            <div className="border-b border-[#1e2d4a] p-8 lg:border-b-0 lg:border-r lg:p-10">
              <p className="font-[var(--font-barlow-condensed)] text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                Start with FBAZN
              </p>
              <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-5xl font-black uppercase text-white">
                Choose your plan.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#8b9cc8]">
                Select Starter or Pro, confirm your email, then continue to app.fbazn.com.
                Account creation and card details are handled securely inside the app and Stripe Checkout.
              </p>
              <div className="mt-8 space-y-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    disabled={plan.comingSoon}
                    onClick={() => {
                      if (!plan.comingSoon) {
                        setModal((current) => ({ ...current, plan: plan.id as ActivePlanId }))
                        setModalError(false)
                      }
                    }}
                    className={`w-full border p-4 text-left transition ${
                      plan.comingSoon
                        ? 'cursor-not-allowed border-[#1e2d4a] opacity-45'
                        : modal.plan === plan.id
                          ? 'border-indigo-400 bg-indigo-500/15'
                          : 'border-[#1e2d4a] hover:bg-[#141c32]'
                    }`}
                  >
                    <span className="flex items-center justify-between font-[var(--font-barlow-condensed)] text-xl font-bold uppercase tracking-[0.04em] text-white">
                      {plan.name}
                      <small className="text-sm text-[#8b9cc8]">£{plan.price}/mo</small>
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-[#8b9cc8]">
                      {plan.comingSoon
                        ? 'Coming soon: inventory, teams, repricing and reporting.'
                        : plan.id === 'starter'
                          ? 'For organised sourcing, product review and basic profit checks.'
                          : 'For sellers who want unlimited lookups and deeper product insight.'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <form onSubmit={handleModalSubmit} className="p-8 lg:p-10">
              <label className="block">
                <span className="font-[var(--font-barlow-condensed)] text-sm font-bold uppercase tracking-[0.12em] text-[#8b9cc8]">
                  Billing email
                </span>
                <input
                  type="email"
                  value={modal.email}
                  onChange={(event) =>
                    setModal((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                  required
                  className="mt-3 min-h-12 w-full border border-[#1e2d4a] bg-[#141c32] px-4 text-white outline-none placeholder:text-[#4a5a80] focus:border-indigo-400"
                />
              </label>
              <div className="mt-6 border border-[#1e2d4a] bg-[#080c18] p-5 text-sm leading-7 text-[#8b9cc8]">
                This sends you to app.fbazn.com with your selected plan. You will create your
                account, confirm your email, enter card details in Stripe Checkout, and then land
                inside the FBAZN app.
              </div>
              {modalError && (
                <p className="mt-4 border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  Please select Starter or Pro before continuing.
                </p>
              )}
              <button
                type="submit"
                className="mt-8 w-full bg-indigo-500 px-6 py-4 font-[var(--font-barlow-condensed)] text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-indigo-600"
                style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
              >
                Continue to secure signup
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionHeading({ label, title }: { label: string; title: ReactNode }) {
  return (
    <div>
      <p className="font-[var(--font-barlow-condensed)] text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
        {label}
      </p>
      <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,6vw,4.8rem)] font-black uppercase leading-none text-white">
        {title}
      </h2>
    </div>
  )
}

function BrowserPreview({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-[#0e1425] p-4 lg:p-6">
      <div className="border border-[#1e2d4a] bg-[#080c18]">
        <div className="flex items-center gap-2 border-b border-[#1e2d4a] bg-[#141c32] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-4 truncate text-xs text-[#8b9cc8]">{title}</span>
        </div>
        {children}
      </div>
    </div>
  )
}

function HazardDivider() {
  return (
    <div className="relative h-2.5 overflow-hidden border-y border-amber-500/20 bg-[#070a12]" aria-hidden="true">
      <div className="hazard-divider-track absolute inset-0 w-[200%] bg-[repeating-linear-gradient(-45deg,#f59e0b_0,#f59e0b_14px,#1a1a1a_14px,#1a1a1a_28px)] opacity-70" />
    </div>
  )
}
