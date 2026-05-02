import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import Header from '@/components/landing/Header'

export const metadata: Metadata = {
  title: 'Blog | FBAZN - Amazon FBA Guides & Strategies',
  description:
    'Guides, tips and strategies to help UK Amazon FBA sellers find profitable products, evaluate fees, and grow their business.',
  openGraph: {
    title: 'FBAZN Blog - Amazon FBA Guides & Strategies',
    description:
      'Guides, tips and strategies to help UK Amazon FBA sellers find profitable products, evaluate fees, and grow their business.',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

type ArticlePreview = {
  slug: string
  meta_title: string
  meta_description: string
  tags: string[] | null
  created_at: string
  cover_image_url: string | null
}

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function CoverFrame({
  article,
  featured = false,
}: {
  article: ArticlePreview
  featured?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden border border-white/10 bg-[#10182a] ${
        featured ? 'min-h-[320px] lg:min-h-full' : 'h-52'
      }`}
    >
      {article.cover_image_url ? (
        <img
          src={article.cover_image_url}
          alt={article.meta_title}
          className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,158,11,0.18),transparent_36%),linear-gradient(rgba(99,102,241,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.11)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-[#080c18]/25 to-transparent" />
      <div className="absolute left-5 top-5 border border-amber-400/35 bg-[#080c18]/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
        Field note
      </div>
      {!article.cover_image_url && (
        <div className="absolute bottom-6 left-6 right-6">
          <p className="max-w-sm font-[var(--font-barlow-condensed)] text-4xl font-black uppercase leading-none tracking-[0.03em] text-white/90">
            FBAZN
          </p>
          <div className="mt-4 h-1 w-20 bg-amber-400" />
        </div>
      )}
    </div>
  )
}

function TagList({ tags }: { tags: string[] | null }) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, 4).map((tag) => (
        <span
          key={tag}
          className="border border-indigo-300/20 bg-indigo-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-100"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default async function BlogPage() {
  const supabase = getSupabase()
  let posts: ArticlePreview[] = []
  let fetchError: string | null = null

  if (supabase) {
    const { data: articles, error } = await supabase
      .from('blog_articles')
      .select('slug, meta_title, meta_description, tags, created_at, cover_image_url')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog articles:', error.message)
      fetchError = 'The content feed is temporarily unavailable.'
    }

    posts = (articles ?? []) as ArticlePreview[]
  } else {
    fetchError = 'Supabase is not configured for this environment.'
  }

  const featured = posts[0]
  const articles = posts.slice(1)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'FBAZN Blog',
    description:
      'Guides, tips and strategies for UK Amazon FBA sellers evaluating products, fees, and sourcing workflows.',
    url: 'https://fbazn.com/blog',
  }

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="relative min-h-screen overflow-hidden bg-[#080c18] text-[#f0f4ff]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(245,158,11,0.10),transparent_26%),radial-gradient(circle_at_82%_8%,rgba(99,102,241,0.14),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.035)_1px,transparent_1px)] bg-[size:58px_58px]" />
        </div>

        <section className="relative border-b border-white/10 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">
                FBAZN field notes
              </p>
              <h1 className="mt-5 max-w-4xl font-[var(--font-barlow-condensed)] text-6xl font-black uppercase leading-[0.9] tracking-[0.03em] text-white sm:text-7xl lg:text-8xl">
                Sourcing signals for serious FBA sellers.
              </h1>
            </div>
            <div className="border-l border-amber-400/25 pl-6">
              <p className="text-lg leading-8 text-slate-300">
                Tactical guides, product research breakdowns, fee thinking, and operating notes
                for UK Amazon sellers building a cleaner sourcing workflow.
              </p>
              <div className="mt-7 grid grid-cols-3 border border-white/10 bg-white/[0.03]">
                {[
                  ['UK', 'seller focus'],
                  ['FBA', 'fee clarity'],
                  ['Live', 'research notes'],
                ].map(([value, label]) => (
                  <div key={value} className="border-r border-white/10 p-4 last:border-r-0">
                    <p className="font-[var(--font-barlow-condensed)] text-3xl font-black text-amber-200">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {fetchError && (
              <div className="mb-8 border border-amber-400/25 bg-amber-400/10 px-5 py-4 text-sm font-semibold text-amber-100">
                {fetchError}
              </div>
            )}

            {posts.length === 0 ? (
              <div className="border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">
                  No dispatches yet
                </p>
                <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-5xl font-black uppercase tracking-[0.03em] text-white">
                  The blog queue is being loaded.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-slate-400">
                  New Amazon FBA guides will appear here as soon as they are published.
                </p>
              </div>
            ) : (
              <>
                {featured && (
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group grid overflow-hidden border border-amber-400/20 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-amber-300/45 hover:bg-white/[0.06] lg:grid-cols-[0.95fr_1.05fr]"
                  >
                    <CoverFrame article={featured} featured />
                    <div className="flex min-h-[320px] flex-col justify-between p-7 sm:p-9 lg:p-10">
                      <div>
                        <div className="mb-6 flex items-center justify-between gap-4">
                          <TagList tags={featured.tags} />
                          <p className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            {formatDate(featured.created_at)}
                          </p>
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.26em] text-amber-300">
                          Latest guide
                        </p>
                        <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-5xl font-black uppercase leading-[0.95] tracking-[0.03em] text-white sm:text-6xl">
                          {featured.meta_title}
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                          {featured.meta_description}
                        </p>
                      </div>
                      <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-amber-200 transition group-hover:text-amber-100">
                        Read the field note
                      </p>
                    </div>
                  </Link>
                )}

                {articles.length > 0 && (
                  <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/blog/${article.slug}`}
                        className="group flex min-h-full flex-col overflow-hidden border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-indigo-300/35 hover:bg-white/[0.055]"
                      >
                        <CoverFrame article={article} />
                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-5 flex items-start justify-between gap-4">
                            <TagList tags={article.tags} />
                            <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                              {formatDate(article.created_at)}
                            </p>
                          </div>
                          <h2 className="font-[var(--font-barlow-condensed)] text-3xl font-black uppercase leading-none tracking-[0.03em] text-white transition group-hover:text-amber-100">
                            {article.meta_title}
                          </h2>
                          <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-400">
                            {article.meta_description}
                          </p>
                          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                            Open guide
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
