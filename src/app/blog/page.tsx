// src/app/blog/page.tsx
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic' // always fetch fresh

export default async function BlogPage() {
  const supabase = createClient()
  const { data: posts, error } = await supabase
    .from('rss_posts')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
    return <p className="p-6 text-red-500">Failed to load blog posts.</p>
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
      {posts && posts.length > 0 ? (
        posts.map((post: any) => (
          <article key={post.slug} className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{new Date(post.published_at).toLocaleDateString()}</p>
            <p>{post.content}</p>
            <a href={post.link} target="_blank" className="text-blue-600 underline mt-2 inline-block">Read more</a>
          </article>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </main>
  )
}
