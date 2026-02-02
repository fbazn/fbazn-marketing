const faqs = [
  {
    question: 'Is FBAZN built for UK sellers only?',
    answer: 'FBAZN is UK-first with localized fees and VAT support, but the workflow also fits global sourcing teams.',
  },
  {
    question: 'What data does the dashboard calculate?',
    answer: 'We bring together product price, estimated fees, shipping, and VAT so you see the true net margin in one place.',
  },
  {
    question: 'Can I save leads and come back later?',
    answer: 'Yes. Save ASINs, attach supplier notes, and build a sourcing pipeline you can revisit any time.',
  },
  {
    question: 'Do you have team or multi-user access?',
    answer: 'Advanced plan users can share exports today, with full team workspaces coming with the Pro tier.',
  },
  {
    question: 'How quickly can I get started?',
    answer: 'Create your account in minutes and start evaluating products immediately. No setup required.',
  },
  {
    question: 'Can I cancel any time?',
    answer: 'Absolutely. Plans are month-to-month and you can cancel or downgrade whenever you need.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Questions, answered</h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know before you start sourcing with FBAZN.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-slate-900">
                {faq.question}
                <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-45 group-open:text-slate-600">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
