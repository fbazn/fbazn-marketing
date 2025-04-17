// app/page.tsx

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
        Powerful Tools for Amazon FBA Sellers
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-xl mb-8">
        FBAZN helps you track products, calculate profit, and source smarter with live Amazon data.
      </p>
      <a
        href="https://app.fbazn.com"
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
      >
        Launch App
      </a>
    </main>
  )
}
