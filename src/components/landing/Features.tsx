const features = [
  {
    title: 'Profit clarity in seconds',
    description: 'Instantly see true margin after Amazon fees, VAT, and shipping so you can say yes or no fast.',
  },
  {
    title: 'Lead vault for sourcing',
    description: 'Save promising ASINs, supplier notes, and cost assumptions in one clean pipeline.',
  },
  {
    title: 'Smart fee insights',
    description: 'Surface hidden fees and dimensional weight estimates so every buy is data-backed.',
  },
  {
    title: 'Opportunity scoring',
    description: 'Compare products side-by-side and prioritize what will move the needle this month.',
  },
  {
    title: 'Live market signals',
    description: 'Track price, sales rank, and competition trends without jumping between tabs.',
  },
  {
    title: 'Seller-ready reporting',
    description: 'Share polished profit breakdowns with partners, teams, or investors in seconds.',
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Features</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Everything you need to source with confidence
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A focused toolkit for sellers who want speed, clarity, and trust at every step of sourcing.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
