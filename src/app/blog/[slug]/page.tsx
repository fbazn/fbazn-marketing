// src/app/blog/[slug]/page.tsx

import { createClient } from '@/lib/supabase'
import { Metadata } from 'next'

type PageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Post: ${params.slug}`,
  }
}

export default async function Page({ params }: PageProps) {
  const supabase = createClient()

  const { data: post, error } = await supabase
    .from('rss_posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !post) {
    return <p className="p-6 text-red-500">Post not found.</p>
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
