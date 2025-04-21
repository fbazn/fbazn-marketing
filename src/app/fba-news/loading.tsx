// src/app/fba-news/loading.tsx
export default function LoadingFbaNews() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">FBA News</h1>
      {Array.from({ length: 3 }).map((_, i) => (
        <article key={i} className="mb-6 border-b pb-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-2" />
        </article>
      ))}
    </main>
  )
}
