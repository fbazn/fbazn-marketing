'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type BlogPost = {
  slug: string
  title: string
  content: string
  link?: string
  published_at?: string
  source?: string
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('rss_posts')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (error || !data) {
        setError('Post not found.')
      } else {
        setPost(data)
      }
    }

    fetchPost()
  }, [params.slug])

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>
  }

  if (!post) {
    return <p className="p-6">Loading...</p>
  }

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
