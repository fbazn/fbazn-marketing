'use client'

import type { MouseEvent } from 'react'
import Link from 'next/link'

const APP_SIGNUP_URL = 'https://app.fbazn.com/login?mode=signup&plan=starter&source=marketing-nav'

const navItems = [
  { label: 'Features', href: '/#features', id: 'features' },
  { label: 'How it works', href: '/#how', id: 'how' },
  { label: 'Pricing', href: '/#pricing', id: 'pricing' },
  { label: 'FAQ', href: '/#faq', id: 'faq' },
]

type HeaderProps = {
  onNavigate?: (id: string) => void
}

export default function Header({ onNavigate }: HeaderProps) {
  const handleNavClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate) {
      return
    }
    event.preventDefault()
    onNavigate(id)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-amber-500/15 bg-[#080c18]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="grid h-9 w-9 place-items-center border border-amber-400/40 bg-amber-400/10 font-[var(--font-barlow-condensed)] text-xl font-black text-amber-200">
            F
          </span>
          <span className="font-[var(--font-barlow-condensed)] text-2xl font-black tracking-[0.08em]">
            FBAZN
          </span>
          <span className="hidden border-l border-white/15 pl-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 sm:inline">
            Sourcing OS
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavClick(item.id)}
              className="transition hover:text-amber-200"
            >
              {item.label}
            </a>
          ))}
          <Link href="/blog" className="transition hover:text-amber-200">
            Blog
          </Link>
          <Link href="/tools" className="transition hover:text-amber-200">
            Free tools
          </Link>
        </nav>
        <Link
          href={APP_SIGNUP_URL}
          className="border border-amber-400/50 bg-amber-400 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#080c18] shadow-[0_0_22px_rgba(245,158,11,0.22)] transition hover:-translate-y-0.5 hover:bg-amber-300"
        >
          Start trial
        </Link>
      </div>
    </header>
  )
}
