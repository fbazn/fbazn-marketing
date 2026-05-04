import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — FBAZN",
  description: "Privacy policy for FBAZN and the FBAZN Chrome Extension.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080c18] text-white">

      {/* Header — matches site Header */}
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
          <Link
            href="https://app.fbazn.com/login?mode=signup&plan=starter&source=marketing-nav"
            className="border border-amber-400/50 bg-amber-400 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#080c18] shadow-[0_0_22px_rgba(245,158,11,0.22)] transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Start trial
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-14">

        {/* Page header */}
        <div className="mb-10">
          <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4">
            Legal
          </span>
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-400">Last updated: 23 March 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-400">

          {/* 1 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">1. Who we are</h2>
            <p>
              FBAZN is an Amazon FBA sourcing and analytics platform operated by Sam Knights.
              This policy covers both the FBAZN web application (<strong className="text-white">app.fbazn.com</strong>) and the{" "}
              <strong className="text-white">FBAZN Chrome Extension</strong>.
            </p>
            <p className="mt-2">
              Contact:{" "}
              <a href="mailto:help@fbazn.com" className="text-amber-300 underline underline-offset-2 transition hover:text-amber-200">
                help@fbazn.com
              </a>
            </p>
          </section>

          {/* 2 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">2. What data we collect</h2>

            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-4 mb-2">Account data</h3>
            <ul className="space-y-1.5">
              {[
                "Email address (used to create and identify your account)",
                "Password (hashed — never stored in plain text)",
                "Subscription plan and billing status (via Stripe)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-5 mb-2">Product data (Chrome Extension)</h3>
            <p className="mb-2">
              When you click <strong className="text-white">&quot;+ Add to Queue&quot;</strong> on an Amazon product page, the extension reads and sends to your FBAZN account:
            </p>
            <ul className="space-y-1.5">
              {[
                "ASIN, product title, and main image URL",
                "Buy Box price",
                "Product category and size tier",
                "Calculated FBA fees, net profit, ROI, and margin",
                "Supplier cost price (if you entered one)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-xs text-emerald-400">
              ✓ Data is only sent when you actively click &quot;Add to Queue&quot;. Browsing Amazon without clicking sends nothing to our servers.
            </p>

            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-5 mb-2">Locally stored data (Chrome Extension)</h3>
            <ul className="space-y-1.5">
              {[
                ["Authentication token", "stored in chrome.storage.local — never transmitted except to authenticate API requests"],
                ["FBA fee table cache", "refreshed every 24 hours — avoids unnecessary network requests"],
                ["UI preference", "whether the calculator bar is collapsed"],
              ].map(([bold, rest]) => (
                <li key={bold} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  <span><strong className="text-white">{bold}</strong> — {rest}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">3. How we use your data</h2>
            <ul className="space-y-1.5">
              {[
                "To provide the FBAZN service — your Review Queue, Sourcing List, and analytics",
                "To calculate and display FBA profit figures in the Chrome Extension",
                "To manage your subscription via Stripe",
                "To send transactional emails (account confirmation, billing receipts)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white">
              We do not sell your data. We do not use your data for advertising.
            </p>
          </section>

          {/* 4 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">4. Data storage and security</h2>
            <ul className="space-y-2">
              {[
                ["Supabase", "Account and product data stored in PostgreSQL on AWS. All tables have row-level security — users can only access their own data."],
                ["Stripe", "Handles all payment processing. We never store card numbers."],
                ["Vercel", "Application hosting with HTTPS enforced on all endpoints."],
              ].map(([provider, desc]) => (
                <li key={provider} className="flex items-start gap-3 rounded-lg border border-white/8 bg-white/4 px-3 py-2.5 list-none">
                  <span className="font-semibold text-white w-16 flex-shrink-0">{provider}</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">5. Chrome Extension permissions</h2>
            <div className="space-y-2">
              {[
                ["storage", "Stores your auth token, fee cache, and UI preferences locally on your device."],
                ["amazon.co.uk", "Injects the profit calculator bar and reads product data (title, price, category, dimensions) on product pages only."],
                ["app.fbazn.com", "Sends product data to your account when you click \"Add to Queue\"."],
                ["supabase.co", "Fetches up-to-date FBA fee tables and authenticates your session."],
              ].map(([perm, desc]) => (
                <div key={perm} className="flex items-start gap-3 rounded-lg border border-white/8 bg-white/4 px-3 py-2.5">
                  <code className="font-mono text-xs text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                    {perm}
                  </code>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 6 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">6. Data retention</h2>
            <p>
              Your data is retained for as long as your account is active. You can request deletion of your account and all associated data at any time by emailing{" "}
              <a href="mailto:help@fbazn.com" className="text-amber-300 underline underline-offset-2 transition hover:text-amber-200">
                help@fbazn.com
              </a>.
              Account data will be permanently deleted within 30 days of the request.
            </p>
          </section>

          {/* 7 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">7. Third-party services</h2>
            <ul className="space-y-1.5">
              {[
                ["Supabase", "database and authentication"],
                ["Stripe", "payment processing"],
                ["Vercel", "application hosting"],
              ].map(([name, role]) => (
                <li key={name} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  <span><strong className="text-white">{name}</strong> — {role}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Each provider has their own privacy policy and data processing agreements in place.
            </p>
          </section>

          {/* 8 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">8. Your rights (UK GDPR)</h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time.
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:help@fbazn.com" className="text-amber-300 underline underline-offset-2 transition hover:text-amber-200">
                help@fbazn.com
              </a>.
            </p>
          </section>

          {/* 9 */}
          <section className="rounded-xl border border-white/8 bg-white/4 p-6">
            <h2 className="text-base font-semibold text-white mb-3">9. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be notified by email.
              Continued use of FBAZN after changes constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-white/10 pt-6 flex items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} FBAZN. All rights reserved.</span>
          <a href="mailto:help@fbazn.com" className="transition hover:text-white">help@fbazn.com</a>
        </div>
      </div>
    </div>
  );
}
