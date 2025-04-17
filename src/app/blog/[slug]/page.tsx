'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function BlogPostPage() {
  const pathname = usePathname()
  const slug = pathname.split('/blog/')[1] // extract slug from URL

  const [post, setPost] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createBrowserClient()

      const { data, error } = await supabase
        .from('rss_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) setError(error.message)
      else setPost(data)
    }

    if (slug) fetchPost()
  }, [slug])

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>
  if (!post) return <p className="p-6">Loading...</p>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unknown date'}
      </p>
      <p>{post.content}</p>
      {post.link && (
        <a href={post.link} target="_blank" className="text-blue-600 underline">
          Original Source
        </a>
      )}
    </main>
  )
}
