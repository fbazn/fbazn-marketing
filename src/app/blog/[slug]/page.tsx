// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: post, error } = await supabase
    .from('rss_posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !post) {
    console.error('Error fetching post:', error?.message)
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(post.published_at).toLocaleDateString()}
      </p>
      <p className="mb-4">{post.content}</p>
      {post.link && (
        <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          View original post
        </a>
      )}
    </main>
  )
}
