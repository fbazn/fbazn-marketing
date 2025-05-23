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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "FBA News",
    description: "Latest news and updates relevant to Amazon FBA sellers.",
    url: "https://fbazn.com/fba-news"
  }

  return (
    <><script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center">📦 FBA News</h1>
        <div className="grid gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {post.source || 'Source Unknown'}
                </p>
                {post.published_at && (
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
                <div className="relative group max-h-[100px] overflow-hidden mb-4 transition-max-h duration-500 ease-in-out hover:max-h-[500px]">
                  <p className="text-gray-700 mb-4 line-clamp-3 transition-all duration-300 ease-in-out hover:line-clamp-none">
                    {post.content?.slice(0, 200) || 'No preview available'}...
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                </div>
                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-blue-600 font-medium hover:underline"
                  >
                    🔗 Read full article
                  </a>
                )}

              </article>
            ))
          ) : (
            <p className="text-center text-gray-500">No articles available.</p>
          )}
        </div>
      </main></>
  )
}
