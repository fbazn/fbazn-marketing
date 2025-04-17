// app/blog/page.tsx
import supabase from '@/lib/supabase'

export const dynamic = 'force-dynamic' // ensure this is always fresh

export default async function BlogPage() {
  const { data: posts, error } = await supabase
    .from('rss_posts')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Error loading posts: {error.message}</div>
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
      {posts?.length === 0 && <p>No posts available.</p>}
      <ul className="space-y-6">
        {posts?.map(post => (
          <li key={post.slug} className="border-b pb-4">
            <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-blue-600 hover:underline">
              {post.title}
            </a>
            <p className="text-sm text-gray-600">{new Date(post.published_at).toLocaleDateString()}</p>
            <p className="text-gray-700 mt-2">{post.content}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
