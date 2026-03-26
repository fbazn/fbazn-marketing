import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Header from '@/components/landing/Header'

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---[\s\S]*?---\n?/, '')
}

type ArticleRow = {
  id: string
  slug: string
  meta_title: string
  meta_description: string
  tags: string[]
  markdown: string
  status: string
  created_at: string
  cover_image_url: string | null
  cover_image_attribution: string | null
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data } = await getSupabase()
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

  const { data: article, error } = await getSupabase()
    .from('blog_articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!article || error) {
    notFound()
  }

  const post = article as ArticleRow

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          {/* Back */}
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
            Back to Blog
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
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
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            {post.meta_title}
          </h1>

          {/* Date */}
          <p className="mt-3 text-sm text-slate-400">
            {new Date(post.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <hr className="my-8 border-slate-100" />

          {/* Cover image */}
          {post.cover_image_url && (
            <div className="mb-10">
              <img
                src={post.cover_image_url}
                alt={post.meta_title}
                className="w-full rounded-2xl object-cover"
                style={{ maxHeight: '420px' }}
              />
              {post.cover_image_attribution && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  {post.cover_image_attribution}
                </p>
              )}
            </div>
          )}

          {/* Markdown body */}
          <div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-4 mt-10 text-3xl font-bold text-slate-900">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-3 mt-8 text-2xl font-semibold text-slate-900">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 mt-6 text-xl font-semibold text-slate-900">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="mb-2 mt-5 text-lg font-semibold text-slate-900">{children}</h4>
                ),
                p: ({ children }) => (
                  <p className="mb-5 leading-7 text-slate-700">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-5 list-disc space-y-1.5 pl-6 text-slate-700">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-5 list-decimal space-y-1.5 pl-6 text-slate-700">{children}</ol>
                ),
                li: ({ children }) => <li className="leading-7">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">{children}</strong>
                ),
                em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-teal-600 underline-offset-2 hover:underline"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-6 border-l-4 border-teal-400 pl-5 italic text-slate-600">
                    {children}
                  </blockquote>
                ),
                code: ({ className, children }) => {
                  const isBlock = /language-/.test(className ?? '')
                  return isBlock ? (
                    <code className={`${className ?? ''} text-sm`}>{children}</code>
                  ) : (
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800">
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="my-6 overflow-x-auto rounded-xl bg-slate-900 p-5 text-sm text-slate-100">
                    {children}
                  </pre>
                ),
                hr: () => <hr className="my-8 border-slate-100" />,
                table: ({ children }) => (
                  <div className="my-6 overflow-x-auto rounded-lg border border-slate-100">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-t border-slate-100 px-4 py-3 text-slate-700">{children}</td>
                ),
              }}
            >
              {stripFrontmatter(post.markdown)}
            </ReactMarkdown>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-slate-900 px-8 py-10 text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
              Ready to get started?
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Your all-in-one Amazon FBA dashboard</h2>
            <p className="mt-2 text-slate-400">
              Evaluate products, save leads, and unlock profitable sourcing.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            >
              Get started free
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
