// src/app/blog/page.tsx

type RssPost = {
  title: string
  link: string
  published_at: string
  source?: string
}

import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const supabase = createClient()
  const { data: posts, error } = await supabase
    .from('rss_posts')
    .select('title, link, published_at, source')
    .order('published_at', { ascending: false })

  if (error) {
    console.error(error)
    return <p className="p-6 text-red-500">Error loading news.</p>
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">FBA News</h1>
      <ul className="space-y-4">
        {posts?.map(post => (
          <li key={post.link}>
            <a
              href={post.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-blue-600 hover:underline"
            >
              {post.title}
            </a>
            <p className="text-sm text-gray-500">
              {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unknown date'}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
