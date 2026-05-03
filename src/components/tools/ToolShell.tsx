import type { ReactNode } from 'react'
import Link from 'next/link'
import Header from '@/components/landing/Header'

interface ToolShellProps {
  title: string
  description: string
  children: ReactNode
}

export default function ToolShell({ title, description, children }: ToolShellProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#080c18] px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/tools"
            className="text-sm text-[#8b9cc8] transition hover:text-white"
          >
            ← Free tools
          </Link>
          <div className="mt-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-400">
              FBAZN
            </p>
            <h1 className="mt-1 font-[var(--font-barlow-condensed)] text-3xl font-black uppercase tracking-[0.04em] text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[#8b9cc8]">{description}</p>
          </div>
          <div className="mt-8 space-y-5">{children}</div>
        </div>
      </main>
    </>
  )
}

export function ToolCard({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="border border-[#1e2d4a] bg-[#0e1425] p-6">
      <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#8b9cc8]">
        {heading}
      </h2>
      {children}
    </div>
  )
}

export function ToolRow({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? 'text-[#8b9cc8]' : 'font-medium text-[#8b9cc8]'}>{label}</span>
      <span className={muted ? 'text-[#8b9cc8]' : 'font-semibold text-white'}>{value}</span>
    </div>
  )
}

export function ToolStatCard({
  label,
  value,
  colorClass,
}: {
  label: string
  value: string
  colorClass?: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 border border-[#1e2d4a] bg-[#141c32] p-3 text-center">
      <span className="text-xs text-[#8b9cc8]">{label}</span>
      <span className={`text-lg font-bold ${colorClass ?? 'text-white'}`}>{value}</span>
    </div>
  )
}

export function ToolDivider() {
  return <div className="my-3 border-t border-[#1e2d4a]" />
}

export function ToolInfoBox({
  variant,
  children,
}: {
  variant: 'indigo' | 'amber' | 'rose'
  children: ReactNode
}) {
  const styles = {
    indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    rose: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  }
  return (
    <div className={`mt-4 border p-3 text-xs ${styles[variant]}`}>{children}</div>
  )
}

export const inputCls =
  'h-11 w-full border border-[#1e2d4a] bg-[#141c32] px-3 text-sm text-white placeholder:text-[#4a5a80] focus:outline-none focus:ring-2 focus:ring-indigo-400'

export const inputWithPrefixCls =
  'h-11 w-full border border-[#1e2d4a] bg-[#141c32] pl-7 pr-3 text-sm text-white placeholder:text-[#4a5a80] focus:outline-none focus:ring-2 focus:ring-indigo-400'

export const labelCls = 'flex flex-col gap-1.5 text-sm font-medium text-[#8b9cc8]'

export const prefixCls = 'absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5a80]'
export const suffixCls = 'absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a80]'
