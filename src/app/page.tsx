export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold">Take Control of Your Amazon FBA Profits</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          fbazn helps you source smarter, track profitability, and make confident decisions.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Join the Waitlist
        </button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 text-center">
        <FeatureCard title="Product Sourcing" description="Manage and compare supplier offers in one place." />
        <FeatureCard title="Profit Tracking" description="See ROI and fees instantly for any ASIN." />
        <FeatureCard title="Live FBA Data" description="Stay on top of Buy Box prices and Amazon charges." />
      </section>

      {/* FBA News Teaser */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-semibold">Latest FBA News</h2>
        <p className="text-gray-600">Curated updates and changelogs from Amazon and trusted FBA sources.</p>
        <a href="/fba-news" className="text-blue-600 underline">
          See the latest updates →
        </a>
      </section>

      {/* Footer / CTA */}
      <section className="text-center space-y-4">
        <h3 className="text-2xl font-medium">Launching soon</h3>
        <p className="text-gray-600">Be among the first to try fbazn.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Join the Waitlist
        </button>
      </section>
    </main>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
