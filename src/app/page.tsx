'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold leading-tight mb-4"
        >
          Your All-in-One Amazon FBA Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xl text-gray-600 max-w-xl mb-6"
        >
          fbazn helps you source products, analyze profits, and stay on top of the latest Amazon updates — all in one sleek interface.
        </motion.p>
        <motion.a
          href="#"
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-all"
        >
          Get Started Free
        </motion.a>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why FBA Sellers Love fbazn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Smarter Sourcing',
                desc: 'Link supplier data to ASINs, track profits and ROI instantly.',
              },
              {
                title: 'Always Up-To-Date',
                desc: 'Auto-sync with Amazon updates and FBA news via RSS.',
              },
              {
                title: 'Built for Speed',
                desc: 'Clean design, fast loading, mobile-friendly — no clutter.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white shadow-md p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: '1',
                title: 'Add Supplier Data',
                desc: 'Enter potential inventory and costs. We’ll help you calculate margins and match ASINs.',
              },
              {
                step: '2',
                title: 'Link to Amazon Listings',
                desc: 'Use the ASIN link to pull in live Buy Box prices, FBA fees, and profitability insights.',
              },
              {
                step: '3',
                title: 'Track ROI & Stay Updated',
                desc: 'Monitor your product opportunities and view the latest Amazon FBA updates from our curated news feed.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center p-6 border rounded-lg shadow-sm"
              >
                <div className="text-4xl font-bold text-blue-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
