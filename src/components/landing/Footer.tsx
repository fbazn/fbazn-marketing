import Link from 'next/link'

export default function Footer() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-white/10 bg-slate-800/60 px-8 py-12 text-center md:flex-row md:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">Ready to move faster?</p>
            <h2 className="mt-3 text-3xl font-semibold">Your all-in-one Amazon FBA dashboard</h2>
            <p className="mt-3 text-base text-slate-300">
              Join sellers using FBAZN to evaluate products, save leads, and unlock profitable sourcing.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
          >
            Get started free
          </Link>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} FBAZN. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
