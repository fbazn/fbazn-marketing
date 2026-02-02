import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-20">
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
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Get started free
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900"
          >
            See features
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
