// src/app/blog/page.tsx

import { createClient } from '@/lib/supabase'

type BlogPost = {
  slug: string
  title: string
  content: string
  link?: string | null
  published_at?: string | null
  source?: string | null
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const supabase = createClient()

  const { data: posts, error } = await supabase
    .from('rss_posts')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
    return <p className="p-6 text-red-500">Failed to load FBA news.</p>
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">FBA News</h1>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <article key={post.slug} className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-1">
              {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unknown date'}
            </p>
            {/* ✅ Snippet below */}
            <p className="text-gray-700 mb-2">
              {post.content?.slice(0, 200) || 'No preview available'}...
            </p>
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Read full article
              </a>
            )}
          </article>
        ))
      ) : (
        <p>No articles available.</p>
      )}
    </main>
  )
}
