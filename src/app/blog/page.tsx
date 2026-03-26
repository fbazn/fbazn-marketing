import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import Header from '@/components/landing/Header'

export const metadata: Metadata = {
  title: 'Blog | FBAZN — Amazon FBA Guides & Strategies',
  description:
    'Guides, tips and strategies to help UK Amazon FBA sellers find profitable products, evaluate fees, and grow their business.',
  openGraph: {
    title: 'FBAZN Blog — Amazon FBA Guides & Strategies',
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
  tags: string[]
  created_at: string
  cover_image_url: string | null
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export default async function BlogPage() {
  const supabase = getSupabase()

  const { data: articles, error } = await supabase
    .from('blog_articles')
    .select('slug, meta_title, meta_description, tags, created_at, cover_image_url')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog articles:', error.message)
  }

  const posts = (articles ?? []) as ArticlePreview[]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Page hero */}
        <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
              Resources
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">FBAZN Blog</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-500">
              Guides, strategies and tips to help UK Amazon FBA sellers find profitable products and
              grow their business.
            </p>
          </div>
        </section>

        {/* Articles grid */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            {posts.length === 0 ? (
              <p className="text-center text-slate-500">No articles yet. Check back soon.</p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md overflow-hidden"
                  >
                    {/* Cover image */}
                    {article.cover_image_url ? (
                      <div className="h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={article.cover_image_url}
                          alt={article.meta_title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-44 w-full bg-gradient-to-br from-teal-50 to-slate-100" />
                    )}

                    <div className="flex flex-1 flex-col p-6">
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-teal-700">
                      {article.meta_title}
                    </h2>

                    {/* Description */}
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
                      {article.meta_description}
                    </p>

                    {/* Date + read more */}
                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        {new Date(article.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <span className="text-xs font-medium text-teal-600 transition group-hover:underline">
                        Read more →
                      </span>
                    </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
