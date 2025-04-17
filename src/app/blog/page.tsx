// src/app/blog/page.tsx
import { createClient } from '@/lib/supabase'
import Link from 'next/link'


type BlogPost = {
  slug: string
  title: string
  content: string
  link?: string
  published_at?: string
  source?: string
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const supabase = createClient()
  let posts: BlogPost[] = []

  try {
    const { data, error } = await supabase
      .from('rss_posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    posts = data ?? []
  } catch (err: any) {
    console.error('Error loading blog posts:', err.message)
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <article key={post.slug} className="mb-6 border-b pb-4">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">{post.title}</h2>
            </Link>

            <p className="text-sm text-gray-500 mb-2">
              {new Date(post.published_at || '').toLocaleDateString()}
            </p>
            <p>{post.content}</p>
            <a href={post.link} target="_blank" className="text-blue-600 underline">
              Read more
            </a>
          </article>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </main>
  )
}
