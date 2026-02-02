const steps = [
  {
    title: 'Import your sourcing list',
    description: 'Drop in supplier SKUs or ASINs and FBAZN instantly matches live marketplace data.',
  },
  {
    title: 'See profit after fees',
    description: 'We calculate landed cost, FBA fees, and net margin so you always know the true outcome.',
  },
  {
    title: 'Save and prioritize',
    description: 'Tag winners, save leads, and build a pipeline of high-margin opportunities to revisit later.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">A faster sourcing workflow</h2>
          <p className="mt-4 text-lg text-slate-600">
            From list to insight to action, every step is designed to keep your sourcing momentum high.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-600">
                0{index + 1}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
