'use client'

import type { MouseEvent, FormEvent } from 'react'
import { useState } from 'react'

type HeroProps = {
  onScrollToId?: (id: string) => void
}

export default function Hero({ onScrollToId }: HeroProps) {
  const [email, setEmail] = useState('')

  const handleFeaturesClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onScrollToId) return
    event.preventDefault()
    onScrollToId('features')
  }

  const handleSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const url = new URL('https://app.fbazn.com/login')
    if (email) url.searchParams.set('email', email)
    url.searchParams.set('mode', 'signup')
    window.location.href = url.toString()
  }

  return (
    <section className="relative flex min-h-screen snap-start snap-always items-center overflow-hidden bg-white pb-12 pt-28">
      <div className="absolute inset-0">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Built for modern Amazon sellers
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your all-in-one Amazon FBA dashboard
          </h1>
          <p className="mt-6 text-lg text-slate-600 sm:text-xl">
            Evaluate products in seconds, save leads, and understand true profit after fees — with sourcing tools and an FBA dashboard built for sellers.
          </p>
        </div>
        <form onSubmit={handleSignup} className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 flex-1 rounded-full border border-slate-300 bg-white px-5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Start free trial
          </button>
        </form>
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-slate-500">7-day free trial · No card required</p>
          <a
            href="#features"
            onClick={handleFeaturesClick}
            className="text-sm font-semibold text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            See how it works →
          </a>
        </div>
        <div className="mx-auto flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
          <span className="rounded-full border border-slate-200 px-3 py-1">UK-first</span>
          <span className="rounded-full border border-slate-200 px-3 py-1">Built for modern FBA sellers</span>
          <span className="rounded-full border border-slate-200 px-3 py-1">Fast fee-aware profit insights</span>
        </div>
      </div>
    </section>
  )
}
