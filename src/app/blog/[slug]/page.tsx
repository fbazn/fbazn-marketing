import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Header from '@/components/landing/Header'

const APP_SIGNUP_URL = 'https://app.fbazn.com/login'

function prepareMarkdown(markdown: string): string {
  const normalized = markdown.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
  return normalized.replace(/^---[\s\S]*?---\n?/, '')
}

type ActivePlanId = 'starter' | 'pro'

type ArticleRow = {
  id: string
  slug: string
  meta_title: string
  meta_description: string
  tags: string[] | null
  markdown: string
  status: string
  created_at: string
  cover_image_url: string | null
  cover_image_attribution: string | null
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
    month: 'long',
    year: 'numeric',
  })
}

function buildSignupUrl(plan: ActivePlanId) {
  const url = new URL(APP_SIGNUP_URL)
  url.searchParams.set('mode', 'signup')
  url.searchParams.set('plan', plan)
  url.searchParams.set('source', 'blog-article')
  return url.toString()
}

function TagList({ tags }: { tags: string[] | null }) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = getSupabase()

  if (!supabase) {
    return {}
  }

  const { data } = await supabase
    .from('blog_articles')
    .select('meta_title, meta_description, cover_image_url')
    .eq('slug', slug)
    .single()

  if (!data) return {}

  return {
    title: `${data.meta_title} | FBAZN Blog`,
    description: data.meta_description,
    openGraph: {
      title: data.meta_title,
      description: data.meta_description,
      type: 'article',
      ...(data.cover_image_url ? { images: [{ url: data.cover_image_url }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: data.meta_title,
      description: data.meta_description,
      ...(data.cover_image_url ? { images: [data.cover_image_url] } : {}),
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = getSupabase()

  if (!supabase) {
    notFound()
  }

  const { data: article, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!article || error) {
    notFound()
  }

  const post = article as ArticleRow
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta_title,
    description: post.meta_description,
    datePublished: post.created_at,
    url: `https://fbazn.com/blog/${post.slug}`,
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(245,158,11,0.10),transparent_28%),radial-gradient(circle_at_84%_20%,rgba(99,102,241,0.14),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.035)_1px,transparent_1px)] bg-[size:58px_58px]" />
        </div>

        <article className="relative">
          <section className="border-b border-white/10 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
            <div className="mx-auto max-w-7xl">
              <Link
                href="/blog"
                className="inline-flex border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-300 transition hover:border-amber-300/40 hover:text-amber-200"
              >
                Back to blog
              </Link>

              <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
                <div>
                  <TagList tags={post.tags} />
                  <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-amber-300">
                    Field note
                  </p>
                  <h1 className="mt-5 max-w-5xl font-[var(--font-barlow-condensed)] text-5xl font-black uppercase leading-[0.92] tracking-[0.03em] text-white sm:text-7xl lg:text-8xl">
                    {post.meta_title}
                  </h1>
                </div>
                <div className="border-l border-amber-400/25 pl-6">
                  <p className="text-lg leading-8 text-slate-300">{post.meta_description}</p>
                  <div className="mt-7 border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Published
                    </p>
                    <p className="mt-2 font-[var(--font-barlow-condensed)] text-3xl font-black uppercase text-amber-100">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <figure className="mt-12 overflow-hidden border border-white/10 bg-[#10182a]">
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.meta_title}
                    className="h-[320px] w-full object-cover opacity-90 sm:h-[460px]"
                  />
                ) : (
                  <div className="relative h-[320px] bg-[linear-gradient(135deg,rgba(245,158,11,0.18),transparent_36%),linear-gradient(rgba(99,102,241,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.11)_1px,transparent_1px)] bg-[size:auto,46px_46px,46px_46px] sm:h-[460px]">
                    <div className="absolute bottom-8 left-8">
                      <p className="font-[var(--font-barlow-condensed)] text-6xl font-black uppercase text-white/90">
                        FBAZN
                      </p>
                      <div className="mt-4 h-1 w-24 bg-amber-400" />
                    </div>
                  </div>
                )}
                {post.cover_image_attribution && (
                  <figcaption className="border-t border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs text-slate-500">
                    {post.cover_image_attribution}
                  </figcaption>
                )}
              </figure>
            </div>
          </section>

          <section className="px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
            <div className="mx-auto max-w-4xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-5 mt-12 font-[var(--font-barlow-condensed)] text-5xl font-black uppercase leading-none tracking-[0.03em] text-white">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-4 mt-10 font-[var(--font-barlow-condensed)] text-4xl font-black uppercase leading-none tracking-[0.03em] text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-3 mt-8 text-2xl font-bold text-amber-100">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="mb-3 mt-7 text-xl font-bold text-white">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-6 text-lg leading-8 text-slate-300">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-7 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-7 list-decimal space-y-2 pl-6 text-lg leading-8 text-slate-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="pl-1">{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic text-slate-200">{children}</em>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="font-semibold text-amber-200 underline decoration-amber-400/45 underline-offset-4 transition hover:text-amber-100"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-8 border-l-4 border-amber-400 bg-amber-400/10 py-4 pl-6 text-slate-200">
                      {children}
                    </blockquote>
                  ),
                  code: ({ className, children }) => {
                    const isBlock = /language-/.test(className ?? '')
                    return isBlock ? (
                      <code className={`${className ?? ''} text-sm`}>{children}</code>
                    ) : (
                      <code className="border border-white/10 bg-white/[0.07] px-1.5 py-0.5 font-mono text-sm text-amber-100">
                        {children}
                      </code>
                    )
                  },
                  pre: ({ children }) => (
                    <pre className="my-8 overflow-x-auto border border-white/10 bg-[#050814] p-5 text-sm text-slate-100">
                      {children}
                    </pre>
                  ),
                  hr: () => <hr className="my-10 border-white/10" />,
                  img: ({ src, alt }) => (
                    <img
                      src={typeof src === 'string' ? src : ''}
                      alt={alt ?? ''}
                      className="my-8 w-full border border-white/10 object-cover"
                    />
                  ),
                  table: ({ children }) => (
                    <div className="my-8 overflow-x-auto border border-white/10">
                      <table className="min-w-full divide-y divide-white/10 text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="bg-white/[0.06] px-4 py-3 text-left text-xs font-black uppercase tracking-[0.16em] text-amber-100">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border-t border-white/10 px-4 py-3 text-slate-300">
                      {children}
                    </td>
                  ),
                }}
              >
                {prepareMarkdown(post.markdown)}
              </ReactMarkdown>

              <div className="mt-16 border border-amber-400/25 bg-[linear-gradient(135deg,rgba(245,158,11,0.14),rgba(99,102,241,0.08))] p-7 text-center sm:p-10">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">
                  Put the research into motion
                </p>
                <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-5xl font-black uppercase leading-none tracking-[0.03em] text-white">
                  Build your next sourcing list in FBAZN.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-slate-300">
                  Send products into a review queue, calculate true landed profit, and keep supplier
                  context attached to the opportunities worth acting on.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href={buildSignupUrl('pro')}
                    className="border border-amber-400 bg-amber-400 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#080c18] transition hover:-translate-y-0.5 hover:bg-amber-300"
                  >
                    Start Pro trial
                  </Link>
                  <Link
                    href={buildSignupUrl('starter')}
                    className="border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:border-indigo-200/45"
                  >
                    Try Starter
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  )
}
